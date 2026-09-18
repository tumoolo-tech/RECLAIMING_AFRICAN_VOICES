// Real, visitable places — the layer that turns a story into somewhere you can stand.
//
// A Place is geography and history: what this place is, where it is, and the source that says so.
// It knows nothing about tickets. Everything bookable lives in `experiences.ts` (SP-058), because a
// booking is not a property of a place — one tour visits four of them, and a museum that closes must
// not delete the street it stands on.
//
// INTEGRITY (AGENTS.md §4): `sources` is REQUIRED, so a place with no citation does not compile. An
// unsourced landmark stays a bare string in `provinces.ts` rather than being promoted into an entity
// with invented provenance. `coords` is required for the same reason it is sourced: a wrong
// coordinate sends a real person to the wrong corner of Soweto (SP-052).
//
// Decisions: docs/sim_plan.md §4.4 · seeded in TOUR-05b, after the review sheet is signed off.

/** What kind of thing this is. No "other" — an escape hatch is where unclassifiable junk collects. */
export type PlaceKind = "museum" | "street" | "site" | "route" | "monument" | "church";

export type Place = {
  /** Globally unique, kebab-case: "hector-pieterson-memorial". */
  id: string;
  name: string;
  /** The city this place is physically IN → `provinces.ts` City.id. */
  cityId: string;
  /** Other cities whose `landmarks` list it without being where it is. Soweto's memorial and
   *  Mandela House are also listed under Johannesburg, and both should resolve here rather than
   *  leaving a chip that looks tappable and is not (SP-017). */
  alsoListedIn?: string[];
  /** The EXACT string this place appears as in `provinces.ts` `City.landmarks`. Pinned rather than
   *  name-matched: the chip reads "Hector Pieterson Memorial" while the museum's own name carries
   *  "& Museum", and no fuzzy matching is allowed anywhere (SP-016). A test fails if it stops
   *  appearing in `cityId` or in any `alsoListedIn` city (SP-051). */
  landmarkLabel: string;
  kind: PlaceKind;
  /** Why it matters — sourced prose. English only, like the rest of `src/content` (SP-015). */
  what: string;
  /** A factual claim like any other, and cited in `sources` accordingly (SP-014, SP-052). */
  coords: { lat: number; lng: number };
  /** REQUIRED. Where the history AND the coordinate come from. No source, no place (T4). */
  sources: string;
};

/** Seeded in TOUR-05b — deliberately empty until the review sheet is signed off (SP-053). */
export const places: Place[] = [];

export const placeById = (id: string): Place | undefined => places.find((p) => p.id === id);
