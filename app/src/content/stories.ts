// A story told by scrolling — full-bleed photograph, a line of text, the next photograph.
//
// WHAT THIS IS. Tumo asked for the Rockstar GTA VI page's shape: the story arrives as you scroll,
// in pictures and prose. That page is not scroll-jacking or parallax tricks — it is big art, big
// type, and a lot of black between. The same shape suits a heritage story, and this app already
// owns the one thing that page needs: real, licensed photographs of the places.
//
// EVERY SENTENCE IS TRACEABLE (AGENTS.md §2, T4). A cinematic surface is exactly where invented
// history would slip in unnoticed, because nobody fact-checks a caption under a beautiful picture.
// So the rule here is stricter than usual: a panel's `body` may only restate something already
// published and cited in `places.ts`, `articles.ts` or `national-days.ts`. `stories.test.ts`
// pins the sources; the register is `sources` below.
//
// NO PHOTOGRAPH IS BORROWED FOR EFFECT. A panel names a `placeId` and the renderer pulls that
// place's own photograph, credit and licence from `places.ts` — it never carries its own image
// path. So a story cannot illustrate one place with another's picture, and a credit cannot drift
// from the file it belongs to (SP-086, SP-087). Panels with no `placeId` render as type on black,
// which is a deliberate beat rather than a gap.
//
// SAM NZIMA'S PHOTOGRAPH IS DELIBERATELY NOT HERE. It is the defining image of 16 June and the app
// already ships it, credited, on the National Days screen. It is also a rights-encumbered press
// photograph, and widening its use into a showcase screen is Tumo's call to make, not a decision
// to take quietly inside a feature. The panel about the photograph therefore describes it.

import type { ContentRef } from "./topic-links.ts";

export type StoryPanel = {
  id: string;
  /** Small uppercase label above the headline — place, date, or what this beat is. */
  kicker: string;
  headline: string;
  /** One to three sentences. Every claim must trace to `Story.sources`. */
  body: string;
  /** → `places.ts`. The renderer takes the photograph, credit and licence from that record, so
   *  they cannot drift apart. Omit for a typographic beat. */
  placeId?: string;
  /** Optional: the topic this beat is about, so a reader can leave the story and go deeper. */
  ref?: ContentRef;
};

export type Story = {
  id: string;
  title: string;
  /** The line under the title, before the first panel. */
  standfirst: string;
  panels: StoryPanel[];
  /** REQUIRED. Same rule as `Place.sources` (T4): no source, not published. */
  sources: string;
};

/** 16 June 1976, told through the four Soweto places this app holds licensed photographs of.
 *
 *  THE SHAPE OF THE TELLING IS ITSELF SOURCED. `herstory-soweto-erasure` — Thando Sipuye in
 *  Pambazuka News — argues that the familiar account of the day commits epistemic violence against
 *  Black women: it is remembered through a small cast of male student leaders, while the women who
 *  organised the march, marched in it, hid and fed the students afterwards, and were themselves
 *  shot and detained, are left at the edges of the record or out of it. This app holds that article
 *  and summarises it approvingly. Telling the conventional version here would have the app
 *  contradict its own scholarship in its most visible feature, so the last third of the story is
 *  the correction, with the names Sipuye recovers. */
export const sowetoStory: Story = {
  id: "soweto-16-june",
  title: "Sixteen June",
  standfirst: "Four places in Soweto, one day in 1976, and the part of the record that is still being corrected.",
  sources:
    "Places and their photographs: see each place's own record in this app — Vilakazi Street (Encyclopaedia Britannica; University of the Witwatersrand; Mandela House / Soweto Heritage Trust), Mandela House (Soweto Heritage Trust), Hector Pieterson Memorial (South African History Online), Regina Mundi Church. " +
    "The march and the Afrikaans-medium decree: Youth Day, in this app's National Days. " +
    "The photograph and what it cost those in it: Aryn Baker, \"This Photo Inspired the World to Fight Against Apartheid\", TIME, 2016. " +
    "The erasure of the women of 1976, and the names recovered here: Thando Sipuye, \"Herstory: The Soweto uprising and the erasure of Black women\", Pambazuka News, 2017. " +
    "Nothing on this screen is stated that is not carried by one of those records.",
  panels: [
    {
      id: "orlando-west",
      kicker: "Orlando West · Soweto",
      headline: "A street with a poet's name",
      body: "Vilakazi Street is named after Benedict Wallet Vilakazi — the Zulu poet, the first Black South African to earn a PhD, and the author of Inkondlo kaZulu. Nelson Mandela lived at number 8115 from 1946.",
      placeId: "vilakazi-street",
      ref: { kind: "place", id: "vilakazi-street" },
    },
    {
      id: "eight-one-one-five",
      kicker: "8115 Vilakazi Street",
      headline: "Four rooms",
      body: "The house on the corner of Ngakane Street. He gave it to the Soweto Heritage Trust in 1997, and on his release described it as the centre point of his world.",
      placeId: "mandela-house",
      ref: { kind: "place", id: "mandela-house" },
    },
    {
      id: "the-decree",
      kicker: "16 June 1976",
      headline: "They marched against a language",
      body: "Thousands of Soweto school pupils marched against being forced to learn in Afrikaans. Police opened fire on the children.",
    },
    {
      id: "the-memorial",
      kicker: "Orlando West",
      headline: "The museum stands where he fell",
      body: "It commemorates the schoolchildren killed when police opened fire on the march. It opened on 16 June 2002, near the place Hector Pieterson was shot.",
      placeId: "hector-pieterson-memorial",
      ref: { kind: "place", id: "hector-pieterson-memorial" },
    },
    {
      id: "the-photograph",
      kicker: "The photograph",
      headline: "Eighteen carrying twelve",
      body: "Sam Nzima photographed eighteen-year-old Mbuyisa Makhubu carrying the mortally wounded twelve-year-old Hector Pieterson, with Antoinette Sithole running alongside. It ran in the world's newspapers. Nzima lived for years under police surveillance, and Makhubu fled into an exile he never returned from.",
    },
    {
      id: "regina-mundi",
      kicker: "Rockville",
      headline: "The people's church",
      body: "Many who fled the shooting in Orlando West came here, to the largest Catholic church in the country — one that had opened its doors to anti-apartheid meetings and sheltered activists. Police followed them inside and fired. The marks remain.",
      placeId: "regina-mundi-church",
      ref: { kind: "place", id: "regina-mundi-church" },
    },
    {
      id: "who-is-missing",
      kicker: "What the record leaves out",
      headline: "Name the women",
      body: "The historian Thando Sipuye argues the day is remembered through a small cast of male student leaders, while the women who organised the march, marched in it, hid and fed the students afterwards, and were themselves shot and detained, sit at the edges of the account. He recovers names: Sibongile Mkhabela, the only woman on the executive of the Soweto Students' Representative Council. Winnie Motlalepula Kgware, the first president of the Black People's Convention. Hermina Leroke, shot in Diepkloof on 17 June 1976.",
    },
    {
      id: "antoinette",
      kicker: "In the photograph",
      headline: "Antoinette Sithole was marching too",
      body: "She is remembered as Hector's sister. Sipuye's point is that she was a protester in her own right, and that the most reproduced image of the day carries the same habit of forgetting as the rest of the record.",
    },
    {
      id: "youth-day",
      kicker: "Every 16 June",
      headline: "Youth Day",
      body: "The uprising spread across the country, and a generation of young people joined the struggle. South Africa marks the date as Youth Day.",
    },
  ],
};

export const stories: Story[] = [sowetoStory];

export const storyById = (id: string): Story | undefined => stories.find((s) => s.id === id);
