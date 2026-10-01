import { test } from "node:test";
import assert from "node:assert/strict";
import { parseReadPath, readPathFor, readCatalog, isLifeBook } from "./read-links.ts";

// Fixtures rather than the real content: content/index.ts imports without file extensions, which
// Node's type-stripping loader will not resolve (the same reason routes.test.ts reads files).
const MODULES = new Set(["tambo", "mhudi", "ityala-lamawele", "food"]);
const STORIES = new Set(["soweto-16-june"]);
const parse = (p: string) => parseReadPath(p, (id) => MODULES.has(id), (id) => STORIES.has(id));

test("paths outside /read are left to the app", () => {
  for (const p of ["/", "", "/atlas", "/reading", "/readers/tambo", "/api/chat"]) assert.equal(parse(p), null, p);
});

test("/read opens the list, with or without a trailing slash", () => {
  assert.deepEqual(parse("/read"), { kind: "index" });
  assert.deepEqual(parse("/read/"), { kind: "index" });
  assert.deepEqual(parse("/READ"), { kind: "index" });
});

test("/read/<module> opens the book, /read/<story> the scroll-told story", () => {
  assert.deepEqual(parse("/read/tambo"), { kind: "reader", id: "tambo" });
  assert.deepEqual(parse("/read/tambo/"), { kind: "reader", id: "tambo" });
  assert.deepEqual(parse("/read/Tambo"), { kind: "reader", id: "tambo" });
  assert.deepEqual(parse("/read/ityala-lamawele"), { kind: "reader", id: "ityala-lamawele" });
  assert.deepEqual(parse("/read/soweto-16-june"), { kind: "story", id: "soweto-16-june" });
});

test("an unknown or malformed link falls back to the list and says what was asked for", () => {
  assert.deepEqual(parse("/read/nobody"), { kind: "index", missing: "nobody" });
  assert.deepEqual(parse("/read/tambo/extra"), { kind: "index", missing: "tambo" });
  assert.deepEqual(parse("/read/%E0%A4%A"), { kind: "index", missing: "%E0%A4%A" });
});

test("only story screens and the list have an address of their own", () => {
  assert.equal(readPathFor("reader", "tambo"), "/read/tambo");
  assert.equal(readPathFor("story", "soweto-16-june"), "/read/soweto-16-june");
  assert.equal(readPathFor("read"), "/read");
  for (const name of ["home", "atlas", "hero", "place", "reader"]) assert.equal(readPathFor(name), null, name);
});

test("an address round-trips back to the same screen", () => {
  for (const id of MODULES) assert.deepEqual(parse(readPathFor("reader", id)!), { kind: "reader", id });
  for (const id of STORIES) assert.deepEqual(parse(readPathFor("story", id)!), { kind: "story", id });
});

test("the catalog lists every module and story exactly once, lives first", () => {
  const literature = [{ id: "mhudi", title: "Mhudi", author: "Sol T. Plaatje" }];
  const atlas = [
    { id: "food", title: "Food & Flavour", author: "The South African Table" },
    { id: "tambo", title: "Oliver Tambo", author: "A life · Reclaimed Voices" },
  ];
  const stories = [{ id: "soweto-16-june", title: "Sixteen June" }];
  const groups = readCatalog(literature, atlas, stories);
  assert.deepEqual(groups.map((g) => g.id), ["lives", "literature", "heritage", "stories"]);
  const ids = groups.flatMap((g) => g.entries.map((e) => e.id));
  assert.deepEqual([...ids].sort(), ["food", "mhudi", "soweto-16-june", "tambo"]);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(groups[0].entries, [{ id: "tambo", route: "reader", path: "/read/tambo" }]);
  assert.deepEqual(groups[3].entries, [{ id: "soweto-16-june", route: "story", path: "/read/soweto-16-june" }]);
});

test("an empty group is left out rather than shown with nothing under it", () => {
  const groups = readCatalog([{ id: "mhudi", title: "Mhudi" }], [], []);
  assert.deepEqual(groups.map((g) => g.id), ["literature"]);
  assert.equal(isLifeBook({ id: "x", title: "x" }), false);
});
