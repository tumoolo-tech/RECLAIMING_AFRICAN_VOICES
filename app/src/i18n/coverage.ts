// How much of the CONTENT is actually translated — the counting, in one place.
//
// Both `scripts/check-languages.mjs` (the report a human reads) and `content-coverage.test.ts`
// (the ratchet that stops coverage sliding) import this. If they each carried their own regex the
// two numbers would drift, and the moment they disagreed neither could be quoted — which defeats
// the point of measuring at all.
//
// Text-scanned rather than imported, because several content files `require()` image assets and
// throw under `node --test` — the same constraint that makes places.test.ts read provinces.ts as
// text (SP-032).
//
// SCOPE. This measures `Localized` values: `{ en: "…", tn: "…" }`. It does NOT measure content
// that is plain English prose by design — places.ts, provinces.ts, articles.ts — because those
// carry sourced historical claims, and SP-015 keeps them in one language on purpose.

// Explicit `.ts` — this is a VALUE import of LANGUAGES, so node's type-stripping loader has to
// resolve it (SP-009). `localize.ts` next door gets away without the extension only because its
// import is type-only and therefore erased.
import { LANGUAGES, type LangCode } from "./languages.ts";

export type Counts = Record<LangCode, number>;

/** Count `code: "…"` occurrences for every language in one source file. */
export function countLocalizedIn(src: string): Counts {
  const counts = {} as Counts;
  for (const l of LANGUAGES) {
    counts[l.code] = (src.match(new RegExp(`\\b${l.code}:\\s*"`, "g")) ?? []).length;
  }
  return counts;
}

/** Sum counts across files. */
export function totalCounts(all: Counts[]): Counts {
  const totals = {} as Counts;
  for (const l of LANGUAGES) totals[l.code] = all.reduce((n, c) => n + c[l.code], 0);
  return totals;
}

/** Content files are the ones carrying `en:` at all — the rest are types, registries, helpers. */
export const isContentFile = (name: string): boolean =>
  name.endsWith(".ts") && !name.endsWith(".test.ts") && !name.endsWith(".data.ts");
