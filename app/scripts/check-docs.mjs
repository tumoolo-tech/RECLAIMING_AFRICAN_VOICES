#!/usr/bin/env node
// Docs lint — the claims that rotted once and must not rot again (issue #51).
//
// `npm run check:docs`. Runs in CI on every PR. Two checks, both over the repo's tracked text files
// (markdown, source, scripts, JSON, HTML), never over node_modules or build output:
//
//   1. "Maloba" as the PRODUCT NAME. The product was renamed Ubuntu Heritage on 2026-07-03 and the
//      old name kept creeping back — 36 files by mid-September. Allowed: the Setswana word and the
//      tagline (*Mantswe a maloba*), lines that SAY it is the former name, the on-chain identity
//      (the devnet memo is immutable and the certificates match it), the history (STATUS-LOG.md,
//      docs/00), and a test that uses "Maloba" as the Setswana for "yesterday".
//
//   2. The language count stated as eleven. South Africa has twelve official languages since the
//      Eighteenth Amendment (2023); the app speaks eleven of them. i18n/claims.test.ts guards src/ and
//      scripts/; this guards the docs, which is where the claim reached judges. Lines that say
//      "eleven of the twelve" or "11 of the 12" are the honest form and pass.
//
// Exit 1 with every offending line listed. No auto-fix: a rename is a judgement, not a substitution.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const TEXT = /\.(md|ts|tsx|mjs|js|json|html|yml|yaml|sh)$/;

// Files where "Maloba" is history or identity, not a stale product name.
const NAME_ALLOWED_FILES = [
  /^STATUS-LOG\.md$/, // the record of what was said, when
  /^docs\/00-project-plan\.md$/, // marked historical
  /^chain\//, // on-chain identity: the memo says p:"maloba" and cannot change; certificates match it
  /^app\/src\/content\/heritage\.data\.ts$/, // generated from chain/ — carries the same identity line
  /^app\/src\/i18n\/localize\.test\.ts$/, // "Maloba" as the Setswana word for "yesterday"
  /^app\/scripts\/check-docs\.mjs$/, // this file
];
// Lines where the word is explained, not used as the current name.
const NAME_ALLOWED_LINE =
  /mantswe a maloba|setswana for|setswana:|is setswana|working name|former(ly)?\b|renamed|historical name|was developed under|maloba → ubuntu|maloba->ubuntu|\bold name\b|the name\.\*\* these documents/i;

// The count-of-eleven claim in any of the wordings that shipped; "eleven of the twelve" passes.
const LANG_CLAIM = /\b(11|eleven)\s+(South\s+African\s+|SA\s+)?official\s+(South\s+African\s+|SA\s+)?languages?\b/i;
const LANG_ALLOWED_FILES = [/^STATUS-LOG\.md$/, /^docs\/00-project-plan\.md$/, /^app\/scripts\/check-docs\.mjs$/, /^app\/src\/i18n\/claims\.test\.ts$/];

const files = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter((f) => f && TEXT.test(f) && !f.startsWith("app/dist/"));

const problems = [];
for (const f of files) {
  const lines = readFileSync(resolve(ROOT, f), "utf8").split("\n");
  const nameFileOk = NAME_ALLOWED_FILES.some((re) => re.test(f));
  const langFileOk = LANG_ALLOWED_FILES.some((re) => re.test(f));
  lines.forEach((line, i) => {
    if (!nameFileOk && /\bMaloba\b/.test(line) && !NAME_ALLOWED_LINE.test(line)) {
      problems.push(`${f}:${i + 1}: product name "Maloba" (renamed Ubuntu Heritage 2026-07-03): ${line.trim().slice(0, 90)}`);
    }
    if (!langFileOk && LANG_CLAIM.test(line)) {
      problems.push(`${f}:${i + 1}: SA has twelve official languages, not eleven — say "eleven of the twelve": ${line.trim().slice(0, 90)}`);
    }
  });
}

if (problems.length) {
  console.error(`check-docs: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error("  " + p);
  console.error("\nFix the wording (or, if a line genuinely explains the old name, make it say so — see NAME_ALLOWED_LINE).");
  process.exit(1);
}
console.log(`check-docs: ${files.length} files clean — no stale product name, language count correct.`);
