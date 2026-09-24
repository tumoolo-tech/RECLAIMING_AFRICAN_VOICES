// Botlhale AI TTS provider — real indigenous-language neural speech (incl. Setswana).
// https://botlhale.ai/apis · docs: https://docs-apis.botlhale.xyz
//
// Contract confirmed from the public docs:
//   POST https://api.botlhale.xyz/tts   (form-encoded)   Authorization: Bearer <token>
//   body:  text=<text>&text_msg=<text>&language_code=<xx-ZA>
//   200 -> JSON { audio_url, language_code, text, sampling_rate, date_received }
//
// Split in two: a PURE request builder (unit-tested under `node --test`, no I/O) and a thin
// async `botlhaleSynthesize` that performs the fetch. Any failure is thrown so the caller can
// fall back to on-device speech — the Listen button must never dead-end.
//
// Re-read against docs-apis.botlhale.xyz on 2026-09-24 (SP-116):
//   1. Field name — the reference table says `text`, the curl/python examples say `text_msg`. The
//      request sends BOTH, so whichever the server reads, it finds the passage.
//   2. Host — examples use `api-dev.botlhale.xyz`; prod is `api.botlhale.xyz`. Prod is the default;
//      EXPO_PUBLIC_BOTLHALE_BASE_URL switches it.
//   3. Auth — an account's `refresh_token` never expires; POST /auth/generate (form field
//      `refresh_token`) trades it for `AuthenticationResult.IdToken`, a Bearer token that lasts
//      `ExpiresIn` = 86400 s. The client now does that exchange itself when given a refresh token
//      (EXPO_PUBLIC_BOTLHALE_REFRESH_TOKEN), and still accepts a ready IdToken
//      (EXPO_PUBLIC_BOTLHALE_API_KEY) — which stops working after a day.
//   Languages the TTS reference lists: en, zu, xh, st, tn, nso, ve, ts, af (and sw-KE, rw-RW).
//   NOT siSwati or isiNdebele — see BOTLHALE_TTS_LANGS in select.ts. It writes Tshivenda as "vr-ZA";
//   we send "ve-ZA" [VERIFY with the Botlhale contact] — a wrong code just falls to the device voice.

import { bytesToDataUri } from "./elevenlabs.ts";

export type BotlhaleTtsRequest = {
  url: string;
  method: "POST";
  headers: Record<string, string>;
  body: string; // application/x-www-form-urlencoded
};

const DEFAULT_BASE_URL = "https://api.botlhale.xyz";

/** Pure: build the HTTP request for a TTS synthesis call. No I/O — testable. */
export function buildBotlhaleTtsRequest(opts: {
  text: string;
  languageCode: string;
  apiKey: string;
  baseUrl?: string;
}): BotlhaleTtsRequest {
  const base = (opts.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const form = new URLSearchParams();
  // Both names: the docs disagree with themselves (see the header), and an unknown form field is
  // ignored where a missing one is an error.
  form.set("text", opts.text);
  form.set("text_msg", opts.text);
  form.set("language_code", opts.languageCode);
  return {
    url: `${base}/tts`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: form.toString(),
  };
}

/** Pure: normalise whatever the API returns into a playable URI (remote URL or base64 data URI). */
export function audioUriFromResponse(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  const url = j.audioUrl ?? j.audio_url ?? j.url;
  if (typeof url === "string" && url.length > 0) return url;
  const b64 = j.audioContent ?? j.audio_content ?? j.audio;
  if (typeof b64 === "string" && b64.length > 0) {
    return b64.startsWith("data:") ? b64 : `data:audio/mp3;base64,${b64}`;
  }
  return null;
}

/** Pure: the request that trades a long-lived refresh token for a day-long Bearer IdToken. */
export function buildBotlhaleTokenRequest(opts: { refreshToken: string; baseUrl?: string }): BotlhaleTtsRequest {
  const base = (opts.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const form = new URLSearchParams();
  form.set("refresh_token", opts.refreshToken);
  return {
    url: `${base}/auth/generate`,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  };
}

/** Pure: the IdToken and its lifetime (seconds) from /auth/generate, or null if absent. */
export function idTokenFromResponse(json: unknown): { idToken: string; expiresIn: number } | null {
  if (!json || typeof json !== "object") return null;
  const r = (json as Record<string, unknown>).AuthenticationResult as Record<string, unknown> | undefined;
  const idToken = r?.IdToken;
  if (typeof idToken !== "string" || idToken.length === 0) return null;
  const n = Number(r?.ExpiresIn);
  return { idToken, expiresIn: Number.isFinite(n) && n > 0 ? n : 3600 };
}

// The exchanged token, kept in memory for the session. Refreshed five minutes before it lapses so a
// passage is never sent with a token that expires in flight. Nothing is persisted: a credential
// has no business in IndexedDB.
let bearer: { token: string; until: number; from: string } | null = null;

/** The Bearer token to send: a ready one if configured, else one exchanged from the refresh token. */
export async function botlhaleBearer(opts: { apiKey?: string; refreshToken?: string; baseUrl?: string }): Promise<string> {
  if (opts.refreshToken) {
    const now = Date.now();
    if (bearer && bearer.from === opts.refreshToken && now < bearer.until) return bearer.token;
    const req = buildBotlhaleTokenRequest({ refreshToken: opts.refreshToken, baseUrl: opts.baseUrl });
    const res = await fetch(req.url, { method: req.method, headers: req.headers, body: req.body });
    if (!res.ok) throw new Error(`Botlhale auth ${res.status}`);
    const got = idTokenFromResponse(await res.json());
    if (!got) throw new Error("Botlhale auth: no IdToken in response");
    bearer = { token: got.idToken, until: now + Math.max(60, got.expiresIn - 300) * 1000, from: opts.refreshToken };
    return got.idToken;
  }
  if (opts.apiKey) return opts.apiKey;
  throw new Error("Botlhale: no credential configured");
}

/** Async edge: call Botlhale and return a playable audio URI, or throw so the caller can fall back.
 *
 *  The response is a URL to the audio, and a URL cannot be cached — it may expire, and it needs the
 *  network again. So the audio itself is fetched and turned into a data URI, which the narration
 *  cache keeps: the same passage then costs Botlhale nothing a second time, and plays offline. If
 *  that fetch is refused (CORS on web, say) the URL is played directly and simply not cached. */
export async function botlhaleSynthesize(opts: {
  text: string;
  languageCode: string;
  apiKey?: string;
  refreshToken?: string;
  baseUrl?: string;
}): Promise<string> {
  const token = await botlhaleBearer(opts);
  const req = buildBotlhaleTtsRequest({ ...opts, apiKey: token });
  const res = await fetch(req.url, { method: req.method, headers: req.headers, body: req.body });
  if (!res.ok) throw new Error(`Botlhale TTS ${res.status}`);
  const uri = audioUriFromResponse(await res.json());
  if (!uri) throw new Error("Botlhale TTS: no audio in response");
  if (uri.startsWith("data:")) return uri;
  try {
    const audio = await fetch(uri);
    if (!audio.ok) return uri;
    const mime = audio.headers.get("content-type")?.split(";")[0] || "audio/wav";
    return bytesToDataUri(await audio.arrayBuffer(), mime);
  } catch {
    return uri;
  }
}
