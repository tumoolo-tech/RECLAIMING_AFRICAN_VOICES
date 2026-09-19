import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRelated, relatedTo, topicFor, type Topic } from "./topics.ts";
import type { Mention } from "./topic-mentions.ts";
import type { ContentRef, ResolvedLink } from "./topic-links.ts";

// What a screen asks for, and the three rules that decide what it gets back. Fixtures, so the
// rules are provable independently of whatever prose is in the repo this week (SP-064).

const topic = (kind: ContentRef["kind"], id: string, name: string): Topic =>
  ({ kind, id, name, routable: true });

const STREET = topic("place", "vilakazi-street", "Vilakazi Street");
const HOUSE = topic("place", "mandela-house", "Mandela House");
const MANDELA = topic("president", "mandela", "Nelson Mandela");
const ALL = [STREET, HOUSE, MANDELA];

const ref = (t: Topic): ContentRef => ({ kind: t.kind, id: t.id });
const mention = (from: Topic, to: Topic, surface = to.name): Mention =>
  ({ from: ref(from), to: ref(to), surface });

test("a mutual pair shows once, as outgoing — not twice under two headings", () => {
  // Vilakazi Street names Mandela House AND Mandela House names Vilakazi Street: two records, one
  // relationship. Rendering both puts the same topic under "Also mentioned here" and "Mentioned
  // in" on the same page, which reads as a bug. Outgoing wins because those are the words on THIS
  // page, which a reader can go and check.
  const got = resolveRelated(ref(STREET), [], [mention(STREET, HOUSE), mention(HOUSE, STREET)], ALL);
  assert.equal(got.mentions.length, 1);
  assert.equal(got.mentions[0].topic.id, "mandela-house");
  assert.equal(got.mentions[0].direction, "out");
  assert.equal(got.mentions[0].surface, "Mandela House", "the surface from THIS page's prose");
});

test("the reverse is derived — a topic named by another sees it without a row being written", () => {
  // The whole of "write once, show both ways". Nothing about Mandela House was authored for the
  // street's page, and nothing about the street was authored for the house's.
  const got = resolveRelated(ref(HOUSE), [], [mention(STREET, HOUSE)], ALL);
  assert.deepEqual(
    got.mentions.map((m) => [m.topic.id, m.direction]),
    [["vilakazi-street", "in"]],
  );
});

test("a curated link beats a mention for the same pair — the authored reason wins", () => {
  // Otherwise the page says the connection twice: once with a reason someone wrote, once as bare
  // words. The reason is the better statement.
  const link: ResolvedLink = {
    other: ref(MANDELA), relation: "direct", why: "He lived at 8115 from 1946.", direction: "out",
  };
  const got = resolveRelated(ref(STREET), [link], [mention(STREET, MANDELA)], ALL);
  assert.equal(got.curated.length, 1);
  assert.deepEqual(got.mentions, [], "the mention is redundant once a reason exists");
});

test("a mention of a topic that does not resolve is dropped, not rendered blank", () => {
  const ghost = { from: ref(STREET), to: { kind: "place" as const, id: "gone" }, surface: "Gone" };
  assert.deepEqual(resolveRelated(ref(STREET), [], [ghost], ALL).mentions, []);
});

test("a curated link whose other end does not resolve is dropped too", () => {
  const link: ResolvedLink = {
    other: { kind: "place", id: "gone" }, relation: "direct", why: "x", direction: "out",
  };
  assert.deepEqual(resolveRelated(ref(STREET), [link], [], ALL).curated, []);
});

test("mentions of other topics entirely are not this topic's business", () => {
  assert.deepEqual(resolveRelated(ref(STREET), [], [mention(HOUSE, MANDELA)], ALL).mentions, []);
});

// ── Over the real registry ───────────────────────────────────────────────────────────────────────

test("Tumo's two examples both work, in both directions", () => {
  // The literal ask: "mandela house to mandela and vilakazi street to mandela house".
  const street = relatedTo({ kind: "place", id: "vilakazi-street" });
  const names = (r: typeof street) => r.mentions.map((m) => m.topic.name);
  assert.ok(names(street).includes("Mandela House"), "vilakazi-street → mandela-house");

  const house = relatedTo({ kind: "place", id: "mandela-house" });
  assert.ok(names(house).includes("Nelson Mandela"), "mandela-house → mandela");
  assert.ok(names(house).includes("Vilakazi Street"), "mandela-house → vilakazi-street");

  // And the half nobody wrote: his page knows about the house.
  const mandela = relatedTo({ kind: "president", id: "mandela" });
  assert.ok(names(mandela).includes("Mandela House"), "mandela ← mandela-house, derived");
});

test("no topic shows the same other topic twice, anywhere in the real data", () => {
  // The mutual-pair bug, checked across every topic rather than one fixture.
  for (const kind of ["place", "president", "hero", "module"] as const) {
    for (const t of [{ kind, id: "mandela" }, { kind, id: "vilakazi-street" }, { kind, id: "robben-island" }]) {
      if (!topicFor(t)) continue;
      const r = relatedTo(t);
      const keys = [...r.curated.map((c) => c.topic), ...r.mentions.map((m) => m.topic)]
        .map((x) => `${x.kind}:${x.id}`);
      assert.equal(new Set(keys).size, keys.length, `${t.kind}:${t.id} lists a topic twice`);
    }
  }
});

test("topicFor resolves a real ref and returns undefined for a ghost", () => {
  assert.equal(topicFor({ kind: "president", id: "mandela" })?.name, "Nelson Mandela");
  assert.equal(topicFor({ kind: "president", id: "nobody" }), undefined);
  assert.equal(topicFor({ kind: "place", id: "mandela" }), undefined, "kind matters — ids collide");
});
