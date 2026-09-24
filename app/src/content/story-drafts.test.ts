import { test } from "node:test";
import assert from "node:assert/strict";
import { stories, sowetoStory } from "./stories.ts";
import { STORY_DRAFTS } from "./story-drafts.data.ts";
import { storyText, panelText } from "./story-drafts.ts";
import { LANGUAGES } from "../i18n/languages.ts";

// A translated story is the easiest place for a fact to change without anyone noticing — the
// reviewer reads the English, the reader hears the translation. These checks cannot judge a
// translation, but they can prove it has not dropped or altered a person, a place or a date.

const CODES = new Set<string>(LANGUAGES.map((l) => l.code));

/** Proper names a draft must carry verbatim whenever its English source does. Substring match, so
 *  a noun-class prefix or locative ("uHector Pieterson", "eSoweto", "Vilakazistraat") still counts. */
const NAMES = [
  "Benedict Wallet Vilakazi", "Vilakazi", "Inkondlo kaZulu", "Nelson Mandela", "Ngakane", "PhD",
  "Soweto Heritage Trust", "Hector Pieterson", "Hector", "Sam Nzima", "Nzima", "Mbuyisa Makhubu",
  "Makhubu", "Antoinette Sithole", "Thando Sipuye", "Sipuye", "Sibongile Mkhabela",
  "Winnie Motlalepula Kgware", "Hermina Leroke", "Diepkloof", "Orlando West", "Soweto", "Rockville",
  "Black People's Convention",
];
/** Years and house numbers — any run of three or more digits. */
const numbers = (s: string) => s.match(/\d{3,}/g) ?? [];

function check(en: string, drafts: Partial<Record<string, string>>, where: string) {
  for (const [lang, text] of Object.entries(drafts)) {
    assert.ok(CODES.has(lang), `${where}: "${lang}" is not a language this app knows`);
    assert.notEqual(lang, "en", `${where}: English lives in stories.ts, not in the drafts`);
    assert.ok(text && text.trim().length > 0, `${where} [${lang}] is empty`);
    for (const name of NAMES) {
      if (en.includes(name)) assert.ok(text!.includes(name), `${where} [${lang}] dropped "${name}"`);
    }
    for (const n of numbers(en)) {
      assert.ok(text!.includes(n), `${where} [${lang}] dropped or changed "${n}"`);
    }
  }
}

test("every story draft keeps the names, years and numbers of its English source", () => {
  for (const [storyId, d] of Object.entries(STORY_DRAFTS)) {
    const story = stories.find((s) => s.id === storyId);
    assert.ok(story, `drafts exist for "${storyId}", which is not a story`);
    check(story.title, d.title, `${storyId}.title`);
    check(story.standfirst, d.standfirst, `${storyId}.standfirst`);
    for (const [panelId, fields] of Object.entries(d.panels)) {
      const panel = story.panels.find((p) => p.id === panelId);
      assert.ok(panel, `drafts exist for panel "${panelId}", which ${storyId} does not have`);
      check(panel.kicker, fields.kicker, `${storyId}.${panelId}.kicker`);
      check(panel.headline, fields.headline, `${storyId}.${panelId}.headline`);
      check(panel.body, fields.body, `${storyId}.${panelId}.body`);
    }
  }
});

test("Sixteen June has a draft of every panel, in every language but English", () => {
  const d = STORY_DRAFTS[sowetoStory.id];
  const others = LANGUAGES.map((l) => l.code).filter((c) => c !== "en");
  for (const p of sowetoStory.panels) {
    for (const f of ["kicker", "headline", "body"] as const) {
      for (const lang of others) {
        assert.ok(d.panels[p.id]?.[f]?.[lang], `${p.id}.${f} has no ${lang} draft`);
      }
    }
  }
});

test("a draft is labelled a draft, English is reviewed, and a missing draft falls back honestly", () => {
  const panel = sowetoStory.panels[0];
  assert.deepEqual(panelText(sowetoStory, panel, "body", "en"), { text: panel.body, lang: "en", status: "reviewed" });
  const tn = panelText(sowetoStory, panel, "body", "tn");
  assert.equal(tn.status, "draft");
  assert.equal(tn.lang, "tn");
  const bare = { ...sowetoStory, id: "no-drafts" };
  const fb = storyText(bare, "title", "zu");
  assert.equal(fb.status, "fallback");
  assert.equal(fb.lang, "en", "a fallback must say it is English, so it is narrated in English");
});
