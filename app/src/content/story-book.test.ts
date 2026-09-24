import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sowetoStory, stories } from "./stories.ts";
import { storySpreads } from "./story-book.ts";

// Read from source rather than imported — national-days.ts `require()`s image binaries (SP-032).
// Same record-slicing as stories.test.ts.
const daysSrc = readFileSync(new URL("./national-days.ts", import.meta.url), "utf8");
const hasArchivalPhoto = (dayId: string) => {
  const at = daysSrc.indexOf(`id: "${dayId}"`);
  if (at === -1) return false;
  const block = daysSrc.slice(at);
  const next = block.search(/\n {4}id: "/);
  const record = next === -1 ? block : block.slice(0, next);
  return /image: require\(/.test(record) && /imageCredit:/.test(record);
};

test("a story opens on its title and closes on its sources, one spread per panel between", () => {
  for (const story of stories) {
    const spreads = storySpreads(story, hasArchivalPhoto);
    assert.equal(spreads.length, story.panels.length + 2);
    assert.equal(spreads[0].kind, "title");
    assert.equal(spreads[spreads.length - 1].kind, "sources");
    story.panels.forEach((p, i) => {
      const s = spreads[i + 1];
      assert.ok("panel" in s && s.panel.id === p.id, `spread ${i + 1} should be panel ${p.id}`);
    });
  }
});

test("Sixteen June: four places, Nzima's photograph as the one archival spread, four typographic beats", () => {
  const spreads = storySpreads(sowetoStory, hasArchivalPhoto);
  const count = (k: string) => spreads.filter((s) => s.kind === k).length;
  assert.equal(count("place"), 4);
  assert.equal(count("archival"), 1);
  assert.equal(count("type"), 4);
  const archival = spreads.find((s) => s.kind === "archival");
  assert.ok(archival && "panel" in archival && archival.panel.dayId === "youth-day");
});

test("a day without a credited photograph becomes a typographic beat, never an empty plate", () => {
  const spreads = storySpreads(sowetoStory, () => false);
  assert.equal(spreads.filter((s) => s.kind === "archival").length, 0);
  assert.equal(spreads.filter((s) => s.kind === "type").length, 5);
});
