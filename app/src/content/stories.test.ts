import { test } from "node:test";
import assert from "node:assert/strict";
import { stories, sowetoStory, storyById } from "./stories.ts";
import { places } from "./places.ts";
import { articles } from "./articles.ts";
import { CONTENT_KINDS } from "./topic-links.ts";
import { TOPICS } from "./topics.generated.ts";
import { readFileSync } from "node:fs";

// A scroll-told story is the most persuasive surface in the app and therefore the most dangerous
// one: nobody fact-checks a caption under a beautiful photograph. These tests exist because that
// is exactly where an unsourced claim would survive longest.

test("every story says where it comes from — T4 applies to a story as much as a place", () => {
  for (const story of stories) {
    assert.ok(story.sources.trim().length > 40, `${story.id} needs real sources, not a stub`);
    assert.ok(story.title.trim().length > 0, `${story.id} needs a title`);
    assert.ok(story.standfirst.trim().length > 0, `${story.id} needs a standfirst`);
    assert.ok(story.panels.length > 0, `${story.id} has no panels`);
  }
});

test("every panel has a kicker, a headline and a body — no empty beats", () => {
  for (const story of stories) {
    for (const p of story.panels) {
      assert.ok(p.kicker.trim().length > 0, `${story.id}/${p.id} needs a kicker`);
      assert.ok(p.headline.trim().length > 0, `${story.id}/${p.id} needs a headline`);
      assert.ok(p.body.trim().length > 20, `${story.id}/${p.id} needs a real body`);
    }
  }
});

test("panel ids are unique within a story — they are React keys", () => {
  for (const story of stories) {
    const seen = new Set<string>();
    for (const p of story.panels) {
      assert.ok(!seen.has(p.id), `${story.id} has two panels called "${p.id}"`);
      seen.add(p.id);
    }
  }
});

test("a panel's photograph is a REAL place's own photograph, never one borrowed for effect", () => {
  // SP-086. The story names a placeId and the renderer takes the image from that place's record,
  // so this checks the join: the place exists, and it actually has a licensed photograph. A panel
  // pointing at a place with no image would render as a typographic beat — silently losing the
  // picture the author meant to show.
  for (const story of stories) {
    for (const p of story.panels) {
      if (!p.placeId) continue;
      const place = places.find((x) => x.id === p.placeId);
      assert.ok(place, `${story.id}/${p.id} names place "${p.placeId}", which does not exist`);
      assert.ok(
        place.image,
        `${story.id}/${p.id} points at ${p.placeId}, which has no licensed photograph — ` +
          `the panel would silently lose its picture`,
      );
    }
  }
});

test("an archival panel names a real day, and that day has both an image and a credit", () => {
  // The archival branch renders only when BOTH exist. If a `dayId` resolved to a day with no
  // image, or an image with no credit, the panel would silently fall through to the place branch
  // and render as a typographic beat — losing Sam Nzima's photograph without any error.
  //
  // Checked against TOPICS rather than national-days.ts, which cannot be imported here: it
  // `require()`s image binaries (SP-032). topics.generated.test.ts independently proves TOPICS
  // faithful to the source, so this is a real check rather than a convenient one.
  const days = new Set(TOPICS.filter((t) => t.kind === "day").map((t) => t.id));
  for (const story of stories) {
    for (const p of story.panels) {
      if (!p.dayId) continue;
      assert.ok(days.has(p.dayId), `${story.id}/${p.id} names day "${p.dayId}", which does not exist`);
      const src = readFileSync(new URL("./national-days.ts", import.meta.url), "utf8");
      const block = src.slice(src.indexOf(`id: "${p.dayId}"`));
      const next = block.search(/\n {4}id: "/);
      const record = next === -1 ? block : block.slice(0, next);
      assert.match(record, /image: require\(/, `day "${p.dayId}" has no image — the panel would lose its photograph`);
      assert.match(record, /imageCredit:/, `day "${p.dayId}" has an image with no credit — it would render uncredited`);
    }
  }
});

test("a panel shows one picture, not two", () => {
  for (const story of stories) {
    for (const p of story.panels) {
      assert.ok(!(p.placeId && p.dayId), `${story.id}/${p.id} names both a place and a day`);
    }
  }
});

test("a panel's photograph carries a credit and a licence — attribution is an obligation", () => {
  // SP-087. The renderer reads these off the place, so if either were empty the screen would show
  // a photograph with no attribution on it.
  for (const story of stories) {
    for (const p of story.panels) {
      const place = p.placeId ? places.find((x) => x.id === p.placeId) : undefined;
      if (!place?.image) continue;
      assert.ok(place.image.credit.trim().length > 0, `${p.placeId} has a photograph with no credit`);
      assert.ok(place.image.licence.trim().length > 0, `${p.placeId} has a photograph with no licence`);
    }
  }
});

test("every panel link points at a real kind, and at the place the panel is about", () => {
  for (const story of stories) {
    for (const p of story.panels) {
      if (!p.ref) continue;
      assert.ok(
        (CONTENT_KINDS as readonly string[]).includes(p.ref.kind),
        `${story.id}/${p.id} links to unknown kind "${p.ref.kind}"`,
      );
      if (p.ref.kind === "place") {
        assert.ok(
          places.some((x) => x.id === p.ref?.id),
          `${story.id}/${p.id} links to place "${p.ref.id}", which does not exist`,
        );
        // A panel that shows one place's photograph must not link to a different place.
        if (p.placeId) {
          assert.equal(
            p.ref.id, p.placeId,
            `${story.id}/${p.id} shows ${p.placeId} but links to ${p.ref.id}`,
          );
        }
      }
    }
  }
});

// ── The Soweto story specifically ────────────────────────────────────────────────────────────────

test("the Soweto story uses the four Soweto places we hold photographs of", () => {
  const used = sowetoStory.panels.map((p) => p.placeId).filter(Boolean);
  assert.deepEqual(
    [...used].sort(),
    ["hector-pieterson-memorial", "mandela-house", "regina-mundi-church", "vilakazi-street"],
  );
});

test("it credits the two articles it draws on, by author", () => {
  // The story restates claims from both. If either is dropped from articles.ts the story would be
  // citing something the app no longer holds.
  for (const id of ["time-soweto-photograph", "herstory-soweto-erasure"]) {
    const a = articles.find((x) => x.id === id);
    assert.ok(a, `the story cites ${id}, which is no longer in articles.ts`);
    const surname = a.author.split("·")[0].trim().split(/\s+/).pop() as string;
    assert.ok(
      sowetoStory.sources.includes(surname),
      `the sources note does not name ${surname}, whose article the story draws on`,
    );
  }
});

test("it names the women the record leaves out — the whole reason it is told this way", () => {
  // Not decoration. The app holds Sipuye's argument that the conventional telling erases them,
  // and summarises it approvingly; a version of this story without the names would have the app's
  // most visible feature contradict its own scholarship. If someone edits the panels down, this
  // fails and says why.
  const text = sowetoStory.panels.map((p) => `${p.headline} ${p.body}`).join(" ");
  for (const name of ["Sibongile Mkhabela", "Winnie Motlalepula Kgware", "Hermina Leroke", "Antoinette Sithole"]) {
    assert.ok(text.includes(name), `the story no longer names ${name} — see herstory-soweto-erasure`);
  }
});

test("storyById resolves a real story and nothing else", () => {
  assert.equal(storyById("soweto-16-june")?.id, "soweto-16-june");
  assert.equal(storyById("nope"), undefined);
});
