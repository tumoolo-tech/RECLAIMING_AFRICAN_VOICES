// POST /api/tts  { provider: "elevenlabs" | "botlhale", lang, text }  ->  audio bytes
//
// The narration proxy (issue #43). Keys come from the server environment only:
//   ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID?, BOTLHALE_REFRESH_TOKEN | BOTLHALE_API_KEY, BOTLHALE_BASE_URL?
// Every failure is a non-2xx, which the client reads as "try the next rung" (on-device speech last).

import { createRateLimiter, guardPost, json } from "./_lib/http.mjs";
import { refuseReason, synthesize, ttsConfig } from "./_lib/tts.mjs";

// 20 passages per IP per 10 minutes is more than a reader pressing Listen on every page; the global
// cap bounds what a spread-out script can spend per instance.
const perIp = createRateLimiter({ limit: 20, windowMs: 10 * 60_000 });
const global = createRateLimiter({ limit: 300, windowMs: 60 * 60_000 });

export async function POST(request) {
  return handle(request);
}

export async function OPTIONS(request) {
  return handle(request);
}

async function handle(request, env = process.env, fetchFn = fetch) {
  const g = await guardPost(request, { perIp, global, maxBytes: 16 * 1024, env });
  if (g.response) return g.response;
  const { provider, lang, text } = g.body ?? {};

  const refusal = refuseReason({ provider, lang, text });
  if (refusal) return json(400, { error: refusal }, g.cors);

  const config = ttsConfig(env);
  if (!config[provider]) return json(503, { error: `${provider} is not configured` }, g.cors);

  try {
    const audio = await synthesize({ provider, lang, text }, env, fetchFn);
    return new Response(audio.bytes, {
      status: 200,
      headers: { ...g.cors, "Content-Type": audio.mime, "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.warn("[api/tts]", e?.message || e);
    return json(502, { error: "upstream failed" }, g.cors);
  }
}

/** For tests: the same handler with an injected environment and fetch. */
export { handle as _handle };
