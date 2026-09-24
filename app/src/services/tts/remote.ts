// The remote narration voices (ElevenLabs, Botlhale), reached through our own /api/tts proxy.
//
// Until issue #43 the client called both services directly with EXPO_PUBLIC_* keys compiled into the
// web bundle — readable, and spendable, by anyone. The upstream contracts, the keys, and the refusal to
// send an indigenous language to ElevenLabs now live server-side in app/api/_lib/tts.mjs. This file only
// asks for a clip and turns the bytes into something the audio player and the narration cache can keep.

import type { LangCode } from "../../i18n/languages.ts";
import { postProxy } from "../proxy.ts";

/** Pure: audio bytes -> a data URI the audio player can take straight, and the cache can keep. */
export function bytesToDataUri(bytes: ArrayBuffer | Uint8Array, mime = "audio/mpeg"): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  // Chunked so a long clip cannot blow the argument limit of String.fromCharCode.
  const CHUNK = 0x8000;
  for (let i = 0; i < view.length; i += CHUNK) {
    binary += String.fromCharCode(...view.subarray(i, i + CHUNK));
  }
  const b64 =
    typeof btoa === "function"
      ? btoa(binary)
      : // eslint-disable-next-line no-undef
        Buffer.from(view).toString("base64");
  return `data:${mime};base64,${b64}`;
}

/**
 * Synthesise through the proxy and return a playable data URI, or THROW so useTts falls to the next
 * rung — no proxy, a 429, a 502, an empty clip. A caller must never get silence it mistakes for audio.
 */
export async function remoteSynthesize(opts: { provider: "elevenlabs" | "botlhale"; text: string; lang: LangCode }): Promise<string> {
  const res = await postProxy("tts", { provider: opts.provider, lang: opts.lang, text: opts.text });
  const buf = await res.arrayBuffer();
  if (!buf || buf.byteLength === 0) throw new Error(`${opts.provider} TTS: empty audio`);
  const mime = res.headers.get("content-type")?.split(";")[0] || "audio/mpeg";
  return bytesToDataUri(buf, mime);
}
