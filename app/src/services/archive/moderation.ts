// Reporting a community recording (issue #45) — the I/O half. Pure helpers live in moderation-util.ts.
//
// The feed is the one place in this app where a stranger's recording reaches other readers, and the
// app is used by children (Kids mode ships in the same build). Until now there was no way to say
// "this should not be here".
//
// TWO THINGS THIS FILE DELIBERATELY DOES NOT DO:
//
//  · It does not gate the feed. That is enforced in RLS by `0002_moderation.sql` — a recording is
//    readable only while `status = 'approved'`. A filter here would be a suggestion; a policy is a
//    rule, and it also covers an old app build, a hand-written client, or a curl request carrying the
//    publishable key. It is also why this ships safely BEFORE the migration is run: nothing here
//    depends on the new column existing.
//  · It stores nothing about the reporter. A report is about the recording. Who complained would be
//    personal information this project has no use for and would then have to protect (POPIA,
//    docs/05) — and on a surface reachable by children, the less identity collected the better.

import { getSupabase, ensureAnonSession } from "./supabase";
import { validateReportReason, reasonProblemMessage, type ReportResult } from "./moderation-util";

export { REPORT_REASON_MAX, validateReportReason, reasonProblemMessage } from "./moderation-util";
export type { ReasonProblem, ReportResult } from "./moderation-util";

/**
 * Report a recording in the community feed.
 *
 * Needs a session because the insert policy requires `auth.uid()` — anonymous is fine, and the feed
 * is readable without one, so a reporter may be signing in for the first time here. No captcha is
 * passed: on a captcha-protected project a first anonymous sign-in will fail, and that is reported as
 * retryable rather than swallowed, because a reporter who is told nothing assumes they were heard.
 */
export async function reportRecording(opts: { cloudId: string; reason: string }): Promise<ReportResult> {
  const problem = validateReportReason(opts.reason);
  if (problem) return { ok: false, message: reasonProblemMessage(problem), retryable: true };

  const sb = getSupabase();
  if (!sb) return { ok: false, message: "The community archive is not configured here.", retryable: false };

  const uid = await ensureAnonSession();
  if (!uid) return { ok: false, message: "Could not reach the archive. Please try again.", retryable: true };

  const { error } = await sb.from("reports").insert({ recording_id: opts.cloudId, reason: opts.reason.trim() });

  if (error) {
    // The expected failure before `0002_moderation.sql` has been run: the table does not exist. Say
    // something true rather than thanking the reader for a report that went nowhere — being thanked
    // for nothing is worse than being told the feature is not on yet.
    const missing = /relation .*reports.* does not exist|could not find the table/i.test(error.message);
    return missing
      ? { ok: false, message: "Reporting is not switched on yet. Please tell the maintainers directly.", retryable: false }
      : { ok: false, message: "Could not send the report. Please try again.", retryable: true };
  }
  return { ok: true };
}
