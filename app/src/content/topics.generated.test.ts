import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TOPICS, MENTIONS } from "./topics.generated.ts";
import { TOPIC_ALIASES } from "./topic-aliases.ts";
import { TOPIC_EXCLUSIONS } from "./topic-exclusions.ts";
import { CONTENT_KINDS, TOPIC_LINKS } from "./topic-links.ts";

// `topics.generated.ts` is written by `npm run gen:topics` and read by the app. These tests are
// what stop the two drifting — and, more importantly, they are the reason a DERIVED link is
// reviewable at all. Edit a place's prose so it stops naming another topic and this suite goes
// red, so the lost link lands in the same diff as the sentence that lost it.

test("the generated file is current — run npm run gen:topics if this fails", () => {
  // The generator's own --check mode does the comparison, because re-implementing "what would be
  // generated" here is exactly the mistake articles.test.ts makes with its sort (SP-064).
  const before = readFileSync(new URL("./topics.generated.ts", import.meta.url), "utf8");
  try {
    // Through scripts/run-ts.mjs, not straight at node: the generator imports `.ts`, which needs
    // --experimental-strip-types below Node 22.18 and must NOT be given the flag on 26+. Hard-coded
    // flags here made this test fail on a contributor's Node 22.16 with "stale" when the file was
    // current — the generator had crashed, and a crash reads the same as a difference (issue #40).
    execFileSync(
      process.execPath,
      ["scripts/run-ts.mjs", "scripts/gen-topics.mjs", "--check"],
      { cwd: fileURLToPath(new URL("../../", import.meta.url)), stdio: "pipe" },
    );
  } catch (e) {
    assert.fail(
      "src/content changed and topics.generated.ts is stale.\n" +
        "   Fix: npm run gen:topics — then read the added/removed rows before committing.\n" +
        String((e as { stderr?: Buffer }).stderr ?? ""),
    );
  }
  const after = readFileSync(new URL("./topics.generated.ts", import.meta.url), "utf8");
  assert.equal(before, after, "--check must not write");
});

test("every topic has a name to match on and a kind that exists", () => {
  for (const t of TOPICS) {
    assert.ok(t.name.trim().length > 0, `${t.kind}:${t.id} has no name`);
    assert.ok((CONTENT_KINDS as readonly string[]).includes(t.kind), `${t.kind} is not a ContentKind`);
  }
});

test("ids are unique within a kind — across kinds they are not, which is why refs carry a kind", () => {
  const seen = new Set<string>();
  for (const t of TOPICS) {
    const key = `${t.kind}:${t.id}`;
    assert.ok(!seen.has(key), `duplicate topic ${key}`);
    seen.add(key);
  }
  // No assertion that ids DO collide across kinds. They do across all of src/content (54 of them,
  // mostly journey.ts reusing other registries' ids), but journey is not indexed yet, so asserting
  // it here would be testing folklore rather than this file.
});

test("both ends of every mention resolve to a real topic", () => {
  const known = new Set(TOPICS.map((t) => `${t.kind}:${t.id}`));
  for (const m of MENTIONS) {
    assert.ok(known.has(`${m.from.kind}:${m.from.id}`), `mention from ${m.from.kind}:${m.from.id} does not resolve`);
    assert.ok(known.has(`${m.to.kind}:${m.to.id}`), `mention to ${m.to.kind}:${m.to.id} does not resolve`);
  }
});

test("no mention points at a kind that has no route — a dead chip is worse than none", () => {
  // SP-097. `article`, `day` and `journey` are indexed as sources only.
  const routable = new Map(TOPICS.map((t) => [`${t.kind}:${t.id}`, t.routable]));
  for (const m of MENTIONS) {
    assert.ok(
      routable.get(`${m.to.kind}:${m.to.id}`),
      `mention → ${m.to.kind}:${m.to.id} targets an unroutable kind`,
    );
  }
});

test("no mention duplicates a curated link — the authored reason must win", () => {
  // If both tiers pointed at the same pair, a page would show the connection twice: once with its
  // reason and once as bare words. The curated row is the better statement, so the mention is
  // redundant and should be excluded rather than rendered alongside it.
  const curated = new Set(
    TOPIC_LINKS.flatMap((l) => [
      `${l.from.kind}:${l.from.id}→${l.to.kind}:${l.to.id}`,
      `${l.to.kind}:${l.to.id}→${l.from.kind}:${l.from.id}`,
    ]),
  );
  for (const m of MENTIONS) {
    const key = `${m.from.kind}:${m.from.id}→${m.to.kind}:${m.to.id}`;
    assert.ok(!curated.has(key), `${key} is both a curated link and a mention — exclude the mention`);
  }
});

test("a mention never carries a reason — the derived tier cannot assert one (SP-090)", () => {
  for (const m of MENTIONS) {
    assert.deepEqual(Object.keys(m).sort(), ["from", "surface", "to"], `${m.from.id}→${m.to.id}`);
  }
});

test("every alias earns its place — one that matches nothing is dead data", () => {
  // Aliases are hand-written and only justified by the prose they unlock. If a prose edit makes one
  // redundant it must be deleted, not left behind looking like it is doing something.
  for (const [key, list] of Object.entries(TOPIC_ALIASES)) {
    for (const alias of list) {
      assert.ok(
        MENTIONS.some((m) => `${m.to.kind}:${m.to.id}` === key && m.surface === alias),
        `alias "${alias}" for ${key} matches nothing — delete it or fix it`,
      );
    }
  }
});

test("every exclusion names real topics, gives a reason, and is actually suppressing", () => {
  // What this CAN check: the pair exists and is absent from MENTIONS. What it cannot: whether the
  // mention would reappear if the exclusion were lifted — that needs the prose, and the generated
  // file deliberately does not carry it (SP-093). `npm run check:topic-links` does that half,
  // where the registries are readable, and reports any exclusion that has stopped doing work.
  const known = new Set(TOPICS.map((t) => `${t.kind}:${t.id}`));
  for (const e of TOPIC_EXCLUSIONS) {
    const from = `${e.from.kind}:${e.from.id}`;
    const to = `${e.to.kind}:${e.to.id}`;
    assert.ok(known.has(from), `exclusion from ${from} names a topic that does not exist`);
    assert.ok(known.has(to), `exclusion to ${to} names a topic that does not exist`);
    assert.ok(e.why.trim().length > 10, `exclusion ${from}→${to} needs a real reason, not a stub`);
    assert.ok(
      !MENTIONS.some((m) => `${m.from.kind}:${m.from.id}` === from && `${m.to.kind}:${m.to.id}` === to),
      `${from}→${to} is excluded but still in MENTIONS — regenerate`,
    );
  }
});
