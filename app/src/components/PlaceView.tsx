// A place — what it is, where it is, and who says so.
//
// HERITAGE ONLY. This component does NOT import experiences.ts, and must not (SP-062). All commerce
// lives in VisitPanel. That split is forced rather than chosen: Kids surfaces may show a place but
// may never reach a booking path (SP-040), and the only way to guarantee that structurally is for
// the place component to have no way to render one.
//
// Rendered as an overlay from CityScreen rather than as a route (SP-035). App.tsx already records
// that the route union pushed the type-checker to its limit, and ProvincesScreens already runs this
// exact Modal pattern for the journey sheet. Honest cost: no deep link to a place in v1 (SP-036).

import React from "react";
import { View, Text, Modal, ScrollView, Pressable, StyleSheet } from "react-native";
import type { Place } from "../content/places";
import { colors, spacing, radius, fonts, type } from "../theme/tokens";
import { Icon } from "../ui";
import { t } from "../i18n";
import { LanguageNote } from "./LanguageNote";
import type { LangCode } from "../i18n/languages";

const UI = {
  place: { en: "Place", tn: "Lefelo", af: "Plek", zu: "Indawo", xh: "Indawo", nso: "Lefelo", st: "Sebaka", ss: "Indzawo", ts: "Ndhawu", nr: "Indawo", ve: "Fhethu" },
  close: { en: "Close", tn: "Tswala", af: "Maak toe", zu: "Vala", xh: "Vala", nso: "Tswalela", st: "Koala", ss: "Vala", ts: "Pfala", nr: "Vala", ve: "Vala" },
  sources: { en: "Sources", tn: "Metswedi", af: "Bronne", zu: "Imithombo", xh: "Imithombo", nso: "Methopo", st: "Mehlodi", ss: "Imitsombo", ts: "Swihlovo", nr: "Imithombo", ve: "Zwiko" },
  kindMuseum: { en: "Museum", tn: "Musiamo", af: "Museum", zu: "Umnyuziyamu", xh: "Imyuziyam", nso: "Musiamo", st: "Musiamo", ss: "Imyuziyamu", ts: "Muziyamu", nr: "Imyuziyamu", ve: "Musiamu" },
  kindStreet: { en: "Street", tn: "Mmila", af: "Straat", zu: "Umgwaqo", xh: "Isitalato", nso: "Mmila", st: "Seterata", ss: "Umgwaco", ts: "Xitarata", nr: "Isitarata", ve: "Tshitarata" },
  kindSite: { en: "Heritage site", tn: "Lefelo la boswa", af: "Erfenisterrein", zu: "Indawo yamagugu", xh: "Indawo yelifa", nso: "Lefelo la bohwa", st: "Sebaka sa lefa", ss: "Indzawo yemagugu", ts: "Ndhawu ya ndzhaka", nr: "Indawo yamagugu", ve: "Fhethu ha ifa" },
  kindRoute: { en: "Route", tn: "Tsela", af: "Roete", zu: "Umzila", xh: "Indlela", nso: "Tsela", st: "Tsela", ss: "Indlela", ts: "Ndlela", nr: "Indlela", ve: "Nḓila" },
  kindMonument: { en: "Monument", tn: "Sekwala", af: "Monument", zu: "Isikhumbuzo", xh: "Isikhumbuzo", nso: "Sekwala", st: "Sehopotso", ss: "Sikhumbuto", ts: "Xitsundzuxo", nr: "Isikhumbuzo", ve: "Tshihumbudzo" },
  kindChurch: { en: "Church", tn: "Kereke", af: "Kerk", zu: "Isonto", xh: "Icawe", nso: "Kereke", st: "Kereke", ss: "Lisontfo", ts: "Kereke", nr: "Isondo", ve: "Kereke" },
};

const KIND_LABEL = {
  museum: UI.kindMuseum,
  street: UI.kindStreet,
  site: UI.kindSite,
  route: UI.kindRoute,
  monument: UI.kindMonument,
  church: UI.kindChurch,
} as const;

export function PlaceView({
  place,
  lang,
  onClose,
  footer,
}: {
  place: Place | null;
  lang: LangCode;
  onClose: () => void;
  /** Where VisitPanel is injected by the caller. Keeping it a slot rather than an import is what
   *  keeps this file free of experiences.ts (SP-062). */
  footer?: React.ReactNode;
}) {
  const open = !!place;
  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.head}>
            <View style={{ flex: 1 }}>
              <Text style={s.kick}>{t(UI.place, lang)}</Text>
              {place ? <Text style={s.name}>{place.name}</Text> : null}
              {place ? <Text style={s.kind}>{t(KIND_LABEL[place.kind], lang)}</Text> : null}
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={s.close}
              accessibilityRole="button"
              accessibilityLabel={t(UI.close, lang)}
            >
              <Icon.ChevronDown size={22} color="#fff" strokeWidth={2.2} />
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: spacing.md }}>
            {place ? <Text style={s.what}>{place.what}</Text> : null}
            {/* A place's prose is English by design (SP-015). Say so rather than let a reader who
                picked isiZulu assume this is their language. */}
            <LanguageNote lang={lang} />

            {footer}

            {place ? (
              <View style={s.src}>
                <Text style={s.srcH}>{t(UI.sources, lang)}</Text>
                <Text style={s.srcT}>{place.sources}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.82)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  head: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  kick: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  name: { color: "#fff", fontFamily: fonts.serifSemi, fontSize: type.title, marginTop: 4 },
  kind: { color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 12, marginTop: 3 },
  close: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.07)" },
  what: { color: "rgba(255,255,255,0.78)", fontFamily: fonts.body, fontSize: type.body, lineHeight: 25 },
  src: { marginTop: spacing.lg, backgroundColor: "rgba(26,133,167,0.07)", borderLeftWidth: 3, borderLeftColor: colors.gold, borderRadius: 8, padding: spacing.md },
  srcH: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  srcT: { color: "rgba(255,255,255,0.62)", fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
