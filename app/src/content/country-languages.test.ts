import { test } from "node:test";
import assert from "node:assert/strict";
import { countryLanguages, languagesFor, hasLanguageMap } from "./country-languages.ts";
import { readFileSync } from "node:fs";
import { LANGUAGES } from "../i18n/languages.ts";

// The country → language map makes factual claims about real countries, so the structural parts of
// the integrity rule are pinned here rather than left to care.

const CODES = new Set(LANGUAGES.map((l) => l.code));

// anthems.ts is read rather than imported: it `require()`s 54 flag PNGs, which Node's type-stripping
// loader cannot resolve. Reading the source keeps this test dependency-free (same trick as
// src/routes.test.ts).
const anthemsSrc = readFileSync(
  new URL("./anthems.ts", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
  "utf8"
);
const COUNTRY_CODES = new Set([...anthemsSrc.matchAll(/\{\s*code:\s*"([a-z]{2})"/g)].map((m) => m[1]));

test("every mapped country is a real country in the picker", () => {
  for (const code of Object.keys(countryLanguages)) {
    assert.ok(COUNTRY_CODES.has(code), `"${code}" is not one of the 54 countries in anthems.ts`);
  }
});

test("every supported language is a language the app actually has", () => {
  for (const [code, entry] of Object.entries(countryLanguages)) {
    for (const l of entry.supported) {
      assert.ok(CODES.has(l), `${code} claims "${l}", which is not in the language registry`);
    }
  }
});

test("no country lists the same language twice", () => {
  for (const [code, entry] of Object.entries(countryLanguages)) {
    assert.equal(new Set(entry.supported).size, entry.supported.length, `${code} repeats a language`);
  }
});

test("every claim cites its source — this file states facts about real countries", () => {
  for (const [code, entry] of Object.entries(countryLanguages)) {
    assert.ok(
      entry.sourceNote && entry.sourceNote.length > 30,
      `${code} needs a real sourceNote: "what they speak in X" is a factual claim (AGENTS.md §4)`
    );
  }
});

test("English is offered everywhere it is mapped — it is the app's guaranteed base", () => {
  for (const [code, entry] of Object.entries(countryLanguages)) {
    assert.ok(entry.supported.includes("en"), `${code} must keep English, the fallback every text has`);
  }
});

test("South Africa carries the eleven spoken official languages, and names the twelfth", () => {
  const za = languagesFor("za");
  assert.ok(za);
  assert.equal(za.supported.length, 11, "the 1996 Constitution lists eleven spoken languages; the picker must show all eleven");
  // Eighteenth Amendment Act, 2023: South African Sign Language is the twelfth official language.
  // It cannot be a LangCode yet (nothing to render), so it MUST be named under notYet — otherwise
  // the picker implies the country has eleven.
  assert.ok(
    za.notYet.includes("South African Sign Language"),
    "SASL is an official language since 2023 and must be named as the one we do not yet serve",
  );
});

test("Zimbabwe's Ndebele is NOT mapped to South Africa's isiNdebele", () => {
  // Northern Ndebele (Zimbabwe) and Southern Ndebele (South Africa, `nr`) are different languages.
  // Conflating them would be a plausible-looking falsehood, which is the exact failure mode the
  // integrity rule exists to prevent.
  const zw = languagesFor("zw");
  assert.ok(zw);
  assert.ok(!zw.supported.includes("nr"), "Zimbabwe must not claim South Africa's isiNdebele");
  assert.ok(
    zw.notYet.some((n) => n.includes("Ndebele")),
    "Zimbabwe's Ndebele should be named as one we do not have"
  );
});

test("an unmapped country reports honestly rather than guessing", () => {
  // Egypt is deliberately not mapped. The picker falls back to the full list for countries like it.
  assert.equal(hasLanguageMap("eg"), false);
  assert.equal(languagesFor("eg"), undefined);
});

test("every country's lead language is one it actually supports", () => {
  // `lead` is what the app switches to when a country is chosen (LANG-04). A lead outside
  // `supported` would switch the reader into a language we never claimed was spoken there.
  for (const [code, entry] of Object.entries(countryLanguages)) {
    assert.ok(
      entry.supported.includes(entry.lead),
      `${code} leads with "${entry.lead}", which is not in its supported list`
    );
  }
});

test("the lead language is a language the app has", () => {
  for (const [code, entry] of Object.entries(countryLanguages)) {
    assert.ok(CODES.has(entry.lead), `${code} leads with "${entry.lead}", not in the language registry`);
  }
});

test("the Southern African neighbours lead with the language they actually share with us", () => {
  // The point of the whole feature: Botswana should come up in Setswana, not in English.
  assert.equal(languagesFor("bw")?.lead, "tn");
  assert.equal(languagesFor("ls")?.lead, "st");
  assert.equal(languagesFor("sz")?.lead, "ss");
});

// ── Issue #25 — three corrections the countries/ research found, each verified against its instrument
//    before it was applied. Pinned so a "tidy-up" cannot quietly undo a sourced fact.

test("Lesotho: isiXhosa is official since the Tenth Amendment (2025), and SiPhuthi is not siSwati", () => {
  const ls = languagesFor("ls");
  assert.ok(ls);
  // Tenth Amendment to the Constitution Act, 2025 (Act No. 2 of 2025), §3(1): Sesotho, English,
  // isiXhosa, isiPhuthi and sign language. isiXhosa is the same language as the app's `xh`.
  assert.ok(ls.supported.includes("xh"), "isiXhosa is official in Lesotho (Tenth Amendment, 2025)");
  assert.ok(/Tenth Amendment/.test(ls.sourceNote), "the sourceNote must name the amending Act, not only the 1993 text");
  // The same-name trap (countries/README.md): SiPhuthi is a Nguni language close to siSwati and is
  // NOT siSwati. Mapping it to `ss` on resemblance would be a plausible-looking falsehood.
  assert.ok(!ls.supported.includes("ss"), "SiPhuthi must not be mapped to South Africa's siSwati");
  assert.ok(ls.notYet.some((n) => /phuthi/i.test(n)), "SiPhuthi is official and must be named as one we do not have");
  // The Act says "sign language", generically. Named as the Act names it — no invented title.
  assert.ok(ls.notYet.some((n) => /sign language/i.test(n)), "sign language is official in Lesotho and must be named");
  assert.equal(ls.lead, "st");
});

test("Namibia: Setswana is a recognised school language, sourced to the Ministry's policy, not the Constitution", () => {
  const na = languagesFor("na");
  assert.ok(na);
  assert.ok(na.supported.includes("tn"), "Setswana is on the Ministry's first-language list (Language Policy for Schools, 2003, §5.10)");
  // Two claims, two instruments — the note must carry both, because the Constitution names only
  // English and a reader checking Article 3 for "Setswana" would rightly find nothing.
  assert.ok(/Article 3\(1\)/.test(na.sourceNote), "the official-language claim rests on Article 3(1)");
  assert.ok(/Language Policy for Schools/.test(na.sourceNote), "the recognised-language claim rests on the Ministry's policy");
  assert.equal(na.lead, "en", "English is the sole official language and stays the lead");
});

test("Zimbabwe: the 'only two embraced nationally' gloss was checked against §6 and is not applied", () => {
  const zw = languagesFor("zw");
  assert.ok(zw);
  // §6(3)(a): "ensure that all officially recognised languages are treated equitably". A sourceNote
  // that ranked Shona and English above the other fourteen would contradict the instrument it cites.
  assert.ok(/equitably/.test(zw.sourceNote), "the note must carry §6(3)(a), which is what the Act actually says");
  assert.ok(!/only two|embraces two|two of them nationally/i.test(zw.sourceNote), "the rejected encyclopaedia gloss must not be in the note");
  assert.equal(zw.supported.length, 6, "the six languages Zimbabwe shares with the app are unchanged");
});
