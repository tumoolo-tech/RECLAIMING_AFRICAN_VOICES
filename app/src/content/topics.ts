// Everything connected to a topic, in one call — the thing a screen actually asks for.
//
// The two tiers stay separate all the way to the component (SP-090), because they are different
// kinds of statement and must not be rendered as one list:
//
//   curated — a person decided these two things are connected and wrote down why. Carries a
//             `why` and a `direct`/`thematic` relation, and SP-041 governs how each renders.
//   mentions — this topic's own already-sourced prose contains that topic's name. Carries no
//             reason, because nobody wrote one. The matched words are the whole of it.
//
// Both directions come back from one stored row. A curated link is stored once (SP-091) and the
// reverse derived; a mention is found once in the prose that contains it, and the topic named
// derives a "mentioned in" from the same record. Nothing is stored twice, so nothing can drift.
//
// WHY THIS FILE RATHER THAN `topic-mentions.ts`: that module is the pure matcher, and its header
// promises it reads nothing and depends on no data. Binding to the generated registry belongs
// here — the pure core / bound wrapper split this repo uses everywhere (SP-064).

import { TOPICS, MENTIONS } from "./topics.generated.ts";
import type { Topic, Mention } from "./topic-mentions.ts";
import { linksFor, type ContentRef, type ResolvedLink } from "./topic-links.ts";

export type { Topic, Mention };

const key = (r: ContentRef): string => `${r.kind}:${r.id}`;
const byKey = new Map(TOPICS.map((t) => [key(t), t]));

/** The topic a ref points at, or undefined if it does not resolve. Callers DROP an unresolved ref
 *  rather than rendering a blank row — a dangling link should never blank a reader's screen. */
export const topicFor = (ref: ContentRef): Topic | undefined => byKey.get(key(ref));

/** A mention with the topic on the other end already resolved, and which way round it was found.
 *
 *  `direction: "out"` — this topic's prose names the other one.
 *  `direction: "in"`  — the other topic's prose names this one. DERIVED from the same record. */
export type RelatedMention = { topic: Topic; surface: string; direction: "out" | "in" };

/** A curated link with its other end resolved, so the UI never looks a topic up twice. */
export type RelatedLink = { topic: Topic; relation: ResolvedLink["relation"]; why: string; direction: "out" | "in" };

export type Related = { curated: RelatedLink[]; mentions: RelatedMention[] };

/** Pure core, so the rules below are testable without the real registry (SP-064). */
export function resolveRelated(
  ref: ContentRef,
  links: ResolvedLink[],
  mentions: Mention[],
  topics: Topic[],
): Related {
  const lookup = new Map(topics.map((t) => [key(t), t]));
  const me = key(ref);

  const curated: RelatedLink[] = [];
  for (const l of links) {
    const topic = lookup.get(key(l.other));
    if (topic) curated.push({ topic, relation: l.relation, why: l.why, direction: l.direction });
  }

  // A pair that is BOTH curated and mentioned shows once, as the curated row: an authored reason
  // is a better statement than the bare words, and showing both would say the same thing twice.
  const alreadyCurated = new Set(curated.map((c) => key(c.topic)));

  // A MUTUAL pair is two records — Vilakazi Street names Mandela House and Mandela House names
  // Vilakazi Street — and rendering both would put the same topic under "Also mentioned here" AND
  // "Mentioned in" on one page. To a reader that is the same link printed twice, and it reads as a
  // bug. Outgoing wins: those are the words on THIS page, which the reader can see for themselves,
  // and the heading is therefore the one that tells the truth without asking them to take it on
  // trust. Sorting outgoing first is what makes the first-seen-wins dedupe below deterministic.
  const mine = mentions
    .map((m) => {
      const isOut = key(m.from) === me;
      if (!isOut && key(m.to) !== me) return null;
      const direction: RelatedMention["direction"] = isOut ? "out" : "in";
      return { other: isOut ? m.to : m.from, surface: m.surface, direction };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => (a.direction === "out" ? 0 : 1) - (b.direction === "out" ? 0 : 1));

  const out: RelatedMention[] = [];
  const shown = new Set<string>();
  for (const m of mine) {
    const k = key(m.other);
    if (alreadyCurated.has(k) || shown.has(k)) continue;
    const topic = lookup.get(k);
    if (!topic) continue;
    shown.add(k);
    out.push({ topic, surface: m.surface, direction: m.direction });
  }

  return { curated, mentions: out };
}

/** Bound to the real registries — what the screens call. */
export const relatedTo = (ref: ContentRef): Related =>
  resolveRelated(ref, linksFor(ref), MENTIONS, TOPICS);
