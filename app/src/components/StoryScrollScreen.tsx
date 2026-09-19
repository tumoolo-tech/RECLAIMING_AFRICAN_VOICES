// A story told by scrolling — the shape Tumo asked for, pointing at the Rockstar GTA VI page.
//
// WHAT THAT PAGE ACTUALLY DOES, having looked at it: full-bleed art roughly a screen tall, a small
// uppercase kicker over a large display headline, one or two lines of body, text alternating left
// and right, and a lot of black between panels so each reads as a card floating on nothing. A
// sticky minimal header. It is NOT scroll-jacking or parallax — the effect comes from scale and
// restraint, which is also what makes it portable to a phone.
//
// SO THE MOTION IS DELIBERATELY MODEST. Each panel rises and fades as it enters view
// (`RevealOnScroll`), driven by interpolating scroll position against the panel's own measured
// position. No sticky positioning, no scroll hijacking, so web, Android and iOS behave identically.
//
// THE PHOTOGRAPHS ARE NOT THIS FILE'S TO CHOOSE. A panel names a `placeId` or a `dayId`; the
// image, its credit and its licence all come from that record. A story therefore cannot illustrate
// one place with another's picture, and a credit cannot drift from the file it belongs to
// (SP-086, SP-087). A panel naming neither is type on black — a beat, not a gap.
//
// THREE PANEL SHAPES, AND THE THIRD IS THE POINT OF THE OTHER TWO:
//
//   place       a licensed photograph, cropped to fill, darkened from the text side so a headline
//               can sit on it. Scenery: cropping loses nothing.
//   archival    a documentary photograph, shown WHOLE on black, never cropped and never darkened,
//               with its caption below and the story text below that. Evidence: cropping changes
//               what it shows, and a headline across it would be writing on the record.
//   typographic no picture. A pause, given enough height to read as one.
//
// CREDIT RENDERS ON EVERY PHOTOGRAPH, not in a credits screen at the end. CC BY attribution is a
// licence obligation and a credit nobody scrolls to is not attribution (SP-087). For the archival
// photograph the credit is stronger still — it names the photographer, the people in the frame and
// the date, because for that picture the caption is part of what the picture means.

import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, useWindowDimensions } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Screen, Icon } from "../ui";
import { PressScale, RevealOnScroll } from "./Motion";
import { placeById } from "../content/places";
import { placeImage } from "../content/place-images";
import { nationalDays } from "../content/national-days";
import type { Story, StoryPanel } from "../content/stories";
import type { ContentRef } from "../content/topic-links";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";

const UI = {
  readOn: {
    en: "Open this place", tn: "Bula lefelo le", af: "Open hierdie plek", zu: "Vula le ndawo", xh: "Vula le ndawo",
    nso: "Bula lefelo le", st: "Bula sebaka sena", ss: "Vula lendzawo", ts: "Pfula ndhawu leyi", nr: "Vula le ndawo", ve: "Vula hafha fhethu",
  },
  sources: {
    en: "Where this comes from", tn: "Se se tswang kae", af: "Waar dit vandaan kom", zu: "Lapha kuvela khona", xh: "Apho oku kuvela khona",
    nso: "Moo se tšwago gona", st: "Moo sena se tswang teng", ss: "Lapho loku lokuvela khona", ts: "Laha swi humaka kona", nr: "Lapha lokhu okuvela khona", ve: "Hune zwa bva hone",
  },
  scroll: {
    en: "Scroll", tn: "Menologa", af: "Rol", zu: "Skrolela", xh: "Skrola",
    nso: "Menola", st: "Silela", ss: "Skrola", ts: "Hundzuluxa", nr: "Skrola", ve: "Rolani",
  },
};

function Panel({
  panel,
  lang,
  scrollY,
  viewportHeight,
  align,
  live,
  onOpenRef,
}: {
  panel: StoryPanel;
  lang: LangCode;
  scrollY: Animated.Value;
  viewportHeight: number;
  align: "left" | "right";
  live: boolean;
  onOpenRef: (ref: ContentRef) => void;
}) {
  // The photograph, its credit and its licence come from the place — never from the story.
  const place = panel.placeId ? placeById(panel.placeId) : undefined;
  const img = placeImage(place?.image?.file);
  const height = Math.max(420, Math.min(viewportHeight * 0.82, 720));

  // An ARCHIVAL photograph — Sam Nzima's, by Tumo's decision. Its own panel shape, because it is
  // a different kind of picture: evidence rather than scenery. Shown whole on black, never
  // cropped to fill, never darkened under a headline, with the caption and credit under it and
  // the story text below that. Both come from `national-days.ts` so neither can be retyped wrong.
  const day = panel.dayId ? nationalDays.find((d) => d.id === panel.dayId) : undefined;
  if (day?.image && day.imageCredit) {
    return (
      <RevealOnScroll scrollY={scrollY} viewportHeight={viewportHeight} live={live} style={s.panelWrap}>
        <View style={[s.archival, { minHeight: Math.min(viewportHeight * 0.52, 460) }]}>
          <ExpoImage
            source={day.image}
            style={s.archivalImg}
            contentFit="contain"
            transition={260}
            cachePolicy="disk"
            accessibilityLabel={day.imageCredit}
          />
        </View>
        <Text style={s.archivalCredit}>{day.imageCredit}</Text>
        <View style={s.copyBare}>
          <Text style={s.kicker}>{panel.kicker}</Text>
          <Text style={s.headline}>{panel.headline}</Text>
          <Text style={s.body}>{panel.body}</Text>
        </View>
      </RevealOnScroll>
    );
  }

  return (
    <RevealOnScroll scrollY={scrollY} viewportHeight={viewportHeight} live={live} style={s.panelWrap}>
      <View style={[s.panel, { minHeight: img ? height : undefined }]}>
        {img ? (
          <>
            <ExpoImage source={img} style={StyleSheet.absoluteFill} contentFit="cover" transition={260} cachePolicy="disk" />
            {/* Dark from the text side, so the type has something to sit on whichever way it is
                aligned, and the photograph keeps as much of itself as legibility allows. */}
            <LinearGradient
              colors={["rgba(0,0,0,0.86)", "rgba(0,0,0,0.42)", "rgba(0,0,0,0.12)"]}
              start={align === "left" ? { x: 0, y: 0.6 } : { x: 1, y: 0.6 }}
              end={align === "left" ? { x: 1, y: 0 } : { x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </>
        ) : null}

        <View style={[s.copy, align === "right" ? s.copyRight : null, img ? null : s.copyBare]}>
          <Text style={s.kicker}>{panel.kicker}</Text>
          <Text style={s.headline}>{panel.headline}</Text>
          <Text style={s.body}>{panel.body}</Text>

          {panel.ref ? (
            <PressScale
              style={s.open}
              onPress={() => onOpenRef(panel.ref as ContentRef)}
              accessibilityLabel={`${panel.headline} — ${t(UI.readOn, lang)}`}
            >
              <Text style={s.openText}>{t(UI.readOn, lang)}</Text>
              <Icon.ChevronRight size={14} color={colors.gold} />
            </PressScale>
          ) : null}
        </View>

        {/* A licence obligation, not a caption (SP-087). */}
        {place?.image ? (
          <Text style={s.credit}>
            {place.image.credit} · {place.image.licence}
          </Text>
        ) : null}
      </View>
    </RevealOnScroll>
  );
}

export function StoryScrollScreen({
  story,
  lang,
  onBack,
  onOpenRef,
}: {
  story: Story;
  lang: LangCode;
  onBack: () => void;
  onOpenRef: (ref: ContentRef) => void;
}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  // The window, NOT the ScrollView's onLayout box. Measured: onLayout reported taller than the
  // window on web, so panels came out 720px inside a 695px viewport — a panel that cannot fit on
  // one screen defeats the point of a story told one beat at a time.
  const { height: viewport } = useWindowDimensions();
  // Set by the first scroll event that actually arrives — see RevealOnScroll's `live`.
  const [live, setLive] = useState(false);

  return (
    <Screen tone="dark" scroll={false} padded={false}>
      <Animated.ScrollView
        style={s.fill}
        contentContainerStyle={s.content}
        scrollEventThrottle={16}
        // A plain handler, NOT `Animated.event`. This is not a style preference — it is the
        // difference between a story and a black screen, and it was found by measuring the
        // rendered opacity in a browser rather than by reading the docs.
        //
        // With `Animated.event(..., { useNativeDriver: true })` the value never moved on web: it
        // stayed pinned at 0, so every panel's interpolation clamped to 0 and everything below the
        // first one rendered at opacity exactly 0. A nine-panel showcase with one visible panel.
        // Setting `useNativeDriver` per-platform did not fix it either.
        //
        // `setValue` works the same way on web, Android and iOS, which is worth more here than the
        // native driver: the animation is ten interpolations of two cheap properties, and a story
        // that is identical everywhere beats one that is marginally smoother on a phone and blank
        // in a browser.
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
          if (!live) setLive(true);
        }}
      >
        {/* In the scroll rather than floating over it: the app shell's nav already owns the top
            strip, and a floating button there is simply hidden behind it. The shell's own nav is
            the persistent way out, so this one is free to scroll away. */}
        <PressScale style={s.back} onPress={onBack} accessibilityLabel="Back">
          <Icon.ChevronLeft size={18} color={colors.muted} strokeWidth={2.2} />
          <Text style={s.backText}>Back</Text>
        </PressScale>

        {/* Title card. Deliberately plain — the first photograph should be the first picture a
            reader sees, not a hero competing with it. */}
        <View style={[s.title, { minHeight: Math.min(viewport * 0.62, 520) }]}>
          <Text style={s.titleText}>{story.title}</Text>
          <Text style={s.standfirst}>{story.standfirst}</Text>
          <View style={s.scrollHint}>
            <Text style={s.scrollHintText}>{t(UI.scroll, lang)}</Text>
            <Icon.ChevronDown size={16} color={colors.muted} />
          </View>
        </View>

        {story.panels.map((p, i) => (
          <Panel
            key={p.id}
            panel={p}
            lang={lang}
            scrollY={scrollY}
            viewportHeight={viewport}
            align={i % 2 === 0 ? "left" : "right"}
            live={live}
            onOpenRef={onOpenRef}
          />
        ))}

        {/* T4: the story ends on where it came from, in the same scroll rather than a link. */}
        <RevealOnScroll scrollY={scrollY} viewportHeight={viewport} live={live} style={s.panelWrap}>
          <View style={s.sources}>
            <Text style={s.sourcesLabel}>{t(UI.sources, lang)}</Text>
            <Text style={s.sourcesText}>{story.sources}</Text>
          </View>
        </RevealOnScroll>

        <View style={{ height: spacing.xxl * 2 }} />
      </Animated.ScrollView>

    </Screen>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.xxl },

  title: { justifyContent: "center", paddingVertical: spacing.xxl },
  titleText: { color: "#fff", fontFamily: fonts.display, fontSize: 56, lineHeight: 60 },
  standfirst: {
    color: "rgba(255,255,255,0.72)", fontFamily: fonts.body, fontSize: 16, lineHeight: 26,
    marginTop: spacing.md, maxWidth: 560,
  },
  scrollHint: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.xl },
  scrollHintText: {
    color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  // Black between panels is most of the effect.
  panelWrap: { marginBottom: spacing.xxl },
  panel: { borderRadius: radius.lg, overflow: "hidden", justifyContent: "flex-end" },

  copy: { padding: spacing.lg, maxWidth: 620 },
  copyRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  // A typographic beat needs its own breathing room, since there is no photograph giving it height.
  // A beat with no photograph has nothing giving it height, so it gets its own: generous space,
  // a gold rule to stand on, and a wider measure. Without this it reads as a gap between pictures
  // rather than a deliberate pause — which is exactly what it looked like on screen.
  copyBare: {
    paddingVertical: spacing.xxl, paddingLeft: spacing.lg, maxWidth: 720,
    borderLeftWidth: 2, borderLeftColor: colors.gold,
  },

  kicker: {
    color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.6,
    textTransform: "uppercase", marginBottom: spacing.sm,
  },
  headline: { color: "#fff", fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  body: {
    color: "rgba(255,255,255,0.82)", fontFamily: fonts.body, fontSize: 15, lineHeight: 25,
    marginTop: spacing.sm,
  },
  open: {
    flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.md,
    alignSelf: "flex-start", backgroundColor: "rgba(0,0,0,0.5)", borderWidth: 1,
    borderColor: "rgba(26,133,167,0.6)", borderRadius: radius.pill,
    paddingVertical: 8, paddingLeft: 14, paddingRight: 10,
  },
  openText: { color: "#fff", fontFamily: fonts.bodyMedium, fontSize: 12 },

  credit: {
    position: "absolute", right: spacing.md, bottom: spacing.sm,
    color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 10,
  },

  // Archival: black field, whole photograph, no gradient. The credit sits UNDER it as a caption
  // rather than floating in a corner — for a documentary photograph the caption is part of the
  // picture's meaning, not decoration on top of it.
  archival: {
    borderRadius: radius.lg, overflow: "hidden", backgroundColor: "#000",
    borderWidth: 1, borderColor: colors.line, justifyContent: "center",
  },
  archivalImg: { width: "100%", height: "100%" },
  archivalCredit: {
    color: colors.muted, fontFamily: fonts.body, fontSize: 11, lineHeight: 17,
    marginTop: spacing.sm, maxWidth: 640,
  },

  sources: {
    borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.lg, marginTop: spacing.lg,
  },
  sourcesLabel: {
    color: colors.gold, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase", marginBottom: spacing.sm,
  },
  sourcesText: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, lineHeight: 20 },

  back: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingVertical: spacing.sm },
  backText: {
    color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
