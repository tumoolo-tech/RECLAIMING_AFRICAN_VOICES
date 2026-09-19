// Read every link the app will show, and say where each one came from.
//
//   npm run check:topic-links                 # the whole report
//   npm run check:topic-links -- --from place:vilakazi-street   # one topic
//   npm run check:topic-links -- --json       # machine-readable, stdout only
//
// WHY THIS EXISTS, given the data is already in a checked-in file you could just read. Two things
// the file cannot show you:
//
//   1. THE SENTENCE. `topics.generated.ts` stores `{from, to, surface}` and never the prose
//      (SP-093), so a row says "Qunu was matched" but not what it was matched in. Judging whether
//      a derived link is any good means seeing the words around it, and this is the only place
//      that can — it reads the registries directly.
//   2. WHAT IS MISSING. A bare surname sitting in prose with no alias produces nothing at all, so
//      it is invisible in the output. `near misses` is the half of the report that finds work
//      rather than confirming it — it is how "qunu says Mandela" was discovered in the first place.
//
// IT WRITES NOTHING (SP-047). Not topic-aliases.ts, not topic-exclusions.ts, not the generated
// file — regenerating is `npm run gen:topics` and nothing else. Honest caveat, because
// `check-place-links.mjs` makes a stronger claim and this cannot: that script proves it writes
// nothing by not importing `node:fs` at all, and the guarantee is visible in its import list.
// This one MUST import `fs` to read the six registries that `require()` image binaries. The true
// guarantee is weaker and worth stating plainly: it opens nothing for writing.
//
// EXIT CODES, following SP-078's reasoning. `0` — everything reviewable, nothing broken. `1` — the
// repo is making a claim it cannot support: a curated link that does not resolve, or a stale
// exclusion. Things that merely want a human's eye are `·`, never red: a command that is always
// red is one people stop running (SP-046, SP-083).

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICS, MENTIONS } from "../src/content/topics.generated.ts";
import { TOPIC_LINKS } from "../src/content/topic-links.ts";
import { TOPIC_ALIASES } from "../src/content/topic-aliases.ts";
import { TOPIC_EXCLUSIONS } from "../src/content/topic-exclusions.ts";
import { buildSurfaces, findMentionsIn, MIN_SURFACE_LENGTH } from "../src/content/topic-mentions.ts";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const JSON_ONLY = args.includes("--json");
const ONLY = args.includes("--from") ? args[args.indexOf("--from") + 1] : null;

const out = (...s) => { if (!JSON_ONLY) console.log(...s); };
const k = (r) => `${r.kind}:${r.id}`;
const nameOf = (r) => TOPICS.find((t) => k(t) === k(r))?.name ?? `«${k(r)} — unresolved»`;

/** The prose the matcher saw. Rebuilt here rather than stored, so the report can show a sentence
 *  without the generated file having to carry sourced text (SP-093). */
async function prose() {
  const { places } = await import("../src/content/places.ts");
  const { presidents } = await import("../src/content/presidents.ts");
  const { articles } = await import("../src/content/articles.ts");
  const map = new Map();
  for (const p of places) map.set(`place:${p.id}`, p.what);
  for (const p of presidents) {
    map.set(`president:${p.id}`, [p.role, p.struggle, p.born, p.died, p.clan, ...(p.know ?? []),
      ...(p.life ?? []).map((l) => `${l.name} ${l.role}`),
      ...(p.family ?? []).map((f) => f.name)].filter(Boolean).join(" "));
  }
  for (const a of articles) {
    map.set(`article:${a.id}`, [a.title, a.summary, ...(a.keyPoints ?? []),
      ...(a.people ?? []).map((x) => `${x.name} ${x.note ?? ""}`)].filter(Boolean).join(" "));
  }
  // The six that require() binaries are read as text (SP-032) — same idiom as the generator.
  const raw = (f) => readFileSync(resolve(appDir, "src/content", f), "utf8");
  const literals = (block) => [...block.replace(/require\([^)]*\)/g, " ").matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((m) => m[1]).filter((s) => s.length > 2 && !/^(https?:|\.{0,2}\/)/i.test(s)).join(" ");
  for (const [file, kind] of [["heroes.ts", "hero"], ["national-days.ts", "day"]]) {
    const src = raw(file);
    const starts = [...src.matchAll(/^ {4}id: "([^"]+)",$/gm)];
    starts.forEach((m, i) => {
      const end = i + 1 < starts.length ? starts[i + 1].index : src.length;
      map.set(`${kind}:${m[1]}`, literals(src.slice(m.index, end)));
    });
  }
  for (const f of ["mhudi.ts", "ityala-lamawele.ts", "indaba.ts", "vilakazi.ts", "unsung-heroes.ts",
    "marriage-rites.ts", "peopling-of-sa.ts", "peoples-cultures.ts", "traditions.ts", "food.ts"]) {
    const src = raw(f);
    const id = /^ {2}id: "([^"]+)",$/m.exec(src)?.[1];
    if (id) map.set(`module:${id}`, literals(src));
  }
  return map;
}

/** ±N characters of the real text around the match — the thing a person needs to judge a link. */
function context(text, surface, pad = 46) {
  const at = text?.indexOf(surface) ?? -1;
  if (at === -1) return null;
  const from = Math.max(0, at - pad);
  const to = Math.min(text.length, at + surface.length + pad);
  return `${from > 0 ? "…" : ""}${text.slice(from, at)}⟦${surface}⟧${text.slice(at + surface.length, to)}${to < text.length ? "…" : ""}`
    .replace(/\s+/g, " ");
}

async function main() {
  const texts = await prose();
  const problems = [];

  out(`→ Ubuntu Heritage · topic links · reports only, writes nothing (SP-047)\n`);

  // ── index ──────────────────────────────────────────────────────────────────────────────────
  const byKind = {};
  for (const t of TOPICS) byKind[t.kind] = (byKind[t.kind] ?? 0) + 1;
  out(`→ index`);
  out(`  ✓ ${TOPICS.length} topics · ${Object.entries(byKind).map(([a, b]) => `${a} ${b}`).join(" · ")}`);
  const inert = [...new Set(TOPICS.filter((t) => !t.routable).map((t) => t.kind))];
  if (inert.length) out(`  · ${inert.join(", ")} have no route — indexed as sources, never targets (SP-097)`);

  // ── curated ────────────────────────────────────────────────────────────────────────────────
  out(`\n→ curated links — authored, each with a reason (SP-024)`);
  if (!TOPIC_LINKS.length) out(`  · none yet`);
  const known = new Set(TOPICS.map(k));
  for (const l of TOPIC_LINKS) {
    const bad = [l.from, l.to].filter((r) => !known.has(k(r)));
    if (bad.length) {
      out(`  ✗ ${k(l.from)} → ${k(l.to)} — ${bad.map(k).join(", ")} does not resolve`);
      problems.push(`unresolvable curated link ${k(l.from)} → ${k(l.to)}`);
      continue;
    }
    out(`  ✓ ${nameOf(l.from)} → ${nameOf(l.to)}  [${l.relation}]`);
    out(`      ${l.why.length > 96 ? `${l.why.slice(0, 96)}…` : l.why}`);
  }

  // ── mentions, with the sentence ────────────────────────────────────────────────────────────
  const shown = ONLY ? MENTIONS.filter((m) => k(m.from) === ONLY) : MENTIONS;
  out(`\n→ mentions — derived from prose, no reason because nobody wrote one (SP-090)`);
  if (ONLY) out(`  · filtered to --from ${ONLY}`);
  let last = null;
  for (const m of shown) {
    if (k(m.from) !== last) { out(`\n  ${nameOf(m.from)}  (${k(m.from)})`); last = k(m.from); }
    out(`    → ${nameOf(m.to)}`);
    const c = context(texts.get(k(m.from)), m.surface);
    out(`        ${c ?? `«${m.surface}» — prose not found, the registry may have changed`}`);
  }
  if (!shown.length) out(`  · none`);

  // ── near misses: the half that finds work ──────────────────────────────────────────────────
  out(`\n→ near misses — prose that names a topic but produces no link`);
  const surfaces = buildSurfaces(TOPICS, TOPIC_ALIASES);
  const linked = new Set(MENTIONS.map((m) => `${k(m.from)}→${k(m.to)}`));
  let misses = 0;
  // PEOPLE ONLY, and this restriction is the whole heuristic.
  //
  // The first version took the last word of any multi-word name as "what a writer would use on
  // second mention". For a person that is a surname. For a place it is a category noun, and the
  // report filled with `District Six says "Museum" but does not link to Mafikeng Museum` — twenty
  // rows of noise that would teach anyone to skip this section, which is the same failure SP-046
  // and SP-083 warn about one level up. A person's surname is the only case where the last word
  // actually identifies the topic.
  const PEOPLE = new Set(["president", "hero"]);
  // A surname shared by two topics identifies neither; "Mandela" alone cannot mean Nelson or
  // Winnie, which is exactly why it needed a deliberate alias rather than a suggestion.
  const surnames = new Map();
  for (const t of TOPICS) {
    if (!PEOPLE.has(t.kind)) continue;
    const parts = t.name.split(/\s+/);
    if (parts.length < 2) continue;
    const bare = parts[parts.length - 1].replace(/[^\w-]/g, "");
    if (bare.length < MIN_SURFACE_LENGTH) continue;
    surnames.set(bare, (surnames.get(bare) ?? 0) + 1);
  }
  for (const t of TOPICS) {
    const text = texts.get(k(t));
    if (!text) continue;
    for (const other of TOPICS) {
      if (k(other) === k(t) || !other.routable || !PEOPLE.has(other.kind)) continue;
      const parts = other.name.split(/\s+/);
      if (parts.length < 2) continue;
      const bare = parts[parts.length - 1].replace(/[^\w-]/g, "");
      if (bare.length < MIN_SURFACE_LENGTH) continue;
      if (surnames.get(bare) !== 1) continue; // ambiguous surname — a human must choose, not a hint
      if ((TOPIC_ALIASES[k(other)] ?? []).includes(bare)) continue;
      if (linked.has(`${k(t)}→${k(other)}`)) continue;
      if (!new RegExp(`(^|[^\\w])${bare}([^\\w]|$)`).test(text)) continue;
      misses++;
      out(`  · ${t.name} says "${bare}" but does not link to ${other.name}`);
      out(`        ${context(text, bare) ?? ""}`);
    }
  }
  if (!misses) out(`  ✓ none — every bare name in prose is either linked or aliased`);
  else out(`\n  Add an alias in topic-aliases.ts to pick these up — one at a time, each with a reason.`);

  // ── exclusions ─────────────────────────────────────────────────────────────────────────────
  out(`\n→ exclusions — rejections, as reviewable as acceptances (SP-096)`);
  if (!TOPIC_EXCLUSIONS.length) out(`  · none — correct until a human has read this report and found a wrong match`);
  for (const e of TOPIC_EXCLUSIONS) {
    // Would it still fire if lifted? Only this script can answer: it needs the prose.
    const source = TOPICS.find((t) => k(t) === k(e.from));
    const text = texts.get(k(e.from));
    const would = source && text
      ? findMentionsIn({ ...source, prose: text }, surfaces, []).some((m) => k(m.to) === k(e.to))
      : false;
    if (would) {
      out(`  ✓ ${k(e.from)} → ${k(e.to)} — still suppressing`);
      out(`      ${e.why}`);
    } else {
      out(`  ✗ ${k(e.from)} → ${k(e.to)} — matches nothing any more; delete it`);
      problems.push(`stale exclusion ${k(e.from)} → ${k(e.to)}`);
    }
  }

  if (JSON_ONLY) {
    console.log(JSON.stringify({ topics: TOPICS.length, curated: TOPIC_LINKS.length, mentions: MENTIONS.length, problems }, null, 2));
    return problems.length ? 1 : 0;
  }

  out(`\n${TOPICS.length} topics · ${TOPIC_LINKS.length} curated · ${MENTIONS.length} mentions · ${misses} near miss(es)`);
  if (problems.length) {
    console.error(`\n❌ ${problems.length} problem(s) — the repo is claiming something it cannot support.`);
    for (const p of problems) console.error(`   ${p}`);
    console.error(`   Fix: correct the row, then npm run gen:topics\n`);
    return 1;
  }
  out(`\n✅ Nothing broken. Near misses and mentions are for your eye, not a failure.\n`);
  return 0;
}

process.exitCode = await main();
