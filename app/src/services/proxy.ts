// The client side of the key proxy (issue #43). The app holds NO paid key: narration and the chatbot's
// LLM replies go through our own /api routes (app/api/*.mjs), which hold the keys server-side.
//
// Where the proxy lives:
//   • Web: same origin (`/api/...`) — the site and the functions deploy together on Vercel.
//   • Native, or web pointed elsewhere: EXPO_PUBLIC_API_BASE_URL, e.g. https://<the deployed site>.
//     That is a URL, not a secret — safe to bundle.
//   • Native with no base URL: no proxy.
//
// No proxy, or one that fails, is not an error state. Every caller already has a floor that needs no
// key — on-device speech, the retrieval answer — and falls to it exactly as it did before when a key
// was missing. Local `expo start` has no /api, so it behaves like a keyless build.

export type ProxyConfig = {
  /** ElevenLabs is configured server-side (English + Afrikaans narration). */
  elevenlabs: boolean;
  /** The voice it uses — part of the narration cache key, so a voice change is a new clip. */
  elevenlabsVoice: string | null;
  /** Botlhale is configured server-side (indigenous-language narration). */
  botlhale: boolean;
  /** An LLM (Claude or Gemini) is configured for the chatbot. */
  chat: boolean;
};

export const NO_PROXY: ProxyConfig = { elevenlabs: false, elevenlabsVoice: null, botlhale: false, chat: false };

const BASE = (process.env.EXPO_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

/** Pure: the URL for an /api route, or null when there is nowhere to send it. */
export function apiUrl(path: string, opts: { base?: string; isWeb?: boolean } = {}): string | null {
  const base = opts.base ?? BASE;
  const isWeb = opts.isWeb ?? typeof document !== "undefined";
  if (base) return `${base}/api/${path}`;
  return isWeb ? `/api/${path}` : null;
}

/** Pure: read /api/config defensively — anything unexpected counts as "not configured". */
export function parseProxyConfig(json: unknown): ProxyConfig {
  if (!json || typeof json !== "object") return NO_PROXY;
  const j = json as Record<string, unknown>;
  const elevenlabs = j.elevenlabs === true;
  return {
    elevenlabs,
    elevenlabsVoice: elevenlabs && typeof j.elevenlabsVoice === "string" && j.elevenlabsVoice ? j.elevenlabsVoice : null,
    botlhale: j.botlhale === true,
    chat: j.chat === true,
  };
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// One lookup per session. A success is kept; a failure (offline, no proxy) is retried after a minute,
// so a reader who comes back online gets the AI voice without reloading.
let cached: { config: ProxyConfig; at: number; ok: boolean } | null = null;
let inflight: Promise<ProxyConfig> | null = null;

/** What the proxy offers. Never throws; resolves to NO_PROXY when there is no working proxy. */
export function getProxyConfig(): Promise<ProxyConfig> {
  if (cached && (cached.ok || Date.now() - cached.at < 60_000)) return Promise.resolve(cached.config);
  if (inflight) return inflight;
  const url = apiUrl("config");
  if (!url) {
    cached = { config: NO_PROXY, at: Date.now(), ok: true };
    return Promise.resolve(NO_PROXY);
  }
  inflight = (async () => {
    try {
      const res = await fetchWithTimeout(url, { method: "GET" }, 5000);
      // A dev server answers /api/config with the app's HTML page — not JSON, so not a proxy.
      if (!res.ok || !(res.headers.get("content-type") || "").includes("application/json")) throw new Error(String(res.status));
      const config = parseProxyConfig(await res.json());
      cached = { config, at: Date.now(), ok: true };
      return config;
    } catch {
      cached = { config: NO_PROXY, at: Date.now(), ok: false };
      return NO_PROXY;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** POST JSON to an /api route. Throws on no proxy, a timeout, or any non-2xx — callers fall back. */
export async function postProxy(path: string, body: unknown, timeoutMs = 30_000): Promise<Response> {
  const url = apiUrl(path);
  if (!url) throw new Error("no proxy configured");
  const res = await fetchWithTimeout(
    url,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    timeoutMs
  );
  if (!res.ok) throw new Error(`/api/${path} ${res.status}`);
  return res;
}
