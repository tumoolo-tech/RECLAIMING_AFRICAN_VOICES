#!/usr/bin/env node
// Run the /api proxy locally (issue #43) — the same app/api/*.mjs handlers Vercel deploys, on plain
// Node, reading the server-only keys from app/.env. `expo start` does not serve /api, so without this
// a dev build has no proxy and behaves like a keyless one (device voice, retrieval answers).
//
//   npm run api:dev                       # http://localhost:8787
//   EXPO_PUBLIC_API_BASE_URL=http://localhost:8787   (in app/.env, then restart `expo start`)
//
// ALLOWED_ORIGINS defaults to the Expo web dev server so the browser may call across ports.

import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(here, "../.env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
process.env.ALLOWED_ORIGINS ||= "http://localhost:8081,http://127.0.0.1:8081";

const PORT = Number(process.env.API_DEV_PORT || 8787);
const ROUTES = new Set(["config", "tts", "chat"]);

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const name = url.pathname.match(/^\/api\/([\w-]+)\/?$/)?.[1];
  if (!name || !ROUTES.has(name)) {
    res.writeHead(404, { "Content-Type": "application/json" }).end('{"error":"not found"}');
    return;
  }
  const mod = await import(pathToFileURL(resolve(here, `../api/${name}.mjs`)).href);
  const method = req.method || "GET";
  const handler = mod[method];
  if (typeof handler !== "function") {
    res.writeHead(405, { "Content-Type": "application/json" }).end('{"error":"method not allowed"}');
    return;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
  // What Vercel's edge would set: the caller's address, for the per-IP rate limit.
  headers.set("x-real-ip", req.socket.remoteAddress || "unknown");
  const request = new Request(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks),
  });
  try {
    const response = await handler(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    console.error(`[api-dev] ${name}:`, e);
    res.writeHead(500, { "Content-Type": "application/json" }).end('{"error":"handler crashed"}');
  }
}).listen(PORT, () => {
  const on = (k) => (process.env[k] ? "set" : "—");
  console.log(`api-dev: http://localhost:${PORT}/api/{config,tts,chat}`);
  console.log(
    `  ELEVENLABS_API_KEY ${on("ELEVENLABS_API_KEY")} · BOTLHALE ${process.env.BOTLHALE_REFRESH_TOKEN || process.env.BOTLHALE_API_KEY ? "set" : "—"} · ` +
      `ANTHROPIC_API_KEY ${on("ANTHROPIC_API_KEY")} · GEMINI_API_KEY ${on("GEMINI_API_KEY")}`
  );
});
