// A scroll-told story, read as a BOOK — the app's reading convention, and the default way a story
// opens (SP-114).
//
// The literary modules are read in `CinematicReader`: a paper spread, a plate on the left, the
// passage on the right, a page turn between, Back / n of N / Next below. This is the same object —
// the same `Book`, `PaperPage` and `NavButton` from `Book.tsx` — so a reader who has opened Mhudi
// already knows how to read Sixteen June. The two scroll readings remain one tap away.
//
// Every rule the scroll readings keep, this keeps too:
//   - the photograph, credit and licence come from the place record, never from the story (SP-100);
//   - the credit sits on the page with its photograph, not at the back of the book (SP-087);
//   - Sam Nzima's photograph is shown WHOLE on a dark plate — `contain`, never cropped, never
//     darkened, nothing laid over it — with its caption directly under it (SP-101, SP-109);
//   - a typographic beat borrows no picture; its left page is left quiet on purpose.

import React, { useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Screen, Icon } from "../ui";
import { PressScale, useReducedMotion } from "./Motion";
import { Book, PaperPage, NavButton, bookStyles, BOOK_UI } from "./Book";
import { placeById } from "../content/places";
import { placeImage } from "../content/place-images";
import { nationalDays } from "../content/national-days";
import { storySpreads, type StorySpread } from "../content/story-book";
import type { Story, StoryPanel } from "../content/stories";
import type { ContentRef } from "../content/topic-links";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";

// Chrome, unreviewed like the rest of the story screen's strings; `t()` falls back to English.
const UI = {
  begin: {
    en: "Turn the page to begin", tn: "Fetola tsebe go simolola", af: "Blaai om te begin", zu: "Phenya ikhasi ukuze uqale", xh: "Guqula iphepha ukuze uqale",
    nso: "Fetola letlakala go thoma", st: "Fetola leqephe ho qala", ss: "Phendvula likhasi kute ucale", ts: "Hundzuluxa tluka ku sungula", nr: "Phenya ikhasi bona uthome", ve: "Shandukisani siaṱari u thoma",
  },
  readOn: {
    en: "Open this place", tn: "Bula lefelo le", af: "Open hierdie plek", zu: "Vula le ndawo", xh: "Vula le ndawo",
    nso: "Bula lefelo le", st: "Bula sebaka sena", ss: "Vula lendzawo", ts: "Pfula ndhawu leyi", nr: "Vula le ndawo", ve: "Vula hafha fhethu",
  },
  sources: {
    en: "Where this comes from", tn: "Se se tswang kae", af: "Waar dit vandaan kom", zu: "Lapha kuvela khona", xh: "Apho oku kuvela khona",
    nso: "Moo se tšwago gona", st: "Moo sena se tswang teng", ss: "Lapho loku lokuvela khona", ts: "Laha swi humaka kona", nr: "Lapha lokhu okuvela khona", ve: "Hune zwa bva hone",
  },
};

const archivalDay = (dayId: string) => {
  const d = nationalDays.find((x) => x.id === dayId);
  return d?.image && d.imageCredit ? d : undefined;
};

export function StoryBook({
  story,
  lang,
  onBack,
  onOpenRef,
  chooser,
}: {
  story: Story;
  lang: LangCode;
  onBack: () => void;
  onOpenRef: (ref: ContentRef) => void;
  /** The reading switcher (Book / Scroll / In the place), owned by the story screen. Shown in the
   *  top bar so the reading can be changed from any page, not only the first. */
  chooser: React.ReactNode;
}) {
  const spreads = useMemo(() => storySpreads(story, (id) => !!archivalDay(id)), [story]);
  const [index, setIndex] = useState(0);
  const flipDir = useRef(1);
  const goTo = (next: number) => {
    flipDir.current = next > index ? 1 : -1;
    setIndex(next);
  };
  const { width } = useWindowDimensions();
  const wide = width >= 760; // the same threshold as the literary Reader
  const reduced = useReducedMotion();
  const last = spreads.length - 1;

  return (
    <Screen tone="dark" scroll={false} padded={false}>
      <View style={s.root}>
        <View style={s.topBar}>
          <PressScale style={s.back} onPress={onBack} accessibilityLabel="Back">
            <Icon.ChevronLeft size={18} color={colors.muted} strokeWidth={2.2} />
            <Text style={s.backText}>Back</Text>
          </PressScale>
          {chooser}
        </View>

        <View style={s.bookArea}>
          <Book
            index={index}
            dir={flipDir.current}
            wide={wide}
            reduced={reduced}
            renderLeft={(i) => <LeftPage spread={spreads[i]} story={story} i={i} lang={lang} />}
            renderRight={(i) => (
              <RightPage
                spread={spreads[i]}
                story={story}
                i={i}
                lang={lang}
                single={!wide}
                onOpenRef={onOpenRef}
                onBegin={() => goTo(1)}
              />
            )}
          />
        </View>

        <View style={bookStyles.nav}>
          <NavButton label={t(BOOK_UI.prev, lang)} dir="prev" disabled={index === 0} onPress={() => goTo(Math.max(0, index - 1))} />
          <Text style={bookStyles.progress}>
            {index + 1} / {spreads.length}
          </Text>
          <NavButton label={t(BOOK_UI.next, lang)} dir="next" disabled={index === last} onPress={() => goTo(Math.min(last, index + 1))} />
        </View>
      </View>
    </Screen>
  );
}

// ── Verso: the picture, or the quiet page where there is none ─────────────────────────────────────

function LeftPage({ spread, story, i, lang }: { spread: StorySpread; story: Story; i: number; lang: LangCode }) {
  const pageNo = i * 2 + 1;
  if (spread.kind === "title") {
    return (
      <PaperPage side="left">
        <View style={s.titlePage}>
          <Text style={s.titleText}>{story.title}</Text>
          <View style={s.rule} />
          <Text style={s.standfirst}>{story.standfirst}</Text>
        </View>
      </PaperPage>
    );
  }
  if (spread.kind === "sources") {
    return (
      <PaperPage side="left" pageNo={pageNo}>
        <View style={s.ornamentPage}>
          <Text style={s.colophon}>{story.title}</Text>
        </View>
      </PaperPage>
    );
  }
  const { panel } = spread;
  return (
    <PaperPage side="left" pageNo={pageNo}>
      {spread.kind === "place" ? (
        <PlacePlate panel={panel} />
      ) : spread.kind === "archival" ? (
        <ArchivalPlate panel={panel} />
      ) : (
        // A typographic beat: no picture, and none borrowed. The kicker, set large, marks the page.
        <View style={s.ornamentPage}>
          <View style={s.rule} />
          <Text style={s.ornament}>{panel.kicker}</Text>
          <View style={s.rule} />
        </View>
      )}
    </PaperPage>
  );
}

/** A place's own photograph as a book plate, with its name and — a licence obligation, not a
 *  caption — its credit and licence (SP-087). Everything here comes from the place record. */
function PlacePlate({ panel, mini }: { panel: StoryPanel; mini?: boolean }) {
  const place = panel.placeId ? placeById(panel.placeId) : undefined;
  const img = placeImage(place?.image?.file);
  if (!img) return null; // never a substitute picture (SP-111)
  return (
    <>
      <View style={mini ? bookStyles.plateMini : bookStyles.plate}>
        <ExpoImage source={img} style={StyleSheet.absoluteFill} contentFit="cover" transition={260} cachePolicy="disk" />
      </View>
      {!mini && place ? <Text style={bookStyles.plateCaption}>{place.name}</Text> : null}
      {place?.image ? (
        <Text style={bookStyles.plateNote}>
          {place.image.credit} · {place.image.licence}
        </Text>
      ) : null}
    </>
  );
}

/** Sam Nzima's photograph (SP-102). Evidence rather than scenery: shown whole on a dark plate, never
 *  cropped and never darkened, with its caption directly under it so the record never appears
 *  without saying whose it is and who is in it (SP-101, SP-109). */
function ArchivalPlate({ panel, mini }: { panel: StoryPanel; mini?: boolean }) {
  const day = panel.dayId ? archivalDay(panel.dayId) : undefined;
  if (!day) return null;
  return (
    <>
      <View style={[mini ? bookStyles.plateMini : bookStyles.plate, s.archivalPlate, mini ? s.archivalMini : null]}>
        <ExpoImage
          source={day.image}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          transition={260}
          cachePolicy="disk"
          accessibilityLabel={day.imageCredit}
        />
      </View>
      <Text style={s.archivalCredit}>{day.imageCredit}</Text>
    </>
  );
}

// ── Recto: the words ──────────────────────────────────────────────────────────────────────────────

function RightPage({
  spread,
  story,
  i,
  lang,
  single,
  onOpenRef,
  onBegin,
}: {
  spread: StorySpread;
  story: Story;
  i: number;
  lang: LangCode;
  single: boolean;
  onOpenRef: (ref: ContentRef) => void;
  onBegin: () => void;
}) {
  const side = single ? "single" : "right";
  const pageNo = single ? i + 1 : i * 2 + 2;

  if (spread.kind === "title") {
    return (
      <PaperPage side={side}>
        <View style={s.beginPage}>
          {/* On a single page there is no verso, so the title comes over to this side. */}
          {single ? (
            <>
              <Text style={s.titleText}>{story.title}</Text>
              <View style={s.rule} />
              <Text style={s.standfirst}>{story.standfirst}</Text>
            </>
          ) : null}
          <PressScale style={s.begin} onPress={onBegin} accessibilityLabel={t(UI.begin, lang)}>
            <Text style={s.beginText}>{t(UI.begin, lang)}</Text>
            <Icon.ChevronRight size={14} color="#8A5A25" />
          </PressScale>
        </View>
      </PaperPage>
    );
  }

  if (spread.kind === "sources") {
    return (
      <PaperPage side={side} pageNo={pageNo}>
        <Text style={s.sourcesLabel}>{t(UI.sources, lang)}</Text>
        <ScrollView style={bookStyles.pageScroll} showsVerticalScrollIndicator={false}>
          <Text style={s.sourcesText}>{story.sources}</Text>
        </ScrollView>
      </PaperPage>
    );
  }

  const { panel } = spread;
  return (
    <PaperPage side={side} pageNo={pageNo}>
      {single && spread.kind === "place" ? <PlacePlate panel={panel} mini /> : null}
      {single && spread.kind === "archival" ? <ArchivalPlate panel={panel} mini /> : null}
      <Text style={s.kicker}>{panel.kicker}</Text>
      <Text style={bookStyles.pageTitle}>{panel.headline}</Text>
      <ScrollView style={bookStyles.pageScroll} contentContainerStyle={{ paddingBottom: spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={bookStyles.ink}>
          <Text style={bookStyles.inkDrop}>{panel.body.slice(0, 1)}</Text>
          {panel.body.slice(1)}
        </Text>
        {panel.ref ? (
          <PressScale
            style={s.open}
            onPress={() => onOpenRef(panel.ref as ContentRef)}
            accessibilityLabel={`${panel.headline} — ${t(UI.readOn, lang)}`}
          >
            <Text style={s.openText}>{t(UI.readOn, lang)}</Text>
            <Icon.ChevronRight size={14} color="#8A5A25" />
          </PressScale>
        ) : null}
      </ScrollView>
    </PaperPage>
  );
}

const INK = "#2A231B";
const RUST = "#8A5A25";

const s = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, justifyContent: "space-between" },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: spacing.sm,
  },
  back: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: spacing.sm },
  backText: {
    color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  // The same measure as the literary Reader's book.
  bookArea: { flex: 1, marginVertical: spacing.md, width: "100%", maxWidth: 1000, alignSelf: "center" },

  titlePage: { flex: 1, justifyContent: "center" },
  titleText: { color: INK, fontFamily: fonts.display, fontSize: 40, lineHeight: 44 },
  standfirst: { color: "#4A3E2F", fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 25 },
  rule: { width: 48, height: 2, backgroundColor: RUST, marginVertical: spacing.md, opacity: 0.7 },
  beginPage: { flex: 1, justifyContent: "center" },
  begin: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.lg, alignSelf: "flex-start" },
  beginText: { color: RUST, fontFamily: fonts.bodySemi, fontSize: 14 },

  ornamentPage: { flex: 1, justifyContent: "center", alignItems: "center" },
  ornament: {
    color: RUST, fontFamily: fonts.serifItalic, fontSize: 26, lineHeight: 34, textAlign: "center",
    paddingHorizontal: spacing.md,
  },
  colophon: { color: "rgba(60,48,36,0.55)", fontFamily: fonts.serifItalic, fontSize: 16, textAlign: "center" },

  kicker: {
    color: RUST, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.6,
    textTransform: "uppercase", marginBottom: spacing.xs,
  },
  open: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.md, alignSelf: "flex-start" },
  openText: { color: RUST, fontFamily: fonts.bodySemi, fontSize: 13 },

  // Dark behind the record so a letterboxed photograph reads as whole, not as a cropped plate.
  archivalPlate: { backgroundColor: "#111", borderRadius: radius.sm },
  archivalMini: { height: 200 },
  archivalCredit: {
    color: "#4A3E2F", fontFamily: fonts.body, fontSize: 11.5, lineHeight: 17,
    textAlign: "center", marginTop: spacing.sm,
  },

  sourcesLabel: {
    color: RUST, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase", marginBottom: spacing.sm,
  },
  sourcesText: { color: "#4A3E2F", fontFamily: fonts.body, fontSize: 12.5, lineHeight: 20 },
});
