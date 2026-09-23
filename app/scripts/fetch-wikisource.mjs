#!/usr/bin/env node
// Fetch a public-domain work from Wikisource as plain text, with its printed page numbers (issue #33).
//
//   npm run fetch:text -- --work "Mhudi" --chapters 24 --out ../tmp/mhudi.txt
//
// WHY THIS EXISTS. The four literary pillars were written from summary websites — `enotes.com`,
// `bookey.app` — rather than from the books. One consequence was already shipping: `mhudi.ts` cited
// "ch. 5 'The Forest Home'" when Chapter 5 of the 1930 edition is "Revels after Victory" and the
// forest home is Chapter 6. Citations taken from summaries inherit the summary's errors. So the text
// comes in, and the scenes get written from it.
//
// WHY WIKISOURCE IS CITABLE, AND WHERE THE PAGE NUMBERS COME FROM. A Wikisource chapter is not
// free-typed prose: it transcludes proofread pages from a scan of the printed book —
//
//     <pages index="Solomon Tshekisho Plaatje - Mhudi.pdf" from="63" to="70" />
//
// — so each chapter carries the PRINTED PAGE RANGE of the edition it was scanned from. That is what
// makes "ch. 6 'The Forest Home', pp. 63–70 (Lovedale, 1930)" a real citation rather than a gesture,
// and it is why this script records the ranges alongside the text.
//
// WHAT IT IS NOT. Wikisource is a transcription, not the book. It is proofread by volunteers against
// the scan and can still carry an OCR slip. Anything quoted verbatim in the app should be spot-checked
// against the page images (the index page links them). The script prints that reminder every run.
//
// It writes ONE .txt plus a .json manifest, both outside src/. Turning them into a module is
// `npm run ingest`, deliberately a separate step behind the human-review gate.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const APP = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://en.wikisource.org/w/api.php";

// Wikimedia asks every automated client to identify itself and to go easy. We are fetching two dozen
// pages from a volunteer-run free service that this project cites as a source — being rude to it is
// both bad manners and bad provenance. Sequential, paced, and it backs off when asked to.
const UA = "UbuntuHeritage/1.0 (heritage app; https://github.com/tumoolo-tech/RECLAIMING_AFRICAN_VOICES) node-fetch";
const PAUSE_MS = 700;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fetch with the courtesy UA, and honour a 429 instead of hammering through it. */
async function polite(url, attempt = 1) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Encoding": "gzip" } });
  if (res.status === 429 && attempt <= 5) {
    const wait = Number(res.headers.get("retry-after") ?? 0) * 1000 || attempt * 4000;
    console.log(`    … rate-limited, waiting ${(wait / 1000).toFixed(0)}s (attempt ${attempt})`);
    await sleep(wait);
    return polite(url, attempt + 1);
  }
  return res;
}

/**
 * Corrections applied to the TRANSCRIPTION, declared rather than silent.
 *
 * Wikisource is proofread by volunteers, and a slip survives. Each entry here is a defect in the
 * transcription — not an edit to Plaatje — and every run prints what it changed, so `source.txt` can
 * honestly be described as "the Wikisource transcription, with the corrections listed in review.md".
 *
 * The bar for adding one: it must be an obvious typographical error that CHANGES HOW THE TEXT IS
 * PARSED or read. Anything touching wording, spelling of names, or punctuation the 1930 edition
 * actually set is not a typo — it is the book, and it stays.
 */
const TRANSCRIPTION_FIXES = [
  {
    from: /^Chatpter\s+VIII\.\s*$/im,
    to: "Chapter VIII.",
    why:
      "Chapter 8's heading is transcribed 'Chatpter VIII.' (Page:…Mhudi.pdf/79, proofread level 3). " +
      "The misspelling hides the heading from chapter segmentation, so a 24-chapter novel reads as 23 " +
      "and chapter 8 is swallowed into chapter 7. Verify against the page scan; the fix belongs upstream too.",
  },
];

/** Things worth knowing about the transcription that are NOT corrected — recorded, not changed. */
const TRANSCRIPTION_NOTES = [
  "Chapter 23 is headed 'Chapter XXII.' in the transcription, duplicating chapter 22's heading; " +
    "there is no 'Chapter XXIII.'. Left as transcribed — the printed page range (pp. 225–231) " +
    "identifies the chapter unambiguously, and renumbering someone else's text is not our job.",
];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    out[key] = next === undefined || next.startsWith("--") ? true : (i++, next);
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const work = String(args.work ?? "Mhudi");
const chapters = Number(args.chapters ?? 24);
const outArg = String(args.out ?? `../tmp/${work.toLowerCase()}.txt`);
const outPath = isAbsolute(outArg) ? outArg : resolve(APP, outArg);

if (!Number.isFinite(chapters) || chapters < 1) {
  console.error("fetch-wikisource: --chapters must be a positive number");
  process.exit(2);
}

/** Raw wikitext, which holds the <pages index= from= to=> transclusion and therefore the page range. */
async function rawWikitext(page) {
  const url = `https://en.wikisource.org/w/index.php?title=${encodeURIComponent(page)}&action=raw`;
  const res = await polite(url);
  if (!res.ok) throw new Error(`${page}: ${res.status} ${res.statusText}`);
  return res.text();
}

/** Rendered HTML, which holds the transcluded prose the raw wikitext does not. */
async function renderedHtml(page) {
  const url = `${API}?action=parse&page=${encodeURIComponent(page)}&prop=text&formatversion=2&format=json`;
  const res = await polite(url);
  if (!res.ok) throw new Error(`${page}: ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.error) throw new Error(`${page}: ${json.error.info}`);
  return json.parse.text;
}

/** HTML → prose. Drops the stylesheet, the header navigation box, page-number markers and footnote refs. */
function toText(html) {
  let h = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<table[\s\S]*?<\/table>/gi, "") // the {{header}} navigation block
    .replace(/<span[^>]*class="[^"]*pagenum[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<sup[\s\S]*?<\/sup>/gi, "");
  const t = h
    .replace(/<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(h[1-6]|div)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#8203;/g, "") // zero-width space the transclusion leaves behind
    // Numeric entities generally, not one at a time: the transcription uses &#160; for the
    // non-breaking space before a colon that Lovedale set in French spacing, and there is no reason
    // to discover the next one by finding it in a published citation.
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return dropNavigation(t);
}

/**
 * Cut the site furniture above the prose.
 *
 * Wikisource renders a navigation strip ("←Chapter 5 · Mhudi · Chapter 7→" plus an internal revision
 * id) before the transcluded text. Rather than pattern-match that furniture — which changes shape
 * whenever the site's templates change — anchor on the printed chapter heading, which is part of the
 * BOOK and has not changed since Lovedale set it in 1930: "Chapter VI.".
 *
 * A chapter with no such heading is returned whole. Guessing would silently drop a page, and a
 * missing page is exactly the kind of gap a citation later points into.
 */
function dropNavigation(text) {
  // Anchor on the END of the navigation block, not on the chapter heading that follows it.
  //
  // The first version cut to the printed heading ("Chapter VIII.") on the reasoning that the book is
  // more stable than the website. It is — but the TRANSCRIPTION of the book is not: chapter 8 is
  // headed "Chatpter VIII." on Wikisource, so the anchor missed, the navigation survived, and its
  // "Chapter 7" / "Chapter 9" links were then read as two extra chapter headings by the segmenter.
  // A 24-chapter novel came out as 25.
  //
  // Wikisource closes every navigation block with a revision id glued to the work and chapter
  // ("5124671Mhudi — Chapter 8"). That line carries no prose, appears exactly once, and does not
  // depend on anybody having spelled "Chapter" correctly.
  const nav = text.match(/^\d{4,}[^\n]*?Chapter\s+\d+\s*$/im);
  if (nav && nav.index !== undefined) return text.slice(nav.index + nav[0].length).trim();

  // No navigation block (a plain page): fall back to the printed heading, then to the whole text.
  const heading = text.match(/^Ch\w*pter\s+[IVXLCDM]+\.?\s*$/im);
  return heading && heading.index !== undefined ? text.slice(heading.index).trim() : text;
}

/** `<pages index="…" from="63" to="70" />` → the printed page range this chapter occupies. */
function pageRange(wikitext) {
  const m = wikitext.match(/<pages\s+index="([^"]+)"\s+from="(\d+)"\s+to="(\d+)"/i);
  return m ? { index: m[1], from: Number(m[2]), to: Number(m[3]) } : null;
}

/** The chapter's printed title, from the first heading lines of the extracted text. */
function chapterTitle(text) {
  // "Chapter VI." then "The Forest Home." on the following line, as printed.
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 6);
  const i = lines.findIndex((l) => /^chapter\s+[IVXLC]+\.?$/i.test(l));
  if (i >= 0 && lines[i + 1]) return lines[i + 1].replace(/\.$/, "");
  return "";
}

console.log(`\n→ ${work} — fetching ${chapters} chapters from Wikisource\n`);

const manifest = [];
const parts = [];
const applied = [];

for (let n = 1; n <= chapters; n++) {
  const page = `${work}/Chapter_${n}`;
  const wikitext = await rawWikitext(page);
  const html = await renderedHtml(page);
  let text = toText(html);

  for (const fix of TRANSCRIPTION_FIXES) {
    if (fix.from.test(text)) {
      text = text.replace(fix.from, fix.to);
      applied.push({ chapter: n, to: fix.to, why: fix.why });
    }
  }
  const range = pageRange(wikitext);
  const title = chapterTitle(text);

  // A chapter that came back nearly empty means the transclusion changed shape — say so rather than
  // writing a file with a hole in it that nobody notices until a scene cites a page that is not there.
  if (text.length < 500) {
    console.error(`\n✗ Chapter ${n} returned only ${text.length} characters — aborting rather than writing a partial text.`);
    process.exit(1);
  }

  manifest.push({ chapter: n, title, pages: range });
  // The book's own text, and nothing else. An earlier version injected a "CHAPTER 6. The Forest Home"
  // header above each chapter; it read nicely and was wrong twice over. `source.txt` is the verbatim
  // layer (docs/12) — adding our words to it makes it no longer the thing the citations point at —
  // and `segmentChapters` matches any line starting "chapter <numeral>", so the synthetic header and
  // the printed "Chapter VI." both matched and a 24-chapter novel segmented as 49. Chapter numbers,
  // titles and printed page ranges live in the manifest beside it, which is where metadata belongs.
  parts.push(`\n\n${text}`);
  if (n < chapters) await sleep(PAUSE_MS);
  console.log(`  ch ${String(n).padStart(2)}  ${title.padEnd(34)} pp. ${range ? `${range.from}–${range.to}` : "?"}  ${String(text.length).padStart(6)} chars`);
}

mkdirSync(dirname(outPath), { recursive: true });
const body = parts.join("").trim() + "\n";
writeFileSync(outPath, body, "utf8");
// The manifest carries the provenance, not just the chapter list: where the text came from, when, and
// every correction and known defect. A citation is only as good as the record of what was fetched.
writeFileSync(
  outPath.replace(/\.txt$/, ".chapters.json"),
  JSON.stringify(
    {
      work,
      source: "en.wikisource.org",
      fetched: new Date().toISOString().slice(0, 10),
      chapters: manifest,
      transcriptionFixes: applied,
      transcriptionNotes: TRANSCRIPTION_NOTES,
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(`\n  → ${outPath}  (${(body.length / 1024).toFixed(0)} KB)`);
console.log(`  → ${outPath.replace(/\.txt$/, ".chapters.json")}  (titles + printed page ranges, for citations)`);

if (applied.length) {
  console.log(`\n  ${applied.length} declared transcription correction(s) applied:`);
  for (const a of applied) console.log(`    ch ${a.chapter} → "${a.to}"`);
}
for (const note of TRANSCRIPTION_NOTES) console.log(`\n  Note: ${note}`);
console.log(
  `\n  Wikisource is a volunteer transcription of a scan, not the book itself. Spot-check anything you\n` +
    `  quote verbatim against the page images before it ships.\n`,
);
