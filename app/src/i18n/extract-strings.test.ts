import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { extractStrings, hasStrings } from "./extract-strings.ts";
import { LANGUAGES } from "./languages.ts";
import { countLocalizedIn } from "./coverage.ts";

// The extractor feeds the reviewer sheet (issue #38). A string it misses is a string no reviewer ever
// sees — a silent gap, which is worse than a loud crash. So these tests run it against the three real
// shapes in this repo, not only against fixtures.

const CODES = LANGUAGES.map((l) => l.code);
const SRC = new URL("../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (rel: string) => readFileSync(resolve(SRC, rel), "utf8");

test("reads a `const UI` block — the component shape", () => {
  const out = extractStrings(read("components/ConsentSheet.tsx"), "tn", CODES);
  assert.ok(out.length >= 8, `expected the consent sheet's strings, got ${out.length}`);
  const body = out.find((s) => s.key === "body");
  assert.ok(body, "the consent body is the single most important string in the app to get right");
  assert.match(body!.en, /POPIA/, "the English consent text mentions POPIA");
  assert.ok(body!.current && body!.current.length > 0, "Setswana consent copy exists (unreviewed — that is the point)");
  assert.ok(body!.line > 0);
});

test("reads nav.ts — the shape with no `const UI` block, which ui-coverage.test.ts cannot see", () => {
  const out = extractStrings(read("components/shell/nav.ts"), "tn", CODES);
  const labels = out.filter((s) => s.key === "label");
  assert.ok(labels.length >= 6, `expected the six nav labels, got ${labels.length}`);
  assert.deepEqual(
    labels.slice(0, 2).map((s) => s.en),
    ["Journey", "Watch"],
    "in source order, so a sheet reads the way the nav does",
  );
});

test("reads content — and keeps strings the language has NOT translated", () => {
  // isiZulu covers 0% of content today. Those rows are exactly what a Zulu reviewer needs to see, so
  // a missing translation must produce a row with `current` undefined, never a dropped row.
  const out = extractStrings(read("content/mhudi.ts"), "zu", CODES);
  assert.ok(out.length > 0);
  const untranslated = out.filter((s) => s.current === undefined);
  assert.ok(untranslated.length > 0, "isiZulu has no scene text in mhudi.ts — the gaps must still be listed");
  for (const s of out) assert.ok(s.en.length > 0, "every row carries the English to translate from");
});

test("the same object is never reported twice", () => {
  const out = extractStrings(read("components/DataGate.tsx"), "tn", CODES);
  const lines = out.map((s) => s.line);
  assert.equal(new Set(lines).size, lines.length, "one row per localized object");
});

test("a value with no `en` is not invented", () => {
  const src = `const UI = { a: { tn: "Reetsa" }, b: { en: "Listen", tn: "Reetsa" } };`;
  const out = extractStrings(src, "tn", CODES);
  assert.equal(out.length, 1, "only the object with English is a translatable string");
  assert.equal(out[0].key, "b");
});

test("`st:` is not matched inside a longer word", () => {
  // Sesotho is `st`. Without a word boundary this would match `list:` and report the wrong text.
  const src = `const UI = { x: { en: "A", list: "not a language", st: "Sesotho text" } };`;
  const out = extractStrings(src, "st", CODES);
  assert.equal(out[0].current, "Sesotho text");
});

test("unbalanced braces produce nothing rather than a guess", () => {
  assert.deepEqual(extractStrings(`{ en: "A"`, "tn", CODES), []);
});

test("hasStrings tells files with copy from registries and helpers", () => {
  assert.equal(hasStrings(read("content/mhudi.ts")), true);
  assert.equal(hasStrings(read("i18n/review-priority.ts")), false, "priority data carries no reader-facing copy");
});

test("THE ASSUMPTION: every localized value in this repo is a single-line, double-quoted literal", () => {
  // The parser is deliberately simple and only correct while this holds. The day someone writes a
  // template literal or a multi-line string, this fails loudly — instead of the sheet silently
  // dropping a string that then never gets reviewed.
  const files = [
    "components/ConsentSheet.tsx",
    "components/DataGate.tsx",
    "components/PassportScreen.tsx",
    "components/shell/nav.ts",
    "content/mhudi.ts",
    "content/quiz.ts",
  ];
  for (const f of files) {
    const src = read(f);
    assert.ok(!/\ben:\s*`/.test(src), `${f}: template-literal localized value — extract-strings.ts must learn this shape`);
    assert.ok(!/\ben:\s*"[^"\n]*$/m.test(src), `${f}: multi-line localized value — extract-strings.ts must learn this shape`);
    assert.ok(!/\ben:\s*"[^"\n]*\\"/.test(src), `${f}: escaped quote in a localized value — extract-strings.ts must learn this shape`);
  }
});

test("agrees with coverage.ts — two counters that disagree are worse than one", () => {
  // SP-082 (Phase 8) put the counting in ONE module precisely so the report and the ratchet could
  // not drift. This extractor is a SECOND way of finding the same strings, for a different job:
  // coverage.ts answers "how many", extract-strings answers "which ones, and what do they say".
  // They must agree on the total, or a reviewer's sheet and the coverage report would describe
  // different apps — and neither number could be quoted. Pinned rather than assumed.
  const files = ["content/mhudi.ts", "content/quiz.ts", "content/journey.ts", "content/food.ts"];
  for (const f of files) {
    const src = read(f);
    const byCoverage = countLocalizedIn(src);
    for (const code of ["en", "tn"] as const) {
      const byExtract = extractStrings(src, code, CODES).filter((s) => (code === "en" ? true : s.current !== undefined)).length;
      assert.equal(
        byExtract,
        byCoverage[code],
        `${f}: extract-strings sees ${byExtract} ${code} strings, coverage.ts sees ${byCoverage[code]}`,
      );
    }
  }
});
