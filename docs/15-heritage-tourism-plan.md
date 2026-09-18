# 15 — Heritage tourism: from a story to a place you can stand in

> **Source documents:** [sims_proposal.md](sims_proposal.md) (the pitch — *why*) ·
> [sims_proposal_howitworks.md](sims_proposal_howitworks.md) (the walkthrough — *how*)
> **Live board:** [STATUS.md](../STATUS.md) · **Backlog:** [specs/tasks.md](../specs/tasks.md) (Phase 7, `TOUR-*`)
> **Status:** plan only. Nothing here is built. Written 2026-09-17.

---

## 1. Why

The pitch to the Department of Tourism rests on one mechanism: **curiosity about history → a real
place → a real local operator → an actual visit.** Everything before the arrow already exists in this
app. Everything after the second arrow does not.

Ubuntu Heritage today can tell you that Vilakazi Street is the only street to have housed two Nobel
laureates. It cannot tell you that you can walk down it on Tuesday, or who will take you there. The
gap between those two sentences is this entire plan.

The honest framing matters, because it keeps the scope small: this is **not** a new product. It is a
linking layer over content that is already researched, already sourced, and already on screen.

---

## 2. What already exists (do not rebuild any of this)

| What the proposals need | Where it already lives |
|---|---|
| Real places, province by province, city by city | [provinces.ts](../app/src/content/provinces.ts) — `Province → City` with `landmarks: string[]`, a `sources` field, and `Stat.status: "cited" \| "verify"` |
| Non-linear entry: by date, person, topic, map | [AtlasScreen.tsx](../app/src/components/AtlasScreen.tsx) · [journey.ts](../app/src/content/journey.ts) · [history-trail.ts](../app/src/content/history-trail.ts) · [presidents.ts](../app/src/content/presidents.ts) · [heroes.ts](../app/src/content/heroes.ts) · [national-days.ts](../app/src/content/national-days.ts) |
| Sourced long-form stories | [articles.ts](../app/src/content/articles.ts) — already carries `time-soweto-photograph` and `herstory-soweto-erasure`, both on 16 June 1976 |
| Oral history capture + consent | [services/archive/](../app/src/services/archive/) · [ConsentSheet.tsx](../app/src/components/ConsentSheet.tsx) · [mantswe/deidentify.ts](../app/src/services/mantswe/deidentify.ts) |
| "Literature only where rights are clear" | [ingest/rights.ts](../app/src/services/ingest/rights.ts) — `canIngest` / `canPublish` / `isPublicDomainByYear`. **The pitch's §2b rule is already code**: `"unverified"` blocks ingest and publish |
| The 7-stage content pipeline | [12-living-archive-plan.md](12-living-archive-plan.md) Feature A + [08-content-pipeline.md](08-content-pipeline.md), human-review gates included |
| "Anything uncertain is marked" | `[NEEDS SOURCE]` ([AGENTS.md](../AGENTS.md) §4) and `status: "cited" \| "verify"` in `provinces.ts` |
| AI-art disclosure | [AboutSourcesScreen.tsx](../app/src/components/AboutSourcesScreen.tsx) + [CinematicReader.tsx](../app/src/components/CinematicReader.tsx) — "Artistic interpretation" in **all 11 languages** |
| Offline-first, low-data | WatermelonDB + Supabase sync; PWA precaches a 4.13 MB shell and deliberately does **not** precache media |

The walkthrough's §2 content pipeline is, stage for stage, the pipeline already specified in
`docs/12`. It should be cross-referenced, not re-specified.

---

## 3. The gap — what genuinely does not exist

1. **No concept of a bookable thing.** Nothing in the codebase models an operator, a ticket, a tour,
   or a visit. There is no type, no data, no UI, no outbound link.
2. **`landmarks` is `string[]`.** Soweto's entry already lists `"Vilakazi Street"`,
   `"Hector Pieterson Memorial"`, `"Mandela House"`, `"Regina Mundi Church"` — as four bare strings.
   They are not entities, cannot be linked to, and carry no sources of their own.
3. **No story ↔ place relation.** A story about 16 June and a city called Soweto sit in different
   files with nothing joining them.
4. **No link freshness.** An outbound booking URL that dies is worse than no link at all, and nothing
   would notice.

That is the whole of the new work. Four things, and the first two are data.

---

## 4. Decisions

### Locked (from the source documents and existing architecture)

| # | Decision | Why |
|---|---|---|
| **T1** | **Referral links out only in v1.** Each place links to the operator's or museum's own booking page. No payments, no baskets, no partner APIs. | The walkthrough §3 Step 3 already stages it this way. It also keeps v1 POPIA-clean by construction: no personal data is collected to send someone to a public URL. |
| **T2** | **A place is a first-class entity; a booking is an attribute of it.** | Places outlive operators. A tour company folding must not delete Vilakazi Street. |
| **T3** | **Story ↔ place links live in one registry, not as a field on eight content types.** | Stories live across `articles`, `journey`, `heroes`, `presidents`, `national-days` and the four literary modules. Adding a `places` field to each means touching every content file and re-testing all of them. |
| **T4** | **Every place carries its own `sources`, same convention as `City.sources`.** A place with no source is not published. | [AGENTS.md](../AGENTS.md) §4. A tourism product that invents heritage is worse than one that omits it. |
| **T5** | **Referral URLs carry no user identifiers, ever.** No query parameters, no click IDs, no fingerprints. | See §7 — this forecloses conversion tracking, deliberately. |
| **T6** | **Pure-logic resolvers, unit-tested under `node --test`.** | Matches the existing 179 pure-logic tests, which run with no dependencies installed. |

### Answered by Tumo, 2026-09-18 — full register in [sim_plan.md §4](sim_plan.md#4-the-decision-register)

| # | Question | **Decision** | Was blocking |
|---|---|---|---|
| **T7** | **Where does this surface in the nav?** [13-architecture-v2-plan.md](13-architecture-v2-plan.md) **D1** locks the nav to `Journey · Watch · Atlas · Archive · Kids · Schools`. A "Visit" room would break D1; surfacing inside Atlas and Provinces would not. | **Inside Atlas + Provinces. No new room** — D1 stands and [shell/nav.ts](../app/src/components/shell/nav.ts) is not edited. | TOUR-06 onward — **unblocked** |
| **T8** | **Pilot breadth.** Soweto alone, or Soweto plus one more heritage-dense area? The pitch §8 says "one or two additional." | **Soweto only** for v1 — the content is already in `provinces.ts` and `articles.ts`, so no new research gates the mechanism. | TOUR-05 — **unblocked** |
| **T9** | **Who owns partner relationships** day to day once links exist and start going stale. | **Tumo owns it**, and runs the freshness check **before every demo or send-out** rather than on a schedule — honest for a solo project with a handful of links. Revisit when a partner wants a formal agreement, or links exceed ~20. | TOUR-11 — **unblocked** |

### Nothing is still open

Every question this document parked has been answered. The full record — including the options that
were rejected and why — is [sim_plan.md §8](sim_plan.md#8-decisions-resolved-on-2026-09-18--and-what-was-rejected).

---

## 5. The data model

> **The shape below is the original design sketch. The shipping shape is
> [sim_plan.md §4.4](sim_plan.md#44-stage-a--the-place-type)**, which differs in three ways decided on
> 2026-09-18: `coords` is **kept and filled** (SP-014), a place carries **`alsoListedIn`** for cities
> that list it without owning it (SP-017), and **`landmarkLabel`** pins each place to the exact
> `provinces.ts` string it corresponds to (SP-016).

Two new files, both pure data plus pure functions.

```ts
// app/src/content/places.ts
export type PlaceKind = "museum" | "street" | "site" | "route" | "monument" | "church";

export type VisitInfo = {
  operator: string;                 // "Hector Pieterson Museum"
  url: string;                      // the operator's OWN page — no identifiers appended (T5)
  kind: "museum-ticketing" | "tour-operator" | "visitor-centre";
  lastChecked: string;              // ISO date, set by the freshness script
  status: "live" | "unverified" | "dead";
};

export type Place = {
  id: string;                       // "vilakazi-street"
  name: string;
  cityId: string;                   // → provinces.ts City.id
  kind: PlaceKind;
  what: string;                     // why it matters — sourced prose
  sources: string;                  // REQUIRED (T4)
  coords?: { lat: number; lng: number };
  visit?: VisitInfo;                // absent = real place, nothing bookable yet
};
```

```ts
// app/src/content/place-links.ts
export type ContentKind = "article" | "journey" | "module" | "hero" | "president" | "day" | "city";
export type ContentRef = { kind: ContentKind; id: string };

/** "direct" = the event happened here, or the person lived here.
 *  "thematic" = a topical association only. The UI must not present these identically (TOUR-04). */
export type PlaceRelation = "direct" | "thematic";

export const PLACE_LINKS: Array<{
  ref: ContentRef;
  placeId: string;
  relation: PlaceRelation;
  why: string;                      // one line, so the editorial call is reviewable
}>;
```

`relation` answers the walkthrough's own open question — *how tightly must a story relate to a place
before it counts?* — by refusing to collapse the two cases. Mandela → Vilakazi Street is `direct`.
Mathematics → an Egyptian site is `thematic`, and renders as "related", never as "visit this".

**The pilot seed is already written.** Soweto's four landmark strings become the first four `Place`
records, and `time-soweto-photograph` → `hector-pieterson-memorial` is the first `direct` link.

---

## 6. Build order

Each stage ends at a gate that is a real check, not a vibe. Tasks are `TOUR-*` in
[specs/tasks.md](../specs/tasks.md).

**Stage A — the data layer.** `TOUR-01` … `TOUR-05`. Types, registry, resolvers, the editorial rule,
and the Soweto seed migrated out of `landmarks: string[]`.
→ **Gate:** `npm run typecheck` clean, new unit tests green, and every seeded place has a non-empty
`sources`. No UI yet.

**Stage B — the surfaces.** `TOUR-06` … `TOUR-10`. A visit panel beside the story (walkthrough Step
3 insists it is *beside*, not in a separate tab), a place detail view, tappable landmarks on the
Provinces screen, strings in all 11 languages, a11y labels.
→ **Gate:** T7 answered and honoured; the language sweep shows no untranslated new key; a screen
reader reaches every new control.

**Stage C — keeping it true.** `TOUR-11` … `TOUR-13`. The freshness script, the no-identifier
guardrail with a test, and an honest statement of what the app can and cannot claim.
→ **Gate:** a freshness run reports every link's status with a date, and the no-PII test fails if a
referral URL ever grows a query parameter.

---

## 7. What this cannot claim, and why that is in the plan

The pitch §3 says the path is a "**direct, traceable** contribution to heritage tourism." Under
**T5**, the *traceable* half is not true and should not be claimed.

Measuring that a visit or a spend actually happened requires attributing a click to a person —
tracking parameters, identifiers, or an analytics handshake with the partner. That is exactly the
personal-data collection [05-popia-compliance.md](05-popia-compliance.md) exists to prevent, and it
would apply to minors using Kids mode.

So v1 can honestly say it **routes** users toward specific heritage businesses, and can report how
many places and operators are linked. It cannot report conversions. If the Department requires
attribution, that is a scoped negotiation with its own consent design — not a flag to flip. **The
pitch wording should soften before it is sent.**

---

## 8. Open items

- **Nothing from this document is still open.** T7, T8 and T9 were all answered on 2026-09-18, along
  with six decisions this plan hadn't reached. [sim_plan.md](sim_plan.md) is the document the build
  is run from and holds the full register.
- **The art pivot.** AI illustration stays for now, by Tumo's decision (2026-09-17), and the pitch
  and walkthrough have been reworded to say so honestly rather than to claim a pivot that has not
  happened. Images are AI-generated, labelled "Artistic interpretation" in 11 languages, and never
  presented as photographs of real people. Commissioned, licensed, and community artwork replaces
  them **story by story as it becomes available** — a partnership could genuinely accelerate this by
  opening heritage-site image archives. Not scheduled, not a task below, and **not a blocker** for
  any `TOUR-*` work.
- **Pitch §7 — the actual ask** — is still an unfilled placeholder.
- **The byline** says "3-person team"; [CLAUDE.md](../CLAUDE.md) calls this a solo project. One of
  the two is out of date.
- **The name.** These documents say "Maloba"; the product was renamed **Ubuntu Heritage** on
  2026-07-03 ([README](README.md) naming note). Harmless internally, confusing in something sent to a
  department.

---

## 9. Guardrails (these are the feature, not overhead)

1. **No invented heritage.** A place with no `sources` does not ship. An unsourced landmark string
   stays a string rather than being promoted into an entity with invented provenance.
2. **No personal data for a referral.** Outbound links are public URLs. T5 is enforced by a test.
3. **Rights before publication** — reuse `canPublish`, do not re-implement it.
4. **No dead ends.** A `status: "dead"` link is hidden, not shown hopefully.
5. **Nothing implies a booking the app cannot honour.** A place with no `visit` shows what it is and
   where it is, and says nothing about tickets.
