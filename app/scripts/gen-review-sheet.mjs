#!/usr/bin/env node
// Write a review sheet a native speaker can actually work in (issue #38).
//
//   npm run review:sheet -- tn          one language
//   npm run review:sheet -- --all       all eleven
//
// THE PROBLEM THIS SOLVES. Ten of the app's eleven languages have never been read by a speaker. The
// chrome is machine-drafted and complete; the content is machine-drafted or absent. Asking a
// volunteer to review "the app" means ~330 chrome strings plus 248 content strings in a TypeScript
// codebase, and nobody says yes to that. So the sheet is markdown — a document, not source — and it
// is ordered by what a wrong word COSTS (src/i18n/review-priority.ts), so tier 1 is about twenty
// strings: consent, money, erasure. That is one sitting, and it is the sitting worth having.
//
// IT WRITES ONLY TO review/. Nothing under src/ is touched: a tool that edits the strings it is
// reading is one bad regex away from corrupting eleven languages at once. Corrections come back as a
// filled-in sheet and a human applies them — deliberately, for v1.
//
// NODE VERSION. This imports `.ts` (LANGUAGES and the extractor, rather than re-declaring them and
// letting the copies drift — SP-082). That needs native type stripping: Node **22.18+**, which
// includes the 24 LTS that CI runs. On 22.6–22.17 it fails with ERR_UNKNOWN_FILE_EXTENSION.
// Issue #40 adds `scripts/run-ts.mjs`, which detects that and supplies the flag; when it merges, this
// script's package.json entry should be routed through it like the other ten.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LANGUAGES } from "../src/i18n/languages.ts";
import { extractStrings, hasStrings } from "../src/i18n/extract-strings.ts";
import { TIERS, tierFor, tierSpec, flaggedFor } from "../src/i18n/review-priority.ts";

const APP = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(APP, "src");
const OUT = resolve(APP, "..", "review");
const CODES = LANGUAGES.map((l) => l.code);

const args = process.argv.slice(2);
const all = args.includes("--all");
const wanted = args.filter((a) => !a.startsWith("--"));

if (!all && wanted.length === 0) {
  console.error(
    "gen-review-sheet: which language?\n" +
      `  npm run review:sheet -- <code>     one of: ${CODES.filter((c) => c !== "en").join(" ")}\n` +
      "  npm run review:sheet -- --all      every language that needs review",
  );
  process.exit(2);
}

/** Every source file under src/ that carries reader-facing copy, with its kind. */
function sourceFiles() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) {
        const rel = relative(SRC, p).split("\\").join("/");
        const src = readFileSync(p, "utf8");
        if (!hasStrings(src)) continue;
        // `content/` is the history; everything else carrying strings is interface chrome.
        out.push({ rel, src, kind: rel.startsWith("content/") ? "content" : "chrome" });
      }
    }
  };
  walk(SRC);
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

/** One markdown table row. Pipes and newlines would break the table, so they are neutralised. */
const cell = (s) => (s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();

function sheetFor(lang, files) {
  const meta = LANGUAGES.find((l) => l.code === lang);
  const rows = [];
  for (const f of files) {
    for (const s of extractStrings(f.src, lang, CODES)) {
      rows.push({ ...s, file: f.rel, tier: tierFor(f.rel, f.kind) });
    }
  }

  const missing = rows.filter((r) => r.current === undefined).length;
  const today = new Date().toISOString().slice(0, 10);

  const out = [];
  out.push(`# Review sheet — ${meta.endonym} (${meta.english})`);
  out.push("");
  out.push(`> Generated ${today} by \`npm run review:sheet -- ${lang}\`. **Do not edit the app's code to use this sheet** —`);
  out.push("> fill in the **Correction** column and send the file back. Someone will apply it and credit you by name.");
  out.push(">");
  out.push(`> **${rows.length} strings**, of which **${missing}** have no ${meta.endonym} text at all yet.`);
  out.push(`> Every existing translation below was produced by a machine and has **never been read by a speaker** —`);
  out.push("> that is what this sheet is for. Treat them as a first draft by someone who does not know the language.");
  out.push("");
  out.push("**How to fill this in**");
  out.push("");
  out.push("- Leave the Correction cell **empty** if the current text is right.");
  out.push('- Write the better wording in it if it is not. "I would say it completely differently" is the most useful answer we can get.');
  out.push("- Write **`?`** if the English itself is unclear, or if the idea does not translate — say so, and we will change the English.");
  out.push("- You do not have to finish. **Tier 1 alone is worth more than the rest put together.**");
  out.push("");

  // Known-wrong strings jump the queue: a reviewer should not work through the consent copy while a
  // scene sits in the app telling their readers something that did not happen.
  const flagged = flaggedFor(lang);
  if (flagged.length) {
    out.push(`## ⚠️ Start here — ${flagged.length} string(s) we already know are wrong`);
    out.push("");
    out.push(
      `These are not ranked by risk like the tiers below; they are things that have already been found. ` +
        `Please look at them before anything else.`,
    );
    out.push("");
    for (const f of flagged) {
      out.push(`- **\`${f.file}\`** — search this sheet for *"${f.englishSnippet}"*.`);
      out.push(`  ${f.why}`);
      out.push("");
    }
  }

  for (const t of TIERS) {
    const mine = rows.filter((r) => r.tier === t.tier);
    if (mine.length === 0) continue;
    const spec = tierSpec(t.tier);
    out.push(`## Tier ${t.tier} — ${spec.title}  ·  ${mine.length} strings`);
    out.push("");
    out.push(`> ${spec.why}`);
    out.push("");
    out.push(`| ✔ | English | Current ${meta.endonym} | Correction | Where |`);
    out.push("|---|---|---|---|---|");
    for (const r of mine) {
      const current = r.current === undefined ? "**— nothing yet —**" : cell(r.current);
      out.push(`| ☐ | ${cell(r.en)} | ${current} |  | \`${r.file}:${r.line}\` |`);
    }
    out.push("");
  }

  out.push("---");
  out.push("");
  out.push("## When you are done");
  out.push("");
  out.push("Send this file back however suits you — email, a message, a pull request if you use git.");
  out.push("We will apply your corrections, credit you in the app's About screen (tell us the name you want used,");
  out.push("or say if you would rather not be named), and mark this language reviewed so readers can see that a");
  out.push("person checked it. See [specs/reviewer-guide.md](../specs/reviewer-guide.md).");
  out.push("");
  return { text: out.join("\n"), rows: rows.length, missing };
}

const files = sourceFiles();
const langs = all ? CODES.filter((c) => c !== "en") : wanted;

for (const lang of langs) {
  if (!CODES.includes(lang)) {
    console.error(`gen-review-sheet: "${lang}" is not a language this app speaks (${CODES.join(" ")})`);
    process.exit(2);
  }
  if (lang === "en") {
    console.error("gen-review-sheet: English is the source language — there is nothing to review against.");
    process.exit(2);
  }
  const { text, rows, missing } = sheetFor(lang, files);
  mkdirSync(OUT, { recursive: true });
  const path = join(OUT, `${lang}.md`);
  writeFileSync(path, text + "\n", "utf8");
  const meta = LANGUAGES.find((l) => l.code === lang);
  console.log(`  ✓ review/${lang}.md — ${meta.endonym}: ${rows} strings, ${missing} with no text yet`);
}

console.log(`\n  ${langs.length} sheet(s) written to review/. Nothing under src/ was modified.`);
