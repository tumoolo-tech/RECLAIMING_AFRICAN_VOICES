#!/usr/bin/env node
// Run a script (or the test runner) that loads TypeScript, on any Node this project supports.
//
// WHY THIS EXISTS (issue #40). Everything in `src/` is TypeScript and nothing here is compiled: the
// tests are `.ts` files run by `node --test`, and ten scripts in this folder import from `../src`.
// Whether that works depends on the Node version:
//
//   22.6 – 22.17   type stripping exists but is OFF   → needs --experimental-strip-types
//   22.18 – 25     ON by default; the flag is a no-op  → flag unnecessary
//   26+            ON by default; the flag is undocumented, and its sibling
//                  --experimental-transform-types was REMOVED in v26 → passing it may be fatal
//
// So neither hard-coding the flag nor leaving it out is safe for everyone. On 2026-09-19 a
// contributor on Node 22.16 — a current LTS — saw `topics.generated.test.ts` fail with "the
// generated file is stale" when it was not stale at all: the test shells out to `npm run gen:topics`,
// that script crashed on the unstripped import, and a crash reads the same as a stale file. CI pins
// Node 24, so it was green there. A false failure that only happens on someone else's machine is
// the worst kind.
//
// The fix is to ask Node what it can do instead of guessing from a version number.
// `process.features.typescript` (v22.10+) is `false` when stripping is off, `"strip"`/`"transform"`
// when it is on, and `undefined` before it existed. We pass the flag ONLY when it is genuinely
// needed, so a Node that removed the flag never sees it.
//
// Usage — from package.json, never by hand:
//   node scripts/run-ts.mjs scripts/gen-topics.mjs
//   node scripts/run-ts.mjs --test "src/**/*.test.ts"
// Arguments are forwarded to node untouched, so quoting and globs behave exactly as before.

import { spawnSync } from "node:child_process";

const target = process.argv.slice(2);
if (target.length === 0) {
  console.error("run-ts: nothing to run.\n  usage: node scripts/run-ts.mjs <script.mjs | --test \"glob\"> [args...]");
  process.exit(2);
}

// `undefined` = too old to report the feature; `false` = present but switched off. Both need the flag.
const stripsTypesNatively = process.features.typescript !== undefined && process.features.typescript !== false;

// Every invocation silences the package.json type warning — `app/` has no "type" field on purpose and
// the warning says nothing a reader here can act on.
const flags = ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON"];

if (!stripsTypesNatively) {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 6)) {
    console.error(
      `run-ts: Node ${process.versions.node} cannot run this project's TypeScript.\n` +
        "  Type stripping arrived in Node 22.6 and is on by default from 22.18.\n" +
        "  Install Node 22.18 or newer (24 LTS is what CI runs) and try again."
    );
    process.exit(2);
  }
  // 22.6–22.17: stripping is available but off. Turn it on, and silence the experimental notice —
  // it is expected here, and a warning nobody can act on trains people to ignore warnings.
  flags.push("--experimental-strip-types", "--disable-warning=ExperimentalWarning");
}

const run = spawnSync(process.execPath, [...flags, ...target], { stdio: "inherit" });

// A child killed by a signal has no exit code; report it the way a shell would rather than as success.
if (run.signal) {
  console.error(`run-ts: ${target[0]} was terminated by ${run.signal}`);
  process.exit(1);
}
process.exit(run.status ?? 1);
