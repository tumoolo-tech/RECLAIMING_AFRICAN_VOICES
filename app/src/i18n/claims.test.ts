import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// A factual claim about the country, pinned as a test rather than a sweep (the V2-28 pattern).
//
// South Africa has had TWELVE official languages since the Constitution Eighteenth Amendment Act,
// 2023 added South African Sign Language (see countries/za-south-africa.md, source 1, and the `za`
// sourceNote in content/country-languages.ts). Ubuntu Heritage speaks eleven of them. For a year the
// shipped app said "11 official languages" in seventeen places — a true count of the registry
// rendered as a false claim about the Constitution. This test fails the build if the phrase comes
// back anywhere a reader can see it: a component, a content file, or the chatbot's knowledge base.
//
// SCOPE — `src/` and `scripts/`. Docs are fixed by hand and belong to the wider docs lint (issue
// #51). STATUS.md's log is history and is deliberately not scanned. Test files are skipped so this
// test can quote the phrase it forbids.
//
// `scripts/` was added after `check-languages.mjs` printed the derived claim in a block captioned
// "honest phrasing for a pitch or a rubric" — the single worst place for it, since that text is
// written to be copied into a document going outside the project. A build-time script is not
// shipped to a user, but its OUTPUT is quoted by a human, so the same rule has to reach it.

const SRC = new URL("../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SCRIPTS = new URL("../../scripts/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// Two shapes are forbidden.
//  1. The LITERAL claim — "11 official languages", "eleven official South African languages" —
//     with "South African" / "SA" allowed on either side of "official".
//  2. The DERIVED claim — `${LANGUAGES.length} official languages`. A registry count is an
//     engineering number; "official languages" is a legal claim about a country. Welding them
//     together is how the original bug was written, and no number-matching pattern can see it, so
//     the interpolation itself is what this pattern forbids.
const LITERAL = /\b(11|eleven)\s+(South\s+African\s+|SA\s+)?official\s+(South\s+African\s+|SA\s+)?languages?\b/i;
const DERIVED = /\$\{[^}]*\}\s*(South\s+African\s+|SA\s+)?official\s+languages?/i;
const FORBIDDEN = { test: (s: string) => LITERAL.test(s) || DERIVED.test(s) };

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

test("nothing in src/ claims South Africa has eleven official languages — it has twelve", () => {
  const hits: string[] = [];
  for (const file of [...walk(SRC), ...walk(SCRIPTS)]) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (FORBIDDEN.test(line)) hits.push(`${relative(SRC, file)}:${i + 1}: ${line.trim().slice(0, 100)}`);
    });
  }
  assert.deepEqual(
    hits,
    [],
    "South Africa has twelve official languages (Eighteenth Amendment, 2023); the app speaks eleven. " +
      "Say 'eleven of the twelve' and name South African Sign Language as the one not yet served:\n" +
      hits.join("\n"),
  );
});

test("the forbidden pattern actually matches the phrasings it is meant to catch", () => {
  for (const s of [
    "all 11 official South African languages",
    "eleven official languages",
    "11 official SA languages",
    "the 11 official languages",
    "All 11 official South African languages (Constitution §6)",
    "`${LANGUAGES.length} official languages`",
  ]) {
    assert.ok(FORBIDDEN.test(s), `should match: ${s}`);
  }
  for (const s of ["eleven of the twelve official languages", "11 of the 12 official languages", "all 11 languages"]) {
    assert.ok(!FORBIDDEN.test(s), `should NOT match: ${s}`);
  }
});
