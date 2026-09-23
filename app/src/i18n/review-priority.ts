// Which strings a native-speaker reviewer should read FIRST — ordered by what a wrong word costs.
//
// WHY THIS IS DATA (issue #38). Ten of the eleven languages have never been read by a speaker. A
// reviewer opening the app faces ~330 chrome strings plus 248 content strings in their language, and
// nobody accepts that ask. The kit's job is to make the first ask small enough to say yes to — and to
// put the strings where a mistake does real harm at the top of it, rather than wherever the file
// walker happened to reach them.
//
// The ordering is a judgement about harm, so it is written down here with its reasoning and pinned by
// `review-priority.test.ts`, instead of living as a sort function inside the generator. Moving the
// consent sheet out of tier 1 should have to be argued for in a diff.
//
// Pure data + pure functions: no imports, no I/O, unit-tested under `node --test`.

export type ReviewTier = 1 | 2 | 3 | 4;

export type TierSpec = {
  tier: ReviewTier;
  title: string;
  /** Why this tier sits where it does. Printed at the top of each section of a review sheet. */
  why: string;
  /**
   * Source files whose strings belong to this tier, by path relative to `app/src/`.
   * A file named in no tier falls to the default for its kind (chrome → 3, content → 4).
   */
  files: string[];
};

/**
 * Tier 1 — a wrong word is a RIGHTS problem, not a typo.
 *
 * The consent sheet is the only place the app asks permission to record a person's voice, which is
 * personal information under POPIA; a mistranslation there means consent was not informed. The data
 * gate is the only place the app talks to someone about money — it quotes the cost of a film in
 * megabytes on a prepaid line. The passport carries the privacy promise and the two-step erasure.
 *
 * Tiers name whole FILES, not line ranges: the passport's privacy promise sits among its level and
 * streak labels, and a tier pointing at line numbers would be wrong the first time someone edited the
 * file. So a few low-harm strings ride along here — the cheaper of the two mistakes. ~34 strings in
 * total: one sitting for a reviewer, and the sitting worth having.
 */
const TIER_1: TierSpec = {
  tier: 1,
  title: "Consent, money and erasure",
  why:
    "A wrong word here is not a typo — it is consent that was not informed, a data cost someone did " +
    "not agree to, or a promise about erasure the app then keeps in a different language. Read these " +
    "first even if you read nothing else.",
  files: ["components/ConsentSheet.tsx", "components/DataGate.tsx", "components/PassportScreen.tsx"],
};

/**
 * Tier 2 — the reader cannot find their way, or does something they cannot undo.
 *
 * Navigation labels are the most-seen strings in the app and the ones a reader uses to leave a screen.
 * Kids mode is read by children, who cannot route around a confusing word. The archive's record and
 * delete controls sit beside real audio.
 */
const TIER_2: TierSpec = {
  tier: 2,
  title: "Getting around, and actions that cannot be undone",
  why:
    "Navigation is what a reader uses to leave a screen they did not want; Kids mode is read by " +
    "children, who cannot work around an odd word; the archive controls sit next to a real recording " +
    "and a real delete.",
  files: ["components/shell/nav.ts", "components/KidsScreen.tsx", "components/KidsStageScreen.tsx", "components/ArchiveScreen.tsx"],
};

/** Tier 3 — the rest of the interface. Everything not named above that carries UI strings. */
const TIER_3: TierSpec = {
  tier: 3,
  title: "The rest of the interface",
  why: "Buttons, headings and labels everywhere else. Wrong here is visible and worth fixing, but it costs a reader clarity rather than rights.",
  files: [],
};

/**
 * Tier 4 — the history itself.
 *
 * Last not because it matters least — it is the 30% of the rubric — but because it is the largest by
 * far and because a reviewer who has corrected the chrome has already shown us how they read. It is
 * also the tier where "I would rather rewrite this than correct it" is the right answer, and the
 * reviewer guide says so.
 */
const TIER_4: TierSpec = {
  tier: 4,
  title: "The history itself",
  why:
    "Scene text, blurbs and quiz questions. The largest tier and the slowest: this is where a machine " +
    "draft is most likely to be fluent and wrong. Rewriting beats correcting here — say so on the sheet.",
  files: [],
};

export const TIERS: TierSpec[] = [TIER_1, TIER_2, TIER_3, TIER_4];

/**
 * Strings we already KNOW are wrong in a particular language — shown at the top of that language's
 * review sheet, above the tiers.
 *
 * Tiers rank by what a wrong word would cost. This list is different: it is what we have already
 * found, and it jumps the queue because a reviewer should not spend an hour on the consent sheet
 * while a scene sits in the app telling their readers something that did not happen.
 *
 * Nothing here can be detected automatically. Comparing meaning across two languages is exactly what
 * no test in this repo can do (see chrome-gaps.test.ts for what the machinery CAN check). Entries are
 * added by hand when a human finds one, and removed when a reviewer fixes it.
 */
export type FlaggedString = {
  /** Language code the problem affects. */
  lang: string;
  /** Path under `app/src/`, for the reviewer and for the test that keeps this list honest. */
  file: string;
  /** A distinctive phrase of the CURRENT English, so the row can be found in the sheet. */
  englishSnippet: string;
  why: string;
};

export const FLAGGED_FOR_REVIEW: FlaggedString[] = [
  {
    lang: "tn",
    file: "content/mhudi.ts",
    englishSnippet: "nearly walked into a black-maned lion",
    why:
      "The Setswana for this scene describes a DIFFERENT EVENT from the English. It says Mhudi saved " +
      "Ra-Thaga from the lion; chapter 2 of the 1930 edition has her flee it, run into him, refuse to " +
      "be left behind, guide him back to it and charge it beside him. The English was corrected against " +
      "the book on 2026-09-23; the Setswana is the old translation and was kept rather than deleted. " +
      "Until someone who speaks Setswana rewrites it, a Setswana reader is reading a version of this " +
      "scene that is not in the novel. The scene title 'Mhudi le Tau' needs the same look — the English " +
      "title is now 'The Lion, and the Meeting'.",
  },
];

/** The flagged strings for one language, or an empty list. */
export const flaggedFor = (lang: string): FlaggedString[] => FLAGGED_FOR_REVIEW.filter((f) => f.lang === lang);

/** Where a file's strings belong. `kind` decides the fallback for anything not named in a tier. */
export function tierFor(relPath: string, kind: "chrome" | "content"): ReviewTier {
  const named = TIERS.find((t) => t.files.includes(relPath));
  if (named) return named.tier;
  return kind === "content" ? 4 : 3;
}

/** The spec for a tier — for the heading and the "why" line on a sheet. */
export function tierSpec(tier: ReviewTier): TierSpec {
  const spec = TIERS.find((t) => t.tier === tier);
  if (!spec) throw new Error(`no such review tier: ${tier}`);
  return spec;
}
