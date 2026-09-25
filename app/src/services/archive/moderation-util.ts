// Pure, dependency-free helpers for reporting a community recording (issue #45) — no Supabase import,
// so they unit-test under `node --test` without pulling in @supabase/supabase-js. The I/O lives in
// moderation.ts. Same split as cloud-util.ts / cloud.ts.

/** Mirrors `check (char_length(reason) between 1 and 2000)` in supabase/migrations/0002_moderation.sql.
 *  `moderation.test.ts` reads that constraint out of the SQL and fails if the two drift apart — two
 *  numbers describing one rule is how a form starts accepting text the database then rejects. */
export const REPORT_REASON_MAX = 2000;

export type ReasonProblem = "empty" | "too-long";

/** Is this something the database will accept? Returns null when the reason is fine. */
export function validateReportReason(reason: string): ReasonProblem | null {
  const trimmed = reason.trim();
  if (trimmed.length === 0) return "empty";
  if (trimmed.length > REPORT_REASON_MAX) return "too-long";
  return null;
}

export type ReportResult =
  | { ok: true }
  /** `message` is shown to the reporter; `retryable` distinguishes "your fault" from "ours". */
  | { ok: false; message: string; retryable: boolean };

/** The message for a rejected reason, so the UI and the tests agree on the wording. */
export function reasonProblemMessage(problem: ReasonProblem): string {
  return problem === "empty"
    ? "Please say what is wrong with it."
    : `Please keep it under ${REPORT_REASON_MAX} characters.`;
}
