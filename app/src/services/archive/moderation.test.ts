import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateReportReason, REPORT_REASON_MAX } from "./moderation-util.ts";

// Issue #45. The pure half of reporting, plus the cross-check that matters most: the client and the
// database must agree about what a valid report is. Only `validateReportReason` is imported — the
// async half needs a Supabase client and belongs to a browser.

const MIGRATION = new URL("../../../../supabase/migrations/0002_moderation.sql", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1",
);

test("the client's reason limit is the one the database actually enforces", () => {
  // Two numbers in two languages describing one rule is how a form starts accepting text the database
  // then rejects — the user gets a red error after typing 2 500 characters of explanation. So the
  // constraint is read out of the SQL rather than remembered.
  const sql = readFileSync(MIGRATION, "utf8");
  const m = sql.match(/char_length\(reason\)\s+between\s+(\d+)\s+and\s+(\d+)/i);
  assert.ok(m, "0002_moderation.sql must state the reason length constraint");
  assert.equal(Number(m![1]), 1, "the SQL requires at least one character");
  assert.equal(
    Number(m![2]),
    REPORT_REASON_MAX,
    `the SQL allows ${m![2]} characters and the client allows ${REPORT_REASON_MAX} — make them one number`,
  );
});

test("an empty or whitespace-only reason is refused before it reaches the network", () => {
  assert.equal(validateReportReason(""), "empty");
  assert.equal(validateReportReason("   \n\t "), "empty");
});

test("a reason over the limit is refused, and the limit is measured after trimming", () => {
  assert.equal(validateReportReason("x".repeat(REPORT_REASON_MAX + 1)), "too-long");
  assert.equal(validateReportReason("x".repeat(REPORT_REASON_MAX)), null, "exactly at the limit is fine");
  // Trailing whitespace must not push an otherwise-valid reason over the edge.
  assert.equal(validateReportReason("x".repeat(REPORT_REASON_MAX) + "   "), null);
});

test("an ordinary reason passes", () => {
  assert.equal(validateReportReason("This is not an oral history, it is someone shouting."), null);
});

test("the migration keeps the promises this feature rests on", () => {
  const sql = readFileSync(MIGRATION, "utf8");

  // 1. Pending by default — the decision taken on 2026-09-25. If this default ever becomes
  //    'approved', the whole feature is off and nothing else in the file would reveal it.
  assert.match(sql, /status text not null default 'pending'/i, "a new recording must start pending");

  // 2. The gate lives in RLS, not the client. This is what protects an old app build.
  assert.match(
    sql,
    /visibility = 'public' and status = 'approved'/i,
    "the read policy must require approval, not just visibility",
  );

  // 3. An owner must not be able to approve their own upload. Without the check clause on
  //    "update own", the gate has a door in it that every uploader holds the key to.
  assert.match(sql, /recordings update own/i);
  assert.match(sql, /with check \([\s\S]*status = \(select/i, "owners must not be able to change their own status");

  // 4. Reports hold no reporter identity (POPIA, docs/05).
  assert.ok(
    !/reporter_id|reported_by|user_id/i.test(sql),
    "the reports table must not record who complained",
  );

  // 5. Audio follows the row: a stranger can hear an object only while its recording is approved.
  assert.match(sql, /audio public readable/i);
});
