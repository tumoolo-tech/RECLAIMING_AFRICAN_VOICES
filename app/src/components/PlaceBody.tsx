// What a place IS — the shared content of the full page and the in-reader overlay.
//
// Two containers show a place: `PlaceScreen` (its own page, reached from a city) and `PlaceView`
// (a sheet, reached from inside the article reader, which is itself a modal and cannot navigate
// away without losing the reader's position). Both render THIS, so the two can never drift into
// telling the same place's story differently.
//
// HERITAGE ONLY. Like PlaceView before it, this must never import experiences.ts (SP-062) — the
// commercial half arrives as a slot so Kids can reuse the heritage without a booking path.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Place } from "../content/places";
import { colors, spacing, radius, fonts, type } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";
import { LanguageNote } from "./LanguageNote";

const UI = {
  sources: { en: "Sources", tn: "Metswedi", af: "Bronne", zu: "Imithombo", xh: "Imithombo", nso: "Methopo", st: "Mehlodi", ss: "Imitsombo", ts: "Swihlovo", nr: "Imithombo", ve: "Zwiko" },
  kindMuseum: { en: "Museum", tn: "Musiamo", af: "Museum", zu: "Umnyuziyamu", xh: "Imyuziyam", nso: "Musiamo", st: "Musiamo", ss: "Imyuziyamu", ts: "Muziyamu", nr: "Imyuziyamu", ve: "Musiamu" },
  kindStreet: { en: "Street", tn: "Mmila", af: "Straat", zu: "Umgwaqo", xh: "Isitalato", nso: "Mmila", st: "Seterata", ss: "Umgwaco", ts: "Xitarata", nr: "Isitarata", ve: "Tshitarata" },
  kindSite: { en: "Heritage site", tn: "Lefelo la boswa", af: "Erfenisterrein", zu: "Indawo yamagugu", xh: "Indawo yelifa", nso: "Lefelo la bohwa", st: "Sebaka sa lefa", ss: "Indzawo yemagugu", ts: "Ndhawu ya ndzhaka", nr: "Indawo yamagugu", ve: "Fhethu ha ifa" },
  kindRoute: { en: "Route", tn: "Tsela", af: "Roete", zu: "Umzila", xh: "Indlela", nso: "Tsela", st: "Tsela", ss: "Indlela", ts: "Ndlela", nr: "Indlela", ve: "Nḓila" },
  kindMonument: { en: "Monument", tn: "Sekwala", af: "Monument", zu: "Isikhumbuzo", xh: "Isikhumbuzo", nso: "Sekwala", st: "Sehopotso", ss: "Sikhumbuto", ts: "Xitsundzuxo", nr: "Isikhumbuzo", ve: "Tshihumbudzo" },
  kindChurch: { en: "Church", tn: "Kereke", af: "Kerk", zu: "Isonto", xh: "Icawe", nso: "Kereke", st: "Kereke", ss: "Lisontfo", ts: "Kereke", nr: "Isondo", ve: "Kereke" },
  restricted: {
    en: "Access is held by this place's custodians — please respect their protocols",
    tn: "Tetla ya go tsena e mo diatleng tsa batlhokomedi ba lefelo le — tlotla melao ya bone",
    af: "Toegang berus by hierdie plek se bewaarders — respekteer asseblief hul protokolle",
    zu: "Ukungena kulawulwa abagcini bale ndawo — sicela uhloniphe imithetho yabo",
    xh: "Ukufikelela kulawulwa ngabagcini bale ndawo — nceda uhlonele imigaqo yabo",
    nso: "Tumelelo ya go tsena e go bahlokomedi ba lefelo le — hlompha melao ya bona",
    st: "Monyetla wa ho kena o ho bahlokomedi ba sebaka sena — hlompha melao ya bona",
    ss: "Kungena kulawulwa bagcini balendzawo — sicela uhloniphe imitsetfo yabo",
    ts: "Ku nghena ku lawuriwa hi valanguteri va ndhawu leyi — hlonipha milawu ya vona",
    nr: "Ukungena kulawulwa bagcini bale ndawo — sibawa uhloniphe imithetho yabo",
    ve: "U dzhena hu langwa nga vhalanguli vha fhethu hafha — kha vha ṱhonifhe milayo yavho",
  },
};

const KIND_LABEL = {
  museum: UI.kindMuseum,
  street: UI.kindStreet,
  site: UI.kindSite,
  route: UI.kindRoute,
  monument: UI.kindMonument,
  church: UI.kindChurch,
} as const;

export function kindLabel(place: Place, lang: LangCode): string {
  return t(KIND_LABEL[place.kind], lang);
}

export function PlaceBody({
  place,
  lang,
  footer,
}: {
  place: Place;
  lang: LangCode;
  /** Where the commercial half is injected, so this file never imports experiences.ts (SP-062). */
  footer?: React.ReactNode;
}) {
  return (
    <>
      <Text style={s.what}>{place.what}</Text>
      <LanguageNote lang={lang} />

      {/* SP-072 / SP-074: a place whose access is governed by custom or by someone's household
          says so. No Experience can reach it either — that is enforced in the data. */}
      {place.access ? (
        <View style={s.restricted}>
          <Text style={s.restrictedText}>{t(UI.restricted, lang)}</Text>
        </View>
      ) : null}

      {footer}

      <View style={s.src}>
        <Text style={s.srcH}>{t(UI.sources, lang)}</Text>
        <Text style={s.srcT}>{place.sources}</Text>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  what: { color: "rgba(255,255,255,0.78)", fontFamily: fonts.body, fontSize: type.body, lineHeight: 25 },
  restricted: {
    marginTop: spacing.md,
    backgroundColor: "rgba(217,106,28,0.10)",
    borderLeftWidth: 3,
    borderLeftColor: colors.orange,
    borderRadius: 8,
    padding: spacing.md,
  },
  restrictedText: { color: "rgba(255,255,255,0.82)", fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20 },
  src: { marginTop: spacing.lg, backgroundColor: "rgba(26,133,167,0.07)", borderLeftWidth: 3, borderLeftColor: colors.gold, borderRadius: 8, padding: spacing.md },
  srcH: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  srcT: { color: "rgba(255,255,255,0.62)", fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
