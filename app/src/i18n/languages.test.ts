import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LANGUAGES,
  DEFAULT_LANG,
  languageByCode,
  toBcp47,
  toBotlhaleCode,
} from "./languages.ts";

test("speaks eleven of South Africa's twelve official languages (Sign Language is the twelfth)", () => {
  assert.equal(LANGUAGES.length, 11);
});

test("language codes are unique", () => {
  const codes = LANGUAGES.map((l) => l.code);
  assert.equal(new Set(codes).size, codes.length);
});

test("includes each official language by code", () => {
  const codes = new Set(LANGUAGES.map((l) => l.code));
  for (const c of ["en", "af", "nr", "xh", "zu", "nso", "st", "tn", "ss", "ve", "ts"]) {
    assert.ok(codes.has(c as never), `missing ${c}`);
  }
});

test("every language has a non-empty endonym, English name, and speech codes", () => {
  for (const l of LANGUAGES) {
    assert.ok(l.endonym.length > 0, `${l.code} endonym`);
    assert.ok(l.english.length > 0, `${l.code} english`);
    assert.ok(l.bcp47.length > 0, `${l.code} bcp47`);
    assert.ok(l.botlhale.length > 0, `${l.code} botlhale`);
  }
});

test("only English and Setswana are marked as human-reviewed today", () => {
  const reviewed = LANGUAGES.filter((l) => l.reviewedContent).map((l) => l.code).sort();
  assert.deepEqual(reviewed, ["en", "tn"]);
});

test("speech codes resolve to the expected xx-ZA forms", () => {
  assert.equal(toBcp47("tn"), "tn-ZA");
  assert.equal(toBotlhaleCode("tn"), "tn-ZA");
  assert.equal(toBcp47("zu"), "zu-ZA");
  assert.equal(toBotlhaleCode("xh"), "xh-ZA");
});

test("unknown codes fall back to the default language", () => {
  assert.equal(languageByCode("xx").code, DEFAULT_LANG);
});

test("English is the default language and the first choice in the picker", () => {
  assert.equal(DEFAULT_LANG, "en");
  assert.equal(LANGUAGES[0].code, "en");
  assert.ok(languageByCode(DEFAULT_LANG).reviewedContent, "the default language must have real content");
});

// ── Review status (issue #38) ──────────────────────────────────────────────────────────────────

test("no language's interface has been read by a speaker yet — and the registry says so", () => {
  // The honest starting position, pinned so it cannot drift upward by accident. Chrome coverage is
  // 100% and enforced, but coverage is not correctness: every non-English string was machine-drafted
  // and none has been reviewed. A flag that flips needs a named reviewer in the same commit.
  const claimed = LANGUAGES.filter((l) => l.reviewedUi && l.code !== "en").map((l) => l.code);
  for (const code of claimed) {
    const meta = LANGUAGES.find((l) => l.code === code)!;
    assert.ok(
      meta.reviewers.length > 0,
      `${code} claims reviewedUi but names no reviewer — a review is a person, not a boolean`,
    );
  }
});

test("English is the source language, so its interface is reviewed by definition", () => {
  assert.equal(languageByCode("en").reviewedUi, true);
});

test("a named reviewer carries a scope and a date — a credit with no claim attached is not a record", () => {
  for (const l of LANGUAGES) {
    for (const r of l.reviewers) {
      assert.ok(r.name.length > 0, `${l.code}: a reviewer needs a name`);
      assert.ok(r.scope.length > 0, `${l.code}: say what ${r.name} actually read — "the consent sheet" is a different claim from "the app"`);
      assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/, `${l.code}: reviewer date must be ISO (YYYY-MM-DD)`);
    }
  }
});
