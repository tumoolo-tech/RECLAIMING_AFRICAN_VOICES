# 02 — Tech Stack (locked)

Every choice optimises for: **(a)** one solo builder, **(b)** ~10 days, **(c)** zero monthly cost
(free tier only), **(d)** the rubric (accessibility + sustainability reward exactly these choices).

| Layer | Choice | Why | Free-tier reality |
|-------|--------|-----|-------------------|
| App framework | **Expo / React Native** | One TS codebase → web + Android + iOS. No separate builds. | Free, open source |
| Styling | ~~NativeWind~~ → **`StyleSheet` + `src/theme/tokens.ts`** | *Not adopted.* NativeWind was planned (T006) and never wired; every screen uses React Native `StyleSheet` with the shared theme tokens and the `src/ui` kit. | — |
| Animation | ~~Lottie~~ → **`Animated` + `src/components/Motion.tsx`** | *Not adopted.* Fades, Ken Burns and the walker are plain `Animated`; no Lottie dependency exists. | — |
| Image generation | **Pollinations.ai** | Cinematic images from a URL — **no key, no SDK, no backend**. The visual differentiator. | Free; IP rate-limited → cache |
| Narrative AI | **Google Gemini Flash** | Child/Adult tone adaptation + image-prompt enrichment. Generous free tier. | ~15 req/min, 1M tok/min (Flash) |
| Narration (Listen) | **ElevenLabs** — *English and Afrikaans only* | The Reader's Listen button, at runtime, for the two languages it can actually speak (verified against `GET /v1/models`, 30 Aug 2026). Botlhale for the nine indigenous languages; on-device speech underneath. | Starter tier, 40k chars/month; every clip cached (IndexedDB) so a passage is paid for once. **Key is bundled to the client — issue #43** |
| Indigenous voice | **Lelapa AI / Vulavula** | SA-language STT + translation; understands **code-switching**. Decolonised, African-built. | Trial keys; HTTP POST |
| Backend | **Supabase** | Postgres + storage + auth; Row-Level Security for POPIA. | 500MB db, 1GB files, 50k MAU, 5GB egress |
| Offline DB | ~~WatermelonDB~~ → **localStorage / IndexedDB on web; session-only on native** | *Not adopted.* Progress, recordings and the TTS cache persist in the browser (`services/*/store.web.ts`); native keeps them for the session and says so (`persists: false`). Native persistence is issue #44. | — |

## Hard rules

- **Pollinations needs no key.** Never put a backend in front of it — that defeats the point. Build the
  URL on the client, cache the result.
- **ElevenLabs is per-language and cached.** *(Rewritten 2026-09-19 — the earlier "static-only, never
  at runtime" rule was overtaken on 30 Aug 2026 by `services/tts/elevenlabs.ts`.)* It is called at
  runtime for English and Afrikaans only; the nine indigenous languages are **never** routed to it
  (`select.test.ts` pins this — it returns fluent, wrong pronunciation rather than refusing). Every
  clip is cached on text + language + voice, which is what keeps 40k characters/month alive. The
  pre-rendered intro (EL-07) is still wanted so the demo never depends on quota.
- **Cache everything generated.** Gemini Child-text and Pollinations images are cached by a stable key
  (module + scene + mode + language). Re-fetching wastes quota and data.
- **Secrets live in `app/.env`** (gitignored). `app/.env.example` documents every key. Never hardcode.

## Environment variables (`app/.env`)

The authoritative, commented list is [`app/.env.example`](../app/.env.example) — it is longer than
the four keys this section listed in June (ElevenLabs, Botlhale, Anthropic, hCaptcha have joined) and
it explains which keys are bundled to the client. This doc no longer duplicates it.

> **Hard rule (issue #43): no paid or quota-bearing key is `EXPO_PUBLIC_*`.** Those vars are bundled
> into the client and readable by anyone. Only public-by-design values go there: the Supabase anon key
> (safe *only* with Row-Level Security — see [05](05-popia-compliance.md)), the hCaptcha sitekey, and
> `EXPO_PUBLIC_API_BASE_URL`. ElevenLabs, Botlhale, Anthropic and Gemini keys are **server-only**,
> read by the key proxy in [`app/api/`](../app/api/) — Vercel functions deployed with the site, free
> tier: `/api/tts`, `/api/chat`, `/api/config`. The proxy checks the origin, rate-limits per IP (and a
> global cap per instance), caps request sizes, and keeps the ElevenLabs refusal for indigenous
> languages server-side. Without a reachable proxy the app degrades exactly as a keyless build always
> did: on-device speech, retrieval answers. `npm run api:dev` runs the same handlers locally.

## Install notes

*(As of 2026-09-19.)* Of the June list, **Supabase** and **expo-audio** (not Expo AV) landed;
**NativeWind, Lottie and WatermelonDB never did** and are struck through in the table above rather than
deleted, so the record shows what was planned and what was actually used. The
exact add commands live in [08-content-pipeline.md](08-content-pipeline.md) and the task backlog
([specs/tasks.md](../specs/tasks.md)).
