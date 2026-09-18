// The one component in this app that points a reader at a commercial offer.
//
// Two jobs, and they are kept visibly apart because conflating them would be a false historical
// statement made through layout (SP-041):
//
//   VISIT    — `direct` places. The event happened here, or the person is memorialised here.
//              These may carry a booking affordance.
//   RELATED  — `thematic` places. A topical association only. These get NO booking affordance,
//              no "plan a visit", and are never presented as where the story happened.
//
// WHAT IT NEVER DECIDES. `bookableAtPlace` filters to status "live" inside the resolver (SP-065), so
// this component cannot render a dead or unverified link even by mistake. A place with nothing live
// simply shows what it is and says nothing about tickets (SP-019).
//
// T5. Outbound URLs are the operator's own page with no identifiers appended. `openExternal` is the
// single place that leaves the app (SP-039).

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { placesForContent, type ContentRef, type LinkedPlace } from "../content/place-links";
import { bookableAtPlace } from "../content/experiences";
import type { Experience } from "../content/experiences";
import type { Place } from "../content/places";
import { openExternal } from "../services/openExternal";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { Icon } from "../ui";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";

const UI = {
  visit: { en: "Visit", tn: "Etela", af: "Besoek", zu: "Vakashela", xh: "Tyelela", nso: "Etela", st: "Etela", ss: "Vakashela", ts: "Endzela", nr: "Vakatjhela", ve: "Dalela" },
  related: { en: "Related", tn: "Tse di amanang", af: "Verwant", zu: "Okuhlobene", xh: "Okunxulumene", nso: "Tše di amanago", st: "Tse amanang", ss: "Lokuhlobene", ts: "Leswi fambelanaka", nr: "Okuhlobeneko", ve: "Zwo elanaho" },
  planVisit: { en: "Plan a visit", tn: "Rulaganya loeto", af: "Beplan 'n besoek", zu: "Hlela ukuvakasha", xh: "Cwangcisa utyelelo", nso: "Rulaganya leeto", st: "Rala leeto", ss: "Hlela kuvakasha", ts: "Kunguhata riendzo", nr: "Hlela ukuvakatjha", ve: "Dzudzanya lwendo" },
  opensSite: { en: "Opens the operator's own site", tn: "E bula webosaete ya mmereki", af: "Open die operateur se eie werf", zu: "Ivula isayithi yomsebenzisi", xh: "Ivula iwebhusayithi yomqhubi", nso: "E bula webosaete ya modiri", st: "E bula sebaka sa mosebetsi", ss: "Ivula licadzi lemsebenti", ts: "Yi pfula sayiti ya mutirhi", nr: "Ivula isayithi yomsebenzi", ve: "I vula sayithi ya mushumi" },
  moreOn: { en: "More on this place", tn: "Go feta ka lefelo le", af: "Meer oor hierdie plek", zu: "Okuningi ngale ndawo", xh: "Okungakumbi ngale ndawo", nso: "Tše dingwe ka lefelo le", st: "Tse ding ka sebaka sena", ss: "Lokunye ngalendzawo", ts: "Swin'wana hi ndhawu leyi", nr: "Okunye ngale ndawo", ve: "Zwiṅwe nga ha fhethu hafha" },
};

/** A place with whatever is bookable there right now. */
type Offer = { linked: LinkedPlace; bookable: Experience[] };

function BookingRow({ e, lang }: { e: Experience; lang: LangCode }) {
  return (
    <Pressable
      onPress={() => openExternal(e.url)}
      style={s.book}
      accessibilityRole="link"
      accessibilityLabel={`${t(UI.planVisit, lang)}: ${e.name}, ${e.operator}. ${t(UI.opensSite, lang)}`}
    >
      <Icon.ExternalLink size={15} color={colors.gold} />
      <View style={{ flex: 1 }}>
        <Text style={s.bookName}>{e.name}</Text>
        <Text style={s.bookOp}>{e.operator}</Text>
      </View>
      <Text style={s.bookCta}>{t(UI.planVisit, lang)}</Text>
    </Pressable>
  );
}

/** What you can book AT a place — the place-detail view of the same data.
 *
 *  Lives here rather than in PlaceView because this file is the one that may import experiences.ts
 *  (SP-062). PlaceView receives it as a slot, which is what keeps the heritage component free of any
 *  commercial path and therefore reusable by Kids. */
export function PlaceBookings({
  placeId,
  lang,
  allowBooking = true,
}: {
  placeId: string;
  lang: LangCode;
  allowBooking?: boolean;
}) {
  if (!allowBooking) return null;
  const bookable = bookableAtPlace(placeId);
  // Nothing live → say nothing about tickets at all (SP-019). Silence, not a disabled button.
  if (bookable.length === 0) return null;
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={s.label}>{t(UI.visit, lang)}</Text>
      {bookable.map((e) => (
        <BookingRow key={e.id} e={e} lang={lang} />
      ))}
    </View>
  );
}

function PlaceRow({
  offer,
  lang,
  onOpenPlace,
  allowBooking,
}: {
  offer: Offer;
  lang: LangCode;
  onOpenPlace?: (p: Place) => void;
  allowBooking: boolean;
}) {
  const { place } = offer.linked;
  return (
    <View style={s.row}>
      <Pressable
        onPress={onOpenPlace ? () => onOpenPlace(place) : undefined}
        disabled={!onOpenPlace}
        accessibilityRole={onOpenPlace ? "button" : undefined}
        accessibilityLabel={onOpenPlace ? `${place.name} — ${t(UI.moreOn, lang)}` : undefined}
        style={s.rowHead}
      >
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{place.name}</Text>
          <Text style={s.why}>{offer.linked.why}</Text>
        </View>
        {onOpenPlace ? <Icon.ChevronRight size={18} color={colors.gold} /> : null}
      </Pressable>

      {/* Booking lives behind BOTH gates: a direct relation, and a caller that allows it. Kids passes
          allowBooking={false}, so a child sees the place and no path out of the app (SP-040). */}
      {allowBooking ? offer.bookable.map((e) => <BookingRow key={e.id} e={e} lang={lang} />) : null}
    </View>
  );
}

export function VisitPanel({
  refTo,
  lang,
  onOpenPlace,
  allowBooking = true,
}: {
  /** The story this panel sits beside. */
  refTo: ContentRef;
  lang: LangCode;
  onOpenPlace?: (p: Place) => void;
  /** Kids passes false — the place still shows, the booking path does not (SP-040). */
  allowBooking?: boolean;
}) {
  const linked = placesForContent(refTo);
  if (linked.length === 0) return null;

  const offers: Offer[] = linked.map((l) => ({
    linked: l,
    // Only a `direct` place may be presented as somewhere to go (SP-041).
    bookable: l.relation === "direct" ? bookableAtPlace(l.place.id) : [],
  }));

  const direct = offers.filter((o) => o.linked.relation === "direct");
  const thematic = offers.filter((o) => o.linked.relation === "thematic");

  return (
    <View style={s.wrap}>
      {direct.length > 0 ? (
        <>
          <Text style={s.label}>{t(UI.visit, lang)}</Text>
          {direct.map((o) => (
            <PlaceRow key={o.linked.place.id} offer={o} lang={lang} onOpenPlace={onOpenPlace} allowBooking={allowBooking} />
          ))}
        </>
      ) : null}

      {thematic.length > 0 ? (
        <>
          <Text style={[s.label, s.labelMuted, direct.length > 0 ? { marginTop: spacing.md } : null]}>
            {t(UI.related, lang)}
          </Text>
          {thematic.map((o) => (
            // allowBooking is irrelevant here — `bookable` is empty for thematic by construction.
            <PlaceRow key={o.linked.place.id} offer={o} lang={lang} onOpenPlace={onOpenPlace} allowBooking={false} />
          ))}
        </>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: spacing.lg, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md },
  label: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  labelMuted: { color: colors.muted },
  row: { marginTop: spacing.sm + 2 },
  rowHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { color: "#fff", fontFamily: fonts.bodySemi, fontSize: 14 },
  why: { color: "rgba(255,255,255,0.55)", fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 2 },
  book: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm, backgroundColor: "rgba(26,133,167,0.10)", borderWidth: 1, borderColor: "rgba(26,133,167,0.35)", borderRadius: radius.sm, paddingVertical: 9, paddingHorizontal: 11 },
  bookName: { color: "#fff", fontFamily: fonts.bodyMedium, fontSize: 13 },
  bookOp: { color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 11, marginTop: 1 },
  bookCta: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" },
});
