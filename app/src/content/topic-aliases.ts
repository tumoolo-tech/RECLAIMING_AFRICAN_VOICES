// Extra names a topic is known by, for the mention matcher. Hand-written, one at a time, never
// generated and never guessed.
//
// WHY THIS FILE EXISTS. Prose calls people what people call them. "Mandela" appears in ten place
// texts; his full name appears in seven. Without an alias, `qunu` ("Where Mandela's mother took the
// family after his father's death…") and `nelson-mandela-museum` ("…at Qunu where Mandela grew
// up…") both silently lose the link — the two places most obviously about him.
//
// WHY BARE SURNAMES ARE SAFE HERE, AND ONLY HERE (SP-095). A surname is exactly where the
// collisions are: "Mandela" is a word-bounded token inside "Winnie Madikizela-Mandela" (the hyphen
// is a boundary) and inside "Mandela House". The matcher tries surfaces LONGEST FIRST and lets an
// accepted match claim its characters, so both longer names take their own span before the alias
// can reach it. That ordering is the entire safety argument, and `topic-mentions.test.ts` pins it
// with the Winnie case.
//
// THE BAR FOR ADDING ONE. It must be a name the sources themselves use, it must be at least
// MIN_SURFACE_LENGTH, and it must earn a comment saying which real prose it unlocks. An alias that
// unlocks nothing is dead data, and dead data rots — which is why "Madiba", "Biko", "Sobukwe" and
// "Ngoyi" are NOT here: none of them appears in any topic's prose today. Add them the day they do.
//
// `npm run check:topic-links` prints a "near misses" section listing bare surnames that occur in
// prose but have no alias — that is how the next entry gets found, rather than by guessing.

import type { AliasTable } from "./topic-mentions.ts";

export const TOPIC_ALIASES: AliasTable = {
  // Unlocks `qunu` and `nelson-mandela-museum`, which name him by surname alone. Safe because
  // "Mandela House" and "Winnie Madikizela-Mandela" are longer surfaces and claim their own
  // characters first.
  "president:mandela": ["Mandela"],

  // Found by the "near misses" section of `npm run check:topic-links`, not by guessing: Kgalema
  // Motlanthe's record says "After Mbeki's resignation, until the 2009 election". Unambiguous —
  // Thabo Mbeki is the only Mbeki in the index, which is the test the report applies before
  // suggesting a surname at all.
  "president:mbeki": ["Mbeki"],
};
