import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { extractStrings, hasStrings } from "./extract-strings.ts";
import { LANGUAGES } from "./languages.ts";

// The strings `ui-coverage.test.ts` cannot see (found while building the reviewer kit, issue #38).
//
// That sweep walks `components/**/*.tsx` looking for a `const UI = { … }` block. Two kinds of
// reader-facing string fall outside it:
//
//   · components/shell/nav.ts — a `.ts` file, so the walker never opens it. It holds the SIX NAV
//     LABELS, the most-seen strings in the whole app, plus the mobile tab bar.
//   · a localized value written outside a `const UI` block in a `.tsx` file (PlayOnceRow).
//
// Nine strings, all eleven languages present today — and nothing would have noticed if one vanished.
// This test closes that hole from the other side, using the extractor rather than a second brace
// matcher, and deliberately does NOT touch `ui-coverage.test.ts`: that file is under active work by
// another contributor, and two sweeps that overlap are easier to keep honest than one that both of us
// edit. If the two ever disagree, the stricter one wins.

const CODES = LANGUAGES.map((l) => l.code);
const COMPONENTS = new URL("../components/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p, out);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name) || /\.test\.tsx?$/.test(name)) continue;
    out.push(p);
  }
  return out;
}

/** Files carrying copy that the `const UI` sweep in ui-coverage.test.ts does not inspect. */
function filesOutsideTheSweep(): { path: string; rel: string; src: string }[] {
  return walk(COMPONENTS)
    .map((p) => ({ path: p, rel: relative(COMPONENTS, p).split("\\").join("/"), src: readFileSync(p, "utf8") }))
    .filter((f) => hasStrings(f.src))
    .filter((f) => !(f.path.endsWith(".tsx") && f.src.includes("const UI = {")));
}

test("the gap is real and this test is not vacuous", () => {
  const files = filesOutsideTheSweep();
  assert.ok(files.length > 0, "if this is ever empty, either the hole closed or this test stopped looking");
  // nav.ts is the reason this test exists. Naming it means a refactor that moves the nav labels has
  // to come past this line rather than silently leaving them unguarded again.
  assert.ok(
    files.some((f) => f.rel === "shell/nav.ts"),
    "shell/nav.ts carries the six nav labels and must stay covered",
  );
});

test("every string outside the UI sweep still carries all eleven languages", () => {
  const failures: string[] = [];
  for (const f of filesOutsideTheSweep()) {
    // `en` is the source language; a row is complete when every OTHER language has text too.
    for (const s of extractStrings(f.src, "en", CODES)) {
      const missing = CODES.filter((c) => !new RegExp(`\\b${c}:\\s*"`).test(sliceAround(f.src, s.line)));
      if (missing.length) failures.push(`${f.rel}:${s.line} ("${s.en.slice(0, 32)}…") missing: ${missing.join(", ")}`);
    }
  }
  assert.deepEqual(failures, [], `localized strings outside the UI sweep are missing languages:\n${failures.join("\n")}`);
});

/** The localized object at a line, as text — two lines is enough for the shapes in this repo. */
function sliceAround(src: string, line: number): string {
  return src.split("\n").slice(line - 1, line + 1).join("\n");
}
