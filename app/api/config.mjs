// GET /api/config  ->  { elevenlabs, elevenlabsVoice, botlhale, chat }
//
// What this deployment's proxy can do, so the client can pick the right rung and show the right hint
// ("AI voice" vs "device voice", the chatbot's offline note) without holding a key itself. Booleans and
// a public voice id only — never a secret. No proxy at all (local `expo start`) means this request
// fails, and the client treats that as "nothing configured".

import { guardGet, json } from "./_lib/http.mjs";
import { ttsConfig } from "./_lib/tts.mjs";
import { chatConfigured } from "./_lib/chat.mjs";

export function configFor(env) {
  const tts = ttsConfig(env);
  return {
    elevenlabs: tts.elevenlabs,
    elevenlabsVoice: tts.elevenlabs ? tts.elevenlabsVoice : null,
    botlhale: tts.botlhale,
    chat: chatConfigured(env),
  };
}

export async function GET(request) {
  const g = guardGet(request);
  if (g.response) return g.response;
  return json(200, configFor(process.env), { ...g.cors, "Cache-Control": "public, max-age=300" });
}

export async function OPTIONS(request) {
  return guardGet(request).response ?? new Response(null, { status: 204 });
}
