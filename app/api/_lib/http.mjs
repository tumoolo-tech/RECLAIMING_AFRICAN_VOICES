// The guards every proxy route runs before it spends a paid key (issue #43).
//
// The keys used to be EXPO_PUBLIC_* and compiled into the web bundle, so anyone could lift them from
// the browser. They now live only in the server's environment. That moves the question from "who can
// read the key" to "who can make us spend it", and these guards answer it:
//
//   • ORIGIN — a browser on another site may not use our quota. Requests with no Origin (the native
//     app, curl) are let through: an Origin header is trivially forged outside a browser, so pretending
//     it stops a script would be a lie. It stops other websites, nothing more.
//   • RATE LIMIT — per client IP, plus a global cap per instance. This is the guard that stops a
//     script. It is in memory, so it is per warm instance and resets on a cold start; a determined
//     attacker spreading requests across instances gets more than the limit. Upgrading to a shared
//     store (Upstash / a Supabase table) is the next step if that is ever seen in practice.
//   • SIZE — the body is capped before it is parsed, and each route caps its own fields.
//
// Files under api/_lib are not deployed as functions (Vercel skips `_`-prefixed paths).

/** A fixed-window counter keyed on anything (an IP, or "*" for a global cap). */
export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = 20_000 }) {
  const hits = new Map();
  return {
    /** Count one request for `key`. `ok:false` means refuse it, and `retryAfter` says for how long (s). */
    take(key) {
      const t = now();
      let e = hits.get(key);
      if (!e || t - e.start >= windowMs) {
        if (hits.size >= maxKeys) {
          for (const [k, v] of hits) if (t - v.start >= windowMs) hits.delete(k);
          // Still full of live windows: a flood of distinct keys. Forget them rather than grow without
          // bound — the global limiter still caps what that flood can spend.
          if (hits.size >= maxKeys) hits.clear();
        }
        e = { start: t, count: 0 };
        hits.set(key, e);
      }
      e.count++;
      if (e.count > limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((e.start + windowMs - t) / 1000)) };
      return { ok: true, retryAfter: 0 };
    },
    /** How many keys are tracked (for tests). */
    get size() {
      return hits.size;
    },
  };
}

/** The caller's IP. Vercel sets x-real-ip / x-forwarded-for itself and overwrites a client's copy. */
export function clientIp(request) {
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

/** ALLOWED_ORIGINS="https://a.example,http://localhost:8081" -> ["https://a.example", ...] */
export function parseAllowedOrigins(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/**
 * Same-origin requests pass. A cross-origin browser request passes only if its origin is listed, and
 * then gets CORS headers naming it. No Origin at all (native app, server) passes — see the header.
 */
export function checkOrigin(request, allowed) {
  const origin = request.headers.get("origin");
  if (!origin) return { ok: true, allowOrigin: null };
  let host;
  try {
    host = new URL(origin).host;
  } catch {
    return { ok: false, allowOrigin: null };
  }
  const self = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (self && host === self) return { ok: true, allowOrigin: null };
  if (allowed.includes(origin.replace(/\/+$/, ""))) return { ok: true, allowOrigin: origin };
  return { ok: false, allowOrigin: null };
}

function corsHeaders(allowOrigin) {
  if (!allowOrigin) return {};
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

export function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extraHeaders },
  });
}

/** Read a JSON body, refusing anything over `maxBytes` before and after reading it. */
export async function readJson(request, maxBytes) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return { error: 413 };
  let text;
  try {
    text = await request.text();
  } catch {
    return { error: 400 };
  }
  if (new TextEncoder().encode(text).length > maxBytes) return { error: 413 };
  try {
    return { body: JSON.parse(text) };
  } catch {
    return { error: 400 };
  }
}

/**
 * Run every guard for a POST route. Returns `{ response }` when the request is refused (or is a
 * preflight), else `{ body, cors }` — the parsed body and the CORS headers to put on the reply.
 */
export async function guardPost(request, { perIp, global, maxBytes, env = process.env }) {
  const origin = checkOrigin(request, parseAllowedOrigins(env.ALLOWED_ORIGINS));
  if (!origin.ok) return { response: json(403, { error: "origin not allowed" }) };
  const cors = corsHeaders(origin.allowOrigin);

  if (request.method === "OPTIONS") return { response: new Response(null, { status: 204, headers: cors }) };
  if (request.method !== "POST") return { response: json(405, { error: "method not allowed" }, cors) };

  for (const limited of [perIp.take(clientIp(request)), global.take("*")]) {
    if (!limited.ok) {
      return { response: json(429, { error: "rate limited" }, { ...cors, "Retry-After": String(limited.retryAfter) }) };
    }
  }

  const read = await readJson(request, maxBytes);
  if (read.error) return { response: json(read.error, { error: read.error === 413 ? "body too large" : "bad JSON" }, cors) };
  return { body: read.body, cors };
}

/** Allow the same origin check on a GET route (no body, no rate-limited spend). */
export function guardGet(request, env = process.env) {
  const origin = checkOrigin(request, parseAllowedOrigins(env.ALLOWED_ORIGINS));
  if (!origin.ok) return { response: json(403, { error: "origin not allowed" }) };
  const cors = corsHeaders(origin.allowOrigin);
  if (request.method === "OPTIONS") return { response: new Response(null, { status: 204, headers: cors }) };
  return { cors };
}
