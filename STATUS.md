# STATUS — Ubuntu Heritage live board

> Source of truth for "what's going on right now." Read first, update last. Treat updating it as part
> of "done." **The dated history is in [STATUS-LOG.md](STATUS-LOG.md)** (newest first). For the
> structured **implemented vs. planned** view, see
> [docs/10-status-and-roadmap.md](docs/10-status-and-roadmap.md).

_Last updated: 2026-09-19 (#51) — by Furn (via Claude). Previous update: 2026-09-19 (#34)._

> **⚠️ Open question, and it sits above everything else on this board: what happened to the
> hackathon?** All four AADHIH dates — the 9 Jul concept deadline, the 10 Jul finalist announcement,
> the 13–14 Jul orientation and the **16 Jul showcase** — are now two months past, and **this repo
> holds no record of any of them.** No log entry says the concept was submitted; none says it was
> missed. The demo video (T034), a required deliverable, was never recorded. The phase tracker below
> still carries "⬜ not started" against windows that closed in July, and that is left standing on
> purpose: it is the honest state of the record, not a claim that nothing was submitted.
> **Only Tumo can answer this**, and the answer changes what the remaining work is *for* — a
> showcase build, a post-hackathon product, or a portfolio piece. Until then the board tracks it as
> ongoing development on `main`.
>
> **Gap in the record:** nothing was committed between **2026-08-30** and **2026-09-12**, when
> PR #59 (VOICE-01–07 planning) and PR #60 (CI checks on every PR into `main`) landed. `main` is
> clean at `9d7a513`.

---

## 🎯 Current focus

| Area | Status |
|------|--------|
| Project scaffold (docs, governance, .claude) | ✅ done |
| Expo app initialized (SDK 56) + web bundle green | ✅ done |
| HomeGallery + nav across **4** grounded pillars | ✅ done |
| Cinematic Reader: Child/Adult + EN/Setswana + scene nav + back | ✅ done |
| "About the Sources" screen (credits + references + integrity note) | ✅ done |
| **Community Archive**: POPIA consent → record → list → play → delete | ✅ done — **web: durable IndexedDB (survives refresh)**; native: session (T024) |
| **Reader "Listen" (TTS)**: pluggable Botlhale AI → on-device fallback | ✅ done (device path live; Botlhale on key) |
| **All 11 SA languages**: data-driven registry + picker + TTS + honest EN fallback | ✅ framework done (EN/TSW text authored) |
| **Machine-draft translations** (Botlhale): service + draft-aware Reader + gen script | ✅ built, awaiting token+org_id to run |
| **Machine-draft translations (Claude)**: `npm run gen:claude-drafts` → 9 languages into `drafts.data.ts` | ✅ built + typecheck/bundle green, **awaiting `ANTHROPIC_API_KEY` to run** |
| **"Ask Ubuntu" chatbot**: Claude tool-use (Anthropic SDK), RAG over site content only + `navigate_to` orchestrator | ✅ built + **runs in `expo start` dev + prod** (widget wired app-wide; **chrome localized in all 11 languages** + LLM replies in the picked language; nav + site answers work key-free; full chat on `EXPO_PUBLIC_ANTHROPIC_API_KEY`). Moved off LangChain — its `langsmith` dep TDZ-crashed the Expo web dev server. |
| **Visual polish**: cinematic fonts · gradients · image fade+KenBurns · motion · branded launch | ✅ done (compiles; eyeball via `npm run web`) |
| **Cinematic hero art**: Gemini, cached local PNGs — all **7 modules** (4 literary + 3 Atlas) | ✅ done (idempotent gen; quota-safe) |
| **Submission package**: written narrative (7 modules + Heritage Ledger) · demo script · review handoff | ✅ drafted (video + Emma's review pending) |
| NativeWind wiring | ⬜ optional (T006) |
| **Reader "Listen" — ElevenLabs** for the languages it actually speaks (EN/AF), Botlhale for the nine, device underneath | ✅ built 30 Aug + **live key tested** · cached so a passage is paid for once · **nobody has listened to a clip yet (EL-05)** |
| **🎮 Know the Road — the game layer (Phase 6)** | 🟡 **2 of 10** — KTR-01 + KTR-02 done (27–30 Aug); solving now moves you *and* is worth something · plan: [docs/14-game-architecture.md](docs/14-game-architecture.md) |
| **🏗️ Architecture v2 — multi-page transformation** | 🟢 **30 of 31 tasks done (26–27 Aug)** — every room is live and the Watch page carries its provenance block; the one open task is the **V2-12 browser re-walk** · plan: [docs/13-architecture-v2-plan.md](docs/13-architecture-v2-plan.md) |
| **📚 `countries/` research** | 🟢 **54 of 54 researched — no scaffolds left.** `bw` + `bf` carry long-form reports; the other 52 are built claim-by-claim from named sources, each with Open questions. Findings: **indigenous African scripts** (Ge'ez, Vai, N'Ko), **the first African-language novel is in Sesotho (1907)**, **Sontonga's melody in 4 countries**, **Swahili should be language 12**, and **3 fixes to live `country-languages.ts` data** · [countries/README.md](countries/README.md) |
| **🔁 PR checks (CI)**: GitHub Actions runs typecheck + unit tests on every PR into `main` ([.github/workflows/pr-checks.yml](.github/workflows/pr-checks.yml)); Vercel still builds + deploys | 🟡 added 12 Sep · `main` now requires a PR (no approval) · two developers given write access · **has now run green four times** (PRs #61, #62) — still **not a required check**; make it one |
| **🧾 Audit backlog — [issue #58](https://github.com/tumoolo-tech/RECLAIMING_AFRICAN_VOICES/issues/58)** (40 issues, ordered; **South Africa first**, continental group parked 18 Sep) | 🟡 **#36 · #25 · #34 merged (#69, #71, #72) · #51 done (this branch)** — log split into STATUS-LOG.md (union-merged), product name and stack claims corrected, `npm run check:docs` in CI · week-1 next: #45 #43 #35 |
| **🧭 Heritage tourism — story → place → operator → a visit (Phase 7)** | 📋 **planned 17 Sep, 0 of 13 started.** `TOUR-01–13`, a linking layer over content that already exists — **not a new product**. Only four things genuinely don't exist: a bookable-operator model, `landmarks` as entities rather than bare strings, a story↔place relation, and link-freshness checking. **Phase 7 complete bar TOUR-10.** 49 places live · freshness script · pitch corrected. **Phase 8 started:** the content-translation gap is now measured and ratcheted. TOUR-05b blocked on the review sheet + SP-067 (coordinates). Surfaces inside **Atlas + Provinces** (no new room, D1 stands); pilot is **Soweto only**; **all decisions resolved** — 12 inherited + 57 registered, 0 open. Next action is **Tumo**: the 3 access-restricted places · ~14 `[VERIFY]` sources · 4 conflated strings · Thulamela's city · the pitch's team-size line · and `ANTHROPIC_API_KEY` if the draft pipeline (LANG-09) should run. · build plan + decision register: [docs/sim_plan.md](docs/sim_plan.md) · design: [docs/15-heritage-tourism-plan.md](docs/15-heritage-tourism-plan.md) |

---

## 🏗️ Architecture v2 — the current programme

The app is moving from **one long scrolling page** to a **site with rooms**: a persistent shell, a
browsable cinematic library, and a watch → quiz → collect loop. Full plan, task IDs and week gates in
**[docs/13-architecture-v2-plan.md](docs/13-architecture-v2-plan.md)**.

**Six decisions locked with Tumo on 2026-08-26:**

| # | Decision |
|---|----------|
| D1 | Nav = `Journey · Watch · Atlas · Archive · Kids · Schools` + country ▾ + language ▾ + Passport chip |
| D2 *(revised)* | The hero SA-road trail is the **free trailer** — it opens **in place**, exactly as before. The deeper staged `/journey` page is reached from the nav and is where future chapters get locked. |
| D3 | Country selection **moves** to a new `/countries` page — the 54 flags + national anthems move with it |
| D4 | **Keep** the current palette (black `#000000` + sa-blue `#1A85A7`); take the new designs' structure, not their gold/brown skin |
| D5 | Progress is **local-only** — no accounts, no PII. Schools ships over seeded demo data |
| D6 | The **hero section** and the **footer** are kept byte-for-byte and reused everywhere |

| Week | Window | Focus | Gate |
|------|--------|-------|------|
| **1** | 26 Aug → 1 Sep | Shell, persistent header/footer, `/countries` + anthems, Atlas hub | Every nav item lands on a real page; hero + footer visually unchanged |
| **2** | 2 Sep → 8 Sep | `/watch` library + player, `/journey` stages, quiz, heritage cards, progress store | Watch → quiz → reward completes and survives a refresh |
| **3** | 9 Sep → 15 Sep | Passport, Kids mode, Schools dashboard, i18n sweep, a11y, POPIA review | All 11 languages · no new PII · tsc + bundle + tests green |

**De-scope order if the window tightens:** Schools → Kids stage flow → quiz chapters beyond 3 → Watch search.
**Never cut:** the shell, the kept hero/footer, `/countries` + anthems, i18n, POPIA.

---

## ⏭️ Next action

> **30 Aug:** KTR-02, PWA-06 and the ElevenLabs narration voice all landed — typecheck clean,
> **179/179 tests** (up from 136), `npm run build:web` green. **V2-12 is unchanged and still the
> highest-value open item: nobody has re-walked the routes in a browser.** Three of the four things
> now waiting need a human — a pair of eyes on a layout (V2-12), a pair of ears on a narration clip
> (EL-05), and a real phone in aeroplane mode (PWA-05).

Architecture v2 is **30 of 31**. V2-07, V2-11 and V2-15 all landed on 27 Aug. **One task is still
open, and it is the one a machine cannot finish:**

- **V2-12 — the Week 1 gate.** Three of its four conditions are met and re-verified: typecheck
  clean, web bundle green, and route wiring now pinned by a test
  ([app/src/routes.test.ts](app/src/routes.test.ts)) that fails the build if a route loses its
  `case`, if the nav points at a room that does not exist, or if the chatbot cannot open one.
  **What is still not done is the part that matters: nobody has re-walked every pre-v2 route in a
  browser and looked at it.** No test in this repo can see a layout. This needs Tumo at the keyboard
  (`npm run web`), walking Home → Reader → Atlas → Provinces → Province → City → Presidents →
  President → Heroes → Hero → Totems → Days → Archive → Ledger → About, plus the new rooms, and
  confirming the **hero and the footer look exactly as they did** (D6). Until that happens V2-12
  stays unticked.

### Now building — Phase 6, Know the Road

The v2 loop looks like a game and is not one: `StageScreen.finish()` awards the card and all 50 stars
**whether or not a single answer was right**, and `recordQuiz` / `stampCountry` are tested code that
nothing calls. Decisions D7–D9 and the build order are in
[docs/14-game-architecture.md](docs/14-game-architecture.md).

- ~~**KTR-01 — solve-gated stage completion.**~~ ✅ done 27 Aug.
- ~~**KTR-02 — the first-try bonus, the streak, and the `solve` progress slice.**~~ ✅ done 30 Aug.
  `recordSolve` replaces the bare `recordQuiz` call. A question answered without a correction pays a
  bonus star; a run of cleanly-solved stages is counted, and the best run ever reached is kept
  forever. Four rules are pinned by tests: **nothing is ever taken away** · the bonus pays the
  **improvement**, once (re-walking a stage you aced pays nothing) · the run advances on a stage's
  **first** clean solve only, so re-opening one easy stage seven times cannot "earn" a streak of
  seven · **a milestone with no authored question decides nothing** — neither a win nor a break,
  which matters while 12 of the 25 have none. The `progress.test.ts` allow-list grew by exactly one
  key, `solve`, three counters, as a reviewed line of the change.
- **KTR-03 is next** — `content/challenges.ts` with the non-optional `sourceRef`, F0 (the existing
  quiz) as the first generator so the abstraction is proved against working content.

Then:

1. **Tumo's language review.** The v2 UI strings are machine-quality across the 10 non-English
   languages. The **Setswana** especially wants your eye — the nav (`shell/nav.ts`), the Kids
   greetings (`KidsScreen.tsx`), and the Passport privacy copy. **New on 27 Aug and unreviewed:**
   the Watch page's provenance labels (`WatchItemScreen.tsx` — "Sources & provenance", "Adapted
   from", "The passage behind each scene"), the new Home sections (`HomeGallery.tsx` — the Journey
   preview, the continent band, Kids/Schools) and the Archive's Trust chips (`ArchiveScreen.tsx`).
   These sit on the most integrity-sensitive surface in the app, so a wrong word costs more here
   than elsewhere. **New on 30 Aug and unreviewed:** the reward card's first-try bonus
   (`StageScreen.tsx` — `UI.bonus`), the Passport's two new counters (`PassportScreen.tsx` —
   `UI.solvedClean`, `UI.bestRun`), and the whole of the data gate (`DataGate.tsx` — "Play on
   Wi-Fi?", the size sentence, the data-saver note, "Don't ask again on this device"). The gate is
   the one place in the app that talks to someone about **money**, so its Setswana wants your eye
   more than most.
2. **Accessibility retrofit on the pre-v2 screens** — 25 unlabelled controls, listed in the
   2026-08-27 log entry. Its own task, deliberately not folded into v2.
3. **Native persistence for progress** — web persists; native is session-only and says so. Lands with
   WatermelonDB alongside the Archive's own native persistence (T024).
4. **Quiz coverage** — 14 questions across 13 of the 25 milestones. The remaining 12 need sourced
   questions before those stages feel finished.
5. **Locked chapters on `/journey`** — the free/paid split Tumo described. The hero trailer is free
   and stays free; the gating mechanism itself is not built.
6. **The voice should fit the story, and the tone should carry the emotion** — Tumo's ask on
   30 Aug, **deliberately deferred** to after the game layer. One voice (Amara) currently reads
   everything in English at default settings, so *Mhudi*'s exile chapters and a Kids heritage card
   arrive in the same register. Seven tasks, **VOICE-01–07** in [specs/tasks.md](specs/tasks.md).
   Three things there are not obvious: `narrationKey` does **not** hash the delivery settings, so two
   tones of one voice would collide and the first rendering would win forever (VOICE-04, and it must
   land first); **the nine indigenous languages cannot be given a tone at all** — Botlhale takes no
   voice parameter and ElevenLabs must never speak them (EL-03), so no mood control may appear and
   sit inert in Setswana; and a re-cast re-spends a module's clips out of 40 000 characters a month.

### The narration voice — what ElevenLabs can and cannot do (30 Aug)

Tumo's key was tested live. It works: **starter tier, 40 000 characters a month** (12 953 spent when
checked), instant voice cloning available, and **four South African English voices** already on the
account — Amara (Warm African-British), Declan (SA News), Andreas, Travis. **Amara is the chosen
narration voice.**

**The finding that shaped the wiring.** `GET /v1/models` was read and every model's language list
checked against our eleven. ElevenLabs covers **English and Afrikaans**. It does **not** cover
Setswana, isiZulu, isiXhosa, Sepedi, Sesotho, siSwati, Xitsonga, Tshivenḓa or isiNdebele — none of
them appears in any model. And it does not *refuse* text in a language it does not know; it returns
fluent, confident, wrong pronunciation. Putting that in a child's ear as the voice of Setswana
literature is precisely what [AGENTS.md §4](AGENTS.md) forbids and why
[docs/14](docs/14-game-architecture.md) blocks challenge format F4.

So the engine is chosen **per language**, and a test asserts the rule rather than trusting it:

| Language | Voice |
|---|---|
| English, Afrikaans | **ElevenLabs** (Amara) — the best voice we have, for the two it can actually speak |
| the nine indigenous languages | **Botlhale**, still the only engine that truly voices Setswana — and ElevenLabs is not even on their fallback ladder |
| anything, with no keys at all | **on-device** — free, offline, quota-free, and always the last rung so Listen never dead-ends |

Every remote clip is cached (IndexedDB on web) on text + language + voice, so one passage is paid for
once. That is not an optimisation: a passage is ~800 characters of a 40 000-character month, and
without the cache the Listen button would stop working around the 12th.

**Two things are still open, and both matter:**

- **EL-05 — nobody has listened to a clip.** No test in this repo can hear anything. The pipeline is
  verified end-to-end (real MP3 bytes, right size, right format); the *sound* is unjudged.
- **EL-06 — rotate the key after the demo.** `EXPO_PUBLIC_ELEVENLABS_API_KEY` is compiled into the
  web bundle and is readable by anyone who opens the deployed site, on a **paid** account. Same
  exposure the Anthropic chatbot key already carries. Longer term this wants a small proxy behind
  `EXPO_PUBLIC_ELEVENLABS_BASE_URL` rather than a shipped key.

### Parked (pre-v2, still open)

1. **Record the demo video** — follow the shot-by-shot script in [specs/demo-video-script.md](specs/demo-video-script.md)
   (~2:55, web target). Do one dry run of record→consent→delete first; art is cached so nothing pops
   in live on camera.
2. **Emma's review pass** — [specs/emma-review-handoff.md](specs/emma-review-handoff.md) lists exactly
   what needs your eyes, top-down: the 3 on-camera UI strings (**Reetsa** / Simolola go bala / Rekoto
   ya Boswa), the Setswana `tn` drafts across all 7 modules, and 3 cultural-accuracy questions (Atlas).
3. When keys arrive: `services/gemini.ts` (T017) · Supabase + RLS upload (T027) · Lelapa transcribe (T028).
   **Botlhale TTS:** contract now wired from their public docs — `POST api.botlhale.xyz/tts`,
   form-encoded `text_msg`+`language_code`, Bearer token, returns `audio_url`; Setswana = `tn-ZA`.
   Paste a Bearer token into `app/.env` (`EXPO_PUBLIC_BOTLHALE_API_KEY`) → Listen auto-upgrades to real
   Setswana audio. **3 residual unknowns for the contact** (marked in `botlhale.ts`): (a) field name
   `text` vs `text_msg`; (b) dev vs prod host; (c) refresh_token→IdToken flow (using a ready token for
   the demo).
4. Persistence: WatermelonDB so recordings survive reload (T024). Optional: NativeWind (T006).
5. Phase 3: ElevenLabs static intro · record the 2–3 min demo video · finalise the written narrative.

## 🗓️ Timeline

### Architecture v2 (current programme)

| Phase | What | Target window | Status |
|-------|------|---------------|--------|
| **5.1 Shell** | Persistent header/footer · route split · `/countries` + anthems · Atlas hub | 26 Aug – 1 Sep | ✅ done |
| **5.2 Core loop** | `/watch` + player · `/journey` stages · quiz · heritage cards · progress store | 2 Sep – 8 Sep | ✅ done (early) |
| **5.3 Rooms + polish** | Passport · Kids · Schools · i18n sweep · a11y · POPIA review | 9 Sep – 15 Sep | ✅ done (early) |

### Hackathon (all windows closed — outcome unrecorded)

**Every window below is in the past.** The heading used to read "(complete)", which was never true of
the last three rows and is now misleading, so it says what the table actually shows. The ⬜ marks are
**the state of this record, not a claim about what Tumo did** — see the warning at the top of this
file. "(early)" is kept where it was earned: those phases genuinely finished ahead of their window.

| Phase | What | Target window | Status |
|-------|------|---------------|--------|
| **0. Scaffold** | Governance + docs + Expo boots + 1 module renders | 29–30 Jun | ✅ done |
| **1. Story core** | 3 literary modules · cinematic Reader · Child/Adult · ST/EN toggle · gallery | 1–3 Jul | 🟡 mostly done (early) |
| **2. Community + offline** | Oral-history recorder · POPIA consent · local save · (Supabase/Lelapa stretch) | 4–6 Jul | 🟡 core done (early) |
| **3. Polish + submit** | Accessibility pass · intro narration · demo video · written narrative | 7–9 Jul | 🟡 partly done — narrative drafted, a11y partly done (25 pre-v2 controls unlabelled), **demo video never recorded** |
| **🏁 Submit concept** | Prototype + 2–3 min video + narrative | **9 Jul 16:00** (passed) | ❓ **unrecorded — needs Tumo** |
| **4. Showcase prep** | (if finalist) polish for live showcase | 13–16 Jul (passed) | ❓ **unrecorded — needs Tumo** |

## 🧱 What's built so far

- Full governance + planning scaffold: `CLAUDE.md`, `AGENTS.md`, this board, `README.md`.
- `docs/` set (plan, architecture, tech stack, AI pipeline, humanities sources, POPIA, accessibility,
  judging map, research summary).
- `.claude/settings.json` + project skills (humanities-grounding, pollinations-visuals,
  popia-compliance, setswana-i18n).
- `specs/` concept-submission narrative draft + task backlog.

## 🛠️ Environment & access

- Node 24 / npm 11 / git — installed and working.
- API keys still needed (all free tier): **Gemini** (Google AI Studio), **Lelapa AI / Vulavula**,
  **Supabase** (URL + anon key), **ElevenLabs** (one-time static narration only). Put them in
  `app/.env` (see `app/.env.example`). Pollinations needs **no key**.

## ⚠️ Open decisions / risks

- **Tight timeline:** ~10 days to concept (not the 4 weeks the blueprint assumed). Phase 1 (story core)
  is the never-cut spine; Community Archive is the highest-value differentiator but cut to "record →
  consent → local save" first, add cloud sync only if time allows.
- Name: **Ubuntu Heritage** since 2026-07-03 (working name *Maloba*, Setswana "yesterday"). Tagline
  *Mantswe a maloba* = "Voices of Yesterday".
- Decide demo target for the video: web (easiest to screen-record) vs Expo Go on a phone.

## 🔗 Blockchain (Phase A — on-chain heritage provenance)

- Plan: [docs/11-blockchain-heritage-plan.md](docs/11-blockchain-heritage-plan.md). Decision: build Phase A
  now; IPFS + custodial wallet; **POPIA-safe** (only public works + hashes on-chain, never recordings).
- `chain/` workspace anchors the canon: real **IPFS CIDs + SHA-256** computed for all 4 works, submits
  a **provenance memo tx**, and **mints a heritage certificate SPL token** (fixed supply 1) per work to
  a recipient wallet (`MALOBA_RECIPIENT` = Emma's Phantom address). In-app **Heritage Ledger** screen
  shows CID/hash + "Verify on Solana" + certificate links.
- **To complete live:** (1) Emma sends ~0.1 **testnet** SOL from Phantom to the custodial address;
  (2) provide Phantom testnet address; (3) run `cd chain && MALOBA_RECIPIENT=<addr> npm run anchor`.
  Certificates then appear in Phantom (unnamed on testnet — Metaplex metadata/naming is Phase B on
  devnet/mainnet).
- **✅ LIVE on Solana devnet.** The canon was notarised via a **browser Heritage Notary**
  (`chain/web/index.html`, served on :8090) where Emma connected **Phantom** and signed — no custodial
  wallet needed. RPC reachability solved with the keyless `solana-devnet.api.onfinality.io/public`
  (api.devnet.solana.com is blocked on this network). One tx carries all 4 provenance memos:
  `3SafBbHpT7YYBKDkkRP8rAi43eqVzCgnydiJwkGwH6im94sP1nxdS1Dh66MDxccSMxAF2mXy9g2LhU4Z6XhpmKax` — confirmed,
  err=null. Wired into `app/src/content/heritage.data.ts` (cluster=devnet); the in-app Heritage Ledger
  now shows live "Verify on Solana" links. Owner: `BDscn3fpj4hw7H9Jm8SKis2NmPSX8Rd5to4JzyNgkLWh`.
- Next: in-browser **certificate NFT minting** (Metaplex named NFTs to Phantom). Custodial keypair
  `9CW9…` (gitignored) retained for the headless `chain/anchor.mjs` path.

## 🧭 Cultural Atlas (levels up Humanities Depth)

- New **Cultural Atlas** section (3 grounded, cited modules): **Unsung Heroes** (Galeshewe, Nyabela,
  Moleli & Anta, Youth of 1976), **Rites of Passage: Marriage** (lobola/Patlo/Umtshato/Umabo),
  **The Peopling of SA** (Khoisan → Bantu → Sotho-Tswana & Nguni). Reuses the cinematic Reader.
- **Integrity choices (kept out on purpose):** the genetic-admixture % table (race-science risk),
  the hard "Tswana oldest" chronology (framed as debated), and `grokipedia` sourcing. Sensitive
  customs kept with context. Sources credited on the About screen. **Setswana + cultural content needs
  Emma's review** (marked in files).
- **Archive tie-in:** every Atlas entry has a "🎙 record your family's version" button → Community
  Archive. **Chain tie-in:** the on-chain Heritage Ledger already covers the literary canon; extending
  anchoring to Atlas heritage is a safe additive follow-up (won't touch the live devnet tx).

## 🗒️ Log

Moved to **[STATUS-LOG.md](STATUS-LOG.md)** on 2026-09-19 (issue #51) — 57 entries, newest first,
unchanged. New entries go at the top of that file; this board holds state, the log holds history.
