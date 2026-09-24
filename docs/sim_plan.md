# sim_plan — the build, and every decision behind it

> **What this is:** the document the heritage-tourism build is run from, and the **permanent record of
> every decision taken** — from the first line of the pitch through to delivery. If a choice was made,
> it is in §4 below with a number, a date, a reason, and who made it. Nothing is decided in a
> conversation and left there.
>
> **Source documents:** [sims_proposal.md](sims_proposal.md) (the pitch — *why*) ·
> [sims_proposal_howitworks.md](sims_proposal_howitworks.md) (the walkthrough — *how*) ·
> [15-heritage-tourism-plan.md](15-heritage-tourism-plan.md) (the design — *what shape, and why that shape*)
>
> **Backlog:** [specs/tasks.md](../specs/tasks.md) Phase 7 · **Board:** [STATUS.md](../STATUS.md)
>
> **Status:** planning complete for all three stages. **No code written.** **All decisions resolved
> (2026-09-18) — Stage A is fully unblocked.** What was chosen, and what was rejected, is in §8.

---

## 1. How this document works

The register in §4 is **append-only**. The rules, so it stays trustworthy as the build runs:

1. **Never edit a `Locked` row and never renumber.** If a decision changes, add a *new* row that
   supersedes it, and mark the old one `Superseded → SP-0NN`. The wrong turn stays visible; that is
   the point of keeping a record at all.
2. **Every row carries a reason.** A decision without its "why" is unreviewable in three months and
   will be re-litigated from scratch.
3. **A decision enters the register before the code that depends on it**, not after.
4. **Inherited decisions keep their original IDs** (`T1`–`T9` from doc 15, `V2-D1` from
   [13-architecture-v2-plan.md](13-architecture-v2-plan.md)). New ones are `SP-0NN`, one flat
   sequence across all stages, so an ID never has to be looked up by stage.

### Status vocabulary

| Status | Means |
|---|---|
| **Locked** | Decided. Build against it. Changing it needs a superseding row and a reason. |
| **Proposed** | My default. **Takes effect unless Tumo objects** — no one is blocked waiting. |
| **Open** | Needs Tumo. Names the work it blocks and the default if unanswered, so it never stalls everything. |
| **Superseded** | Was true, no longer is. Kept, with a pointer to what replaced it. |

---

## 2. Scope, in one sentence

Every story in the app already knows its history; **none of them knows the address** — so we add a
place entity, a story↔place registry, and two surfaces that show them, starting with Soweto only.

Everything before the second arrow of *curiosity → real place → real operator → a visit* already
exists ([doc 15 §2](15-heritage-tourism-plan.md#2-what-already-exists-do-not-rebuild-any-of-this)).
**Do not rebuild any of it.** This is a linking layer, not a new product.

---

## 3. Where the build stands

| | |
|---|---|
| Tasks | `TOUR-01`…`TOUR-13`, **13 of 13 done** (TOUR-10 partial — see below) |
| Tests | **202 passing**, `npm run typecheck` clean · was 179 at the start of this phase |
| Live in the app | **49 sourced places across 18 of 19 cities** · 2 story→place links · **0 experiences** |
| CI gate | [pr-checks.yml](../.github/workflows/pr-checks.yml) — typecheck + tests on every PR into `main` |
| Decisions | 12 inherited · 92 registered |
| **Not closed** | **TOUR-10** — a11y labels are written and confirmed in the accessibility tree, but there has been no audit with a real screen reader. Gate B's screen-reader line is open |
| Waiting on you | The 3 access-restricted places · ~14 `[VERIFY]` sources · the 4 conflated strings · Thulamela's city · the team-size line in the pitch |

---

## 4. The decision register

### 4.1 Inherited — decided before this plan, and governing it

| ID | Date | Decision | Why | Status |
|---|---|---|---|---|
| **NAME** | 2026-07-03 | The product is **Ubuntu Heritage**; "Maloba" is the former working name | [docs/README.md](README.md) naming note. The Setswana tagline *Mantswe a maloba* is kept on purpose | Locked |
| **V2-D1** | 2026-08 | The nav is exactly six rooms: `Journey · Watch · Atlas · Archive · Kids · Schools` | [13-architecture-v2-plan.md](13-architecture-v2-plan.md). A seventh room would reopen a settled architecture | Locked |
| **ART** | 2026-09-17 | **AI illustration stays**, labelled "Artistic interpretation" in all 11 languages; commissioned/community artwork replaces it story by story as it becomes available | Tumo's call. The pitch was reworded to say what is true rather than claim a pivot that hasn't happened. **Not a blocker for any `TOUR-*` task** | Locked |
| **T1** | 2026-09-17 | **Referral links out only in v1.** No payments, no baskets, no partner APIs | Keeps v1 POPIA-clean by construction — no personal data is needed to send someone to a public URL | Locked |
| **T2** | 2026-09-17 | A place is a **first-class entity**; a booking is an **attribute** of it | Places outlive operators. A tour company folding must not delete Vilakazi Street | **Amended → SP-058.** The first half stands; a booking is now its own entity, not an attribute |
| **T3** | 2026-09-17 | Story↔place links live in **one registry**, not as a `places` field on eight content types | Otherwise every content file gets touched and re-tested | Locked |
| **T4** | 2026-09-17 | Every place carries its own `sources`. **No source → not published** | [AGENTS.md §2](../AGENTS.md). A tourism product that invents heritage is worse than one that omits it | Locked |
| **T5** | 2026-09-17 | **Referral URLs carry no user identifiers, ever.** No query params, no click IDs, no fingerprints | Forecloses conversion tracking deliberately — see §10 | Locked |
| **T6** | 2026-09-17 | Pure-logic resolvers, unit-tested under `node --test` | Matches the existing 179 tests, which run with no dependencies installed | Locked |
| **T7** | 2026-09-18 | The layer surfaces **inside Atlas + Provinces. No new room** | Tumo. V2-D1 stands; `shell/nav.ts` is never edited. Unblocked Stage B | Locked |
| **T8** | 2026-09-18 | The v1 pilot is **Soweto only** | Tumo. Its four landmarks and both 16 June 1976 articles are already in the repo — zero new research gates the mechanism. Unblocked TOUR-05 | Locked |
| **T9** | 2026-09-18 | **Tumo owns partner relationships**, and runs the freshness check **before every demo or send-out** rather than on a schedule | Tumo. Honest for a solo project at this scale — a handful of links, checked when it matters. **Revisit when** a partner asks for a formal agreement, or links exceed ~20 | Locked |

### 4.2 Governance

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-001** | This document is the decision register for the whole phase, append-only per §1 | A record kept in chat is lost at the end of the session | Locked |
| **SP-002** | The four-status vocabulary above, with `Open` rows always naming a default | So one unanswered question never stalls the other twelve tasks | Locked |
| **SP-003** | Branch off `main`; **one commit per `TOUR-*` task**; PR into `main` so CI runs | Each decision lands reviewable next to the code it justifies | Proposed |
| **SP-004** | **Scope tripwires.** Stage A touches **no `.tsx` file**. No stage touches `shell/nav.ts` | If either is in a diff, the scope has drifted and the work stops | Locked |
| **SP-005** | Every stage ends at a **gate that is a command**, not a judgement call | "Looks right" is not a gate | Locked |
| **SP-006** | **Nothing in this phase is presented to the Department of Tourism until §10 is honoured** | The pitch currently claims something the build cannot do | Locked |

### 4.3 Stage A — files and wiring

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-007** | Two new files: `app/src/content/places.ts` (entities) + `place-links.ts` (the relation) | T3 already separates them; merging makes the "did you touch content?" check fuzzy | **Superseded → SP-061** (three files; `experiences.ts` added) |
| **SP-008** | Resolvers live **in `place-links.ts`**; `places.ts` gets only `placeById` | A third file is premature for three functions | Proposed |
| **SP-009** | Imports use the **explicit `.ts` extension** (`from "./places.ts"`) | `tsconfig.json` enables `allowImportingTsExtensions` precisely so `node --test` can load content files | Locked |
| **SP-010** | **Do not touch `content/index.ts`** in Stage A | That barrel is `Module[]`-shaped; places aren't modules, and nothing consumes them yet | Proposed |

### 4.4 Stage A — the `Place` type

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-011** | `sources: string` is **required**, not optional | The type *is* the guardrail (T4). A place without a source fails to compile | Locked |
| **SP-012** | `id` is globally unique kebab-case (`hector-pieterson-memorial`), not unique-per-city | Enforced by test; a place is a real thing, not a row in a city | Proposed |
| **SP-013** | `kind` is exactly six values — `museum · street · site · route · monument · church`. **No `"other"`** | An escape hatch is where unclassifiable junk accumulates | Proposed |
| **SP-014** | **`coords: { lat, lng }` is in the type and filled for all four places** | Tumo, 2026-09-18. Chosen over dropping it: the data is complete now rather than backfilled later, and a map becomes trivial. **Consequence, accepted:** a coordinate is a factual claim like any other, so it is sourced and reviewed under T4 — see SP-052 | Locked |
| **SP-015** | `name` and `what` are **plain English strings, not `LocalizedText`** | Matches `provinces.ts` and `articles.ts`. [`ui-coverage.test.ts`](../app/src/i18n/ui-coverage.test.ts) says why in its own header: it checks UI chrome only, because forcing 11 languages onto *content* "would invite exactly the fabrication the project forbids." SP-040 covers the panel's labels | Locked |
| **SP-016** | New field **`landmarkLabel`** — the exact string in `provinces.ts` this place corresponds to | TOUR-08 needs to know which chip is tappable. The memorial's chip reads `"Hector Pieterson Memorial"` while its real name includes "& Museum" — **no fuzzy name matching anywhere**, and a test fails if the string stops existing | Proposed |
| **SP-017** | A place has one owning `cityId` **plus `alsoListedIn?: string[]`** for the other cities that list it. `hector-pieterson-memorial` and `mandela-house` are `cityId: "soweto"`, `alsoListedIn: ["johannesburg"]` | Tumo, 2026-09-18. Both cities list them ([provinces.ts:140](../app/src/content/provinces.ts) and [:157](../app/src/content/provinces.ts)) and they are physically in Soweto. Chosen over a single owner so no user meets a chip that looks tappable and isn't, and over editing Johannesburg's landmarks so SP-029 holds. Found while grounding this plan — in no prior doc | Locked |
| **SP-018** | `VisitInfo` ships as a **type with zero records**. No place gets a `visit` in Stage A | Follows from SP-021 — no unverified URL enters the repo, and none is verified yet | **Retargeted → SP-058/SP-063:** now `experiences.ts` ships empty |
| **SP-019** | A new `visit` starts `status: "unverified"`. **Only `"live"` ever renders a booking affordance** | The default state is silence, not optimism | **Retargeted → SP-063:** now `Experience.status` |
| **SP-020** | `lastChecked` is an ISO date string, hand-written until TOUR-11 exists | — | Proposed |
| **SP-021** | **No `visit.url` enters the repo unverified by a human.** I do not write booking URLs | A plausible-looking dead booking link is worse than no link | Locked |

### 4.5 Stage A — the link registry

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-022** | Declare all seven `ContentKind`s now (`article · journey · module · hero · president · day · city`); seed only `article` and `city` | Costs nothing, avoids a type change the first time a hero gets a place | Proposed |
| **SP-023** | `PLACE_LINKS` is a **flat array**; resolvers index it. Not a keyed map | Readable as data, diffable in review | Proposed |
| **SP-024** | `why: string` is **required** on every link | The editorial call must be reviewable without asking the person who made it | Locked |
| **SP-025** | Resolvers return **`direct` links before `thematic` ones, always** | So no caller can accidentally render them as equals — see §9 | Locked |
| **SP-026** | Referential integrity is a test: every `placeId` resolves, every `landmarkLabel` exists in `provinces.ts` | A dangling link is a silent bug that only shows up on screen | Locked |

### 4.6 Stage A — the seed and its sources

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-027** | **I research and cite all four places** against real published references; Tumo reviews every citation before it lands | Tumo, 2026-09-18. In-repo citations alone would have shipped a 1–2 place pilot, missing Mandela House and Regina Mundi — the two strongest tourism draws. Chosen with the review burden accepted. **I do not invent a citation under any circumstance**; anything I cannot ground comes back as `[NEEDS SOURCE]` | Locked |
| **SP-028** | **Ship only what is sourced.** An unsourced landmark **stays a bare string** | T4. Expect **fewer than four places** in the first pass — that is a pass, not a shortfall | Locked |
| **SP-029** | `City.landmarks: string[]` is **untouched for all 19 cities**. Purely additive, no schema migration | Keeps the blast radius at two new files | Locked |
| **SP-030** | **I propose real `thematic` candidates from existing content; Tumo approves or rejects each.** None ships unapproved | Tumo, 2026-09-18. Chosen over a test-only fixture so the "Related" rule is proven by real content, and over dropping `thematic` entirely, which would leave the walkthrough's own open question answered in prose but not in code. **If no honest candidate exists, none is invented** — the branch falls back to fixture coverage and ships zero thematic links | Locked |

### 4.7 Stage A — tests

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-031** | Tests colocated as `src/content/places.test.ts` + `place-links.test.ts`, `node --test`, **zero dependencies** | Runs with `node_modules` absent, like the existing 179 | Locked |
| **SP-032** | Tests **read `provinces.ts` as text** (`readFileSync` + regex) to extract city ids and landmark strings | Tumo, 2026-09-18. Verified, not assumed: `provinces.ts` `require()`s `.webp` assets and throws `ReferenceError: require is not defined in ES module scope` under `node --test`. This is the pattern the repo already chose for exactly this problem — [`ui-coverage.test.ts`](../app/src/i18n/ui-coverage.test.ts) reads components the same way. **`provinces.ts` stays unedited**, which the two alternatives could not promise | Locked |
| **SP-033** | Integrity assertions: unique ids · non-empty `sources` · every `cityId` resolves · every `landmarkLabel` exists · every link's `placeId` resolves · `direct` ordered first | The guardrails are tests, not intentions | Locked |
| **SP-034** | **TOUR-12's no-identifier-in-URL test lands in Stage A**, not Stage C where the plan files it | Costs nothing now, and means the rule exists *before* the first URL does rather than after | Proposed |

### 4.8 Stage B — the surfaces

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-035** | ~~Place detail is an overlay inside `CityScreen` — not a 25th `Route` member~~ **Superseded → SP-085** | Two grounded reasons. [App.tsx:106](../app/App.tsx) records that inlining a stage in the route switch "made the type-checker recurse over the (now 24-member) route union until it stopped finishing." And [`ArticleReader`](../app/src/components/ArticleReader.tsx) is *already* a full-screen modal mounted by `NationalDaysScreen`, not a route — the precedent exists. This also avoids editing `Route`, `ATLAS_ROOMS` and `KEYED_ROUTES` | Proposed |
| **SP-036** | ~~No deep link or shareable URL to a place in v1~~ **Superseded → SP-085** — the cost was accepted on a misreading; places now have routes | An honest cost. If the Department wants a linkable place page, that reopens SP-035 with the tsc risk priced in | Proposed |
| **SP-037** | Overlay state is a **local `useState` in `CityScreen`**; no new props on it | Matches `journeyOpen` at [ProvincesScreens.tsx:101](../app/src/components/ProvincesScreens.tsx). Zero prop-signature changes | Proposed |
| **SP-038** | `VisitPanel` renders **inside `ArticleReader`**, after the `keyPoints` block and before the sources note. **Beside** the text at `wide` (≥760), stacked directly under it otherwise — **never a separate tab** | Walkthrough Step 3 is explicit that burying it defeats the mechanism. `wide` already exists at [ArticleReader.tsx:149](../app/src/components/ArticleReader.tsx) | Proposed |
| **SP-039** | **Extract `openOriginal` into a shared helper** rather than duplicating it | It carries `noopener,noreferrer` and the native `Linking` fallback. That is security-relevant behaviour and must have exactly one owner | Proposed |
| **SP-040** | **Kids mode shows the place — what it is, where it is, its sources — and no outbound or booking affordance at all** | Tumo, 2026-09-18. Minors, plus [POPIA](05-popia-compliance.md). Chosen over hiding the layer entirely, which would cost children the "this is a real place you could stand in" connection, and over an adult-gate interstitial, which is a weak gate and puts a booking funnel in a children's product | Locked |
| **SP-041** | `thematic` renders as **"Related"** — no booking affordance, no "plan a visit", never treated as the story's location | §9. Collapsing the two relations is a false historical statement made through layout | Locked |
| **SP-042** | Every new string lives in a component `UI = {}` block **in all 11 languages** | Strings are data, never hardcoded ([setswana-i18n](../.claude/skills/setswana-i18n)); [`ui-coverage.test.ts`](../app/src/i18n/ui-coverage.test.ts) is the gate and fails the build | Locked |
| **SP-043** | a11y: `accessibilityRole="button"` plus a label naming the place **and stating that the link leaves the app** | 107 `accessibilityLabel` uses already exist — match them. Do not add to the 25 known-unlabelled pre-v2 controls | Locked |
| **SP-044** | A chip becomes pressable **only where a `Place` exists**. Every other city's chips stay byte-identical | The diff should be provably inert for 18 of 19 cities | Locked |
| **SP-045** | New component files are exactly two: `VisitPanel.tsx` and `PlaceView.tsx` (the overlay body) | Bounds the surface area; anything more means the design grew | Proposed |

### 4.9 Stage C — keeping it true

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-046** | `scripts/check-place-links.mjs` is **manual/reported, never a CI gate** | It hits third-party hosts; in CI it would make `main` flaky and train everyone to ignore a red build | Locked |
| **SP-047** | The script **reports; it never rewrites `places.ts`** | A codemod over a file full of sourced prose is how citations get silently mangled. A human applies status changes | Proposed |
| **SP-048** | The script **returns an exit code from `main()`** rather than calling `process.exit()` mid-flight | [supabase-check.mjs](../app/scripts/supabase-check.mjs) documents why: a forced exit while a fetch socket is closing trips a libuv assertion on Windows | Proposed |
| **SP-049** | A `status: "dead"` link is **hidden, not shown hopefully** | No dead ends | Locked |
| **SP-050** | **TOUR-13: the pitch's §3 "direct, *traceable*" is softened before the document is sent** | The traceable half is false under T5 — see §10. Tumo's edit to make | Locked |

### 4.10 Arising from the 2026-09-18 answers

These are consequences of the seven decisions above. They are registered rather than left implicit,
because each one would otherwise be re-discovered mid-build.

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-051** | `landmarkLabel` stays a **single string**, and a test asserts it appears in the `cityId` city **and in every `alsoListedIn` city** | Follows SP-017. Both cities happen to use identical strings today — the test is what guarantees they stay identical, rather than the hope that they will | Proposed |
| **SP-052** | **A coordinate is a factual claim** and is sourced like any other. The place's `sources` line states where the coordinate came from, not just where the history did | Follows SP-014 + T4. A wrong coordinate sends a real person to the wrong corner of Soweto, which is a heritage-accuracy failure, not a UI bug | Proposed |
| **SP-053** | Citations and coordinates are drafted into a **review sheet, `design/places-content.md`** — not written straight into `places.ts`. Approved rows move into the code afterwards | The repo already works this way: `provinces.ts`'s own header names [design/provinces-content.md](../design/provinces-content.md) as "the review sheet", and `presidents-content.md` does the same. Review happens on prose, not on a TypeScript diff | Proposed |
| **SP-054** | **What counts as a source for a place:** the institution's own published page, a heritage authority or museum record, or a published history. **Not** a travel blog, an aggregator, or an AI summary. Anything I cannot ground this way comes back as `[NEEDS SOURCE]` | Follows SP-027 and [AGENTS.md §2](../AGENTS.md). Researching four places is only safe if what counts as a source is fixed before the searching starts, not after | Proposed |
| **SP-055** | **Thematic candidates are presented with the §9 test already applied** and a one-line `why`. Anything genuinely arguable is **rejected by default**, not escalated | Follows SP-030 and the §9 rule: the cost of under-claiming is a weaker card, the cost of over-claiming is a false historical statement | Proposed |
| **SP-056** | The freshness check is `npm run check:place-links`, and **running it is a step in the pre-send checklist** for any demo or document sent out | Follows T9. An owner with no trigger is not an owner — the trigger is what makes "Tumo owns it" operable | Proposed |
| **SP-057** | The review burden is **batched into one pass** after TOUR-05 drafts the sheet — 8 citations and 4 coordinates together — not four separate interruptions | Follows SP-027 + SP-014. Reviewing citations in one sitting is also how inconsistencies between them get noticed | Proposed |

### 4.11 The multi-place booking problem — raised by Tumo, 2026-09-18

Tumo asked, before TOUR-01 was written: **what happens when one booking covers several places?** The
pitch's own flagship example is exactly this — *"Learn about June 16 → book a bike tour through
Soweto"* visits Vilakazi Street, the memorial, Mandela House and Regina Mundi. The shape as designed
could not hold it, and the shape is what everything downstream inherits. Caught at the only moment it
was free to fix: types written, no data yet.

| ID | Decision | Why | Status |
|---|---|---|---|
| **SP-058** | **Everything bookable is an `Experience` with `placeIds: string[]`. `Place.visit` is dropped.** A museum's own ticketing is an Experience with one stop; a bike tour is an Experience with four. **Supersedes T2's "a booking is an attribute of it"** — the place stays first-class, the booking stops hanging off it | Under the old shape a four-place tour had to attach to one arbitrary place (showing "book" on Vilakazi Street but not Mandela House) or be copied onto all four (four URLs to keep fresh; a user sees "book" four times and infers four tours). Rejected: *keep both concepts* — freshness, the no-PII test, the UI and the Kids rule would each have to handle two shapes forever. Rejected: *a tour as a `Place` of `kind: "route"`* — a tour has no single coordinate and would still need a place↔place relation | Proposed |
| **SP-059** | An `Experience` carries **no `sources` field**. Its provenance is the operator's own `url`, guaranteed by SP-021 (no URL enters the repo unverified by a human) | **History needs a citation; commerce needs verification.** They are different truth standards and conflating them would either weaken T4 or demand a bibliography for a ticket page | Proposed |
| **SP-060** | An `Experience` **does not store a city.** Its cities are derived from its places | One source of truth. A tour that grows a stop in another city must not need its `cityId` corrected by hand | Proposed |
| **SP-061** | Stage A is **four files, not three**: `places.ts` + `experiences.ts` (both TOUR-01) + `place-links.ts` + tests. **Supersedes SP-007's count** | The two type files are one shape decision and belong in one task | Proposed |
| **SP-062** | **SP-040 becomes structural:** Kids surfaces import `places.ts` and **never import `experiences.ts`**. A test asserts it | "No booking path in front of a child" stops being a rule a developer has to remember and becomes a property of the import graph — the strongest form of that guarantee available here | Proposed |
| **SP-064** | **Resolvers are a pure core plus a bound wrapper.** `resolvePlacesFor(ref, links, all)` takes its data; `placesForContent(ref)` binds it to the real registries | The registries are empty until TOUR-05b, so a resolver reading module state directly could only be tested "empty in, empty out" — ordering, `kind` disambiguation and status filtering would go untested for three more tasks. [`articles.test.ts`](../app/src/content/articles.test.ts) shows the failure mode: it rebuilds the sort inline rather than calling the function, so it would pass even if the real sort were wrong | Proposed |
| **SP-065** | `experiencesAtPlace` / `bookableAtPlace` live in **`experiences.ts`**, not the link registry, and **`bookableAtPlace` filters to `status: "live"` in the resolver, not in the UI** | They read experiences, not links (SP-008's logic applied to the new file). Filtering in the resolver means a Stage B component *cannot* render a dead or unverified booking even by mistake — the same "make it structural" reasoning as SP-062. `experiencesAtPlace` returns every status, for the freshness script | Proposed |
| **SP-066** | The Kids import test (SP-062) checks **direct imports of the two Kids surfaces only**. Transitive imports through a shared component are **not** covered, and this limit is written into the test | An honest limit stated in the test beats a false sense of coverage. Revisit if a shared component ever gains a booking affordance | Proposed |
| **SP-069** | **T8 is widened: every landmark in every city becomes a place, not Soweto alone.** All **75** landmark strings across 19 cities get researched, cited and seeded — one review sheet, one sitting | Tumo, 2026-09-18: *"every place … also has its own interesting thing to tell and not just that it's from Soweto."* Correct on the merits — the Atlas's purpose is that each place carries its own history. **No code change is required**: `placeForLandmark` is city-agnostic and was proved so in Johannesburg, which has no special-case code. **The blocker was never the code, it is that the repo knows nothing about 71 of the 75 landmarks except the string.** Supersedes T8's Soweto-only scope | Proposed |
| **SP-070** | **SP-067 escalates from 4 coordinates to 75, and now gates the entire sweep** | *(Resolved by SP-073.)* Museums publish street addresses, not decimal coordinates. At four places that was ten minutes of Tumo's verification; at 75 it is not workable, and `coords` is **required** by SP-011/SP-014. Either `coords` becomes optional (reversing SP-014) or the sweep cannot ship under its own rules. **This needs answering before the research is worth finishing** | **Superseded → SP-073** |
| **SP-071** | **Six landmark strings are not places and stay bare strings** — `"the wine estates"`, `"the goldfields headgears"`, `"the traffic-circle street plan"`, `"the Kruger's southern gates"`, `"the historic gold-rush streets"`, `"Mmabatho"` | They are descriptive phrases or plurals, not somewhere you can stand. Promoting them to entities with ids, sources and coordinates would force the model to hold something that is not there — exactly what SP-028 exists to prevent. Takes the real sweep from 73 to **67** | Proposed |
| **SP-072** | **A sacred or access-restricted place needs an explicit flag, and must never carry a booking affordance.** Lake Fundudzi and Thathe Vondo forest are the first two | Found during the research, not anticipated by any plan. Lake Fundudzi is among the most sacred Venda sites and access is traditionally controlled by its custodians, with protocols for approaching it. A "plan a visit" button on it would be the tourism layer overriding a living custom — the precise harm [humanities-grounding](../.claude/skills/humanities-grounding) exists to prevent, and worse than an unsourced date because it acts on the world. **This needs a `Place` field before either ships** | **Open** |
| **SP-073** | **`coords` becomes OPTIONAL.** A place needs sourced prose and a citation; a coordinate is carried only where one honestly exists. **Supersedes SP-014, and resolves SP-067 and SP-070** | Tumo, 2026-09-18. Not a volume concession — a structural one. A third of the 67 places have **no single point by nature**: the Magaliesberg and Makhonjwa are ranges, Algoa Bay a bay, the Msunduzi a river, District Six and Bo-Kaap districts, Qunu and Mvezo villages, Vilakazi and Dorp streets. Keeping it required would have blocked roughly a third of the sweep **including Vilakazi Street, which the entire pitch rests on**. Where a coordinate IS given it remains a sourced factual claim under SP-052 | Locked |
| **SP-074** | **`access` gains `"living-residence"`, and the guard now blocks on `access` being set at all** rather than on one value. **Bumbane Great Place is the home of the reigning aBaThembu king** — not a heritage site | Found researching the last 22. Bumbane is a living royal residence, currently the subject of a succession dispute; routing visitors to it would be sending tourists to someone's home and to a seat of living authority. A different kind of wrong from the sacred sites, but the same remedy. Checking `access !== undefined` means a category added later is protected by default rather than by someone remembering to update the test | Proposed |
| **SP-075** | **Thathe Vondo forest is the strongest case for SP-072, not a weaker one** | The research found the taboo does not merely restrict outsiders: **ordinary Venda people may not walk in the forest**, and it extends to visitors. Venda kings and chiefs of the Thathe clan are buried there. Any "visit" affordance would be this app inviting people into a place the community itself does not enter | Locked |
| **SP-076** | **The freshness script never stamps `lastChecked`, and SP-047 is the second reason, not the first** | A 200 and a human verification are **different facts**. A server answering proves a server answered; it does not prove the tour still runs, at that price, on those days. If a green HTTP check refreshed that date, the field would quietly stop meaning "a person checked" (SP-021) and start meaning "a machine pinged" — the guarantee would evaporate with nobody deciding to drop it. The script prints the line to paste and leaves the decision with a person | Proposed |
| **SP-077** | **A `403` is never reported as dead**, and a redirect-to-home-page is amber rather than red | A bot filter refusing an honest user-agent is not evidence an operator folded; reporting it dead would have the script manufacture a death and hand a human a wrong edit. Redirect-to-home is the most valuable thing the check catches beyond a naive status check, but it has real false positives — and a false red trains people to ignore reds, which is SP-046's own reasoning applied one level down | Proposed |
| **SP-078** | **Three exit codes, not two:** `0` nothing needs a human · `1` the repo is making a claim it cannot support · `2` the check could not complete | In a pre-send checklist, "the wifi was bad" must not read identically to "you are about to demo a dead booking link". That distinction is the whole value of the run | Proposed |
| **SP-079** | **`--probe <url>` checks a candidate URL that is not in the repo yet** | The other half of SP-021. No operator URL may enter `experiences.ts` until a human has opened it — this puts a candidate through the same checks, including the T5 identifier rule, without having to add it to find out | Proposed |
| **SP-080** | **SP-039 becomes structural**: no component may call `window.open`/`Linking.openURL` directly, with the six pre-existing sites grandfathered **by name** | A convention nobody can check decays. Naming the debt rather than loosening the pattern is how this repo already treats its 25 unlabelled pre-v2 controls: removing a name is allowed, adding one is the failure. Mutation-tested both ways — a new offender turns it red, and emptying the allowlist also turns it red, which proves the list is load-bearing rather than matching nothing | Proposed |
| **SP-081** | **The content-translation gap is measured, not asserted.** `npm run check:languages` reports per-language coverage; `i18n/content-coverage.test.ts` is a **ratchet** that fails only when coverage goes *down* | The app offers 11 languages in a picker on every screen and the chrome genuinely honours it — but content is **248 English strings against 82 Setswana and none in the other nine**. That gap had no number and no test, and a gap you cannot see is one you cannot honestly describe to a judge, a partner or a user. A ratchet rather than a target, because demanding 100% would invite machine translation of sourced history passed off as reviewed — the fabrication AGENTS.md §2 forbids | Proposed |
| **SP-082** | **The counting lives in one module** (`i18n/coverage.ts`), imported by both the report and the ratchet | If each carried its own regex the two numbers would drift, and the moment they disagreed neither could be quoted — which defeats measuring at all | Proposed |
| **SP-083** | **`check:languages` always exits 0**, unlike `check:place-links` | Poor coverage is the known state, not a new failure. A command that is always red is one people stop reading — the same reasoning as SP-077's false-red argument. The ratchet carries the enforcement | Proposed |
| **SP-084** | **`LanguageNote` discloses an English fallback on surfaces `resolveText` cannot speak for**, and **does not promise a translation is coming** | Places are plain English prose by SP-015, so the `Localized` fallback machinery does not apply to them and they fell back silently. "Coming soon" on a screen that has said so for a year is its own small dishonesty, and for nine languages coverage is zero | Proposed |
| **SP-085** | **A place is its own page, reached by a route — reversing SP-035 and SP-036** | Tumo asked for pages with pictures and a story of their own. **And the reasoning behind SP-035 was wrong.** It rested on App.tsx's note that the route union had pushed the type-checker to its limit; re-reading it, the recursion came from **inlining a component inside the route switch**, and the fix was extracting it (`StageRoute`). A route whose component lives outside the switch is the pattern that already works — verified: typecheck stays clean with the 25th member. So the deep link SP-036 wrote off as an accepted cost was simply available all along | Proposed |
| **SP-086** | **Place photographs are real and licensed, or absent. Never AI** | The ART decision lets AI illustrate literary scenes, disclosed as "artistic interpretation … not depictions of real people". That was written for scenes. **An AI picture of Vilakazi Street depicts a real, identifiable address this app is telling someone to travel to**, and a reader would take it for a photograph of that street. Getting a person onto a plane with an invented image is a different order of wrong from an interpretive illustration. Tumo chose licensed photographs — which is also exactly what ART said it was waiting for: "commissioned, licensed and community-contributed artwork replaces them story by story as it becomes available" | Proposed |
| **SP-087** | **Credit and licence are shown on the page, not in a credits screen** | CC BY-SA attribution is a licence obligation, not a courtesy. A credit nobody scrolls to is not attribution | Proposed |
| **SP-088** | **`places.ts` stores an image FILE NAME; `place-images.ts` maps it to the asset** | `require()`-ing an image would make `places.ts` un-importable under `node --test` — the exact trap that forces `provinces.ts` to be read as text (SP-032). Keeping assets in a separate module keeps the data pure for both the test suite and the freshness script. A test pins every named file to a real entry | Proposed |
| **SP-089** | **`PlaceBody` is shared by the page and the in-reader sheet** | Two containers show a place: its page, and a sheet inside the article reader (a modal, which cannot navigate away without losing the reader's position). One body means the two can never tell the same place's story differently | Proposed |
| **SP-067** | **No coordinate can be sourced to SP-054 standard.** None of the four institutions publish decimal coordinates — museums publish street addresses. The candidates are Wikipedia, which SP-054 does not admit | *(Resolved by SP-073.)* Found doing the research, not anticipated when SP-014 chose to fill `coords`. By our own rule (SP-052: a coordinate is a factual claim) these cannot ship as they stand. **(a)** Tumo verifies each against an official map at the published street address, cited as such · **(b)** amend SP-054 to admit Wikipedia for locational facts only · **(c)** reverse SP-014 and drop `coords`. **Blocks TOUR-05b entirely.** Default if unanswered: **(a)** — keeps SP-054 intact, ~10 minutes of work | **Superseded → SP-073** |
| **SP-068** | **A street has no coordinate.** `vilakazi-street` can only carry a *representative* point, not a fact about the street | *(Resolved by SP-073 — a street simply carries no coordinate.)* The same shape problem that made a bike tour an `Experience` rather than a `Place` of `kind: "route"`, arriving now for a `street`. Either use the Mandela House corner and say so in `sources`, or make `coords` optional after all — which partly reopens SP-014 | **Superseded → SP-073** |
| **SP-063** | Retargeted by SP-058, unchanged in substance: **SP-018** (ships with zero records) now means `experiences.ts` ships empty · **SP-019** (`unverified` until `live`) is now `Experience.status` · **T5**, **SP-034**, **SP-047**, **SP-049** and **SP-056** all now operate on `Experience.url` | Recorded so the retargeting is deliberate rather than something read into the old rows later | Proposed |

### 4.12 Phase 10 — topics link to each other

Tumo, 2026-09-19: *"i want topics to be able to link to each other for examples mandela house to
mandela and vilakazi street to mandela house."* Asked who decides that two topics are linked, Tumo
chose **automatic name matching** over hand-authored rows, having been shown the risk that "the app
would assert connections nobody checked". Also chose: links **written once and shown both ways**,
**no `sources` field on a link**, and **the whole layer built but seeded thinly**.

| # | Decision | Why | Status |
|---|----------|-----|--------|
| **SP-090** | **Two tiers, and they are different kinds of statement.** A **curated link** is authored, carries a required `why`, and keeps the `direct`/`thematic` split. A **mention** is derived from prose, carries no `why` and no relation, and is labelled with the matched words themselves | Automatic matching cannot produce an editorial reason, and inventing one is the fabrication AGENTS.md §2 forbids. But **a mention is not a historical claim**: if a place's already-sourced prose contains the words "Vilakazi Street", making those words navigable asserts nothing new — it is a way to move, not a statement about the past. The two must therefore be different *types*, not two flavours of one | Proposed |
| **SP-091** | **Canonical direction is position in `CONTENT_KINDS`**, `place` last; same-kind links stored `from.id < to.id`. A test names the direction a wrongly-written row should have used | `place-links.ts` already says one direction is stored and the reverse derived, "because two stored directions drift". Generalising that from "content → place" to any→any needs a rule with no judgement in it. Ordering by declaration position is mechanical, and putting `place` last means **both existing seed rows stay byte-for-byte correct** | Proposed |
| **SP-092** | **The topic index and the mentions are GENERATED and checked in** (`topics.generated.ts`, `npm run gen:topics`), guarded by a test that re-derives them and `deepEqual`s | Not a style choice: `heroes`, `national-days`, `provinces`, `totems`, `journey` and `anthems` all `require()` image binaries, so reading them needs `node:fs` — which cannot ship in the React Native bundle. A runtime index would first require de-`require`-ing six files. Generating sidesteps that entirely, follows `images.generated.ts`, and gives the property this repo actually wants: **a prose edit that creates or destroys a link shows up as a row in the same diff** | Proposed |
| **SP-093** | **Only `{kind, id, name, routable}` and `{from, to, surface}` are generated — never the prose** | Copying sourced text into a generated file means an edit to `places.ts` can leave the app reasoning about stale words. Sourced prose stays single-homed in its registry, which is the whole point of T4 | Proposed |
| **SP-094** | **The matcher is exact, and this does not reopen SP-016.** `indexOf` + a word-boundary check + longest-span-wins. No stemming, no case folding, no edit distance | SP-016 bans "fuzzy name matching anywhere", and it is right to. This is a different operation: SP-016 forbids **identifying a record** by an approximate name (`landmarkLabel` must be the exact string). Here an exact name is being **found inside prose that already contains it** — no record is identified by resemblance, and nothing approximate is ever accepted. Recorded explicitly rather than read into SP-016 later, because the phrase "anywhere" is broad enough that a future reader deserves to see the question was asked | Proposed |
| **SP-095** | **Longest-span-wins is load-bearing, not a nicety** — and it is what makes hand-written surname aliases safe | `"Mandela"` is a word-bounded token inside `"Winnie Madikizela-Mandela"` (the hyphen is a boundary) and inside `"Mandela House"`. Because surfaces are tried longest-first and claim their characters, Winnie's name wins its own span before the alias can reach it. Without this the alias would mis-attribute her page to him. It gets the single most important test in the feature | Proposed |
| **SP-096** | **Exclusions are pair-scoped (`from → to` + a `why`), never a global surface blocklist**; aliases are hand-authored per topic | Killing the surface `"Mandela"` everywhere to fix one false positive is how a matcher quietly stops working while still looking maintained. A rejection should be as reviewable as an acceptance — the same reasoning as SP-024 | Proposed |
| **SP-097** | **No kind may be a link target before it has a route.** `article`, `day` and `journey` are indexed as *sources* only; a test fails any link pointing at them | A chip that looks tappable and does nothing is worse than no chip — the same reasoning SP-017 used to invent `alsoListedIn` | Proposed |
| **SP-098** | **`openRef` is one `as Route` cast, and the safety is bought back by a test over `App.tsx` read as text** | Adding a `case` per kind would re-approach the recursion trap SP-085 describes. A `Record<string, string \| undefined>` narrows nothing, exactly as `ATLAS_ROOMS` is a `Set<string>` for the same reason, and `navigateTo` already casts at App.tsx:239. The test is **stronger than the cast** — it checks the mapped route exists *and carries an id*, which the cast does not | Proposed |
| **SP-099** | **`place-links.ts` is renamed to `topic-links.ts`, not duplicated**, with `placesForContent`/`contentForPlace` kept as narrow bound wrappers | Its own header says why it exists: "one table, not a field on nine content files". A second table regresses against that. Keeping the two narrow wrappers makes the rename an import-path-only change for `VisitPanel` and `ArticleReader`, so the commit carries no behaviour | Proposed |

### 4.13 Phase 11 — a story told by scrolling

Tumo, 2026-09-19, pointing at the Rockstar GTA VI page: *"i want to introduce one feature as a
demo … where we tell the story as you scroll up with pictures and the story."* Chose **Soweto,
16 June 1976**, **reveal-on-scroll** over pinned parallax, and **its own route** rather than
replacing the home page.

| # | Decision | Why | Status |
|---|----------|-----|--------|
| **SP-100** | **A panel names a `placeId` or a `dayId`; it never carries its own image path.** The picture, its credit and its licence all come from that record | A story file choosing its own images is a story file that can illustrate one place with another's photograph, and a credit that can drift from the file it belongs to. Naming the record makes both impossible rather than merely discouraged (follows SP-086, SP-087) | Proposed |
| **SP-101** | **A documentary photograph gets a different panel from a place photograph.** Archival: shown WHOLE on black, never cropped, never darkened, caption beneath, story text below that. Place: cropped to fill, darkened from the text side so a headline can sit on it | A place photograph is scenery and cropping it loses nothing. A documentary photograph is evidence: cropping changes what it shows, and a headline across it is writing on the record. `NationalDaysScreen` already draws this line (`contentFit="contain"` when `imageCredit` is set) and the story screen must not quietly undo it | Proposed |
| **SP-102** | **Sam Nzima's photograph of Hector Pieterson MAY be used on the story screen** — Tumo, 2026-09-19, asked directly | It is the defining image of the day and the app already ships it, credited, on the National Days screen. It is also rights-encumbered press photography, so widening its use is a decision to take in the open rather than inside a feature. Recorded here so the next person knows it was asked and answered, not assumed. Rendered under SP-101 with the photographer, the people in the frame and the date | Locked |
| **SP-103** | **`RevealOnScroll` animates only once a scroll event has demonstrably ARRIVED** | Not defensive coding. The first version drove the value with `Animated.event(…, {useNativeDriver: true})`; measured in a browser, panel 1 sat at opacity 0.74 and panels 2–9 at exactly **0**. The value never moves on web, so every interpolation clamps to zero — a nine-panel showcase with one visible panel, and it looked correct in the first screenshot because the first panel is the one that works. The rule that falls out: a surface may decline to animate, never to render | Proposed |
| **SP-104** | **The Soweto story tells the correction, not the conventional account** — the last third names Sibongile Mkhabela, Winnie Motlalepula Kgware, Hermina Leroke, and Antoinette Sithole as a protester | The app holds `herstory-soweto-erasure` (Thando Sipuye, Pambazuka News) and summarises it approvingly: the familiar telling of 16 June is remembered through a small cast of male student leaders while the women who organised, marched, hid the students and were shot sit at the edges. Telling the standard version in the most visible feature in the app would have it contradict its own scholarship. A test fails if the names are edited out, and says why | Proposed |
| **SP-105** | **A scroll-told route must be in `OWN_SCROLL`** (App.tsx), so its own `Animated.ScrollView` is the element that scrolls | `story` was left out, so the shell's "page" mode wrapped the route in the shell's ScrollView and the story's own ScrollView was never height-constrained — it grew to its full content height, the shell did all the scrolling, and the story's `onScroll` never fired once. Measured: at scroll offset 300 the title card was still `opacity: 1, translateY(0px)` and the progress rule was empty. Every panel fell back to SP-103's plain render, so the screen looked finished and had **no motion in it at all**. A screen whose whole premise is interpolating its own scroll offset cannot let something else do the scrolling | Proposed |
| **SP-106** | **Every effect on the story screen is gated on the reader's reduced-motion setting** — `prefers-reduced-motion` on web, the OS toggle on Android and iOS | Parallax and rise-on-scroll are the textbook triggers for vestibular symptoms; shipping them unconditionally makes the app's most cinematic surface its least usable one for the readers most affected. Accessibility & Inclusivity is 20% of the rubric, so this is a requirement rather than a refinement. One gate in `RevealOnScroll` turns off the reveal, the stagger and the parallax together, and lands on the same branch as SP-103 — the story renders whole and readable, held still | Proposed |
| **SP-107** | **A panel already on screen when the scroll goes live never plays an entrance** (`liveFromY`) | SP-103 makes the animation opt-in on the first scroll event. The side effect was that at that instant every panel switched from plain rendering to an interpolation, including the ones the reader had been looking at since the page opened — on a short viewport the first panel evaluated to ~0.8 and visibly faded on the reader's first flick of the wheel. The reveal was animating something that had already arrived. The latch is one-way: scrolling back up must not re-run an entrance for a panel that has been read | Proposed |
| **SP-113** | **A pin is a layout problem, not an animation problem.** The held reading's frame is held by `position: sticky` on web, not by a JavaScript transform cancelling the scroll | Cancellation is the worst thing to ask of the main thread: the target is exact, so every millisecond the value is late — and every event `scrollEventThrottle` drops — shows as the held picture sliding against a scroll that never stopped. Reported as the image going up and down. `position: sticky` puts the pin and the scroll in the same compositor operation, where they cannot disagree; `react-native-web` supports it and uses it for its own sticky headers. Native keeps the transform (issue #44). Separating the pin (layout, free) from the beats (JS, gated) also stops the pin switching off whenever the beats do | Proposed |
| **SP-108** *(amended 21 Sep)* | **`In the place` is the DEFAULT reading**, not the opt-in one. **The Soweto story offers two readings, chosen on the title card: `Scroll` and `In the place`** — same nine panels, same photographs, same prose, different staging. The choice is session state: no store, no `localStorage`, nothing recorded about the reader | Tumo asked for a mode where the reader feels they are standing somewhere rather than being shown something, with the story arriving little by little. That is a genuinely different reading, not a setting: `Scroll` moves the places past the reader; `In the place` spends two to three screens of scroll in ONE place, holding the photograph still while the kicker, headline, body and link arrive on top of it, then holds the finished shot in silence for the last third. Kept as a mode rather than a replacement because the held reading triples the scroll length, and a reader who wants the story rather than the experience should not have to pay that. Session-only because a persisted reading preference is a fact about a person, and this app does not collect those without a reason (POPIA posture, D5) | Proposed |
| **SP-109** | **A held shot never contains a documentary photograph.** When the held reading reaches Sam Nzima's photograph it stops staging and falls back to the ordinary panel | A stage is a full-bleed crop, with a headline across it, under a scrim that deepens — precisely the three things SP-101 forbids for that photograph, delivered at the most immersive moment in the app. There is no version of the mode that earns an exception for the best picture in the story. The fallback reads as the story putting the camera down when it reaches the record, which is the right thing for it to do there anyway. Guarded by the existing `stories.test.ts` checks: the archival branch requires both an image and a credit, and a panel may not name both a place and a day | Proposed |
| **SP-110** | **A panel stops animating once it is more than three screens from the reader**, and decides that for itself by listening to the scroll value rather than being told by its parent | There is no native animation driver on web, so every `setValue` walks each attached node and writes its style synchronously inside the scroll handler. Measured on the Soweto story: **46 animated nodes, all rewritten on every scroll event**, in a 535px viewport looking at a 4499px story — roughly forty writes per event for content nobody could see. Three main-thread blocks of 91ms, 57ms and 112ms in one pass down the page; at a 16.7ms frame budget the worst of those drops seven frames, which is what "not smooth" was. After: **one block of 78ms, and 23 animated nodes** — 70% less total blocking. Three screens, not one, because a reveal begins one screen below the fold: at three, a panel switches on at its own resting value (0 below, 1 above) so nothing moves as it crosses. Each panel owning its own answer matters — the parent-tells-children version re-renders all nine panels whenever the number changes and measured no better | Proposed |
| **SP-111** | **An asset lookup that cannot resolve returns nothing, and the caller shows nothing** — never a substitute picture | `placeImageId` accepted only `typeof source === "number"`, which is what `require()` of a bundled asset returns on Android and iOS. On web it returns a URL string. The check therefore failed for every caller on the shipped platform, returned undefined, and Home's `?? heroSource(...)` fallback quietly supplied a generic Atlas illustration — so the card for a story about Soweto in 1976 advertised it with rock art, and had done since the card shipped. A fallback that renders is indistinguishable from a lookup that works, which is exactly why it hid. The lookup now handles all three shapes and `Section.image` is optional: a missing photograph costs the section its picture, visibly, rather than borrowing an unrelated one | Proposed |
| **SP-112** | **On a scrolling surface, fade things in — never move them in.** Nothing whose POSITION comes from the scroll value survives on the story screen: the parallax drift and settling zoom are deleted, the panel reveal, the per-line stagger, the staged beats and the title card's exit are all opacity-only. `scrollEventThrottle` is **1**, not 16. The two remaining movements are timer-driven with the page standing still — the title card's entrance and the "Scroll" cue's bob — and have nothing to be out of step with | Tumo, twice: *"the animation is bad and not smooth"*, then *"it feels like the image is vibrating when I scroll."* Two causes, both structural. (1) The browser scrolls the panel on the compositor; a scroll-linked transform on the picture inside it is computed in JS, so the two are only as synchronised as the main thread manages that frame — and `react-native-web` implements `scrollEventThrottle` as `Date.now() - lastTick >= throttle`, so at 16 a 120Hz display or a precision trackpad (both firing about every 8ms) has **every other event dropped**. The frame moves; the picture inside it moves in unequal steps; that difference is the vibration. (2) A continuously changing scale resamples the photograph every frame, which makes fine detail crawl — railings, brick courses, foliage, all present in these pictures. That one is a rendering artefact, not a timing one, and no scheduling fix touches it. Removing the photograph's motion fixed the picture but left the panels still arriving on a scroll-driven `translateY`, and Tumo confirmed that judder too — so the rule was taken to its conclusion. **An opacity that is a frame late is invisible**, because nothing about where anything IS depends on it; there is no reference against which to notice it. That is the whole argument. It costs a flourish and buys a story that cannot judder by construction. Verified in the DOM: zero scroll-driven transforms anywhere on the screen, 23 nodes driven by opacity. This also restores what the file's own header always said the reference page does — scale and restraint, *not* parallax | Proposed |
| **SP-114** | **A story opens as a BOOK, the app's reading convention** — Book is the default reading of Sixteen June; `In the place` and `Scroll` are the second and third chips, reachable from the book's top bar and from the scroll readings' title card. Amends SP-108 (the held reading is no longer the default) | Tumo, 24 Sep: the site already has a storytelling convention — the literary modules open in `CinematicReader` as a paper spread with a page turn — and a story should follow it and open that way. `StoryBook` reuses the same `Book`, `PaperPage` and `NavButton` (moved to `Book.tsx`, not copied), so it is literally the same object. Title spread first, one spread per panel, sources last (`storySpreads`, tested). Every photograph rule carries over: images, credits and licences come from the place record (SP-100, SP-087); Nzima's photograph is shown whole (`contain`) on a dark plate with its caption under it, never cropped or darkened (SP-101, SP-109); a typographic beat borrows no picture. The page turn is skipped under reduced motion (SP-106), which now also applies to the literary Reader. Session-only, as SP-108 | Proposed |
| **SP-115** | **The story book is narrated in the reader's language.** The book reading carries its own language picker and a Listen button; it shows the story's machine drafts (`story-drafts.data.ts`, all ten non-English languages), each labelled an unreviewed draft, and Listen reads the page in the language its text is ACTUALLY in (`resolveText().lang`). Engine routing is untouched: ElevenLabs for English and Afrikaans, Botlhale for the nine indigenous languages once keyed, the device voice beneath — no indigenous language can reach ElevenLabs (`select.test.ts`). Where the device voice is all there is and it is unlikely to know the language, the book says so. The scroll readings stay English (SP-015 holds for them); `sources` is never translated | Tumo, 24 Sep: voice reading in several languages, ElevenLabs for the voice, book reading only. ElevenLabs cannot speak text that does not exist and in this app speaks English and Afrikaans only (checked 30 Aug; CLAUDE.md forbids routing an indigenous language to it), so Tumo chose drafts for the text and the existing ladder for the voice. The drafts are translation only: `story-drafts.test.ts` fails if any draft drops a person, place or organisation its English carries, or changes a year or number. They are not a review; confidence is uneven by language (the header says which), and LANG-13 asks a speaker | Proposed |
| **SP-116** | **Setswana is voiced by Botlhale, not ElevenLabs** — and the Botlhale client is made ready for a real account: it trades a non-expiring `refresh_token` (EXPO_PUBLIC_BOTLHALE_REFRESH_TOKEN) for a 24-hour `IdToken` at `/auth/generate` itself, sends the passage as both `text` and `text_msg`, downloads the returned audio into a data URI so the narration cache keeps it, and skips Botlhale for siSwati and isiNdebele, which its TTS does not list | Tumo, 24 Sep, on hearing the device voice read Setswana: *"wire up eleven labs for the setwana cause thats bad reading"*. Offered the three routes — re-check ElevenLabs, Botlhale, or force ElevenLabs against CLAUDE.md — Tumo chose Botlhale, the only engine that actually speaks Setswana. Its docs (read 24 Sep) settled two of the three [NEEDS] in `botlhale.ts`: auth is refresh → IdToken (86400 s), and the field is documented both ways. Remaining [VERIFY]: Tshivenda is written `vr-ZA` in their list; we send `ve-ZA`. The credential is bundled into the web client like the ElevenLabs key (issue #43), and a refresh token does not expire — revoke it after a demo | Proposed |

---

## 5. Stage A — the data layer

**What it is:** two new data files and their tests. **No component file is touched, no UI exists at
the end of it, and nothing is visible in the app.**

| # | File | What changes | Done when |
|---|---|---|---|
| **TOUR-01** | `content/places.ts` *(new)* | `Place`, `VisitInfo`, `PlaceKind` per SP-011…SP-021 | Typecheck clean; a `Place` literal without `sources` fails to compile |
| **TOUR-02** | `content/place-links.ts` *(new)* | `ContentRef`, `PlaceRelation`, `PLACE_LINKS` per SP-022…SP-026 | The diff touches two new files and **no existing content file** |
| **TOUR-03** | `content/place-links.test.ts` *(new)* | `placesForContent`, `contentForPlace`, `citiesWithPlaces` | `npm test` green; new tests run with `node_modules` absent |
| **TOUR-04** | §9 of this document | The `direct`/`thematic` rule, written with its reasoning | The rule is a paragraph someone else could apply unaided |
| **TOUR-05a** | `design/places-content.md` *(new)* | **The review sheet** (SP-053): four places, their drafted citations, their coordinates and where each coordinate came from, plus any `thematic` candidates | Tumo has reviewed it. Nothing reaches `places.ts` before this |
| **TOUR-05b** | `content/places.ts` | Approved rows become `Place` records. **Unapproved or ungrounded ones stay bare strings** (SP-028) | Every seeded place has non-empty `sources`; typecheck + tests green |

> **Gate A:** `npm run typecheck && npm test` green · every published place carries a source and a
> sourced coordinate · **zero `.tsx` files in the diff** · the review sheet is signed off.

### The Soweto seed

Four places. Under SP-027 I research and draft every citation; under SP-053 they land in
`design/places-content.md` for your review **before** any of them becomes code.

| `id` | `name` | `kind` | `cityId` / `alsoListedIn` | To research (SP-027, SP-052) | `visit` |
|---|---|---|---|---|---|
| `vilakazi-street` | Vilakazi Street | `street` | `soweto` | Source for the "only street to have housed two Nobel laureates" claim already in `City.origins` · coordinate | none — a street has no operator |
| `hector-pieterson-memorial` | Hector Pieterson Memorial & Museum | `museum` | `soweto` + `["johannesburg"]` | A citable reference behind `City.sources`' "the Hector Pieterson Museum" · coordinate | none in Stage A (SP-018) |
| `mandela-house` | Mandela House | `museum` | `soweto` + `["johannesburg"]` | Citation · coordinate | none in Stage A |
| `regina-mundi-church` | Regina Mundi Church | `church` | `soweto` | Citation · coordinate | none in Stage A |

**8 citations and 4 coordinates, reviewed in one pass** (SP-057). A coordinate is a factual claim:
wrong, it sends a real person to the wrong corner of Soweto (SP-052). **Nothing is invented** — what
I cannot ground under SP-054 comes back marked `[NEEDS SOURCE]`, and under SP-028 that place stays a
bare string rather than becoming an entity with invented provenance.

### The seed links

| Story | Place | `relation` | Why |
|---|---|---|---|
| `article:time-soweto-photograph` | `hector-pieterson-memorial` | `direct` | The photograph's subject and the memorial are the same event, in that place |
| `article:herstory-soweto-erasure` | `hector-pieterson-memorial` | `direct` | Same day, same uprising, same site |
| `city:soweto` | all published places | `direct` | The city screen lists its own landmarks |
| *candidates* | — | `thematic` | Proposed with the §9 test applied, for your approval (SP-030, SP-055). **If none is honest, none ships** and the branch keeps fixture-only coverage |

---

## 6. Stage B — the surfaces

**What it is:** the first stage a user can see. Two new components, one existing screen modified, one
existing reader modified. `shell/nav.ts` and `App.tsx`'s `Route` union are **not** touched (T7, SP-035).

| # | File | What changes | Done when |
|---|---|---|---|
| **TOUR-06** | `components/VisitPanel.tsx` *(new)* | The panel, beside the story at `wide` and stacked below it otherwise (SP-038) | A 16 June article shows the memorial beside the text on web and under it on a phone |
| **TOUR-07** | `components/PlaceView.tsx` *(new)* | Place detail as an overlay (SP-035): what it is, where, its sources, and an outbound link **only when `visit.status === "live"`** | A place with no `visit` renders with **no booking affordance at all** |
| **TOUR-08** | `components/ProvincesScreens.tsx` | Landmark chips at [:244](../app/src/components/ProvincesScreens.tsx) become pressable where a `Place` exists (SP-044) | Soweto's sourced landmarks open the overlay; 18 other cities' chips are byte-identical |
| **TOUR-09** | the new `UI = {}` blocks | Every new string in all 11 languages (SP-042) | `ui-coverage.test.ts` passes with no untranslated new key |
| **TOUR-10** | same files | a11y labels on every new control (SP-043) | A screen reader reaches every new control; the unlabelled count does not grow |

> **Gate B:** `shell/nav.ts` and `App.tsx` untouched · the 11-language sweep green · a screen reader
> reaches every new control · **a place with no verified `visit` implies no booking anywhere on
> screen** · Kids mode shows no outbound link (SP-040).

---

## 7. Stage C — keeping it true

**What it is:** the stage that stops the feature rotting. A link that dies silently is worse than a
link that was never there.

| # | File | What changes | Done when |
|---|---|---|---|
| **TOUR-11** | `app/scripts/check-place-links.mjs` *(new)* | `HEAD` each `visit.url`, report status and date (SP-046…SP-048) | A run prints every link with a status and a date. **Who acts on a `dead` result is T9 and stays open** |
| **TOUR-12** | `content/places.test.ts` | Test fails if any `visit.url` grows a query parameter or fragment (T5) | Adding `?ref=ubuntu` to a seed URL turns the suite red — **prove it by breaking it once** |
| **TOUR-13** | `sims_proposal.md` §3 | Soften "direct, **traceable**" (SP-050, §10) | The sent version claims only what the build can do |

> **Gate C:** a freshness run reports every link with a date · the no-identifier test genuinely fails
> when violated · the pitch wording matches the build.

---

## 8. Decisions resolved on 2026-09-18 — and what was rejected

**Open decisions: none.** All seven were answered by Tumo on 2026-09-18. The rejected options are
kept here on purpose: the next person to ask "why isn't there a Visit room / a single `cityId` / a
`thematic` fixture?" should find the answer without reopening the question.

| # | Chosen | Rejected, and why not |
|---|---|---|
| **SP-014** | `coords` in the type, **filled for all four** | *Drop it* — cheaper, but a map later means backfilling. *Optional and unfilled* — an unfilled optional field is indistinguishable from a forgotten one, and no test can tell you which |
| **SP-017** | `cityId` **+ `alsoListedIn`** | *Single owner* — would leave two Johannesburg chips looking tappable and not being. *Edit Johannesburg's landmarks* — cleanest data, but breaks SP-029 and quietly removes two landmarks a Joburg reader may expect |
| **SP-027** | **Research and cite all four** | *In-repo only* — would have shipped a 1–2 place pilot missing Mandela House and Regina Mundi, the two strongest tourism draws. *Research only the two uncovered* — smaller review burden, but leaves the memorial and Vilakazi Street resting on a thin in-repo line |
| **SP-030** | **Real candidates, proposed for approval** | *Fixture only* — proves the rule by test but never by content. *Drop `thematic`* — would leave the walkthrough's own open question answered in prose but not in code |
| **SP-032** | **Read `provinces.ts` as text** | *Extract `city-ids.ts`* — type-safe, but edits `provinces.ts` and still needs text-reading for `landmarkLabel` anyway. *Split the `.webp` requires out* — cleanest long-term, but refactors a 600-line content file that five-plus components depend on |
| **SP-040** | **Places yes, outbound links no, in Kids** | *Hide the layer entirely* — costs children the "a real place you could stand in" connection. *Adult-gate interstitial* — a weak gate, and a booking funnel in a children's product is hard to defend to a parent or a department |
| **T9** | **Tumo owns it; checked before every demo or send-out** | *Monthly schedule* — more disciplined but a recurring task to keep. *Defer until a partner exists* — leaves the mechanism unproven. **Revisit when** a partner wants a formal agreement, or links exceed ~20 |

**What is now waiting on you, and none of it blocks the start:** the review sheet from TOUR-05a —
8 citations, 4 coordinates, and any `thematic` candidates — in one pass (SP-057).

---

## 9. The editorial rule — `direct` vs `thematic` (TOUR-04)

> **A link is `direct` when the place is where the history happened, or where the person lived,
> worked, or is memorialised. Everything else is `thematic`.**

The test is factual, not editorial: *did this event occur here, or did this person occupy this
place?* If answering needs a chain of association — a topic related to a field related to a site —
it is `thematic`.

- `time-soweto-photograph` → Hector Pieterson Memorial is **direct**. The photograph was taken there, that day.
- Mandela → Vilakazi Street is **direct**. He lived at that address.
- Mathematics → an Egyptian site is **thematic**. The connection is a subject, not an event.

**Why it is load-bearing:** the two render differently and must never be collapsed. A `direct` link
may say *visit this*. A `thematic` link may only say *related* — no booking affordance, no "plan a
visit," never treated as the story's location. Collapsing them would let the app imply that standing
in a place puts you where the history happened when it does not: the invented-heritage failure
[AGENTS.md §2](../AGENTS.md) exists to prevent, arrived at through layout rather than prose, but
arrived at all the same.

**When a link is genuinely arguable, it is `thematic`.** The cost of under-claiming is a weaker card;
the cost of over-claiming is a false historical statement.

---

## 10. What this build cannot claim

The pitch's §3 phrase "a **direct, traceable** contribution to heritage tourism" is half true, and
the false half must be corrected before the document is sent (SP-050 / TOUR-13).

Measuring that a visit or a spend happened means attributing a click to a person — tracking
parameters, click IDs, or an analytics handshake with the partner. That is precisely what
[05-popia-compliance.md](05-popia-compliance.md) exists to prevent, and it would apply to minors in
Kids mode. **T5 forecloses it deliberately.**

- ✅ v1 **routes** users toward specific, named heritage businesses and sites.
- ✅ v1 can report **how many places and operators are linked**, and how many links are live.
- ❌ v1 **cannot** report visits, bookings, or conversions.

If the Department requires attribution, that is a scoped negotiation with its own consent design —
not a flag to flip.

---

## 11. Guardrails

The feature, not overhead. Each one is enforced by a decision above, not by good intentions:

1. **No invented heritage.** No `sources`, no `Place` — it stays a string. *(T4, SP-011, SP-028)*
2. **No personal data for a referral.** Public URLs only, no identifiers. *(T5, SP-034)*
3. **Rights before publication.** Reuse [`canPublish`](../app/src/services/ingest/rights.ts); do not re-implement it.
4. **No dead ends.** A `dead` link is hidden. *(SP-049)*
5. **Nothing implies a booking the app cannot honour.** *(SP-019)*
6. **No URL enters the repo unverified by a human.** *(SP-021)*
7. **No booking path in front of a child.** *(SP-040)*

---

## 12. Delivery — what "done" means for this phase

All thirteen tasks closed, all three gates passed, and:

- Every place on screen traces to a source a reader can check, **and so does every coordinate** (SP-052).
- Every outbound link has been opened by a human and has a `lastChecked` date.
- `npm run check:place-links` is in the pre-send checklist, and Tumo has run it (T9, SP-056).
- The pitch document says only what the build does.
- Every decision taken along the way is in §4, including the ones that turned out wrong.

---

## 13. The pre-send checklist

SP-056 and §12 both require this and it did not exist until Stage C. Run it before any demo, or
before any document goes outside the project.

1. **`npm run check:place-links`.** Exit 0 or stop. A `✗` means the repo is making a claim it cannot
   support; exit 2 means the check could not complete, which is *not* the same thing and is not a
   reason to send.
2. **Act on anything dead by hand.** The script never edits — a dead link becomes
   `status: "dead"`, kept not deleted (SP-049).
3. **Take your numbers from that run, not from memory.** The inventory it prints is exactly what §10
   permits claiming. If a figure is not in that output, do not put it in the document.
4. **Check no `[VERIFY]` source is load-bearing** for any claim in what you are sending. Those are
   sourced but not to the standard SP-054 sets.
5. **Re-read for tense.** The build moves faster than the prose; "does" and "will" drift.
6. **Fill the team-size line** in `sims_proposal.md` — it currently carries a placeholder on purpose.

## 14. Document changelog

| Date | Change |
|---|---|
| 2026-09-18 | Created. T7 and T8 recorded as locked; Stage A sequenced. |
| 2026-09-18 | Rewritten as a full decision register — all three stages planned to decision level, 50 `SP-*` rows added, 6 open decisions isolated in §8. Stage B decisions SP-035/SP-036 added after finding the route-union typecheck note in `App.tsx` and the `ArticleReader` modal precedent. SP-032 added after verifying `provinces.ts` cannot be imported under `node --test`. |
| 2026-09-18 | **All seven open decisions answered by Tumo.** SP-014, SP-017, SP-027, SP-030, SP-032, SP-040 and T9 moved to `Locked`; §8 became the record of what was chosen *and rejected*. Seven consequences registered as SP-051…SP-057 — the `landmarkLabel` multi-city test, coordinates as sourced factual claims, the `design/places-content.md` review sheet, what counts as a source, how thematic candidates are proposed, the `check:place-links` trigger, and batching the review into one pass. TOUR-05 split into **05a** (review sheet) and **05b** (code), so no citation becomes code before it is reviewed. |
