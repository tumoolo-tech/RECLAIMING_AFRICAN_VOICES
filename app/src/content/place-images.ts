// Place photographs — the asset side, kept apart from the data side on purpose.
//
// `places.ts` stores only a FILE NAME. This module turns that name into a bundled asset. The split
// exists because `require()`-ing an image makes a module un-importable under `node --test` — which
// is precisely why `provinces.ts` has to be read as text by its own tests (SP-032). Keeping the
// requires here means `places.ts` stays pure data that both the test suite and the freshness
// script can import directly.
//
// EVERY IMAGE HERE IS A REAL PHOTOGRAPH, LICENSED FOR REUSE. Never an AI image. An invented
// picture of Vilakazi Street would illustrate a real address that this app is telling a reader to
// travel to, and they would read it as a photograph of that street. Credit and licence live beside
// the file name in `places.ts` and are shown on the page — that is a licence obligation under
// CC BY-SA, not a courtesy.
//
// A place with no licensed photograph simply has none. The page is designed for that.

import type { ImageSourcePropType } from "react-native";

/** file name → bundled asset. `places.test.ts` fails if a place names a file that is not here. */
export const PLACE_IMAGES: Record<string, ImageSourcePropType> = {
  // Soweto, sourced from Wikimedia Commons 2026-09-19. Each licence and photographer was read
  // from Commons' own metadata by `npm run fetch:place-photo`, and each photograph was LOOKED AT
  // before being accepted — the Mandela House sign in its own picture reads "8115 Vilakazi St",
  // which independently confirms the address in that place's text.
  "vilakazi-street.webp": require("../../assets/places/photos/vilakazi-street.webp"),
  "hector-pieterson-memorial.webp": require("../../assets/places/photos/hector-pieterson-memorial.webp"),
  "mandela-house.webp": require("../../assets/places/photos/mandela-house.webp"),
  "regina-mundi-church.webp": require("../../assets/places/photos/regina-mundi-church.webp"),
  "robben-island.webp": require("../../assets/places/photos/robben-island.webp"),
  "district-six.webp": require("../../assets/places/photos/district-six.webp"),
  "table-mountain.webp": require("../../assets/places/photos/table-mountain.webp"),
  "dorp-street.webp": require("../../assets/places/photos/dorp-street.webp"),
  "jonkershoek.webp": require("../../assets/places/photos/jonkershoek.webp"),
  "constitution-hill.webp": require("../../assets/places/photos/constitution-hill.webp"),
  "apartheid-museum.webp": require("../../assets/places/photos/apartheid-museum.webp"),
  "the-big-hole.webp": require("../../assets/places/photos/the-big-hole.webp"),
  "mcgregor-museum.webp": require("../../assets/places/photos/mcgregor-museum.webp"),
  "donkin-reserve.webp": require("../../assets/places/photos/donkin-reserve.webp"),
  "route-67.webp": require("../../assets/places/photos/route-67.webp"),
  "st-georges-park.webp": require("../../assets/places/photos/st-georges-park.webp"),
  "cathedral-of-st-michael-and-st-george.webp": require("../../assets/places/photos/cathedral-of-st-michael-and-st-george.webp"),
};

export const placeImage = (file: string | undefined): ImageSourcePropType | undefined =>
  file ? PLACE_IMAGES[file] : undefined;
