// Build the topic index — one record per linkable topic, from every content registry.
//
//   npm run gen:topics            # rewrite src/content/topics.generated.ts
//   npm run gen:topics -- --check # print what WOULD change, write nothing (what CI-ish use wants)
//
// WHY THIS IS GENERATED AND CHECKED IN, NOT COMPUTED AT RUNTIME (SP-092). Not a style call.
// `heroes.ts`, `national-days.ts`, `provinces.ts`, `totems.ts`, `journey.ts` and `anthems.ts` all
// `require()` image binaries, so a plain module cannot import them — reading them needs `node:fs`,
// and `fs` cannot ship inside the React Native bundle. A runtime index would first have to
// de-`require()` six files. Generating sidesteps that entirely, follows the existing
// `images.generated.ts` precedent, and buys the property this repo actually wants: a prose edit
// that creates or destroys a link shows up as a row in the same diff as the prose change.
//
// WHAT IS GENERATED, AND WHAT IS DELIBERATELY NOT (SP-093). Only `{kind, id, name, routable}` and
// the mentions `{from, to, surface}`. NEVER the prose. Copying sourced text into a generated file
// means an edit to `places.ts` could leave the app reasoning about stale words, and sourced prose
// staying single-homed in its registry is the whole of T4.
//
// TWO WAYS TO READ A REGISTRY. Importable ones are imported. The rest are read as TEXT with
// indent-anchored patterns — the same SP-032 idiom `places.test.ts` already uses on `provinces.ts`.
// Text-reading is narrow on purpose: it takes `id`, the display name, and the STRING LITERALS in
// the record (never `require(...)` paths, which contain topic names and would manufacture links).

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { findMentions } from "../src/content/topic-mentions.ts";
import { TOPIC_ALIASES } from "../src/content/topic-aliases.ts";
import { TOPIC_EXCLUSIONS } from "../src/content/topic-exclusions.ts";
import { TOPIC_LINKS } from "../src/content/topic-links.ts";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = resolve(appDir, "src/content");
const OUT = resolve(contentDir, "topics.generated.ts");

/** Kinds that have a route taking an id, so a link may POINT AT them (SP-097). `article`, `day` and
 *  `journey` are indexed as sources only: a chip that looks tappable and does nothing is worse than
 *  no chip. Kept in step with `ROUTE_FOR_KIND` in App.tsx by `topic-route.test.ts`. */
const ROUTABLE = new Set(["place", "president", "hero", "city", "module"]);

const read = (f) => readFileSync(resolve(contentDir, f), "utf8");

/** Text-read an ARRAY registry whose records sit at four-space indent (`heroes`, `national-days`).
 *  Records are split on the `id:` line, so the prose of one never bleeds into the next. */
function fromArrayFile(file, kind, nameField = "name") {
  const src = read(file);
  const starts = [...src.matchAll(/^ {4}id: "([^"]+)",$/gm)];
  return starts.map((m, i) => {
    const from = m.index;
    const to = i + 1 < starts.length ? starts[i + 1].index : src.length;
    const block = src.slice(from, to);
    const name = new RegExp(`^ {4}${nameField}: "([^"]+)"`, "m").exec(block)?.[1] ?? "";
    return { kind, id: m[1], name, prose: literalsIn(block) };
  });
}

/** Text-read a SINGLE-object module file (`vilakazi.ts` etc.), whose fields sit at two-space indent. */
function fromModuleFile(file) {
  const src = read(file);
  const id = /^ {2}id: "([^"]+)",$/m.exec(src)?.[1];
  const name = /^ {2}title: "([^"]+)",$/m.exec(src)?.[1];
  if (!id || !name) throw new Error(`${file}: could not read id/title — the file shape changed`);
  return [{ kind: "module", id, name, prose: literalsIn(src) }];
}

/** Every double-quoted string in a block, minus the ones that are not prose. A `require(...)` path
 *  contains topic names ("assets/heroes/winnie.webp") and would invent links out of file layout. */
function literalsIn(block) {
  const withoutRequires = block.replace(/require\([^)]*\)/g, " ");
  return [...withoutRequires.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((m) => m[1])
    .filter((s) => s.length > 2 && !/^(https?:|\.{0,2}\/|[a-z-]+\.(webp|png|jpg|mp3|ts))/i.test(s))
    .join(" ");
}

async function collect() {
  // ── Imported: these registries have no `require()` and load cleanly ───────────────────────────
  const { places } = await import("../src/content/places.ts");
  const { presidents } = await import("../src/content/presidents.ts");
  const { articles } = await import("../src/content/articles.ts");

  const out = [];

  for (const p of places) {
    out.push({ kind: "place", id: p.id, name: p.name, prose: p.what });
  }
  for (const p of presidents) {
    const prose = [p.role, p.struggle, p.born, p.died, p.clan, ...(p.know ?? []),
      ...(p.life ?? []).map((l) => `${l.name} ${l.role}`),
      ...(p.family ?? []).map((f) => f.name)].filter(Boolean).join(" ");
    out.push({ kind: "president", id: p.id, name: p.name, prose });
  }
  for (const a of articles) {
    const prose = [a.title, a.summary, ...(a.keyPoints ?? []),
      ...(a.people ?? []).map((x) => `${x.name} ${x.note ?? ""}`)].filter(Boolean).join(" ");
    out.push({ kind: "article", id: a.id, name: a.title, prose });
  }

  // ── Text-read: these `require()` image binaries (SP-032) ──────────────────────────────────────
  out.push(...fromArrayFile("heroes.ts", "hero"));
  out.push(...fromArrayFile("national-days.ts", "day"));

  // ── Text-read: modules are single objects, and `index.ts` imports extensionlessly ─────────────
  for (const f of ["mhudi.ts", "ityala-lamawele.ts", "indaba.ts", "vilakazi.ts",
    "unsung-heroes.ts", "marriage-rites.ts", "peopling-of-sa.ts", "peoples-cultures.ts",
    "traditions.ts", "food.ts"]) {
    out.push(...fromModuleFile(f));
  }

  for (const t of out) {
    if (!t.name) throw new Error(`${t.kind}:${t.id} has no name — the index cannot match on nothing`);
    t.routable = ROUTABLE.has(t.kind);
  }
  return out;
}

const q = (s) => JSON.stringify(s);

function render(topics, mentions) {
  const byKind = {};
  for (const t of topics) byKind[t.kind] = (byKind[t.kind] ?? 0) + 1;
  const tally = Object.entries(byKind).map(([k, n]) => `${k} ${n}`).join(" · ");

  return `// GENERATED FILE — do not edit by hand. Regenerate: npm run gen:topics
//
// Every topic that can be linked to or from, and every MENTION found by scanning one topic's prose
// for another topic's name. ${topics.length} topics (${tally}) · ${mentions.length} mentions.
//
// WHY A FILE RATHER THAN A RUNTIME SCAN (SP-092): six content registries \`require()\` image
// binaries, so reading them needs \`node:fs\`, which cannot ship in the React Native bundle.
//
// A MENTION IS NOT A CLAIM (SP-090). It records that this topic's own already-sourced prose
// contains that topic's name. It carries no reason, because nobody wrote one — the matched words
// are the whole of it. Curated links, which DO assert a connection and DO carry a reason, live in
// \`topic-links.ts\` and are written by hand.
//
// \`routable: false\` means the kind has no route yet, so it may be a mention SOURCE but never a
// link TARGET (SP-097).
//
// If this file and \`src/content\` disagree, \`topics.generated.test.ts\` fails. Prose edits that
// create or destroy a link therefore land in the same diff as the prose.

// Types live in \`topic-mentions.ts\` — hand-written code owns the shape, this file owns only data.
import type { Topic, Mention } from "./topic-mentions.ts";

export type { Topic, Mention };

export const TOPICS: Topic[] = [
${topics.map((t) => `  { kind: ${q(t.kind)}, id: ${q(t.id)}, name: ${q(t.name)}, routable: ${t.routable} },`).join("\n")}
];

export const MENTIONS: Mention[] = [
${mentions.map((m) => `  { from: { kind: ${q(m.from.kind)}, id: ${q(m.from.id)} }, to: { kind: ${q(m.to.kind)}, id: ${q(m.to.id)} }, surface: ${q(m.surface)} },`).join("\n")}
];
`;
}

async function main() {
  const withProse = await collect();
  const topics = withProse.map(({ kind, id, name, routable }) => ({ kind, id, name, routable }));
  const all = findMentions(withProse, topics, TOPIC_ALIASES, TOPIC_EXCLUSIONS);

  // SP-097: a mention pointing at a kind with no route would render a chip that does nothing.
  // Dropped HERE rather than at render time, so the dead link is never in the data at all and no
  // future surface can resurrect it by forgetting to filter.
  const routable = new Set(topics.filter((t) => t.routable).map((t) => `${t.kind}:${t.id}`));

  // A pair that is ALSO a curated link is dropped, in either orientation. The curated row carries
  // an authored reason; the mention carries the bare words. Showing both says the same thing twice
  // on one page, and the weaker one adds nothing. Dropped here rather than at render for the same
  // reason as above: the redundancy never enters the data, so no future surface can reintroduce it.
  const curated = new Set(
    TOPIC_LINKS.flatMap((l) => [
      `${l.from.kind}:${l.from.id}→${l.to.kind}:${l.to.id}`,
      `${l.to.kind}:${l.to.id}→${l.from.kind}:${l.from.id}`,
    ]),
  );

  const mentions = all.filter(
    (m) => routable.has(`${m.to.kind}:${m.to.id}`) && !curated.has(`${m.from.kind}:${m.from.id}→${m.to.kind}:${m.to.id}`),
  );
  const dropped = all.length - mentions.length;

  const next = render(topics, mentions);
  const prev = (() => { try { return readFileSync(OUT, "utf8"); } catch { return ""; } })();

  console.log(`→ topic index`);
  console.log(`  ✓ ${topics.length} topics · ${topics.filter((t) => t.routable).length} routable`);
  console.log(`  ✓ ${mentions.length} mentions`);
  if (dropped) console.log(`  · ${dropped} dropped — no route for the target kind (SP-097), or superseded by a curated link`);

  if (next === prev) {
    console.log(`  · topics.generated.ts already current\n`);
    return 0;
  }
  if (process.argv.includes("--check")) {
    console.error(`\n❌ topics.generated.ts is stale.\n   Fix: npm run gen:topics\n`);
    return 1;
  }
  writeFileSync(OUT, next, "utf8");
  console.log(`  ✓ wrote src/content/topics.generated.ts\n`);
  return 0;
}

process.exitCode = await main();
