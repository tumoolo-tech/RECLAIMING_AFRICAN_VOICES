// Content-as-data — the humanities layer. New stories = new data files, not new code.
// See docs/08-content-pipeline.md. Every fact must trace to `sourceNote` (integrity rule, AGENTS.md).

import type { LangCode } from "../i18n/languages";
import type { RightsStatus } from "../services/ingest/rights";

/**
 * Who holds the rights to the work a module is built on, and on what basis the app may say what it
 * says about it. REQUIRED on every Module (issue #34): for a year the project described its canon as
 * "public domain" while one of the four — Mutwa, d. 2020 — is in copyright until 2070. The claim was
 * never checked because nothing forced it to be written down. This field forces it.
 *
 * `status` is the SOURCE WORK's status, not the app's text: the app's scenes are its own adaptation
 * in its own words, and that is true whatever the source's status is. "original" is for modules that
 * are not built on one work at all (the Atlas entries, authored from the cited references).
 */
export type ModuleRights = {
  status: RightsStatus | "original";
  /** Year the author died — drives the SA life+50 test in services/ingest/rights.ts. */
  authorDied?: number;
  /** The reason, in one or two sentences, that a reader can check. Rendered on screen. */
  basis: string;
};

// The app speaks 11 of the 12 official SA languages (see src/i18n/languages.ts; Sign Language is the twelfth). English is the base every
// text carries; other languages are optional and fall back to English (clearly marked) until a
// human-reviewed translation exists — machine text is never passed off as authoritative (integrity rule).
export type Lang = LangCode;
export type Mode = "adult" | "child";

export type LocalizedText = { en: string } & Partial<Record<Lang, string>>;

export type Scene = {
  id: string;
  title: LocalizedText;
  /** Adult reading level — faithful adaptation of the source. */
  text: LocalizedText;
  /** Child reading level — tone simplified only; facts unchanged. */
  childText: LocalizedText;
  /** Base prompt for Pollinations (Gemini may enrich it). */
  imagePrompt: string;
  /** Stable seed → consistent, cacheable image. */
  seed: number;
  /** The chapter/passage this scene is grounded in. No source → no scene. */
  sourceNote: string;
};

export type Module = {
  id: string;
  /** "literature" = the four literary pillars; "atlas" = Cultural Atlas heritage entries. */
  kind?: "literature" | "atlas";
  title: string;
  /** Literary author, or (for atlas entries) the category label. */
  author: string;
  /** Publication year for literary works; omitted for atlas topics. */
  year?: number;
  source: string;
  blurb: LocalizedText;
  audience: string;
  scenes: Scene[];
  references: string[];
  /** Rights of the source work + the basis for the app's use. Required — see `ModuleRights`. */
  rights: ModuleRights;
  /** Community Archive tie-in — invites the reader to record their family's version. */
  archivePrompt?: LocalizedText;
};
