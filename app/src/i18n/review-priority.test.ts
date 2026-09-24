import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TIERS, tierFor, tierSpec, FLAGGED_FOR_REVIEW, flaggedFor, type ReviewTier } from "./review-priority.ts";
import { LANGUAGES } from "./languages.ts";

const LANG_CODES: string[] = LANGUAGES.map((l) => l.code);

// The harm ordering is a judgement (issue #38), so it is pinned rather than trusted. The point of
// these tests is that moving the consent sheet down a tier has to be argued for in a diff instead of
// happening by accident during a refactor.

const SRC = new URL("../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

test("every file named in a tier actually exists — a renamed file must not silently drop out", () => {
  for (const t of TIERS) {
    for (const f of t.files) {
      assert.ok(
        existsSync(resolve(SRC, f)),
        `tier ${t.tier} names ${f}, which does not exist — rename it here too, or its strings lose their priority`,
      );
    }
  }
});

test("consent, the data cost and the erasure promise are tier 1 — this is the rights tier", () => {
  // If any of these moves, a reviewer reads it after ~300 other strings, which in practice means
  // never. POPIA consent that was not understood is not consent.
  assert.equal(tierFor("components/ConsentSheet.tsx", "chrome"), 1);
  assert.equal(tierFor("components/DataGate.tsx", "chrome"), 1);
  assert.equal(tierFor("components/PassportScreen.tsx", "chrome"), 1);
});

test("tier 1 is small enough that a reviewer can say yes to it", () => {
  // The whole design rests on the first ask being one sitting. Three files is roughly 26 strings; if
  // this list grows past a handful, the kit has stopped being an invitation and become a backlog.
  assert.ok(TIERS[0].files.length <= 4, `tier 1 has ${TIERS[0].files.length} files — keep the first ask small`);
});

test("navigation is tier 2, and it is a .ts file — the shape the chrome test used to miss", () => {
  // nav.ts carries the six most-seen strings in the app and has no `const UI` block, so
  // ui-coverage.test.ts did not see it at all until this issue. Naming it here keeps it visible.
  assert.equal(tierFor("components/shell/nav.ts", "chrome"), 2);
});

test("an unnamed file falls to the right default — chrome to 3, content to 4", () => {
  assert.equal(tierFor("components/TotemsScreen.tsx", "chrome"), 3);
  assert.equal(tierFor("content/mhudi.ts", "content"), 4);
  // The fallback is by KIND, not by path: a content file named in no tier must never land in a
  // chrome tier just because nobody listed it.
  assert.equal(tierFor("content/quiz.ts", "content"), 4);
});

test("the four tiers are distinct, ordered, and each explains itself", () => {
  assert.deepEqual(TIERS.map((t) => t.tier), [1, 2, 3, 4]);
  for (const t of TIERS) {
    assert.ok(t.title.length > 0, `tier ${t.tier} needs a title`);
    // The "why" is printed on the sheet. A reviewer deciding where to spend an hour deserves the
    // reason, not just the ranking.
    assert.ok(t.why.length > 60, `tier ${t.tier} needs a real reason, not a label`);
  }
});

test("no file is claimed by two tiers", () => {
  const seen = new Map<string, ReviewTier>();
  for (const t of TIERS) {
    for (const f of t.files) {
      assert.ok(!seen.has(f), `${f} is in tier ${seen.get(f)} and tier ${t.tier} — it can only have one priority`);
      seen.set(f, t.tier);
    }
  }
});

test("tierSpec refuses an unknown tier rather than returning something plausible", () => {
  assert.throws(() => tierSpec(9 as ReviewTier), /no such review tier/);
});

test("every flagged string points at a file that exists and English that is still there", () => {
  // A flag that no longer matches anything is worse than no flag: it sends a reviewer hunting for a
  // row that is not in the sheet, and it hides the fact that nobody knows whether the problem is
  // fixed. If the English was rewritten, the flag needs rewriting or removing in the same change.
  for (const f of FLAGGED_FOR_REVIEW) {
    const path = resolve(SRC, f.file);
    assert.ok(existsSync(path), `flagged: ${f.file} does not exist`);
    assert.ok(
      readFileSync(path, "utf8").includes(f.englishSnippet),
      `flagged: "${f.englishSnippet}" is no longer in ${f.file} — update or remove the flag`,
    );
    assert.ok(LANG_CODES.includes(f.lang), `flagged: "${f.lang}" is not a language this app speaks`);
    assert.ok(f.why.length > 80, `flagged: ${f.file} needs a reason a reviewer can act on`);
  }
});

test("a flagged language actually gets its flags, and others do not", () => {
  assert.equal(flaggedFor("tn").length, FLAGGED_FOR_REVIEW.filter((f) => f.lang === "tn").length);
  assert.deepEqual(flaggedFor("no-such-language"), []);
});
