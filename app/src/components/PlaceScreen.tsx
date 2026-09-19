// A place, as its own page.
//
// Places were a bottom sheet until now — a paragraph and a close button. That was the right size
// for a link beside a story, and the wrong size for the thing the tourism layer is actually about:
// somewhere you might travel to. A page can carry a photograph, the story, the sources, what
// happened here, and what else is nearby.
//
// This REVERSES SP-035/SP-036, and the reason is worth recording. Those decisions rested on
// App.tsx's note that the route union had pushed the type-checker to its limit. Re-reading it, the
// recursion came from INLINING a component inside the route switch, and the fix was extracting it
// (`StageRoute`). Adding a route whose component lives outside the switch is the pattern that
// already works — so the deep link that SP-036 wrote off as a cost is simply available.
//
// PHOTOGRAPHS ARE REAL OR ABSENT. Never AI. See place-images.ts.

import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Screen, Icon } from "../ui";
import { places, type Place } from "../content/places";
import { placeImage } from "../content/place-images";
import { contentForPlace } from "../content/topic-links";
import { PlaceBody, kindLabel } from "./PlaceBody";
import { PressScale } from "./Motion";
import { colors, spacing, radius, fonts, type } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";

const UI = {
  place: { en: "Place", tn: "Lefelo", af: "Plek", zu: "Indawo", xh: "Indawo", nso: "Lefelo", st: "Sebaka", ss: "Indzawo", ts: "Ndhawu", nr: "Indawo", ve: "Fhethu" },
  happenedHere: {
    en: "What happened here", tn: "Se se diragetseng fano", af: "Wat hier gebeur het", zu: "Okwenzeka lapha", xh: "Okwenzeka apha",
    nso: "Se se diregilego mo", st: "Se etsahetseng mona", ss: "Lokwenteka lapha", ts: "Leswi humeleleke laha", nr: "Okwenzeka lapha", ve: "Zwe zwa itea hafha",
  },
  nearby: {
    en: "Elsewhere in this city", tn: "Mafelo a mangwe mo motseng ono", af: "Elders in hierdie stad", zu: "Kwenye indawo kuleli dolobha", xh: "Kwenye indawo kwesi sixeko",
    nso: "Mafelong a mangwe motseng wo", st: "Libakeng tse ding toropong ena", ss: "Kulenye indzawo kulelidolobha", ts: "Etindhawini tin'wana edorobeni leri", nr: "Kwenye indawo kiledorobho", ve: "Huṅwe fhethu kha ḽino ḓorobo",
  },
  photoBy: { en: "Photograph", tn: "Setshwantsho", af: "Foto", zu: "Isithombe", xh: "Ifoto", nso: "Seswantšho", st: "Setshwantsho", ss: "Sitfombe", ts: "Xifaniso", nr: "Isithombe", ve: "Tshifanyiso" },
  noPhoto: {
    en: "No licensed photograph of this place yet — we do not illustrate real places with AI",
    tn: "Ga go na setshwantsho se se nang le tetla sa lefelo le — ga re dirise AI go bontsha mafelo a mmatota",
    af: "Nog geen gelisensieerde foto van hierdie plek nie — ons illustreer nie werklike plekke met KI nie",
    zu: "Asikho isithombe esinelayisensi sale ndawo — asizifanekiseli izindawo ezingempela nge-AI",
    xh: "Akukho foto enelayisensi yale ndawo — asizoboni iindawo zokwenyani nge-AI",
    nso: "Ga go na seswantšho se se nago le tumelelo sa lefelo le — ga re šomiše AI go bontšha mafelo a kgonthe",
    st: "Ha ho na setshwantsho se nang le tumello sa sebaka sena — ha re sebedise AI ho bontsha libaka tsa 'nete",
    ss: "Kute sitfombe lesinelayisensi salendzawo — asisebentisi i-AI kukhombisa tindzawo tangempela",
    ts: "A ku na xifaniso xa layisense xa ndhawu leyi — a hi tirhisi AI ku kombisa tindhawu ta xiviri",
    nr: "Akunaso isithombe esinelayisensi sale ndawo — asisebenzisi i-AI ukutjengisa iindawo zamambala",
    ve: "A hu na tshifanyiso tshi re na laisenisi tsha fhethu hafha — a ri shumisi AI u sumbedza fhethu ha vhukuma",
  },
};

export function PlaceScreen({
  place,
  lang,
  onBack,
  onOpenPlace,
  footer,
}: {
  place: Place;
  lang: LangCode;
  onBack: () => void;
  onOpenPlace: (id: string) => void;
  footer?: React.ReactNode;
}) {
  const img = placeImage(place.image?.file);
  const stories = contentForPlace(place.id);
  const alsoHere = places.filter((p) => p.id !== place.id && p.cityId === place.cityId);

  return (
    <Screen tone="dark">
      <View style={s.hero}>
        {img ? (
          <>
            <ExpoImage source={img} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} cachePolicy="disk" />
            <LinearGradient colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.96)"]} style={StyleSheet.absoluteFill} />
          </>
        ) : (
          // Deliberately plain. An AI picture of a real address that we are telling someone to
          // travel to would read as a photograph of it (see place-images.ts).
          <View style={s.heroEmpty} />
        )}
        <Pressable style={s.back} onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Back">
          <Icon.ChevronLeft size={22} color="#fff" strokeWidth={2.4} />
        </Pressable>
        <View style={s.heroText}>
          <Text style={s.kick}>{t(UI.place, lang)}</Text>
          <Text style={s.name}>{place.name}</Text>
          <Text style={s.kind}>{kindLabel(place, lang)}</Text>
        </View>
      </View>

      {/* Credit is a licence obligation under CC BY-SA, not a courtesy — so it sits with the
          photograph rather than in a credits screen nobody opens. */}
      {place.image ? (
        <Text style={s.credit}>
          {t(UI.photoBy, lang)}: {place.image.credit} · {place.image.licence}
        </Text>
      ) : (
        <Text style={s.credit}>{t(UI.noPhoto, lang)}</Text>
      )}

      <View style={s.body}>
        <PlaceBody place={place} lang={lang} footer={footer} />
      </View>

      {stories.length > 0 ? (
        <View style={s.block}>
          <Text style={s.blockLabel}>{t(UI.happenedHere, lang)}</Text>
          {stories.map((c) => (
            <View key={`${c.ref.kind}:${c.ref.id}`} style={s.storyRow}>
              <Text style={s.storyWhy}>{c.why}</Text>
              {c.relation === "thematic" ? <Text style={s.thematic}>related</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      {alsoHere.length > 0 ? (
        <View style={s.block}>
          <Text style={s.blockLabel}>{t(UI.nearby, lang)}</Text>
          <View style={s.chipRow}>
            {alsoHere.map((p) => (
              <PressScale
                key={p.id}
                style={s.chip}
                onPress={() => onOpenPlace(p.id)}
                accessibilityLabel={`${p.name} — ${kindLabel(p, lang)}`}
              >
                <Text style={s.chipText}>{p.name}</Text>
                <Icon.ChevronRight size={14} color={colors.gold} />
              </PressScale>
            ))}
          </View>
        </View>
      ) : null}

      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { height: 260, borderRadius: radius.md, overflow: "hidden", justifyContent: "flex-end" },
  heroEmpty: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#0c0c0c", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  back: { position: "absolute", top: spacing.md, left: spacing.md, width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)" },
  heroText: { padding: spacing.md },
  kick: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  name: { color: "#fff", fontFamily: fonts.display, fontSize: type.display, marginTop: 4 },
  kind: { color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 12, marginTop: 3 },
  credit: { color: "rgba(255,255,255,0.42)", fontFamily: fonts.body, fontSize: 11, marginTop: 6, marginBottom: spacing.md },
  body: { marginTop: spacing.xs },
  block: { marginTop: spacing.lg },
  blockLabel: { color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: spacing.sm },
  storyRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginTop: spacing.xs },
  storyWhy: { flex: 1, color: "rgba(255,255,255,0.7)", fontFamily: fonts.body, fontSize: 13, lineHeight: 20 },
  thematic: { color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", marginTop: 3 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(26,133,167,0.10)", borderWidth: 1, borderColor: "rgba(26,133,167,0.55)", borderRadius: radius.pill, paddingVertical: 7, paddingLeft: 13, paddingRight: 9 },
  chipText: { color: "#fff", fontFamily: fonts.bodyMedium, fontSize: 12 },
});
