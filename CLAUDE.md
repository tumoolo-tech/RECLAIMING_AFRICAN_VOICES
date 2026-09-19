# CLAUDE.md — Claude Code context for Ubuntu Heritage

**Ubuntu Heritage** (working name *Maloba*, Setswana for "yesterday"; renamed 2026-07-03) is a cinematic, multilingual, offline-first app that brings
South Africa's foundational indigenous literature to life — built for the **AADHIH "Reclaiming African
Voices" hackathon** (UNISA / BaobabX Academy). This file is the entry point for any Claude Code
session on this project.

> **Started solo, now a small team.** The hackathon required *individual* participation — one builder
> (Tumo Olorato Mogame, credited in the README) with Claude as assistant. Since September 2026 two
> more developers have write access and `main` requires a PR. The shared contract is
> **[AGENTS.md](AGENTS.md)** + the live **[STATUS.md](STATUS.md)** board + **[STATUS-LOG.md](STATUS-LOG.md)**.

## Before doing anything

1. Read **[STATUS.md](STATUS.md)** — the live board (done / in-progress / next). Read first, update last.
   The dated history is in **[STATUS-LOG.md](STATUS-LOG.md)**; skim its top three entries.
2. Read **[AGENTS.md](AGENTS.md)** — the working rules (grounding, honesty, ethics, git discipline).
3. Skim **[docs/00-project-plan.md](docs/00-project-plan.md)** — phases and the real timeline.

## Project one-liner

Ubuntu Heritage turns the works of **Sol Plaatje (*Mhudi*)**, **S.E.K. Mqhayi (*Ityala Lamawele*)**,
**Credo Mutwa (*Indaba, My Children*)** and **B.W. Vilakazi** into an interactive, cinematic graphic
novel — with AI-generated visuals, dual Child/Adult reading modes, Setswana + English (and other SA
languages), a community oral-history archive, and full POPIA compliance. It runs on **one Expo
codebase** (web + Android + iOS) on a **100% free-tier** stack so it costs nothing to keep alive.

## The stack (as shipped — see [docs/02-tech-stack.md](docs/02-tech-stack.md))

Expo / React Native (one codebase; **web is the shipped target**, native is partial — issue #44) ·
`StyleSheet` + theme tokens (NativeWind and Lottie were planned and never adopted) ·
**Pollinations.ai** + pre-rendered **Gemini** images (cached, labelled AI) · **Google Gemini** (the
"Ask Ubuntu" chatbot; Claude optional) · **ElevenLabs** (Listen, English/Afrikaans only, cached) ·
**Botlhale AI** (indigenous TTS, wired, awaiting a key) · **Lelapa AI / Vulavula** (indigenous STT,
planned) · **Supabase** (anonymous auth + RLS + storage — the live community feed) · **Solana devnet**
(the Heritage Ledger) · persistence is localStorage/IndexedDB on web, session-only on native
(WatermelonDB was planned and never adopted).

## What Claude should and shouldn't do here

- **Do:** scaffold and write app code, build the literary modules, wire the AI pipeline, write the
  concept-submission narrative, keep STATUS.md accurate, and map every feature back to the
  [judging rubric](docs/06-judging-criteria.md).
- **Do:** keep the humanities **first** and technology **subordinate** — the rubric weights Humanities
  Depth (30%) + Community Impact (25%) far above Creativity/Innovation (15%). See
  [docs/04-humanities-sources.md](docs/04-humanities-sources.md).
- **Don't: invent history.** Every fact about a text, custom, character, or law must trace to a real
  source (the literature itself or a cited reference). When unsure, mark it `[NEEDS SOURCE]` rather
  than fabricate. This is the project's integrity rule — see [AGENTS.md §4](AGENTS.md).
- **Don't:** collect a voice recording or any personal data without the POPIA consent flow. See
  [docs/05-popia-compliance.md](docs/05-popia-compliance.md).
- **Don't:** burn paid API quota in dev. ElevenLabs is runtime for English/Afrikaans only and every
  clip is cached — never route an indigenous language to it; Gemini/Pollinations are free but
  rate-limited — cache aggressively.

## Real timeline (as of 2026-09-15)

**Every hackathon date below is in the past**, and the repo carries **no record of what happened on
any of them** — no log entry says the concept was submitted, and none says it was missed. Do not
assume either. This is an open question for Tumo, tracked at the top of
[STATUS.md](STATUS.md); until it is answered, treat the four dates as history and the project as
ongoing work on `main`.

| Date | Milestone | Outcome in this repo |
|------|-----------|----------------------|
| **9 Jul 2026, 16:00** | **Concept submission deadline** — prototype + 2–3 min video + written narrative | **Unrecorded.** The narrative is drafted; the demo video (T034) was never recorded |
| 10 Jul 2026 | Finalists announced (top 50) | **Unrecorded** |
| 13–14 Jul 2026 | Technical orientation + Red Horizon Metaverse access | **Unrecorded** |
| **16 Jul 2026** | **Final showcase event** | **Unrecorded** |

Development did not stop at the deadline: work continued through 8 Jul, then again from 26 Aug to
**30 Aug 2026** (Architecture v2, the Know the Road game layer, the ElevenLabs narration voice, and
all 54 `countries/` files). From **12 Sep 2026** the project runs as a small team on `main` with
PR checks: Phase 7 heritage tourism (`TOUR-01–13`, 49 sourced places with licensed photographs),
and the post-hackathon backlog from the 12 Sep audit — **40 issues ordered in
[issue #58](https://github.com/tumoolo-tech/RECLAIMING_AFRICAN_VOICES/issues/58)**, scope decided
**South Africa first** (continental issues parked). For what is current, read STATUS.md; for what
happened, STATUS-LOG.md.

Full phased plan: [docs/00-project-plan.md](docs/00-project-plan.md).

## Repo map

```
CLAUDE.md            <- you are here (entry point)
AGENTS.md            <- the working rules (grounding, ethics, git)
STATUS.md            <- LIVE board: done / in-progress / next (read first, update last)
README.md            <- human overview + quick start
countries/           <- Tumo's per-country research, one .md per African nation (see its README)
docs/                <- plan, architecture, tech stack, AI pipeline, humanities, POPIA, judging
specs/               <- concept-submission narrative + task backlog
.claude/             <- settings + project-specific skills
app/                 <- the Expo app (web + mobile, single codebase)
assets/reference/    <- the hackathon brief + rubric PDFs (source of truth for requirements)
```
