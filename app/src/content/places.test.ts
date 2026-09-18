import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { places } from "./places.ts";
import {
  experiences,
  resolveExperiencesAt,
  resolveBookableAt,
  citiesForExperience,
  type Experience,
} from "./experiences.ts";
import type { Place } from "./places.ts";

// Two jobs here.
//
// 1. The behaviour of the experience resolvers, on fixtures (SP-064).
// 2. The integrity of the real data — every place sourced, every coordinate present, every
//    landmarkLabel still matching `provinces.ts`, every URL clean of identifiers. Those currently
//    pass vacuously because both registries are empty; they are written first so that the data,
//    when it lands in TOUR-05b, either satisfies them or turns this suite red.
//
// `provinces.ts` is read as TEXT, not imported (SP-032): it `require()`s .webp hero assets and
// throws `ReferenceError: require is not defined in ES module scope` under `node --test`. This is
// the same approach `i18n/ui-coverage.test.ts` already takes to components.

const PROVINCES = readFileSync(new URL("./provinces.ts", import.meta.url), "utf8");

/** City ids sit at eight spaces of indent; province ids at four. */
const CITY_IDS = new Set([...PROVINCES.matchAll(/^ {8}id: "([a-z0-9-]+)"/gm)].map((m) => m[1]));

/** Landmark strings, keyed by the city whose object they appear in. Walks both patterns in document
 *  order and attaches each landmarks block to the most recent city id — landmarks always follow
 *  their city's id inside the same object. */
function landmarksByCity(src: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  let city = "";
  const pattern = /^ {8}id: "([a-z0-9-]+)"|landmarks: \[([^\]]*)\]/gm;
  for (const m of src.matchAll(pattern)) {
    if (m[1]) city = m[1];
    else if (m[2] && city) {
      out.set(city, [...m[2].matchAll(/"([^"]+)"/g)].map((s) => s[1]));
    }
  }
  return out;
}

const LANDMARKS = landmarksByCity(PROVINCES);

const experience = (id: string, placeIds: string[], status: Experience["status"] = "live"): Experience => ({
  id,
  name: id,
  operator: "An operator",
  url: "https://example.org/visit",
  kind: "guided-tour",
  placeIds,
  lastChecked: "2026-09-18",
  status,
});

// ── The shape Tumo's question forced: one booking, many places ───────────────────────────────────

test("a four-stop tour is returned for every one of its stops", () => {
  // The pitch's own example: "book a bike tour through Soweto" visits four places. Under the old
  // shape — a booking hanging off one place — it had to pick one arbitrary stop or be copied four
  // times. This is the test that the new shape actually solves that (SP-058).
  const stops = ["vilakazi-street", "hector-pieterson-memorial", "mandela-house", "regina-mundi-church"];
  const tour = experience("soweto-bike-tour", stops);
  for (const stop of stops) {
    assert.deepEqual(
      resolveExperiencesAt(stop, [tour]).map((e) => e.id),
      ["soweto-bike-tour"],
      `the tour should surface at ${stop}`,
    );
  }
});

test("a museum's own ticketing is just an experience with one stop", () => {
  const entry = experience("hector-pieterson-entry", ["hector-pieterson-memorial"]);
  entry.kind = "ticketed-entry";
  assert.equal(resolveExperiencesAt("hector-pieterson-memorial", [entry]).length, 1);
  assert.equal(resolveExperiencesAt("mandela-house", [entry]).length, 0);
});

test("bookableAtPlace hides anything not live — the filter is in the resolver, not the UI", () => {
  // SP-065: a Stage B component must not be able to render a dead or unverified booking even by
  // mistake. The default state is silence, not optimism.
  const all = [
    experience("live-tour", ["p"], "live"),
    experience("never-checked", ["p"], "unverified"),
    experience("gone", ["p"], "dead"),
  ];
  assert.deepEqual(resolveExperiencesAt("p", all).length, 3, "the freshness script sees everything");
  assert.deepEqual(resolveBookableAt("p", all).map((e) => e.id), ["live-tour"], "a reader sees only live");
});

test("an experience's cities are derived from its places, never stored", () => {
  const all: Place[] = [
    { id: "a", name: "A", cityId: "soweto", landmarkLabel: "A", kind: "site", what: "w", coords: { lat: 0, lng: 0 }, sources: "s" },
    { id: "b", name: "B", cityId: "johannesburg", landmarkLabel: "B", kind: "site", what: "w", coords: { lat: 0, lng: 0 }, sources: "s" },
  ];
  const tour = experience("two-city-tour", ["a", "b"]);
  assert.deepEqual(citiesForExperience(tour, all).sort(), ["johannesburg", "soweto"]);
});

// ── Integrity: over the real registries ──────────────────────────────────────────────────────────

test("every place is grounded: a source and a real reason to exist", () => {
  for (const p of places) {
    assert.ok(p.sources.trim().length > 10, `${p.id} needs a real source, not a stub`);
    assert.ok(p.what.trim().length > 20, `${p.id} needs a grounded line on why it matters`);
  }
});

test("a coordinate is optional — but a given one must be inside South Africa", () => {
  // SP-073 made coords optional because a third of these places have no single point by nature.
  // That is NOT a licence for a sloppy one: where a coordinate is given it is a factual claim under
  // SP-052, and a wrong one sends a real person to the wrong place.
  for (const p of places) {
    if (!p.coords) continue;
    assert.ok(Number.isFinite(p.coords.lat) && Number.isFinite(p.coords.lng), `${p.id}: malformed coordinate`);
    assert.ok(
      p.coords.lat >= -35 && p.coords.lat <= -22 && p.coords.lng >= 16 && p.coords.lng <= 33,
      `${p.id} has a coordinate outside South Africa`,
    );
  }
});

test("no experience may lead to an access-restricted place", () => {
  // SP-072 / SP-074. Two kinds, one rule. Thathe Vondo forest is a holy forest where Venda kings are
  // buried and ordinary Venda people may not walk — a taboo that extends to visitors; Lake Fundudzi
  // is the same. Bumbane Great Place is the home of the reigning aBaThembu king. A booking path to
  // either kind would be a harm that ACTS on the world rather than merely asserting something false.
  //
  // Checked on `access` being set at all, not on a specific value, so a new category added later is
  // protected by default rather than by remembering to update this test. Enforced in the DATA, so no
  // component can route around it.
  const restricted = new Set(places.filter((p) => p.access !== undefined).map((p) => p.id));
  for (const e of experiences) {
    for (const id of e.placeIds) {
      assert.ok(
        !restricted.has(id),
        `experience "${e.id}" lists "${id}", which is access-restricted by its custodians — no booking path may reach it`,
      );
    }
  }
});

test("place ids are unique", () => {
  const seen = new Set<string>();
  for (const p of places) {
    assert.ok(!seen.has(p.id), `duplicate place id "${p.id}"`);
    seen.add(p.id);
  }
});

test("every place sits in a city that exists in provinces.ts", () => {
  assert.ok(CITY_IDS.size >= 19, `expected to parse the real city list, got ${CITY_IDS.size}`);
  for (const p of places) {
    assert.ok(CITY_IDS.has(p.cityId), `${p.id} has cityId "${p.cityId}", which is not a city`);
    for (const c of p.alsoListedIn ?? []) {
      assert.ok(CITY_IDS.has(c), `${p.id} is alsoListedIn "${c}", which is not a city`);
    }
  }
});

test("every landmarkLabel still matches the string provinces.ts actually uses", () => {
  // SP-016: no fuzzy name matching anywhere. The chip reads "Hector Pieterson Memorial" while the
  // museum's own name carries "& Museum", so the place pins the exact string it answers to — and
  // this fails the moment someone edits that string without updating the place. SP-051: it must
  // match in the owning city AND in every city that also lists it.
  for (const p of places) {
    for (const city of [p.cityId, ...(p.alsoListedIn ?? [])]) {
      const found = LANDMARKS.get(city) ?? [];
      assert.ok(
        found.includes(p.landmarkLabel),
        `${p.id}: "${p.landmarkLabel}" is not in ${city}'s landmarks — the chip would never resolve`,
      );
    }
  }
});

test("every experience visits places that exist, and says who runs it", () => {
  for (const e of experiences) {
    assert.ok(e.placeIds.length > 0, `${e.id} must visit at least one place`);
    for (const id of e.placeIds) {
      assert.ok(places.some((p) => p.id === id), `${e.id} visits "${id}", which is not a place`);
    }
    assert.ok(e.operator.trim().length > 0, `${e.id} needs a named operator`);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(e.lastChecked), `${e.id} needs an ISO lastChecked date`);
  }
});

test("no referral URL carries a user identifier — ever", () => {
  // T5 / SP-034. Attributing a click to a person is exactly the personal-data collection POPIA
  // compliance exists to prevent, and it would apply to minors. This forecloses conversion tracking
  // deliberately: v1 can report how many operators are linked, never how many people went.
  for (const e of experiences) {
    assert.ok(e.url.startsWith("https://"), `${e.id}: a referral link must be https`);
    assert.ok(!e.url.includes("?"), `${e.id}: referral URL carries a query string — no identifiers (T5)`);
    assert.ok(!e.url.includes("#"), `${e.id}: referral URL carries a fragment — no identifiers (T5)`);
  }
});

test("every place photograph is a real, licensed, resolvable image — never an AI one", () => {
  // A place with no photograph is normal and fine. A place that NAMES one must actually have it,
  // and must carry the credit and licence, because CC BY-SA attribution is an obligation rather
  // than a courtesy — and because "licensed real photograph" is the whole reason places are
  // allowed a picture at all when literary scenes get AI illustration.
  //
  // place-images.ts is read as TEXT: it `require()`s image binaries, so importing it here would
  // fail under `node --test` for exactly the reason provinces.ts does (SP-032).
  const registry = readFileSync(new URL("./place-images.ts", import.meta.url), "utf8");
  for (const p of places) {
    if (!p.image) continue;
    assert.ok(p.image.credit.trim().length > 0, `${p.id}: a licensed photograph must credit its photographer`);
    assert.ok(p.image.licence.trim().length > 0, `${p.id}: a photograph must record its licence`);
    assert.ok(/^https?:\/\//.test(p.image.source), `${p.id}: the licence claim must be checkable — give the source URL`);
    assert.ok(
      registry.includes(`"${p.image.file}"`),
      `${p.id} names the image "${p.image.file}", which has no entry in place-images.ts — it would render blank`,
    );
  }
});

test("openExternal is the only NEW way out of the app", () => {
  // SP-039 made leaving the app one function's job, because `noopener,noreferrer` is
  // security-relevant: without it the opened page gets a handle on our window via
  // `window.opener` and can navigate it somewhere else. A convention nobody can check decays, so
  // this checks it.
  //
  // KNOWN DEBT, named rather than hidden. Six call sites predate the tourism layer — the Heritage
  // Ledger's Solana explorer links and four footer credits. They are grandfathered below, exactly
  // as the repo already treats its 25 known-unlabelled pre-v2 controls: the debt is listed, and
  // you may not add to it. Deleting a name from this list is allowed; adding one is the failure.
  const GRANDFATHERED = new Set(["HeritageLedgerScreen.tsx", "shell/SiteFooter.tsx"]);

  const dir = new URL("../components/", import.meta.url);
  const offenders: string[] = [];
  const walk = (d: URL, prefix = "") => {
    for (const name of readdirSync(d)) {
      const child = new URL(name, d);
      if (statSync(child).isDirectory()) walk(new URL(name + "/", d), prefix + name + "/");
      else if (name.endsWith(".tsx")) {
        const rel = prefix + name;
        if (GRANDFATHERED.has(rel)) continue;
        const src = readFileSync(child, "utf8");
        if (/\bwindow\.open\s*\(|\bLinking\.openURL\s*\(/.test(src)) offenders.push(rel);
      }
    }
  };
  walk(dir);

  assert.deepEqual(
    offenders,
    [],
    `these open a URL directly instead of via services/openExternal (SP-039): ${offenders.join(", ")}`,
  );
});

test("Kids surfaces never import experiences.ts", () => {
  // SP-040 made structural (SP-062): a child gets the heritage, not the commercial path out of the
  // app — guaranteed by the import graph rather than by remembering to hide a button.
  //
  // LIMIT, stated rather than papered over (SP-066): this checks DIRECT imports of the two Kids
  // surfaces only. A shared component that imported experiences and was used by Kids would not be
  // caught. Revisit if any shared component ever gains a booking affordance.
  for (const file of ["KidsScreen.tsx", "KidsStageScreen.tsx"]) {
    const src = readFileSync(new URL(`../components/${file}`, import.meta.url), "utf8");
    assert.ok(
      !/from\s+["'][^"']*experiences/.test(src),
      `${file} imports experiences.ts — no booking path may reach a child`,
    );
  }
});
