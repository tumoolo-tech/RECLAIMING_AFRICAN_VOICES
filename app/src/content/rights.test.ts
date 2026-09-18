import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isPublicDomainByYear, canIngest } from "../services/ingest/rights.ts";
import { mhudi } from "./mhudi.ts";
import { ityalaLamawele } from "./ityala-lamawele.ts";
import { indaba } from "./indaba.ts";
import { vilakazi } from "./vilakazi.ts";
import { unsungHeroes } from "./unsung-heroes.ts";
import { marriageRites } from "./marriage-rites.ts";
import { peoplingOfSa } from "./peopling-of-sa.ts";
import { peoplesCultures } from "./peoples-cultures.ts";
import { traditions } from "./traditions.ts";
import { food } from "./food.ts";
import type { Module } from "./types.ts";

// Issue #34. For a year the project called its canon "public domain". One of the four works is not:
// Vusamazulu Credo Mutwa died in 2020, and under the Copyright Act 98 of 1978 (life + 50) *Indaba, My
// Children* is in copyright until 2070. Nothing caught it because nothing checked. These tests run the
// project's own rule (`isPublicDomainByYear`, written for the Ingestion Library and never applied to
// the canon it was written beside) against every module, so a rights claim is an assertion, not a habit.
//
// The modules are imported one by one rather than through content/index.ts, which re-exports `./types`
// without an extension and so cannot load under node --test. The list must match index.ts — pinned below.

const MODULES: Module[] = [
  mhudi, ityalaLamawele, indaba, vilakazi,
  unsungHeroes, marriageRites, peoplingOfSa, peoplesCultures, traditions, food,
];
const THIS_YEAR = 2026;

test("the list under test matches content/index.ts (so a new module cannot skip these checks)", () => {
  // index.ts is read as text (the routes.test.ts trick) because it cannot be imported under node.
  const src = readFileSync(new URL("./index.ts", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "utf8");
  for (const m of MODULES) assert.ok(src.includes(`from "./${m.id}"`), `${m.id} is not imported by index.ts`);
  // Every `import { x } from "./file"` line except the `Module` type import.
  const imported = (src.match(/^import \{ \w+ \} from "\.\/[a-z-]+";$/gm) ?? []).filter((l) => !l.includes("./types")).length;
  assert.equal(imported, MODULES.length, "index.ts imports a module this test does not cover — add it to MODULES");
});

test("every module states its rights, with a basis a reader can check", () => {
  for (const m of MODULES) {
    assert.ok(m.rights, `${m.id} has no rights field`);
    assert.ok(m.rights.basis.length > 40, `${m.id}: the basis must be a sentence, not a label`);
  }
});

test("every public-domain claim passes the life + 50 test — the rule the project already had", () => {
  for (const m of MODULES.filter((x) => x.rights.status === "public-domain")) {
    assert.ok(m.rights.authorDied, `${m.id}: a public-domain claim needs the author's death year`);
    assert.ok(
      isPublicDomainByYear(m.rights.authorDied!, THIS_YEAR),
      `${m.id}: author died ${m.rights.authorDied}, which is NOT 50+ years ago — this work is in copyright`
    );
  }
});

test("Indaba, My Children is in copyright until 2070 and must never be called public domain", () => {
  // The assertion that would have failed in July 2026, when the docs and the ledger copy said otherwise.
  assert.equal(indaba.rights.status, "in-copyright");
  assert.equal(indaba.rights.authorDied, 2020);
  assert.ok(!isPublicDomainByYear(2020, THIS_YEAR));
  assert.ok(isPublicDomainByYear(2020, 2071), "life + 50: public domain from 1 January 2071");
  assert.ok(!isPublicDomainByYear(2020, 2070), "…and not a day before");
  // In-copyright work → the ingest gate refuses verbatim reproduction. No new code: the gate already
  // only admits public-domain or licensed, and "in-copyright" is neither.
  assert.equal(canIngest({ id: "indaba", title: "", author: "", rights: "in-copyright" }), false);
});

test("an in-copyright module says what the app's own text is — a summary in its own words", () => {
  for (const m of MODULES.filter((x) => x.rights.status === "in-copyright")) {
    assert.ok(/own words/i.test(m.rights.basis), `${m.id}: the basis must state that the scenes are the project's own words`);
    assert.ok(/not public domain/i.test(m.rights.basis), `${m.id}: the basis must say plainly that the work is not public domain`);
  }
});

test("the three public-domain pillars and their dates", () => {
  assert.deepEqual(
    MODULES.filter((m) => m.rights.status === "public-domain").map((m) => [m.id, m.rights.authorDied]),
    [["mhudi", 1932], ["ityala-lamawele", 1945], ["vilakazi", 1947]]
  );
});

test("Atlas modules are the project's own work and say so", () => {
  for (const m of MODULES.filter((x) => x.kind === "atlas")) {
    assert.equal(m.rights.status, "original", `${m.id} is an Atlas entry authored from references`);
  }
});
