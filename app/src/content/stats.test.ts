import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Every number this app shows a reader, and the state of its evidence (issue #31).
//
// WHAT WENT WRONG. All nine province population figures were marked `status: "verify"` while their
// label read "People (Census 2022)". On screen that is a citation; in the data it was an admission
// that nobody had checked. And the honesty pill that exists for city stats was never wired to those
// nine — they rendered through a plain `Mini` — so the contradiction was invisible from both sides.
// The figures turned out to match Stats SA exactly, which is luck, not method; the Free State was
// truncated (2 964 412 shown as "~2.9M", which rounds to 3.0M).
//
// So: a stat may say "we have not checked this", and a stat may cite a source — but a stat that NAMES
// a source in its label must be able to produce it.
//
// Read as text, not imported: provinces.ts `require()`s hero images and throws under `node --test`,
// the same constraint places.test.ts works around (SP-032).

const SRC = new URL("./provinces.ts", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const src = readFileSync(SRC, "utf8");

/** Every `{ label, value, status, source? }` literal in the file. */
function stats(): { raw: string; label: string; value: string; status: string; source?: string }[] {
  const out: { raw: string; label: string; value: string; status: string; source?: string }[] = [];
  const re = /\{\s*label:\s*"([^"]+)",\s*value:\s*"([^"]+)",\s*status:\s*"(cited|verify)"(?:\s*,\s*source:\s*"([^"]*)")?\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) out.push({ raw: m[0], label: m[1], value: m[2], status: m[3], source: m[4] });
  return out;
}

test("the parser sees the stats — an empty sweep proves nothing", () => {
  const all = stats();
  assert.ok(all.length >= 25, `expected the province and city stats, found ${all.length}`);
  assert.ok(all.some((s) => s.status === "cited"), "some stats are cited");
  assert.ok(all.some((s) => s.status === "verify"), "some stats are still honestly unverified — that is allowed");
});

/**
 * Pre-existing `cited` stats that name no source — 48 of them when `source` was added on 2026-09-25.
 *
 * They were marked cited before the field existed, so nothing was withheld; the claim simply has no
 * publication recorded. Most are city founding dates and universities, and most are probably easy to
 * source — but sourcing 48 facts is a research job, not a side-effect of this change, and pretending
 * otherwise by deleting the check would be worse than counting them.
 *
 * So this is a RATCHET, the same shape as the content-coverage floor: the number may go DOWN as facts
 * get sourced, never up. A new `cited` stat must arrive with its source.
 */
const MAX_SOURCELESS_CITED = 48;

test("no NEW cited stat may arrive without a source, and the old ones only decrease", () => {
  const sourceless = stats().filter((s) => s.status === "cited" && !(s.source && s.source.trim().length > 12));
  assert.ok(
    sourceless.length <= MAX_SOURCELESS_CITED,
    `${sourceless.length} cited stats name no source (was ${MAX_SOURCELESS_CITED}). A new one needs its ` +
      `publication, or mark it "verify" until it has one. New: ${sourceless.map((s) => s.label).join(", ")}`,
  );
  if (sourceless.length < MAX_SOURCELESS_CITED) {
    assert.fail(
      `Good news: ${MAX_SOURCELESS_CITED - sourceless.length} stat(s) gained a source. ` +
        `Lower MAX_SOURCELESS_CITED to ${sourceless.length} so the ground you gained is held.`,
    );
  }
});

test("a label that names a source cannot be unverified — this is the bug that shipped", () => {
  // If the label says "Census 2022", the reader has been told where the number comes from. Either the
  // data can back that or the label should not say it.
  const NAMES_A_SOURCE = /census\s*(19|20)\d{2}|\bStatsSA\b|\bStats SA\b|\bsurvey\b/i;
  for (const s of stats()) {
    if (!NAMES_A_SOURCE.test(s.label)) continue;
    assert.equal(
      s.status,
      "cited",
      `"${s.label}" = "${s.value}" names a source in its label but is marked ${s.status}. ` +
        `A citation on screen with nothing behind it in the data is the defect issue #31 exists for.`,
    );
  }
});

test("the nine province populations are cited to Census 2022, with the exact count recorded", () => {
  const pop = stats().filter((s) => /People \(Census 2022\)/.test(s.label));
  assert.equal(pop.length, 9, "one population figure per province");
  for (const s of pop) {
    assert.equal(s.status, "cited");
    assert.match(s.source ?? "", /P0301\.4/, `${s.value}: name the statistical release, not just "Stats SA"`);
    // The exact count travels with the rounded display value, so the rounding can be re-checked
    // without going back to the PDF — which is how the Free State truncation was found.
    assert.match(s.source ?? "", /\d[\d\s]{6,}/, `${s.value}: record the exact count from Table 2.2`);
  }
});

test("the rounded value on screen agrees with the exact count behind it", () => {
  // The Free State read "~2.9M" for 2 964 412. Rounding is arithmetic, so it is checked rather than
  // eyeballed: the displayed figure must be within 50 000 of the real one.
  for (const s of stats().filter((x) => /People \(Census 2022\)/.test(x.label))) {
    const exact = Number((s.source ?? "").match(/([\d\s]{7,})\s*$/)?.[1].replace(/\s/g, ""));
    const shown = Number(s.value.replace(/[^\d.]/g, "")) * 1_000_000;
    assert.ok(Number.isFinite(exact) && exact > 0, `${s.value}: could not read the exact count from the source`);
    assert.ok(
      Math.abs(exact - shown) < 50_000,
      `"${s.value}" is shown for ${exact.toLocaleString("en-ZA")} — off by ${Math.abs(exact - shown).toLocaleString("en-ZA")}. Round, do not truncate.`,
    );
  }
});
