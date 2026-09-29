// Provider selection — pure, dependency-free (unit-tested under `node --test`).
//
// Which engine voices a passage is a LANGUAGE question, not a preference. Each provider is chosen
// where it is actually the best available voice for that language, and never where it is not:
//
//   ElevenLabs  English, Afrikaans — the only two of our eleven its models list (verified against
//               GET /v1/models, 30 Aug 2026; see LanguageMeta.elevenlabs). Best-sounding voice we
//               have, and the account carries four South African English voices. ALSO SETSWANA, by
//               decision (SP-117): Tumo chose ElevenLabs first for it, knowing ElevenLabs does not
//               list it and may mispronounce it (`LanguageMeta.elevenlabsByDecision`).
//   Botlhale    the indigenous languages its TTS lists (BOTLHALE_TTS_LANGS) — seven of our nine. The
//               first choice for six of them; second for Setswana, where it catches an ElevenLabs
//               failure (not configured, quota, network).
//   device      always available, free, offline, quota-free. The floor: the Listen button works with
//               no keys at all, which is what makes it work in the demo and on a cheap phone.
//
// The order is deliberately NOT "best engine first". Routing an indigenous language to ElevenLabs
// because it sounds nicer would put confident mispronunciation in a child's ear as if it were
// authoritative — the harm AGENTS.md §4 exists to prevent, and the same reason docs/14 blocks
// challenge format F4. Setswana is the one recorded exception, and the owner's call (SP-117).

import { elevenLabsVoices, type LangCode } from "../../i18n/languages.ts";

export type TtsProviderId = "elevenlabs" | "botlhale" | "device";

/** The languages Botlhale's TTS reference lists (docs-apis.botlhale.xyz, read 2026-09-24): English,
 *  Afrikaans and seven indigenous languages. NOT siSwati or isiNdebele — asking for those would
 *  cost a round trip to be refused, so they go straight to the device voice, and the book says so. */
export const BOTLHALE_TTS_LANGS: ReadonlySet<LangCode> = new Set<LangCode>(["en", "af", "tn", "zu", "xh", "nso", "st", "ts", "ve"]);
const botlhaleSpeaks = (opts: { lang: LangCode; hasBotlhale: boolean }) =>
  opts.hasBotlhale && BOTLHALE_TTS_LANGS.has(opts.lang);

// `hasElevenLabs` / `hasBotlhale`: the /api/tts proxy reports that engine as configured (issue #43 —
// the keys live server-side now; the client only knows whether a voice is on offer).
export function chooseProvider(opts: {
  lang: LangCode;
  hasElevenLabs: boolean;
  hasBotlhale: boolean;
}): TtsProviderId {
  if (opts.hasElevenLabs && elevenLabsVoices(opts.lang)) return "elevenlabs";
  if (botlhaleSpeaks(opts)) return "botlhale";
  return "device";
}

/**
 * The engines to try, in order, for one language. `chooseProvider` names the first; this is the
 * whole ladder, so a 429 or a dead network falls through to the next rather than dead-ending.
 *
 * "device" is always last and always present — the Listen button must never have nothing to try.
 */
export function providerLadder(opts: {
  lang: LangCode;
  hasElevenLabs: boolean;
  hasBotlhale: boolean;
}): TtsProviderId[] {
  const ladder: TtsProviderId[] = [];
  if (opts.hasElevenLabs && elevenLabsVoices(opts.lang)) ladder.push("elevenlabs");
  if (botlhaleSpeaks(opts)) ladder.push("botlhale");
  ladder.push("device");
  return ladder;
}
