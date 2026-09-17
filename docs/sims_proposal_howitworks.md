# Maloba: End-to-End Walkthrough

**Purpose:** internal working document — how the product actually functions, step by step, from a
user opening the app through to a booked heritage experience. Complements the Department of Tourism
pitch ([sims_proposal.md](sims_proposal.md)), which makes the case for *why*; this document shows
*how*. For what actually gets built, in what order, against the code that already exists, see
[15-heritage-tourism-plan.md](15-heritage-tourism-plan.md).

---

## 1. The user journey (front-end flow)

**Step 1 — Entry point.** A user opens the app. There is no forced start-to-finish sequence. They can
enter through whatever pulls them in:
- A date (e.g. June 16)
- A person (e.g. Nelson Mandela)
- A topic (e.g. astronomy, resistance movements, a specific era)
- A place on the map (a city or region, tapped directly)
- Browsing generally, city by city or theme by theme

**Step 2 — The history itself.** The user lands on a real, sourced story tied to a specific place.
The story is presented as told — in the words of the community contributor (oral history, audio and/or
transcript) or drawn from licensed literature — with clear attribution to who told it or where it came
from. If any part of the story is uncertain, it's marked as such rather than filled in.

**Step 3 — The link to a real place.** Every story surfaces one or more real, visitable locations tied
to it — a museum, a street, a heritage site, a walking/bike tour route. This is shown directly beside
the story, not buried in a separate section.

**Step 4 — The bookable action.** The user can act on that link immediately: view details on the
museum/site, or go straight to booking a linked experience (e.g. a Soweto bike tour) through the
partner's own booking flow or a referral link.

**Step 5 — Optional depth.** From here the user can keep exploring outward — related stories, nearby
locations, the same event from another contributor's perspective — without ever needing to "finish" a
storyline.

---

## 2. The content pipeline (how a story gets into the app)

This is the process that turns a real person's memory or a piece of literature into a published
Maloba entry. Every entry must pass through all of these stages — none are skipped, regardless of how
strong the story is.

**Stage 1 — Sourcing**
- Oral history: identify and approach a community member, elder, or local historian willing to share
  a story tied to a specific place.
- Literature: identify a published source and confirm we either hold or can obtain permission/licensing
  to use it.

**Stage 2 — Consent (oral history only)**
- Before any recording happens, the POPIA-compliant consent flow runs: what is being collected, how
  it will be used, how it can be withdrawn or deleted later. No recording occurs without this being
  completed and confirmed.

**Stage 3 — Capture**
- Oral history: audio (and/or video) recording of the story, in whatever language the contributor is
  most comfortable in.
- Literature: the specific passage or reference is logged with full citation.

**Stage 4 — Verification**
- Every factual claim in the story is checked against a real, citable source — the contributor's own
  account counts as a source for oral history, but any broader historical claims made alongside it
  (dates, other figures, context) are checked separately.
- Anything that can't be verified is flagged `[NEEDS SOURCE]` internally and either resolved or left
  out of the published version — never guessed.

**Stage 5 — Translation/accessibility**
- The story is made available in the relevant South African language(s), using the translation
  pipeline (Gemini for adaptation, Lelapa/Vulavula for indigenous-language transcription and
  translation where audio is involved). Translation happens after verification, never before — we
  don't want a translation error to introduce a factual error.

**Stage 6 — Location linking**
- The story is tagged to its real-world location(s) and, where applicable, to a specific bookable
  experience or partner (see §3). This tagging is what turns a piece of history into a tourism
  product, not just an archive entry.

**Stage 7 — Publish**
- The entry goes live, attributed clearly to its contributor or source, with the location link
  attached.

---

## 3. The partner/business integration flow (how a location becomes bookable)

**Step 1 — Identify the link.** During content work, a story naturally points to a real place — e.g. a
story about June 16 points to Soweto; a story about Mandela's life points to Vilakazi Street.

**Step 2 — Identify the operator.** For that place, identify who actually offers a visitable/bookable
experience there — a museum's own ticketing, a local tour operator, a heritage site's visitor centre.

**Step 3 — Establish the relationship.** Depending on the partner: a simple referral link (send the
user to the operator's own booking page), a formal partnership agreement, or — longer term — a direct
booking integration inside the app.

**Step 4 — Attach to content.** The partner/location is linked to every relevant story, so a user
encountering the history from any entry point (date, person, topic, map) reaches the same booking
path.

**Step 5 — Maintain.** Partner details, availability, and pricing are not static — this needs a light
ongoing process to keep links current so the app never sends a user to a dead or outdated booking
path.

---

## 4. Where each piece of the existing tech stack fits

| Stack piece | Role in this flow |
|---|---|
| WatermelonDB (local) + Supabase (cloud) | Stores stories, consent records, location/partner links; offline-first so reading works without connectivity, syncing when available |
| Gemini Flash | Language adaptation/translation of verified content — not used to generate historical claims |
| Lelapa AI / Vulavula | Indigenous-language speech-to-text and translation for oral history capture |
| POPIA consent flow | Gate before any recording; tied to Stage 2 of the content pipeline |
| Gemini image generation (build-time) + Pollinations (runtime fallback) | Visual layer for stories and location entries. **AI-illustrated today and labelled as such** — every image carries an "Artistic interpretation" note in all eleven languages ([AboutSourcesScreen.tsx](../app/src/components/AboutSourcesScreen.tsx)). Images are pre-rendered offline by `npm run gen:images` and cached as local assets; Pollinations serves only where no cached asset exists |
| Commissioned / licensed / community artwork | **The intended replacement for AI imagery, story by story, as it becomes available** — not a decision that has been made or scheduled. Tracked as an open item in [15-heritage-tourism-plan.md](15-heritage-tourism-plan.md) §8, not as committed work |

---

## 5. What's still open

- **How tightly a story must relate to a location before it counts as a valid link** — e.g. is a
  loosely thematic connection (math → an Egypt-linked site) treated the same way as a direct one
  (Mandela → Vilakazi Street)? This needs an editorial rule before content scales.
- **Who owns partner relationship management** day to day, as the number of linked operators grows.
- **What the minimum viable pilot looks like** — how many stories, locations, and partner links are
  needed before this is demo-ready for the Department of Tourism (see pilot scope note in the pitch
  document).