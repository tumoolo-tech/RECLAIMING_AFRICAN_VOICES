// The register has to describe the assets that are actually there (issue #35).
//
// A rights register is only worth anything if it cannot drift from the bundle. The failure mode is
// not someone writing a false entry — it is someone dropping a new mp3 into assets/ and nobody
// noticing that it inherited a permission granted for something else. So this walks the real
// directory and fails when a file is claimed by nobody, by more than one source, or when a source's
// pinned count no longer matches what is on disk.
//
// It reads the filesystem and imports media-rights.ts directly, which is safe because that file is
// pure data — it names paths as strings and never `require()`s an asset (the SP-032 trap).

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { mediaSources, sourceClaims, unclearedSources, type MediaSource } from "./media-rights.ts";

const HERE = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ASSETS = join(HERE, "..", "..", "assets");

/** Every file under assets/, as a path relative to it, with "/" separators.
 *  .md files are excluded: they are notes to humans about how to add media, not media — nothing
 *  `require()`s them and nothing ships them. */
function bundledFiles(dir = ASSETS, prefix = ""): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (statSync(abs).isDirectory()) out.push(...bundledFiles(abs, rel));
    else if (!name.endsWith(".md")) out.push(rel);
  }
  return out;
}

/** The files one source claims, decided by the register's own matcher so the test cannot drift into
 *  a second, kinder interpretation of the claim syntax. */
function filesClaimedBy(source: MediaSource, all: string[]): string[] {
  return all.filter((f) => sourceClaims(source, f));
}

test("the register covers every bundled asset", () => {
  const all = bundledFiles();
  assert.ok(all.length > 500, `expected the full asset tree, walked ${all.length} files`);

  const claimed = new Map<string, string[]>();
  for (const s of mediaSources) {
    for (const f of filesClaimedBy(s, all)) {
      claimed.set(f, [...(claimed.get(f) ?? []), s.id]);
    }
  }

  const orphans = all.filter((f) => !claimed.has(f));
  assert.deepEqual(
    orphans.slice(0, 20),
    [],
    `${orphans.length} asset(s) have no entry in media-rights.ts. Every shipped file needs one — ` +
      `add the source (or "[NEEDS SOURCE]" and status "unverified"), never a guess:\n  ` +
      orphans.slice(0, 20).join("\n  ")
  );
});

test("no asset is claimed by two sources", () => {
  const all = bundledFiles();
  const owners = new Map<string, string[]>();
  for (const s of mediaSources) {
    for (const f of filesClaimedBy(s, all)) owners.set(f, [...(owners.get(f) ?? []), s.id]);
  }
  // Two claims on one file means two different permissions are being asserted over it, and the
  // register can no longer answer "may we ship this?" with one answer.
  const doubled = [...owners].filter(([, ids]) => ids.length > 1);
  assert.deepEqual(
    doubled.slice(0, 10).map(([f, ids]) => `${f} <- ${ids.join(", ")}`),
    [],
    `${doubled.length} asset(s) are claimed by more than one source`
  );
});

test("each source's pinned count matches what is on disk", () => {
  const all = bundledFiles();
  const drift: string[] = [];
  for (const s of mediaSources) {
    const n = filesClaimedBy(s, all).length;
    if (n !== s.count) drift.push(`${s.id}: pinned ${s.count}, found ${n}`);
  }
  // A silent extension is the real risk: one more clip in journey/clips/ would otherwise ride in
  // under a permission that was never granted for it.
  assert.deepEqual(drift, [], `\n  ${drift.join("\n  ")}\n`);
});

test("an unverified source says what is unknown, rather than inventing a holder", () => {
  for (const s of unclearedSources()) {
    assert.ok(s.basis.length > 40, `${s.id}: an unverified source must explain itself`);
    // "[NEEDS SOURCE]" is the repo's marker for a fact nobody has established (AGENTS.md §4). The
    // point of the register is that an empty answer is visible, not that every box is filled.
    if (s.holder === "") assert.fail(`${s.id}: holder is blank — use "[NEEDS SOURCE]"`);
  }
});

test("nothing can be marked cleared without evidence recorded", () => {
  // The guard this replaces searched `basis` for the word "permission" — which the soundtrack's own
  // text already contains ("Permission not yet requested"), so flipping it to "cleared" passed.
  // Mutation testing caught that. Evidence is now a field you either filled in or did not.
  for (const s of mediaSources) {
    if (s.status !== "cleared") continue;
    assert.ok(
      s.evidence && s.evidence.trim().length > 20,
      `${s.id}: status is "cleared" but no evidence is recorded. Name the licence, the ` +
        `public-domain calculation, or the written permission — a status is not its own proof.`
    );
  }
});

test("the soundtrack is still the biggest single claim, and still unverified", () => {
  const music = mediaSources.find((s) => s.id === "soundtrack-african-tribe-echoes");
  assert.ok(music, "the soundtrack entry has been removed");
  assert.equal(music.count, 202);
  // Not an assertion that it must stay unverified forever — the previous test is what makes a
  // change to "cleared" cost something. This one just keeps the row from quietly shrinking.
  assert.ok(music.status === "unverified" || music.evidence, "the soundtrack changed status without evidence");
});
