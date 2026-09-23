// Pull every translatable string out of a source file, as text — the reading half of the reviewer kit.
//
// WHY TEXT AND NOT IMPORTS (issue #38). The same constraint the rest of this folder works under:
// content files `require()` image assets and throw under `node --test`, and components import React
// Native. `coverage.ts` scans text for the same reason, and `places.test.ts` reads `provinces.ts` as
// text (SP-032). This module is the house pattern applied to a new job.
//
// WHAT IT UNDERSTANDS. Three shapes, all of which are the same thing underneath — an object literal
// with an `en:` key and optional sibling language keys:
//
//   const UI = { listen: { en: "Listen", tn: "Reetsa", … } }     components/*.tsx
//   { id: "journey", label: { en: "Journey", tn: "Leeto", … } }  components/shell/nav.ts
//   title: { en: "The Forest Home", tn: "Legae la Sekgweng" }    content/*.ts
//
// WHAT IT DOES NOT. Values must be double-quoted single-line literals. Verified true of every
// localized value in this repo on 2026-09-23 (no template literals, no escaped quotes, no multi-line
// strings); `extract-strings.test.ts` pins that assumption so the day someone writes one, a test says
// so rather than the sheet quietly dropping a string a reviewer then never sees.
//
// This module NEVER writes. A generator that can edit `src/` while reading it is one bad regex away
// from corrupting eleven languages at once.

export type ExtractedString = {
  /** Property name the object is assigned to: `body`, `label`, `title`. "" when anonymous. */
  key: string;
  /** The English source text — what the reviewer is translating FROM. Always present. */
  en: string;
  /** The current text in the requested language, or undefined when that language has none. */
  current?: string;
  /** 1-based line of the `en:` key, so a sheet row points at a real place in the file. */
  line: number;
};

/** All language keys we might find beside `en`. Kept as a parameter so this module imports nothing. */
export type LangKeys = readonly string[];

/**
 * Find the object literal containing the character at `from` and return its source span.
 * Returns null when the braces do not balance — a truncated file, not something to guess at.
 */
function enclosingObject(src: string, from: number): { start: number; end: number } | null {
  // Walk back to the `{` that opens this object. Localized values contain no nested objects, so the
  // first unmatched `{` behind the cursor is the one.
  let depth = 0;
  let start = -1;
  for (let i = from; i >= 0; i--) {
    const c = src[i];
    if (c === "}") depth++;
    else if (c === "{") {
      if (depth === 0) {
        start = i;
        break;
      }
      depth--;
    }
  }
  if (start < 0) return null;

  depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return { start, end: i };
    }
  }
  return null;
}

/** The property name an object literal is assigned to, reading backwards from its `{`. */
function keyBefore(src: string, braceAt: number): string {
  const before = src.slice(Math.max(0, braceAt - 80), braceAt);
  const m = before.match(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*$/);
  return m ? m[1] : "";
}

/** `code: "value"` pairs directly inside one object literal. */
function pairsIn(objectSrc: string, langs: LangKeys): Record<string, string> {
  const out: Record<string, string> = {};
  for (const code of langs) {
    // Anchored on a word boundary so `st:` does not also match inside `list:`.
    const m = objectSrc.match(new RegExp(`\\b${code}:\\s*"([^"]*)"`));
    if (m) out[code] = m[1];
  }
  return out;
}

/**
 * Every translatable string in one file, in source order.
 *
 * `lang` is the language the reviewer is working in; its text lands in `current`, and a string with
 * no text in that language still appears — those are precisely the gaps worth showing a reviewer.
 */
export function extractStrings(src: string, lang: string, langs: LangKeys): ExtractedString[] {
  const found: ExtractedString[] = [];
  const seen = new Set<number>();
  const re = /\ben:\s*"/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(src)) !== null) {
    const obj = enclosingObject(src, m.index);
    if (!obj || seen.has(obj.start)) continue;
    seen.add(obj.start);

    const body = src.slice(obj.start, obj.end + 1);
    const pairs = pairsIn(body, langs);
    if (pairs.en === undefined) continue; // `en:` inside a comment or a string, not a real value

    found.push({
      key: keyBefore(src, obj.start),
      en: pairs.en,
      current: pairs[lang],
      line: src.slice(0, m.index).split("\n").length,
    });
  }
  return found;
}

/**
 * True when a file carries any localized value at all. Cheaper than a full extract, and used to skip
 * the registries, types and helpers that have no strings in them.
 */
export const hasStrings = (src: string): boolean => /\ben:\s*"/.test(src);
