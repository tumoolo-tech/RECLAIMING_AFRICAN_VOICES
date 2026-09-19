// Ubuntu Heritage — place & operator link check (TOUR-11).
//
//   npm run check:place-links                       # inventory + check every outbound link
//   npm run check:place-links -- --inventory-only   # no network at all
//   npm run check:place-links -- --json             # machine-readable, stdout only
//   npm run check:place-links -- --probe <url>      # check ONE url that is not in the repo yet
//
// `--probe` is the other half of SP-021. No operator URL may enter experiences.ts until a human
// has opened it; this lets you put a candidate through the same checks first — including the T5
// identifier rule — without adding anything to the repo to find out.
//
// Two jobs. First it prints the tourism layer's HONEST NUMBERS — the ones
// docs/sim_plan.md §10 says v1 may claim — from data alone, before any network call, so a
// flaky host can never cost you the figures an hour before a meeting. Then it checks every
// outbound operator link and tells a human what needs doing.
//
// WHAT IT DELIBERATELY DOES NOT DO
//
//   · It never writes (SP-047). It does not even import node:fs — a script that must not
//     write files should not carry the module that can, so the guarantee is visible in the
//     import list rather than promised in a comment.
//
//   · It never stamps `lastChecked`, and the reason is not merely that SP-047 forbids it.
//     A 200 and a human verification are DIFFERENT FACTS. A server answering proves a server
//     answered; it does not prove the tour still runs, at that price, on those days. If a green
//     HTTP check refreshed that date, the field would quietly stop meaning "a person checked"
//     (SP-021) and start meaning "a machine pinged" — the guarantee would evaporate without
//     anyone deciding to drop it. So the script prints the line for you to paste, and you
//     decide.
//
//   · It is never a CI gate (SP-046). It hits third-party hosts; in CI it would make `main`
//     flaky and train everyone to ignore a red build.
//
// EXIT CODES — the distinction is the point of the run
//   0  nothing needs a human before a send-out
//   1  the repo is making a claim it cannot support: a `live` link is gone, its verification
//      has expired, or a URL carries a user identifier
//   2  the check could not complete — something was unreachable. "The wifi was bad" must not
//      read the same as "you are about to demo a dead booking link"
//
// GLYPHS encode exit-code contribution and nothing else: ✓ fine · · noted · ✗ this is the red.

import { places } from "../src/content/places.ts";
import { experiences, resolveBookableAt } from "../src/content/experiences.ts";
import { PLACE_LINKS, resolveCitiesWithPlaces } from "../src/content/topic-links.ts";

const TIMEOUT_MS = 10_000;
const POLITE_MS = 750;
const BACKOFF_MS = 2_000;
const WARN_DAYS = 60;
const STALE_DAYS = 90;
const UA = "UbuntuHeritageLinkCheck/1.0 (heritage link freshness check; not a crawler)";

const argv = process.argv.slice(2);
const args = new Set(argv);
const INVENTORY_ONLY = args.has("--inventory-only");
const JSON_OUT = args.has("--json");
const PROBE = argv.includes("--probe") ? argv[argv.indexOf("--probe") + 1] : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = (...a) => { if (!JSON_OUT) console.log(...a); };

// ── Pure helpers ─────────────────────────────────────────────────────────────────────────────

/** Strict ISO day → epoch ms. Regex first, then Date.UTC, so a typo'd "2026-19-18" is caught
 *  rather than silently rolling into 2027, and no timezone can shift the day count. */
function parseIsoDay(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s ?? ""));
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  if (back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return ms;
}

function freshness(iso, todayMs) {
  const t = parseIsoDay(iso);
  if (t === null) return { bucket: "invalid", days: null };
  const days = Math.floor((todayMs - t) / 86_400_000);
  if (days < 0) return { bucket: "future", days };
  if (days >= STALE_DAYS) return { bucket: "stale", days };
  if (days >= WARN_DAYS) return { bucket: "warn", days };
  return { bucket: "fresh", days };
}

/** Same URL apart from one trailing slash? Otherwise every /tours → /tours/ reads as a move. */
const sameUrl = (a, b) => a.replace(/\/$/, "") === b.replace(/\/$/, "");

function redirectNote(requested, final) {
  if (!final || sameUrl(requested, final)) return null;
  try {
    const from = new URL(requested);
    const to = new URL(final);
    if (to.protocol === "http:" && from.protocol === "https:") return "downgraded";
    // A CMS bouncing a removed tour page to the home page is the most valuable thing this
    // catches beyond a naive 200-check — a plain status check misses it entirely.
    if (from.pathname.replace(/\/$/, "") !== "" && to.pathname.replace(/\/$/, "") === "") return "to-home";
    return "moved";
  } catch {
    return "moved";
  }
}

/** The §10 numbers, from data only. Every count goes through the exported resolvers rather than
 *  a re-implemented `status === "live"` filter — SP-065 put that in one function precisely so the
 *  script's number and the UI's number cannot diverge, and the script's is the one a department
 *  would hear. */
function inventory() {
  const live = experiences.filter((e) => e.status === "live").length;
  const unverified = experiences.filter((e) => e.status === "unverified").length;
  const dead = experiences.filter((e) => e.status === "dead").length;
  const bookablePlaces = places.filter((p) => resolveBookableAt(p.id, experiences).length > 0).length;
  // A link is now `from`/`to` rather than `ref`/`placeId` (SP-099), and a place can sit on either
  // end — place→place links exist. Count both sides, or the tally silently under-reports.
  const linkedPlaceIds = new Set(
    PLACE_LINKS.flatMap((l) => [l.from, l.to])
      .filter((r) => r.kind === "place")
      .map((r) => r.id),
  );
  return {
    places: places.length,
    cities: resolveCitiesWithPlaces(places).length,
    placesLinked: linkedPlaceIds.size,
    links: PLACE_LINKS.length,
    direct: PLACE_LINKS.filter((l) => l.relation === "direct").length,
    thematic: PLACE_LINKS.filter((l) => l.relation === "thematic").length,
    operators: new Set(experiences.map((e) => e.operator)).size,
    experiences: experiences.length,
    live,
    unverified,
    dead,
    bookablePlaces,
    restricted: places.filter((p) => p.access !== undefined).length,
  };
}

// ── The network check ────────────────────────────────────────────────────────────────────────

/** HEAD first — it is the polite request and most hosts honour it. Cloudflare, a lot of
 *  WordPress and several municipal sites answer 403/405 to HEAD, so fall back to GET once and
 *  report which verb answered, so a host that always needs GET stays visible. */
async function checkUrl(url) {
  // T5 is checked before the request, not after: a URL carrying an identifier must not be
  // fetched at all. places.test.ts guards this on the way into main; this guards it on the way
  // out to a department, and two independent checks on the one POPIA rule is proportionate.
  if (url.includes("?") || url.includes("#")) {
    return { outcome: "unsafe-url", code: null, method: null, finalUrl: null, detail: "carries a query string or fragment" };
  }

  const attempt = async (method) => {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": UA, accept: "text/html,*/*" },
    });
    // Never read the body. A booking page is megabytes; reading it wastes the operator's
    // bandwidth, and leaving the socket streaming is the same hazard SP-048 documents.
    await res.body?.cancel().catch(() => {});
    return res;
  };

  let res = null;
  let method = "HEAD";
  let lastErr = null;

  try {
    res = await attempt("HEAD");
  } catch (e) {
    lastErr = e;
  }

  if (!res || [400, 403, 405, 501].includes(res.status)) {
    method = "GET";
    try {
      res = await attempt("GET");
    } catch (e) {
      lastErr = e;
      await sleep(BACKOFF_MS);
      try {
        res = await attempt("GET");
      } catch (e2) {
        lastErr = e2;
        res = null;
      }
    }
  }

  if (!res) {
    return { outcome: "error", code: null, method, finalUrl: null, detail: lastErr?.message ?? String(lastErr) };
  }

  const finalUrl = res.url || url;
  const note = redirectNote(url, finalUrl);

  if (res.ok) {
    if (note === "to-home") return { outcome: "to-home", code: res.status, method, finalUrl, detail: null };
    if (note === "downgraded") return { outcome: "downgraded", code: res.status, method, finalUrl, detail: null };
    return { outcome: note === "moved" ? "moved" : "ok", code: res.status, method, finalUrl, detail: null };
  }
  if (res.status === 404 || res.status === 410) {
    return { outcome: "gone", code: res.status, method, finalUrl, detail: null };
  }
  // A bot filter refusing an honest user-agent is NOT evidence an operator folded. Calling it
  // dead would have this script manufacture a death and hand a human a wrong edit.
  if ([401, 403, 405, 429].includes(res.status)) {
    return { outcome: "blocked", code: res.status, method, finalUrl, detail: null };
  }
  return { outcome: "error", code: res.status, method, finalUrl, detail: null };
}

// ── Reporters ────────────────────────────────────────────────────────────────────────────────

function reportInventory(inv) {
  out("\n→ inventory — from src/content, no network");
  out(`  ✓ ${inv.places} sourced places across ${inv.cities} cities`);
  out(`  ${inv.placesLinked ? "✓" : "·"} ${inv.placesLinked} place(s) linked from a story · ${inv.links} link(s) (${inv.direct} direct, ${inv.thematic} thematic)`);
  out(`  ${inv.operators ? "✓" : "·"} ${inv.operators} operator(s) · ${inv.experiences} experience(s) · ${inv.bookablePlaces} place(s) bookable`);
  if (inv.restricted) out(`  · ${inv.restricted} place(s) access-restricted — no booking path may reach them (SP-072, SP-074)`);
  out("\n  Claimable (docs/sim_plan.md §10):");
  out(`    places ${String(inv.places).padStart(18 - 6)}`);
  out(`    cities ${String(inv.cities).padStart(18 - 6)}`);
  out(`    places linked ${String(inv.placesLinked).padStart(18 - 13)}`);
  out(`    operators ${String(inv.operators).padStart(18 - 9)}`);
  out(`    experiences ${String(inv.experiences).padStart(18 - 11)}   (live ${inv.live} · unverified ${inv.unverified} · dead ${inv.dead})`);
  out("    NOT claimable: visits, bookings, conversions — T5 forecloses attribution.");
}

function reportLinks(results) {
  const w = Math.max(8, ...results.map((r) => r.e.id.length));
  out(`\n→ checking ${results.length} outbound link(s) · HEAD, GET on fallback · ${TIMEOUT_MS / 1000}s · one at a time`);
  for (const r of results) {
    const glyph = r.red ? "✗" : r.amber ? "·" : "✓";
    const age = r.fresh.days === null ? "date invalid" : `verified ${r.e.lastChecked} (${r.fresh.days}d)`;
    out(`  ${glyph} ${r.e.id.padEnd(w)}  ${r.e.status.padEnd(10)} ${String(r.code ?? "—").padEnd(4)} ${(r.method ?? "—").padEnd(4)} ${age}`);
    out(`      ${r.e.operator} · ${r.e.url}`);
    if (r.method === "GET") out("      HEAD refused; retried with GET.");
    if (r.outcome === "to-home") out(`      Redirects to the site home page (${r.finalUrl}) — the page may be gone.`);
    if (r.outcome === "moved") out(`      Redirects to ${r.finalUrl}`);
    if (r.outcome === "downgraded") out("      Redirect downgrades to http: — not safe to link.");
    if (r.outcome === "blocked") out("      Refused a script (bot filter). Could not be judged from here — open it in a browser.");
    if (r.outcome === "error" && r.detail) out(`      ${r.detail}`);
  }
}

function reportActions(results, today) {
  const notable = results.filter((r) => r.red || r.amber);
  if (notable.length === 0) return;
  out("\n→ what needs a human — this script changes nothing (SP-047)");
  for (const r of notable) {
    const g = r.red ? "✗" : "·";
    if (r.outcome === "gone") {
      out(`  ${g} ${r.e.id} is live in the repo and returns ${r.code}. A reader tapping it lands on a dead page.`);
      out(`      app/src/content/experiences.ts → ${r.e.id}:  status: "live"  →  status: "dead"`);
      out("      Keep the record. A dead link is hidden, not deleted (SP-049).");
    } else if (r.outcome === "unsafe-url") {
      out(`  ${g} ${r.e.id} carries a user identifier in its URL. Strip it — T5 allows none, ever.`);
    } else if (r.outcome === "error") {
      out(`  ${g} ${r.e.id} could not be reached. Not proof it is gone — re-run before acting.`);
    } else if (r.outcome === "blocked") {
      out(`  ${g} ${r.e.id} refused a script. Open it in a browser and judge by eye.`);
    } else if (r.outcome === "to-home") {
      out(`  ${g} ${r.e.id} redirects to the home page. Check the specific offer still exists.`);
    }
    if (r.fresh.bucket === "stale" || r.fresh.bucket === "invalid" || r.fresh.bucket === "future") {
      out(`  ${r.e.status === "live" ? "✗" : "·"} ${r.e.id} verification is ${r.fresh.bucket === "stale" ? `${r.fresh.days} days old, past the ${STALE_DAYS}-day limit` : `not a usable date ("${r.e.lastChecked}")`}.`);
    } else if (r.fresh.bucket === "warn") {
      out(`  · ${r.e.id} was verified ${r.fresh.days} days ago. Past ${STALE_DAYS} it turns this run red.`);
    }
    if (r.e.status === "unverified") {
      out(`  · ${r.e.id} has never been opened by a human, so it renders nothing (SP-019, SP-021).`);
      out(`      To publish: open the URL, confirm the offer is real, then set status: "live" and lastChecked: "${today}".`);
    }
  }
  out("\n  A 200 means a server answered. It does not mean the operator still trades —");
  out("  which is why this script will not stamp that date for you.");
}

// ── main ─────────────────────────────────────────────────────────────────────────────────────

async function main() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const todayMs = parseIsoDay(today);

  // --probe: judge one candidate URL before it is allowed into the repo (SP-021).
  if (PROBE) {
    if (!/^https?:\/\//.test(PROBE)) {
      console.error("\n❌ --probe needs a full URL.\n   Fix: npm run check:place-links -- --probe https://example.org/tours\n");
      return 1;
    }
    out("\n→ probing a candidate URL — nothing is written, nothing is added to the repo");
    const c = await checkUrl(PROBE);
    const okay = c.outcome === "ok" || c.outcome === "moved";
    const glyph = okay ? "✓" : ["gone", "unsafe-url"].includes(c.outcome) ? "✗" : "·";
    out(`  ${glyph} ${c.outcome.padEnd(12)} ${String(c.code ?? "—").padEnd(4)} ${(c.method ?? "—").padEnd(4)} ${PROBE}`);
    if (c.finalUrl && !sameUrl(PROBE, c.finalUrl)) out(`      redirects to ${c.finalUrl}`);
    if (c.detail) out(`      ${c.detail}`);
    if (c.outcome === "unsafe-url") out("      T5: a referral URL may never carry a query string or fragment. Strip it.");
    if (c.outcome === "to-home") out("      Lands on the site home page — the specific offer may be gone.");
    if (c.outcome === "blocked") out("      Refused a script. Judge it by eye in a browser.");
    out(okay
      ? `\n✅ Reachable. That is necessary, not sufficient — open it and confirm the offer is real,\n   then add it with lastChecked: "${today}".\n`
      : "\n❌ Do not add this URL yet.\n");
    return okay ? 0 : 1;
  }

  const inv = inventory();

  out(`\n→ Ubuntu Heritage · place & operator link check · ${today} · reports only, writes nothing (SP-047)`);
  reportInventory(inv);

  if (INVENTORY_ONLY || experiences.length === 0) {
    if (!INVENTORY_ONLY) {
      out("\n→ outbound links");
      out("  · nothing to check — experiences.ts is deliberately empty (SP-018, SP-021).");
      out("    No operator URL has been opened and verified by a human yet, so there is no");
      out("    link to go stale. This is the expected result today, not a failure.");
    }
    if (JSON_OUT) console.log(JSON.stringify({ checkedAt: today, inventory: inv, links: [], exitCode: 0 }, null, 2));
    else out("\n✅ 0 links checked · 0 gone · nothing needs a human.\n");
    return 0;
  }

  // Two experiences from one operator can share a page — check each distinct URL once.
  const memo = new Map();
  const results = [];
  for (const e of experiences) {
    if (!memo.has(e.url)) {
      memo.set(e.url, await checkUrl(e.url));
      await sleep(POLITE_MS);
    }
    const c = memo.get(e.url);
    const fresh = freshness(e.lastChecked, todayMs);
    const expired = e.status === "live" && ["stale", "invalid", "future"].includes(fresh.bucket);
    const red = c.outcome === "unsafe-url" || (e.status === "live" && c.outcome === "gone") || expired;
    const amber = !red && ["blocked", "to-home", "downgraded", "error"].includes(c.outcome)
      || (!red && (fresh.bucket === "warn" || e.status === "unverified"));
    results.push({ e, ...c, fresh, red, amber });
  }

  reportLinks(results);
  reportActions(results, today);

  const gone = results.filter((r) => r.outcome === "gone").length;
  const unreachable = results.filter((r) => r.outcome === "error").length;
  const reds = results.filter((r) => r.red).length;
  const code = reds > 0 ? 1 : unreachable > 0 ? 2 : 0;

  if (JSON_OUT) {
    console.log(JSON.stringify({
      checkedAt: today,
      inventory: inv,
      links: results.map((r) => ({ id: r.e.id, url: r.e.url, status: r.e.status, outcome: r.outcome, httpStatus: r.code, method: r.method, lastChecked: r.e.lastChecked, ageDays: r.fresh.days })),
      exitCode: code,
    }, null, 2));
    return code;
  }

  const tally = `${results.length} link(s) checked · ${gone} gone · ${unreachable} unreachable`;
  if (code === 1) {
    out(`\n❌ ${tally} · ${reds} need(s) a hand edit.`);
    out("   Fix the ✗ items in app/src/content/experiences.ts, then re-run:");
    out("   npm run check:place-links\n");
  } else if (code === 2) {
    out(`\n❌ ${tally}. Could not complete — this is not proof anything is gone. Re-run.\n`);
  } else {
    out(`\n✅ ${tally} · nothing needs a human.\n`);
  }
  return code;
}

process.exitCode = await main();
