// Which topics point at which other topics — one table, not a field on nine content files.
//
// WAS `place-links.ts` (SP-099). It joined content → place and nothing else. Tumo asked for topics
// to link to each other in general — "mandela house to mandela and vilakazi street to mandela
// house" — so the destination became a `ContentRef` like the source. Renamed rather than duplicated:
// this file's own reason for existing is "one table, not a field on nine content files", and a
// second table would regress against it.
//
// WHY A REGISTRY (T3). The alternative was adding `links: string[]` to articles, journey, heroes,
// presidents, national-days and the four literary modules: nine content files touched and re-tested,
// and every future content type having to remember the field exists. One table means one thing to
// diff, one test, and one place to look when a link is wrong.
//
// DIRECTION — one stored, one derived (SP-091). Two stored directions is two things to keep in sync,
// and they drift. The old rule was "content → place, only", which worked because there was one
// destination type. The general rule is mechanical instead of editorial: a link is stored with
// `from` the kind appearing EARLIER in CONTENT_KINDS. `place` is last, so every link that used to be
// written content → place still is, byte for byte. A test names the direction a wrong row should
// have used.
//
// TWO TIERS, AND THEY ARE DIFFERENT KINDS OF STATEMENT (SP-090). A `TopicLink` here is AUTHORED: a
// person decided these two things are connected and wrote down why. The other tier lives in
// `topic-mentions.ts` — a `Mention` is DERIVED from prose that already names the other topic, and it
// deliberately has no `why` and no `relation` field, because nobody wrote one. Keeping them as
// separate types is what stops a component rendering an invented reason by mistake.
//
// THE CHAIN. This file knows nothing about `experiences.ts`, deliberately. The path is
// content → place → experiences: here you get from a 16 June article to the Hector Pieterson
// Memorial; `experiences.ts` gets you from that memorial to the tour that stops there. If a link
// pointed at an experience, an operator folding would orphan a STORY — and the history does not stop
// being about that place because a tour company closed.
//
// Decisions: docs/sim_plan.md §4.5 and §4.12 · the editorial rule for `relation` is §9.

import { places, type Place } from "./places.ts";

/** Every linkable topic type — and, because the array is ordered, the canonical direction (SP-091).
 *
 *  `place` is LAST on purpose. The rule "store with `from` the earlier kind" then reproduces the old
 *  content → place rule exactly, so no existing row had to be rewritten to adopt a general rule.
 *
 *  Adding a kind here is not enough to make it a link TARGET — see `ROUTABLE_KINDS` and SP-097. */
export const CONTENT_KINDS = [
  "article",
  "journey",
  "module",
  "hero",
  "president",
  "day",
  "city",
  "place",
] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

/** Which topic. BOTH fields are needed: ids are unique within a file and nothing makes them unique
 *  across files. 54 ids in src/content appear in more than one — "mandela" is a journey slide AND a
 *  president, "eastern-cape" is a journey slide AND a province, "vilakazi" is a slide AND a literary
 *  module. A bare id as the join key would be genuinely ambiguous, so `kind` is load-bearing rather
 *  than defensive. */
export type ContentRef = { kind: ContentKind; id: string };

/** Position in CONTENT_KINDS. The whole canonical-direction rule is this one number. */
export const kindRank = (kind: ContentKind): number => CONTENT_KINDS.indexOf(kind);

/** Is this link written the way SP-091 says it must be? Earlier kind first; within one kind, the
 *  lexicographically smaller id first. No judgement, so a test can enforce it and say what the row
 *  should have looked like. */
export function isCanonicalDirection(from: ContentRef, to: ContentRef): boolean {
  const a = kindRank(from.kind);
  const b = kindRank(to.kind);
  return a !== b ? a < b : from.id < to.id;
}

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
 *  arrived at through layout rather than prose. When a link is arguable, it is thematic.
 *
 *  A MENTION IS NEITHER. It is not a weaker `thematic`; it is not an editorial call at all. That is
 *  why `Mention` does not carry this type. */
export type PlaceRelation = "direct" | "thematic";

export type TopicLink = {
  from: ContentRef;
  /** Both ends resolve, and a test fails if either does not (SP-026). Note the old shape was
   *  `placeId: string` — widening it to a ref is the whole of this change. */
  to: ContentRef;
  relation: PlaceRelation;
  /** REQUIRED. One line, so the editorial call is reviewable in six months without asking whoever
   *  made it (SP-024). This is the field a derived mention cannot have. */
  why: string;
};

/** The old name, kept because `check-place-links.mjs` and two components read it. */
export type PlaceLink = TopicLink;

/** Seeded 2026-09-18 (TOUR-05b), re-keyed to `from`/`to` 2026-09-19.
 *
 *  Still only `article → place`, because those are the only links a surface reads today. Links for
 *  `president`, `hero`, `day` and the literary `module`s are LINK-10's job, and until a surface
 *  renders them they would be dead data — which rots.
 *
 *  The city screen does NOT use this registry: it resolves places through `landmarkLabel` against
 *  `provinces.ts`, so a `city:` link would be redundant.
 *
 *  One `thematic` candidate is deliberately NOT seeded and awaits Tumo's ruling — `module:vilakazi`
 *  → `vilakazi-street`, on the grounds that the street is named after the poet whose Inkondlo
 *  kaZulu is one of this app's four literary pillars. Arguable both ways, and §9 says an arguable
 *  link is thematic, not direct (SP-030, SP-055). */
export const TOPIC_LINKS: TopicLink[] = [
  {
    from: { kind: "article", id: "time-soweto-photograph" },
    to: { kind: "place", id: "hector-pieterson-memorial" },
    relation: "direct",
    why: "The article is about Sam Nzima's photograph of Hector Pieterson's death on 16 June 1976; this is the place that memorialises him and that day.",
  },
  {
    from: { kind: "article", id: "herstory-soweto-erasure" },
    to: { kind: "place", id: "hector-pieterson-memorial" },
    relation: "direct",
    why: "The article is about the same uprising and the same photograph, arguing Antoinette Sithole is remembered as Hector's sister rather than as a protester in her own right.",
  },

  // LINK-10, 2026-09-19. All `direct` under the §9 test — the event happened there, or the person
  // lived, worked, was held or is buried there. Every `why` restates a fact already carried by the
  // sourced prose of BOTH ends; nothing below adds a claim that was not already published and
  // cited, which is what makes them safe to write without a new citation.
  //
  // DIRECT ONLY. SP-030 reserves thematic candidates for Tumo's approval one at a time, so the
  // arguable ones are NOT here — they are listed in STATUS.md for a ruling, along with the
  // `module:vilakazi → vilakazi-street` candidate parked since TOUR-05b.

  {
    from: { kind: "day", id: "youth-day" },
    to: { kind: "place", id: "hector-pieterson-memorial" },
    relation: "direct",
    why: "Youth Day commemorates the Soweto Uprising of 16 June 1976, and this is the memorial to the schoolchildren killed on that march — it opened on 16 June 2002, near the place Hector Pieterson was shot.",
  },
  {
    from: { kind: "president", id: "mandela" },
    to: { kind: "place", id: "mvezo" },
    relation: "direct",
    why: "He was born here on 18 July 1918, and his umbilical cord is buried here in Xhosa tradition.",
  },
  {
    from: { kind: "president", id: "mandela" },
    to: { kind: "place", id: "qunu" },
    relation: "direct",
    why: "His mother brought the family here after his father's death; he described the childhood he spent here as the happiest part of his life, and he chose to be buried here.",
  },
  {
    from: { kind: "president", id: "mandela" },
    to: { kind: "place", id: "mandela-house" },
    relation: "direct",
    why: "He lived in this four-roomed house at 8115 Vilakazi Street from 1946, gave it to the Soweto Heritage Trust in 1997, and on his release described it as the centre point of his world.",
  },
  {
    from: { kind: "president", id: "mandela" },
    to: { kind: "place", id: "robben-island" },
    relation: "direct",
    why: "He was held here for eighteen of his twenty-seven years in prison.",
  },
  {
    from: { kind: "president", id: "mandela" },
    to: { kind: "place", id: "nelson-mandela-museum" },
    relation: "direct",
    why: "The museum is about his life, across three sites: the Bhunga Building in Mthatha, Qunu where he grew up, and Mvezo where he was born.",
  },
  {
    from: { kind: "hero", id: "winnie" },
    to: { kind: "place", id: "constitution-hill" },
    relation: "direct",
    why: "She was detained in this prison complex, as were Mahatma Gandhi, Nelson Mandela, Albertina Sisulu and Fatima Meer.",
  },
  {
    from: { kind: "hero", id: "sobukwe" },
    to: { kind: "place", id: "robben-island" },
    relation: "direct",
    why: "He was held here in isolation under the General Law Amendment Act clause written for him alone and renewed yearly — the provision that became known as the Sobukwe clause.",
  },
  {
    from: { kind: "module", id: "mhudi" },
    to: { kind: "place", id: "sol-plaatje-house" },
    relation: "direct",
    why: "Sol Plaatje, who wrote Mhudi, lived in this house on Angel Street from 1927 until his death in 1932; it is now a museum and a library of African literature.",
  },
];

/** The old name. `check-place-links.mjs` imports this. */
export const PLACE_LINKS = TOPIC_LINKS;

// ── Resolvers ────────────────────────────────────────────────────────────────────────────────────
//
// Each one is a PURE core that takes its data, plus a thin wrapper bound to the real registries
// (SP-064). A resolver reading module state directly could only be tested "empty in, empty out" —
// every rule below would go untested. `articles.test.ts` shows that failure mode: it rebuilds the
// sort inline rather than calling the function, so it passes even if the real sort is wrong.

/** One end of a link, seen from the other end.
 *
 *  `direction` says which side was STORED: "out" means this topic is the row's `from`, "in" means it
 *  is the row's `to` and this result was derived. The UI needs it to word the heading — "what
 *  happened here" reads differently from "mentioned in" — but the `why` is the same sentence either
 *  way, because one row is the single source of truth (SP-091). */
export type ResolvedLink = {
  other: ContentRef;
  relation: PlaceRelation;
  why: string;
  direction: "out" | "in";
};

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

/** Pure core: everything linked to a topic, both the stored side and the derived side, in one list.
 *
 *  This is the general resolver the other two are now special cases of. A topic appearing on both
 *  ends of the same row is impossible by SP-091 (a row cannot be its own reverse), so no dedupe is
 *  needed here — the direction test is what guarantees it. */
export function resolveLinksFor(ref: ContentRef, links: TopicLink[]): ResolvedLink[] {
  const out: ResolvedLink[] = [];
  for (const l of links) {
    if (sameRef(l.from, ref)) {
      out.push({ other: l.to, relation: l.relation, why: l.why, direction: "out" });
    } else if (sameRef(l.to, ref)) {
      out.push({ other: l.from, relation: l.relation, why: l.why, direction: "in" });
    }
  }
  return out.sort(byRelation);
}

/** Pure core: the places a piece of content points at. A link whose target does not resolve is
 *  DROPPED rather than thrown on — a dangling link should not blank a reader's screen. The test in
 *  `topic-links.test.ts` is what makes sure one never ships (SP-026).
 *
 *  Narrow wrapper over `resolveLinksFor`: it keeps `VisitPanel` unchanged across the rename. */
export function resolvePlacesFor(ref: ContentRef, links: TopicLink[], all: Place[]): LinkedPlace[] {
  return resolveLinksFor(ref, links)
    .filter((r) => r.other.kind === "place")
    .map((r) => ({ place: all.find((p) => p.id === r.other.id), relation: r.relation, why: r.why }))
    .filter((x): x is LinkedPlace => !!x.place);
}

/** Pure core: the stories about a place. Still DERIVED — one direction is the source of truth and
 *  the other is computed, so the two cannot drift apart.
 *
 *  Excludes places, so "what happened here" does not list a neighbouring place as a story. Place↔
 *  place links surface under their own heading. */
export function resolveContentFor(placeId: string, links: TopicLink[]): LinkedContent[] {
  return resolveLinksFor({ kind: "place", id: placeId }, links)
    .filter((r) => r.other.kind !== "place")
    .map((r) => ({ ref: r.other, relation: r.relation, why: r.why }));
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

// Bound to the real registries — what the surfaces call.
export const linksFor = (ref: ContentRef): ResolvedLink[] => resolveLinksFor(ref, TOPIC_LINKS);

export const placesForContent = (ref: ContentRef): LinkedPlace[] =>
  resolvePlacesFor(ref, TOPIC_LINKS, places);

export const contentForPlace = (placeId: string): LinkedContent[] =>
  resolveContentFor(placeId, TOPIC_LINKS);

export const citiesWithPlaces = (): string[] => resolveCitiesWithPlaces(places);
