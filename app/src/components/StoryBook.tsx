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
//
// AND IT IS NARRATED IN THE READER'S LANGUAGE (SP-115). The book is the one reading that shows the
// story's machine drafts (`story-drafts.data.ts`), labelled as drafts, and Listen reads the page in
// the language its text is actually in.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Screen, Icon } from "../ui";
import { PressScale, useReducedMotion } from "./Motion";
import { Book, PaperPage, NavButton, bookStyles, BOOK_UI, DraftNote } from "./Book";
import { LanguagePicker } from "./LanguagePicker";
import { useTts } from "../services/tts";
import { placeById } from "../content/places";
import { placeImage } from "../content/place-images";
import { nationalDays } from "../content/national-days";
import { storySpreads, type StorySpread } from "../content/story-book";
import { storyText, panelText } from "../content/story-drafts";
import type { Story, StoryPanel } from "../content/stories";
import type { ContentRef } from "../content/topic-links";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { t, deviceLikelySupports, type Resolved } from "../i18n";
import type { LangCode } from "../i18n/languages";

// Chrome, unreviewed like the rest of the story screen's strings; `t()` falls back to English.
const UI = {
  begin: {
    en: "Turn the page to begin", tn: "Fetola tsebe go simolola", af: "Blaai om te begin", zu: "Phenya ikhasi ukuze uqale", xh: "Guqula iphepha ukuze uqale",
    nso: "Fetola letlakala go thoma", st: "Fetola leqephe ho qala", ss: "Phendvula likhasi kute ucale", ts: "Hundzuluxa tluka ku sungula", nr: "Phenya ikhasi bona uthome", ve: "Shandukisani siaṱari u thoma",
  },
  // Said only when the voice about to read is the device's own and it is unlikely to have this
  // language — true of all nine indigenous languages until a Botlhale key is configured. Honest
  // rather than silent: a reader should know why Setswana may sound like English.
  deviceVoice: {
    en: "No voice for this language yet — your device will try, and may not pronounce it well.",
    tn: "Ga go ise go nne le lentswe la puo e — sedirisiwa sa gago se tla leka, mme se ka nna sa se e bitse sentle.",
    af: "Nog geen stem vir hierdie taal nie — jou toestel sal probeer, maar spreek dit dalk nie goed uit nie.",
    zu: "Alikabikho izwi lalolu limi — idivayisi yakho izozama, kodwa ingase ingaluphimisi kahle.",
    xh: "Akukabikho lizwi lolu lwimi — isixhobo sakho siza kuzama, kodwa sinokungaluphimisi kakuhle.",
    nso: "Ga go sa na lentšu la polelo ye — sedirišwa sa gago se tla leka, eupša se ka no se e bitše gabotse.",
    st: "Ha ho so be le lentswe la puo ena — sesebediswa sa hao se tla leka, empa se ka nna sa se e bitse hantle.",
    ss: "Kute livi lalolulwimi okwamanje — sisetjentiswa sakho sitawetama, kodvwa singahle singaluphimisi kahle.",
    ts: "A ku si va na rito ra ririmi leri — xitirhisiwa xa wena xi ta ringeta, kambe xi nga ha ri vitani kahle.",
    nr: "Alikabikho ilizwi lelimi leli — isisetjenziswa sakho sizokulinga, kodwana singahle singalibizi kuhle.",
    ve: "A hu athu vha na ipfi ḽa luambo ulu — tshishumiswa tshaṋu tshi ḓo lingedza, fhedzi tshi nga si lu bule zwavhuḓi.",
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
  onLangChange,
  country,
  chooser,
}: {
  story: Story;
  lang: LangCode;
  onBack: () => void;
  onOpenRef: (ref: ContentRef) => void;
  /** The story is immersive — the shell's chrome, and its language picker, are hidden — so the
   *  book carries its own, as the literary Reader does. */
  onLangChange: (l: LangCode) => void;
  country?: string;
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

  // ── Narration (SP-115) ────────────────────────────────────────────────────────────────────────
  // The same `useTts` as the literary Reader: ElevenLabs for English and Afrikaans, Botlhale for the
  // nine indigenous languages once it has a key, the device voice beneath both. Nothing here
  // chooses an engine, so nothing here can send an indigenous language to ElevenLabs.
  const tts = useTts();
  const narration = narrationFor(spreads[index], story, lang);
  // A page turn, a language change or leaving the book all silence it: never keep reading a
  // passage that is no longer on the page. Switching reading unmounts the book, which stops too.
  useEffect(() => {
    tts.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, lang]);
  useEffect(
    () => () => tts.stop(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // Honest about the voice. `narration.lang` is the language the text is actually IN, so a page
  // that fell back to English is read — and judged — as English.
  const weakVoice = tts.providerFor(narration.lang) === "device" && !deviceLikelySupports(narration.lang);

  return (
    <Screen tone="dark" scroll={false} padded={false}>
      <View style={s.root}>
        <View style={s.topBar}>
          <PressScale style={s.back} onPress={onBack} accessibilityLabel="Back">
            <Icon.ChevronLeft size={18} color={colors.muted} strokeWidth={2.2} />
            <Text style={s.backText}>Back</Text>
          </PressScale>
          <View style={s.controls}>
            <LanguagePicker lang={lang} onChange={onLangChange} compact country={country} />
            <Pressable
              onPress={() => (tts.speaking ? tts.stop() : tts.speak(narration.text, narration.lang))}
              style={[s.listenBtn, tts.speaking && s.listenBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={tts.speaking ? t(BOOK_UI.stopListen, lang) : t(BOOK_UI.listen, lang)}
            >
              {tts.speaking ? (
                <Icon.Square size={12} color={colors.night} fill={colors.night} />
              ) : (
                <Icon.Volume2 size={14} color={colors.sand} />
              )}
              <Text style={[s.listenText, tts.speaking && s.listenTextActive]}>
                {tts.speaking ? t(BOOK_UI.stopListen, lang) : t(BOOK_UI.listen, lang)}
              </Text>
            </Pressable>
            {chooser}
          </View>
        </View>
        {weakVoice ? <Text style={s.voiceNote}>{t(UI.deviceVoice, lang)}</Text> : null}

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

/** What Listen reads on a spread, in reading order, and the language it is in.
 *
 *  ONE LANGUAGE PER UTTERANCE. The anchor is the passage — the body, or the standfirst — and a
 *  line that resolved to a different language (a kicker with no draft, say) is left out rather
 *  than read in the wrong voice. The sources page is citations and stays English. */
function narrationFor(spread: StorySpread, story: Story, lang: LangCode): { text: string; lang: LangCode } {
  const say = (parts: Resolved[]) => {
    const anchor = parts[parts.length - 1];
    const text = parts
      .filter((p) => p.lang === anchor.lang)
      .map((p) => p.text.trim().replace(/[.:]$/, ""))
      .join(". ");
    return { text: `${text}.`, lang: anchor.lang };
  };
  if (spread.kind === "title") return say([storyText(story, "title", lang), storyText(story, "standfirst", lang)]);
  if (spread.kind === "sources") return { text: story.sources, lang: "en" };
  const { panel } = spread;
  return say([
    panelText(story, panel, "kicker", lang),
    panelText(story, panel, "headline", lang),
    panelText(story, panel, "body", lang),
  ]);
}

/** The title and standfirst in the reader's language, with the draft note when they are drafts. */
function TitleBlock({ story, lang }: { story: Story; lang: LangCode }) {
  const title = storyText(story, "title", lang);
  const standfirst = storyText(story, "standfirst", lang);
  return (
    <View style={s.titlePage}>
      <Text style={s.titleText}>{title.text}</Text>
      <View style={s.rule} />
      <Text style={s.standfirst}>{standfirst.text}</Text>
      <DraftNote status={standfirst.status} lang={lang} />
    </View>
  );
}

// ── Verso: the picture, or the quiet page where there is none ─────────────────────────────────────

function LeftPage({ spread, story, i, lang }: { spread: StorySpread; story: Story; i: number; lang: LangCode }) {
  const pageNo = i * 2 + 1;
  if (spread.kind === "title") {
    return (
      <PaperPage side="left">
        <TitleBlock story={story} lang={lang} />
      </PaperPage>
    );
  }
  if (spread.kind === "sources") {
    return (
      <PaperPage side="left" pageNo={pageNo}>
        <View style={s.ornamentPage}>
          <Text style={s.colophon}>{storyText(story, "title", lang).text}</Text>
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
          <Text style={s.ornament}>{panelText(story, panel, "kicker", lang).text}</Text>
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
          {single ? <TitleBlock story={story} lang={lang} /> : null}
          <PressScale style={s.begin} onPress={onBegin} accessibilityLabel={t(UI.begin, lang)}>
            <Text style={s.beginText}>{t(UI.begin, lang)}</Text>
            <Icon.ChevronRight size={14} color={RUST} />
          </PressScale>
        </View>
      </PaperPage>
    );
  }

  if (spread.kind === "sources") {
    // Citations stay in English: a source is named as it was published.
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
  const kicker = panelText(story, panel, "kicker", lang);
  const headline = panelText(story, panel, "headline", lang);
  const body = panelText(story, panel, "body", lang);
  return (
    <PaperPage side={side} pageNo={pageNo}>
      {single && spread.kind === "place" ? <PlacePlate panel={panel} mini /> : null}
      {single && spread.kind === "archival" ? <ArchivalPlate panel={panel} mini /> : null}
      <Text style={s.kicker}>{kicker.text}</Text>
      <Text style={bookStyles.pageTitle}>{headline.text}</Text>
      <ScrollView style={bookStyles.pageScroll} contentContainerStyle={{ paddingBottom: spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={bookStyles.ink}>
          <Text style={bookStyles.inkDrop}>{body.text.slice(0, 1)}</Text>
          {body.text.slice(1)}
        </Text>
        <DraftNote status={body.status} lang={lang} />
        {panel.ref ? (
          <PressScale
            style={s.open}
            onPress={() => onOpenRef(panel.ref as ContentRef)}
            accessibilityLabel={`${headline.text} — ${t(UI.readOn, lang)}`}
          >
            <Text style={s.openText}>{t(UI.readOn, lang)}</Text>
            <Icon.ChevronRight size={14} color={RUST} />
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
  controls: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: spacing.sm, justifyContent: "flex-end" },
  // The literary Reader's Listen pill, so the two books share one control.
  listenBtn: {
    backgroundColor: colors.scrimStrong, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 14,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", flexDirection: "row", alignItems: "center", gap: 6,
  },
  listenBtnActive: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  listenText: { color: colors.sand, fontFamily: fonts.bodySemi, fontSize: 12 },
  listenTextActive: { color: colors.night },
  voiceNote: {
    color: colors.muted, fontFamily: fonts.body, fontSize: 11, fontStyle: "italic", textAlign: "right", marginTop: 4,
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
