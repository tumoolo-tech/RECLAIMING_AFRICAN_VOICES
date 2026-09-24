import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { mhudi } from "./mhudi.ts";

// Citations are checked against the book, not against care (issue #33).
//
// `mhudi.ts` cited "ch. 5 'The Forest Home'" for a year. Chapter 5 of the 1930 Lovedale edition is
// "Revels after Victory"; the forest home is chapter 6. The citation had been copied from a summary
// site, and nothing could catch it because the book was not in the repo. It is now —
// `content/sources/mhudi/source.txt`, fetched by `npm run fetch:text` — so a scene that names a
// chapter can be checked against the chapter it names.
//
// This tests the SOURCE NOTES, not the prose. Whether an adaptation is faithful is a human judgement
// and belongs to review; whether it cites chapter 6 when it means chapter 6 is arithmetic.

const SOURCE = new URL("./sources/mhudi/source.txt", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/** The printed chapter headings, in order: ["Chapter I.", "Chapter II.", …]. */
function printedChapters(): { roman: string; title: string }[] {
  const text = readFileSync(SOURCE, "utf8");
  const out: { roman: string; title: string }[] = [];
  const re = /^Chapter\s+([IVXLCDM]+)\.?\s*$/gim;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    // The printed chapter title is the next non-empty line after the heading.
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 200);
    const title = (after.split("\n").map((l) => l.trim()).filter(Boolean)[0] ?? "").replace(/\.$/, "");
    out.push({ roman: m[1], title });
  }
  return out;
}

const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI","XXII","XXIII","XXIV"];

test("the source text is in the repo — these tests are meaningless without it", () => {
  assert.ok(existsSync(SOURCE), "content/sources/mhudi/source.txt is missing; run npm run fetch:text then npm run ingest");
  assert.ok(printedChapters().length >= 24, "expected the 24 chapters of the 1930 edition");
});

test("every Mhudi scene cites a chapter, a printed title and a page range", () => {
  for (const s of mhudi.scenes) {
    assert.match(s.sourceNote, /ch\. \d+/, `${s.id}: no chapter number — an uncited scene is how "Mhudi saves Ra-Thaga" survived`);
    assert.match(s.sourceNote, /pp\. \d+–\d+/, `${s.id}: no page range`);
    assert.match(s.sourceNote, /\(Lovedale\)/, `${s.id}: name the edition — chapter numbers differ between editions`);
  }
});

test("each cited chapter title matches the title printed in that chapter of the 1930 text", () => {
  const printed = printedChapters();
  for (const s of mhudi.scenes) {
    const n = Number((s.sourceNote.match(/ch\. (\d+)/) ?? [])[1]);
    // Anchor on the ", pp." that follows the title rather than on the closing quote: chapter titles
    // contain apostrophes ("Mhudi's Alarming Experiences"), and a [^']+ match stops at the first one
    // and silently compares half a title.
    const cited = (s.sourceNote.match(/ch\. \d+ '(.+?)', pp\./) ?? [])[1];
    assert.ok(n >= 1 && n <= printed.length, `${s.id}: chapter ${n} is outside the book`);
    assert.ok(cited, `${s.id}: quote the chapter title so it can be checked`);

    const actual = printed[n - 1];
    // Compare loosely — apostrophes and spacing vary between the print and our note — but the words
    // must be the chapter's own words. This is the assertion that would have failed on "ch. 5
    // 'The Forest Home'" and did not exist to.
    const norm = (x: string) => x.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
    assert.equal(
      norm(actual.title),
      norm(cited),
      `${s.id} cites ch. ${n} as "${cited}", but chapter ${n} of the 1930 edition is "${actual.title}"`,
    );
    assert.equal(actual.roman, ROMAN[n - 1], `chapter ${n} is printed as "Chapter ${actual.roman}." — check the source text`);
  }
});

test("scenes run in the order the book does", () => {
  const chapters = mhudi.scenes.map((s) => Number((s.sourceNote.match(/ch\. (\d+)/) ?? [])[1]));
  const sorted = [...chapters].sort((a, b) => a - b);
  assert.deepEqual(chapters, sorted, "a reader meeting scene 3 before scene 2 is reading the novel backwards");
});

test("the references name the edition, not a summary site", () => {
  const joined = mhudi.references.join(" ").toLowerCase();
  assert.match(joined, /lovedale|1930/, "cite the edition the scenes are drawn from");
  for (const banned of ["enotes", "bookey", "sparknotes", "shmoop", "gradesaver"]) {
    assert.ok(!joined.includes(banned), `${banned} is a study-summary site — cite the book and scholarship instead`);
  }
});
