// Which stories point at which places — one table, not a field on nine content files.
//
// WHY A REGISTRY (T3). The alternative was adding `places: string[]` to articles, journey, heroes,
// presidents, national-days and the four literary modules: nine content files touched and re-tested,
// and every future content type having to remember the field exists. One table means one thing to
// diff, one test, and one place to look when a link is wrong.
//
// DIRECTION. Content → place, only. The reverse — what happened at this place — is DERIVED by a
// resolver (TOUR-03), never stored. Two stored directions is two things to keep in sync, and they
// drift.
//
// THE CHAIN. This file knows nothing about `experiences.ts`, deliberately. The path is
// content → place → experiences: here you get from a 16 June article to the Hector Pieterson
// Memorial; `experiences.ts` gets you from that memorial to the tour that stops there. If a link
// pointed at an experience, an operator folding would orphan a STORY — and the history does not stop
// being about that place because a tour company closed.
//
// Decisions: docs/sim_plan.md §4.5 · the editorial rule for `relation` is §9 · seeded in TOUR-05b.

import { places, type Place } from "./places.ts";

/** Every content type a place can be linked from. Only "article" and "city" are seeded in the Soweto
 *  pilot (SP-022); declaring the rest costs nothing and avoids a type change the first time a hero
 *  gets a place. */
export type ContentKind =
  | "article"
  | "journey"
  | "module"
  | "hero"
  | "president"
  | "day"
  | "city";

/** Which piece of content. BOTH fields are needed: ids are unique within a file and nothing makes
 *  them unique across files. 51 ids in src/content appear in more than one — "eastern-cape" is a
 *  journey stage AND a province, "de-klerk" is a journey stage AND a president. A bare id as the
 *  join key would be genuinely ambiguous, so `kind` is load-bearing rather than defensive. */
export type ContentRef = { kind: ContentKind; id: string };

/** The editorial call, made data.
 *
 *  "direct"   — the event happened here, or the person lived, worked, or is memorialised here.
 *  "thematic" — a topical association only.
 *
 *  The test is factual, not editorial: did this event occur here, or did this person occupy this
 *  place? Mandela → Vilakazi Street is direct; mathematics → an Egyptian site is thematic. The two
 *  MUST render differently (SP-041): a direct link may say "visit this", a thematic one may only say
 *  "related". Collapsing them would let the app imply that standing somewhere puts you where the
 *  history happened when it does not — the invented-heritage failure AGENTS.md §2 exists to prevent,
 *  arrived at through layout rather than prose. When a link is arguable, it is thematic. */
export type PlaceRelation = "direct" | "thematic";

export type PlaceLink = {
  ref: ContentRef;
  /** → `places.ts` Place.id. A test fails if it does not resolve (SP-026). */
  placeId: string;
  relation: PlaceRelation;
  /** REQUIRED. One line, so the editorial call is reviewable in six months without asking whoever
   *  made it (SP-024). */
  why: string;
};

/** TOUR-05b. Seeded 2026-09-18.
 *
 *  Only `article` links are here, because `article` is the only content type a surface currently
 *  reads — `VisitPanel` is wired into `ArticleReader` and nowhere else yet. Links for `president`,
 *  `hero`, `day` and the literary `module`s would be dead data today, and dead data rots.
 *
 *  The city screen does NOT use this registry: it resolves places through `landmarkLabel` against
 *  `provinces.ts`, so a `city:` link would be redundant.
 *
 *  One `thematic` candidate is deliberately NOT seeded and awaits Tumo's ruling — `module:vilakazi`
 *  → `vilakazi-street`, on the grounds that the street is named after the poet whose Inkondlo
 *  kaZulu is one of this app's four literary pillars. Arguable both ways, and §9 says an arguable
 *  link is thematic, not direct (SP-030, SP-055). */
export const PLACE_LINKS: PlaceLink[] = [
  {
    ref: { kind: "article", id: "time-soweto-photograph" },
    placeId: "hector-pieterson-memorial",
    relation: "direct",
    why: "The article is about Sam Nzima's photograph of Hector Pieterson's death on 16 June 1976; this is the place that memorialises him and that day.",
  },
  {
    ref: { kind: "article", id: "herstory-soweto-erasure" },
    placeId: "hector-pieterson-memorial",
    relation: "direct",
    why: "The article is about the same uprising and the same photograph, arguing Antoinette Sithole is remembered as Hector's sister rather than as a protester in her own right.",
  },
];

// ── Resolvers ────────────────────────────────────────────────────────────────────────────────────
//
// Each one is a PURE core that takes its data, plus a thin wrapper bound to the real registries
// (SP-064). The registries are empty until TOUR-05b, so a resolver reading module state directly
// could only be tested "empty in, empty out" — every rule below would go untested for three more
// tasks. `articles.test.ts` shows that failure mode: it rebuilds the sort inline rather than calling
// the function, so it passes even if the real sort is wrong.

/** A place, carrying WHY this story points at it — the UI needs `relation` to decide between
 *  "visit this" and "related" (SP-041), so the resolver hands it over rather than making the caller
 *  look it up again. */
export type LinkedPlace = { place: Place; relation: PlaceRelation; why: string };

/** A story, carrying the same. */
export type LinkedContent = { ref: ContentRef; relation: PlaceRelation; why: string };

/** Both halves must match. `id` alone is ambiguous — see the note on `ContentRef`. */
const sameRef = (a: ContentRef, b: ContentRef): boolean => a.kind === b.kind && a.id === b.id;

/** `direct` before `thematic`, always (SP-025), so no caller can render them as equals by accident.
 *  Ties keep registry order, which is the order a human wrote and can therefore reason about. */
const byRelation = (a: { relation: PlaceRelation }, b: { relation: PlaceRelation }): number =>
  (a.relation === "direct" ? 0 : 1) - (b.relation === "direct" ? 0 : 1);

/** Pure core: the places a piece of content points at. A link whose `placeId` does not resolve is
 *  DROPPED rather than thrown on — a dangling link should not blank a reader's screen. The test in
 *  `place-links.test.ts` is what makes sure one never ships (SP-026). */
export function resolvePlacesFor(ref: ContentRef, links: PlaceLink[], all: Place[]): LinkedPlace[] {
  return links
    .filter((l) => sameRef(l.ref, ref))
    .map((l) => ({ place: all.find((p) => p.id === l.placeId), relation: l.relation, why: l.why }))
    .filter((x): x is LinkedPlace => !!x.place)
    .sort(byRelation);
}

/** Pure core: the stories about a place. DERIVED, never stored — one direction is the source of
 *  truth and the other is computed, so the two cannot drift apart. */
export function resolveContentFor(placeId: string, links: PlaceLink[]): LinkedContent[] {
  return links
    .filter((l) => l.placeId === placeId)
    .map((l) => ({ ref: l.ref, relation: l.relation, why: l.why }))
    .sort(byRelation);
}

/** Pure core: every city with something to show. Includes `alsoListedIn`, so Johannesburg appears
 *  because it lists the Hector Pieterson Memorial even though the memorial is in Soweto (SP-017).
 *  Sorted, so the output is deterministic rather than registry-order-dependent. */
export function resolveCitiesWithPlaces(all: Place[]): string[] {
  const ids = new Set<string>();
  for (const p of all) {
    ids.add(p.cityId);
    for (const c of p.alsoListedIn ?? []) ids.add(c);
  }
  return [...ids].sort();
}

// Bound to the real registries — what Stage B calls.
export const placesForContent = (ref: ContentRef): LinkedPlace[] =>
  resolvePlacesFor(ref, PLACE_LINKS, places);

export const contentForPlace = (placeId: string): LinkedContent[] =>
  resolveContentFor(placeId, PLACE_LINKS);

export const citiesWithPlaces = (): string[] => resolveCitiesWithPlaces(places);
