// Find where one topic's prose names another topic — the derived half of the linking layer.
//
// WHAT A MENTION IS, AND IS NOT (SP-090). Tumo asked for topics to link to each other and chose
// automatic name matching over hand-authored rows. Automatic matching cannot produce an editorial
// reason, and inventing one is the fabrication AGENTS.md §2 forbids. But a mention does not need
// one, because it is not a historical claim: if Mandela House's already-sourced prose contains the
// words "Vilakazi Street", making those words navigable asserts nothing new. It is a way to move,
// not a statement about the past.
//
// That distinction is enforced by the TYPE, not by discipline. `Mention` has no `why` and no
// `relation` field, so no component can render an invented reason even by mistake — the same
// technique that makes `TopicLink.why` required. A curated link asserts a connection; a mention
// reports a word.
//
// THIS DOES NOT REOPEN SP-016 (SP-094). That decision bans "fuzzy name matching anywhere", and it
// is right to. This is a different operation: SP-016 forbids IDENTIFYING a record by an approximate
// name (`landmarkLabel` must be the exact string in provinces.ts). Here an exact name is being
// FOUND inside prose that already contains it. Nothing approximate is ever accepted — no stemming,
// no case folding, no edit distance, and there never will be.
//
// PURE, AND NO `node:fs` (SP-064). The generator calls it with data read from disk; the tests call
// it with fixtures. It must stay importable from both, so it reads nothing itself.

import type { ContentRef } from "./topic-links.ts";

// The TYPES live here, in hand-written code; only the DATA is generated. That is also what breaks
// the cycle: `topics.generated.ts` imports these, the generator imports this module, and nothing
// has to exist before the first `npm run gen:topics` can run.

/** One linkable topic. `routable: false` means the kind has no route yet, so it may be a mention
 *  SOURCE but never a link TARGET (SP-097). */
export type Topic = { kind: ContentRef["kind"]; id: string; name: string; routable: boolean };

/** The matched name is the label AND the evidence. No `why`, no `relation` — deliberately not
 *  representable, so no component can render an invented reason (SP-090). */
export type Mention = { from: ContentRef; to: ContentRef; surface: string };

/** A topic plus the prose to scan. The generator assembles these; nothing stores them
 *  (SP-093 — sourced prose stays single-homed in its registry). */
export type TopicProse = Topic & { prose: string };

/** Names shorter than this are never matched. A BACKSTOP, not a distinctiveness test.
 *
 *  It was 6 for one run, on the theory that short names are risky. Then the Nelson Mandela Museum —
 *  whose single sentence names Qunu, Mvezo and Mandela, three real topics — produced zero links,
 *  and the theory failed on the richest sentence in the corpus. Checking the whole index, every
 *  topic name of four characters or more is a distinctive proper noun: "Qunu", "Mvezo", "Mhudi",
 *  "Egazini". Length was standing in for distinctiveness and doing it badly.
 *
 *  So 4, which admits everything real here, and the job of catching a name too generic to match is
 *  given to the thing that can actually do it: a human reading `npm run check:topic-links` and
 *  writing a pair-scoped exclusion. The floor stays only to stop a future one- or two-character
 *  name matching half the corpus before anyone notices. */
export const MIN_SURFACE_LENGTH = 4;

/** Hand-written extra names for a topic, keyed `"kind:id"`. Bare surnames live here and nowhere
 *  else — see `topic-aliases.ts` for why each one is safe. */
export type AliasTable = Record<string, string[]>;

/** A rejected pair, with a reason — SP-096. Pair-scoped, never a global blocklist: killing the
 *  surface "Mandela" everywhere to fix one false positive is how a matcher quietly stops working
 *  while still looking maintained. A rejection should be as reviewable as an acceptance (SP-024). */
export type Exclusion = { from: ContentRef; to: ContentRef; why: string };

type Surface = { text: string; topic: Topic };

const isWordChar = (c: string | undefined): boolean =>
  c !== undefined && /[A-Za-z0-9]/.test(c);

const refOf = (t: Topic): ContentRef => ({ kind: t.kind, id: t.id });
const key = (r: ContentRef): string => `${r.kind}:${r.id}`;
const pairKey = (a: ContentRef, b: ContentRef): string => `${key(a)}→${key(b)}`;

/** Every name and alias, LONGEST FIRST.
 *
 *  The ordering is load-bearing, not cosmetic (SP-095). "Mandela" is a word-bounded token inside
 *  "Winnie Madikizela-Mandela" — the hyphen is a boundary — and inside "Mandela House". Trying the
 *  longer surface first lets it claim those characters, so the alias can never steal them. Without
 *  this, one hand-written alias would mis-attribute Winnie's page to Nelson Mandela.
 *
 *  Ties break on kind rank then id, so the output order is total and two runs are byte-identical. */
export function buildSurfaces(topics: Topic[], aliases: AliasTable): Surface[] {
  const all: Surface[] = [];
  for (const topic of topics) {
    for (const text of [topic.name, ...(aliases[key(refOf(topic))] ?? [])]) {
      if (text.length >= MIN_SURFACE_LENGTH) all.push({ text, topic });
    }
  }
  return all.sort(
    (a, b) =>
      b.text.length - a.text.length ||
      a.topic.kind.localeCompare(b.topic.kind) ||
      a.topic.id.localeCompare(b.topic.id),
  );
}

/** Pure core: every mention in one topic's prose.
 *
 *  `indexOf`, NOT `RegExp`. Topic names contain `'`, `.`, `-` and `&`, and building patterns out of
 *  them means escaping them correctly every time; getting that wrong drops links silently rather
 *  than loudly, which is the worst failure mode available here. A hit counts only when the
 *  characters either side are not alphanumeric.
 *
 *  Accepted spans are claimed, and any later hit overlapping a claimed span is discarded. That one
 *  mechanism is what makes bare-surname aliases safe. */
export function findMentionsIn(
  source: TopicProse,
  surfaces: Surface[],
  exclusions: Exclusion[],
): Mention[] {
  const from = refOf(source);
  const text = source.prose ?? "";
  const excluded = new Set(exclusions.map((e) => pairKey(e.from, e.to)));
  const claimed: Array<[number, number]> = [];
  const found = new Map<string, Mention>();

  for (const { text: surface, topic } of surfaces) {
    const to = refOf(topic);
    const isSelf = key(to) === key(from);
    const isExcluded = excluded.has(pairKey(from, to));

    // A self-match still CLAIMS its characters before it is discarded. Your own name is yours: a
    // day called "Nelson Mandela International Day" whose prose repeats its own title must not
    // then have the president matched inside it. Skipping the surface outright would leave those
    // characters free for a shorter name to take — which is the same hole longest-first exists to
    // close. An excluded pair is treated the same way, so rejecting a match cannot hand the span
    // to a worse one.
    let at = 0;
    for (;;) {
      const start = text.indexOf(surface, at);
      if (start === -1) break;
      const end = start + surface.length;
      at = start + 1;
      if (isWordChar(text[start - 1]) || isWordChar(text[end])) continue;
      if (claimed.some(([a, b]) => start < b && end > a)) continue;
      claimed.push([start, end]);
      if (isSelf || isExcluded) break;
      // One mention per pair, keeping the longest surface — and surfaces arrive longest first, so
      // the first one accepted for a pair is already the longest.
      if (!found.has(key(to))) found.set(key(to), { from, to, surface });
      break;
    }
  }
  return [...found.values()];
}

/** Pure core: every mention across every topic. Deterministic — source order, then the surface
 *  ordering above, so regenerating an unchanged repo produces a byte-identical file. */
export function findMentions(
  sources: TopicProse[],
  topics: Topic[],
  aliases: AliasTable,
  exclusions: Exclusion[],
): Mention[] {
  const surfaces = buildSurfaces(topics, aliases);
  return sources.flatMap((s) => findMentionsIn(s, surfaces, exclusions));
}
