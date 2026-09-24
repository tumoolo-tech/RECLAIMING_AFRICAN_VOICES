// The two remote narration voices, called from the server so their keys never reach a browser
// (issue #43). These contracts used to live in src/services/tts/{elevenlabs,botlhale}.ts; they moved
// here with the keys, and the client now only talks to /api/tts.
//
// ElevenLabs — contract confirmed against the live API on 30 Aug 2026 (key validated, audio returned):
//   POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_22050_32
//   headers: xi-api-key: <key>, Content-Type: application/json
//   body:    { text, model_id, language_code }
//   200 -> raw MP3 BYTES
//
// Botlhale — contract from docs-apis.botlhale.xyz, re-read 2026-09-24 (SP-116):
//   POST https://api.botlhale.xyz/tts  (form-encoded)  Authorization: Bearer <IdToken>
//   body:  text=<text>&text_msg=<text>&language_code=<xx-ZA>
//   200 -> JSON { audio_url, ... }
//   The reference table says `text`, the examples say `text_msg` — both are sent. An account's
//   refresh_token never expires; POST /auth/generate trades it for a day-long IdToken.
//   Tshivenda is written "vr-ZA" in their table; we send "ve-ZA" [VERIFY with the Botlhale contact].
//
// TWO THINGS THIS FILE REFUSES TO DO, both deliberate, both carried over unchanged:
//
// 1. IT WILL NOT SEND AN INDIGENOUS LANGUAGE TO ELEVENLABS. GET /v1/models lists English and
//    Afrikaans of our eleven. The API does not reject other text — it returns fluent, confident, wrong
//    pronunciation, the harm AGENTS.md §4 exists to prevent. The client's selector keeps those
//    languages off the ElevenLabs rung; this is the lock that holds even against a hand-made request.
// 2. IT WILL NOT SILENTLY BURN THE QUOTA. Starter tier = 40 000 characters a month; one passage is
//    ~800. There is a hard per-request ceiling here, a rate limit in front of it (./http.mjs), and the
//    client caches every clip so the same passage is only ever paid for once.
//
// Pure builders (unit-tested, no I/O) + thin async edges that throw on any failure.

/** Amara — Warm African-British, chosen with Tumo on 30 Aug 2026 from the account's four SA voices. */
export const DEFAULT_VOICE_ID = "fFAtoTPtP0TtMyhbR3L9";

/** 32 kbps mono MP3 — PWA-06: a passage is ~220 KB instead of ~950 KB at 128 kbps. */
export const OUTPUT_FORMAT = "mp3_22050_32";

/** A single request may not exceed this. A guard against a caller looping the whole library. */
export const MAX_CHARS_PER_REQUEST = 2500;

/** App language code -> ElevenLabs language id + model. Afrikaans exists only in the v3 family.
 *  Must match `LanguageMeta.elevenlabs` in src/i18n/languages.ts (a test holds them together). */
export const ELEVENLABS_LANGS = {
  en: { code: "en", model: "eleven_multilingual_v2" },
  af: { code: "af", model: "eleven_v3" },
};

/** App language code -> Botlhale language_code, for the languages Botlhale's TTS lists. NOT siSwati
 *  or isiNdebele. Must match BOTLHALE_TTS_LANGS + `LanguageMeta.botlhale` (a test holds them together). */
export const BOTLHALE_LANGS = {
  en: "en-ZA",
  af: "af-ZA",
  tn: "tn-ZA",
  zu: "zu-ZA",
  xh: "xh-ZA",
  nso: "nso-ZA",
  st: "st-ZA",
  ts: "ts-ZA",
  ve: "ve-ZA",
};

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
const BOTLHALE_BASE_URL = "https://api.botlhale.xyz";
const trimBase = (url, fallback) => (url || fallback).replace(/\/+$/, "");

/** Pure: which model voices this language, or null if ElevenLabs does not speak it at all. */
export function modelFor(lang) {
  return Object.hasOwn(ELEVENLABS_LANGS, lang) ? ELEVENLABS_LANGS[lang].model : null;
}

/** Pure: why a synthesis request must not be made, or null if it may. */
export function refuseReason({ provider, lang, text }) {
  if (typeof text !== "string" || !text.trim()) return "empty text";
  const trimmed = text.trim();
  if (trimmed.length > MAX_CHARS_PER_REQUEST) {
    return `text is ${trimmed.length} characters, over the ${MAX_CHARS_PER_REQUEST} limit`;
  }
  if (provider === "elevenlabs") {
    if (!modelFor(lang)) return `ElevenLabs does not speak ${lang} — it would mispronounce it confidently`;
    return null;
  }
  if (provider === "botlhale") {
    if (!Object.hasOwn(BOTLHALE_LANGS, lang)) return `Botlhale does not list ${lang} for speech`;
    return null;
  }
  return "unknown provider";
}

/** Pure: the ElevenLabs synthesis request. The key travels in a header, never in the URL. */
export function buildElevenLabsTtsRequest({ text, languageCode, modelId, apiKey, voiceId, baseUrl }) {
  const voice = voiceId || DEFAULT_VOICE_ID;
  return {
    url: `${trimBase(baseUrl, ELEVENLABS_BASE_URL)}/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=${OUTPUT_FORMAT}`,
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({ text, model_id: modelId, language_code: languageCode }),
  };
}

/** Pure: the Botlhale synthesis request (form-encoded, both field names — see the header). */
export function buildBotlhaleTtsRequest({ text, languageCode, apiKey, baseUrl }) {
  const form = new URLSearchParams();
  form.set("text", text);
  form.set("text_msg", text);
  form.set("language_code", languageCode);
  return {
    url: `${trimBase(baseUrl, BOTLHALE_BASE_URL)}/tts`,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${apiKey}` },
    body: form.toString(),
  };
}

/** Pure: the request that trades a long-lived refresh token for a day-long Bearer IdToken. */
export function buildBotlhaleTokenRequest({ refreshToken, baseUrl }) {
  const form = new URLSearchParams();
  form.set("refresh_token", refreshToken);
  return {
    url: `${trimBase(baseUrl, BOTLHALE_BASE_URL)}/auth/generate`,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  };
}

/** Pure: the IdToken and its lifetime (s) from /auth/generate, or null. The IdToken is the Bearer —
 *  never the AccessToken. */
export function idTokenFromResponse(json) {
  if (!json || typeof json !== "object") return null;
  const r = json.AuthenticationResult;
  const idToken = r?.IdToken;
  if (typeof idToken !== "string" || idToken.length === 0) return null;
  const n = Number(r?.ExpiresIn);
  return { idToken, expiresIn: Number.isFinite(n) && n > 0 ? n : 3600 };
}

/** Pure: a remote audio URL, or inline base64 audio as { base64, mime }, from a Botlhale reply. */
export function audioFromBotlhaleResponse(json) {
  if (!json || typeof json !== "object") return null;
  const url = json.audioUrl ?? json.audio_url ?? json.url;
  if (typeof url === "string" && url.length > 0) {
    if (url.startsWith("data:")) return dataUriToAudio(url);
    return { url };
  }
  const b64 = json.audioContent ?? json.audio_content ?? json.audio;
  if (typeof b64 === "string" && b64.length > 0) {
    return b64.startsWith("data:") ? dataUriToAudio(b64) : { base64: b64, mime: "audio/mpeg" };
  }
  return null;
}

function dataUriToAudio(uri) {
  const m = /^data:([^;,]+)?(?:;base64)?,(.*)$/s.exec(uri);
  return m ? { base64: m[2], mime: m[1] || "audio/mpeg" } : null;
}

/** Which remote voices this server can offer, from its environment. Never returns a secret. */
export function ttsConfig(env) {
  return {
    elevenlabs: !!env.ELEVENLABS_API_KEY,
    elevenlabsVoice: env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID,
    botlhale: !!(env.BOTLHALE_REFRESH_TOKEN || env.BOTLHALE_API_KEY),
  };
}

// The exchanged Botlhale token, kept in this instance's memory, refreshed five minutes early.
let bearer = null;

async function botlhaleBearer(env, fetchFn) {
  const refreshToken = env.BOTLHALE_REFRESH_TOKEN;
  if (refreshToken) {
    const now = Date.now();
    if (bearer && bearer.from === refreshToken && now < bearer.until) return bearer.token;
    const req = buildBotlhaleTokenRequest({ refreshToken, baseUrl: env.BOTLHALE_BASE_URL });
    const res = await fetchFn(req.url, { method: req.method, headers: req.headers, body: req.body });
    if (!res.ok) throw new Error(`Botlhale auth ${res.status}`);
    const got = idTokenFromResponse(await res.json());
    if (!got) throw new Error("Botlhale auth: no IdToken in response");
    bearer = { token: got.idToken, until: now + Math.max(60, got.expiresIn - 300) * 1000, from: refreshToken };
    return got.idToken;
  }
  if (env.BOTLHALE_API_KEY) return env.BOTLHALE_API_KEY;
  throw new Error("Botlhale: no credential configured");
}

/**
 * Synthesise `text` with `provider` and return the audio bytes. Throws on any failure (the route turns
 * that into a 502, and the client falls to the next rung). Call `refuseReason` first.
 */
export async function synthesize({ provider, lang, text }, env, fetchFn = fetch) {
  const clean = text.trim();
  if (provider === "elevenlabs") {
    if (!env.ELEVENLABS_API_KEY) throw new Error("ElevenLabs: not configured");
    const req = buildElevenLabsTtsRequest({
      text: clean,
      languageCode: ELEVENLABS_LANGS[lang].code,
      modelId: ELEVENLABS_LANGS[lang].model,
      apiKey: env.ELEVENLABS_API_KEY,
      voiceId: env.ELEVENLABS_VOICE_ID,
    });
    const res = await fetchFn(req.url, { method: req.method, headers: req.headers, body: req.body });
    // 401 bad key · 422 bad voice/model · 429 quota exhausted.
    if (!res.ok) throw new Error(`ElevenLabs TTS ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength === 0) throw new Error("ElevenLabs TTS: empty audio");
    return { bytes, mime: "audio/mpeg" };
  }

  const token = await botlhaleBearer(env, fetchFn);
  const req = buildBotlhaleTtsRequest({ text: clean, languageCode: BOTLHALE_LANGS[lang], apiKey: token, baseUrl: env.BOTLHALE_BASE_URL });
  const res = await fetchFn(req.url, { method: req.method, headers: req.headers, body: req.body });
  if (!res.ok) throw new Error(`Botlhale TTS ${res.status}`);
  const audio = audioFromBotlhaleResponse(await res.json());
  if (!audio) throw new Error("Botlhale TTS: no audio in response");
  if (audio.base64) return { bytes: Uint8Array.from(Buffer.from(audio.base64, "base64")), mime: audio.mime };
  // Botlhale answers with a URL. Fetch it here, server-side: no browser CORS in the way, and the
  // client gets bytes it can cache, so the same passage never costs Botlhale twice.
  const clip = await fetchFn(audio.url);
  if (!clip.ok) throw new Error(`Botlhale audio ${clip.status}`);
  const mime = clip.headers.get("content-type")?.split(";")[0] || "audio/wav";
  return { bytes: new Uint8Array(await clip.arrayBuffer()), mime };
}
