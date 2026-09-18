import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolvePlacesFor,
  resolveContentFor,
  resolveCitiesWithPlaces,
  PLACE_LINKS,
  type PlaceLink,
} from "./place-links.ts";
import { places, type Place } from "./places.ts";

// The registry is the only thing joining a story to a place you can stand in. These tests pin the
// rules that make that join trustworthy — and they are written BEFORE the data (TOUR-05b) so the
// data cannot land wrong.
//
// Behavioural tests below use fixtures, which is the whole reason the resolvers take their data as
// arguments (SP-064). Integrity tests run over the real registry and currently pass vacuously,
// because it is empty. That proves nothing today; it is a trap set for the moment real links arrive.

const place = (id: string, cityId = "soweto", alsoListedIn?: string[]): Place => ({
  id,
  name: id,
  cityId,
  alsoListedIn,
  landmarkLabel: id,
  kind: "site",
  what: "why it matters",
  coords: { lat: 0, lng: 0 },
  sources: "a real citation",
});

test("placesForContent matches on BOTH kind and id — an id alone is ambiguous", () => {
  // 51 ids in src/content appear in more than one file. "eastern-cape" is a journey stage AND a
  // province; "de-klerk" is a journey stage AND a president. If the join key were the id alone, the
  // registry would silently link the wrong thing and no other test would notice — both ids are real.
  const all = [place("dzata-ruins", "thohoyandou"), place("regina-mundi-church")];
  const links: PlaceLink[] = [
    { ref: { kind: "journey", id: "eastern-cape" }, placeId: "dzata-ruins", relation: "direct", why: "x" },
    { ref: { kind: "city", id: "eastern-cape" }, placeId: "regina-mundi-church", relation: "direct", why: "y" },
  ];

  const fromJourney = resolvePlacesFor({ kind: "journey", id: "eastern-cape" }, links, all);
  assert.deepEqual(fromJourney.map((x) => x.place.id), ["dzata-ruins"]);

  const fromCity = resolvePlacesFor({ kind: "city", id: "eastern-cape" }, links, all);
  assert.deepEqual(fromCity.map((x) => x.place.id), ["regina-mundi-church"]);
});

test("direct always comes before thematic, whatever order the registry is written in", () => {
  const all = [place("a"), place("b"), place("c")];
  const ref = { kind: "article", id: "time-soweto-photograph" } as const;
  const links: PlaceLink[] = [
    { ref, placeId: "a", relation: "thematic", why: "loosely related" },
    { ref, placeId: "b", relation: "direct", why: "it happened here" },
    { ref, placeId: "c", relation: "thematic", why: "loosely related" },
  ];

  const got = resolvePlacesFor(ref, links, all);
  assert.deepEqual(got.map((x) => x.place.id), ["b", "a", "c"], "direct first, then registry order");
  assert.equal(got[0].relation, "direct");
});

test("the resolver hands over relation and why, so the UI never has to look them up again", () => {
  // SP-041: a direct link may say "visit this"; a thematic one may only say "related". The caller
  // cannot make that distinction without the relation, so it travels with the place.
  const all = [place("mandela-house")];
  const ref = { kind: "president", id: "mandela" } as const;
  const links: PlaceLink[] = [{ ref, placeId: "mandela-house", relation: "direct", why: "he lived here" }];

  const [got] = resolvePlacesFor(ref, links, all);
  assert.equal(got.relation, "direct");
  assert.equal(got.why, "he lived here");
});

test("a link pointing at a place that does not exist is dropped, not thrown on", () => {
  // A dangling link must not blank a reader's screen. The integrity test below is what stops one
  // ever shipping; this is the runtime behaviour if one somehow does.
  const ref = { kind: "article", id: "x" } as const;
  const links: PlaceLink[] = [{ ref, placeId: "does-not-exist", relation: "direct", why: "w" }];
  assert.deepEqual(resolvePlacesFor(ref, links, [place("real")]), []);
});

test("contentForPlace derives the reverse direction rather than storing it", () => {
  const links: PlaceLink[] = [
    { ref: { kind: "article", id: "herstory-soweto-erasure" }, placeId: "hp", relation: "thematic", why: "t" },
    { ref: { kind: "article", id: "time-soweto-photograph" }, placeId: "hp", relation: "direct", why: "d" },
    { ref: { kind: "city", id: "soweto" }, placeId: "other", relation: "direct", why: "d" },
  ];
  const got = resolveContentFor("hp", links);
  assert.deepEqual(got.map((x) => x.ref.id), ["time-soweto-photograph", "herstory-soweto-erasure"]);
  assert.ok(got.every((x) => x.ref.kind === "article"), "only links to this place come back");
});

test("citiesWithPlaces includes alsoListedIn cities, deduped and deterministic", () => {
  // Johannesburg lists the Hector Pieterson Memorial and Mandela House; both are in Soweto (SP-017).
  // Joburg must appear — and appear once, however many of its listed places are elsewhere.
  const all = [
    place("hector-pieterson-memorial", "soweto", ["johannesburg"]),
    place("mandela-house", "soweto", ["johannesburg"]),
    place("vilakazi-street", "soweto"),
  ];
  assert.deepEqual(resolveCitiesWithPlaces(all), ["johannesburg", "soweto"]);
});

// ── Integrity: over the real registry ────────────────────────────────────────────────────────────
// Vacuous while PLACE_LINKS is empty. That is deliberate — see the header note.

test("every link points at a place that exists", () => {
  for (const l of PLACE_LINKS) {
    assert.ok(
      places.some((p) => p.id === l.placeId),
      `link ${l.ref.kind}:${l.ref.id} → "${l.placeId}" does not resolve to a place`,
    );
  }
});

test("every link explains itself — the editorial call has to be reviewable", () => {
  for (const l of PLACE_LINKS) {
    assert.ok(
      l.why.trim().length > 10,
      `link ${l.ref.kind}:${l.ref.id} → ${l.placeId} needs a real reason, not a stub`,
    );
  }
});

test("no duplicate links — the same story must not point at the same place twice", () => {
  const seen = new Set<string>();
  for (const l of PLACE_LINKS) {
    const key = `${l.ref.kind}:${l.ref.id}→${l.placeId}`;
    assert.ok(!seen.has(key), `duplicate link ${key}`);
    seen.add(key);
  }
});
