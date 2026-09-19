// Mentions a human has looked at and rejected. Hand-written; `npm run gen:topics` reads this file
// and never writes it (SP-047, SP-096).
//
// PAIR-SCOPED, NEVER A GLOBAL BLOCKLIST. The tempting fix for one bad match is to ban the surface
// everywhere — and that is how a matcher quietly stops working while still looking maintained.
// Banning "Mandela" to kill one row would silently drop nine good ones. So an exclusion names the
// two topics and nothing else.
//
// EVERY ROW CARRIES A REASON, for the same purpose `TopicLink.why` does (SP-024): a rejection has
// to be reviewable in six months without asking whoever made it. A rejection is a decision.
//
// STALE ENTRIES FAIL THE BUILD. `topic-mentions.test.ts` asserts every exclusion still suppresses a
// mention that would otherwise appear. If prose changes so a row stops doing work, it must be
// deleted rather than left behind looking like a guard.
//
// Empty is the correct state until a human has read `npm run check:topic-links` and found a match
// that is wrong. Pre-emptive exclusions would be guessing, which is the thing this layer avoids.

import type { Exclusion } from "./topic-mentions.ts";

export const TOPIC_EXCLUSIONS: Exclusion[] = [];
