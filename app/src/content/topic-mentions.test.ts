import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findMentionsIn,
  findMentions,
  buildSurfaces,
  MIN_SURFACE_LENGTH,
  type TopicProse,
  type Topic,
  type Exclusion,
} from "./topic-mentions.ts";

// A mention is derived, not authored, so nothing stops a bad one except these tests. The rules
// they pin are the whole safety argument for letting the app link topics automatically.
//
// Fixtures, not the real registry (SP-064) — the behaviour has to be provable independently of
// whatever prose happens to be in the repo this week. The real corpus is pinned separately, in
// topics.generated.test.ts.

const topic = (kind: Topic["kind"], id: string, name: string, routable = true): Topic =>
  ({ kind, id, name, routable });

const src = (t: Topic, prose: string): TopicProse => ({ ...t, prose });

const MANDELA = topic("president", "mandela", "Nelson Mandela");
const WINNIE = topic("hero", "winnie", "Winnie Madikizela-Mandela");
const HOUSE = topic("place", "mandela-house", "Mandela House");
const STREET = topic("place", "vilakazi-street", "Vilakazi Street");
const ALIASES = { "president:mandela": ["Mandela"] };

const seen = (m: ReturnType<typeof findMentionsIn>) => m.map((x) => `${x.to.kind}:${x.to.id}`).sort();

test("longest-match-first is what makes a bare surname alias safe", () => {
  // THE most important test here. "Mandela" is a word-bounded token inside "Winnie
  // Madikizela-Mandela" — the hyphen is a boundary — so without longest-first ordering plus span
  // claiming, one hand-written alias would attribute HER sentence to HIM. That is not a cosmetic
  // bug: it is the app making a false statement about two real people (SP-095).
  const topics = [MANDELA, WINNIE];
  const surfaces = buildSurfaces(topics, ALIASES);
  const got = findMentionsIn(
    src(topic("place", "constitution-hill", "Constitution Hill"), "Winnie Madikizela-Mandela was held here."),
    surfaces,
    [],
  );
  assert.deepEqual(seen(got), ["hero:winnie"], "her name is hers; the alias must not reach inside it");
});

test("a longer place name wins over a shorter one inside it", () => {
  const surfaces = buildSurfaces([HOUSE, MANDELA], ALIASES);
  const got = findMentionsIn(src(STREET, "South African Tourism and Mandela House describe it."), surfaces, []);
  assert.deepEqual(seen(got), ["place:mandela-house"], "not the president, whose name is not there");
});

test("word boundaries: a name inside a longer word is not a mention", () => {
  const surfaces = buildSurfaces([MANDELA], ALIASES);
  const no = findMentionsIn(src(STREET, "They moved to Mandelaville last year."), surfaces, []);
  assert.deepEqual(no, [], "Mandelaville is a different word");

  const yes = findMentionsIn(src(STREET, "Mandela's house stood here."), surfaces, []);
  assert.deepEqual(seen(yes), ["president:mandela"], "an apostrophe is a boundary");

  const bracket = findMentionsIn(src(STREET, "(Nelson Mandela) lived here."), surfaces, []);
  assert.deepEqual(seen(bracket), ["president:mandela"], "punctuation is a boundary");
});

test("a topic never mentions itself, and its own name claims its own characters", () => {
  // A day called "Nelson Mandela International Day" repeats its own title in its prose. The title
  // is the DAY's, so the president must not be matched inside it — the self-match has to claim the
  // span rather than step aside and leave it free for a shorter name.
  const DAY = topic("day", "mandela-day", "Nelson Mandela International Day", false);
  const surfaces = buildSurfaces([DAY, MANDELA], ALIASES);

  const titleOnly = findMentionsIn(src(DAY, "Nelson Mandela International Day is observed on 18 July."), surfaces, []);
  assert.deepEqual(titleOnly, [], "nothing — the only text is the day's own name");

  const alsoElsewhere = findMentionsIn(
    src(DAY, "Nelson Mandela International Day falls on Mandela's birthday."),
    surfaces,
    [],
  );
  assert.deepEqual(seen(alsoElsewhere), ["president:mandela"], "the second, separate reference counts");
});

test("a surface shorter than the floor is never matched", () => {
  const TINY = topic("place", "x", "Qu");
  assert.ok("Qu".length < MIN_SURFACE_LENGTH);
  const surfaces = buildSurfaces([TINY], {});
  assert.deepEqual(findMentionsIn(src(STREET, "Qu is here."), surfaces, []), []);
});

test("four-character names DO match — the floor is a backstop, not a distinctiveness test", () => {
  // Regression. The floor was 6 for one run, and the Nelson Mandela Museum — whose single sentence
  // names Qunu, Mvezo and Mandela — produced zero links.
  const QUNU = topic("place", "qunu", "Qunu");
  const surfaces = buildSurfaces([QUNU], {});
  assert.deepEqual(seen(findMentionsIn(src(STREET, "the centre at Qunu where he grew up"), surfaces, [])), ["place:qunu"]);
});

test("an excluded pair is suppressed — and still claims its span, so nothing worse takes it", () => {
  const exclusions: Exclusion[] = [
    { from: { kind: "place", id: "vilakazi-street" }, to: { kind: "place", id: "mandela-house" }, why: "test" },
  ];
  const surfaces = buildSurfaces([HOUSE, MANDELA], ALIASES);
  const got = findMentionsIn(src(STREET, "Mandela House stands here."), surfaces, exclusions);
  assert.deepEqual(got, [], "not the house, and not the president found inside the house's name");
});

test("one mention per pair, however many times the name appears", () => {
  const surfaces = buildSurfaces([MANDELA], ALIASES);
  const got = findMentionsIn(src(STREET, "Nelson Mandela lived here. Nelson Mandela left in 1962."), surfaces, []);
  assert.equal(got.length, 1);
  assert.equal(got[0].surface, "Nelson Mandela", "the longest surface, not the alias");
});

test("output is deterministic — two runs are byte-identical", () => {
  const topics = [MANDELA, WINNIE, HOUSE, STREET];
  const sources = [src(STREET, "Nelson Mandela and Mandela House."), src(HOUSE, "on Vilakazi Street")];
  const a = findMentions(sources, topics, ALIASES, []);
  const b = findMentions(sources, topics, ALIASES, []);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(a), JSON.stringify(b), "a regenerated file must not churn");
});

test("a mention carries no reason and no relation — that is the type, not a convention", () => {
  // SP-090. Nobody authored a reason, so there is no field to put one in and no component can
  // render one by mistake. If this ever fails, the integrity argument for the whole tier is gone.
  const surfaces = buildSurfaces([MANDELA], ALIASES);
  const [m] = findMentionsIn(src(STREET, "Nelson Mandela lived here."), surfaces, []);
  assert.deepEqual(Object.keys(m).sort(), ["from", "surface", "to"]);
});
