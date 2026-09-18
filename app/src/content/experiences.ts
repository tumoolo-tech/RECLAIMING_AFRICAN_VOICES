// Bookable experiences — the only file in this project that points a reader at a commercial offer.
//
// An Experience is a thing you can go and do, and it visits one or more Places. A Soweto bike tour
// visits four; a museum's own ticketed entry visits one. Modelling both as the same shape is
// deliberate (SP-058): the alternative — a booking hanging off a single place — forced a four-stop
// tour to either pick one arbitrary stop or be copied onto all four, and left every downstream rule
// (freshness, the no-identifier test, the Kids rule) handling two shapes forever.
//
// TRUTH STANDARD (SP-059). A Place needs a CITATION; an Experience needs VERIFICATION. There is no
// `sources` field here on purpose — an Experience's provenance is the operator's own `url`, and the
// guarantee behind it is that no URL enters this repo without a human having opened it (SP-021).
//
// POPIA / T5. `url` is the operator's own page and carries NO user identifiers — no query
// parameters, no click IDs, no fingerprints, ever. This forecloses conversion tracking deliberately:
// attributing a click to a person is exactly the personal-data collection docs/05-popia-compliance.md
// exists to prevent, and it would apply to minors. A test enforces it (SP-034).
//
// KIDS MODE (SP-040, SP-062). Kids surfaces import `places.ts` and must NEVER import this file. A
// child gets the heritage, not the commercial path out of the app — enforced by the import graph
// rather than by remembering to hide a button.
//
// Decisions: docs/sim_plan.md §4.11 · seeded once a real operator URL has been verified.

import type { Place } from "./places.ts";

/** What the visitor actually does. No "other" (SP-013's rule, applied here too). */
export type ExperienceKind = "guided-tour" | "ticketed-entry" | "self-guided";

/** Whether this can be shown. New links start "unverified" and render nothing: the default state is
 *  silence, not optimism (SP-019). A "dead" link is hidden, never shown hopefully (SP-049). */
export type ExperienceStatus = "live" | "unverified" | "dead";

export type Experience = {
  /** Globally unique, kebab-case: "soweto-bike-tour". */
  id: string;
  name: string;
  /** Who actually runs it — a real operator, museum, or visitor centre. */
  operator: string;
  /** The operator's OWN page. No identifiers appended, ever (T5). */
  url: string;
  kind: ExperienceKind;
  /** The places it visits, in route order → `places.ts` Place.id. One stop is normal. */
  placeIds: string[];
  /** ISO date: when a HUMAN last opened this URL and confirmed the offer is real.
   *  `npm run check:place-links` reports on this date but deliberately never writes it — a server
   *  answering is not the same fact as a person confirming (SP-076). */
  lastChecked: string;
  status: ExperienceStatus;
};

/** Seeded once an operator URL has been verified by a human — deliberately empty (SP-018, SP-021). */
export const experiences: Experience[] = [];

export const experienceById = (id: string): Experience | undefined =>
  experiences.find((e) => e.id === id);

/** The cities an experience touches, derived from its places rather than stored — one source of
 *  truth, so a tour that grows a stop in another city cannot go stale in a hand-set field (SP-060). */
export const citiesForExperience = (e: Experience, all: Place[]): string[] =>
  [...new Set(e.placeIds.map((id) => all.find((p) => p.id === id)?.cityId).filter((c): c is string => !!c))];

// ── Resolvers ────────────────────────────────────────────────────────────────────────────────────
//
// Pure core + bound wrapper, as in `place-links.ts` (SP-064).
//
// TWO functions on purpose (SP-065). `experiencesAtPlace` returns everything, whatever its status —
// that is the freshness script's view. `bookableAtPlace` returns only what is `live`, and that is
// the ONLY one a UI should call. Filtering here rather than in the component means a Stage B surface
// cannot render a dead or unverified booking even by mistake; the rule lives in one function instead
// of in every component that ever shows a place.

/** Everything at this place, any status. For the freshness script and for honest counting. */
export function resolveExperiencesAt(placeId: string, all: Experience[]): Experience[] {
  return all.filter((e) => e.placeIds.includes(placeId));
}

/** Only what can honestly be offered. A "dead" link is hidden, not shown hopefully (SP-049); an
 *  "unverified" one has never been opened by a human, so it says nothing (SP-019, SP-021). */
export function resolveBookableAt(placeId: string, all: Experience[]): Experience[] {
  return resolveExperiencesAt(placeId, all).filter((e) => e.status === "live");
}

export const experiencesAtPlace = (placeId: string): Experience[] =>
  resolveExperiencesAt(placeId, experiences);

export const bookableAtPlace = (placeId: string): Experience[] =>
  resolveBookableAt(placeId, experiences);
