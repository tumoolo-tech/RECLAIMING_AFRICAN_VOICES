import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveLinksFor,
  resolvePlacesFor,
  resolveContentFor,
  resolveCitiesWithPlaces,
  isCanonicalDirection,
  kindRank,
  CONTENT_KINDS,
  TOPIC_LINKS,
  type TopicLink,
  type ContentRef,
} from "./topic-links.ts";
import { places, type Place } from "./places.ts";
import { presidents } from "./presidents.ts";
import { articles } from "./articles.ts";

// The registry is the only thing joining a story to a place you can stand in, and now to a person
// as well. These tests pin the rules that make that join trustworthy.
//
// Behavioural tests below use fixtures, which is the whole reason the resolvers take their data as
// arguments (SP-064). Integrity tests run over the real registry. They were vacuous when the
// registry was empty; two rows in, they bite.

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

const link = (
  from: ContentRef,
  to: ContentRef,
  relation: "direct" | "thematic" = "direct",
  why = "a reason long enough to be real",
): TopicLink => ({ from, to, relation, why });

const art = (id: string): ContentRef => ({ kind: "article", id });
const pl = (id: string): ContentRef => ({ kind: "place", id });

test("placesForContent matches on BOTH kind and id — an id alone is ambiguous", () => {
  // 54 ids in src/content appear in more than one file. "eastern-cape" is a journey stage AND a
  // province; "mandela" is a journey stage AND a president. If the join key were the id alone, the
  // registry would silently link the wrong thing and no other test would notice — both ids are real.
  const all = [place("dzata-ruins", "thohoyandou"), place("regina-mundi-church")];
  const links = [
    link({ kind: "journey", id: "eastern-cape" }, pl("dzata-ruins")),
    link({ kind: "city", id: "eastern-cape" }, pl("regina-mundi-church")),
  ];

  const fromJourney = resolvePlacesFor({ kind: "journey", id: "eastern-cape" }, links, all);
  assert.deepEqual(fromJourney.map((x) => x.place.id), ["dzata-ruins"]);

  const fromCity = resolvePlacesFor({ kind: "city", id: "eastern-cape" }, links, all);
  assert.deepEqual(fromCity.map((x) => x.place.id), ["regina-mundi-church"]);
});

test("direct always comes before thematic, whatever order the registry is written in", () => {
  const all = [place("a"), place("b"), place("c")];
  const ref = art("time-soweto-photograph");
  const links = [
    link(ref, pl("a"), "thematic", "loosely related, but honestly so"),
    link(ref, pl("b"), "direct", "it happened right here"),
    link(ref, pl("c"), "thematic", "loosely related, but honestly so"),
  ];

  const got = resolvePlacesFor(ref, links, all);
  assert.deepEqual(got.map((x) => x.place.id), ["b", "a", "c"], "direct first, then registry order");
  assert.equal(got[0].relation, "direct");
});

test("the resolver hands over relation and why, so the UI never has to look them up again", () => {
  // SP-041: a direct link may say "visit this"; a thematic one may only say "related". The caller
  // cannot make that distinction without the relation, so it travels with the place.
  const all = [place("mandela-house")];
  const ref: ContentRef = { kind: "president", id: "mandela" };
  const links = [link(ref, pl("mandela-house"), "direct", "he lived here from 1946")];

  const [got] = resolvePlacesFor(ref, links, all);
  assert.equal(got.relation, "direct");
  assert.equal(got.why, "he lived here from 1946");
});

test("a link pointing at a place that does not exist is dropped, not thrown on", () => {
  // A dangling link must not blank a reader's screen. The integrity test below is what stops one
  // ever shipping; this is the runtime behaviour if one somehow does.
  const ref = art("x");
  const links = [link(ref, pl("does-not-exist"))];
  assert.deepEqual(resolvePlacesFor(ref, links, [place("real")]), []);
});

test("contentForPlace derives the reverse direction rather than storing it", () => {
  const links = [
    link(art("herstory-soweto-erasure"), pl("hp"), "thematic", "a thematic association only"),
    link(art("time-soweto-photograph"), pl("hp"), "direct", "the photograph was taken here"),
    link({ kind: "city", id: "soweto" }, pl("other"), "direct", "somewhere else entirely"),
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

// ── The general resolver: one row, both directions (SP-091) ──────────────────────────────────────

test("one stored row is visible from BOTH ends — this is 'write once, show both ways'", () => {
  // The whole reason the reverse is derived rather than stored: there is one sentence, and both
  // pages show it. If the reverse were a second row, the two could be edited apart.
  const links = [link(art("a-story"), pl("mandela-house"), "direct", "the story is set here")];

  const fromArticle = resolveLinksFor(art("a-story"), links);
  assert.deepEqual(fromArticle, [
    { other: pl("mandela-house"), relation: "direct", why: "the story is set here", direction: "out" },
  ]);

  const fromPlace = resolveLinksFor(pl("mandela-house"), links);
  assert.deepEqual(fromPlace, [
    { other: art("a-story"), relation: "direct", why: "the story is set here", direction: "in" },
  ]);

  assert.equal(fromArticle[0].why, fromPlace[0].why, "the same sentence, because there is one row");
});

test("a topic that appears on neither end gets nothing", () => {
  const links = [link(art("a-story"), pl("mandela-house"))];
  assert.deepEqual(resolveLinksFor(pl("vilakazi-street"), links), []);
});

test("place → place links resolve in both directions too", () => {
  // Tumo's second example. Same-kind links are the case the direction rule has to handle with ids
  // rather than kind rank.
  const links = [link(pl("mandela-house"), pl("vilakazi-street"), "direct", "the house is on the street")];
  assert.equal(resolveLinksFor(pl("mandela-house"), links)[0].direction, "out");
  assert.equal(resolveLinksFor(pl("vilakazi-street"), links)[0].direction, "in");
});

// ── The canonical direction rule (SP-091) ────────────────────────────────────────────────────────

test("kind rank orders by declaration, and `place` is last so old rows stayed correct", () => {
  assert.equal(kindRank("place"), CONTENT_KINDS.length - 1);
  assert.ok(kindRank("article") < kindRank("place"));
  assert.ok(kindRank("president") < kindRank("place"));
});

test("canonical direction: earlier kind first, and within a kind the smaller id first", () => {
  assert.ok(isCanonicalDirection(art("x"), pl("y")), "article before place");
  assert.ok(!isCanonicalDirection(pl("y"), art("x")), "place before article is backwards");
  assert.ok(isCanonicalDirection(pl("a"), pl("b")), "same kind, a before b");
  assert.ok(!isCanonicalDirection(pl("b"), pl("a")), "same kind, b before a is backwards");
  assert.ok(!isCanonicalDirection(pl("a"), pl("a")), "a row cannot point at itself");
});

// ── Integrity: over the real registry ────────────────────────────────────────────────────────────

/** Which registry each kind's ids must exist in. Kinds absent here are checked against the
 *  generated topic index instead, once LINK-03 lands. */
const RESOLVERS: Partial<Record<string, (id: string) => boolean>> = {
  place: (id) => places.some((p) => p.id === id),
  president: (id) => presidents.some((p) => p.id === id),
  article: (id) => articles.some((a) => a.id === id),
};

test("BOTH ends of every link resolve in their own registry", () => {
  // The old test only checked the `placeId` half, so a link from a president who does not exist
  // would have shipped silently. Closing that is half the point of widening the type (SP-026).
  for (const l of TOPIC_LINKS) {
    for (const [side, ref] of [["from", l.from], ["to", l.to]] as const) {
      const resolve = RESOLVERS[ref.kind];
      if (!resolve) continue; // not yet checkable — LINK-03 brings the rest
      assert.ok(
        resolve(ref.id),
        `link ${l.from.kind}:${l.from.id} → ${l.to.kind}:${l.to.id} has a ${side} that does not resolve`,
      );
    }
  }
});

test("every link is written in the canonical direction", () => {
  for (const l of TOPIC_LINKS) {
    assert.ok(
      isCanonicalDirection(l.from, l.to),
      `link ${l.from.kind}:${l.from.id} → ${l.to.kind}:${l.to.id} is written backwards — ` +
        `write it as ${l.to.kind}:${l.to.id} → ${l.from.kind}:${l.from.id} (SP-091)`,
    );
  }
});

test("every link explains itself — the editorial call has to be reviewable", () => {
  for (const l of TOPIC_LINKS) {
    assert.ok(
      l.why.trim().length > 10,
      `link ${l.from.kind}:${l.from.id} → ${l.to.kind}:${l.to.id} needs a real reason, not a stub`,
    );
  }
});

test("no pair is stored twice, in either direction", () => {
  // The direction rule makes a reversed duplicate impossible to write, but a test that only checked
  // one orientation would miss the day someone relaxes the rule.
  const seen = new Set<string>();
  for (const l of TOPIC_LINKS) {
    const a = `${l.from.kind}:${l.from.id}`;
    const b = `${l.to.kind}:${l.to.id}`;
    const key = [a, b].sort().join("↔");
    assert.ok(!seen.has(key), `duplicate link ${key}`);
    seen.add(key);
  }
});
