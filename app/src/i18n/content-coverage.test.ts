import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { LANGUAGES } from "./languages.ts";
import { countLocalizedIn, totalCounts, isContentFile, type Counts } from "./coverage.ts";

// A RATCHET, not a target.
//
// `ui-coverage.test.ts` can demand perfection of UI chrome because a button label is a short
// string anyone can write. Content is different: translating sourced history into Setswana is
// authorship, and a machine doing it and calling it reviewed is exactly the fabrication AGENTS.md
// §4 forbids. So this test does not demand 100%. It demands that coverage never silently goes
// DOWN.
//
// The floor is written below as plain numbers rather than computed, so raising it is a deliberate,
// reviewable commit — the same reasoning as the grandfather list in places.test.ts. Deleting a
// translation is allowed if it was wrong; deleting one by accident is not.
//
// Run `npm run check:languages` for the readable picture.

/** Measured 2026-09-18. Coverage may rise; if it falls, this fails. */
const FLOOR: Partial<Counts> = {
  en: 248,
  tn: 82,
};

function contentCounts(): { totals: Counts; files: number } {
  const dir = new URL("../content/", import.meta.url);
  const all: Counts[] = [];
  let files = 0;
  for (const name of readdirSync(dir)) {
    if (!isContentFile(name)) continue;
    const counts = countLocalizedIn(readFileSync(new URL(name, dir), "utf8"));
    if (counts.en === 0) continue;
    all.push(counts);
    files++;
  }
  return { totals: totalCounts(all), files };
}

test("content translation coverage never silently goes down", () => {
  const { totals } = contentCounts();
  for (const [code, floor] of Object.entries(FLOOR)) {
    assert.ok(
      totals[code as keyof Counts] >= (floor as number),
      `${code} content strings fell from ${floor} to ${totals[code as keyof Counts]}. ` +
        `If that was deliberate, lower the floor in this file and say why in the commit.`,
    );
  }
});

test("every localized value has an English base — the fallback must always have something to fall back to", () => {
  // resolveText treats `en` as the one required key. A value missing it would render empty rather
  // than falling back honestly, which is worse than showing the wrong language.
  const { totals } = contentCounts();
  for (const l of LANGUAGES) {
    if (l.code === "en") continue;
    assert.ok(
      totals[l.code] <= totals.en,
      `${l.code} has ${totals[l.code]} strings but English has ${totals.en} — some value is missing its English base`,
    );
  }
});

test("the language registry and the coverage counter agree on what a language is", () => {
  // If a language were added to the picker but not to the counter, it would show in the UI and be
  // invisible in every coverage number — the exact blind spot this file exists to close.
  const { totals } = contentCounts();
  for (const l of LANGUAGES) {
    assert.ok(l.code in totals, `${l.code} is offered in the picker but not counted`);
  }
  assert.equal(Object.keys(totals).length, LANGUAGES.length);
});
