// A scroll-told story laid out as a BOOK — the site's reading convention (SP-114).
//
// The literary modules are read as a book: a spread of paper, a plate on the left, the passage on
// the right, a page turn between. A story is opened the same way by default, so the app has one way
// of reading and the two scroll readings are alternatives rather than a second convention.
//
// This file only decides WHICH spread holds WHAT. It is pure so it can be tested without the
// renderer, and it does not import `national-days.ts` (which `require()`s image binaries and cannot
// load under node — SP-032); the caller says whether a day has an archival photograph.

import type { Story, StoryPanel } from "./stories.ts";

/** What a spread is, which decides what goes on its left page.
 *  - `title` — the story's title and standfirst; the reader starts here.
 *  - `place` — the place's own licensed photograph as a plate, credit and licence under it.
 *  - `archival` — a documentary photograph, shown WHOLE with its credit (SP-101, SP-109).
 *  - `type` — a typographic beat; no picture, and none is borrowed to fill the page.
 *  - `sources` — where the story comes from (T4), the last page. */
export type StorySpread =
  | { kind: "title" }
  | { kind: "place" | "archival" | "type"; panel: StoryPanel }
  | { kind: "sources" };

/** The spreads of a story, in reading order: title, one per panel, sources.
 *
 *  A panel is `archival` only if its day really has a credited photograph — the same test the
 *  scroll reading applies — so a day with no picture falls back to a typographic beat rather than
 *  rendering an empty plate. */
export function storySpreads(story: Story, hasArchivalPhoto: (dayId: string) => boolean): StorySpread[] {
  const panels: StorySpread[] = story.panels.map((panel) => {
    if (panel.placeId) return { kind: "place", panel };
    if (panel.dayId && hasArchivalPhoto(panel.dayId)) return { kind: "archival", panel };
    return { kind: "type", panel };
  });
  return [{ kind: "title" }, ...panels, { kind: "sources" }];
}
