import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONTENT_KINDS } from "./topic-links.ts";
import { TOPICS, MENTIONS } from "./topics.generated.ts";

// `openRef` in App.tsx maps a topic kind to a route name and casts the result to `Route`. The cast
// is deliberate — a `case` per kind inside renderRoute is what SP-085 describes making the
// type-checker recurse — but a cast tells tsc to stop looking, so something else has to look.
//
// This is that something. It reads App.tsx AS TEXT (the SP-032 idiom `places.test.ts` uses on
// provinces.ts and `ui-coverage.test.ts` uses on components) and checks two things tsc could not
// check even without the cast:
//
//   1. every mapped route name is real AND CARRIES AN ID — `push({name: "days", id})` type-checks
//      against the union only because of the cast, and would navigate to a list screen that
//      ignores the id. The cast never protected against this; nothing did.
//   2. every ContentKind is a key, so adding a kind is a decision someone makes rather than a
//      silent `undefined` that quietly stops linking.

const APP = readFileSync(new URL("../../App.tsx", import.meta.url), "utf8");

/** Route names from the `type Route =` union, and whether each member carries an `id`. */
function routeUnion(): Map<string, boolean> {
  const block = /type Route =([\s\S]*?);\n/.exec(APP);
  assert.ok(block, "could not find the Route union in App.tsx — this test needs rewriting");
  const out = new Map<string, boolean>();
  for (const m of block[1].matchAll(/\{\s*name:\s*"([^"]+)"([^}]*)\}/g)) {
    out.set(m[1], /\bid\s*:/.test(m[2]));
  }
  return out;
}

/** The ROUTE_FOR_KIND literal, as kind -> route name or undefined. */
function routeForKind(): Map<string, string | undefined> {
  const block = /const ROUTE_FOR_KIND: Record<string, string \| undefined> = \{([\s\S]*?)\n\};/.exec(APP);
  assert.ok(block, "could not find ROUTE_FOR_KIND in App.tsx — this test needs rewriting");
  const out = new Map<string, string | undefined>();
  for (const m of block[1].matchAll(/^\s*(\w+):\s*(?:"([^"]+)"|undefined)/gm)) {
    out.set(m[1], m[2]);
  }
  return out;
}

test("the Route union and ROUTE_FOR_KIND are both readable — the rest of this file depends on it", () => {
  const routes = routeUnion();
  const map = routeForKind();
  assert.ok(routes.size > 20, `only found ${routes.size} routes; the union's shape must have changed`);
  assert.ok(map.size > 0, "ROUTE_FOR_KIND parsed as empty");
  assert.equal(routes.get("place"), true, "sanity: the place route carries an id");
  assert.equal(routes.get("days"), false, "sanity: the days route does not");
});

test("every mapped kind points at a real route THAT CARRIES AN ID", () => {
  const routes = routeUnion();
  for (const [kind, name] of routeForKind()) {
    if (!name) continue;
    assert.ok(routes.has(name), `ROUTE_FOR_KIND.${kind} = "${name}", which is not a route`);
    assert.equal(
      routes.get(name),
      true,
      `ROUTE_FOR_KIND.${kind} = "${name}", a route that takes no id — openRef would pass one and it ` +
        `would be ignored. The cast in openRef cannot catch this; that is why this test exists.`,
    );
  }
});

test("every ContentKind appears in ROUTE_FOR_KIND, even if the answer is undefined", () => {
  // A missing key and an `undefined` value behave identically at runtime, so the type cannot tell
  // them apart. The difference is whether a person decided.
  const map = routeForKind();
  for (const kind of CONTENT_KINDS) {
    assert.ok(map.has(kind), `ContentKind "${kind}" is missing from ROUTE_FOR_KIND — decide, do not omit`);
  }
});

test("the routable flag in the generated index agrees with App.tsx", () => {
  // Two files hold the same fact, so they get a test rather than a comment asking them to agree.
  const map = routeForKind();
  const kinds = new Set(TOPICS.map((t) => t.kind));
  for (const kind of kinds) {
    const routableInIndex = TOPICS.some((t) => t.kind === kind && t.routable);
    assert.equal(
      routableInIndex,
      Boolean(map.get(kind)),
      `"${kind}" is routable=${routableInIndex} in topics.generated.ts but ${
        map.get(kind) ? `mapped to "${map.get(kind)}"` : "unmapped"
      } in App.tsx — regenerate, or fix the map`,
    );
  }
});

test("every mention target is openable — no link in the data leads nowhere", () => {
  const map = routeForKind();
  for (const m of MENTIONS) {
    assert.ok(
      map.get(m.to.kind),
      `mention → ${m.to.kind}:${m.to.id} cannot be opened: "${m.to.kind}" has no route`,
    );
  }
});
