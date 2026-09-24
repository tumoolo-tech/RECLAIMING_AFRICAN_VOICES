// A story told by scrolling — the shape Tumo asked for, pointing at the Rockstar GTA VI page.
//
// WHAT THAT PAGE ACTUALLY DOES, having looked at it: full-bleed art roughly a screen tall, a small
// uppercase kicker over a large display headline, one or two lines of body, text alternating left
// and right, and a lot of black between panels so each reads as a card floating on nothing. A
// sticky minimal header. It is NOT scroll-jacking or parallax — the effect comes from scale and
// restraint, which is also what makes it portable to a phone.
//
// SO THE MOTION IS DELIBERATELY MODEST, AND ALMOST ALL OF IT IS DRIVEN BY THE SCROLL ITSELF —
// never by a timer, never by taking the scroll away from the reader. Five things move, in order of
// how much they matter:
//
//   1. each panel FADES in as it enters view (`RevealOnScroll`), eased so it settles rather than
//      arriving at a constant rate and stopping dead
//   2. within a panel, the kicker, the headline and the body fade a beat apart (`Stagger`), so the
//      panel assembles in the order it is meant to be read instead of appearing as one slab
//   3. the title card fades out as the first photograph arrives
//   4. a 2px rule along the bottom edge fills as the story is read — a scroll-told story otherwise
//      gives no clue how long it is
//
// Every one of them is an interpolation of scroll position against a measured layout, so nothing
// is sticky, nothing is hijacked, and web, Android and iOS behave identically.
//
// NOTHING SCROLL-DRIVEN ON THIS SCREEN MOVES ANYTHING. It only fades things. That is the whole
// design rule and it was arrived at the hard way, in three passes, all of which Tumo could see and
// none of which a profiler would have found:
//
//   The browser scrolls this container on the compositor, flawlessly. Anything whose POSITION is
//   computed from the scroll value is computed on the main thread instead, from a number that is
//   at best a moment late — and `react-native-web` implements `scrollEventThrottle` as
//   `Date.now() - lastTick >= throttle`, so at the conventional 16 a 120Hz display or a precision
//   trackpad has every other event DROPPED. So the background moved perfectly and the thing on top
//   of it moved in uneven steps, and the reader sees the difference between them. First as a
//   photograph shivering inside its own frame (the parallax, now deleted), then as panels
//   juddering as they arrived (the rise, now gone too).
//
//   An opacity that is a frame late is invisible, because nothing about where anything IS depends
//   on it. There is no reference against which to notice it.
//
// So: fade things in, do not move them in. It costs a flourish and buys a story that cannot judder
// by construction. The two exceptions are both timer-driven with the page standing still, and have
// nothing to be out of step with — the title card's entrance and the "Scroll" cue's bob.
//
// THE ONE TIMER IS THE "SCROLL" CUE under the title, and it has to be: it speaks to a reader who
// has not scrolled, and a scroll-driven hint would be motionless at exactly that moment. It stops
// on the first scroll and never returns.
//
// A READER CAN TURN ALL OF IT OFF, and thousands will. Parallax and rise-on-scroll are the textbook
// triggers for vestibular symptoms, so every effect here is gated on the operating system's
// reduced-motion setting — `prefers-reduced-motion` on web, the OS toggle on Android and iOS.
// Switched on, the story is the same photographs and the same prose, held still. That is a
// requirement (Accessibility & Inclusivity), not a refinement. Each effect also has a defined way
// to NOT animate for its own reasons — unmeasured layout, no scroll yet, already read — and every
// one of them ends in visible content. See `Motion.tsx`.
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
import { View, Text, StyleSheet, Animated, useWindowDimensions, StyleProp, ViewStyle } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Screen, Icon } from "../ui";
import {
  PressScale, RevealOnScroll, Stagger, Reveal, Bob,
  Stage, Beat, useStageProgress, useReducedMotion,
} from "./Motion";
import { placeById } from "../content/places";
import { placeImage } from "../content/place-images";
import { nationalDays } from "../content/national-days";
import type { Story, StoryPanel } from "../content/stories";
import type { ContentRef } from "../content/topic-links";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";
import { StoryBook } from "./StoryBook";

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
  // The two ways to read the story. Same nine panels, same photographs, same prose — only the pace
  // and the staging differ, which is why the toggle names a manner of reading rather than a
  // feature. These are chrome, and carry the same unreviewed status as the rest of this block: the
  // locatives are built from the nouns already used in `readOn` above, but no speaker has checked
  // them. `t()` falls back to English honestly wherever one is missing.
  modeLabel: {
    en: "Read it", tn: "E bale", af: "Lees dit", zu: "Yifunde", xh: "Yifunde",
    nso: "E bale", st: "E bale", ss: "Yifundze", ts: "Yi hlaye", nr: "Yifunde", ve: "I vhalani",
  },
  modeBook: {
    en: "Book", tn: "Buka", af: "Boek", zu: "Incwadi", xh: "Incwadi",
    nso: "Puku", st: "Buka", ss: "Incwadzi", ts: "Buku", nr: "Incwadi", ve: "Bugu",
  },
  modeStay: {
    en: "In the place", tn: "Mo lefelong", af: "In die plek", zu: "Endaweni", xh: "Endaweni",
    nso: "Lefelong", st: "Sebakeng", ss: "Endzaweni", ts: "Endhawini", nr: "Endaweni", ve: "Fhethuni",
  },
};

/** The three readings. `book` is the DEFAULT and the app's own convention: the story as a paper
 *  spread with a page turn, the same book the literary modules are read in (`StoryBook`, SP-114).
 *  The two scroll readings follow. `scroll` is the original: the places go past the reader. `stay` holds each
 *  place still for a few screens and lets the story arrive on top of it — Tumo's ask, and the part
 *  of the reference page that actually makes you feel somewhere rather than merely shown something. */
type Mode = "book" | "scroll" | "stay";

/** The reading switcher. Three chips, all always visible — a toggle that hides the option you are
 *  not on makes you guess what the other one does. Rendered on the scroll readings' title card and
 *  in the book's top bar, so every reading can reach every other. */
function ModeChooser({ mode, onChange, lang, compact }: { mode: Mode; onChange: (m: Mode) => void; lang: LangCode; compact?: boolean }) {
  const chips: { key: Mode; label: string }[] = [
    { key: "book", label: t(UI.modeBook, lang) },
    { key: "scroll", label: t(UI.scroll, lang) },
    { key: "stay", label: t(UI.modeStay, lang) },
  ];
  return (
    <View style={compact ? s.modeCompact : null}>
      {compact ? null : <Text style={s.modesLabel}>{t(UI.modeLabel, lang)}</Text>}
      <View style={s.modeRow}>
        {chips.map((c) => {
          const on = c.key === mode;
          return (
            <PressScale
              key={c.key}
              style={[s.modeChip, on ? s.modeChipOn : null]}
              onPress={() => onChange(c.key)}
              accessibilityLabel={c.label}
            >
              <Text style={[s.modeText, on ? s.modeTextOn : null]}>{c.label}</Text>
            </PressScale>
          );
        })}
      </View>
    </View>
  );
}

/** Screens of scroll spent in one place. A photograph earns the longer hold; a typographic beat has
 *  nothing to look at, so holding it as long would just read as a stall. */
const STAGE_SCREENS = { place: 2.4, bare: 1.6 };

/** Where each line lands in a stage's hold. Spread across the first two-thirds, which leaves the
 *  last third with everything present and nothing arriving — the reader simply standing there. That
 *  silence at the end is the part that makes it feel like a place rather than a slideshow. */
const BEATS = { kicker: 0.05, headline: 0.17, body: 0.34, link: 0.54 };

/** The same rhythm, compressed, for a beat with no photograph — and its first two lines do not use
 *  it at all.
 *
 *  A STAGE IS BLANK BEFORE IT IS PINNED. Its progress only starts counting once its top reaches the
 *  top of the viewport, so for the screen's worth of scrolling while it slides up into view, every
 *  beat is still at zero. A held shot can afford that: the photograph is already there, and the
 *  quiet is the arrival. A typographic beat has nothing behind it, so the identical treatment buys
 *  a black screen with a lone rule sliding up it — which is what it looked like, and it reads as a
 *  page that failed to load rather than as a pause.
 *
 *  So on a beat the kicker and the headline are not animated at all: they are simply there, part of
 *  the thing sliding in, and only the body and the link arrive during the hold. The beat announces
 *  itself on the way in and then elaborates, which is also the better reading of it. */
const BEATS_BARE = { kicker: 0, headline: 0, body: 0.14, link: 0.3 };


/** The photograph inside a held shot. Held means held.
 *
 *  This used to push in slowly across the hold — ten percent over two and a half screens — on the
 *  theory that a completely still picture would read as a stuck page. It does not: the frame is
 *  already the still thing and the story arriving on top of it is what tells you the page is alive.
 *  What the slow push actually did was resample the photograph at a slightly different size every
 *  frame, which makes fine detail shimmer, and it did it on the one picture the reader is being
 *  asked to stand and look at for several screens. Nothing moves here now.
 *
 *  The scrim still changes, because an opacity ramp on a flat gradient cannot shimmer and cannot
 *  vibrate — there is no detail in it to resample and nothing of its position to get wrong. */
function StagePhoto({ img }: { img: ReturnType<typeof placeImage> }) {
  return (
    <ExpoImage
      source={img}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      transition={400}
      cachePolicy="disk"
    />
  );
}

/** The scrim over a held shot, deepening as the story lands on it.
 *
 *  At the start of the hold there is no text and no reason to hide any of the photograph. By the
 *  end there are four lines over it and they have to be readable against whatever happens to be in
 *  the frame. Tying the scrim to the same progress that brings the text means the picture is only
 *  ever darkened by exactly as much as the words currently need. */
function StageScrim({ align }: { align: "left" | "right" }) {
  const progress = useStageProgress();
  const opacity = progress === null ? null : progress.interpolate({
    inputRange: [0, BEATS.body, 1],
    outputRange: [0.34, 0.82, 0.88],
    extrapolate: "clamp",
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, opacity === null ? null : { opacity }]} pointerEvents="none">
      <LinearGradient
        colors={["rgba(0,0,0,0.95)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.15)"]}
        start={align === "left" ? { x: 0, y: 0.7 } : { x: 1, y: 0.7 }}
        end={align === "left" ? { x: 1, y: 0 } : { x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

/** A panel as a held shot — the "in the place" reading.
 *
 *  THE ARCHIVAL PANEL IS NOT STAGED, and that is the most important line in this function. A stage
 *  is a full-bleed crop with a headline across it and a scrim over it, which is precisely the three
 *  things SP-101 forbids for Sam Nzima's photograph. There is no version of this mode that gets to
 *  make an exception for the best picture in the story.
 *
 *  So when the story reaches the photograph, this mode stops performing: the panel falls back to
 *  the ordinary rendering — whole on black, undarkened, photographer and subjects and date beneath
 *  it, story text below that. It reads as the story putting the camera down, which is the right
 *  thing for it to do at that moment anyway. */
function StagePanel({
  panel,
  lang,
  scrollY,
  viewportHeight,
  align,
  live,
  liveFromY,
  onOpenRef,
}: {
  panel: StoryPanel;
  lang: LangCode;
  scrollY: Animated.Value;
  viewportHeight: number;
  align: "left" | "right";
  live: boolean;
  liveFromY: number;
  onOpenRef: (ref: ContentRef) => void;
}) {
  const place = panel.placeId ? placeById(panel.placeId) : undefined;
  const img = placeImage(place?.image?.file);
  const day = panel.dayId ? nationalDays.find((d) => d.id === panel.dayId) : undefined;

  // SP-101 / SP-108. Evidence is never staged.
  //
  // The column width goes through `wrapStyle` rather than a wrapper View on purpose: `Panel`
  // measures itself against the scroll offset via `onLayout`, which reports y relative to its
  // parent, so nesting it one level deeper would quietly move it by however much sits above.
  if (day?.image && day.imageCredit) {
    return (
      <Panel
        panel={panel}
        lang={lang}
        scrollY={scrollY}
        viewportHeight={viewportHeight}
        align={align}
        live={live}
        liveFromY={liveFromY}
          onOpenRef={onOpenRef}
        wrapStyle={s.stayColumn}
      />
    );
  }

  const beats = img ? BEATS : BEATS_BARE;

  return (
    <Stage
      scrollY={scrollY}
      viewportHeight={viewportHeight}
      live={live}
      screens={img ? STAGE_SCREENS.place : STAGE_SCREENS.bare}
    >
      <View style={[s.stage, img ? null : s.stageBare, { minHeight: viewportHeight }]}>
        {img ? (
          <>
            <StagePhoto img={img} />
            <StageScrim align={align} />
          </>
        ) : null}

        <View style={[s.stageCopy, align === "right" ? s.stageCopyRight : null, img ? null : s.stageCopyBare]}>
          {/* Present from the moment the stage appears when there is no photograph to look at
              instead — see BEATS_BARE. */}
          {img ? (
            <>
              <Beat from={beats.kicker}>
                <Text style={s.kicker}>{panel.kicker}</Text>
              </Beat>
              <Beat from={beats.headline}>
                <Text style={s.stageHeadline}>{panel.headline}</Text>
              </Beat>
            </>
          ) : (
            <>
              <Text style={s.kicker}>{panel.kicker}</Text>
              <Text style={s.stageHeadline}>{panel.headline}</Text>
            </>
          )}
          <Beat from={beats.body}>
            <Text style={s.stageBody}>{panel.body}</Text>
          </Beat>
          {panel.ref ? (
            <Beat from={beats.link}>
              <PressScale
                style={s.open}
                onPress={() => onOpenRef(panel.ref as ContentRef)}
                accessibilityLabel={`${panel.headline} — ${t(UI.readOn, lang)}`}
              >
                <Text style={s.openText}>{t(UI.readOn, lang)}</Text>
                <Icon.ChevronRight size={14} color={colors.gold} />
              </PressScale>
            </Beat>
          ) : null}
        </View>

        {/* A licence obligation, not a caption (SP-087) — and it is on screen for the whole hold,
            not only while the panel happens to be passing. */}
        {place?.image ? (
          <Text style={s.credit}>
            {place.image.credit} · {place.image.licence}
          </Text>
        ) : null}
      </View>
    </Stage>
  );
}

function Panel({
  panel,
  lang,
  scrollY,
  viewportHeight,
  align,
  live,
  liveFromY,
  onOpenRef,
  wrapStyle,
}: {
  panel: StoryPanel;
  lang: LangCode;
  scrollY: Animated.Value;
  viewportHeight: number;
  align: "left" | "right";
  live: boolean;
  liveFromY: number;
  onOpenRef: (ref: ContentRef) => void;
  /** Merged into the panel's own outermost view. The held reading uses it to give the archival
   *  panel a measure without wrapping it in another View — see the note at the call site. */
  wrapStyle?: StyleProp<ViewStyle>;
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
      <RevealOnScroll
        scrollY={scrollY}
        viewportHeight={viewportHeight}
        live={live}
        liveFromY={liveFromY}
          style={[s.panelWrap, wrapStyle]}
      >
        {/* The photograph and its caption arrive together, with the panel, and are NOT staggered
            apart from each other. For a documentary photograph the caption is part of what the
            picture means — animating the two on separate beats would show the record before it
            says whose it is and who is in it. The story text below may stagger; this may not. */}
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
          <Stagger index={0}>
            <Text style={s.kicker}>{panel.kicker}</Text>
          </Stagger>
          <Stagger index={1}>
            <Text style={s.headline}>{panel.headline}</Text>
          </Stagger>
          <Stagger index={2}>
            <Text style={s.body}>{panel.body}</Text>
          </Stagger>
        </View>
      </RevealOnScroll>
    );
  }

  return (
    <RevealOnScroll
      scrollY={scrollY}
      viewportHeight={viewportHeight}
      live={live}
      liveFromY={liveFromY}
      style={[s.panelWrap, wrapStyle]}
    >
      <View style={[s.panel, { minHeight: img ? height : undefined }]}>
        {img ? (
          <>
            {/* THE PHOTOGRAPH DOES NOT MOVE INSIDE ITS PANEL, and that is the fix, not a
                simplification.

                It used to drift against the scroll and settle out of a slightly wider crop. Both
                were scroll-linked transforms applied on top of a container that the browser is
                already scrolling on the compositor — so the panel moved perfectly and the picture
                inside it moved by however much JavaScript had managed to compute that frame. The
                difference is what the reader sees, and they described it exactly: the image
                vibrating against its own frame.

                The continuous scale was the worse half. Resampling a photograph at a slightly
                different size every frame makes fine detail — railings, brick courses, foliage,
                all of which are in these pictures — crawl and shimmer, and no amount of scheduling
                fixes that because it is a resampling artefact rather than a timing one.

                This is also what the reference page actually does. The note at the top of this file
                says so in its own words: the effect there comes from scale and restraint, and it is
                NOT parallax. The drift was added later and was a mistake. */}
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
          {/* Read order is arrival order. The wrappers carry no style of their own, so alignment —
              including the right-aligned panels — is still decided by `s.copy` above. */}
          <Stagger index={0}>
            <Text style={s.kicker}>{panel.kicker}</Text>
          </Stagger>
          <Stagger index={1}>
            <Text style={s.headline}>{panel.headline}</Text>
          </Stagger>
          <Stagger index={2}>
            <Text style={s.body}>{panel.body}</Text>
          </Stagger>

          {panel.ref ? (
            <Stagger index={3}>
              <PressScale
                style={s.open}
                onPress={() => onOpenRef(panel.ref as ContentRef)}
                accessibilityLabel={`${panel.headline} — ${t(UI.readOn, lang)}`}
              >
                <Text style={s.openText}>{t(UI.readOn, lang)}</Text>
                <Icon.ChevronRight size={14} color={colors.gold} />
              </PressScale>
            </Stagger>
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

  // THE SCROLLER'S OWN BOX, falling back to the window until it has been measured.
  //
  // The two differ by the height of the shell's header — about a hundred pixels the story does not
  // get to draw in — and every panel height, every reveal window and every pinned frame is derived
  // from this, so the difference is between a stage that fits the screen and one whose last line
  // of copy sits just below the fold.
  //
  // MEASURED FROM A WRAPPER, NOT FROM THE SCROLLVIEW, because `onLayout` on `Animated.ScrollView`
  // does not appear to fire. Take that claim with some salt: `onLayout` resolves through
  // `UIManager.measure`, which defers on a `setTimeout`, and background tabs throttle timers to a
  // second or more — so an automated check that reads the value too soon, or with the tab hidden,
  // will report "never fired" whether or not it did. It did report exactly that here, repeatedly,
  // and the only honest conclusion is that this particular fact was not established. The wrapper
  // is the ordinary, well-trodden arrangement either way, and the fallback means a miss costs
  // accuracy rather than correctness.
  const { height: windowHeight } = useWindowDimensions();
  const [boxHeight, setBoxHeight] = useState(0);
  const viewport = boxHeight || windowHeight;
  // Set by the first scroll event that actually arrives — see RevealOnScroll's `live`. The offset
  // it arrived at is kept too: a panel already on screen by then has been seen and must not play
  // an entrance (see RevealOnScroll's `liveFromY`).
  const [live, setLive] = useState(false);
  const [liveFromY, setLiveFromY] = useState(0);
  // For the progress rule. Until the content has been measured it is 0, and the rule renders at
  // zero width — invisible rather than wrong.
  const [contentHeight, setContentHeight] = useState(0);
  // One switch for the whole screen. Read here as well as inside the Motion components because the
  // title card's exit is driven from this file rather than by one of them.
  const reduced = useReducedMotion();

  // Which reading. DEFAULTS TO THE BOOK (SP-114, Tumo, 24 Sep): a story opens the way every other
  // piece of literature in this app opens, as a paper spread with a page turn. The held reading —
  // you arrive somewhere, the picture stops, the words assemble on top of it — was the default
  // before that (SP-108) and is the second chip; the plain scroll is the third.
  //
  // Session state on purpose: no store, no localStorage, nothing written about the reader anywhere.
  // In a scroll reading the toggle lives on the title card, so a reader can only change it from the
  // top and there is no scroll position to preserve. In the book it sits in the top bar, and leaving
  // the book mounts the scroll reading at its top.
  const [mode, setMode] = useState<Mode>("book");
  const stay = mode === "stay";

  // The title card leaves as the first photograph arrives: it fades out over the first two-thirds
  // of a screen. It used to lift 48px as it went, and that is gone for the same reason every other
  // scroll-driven movement on this screen is gone — it was the last thing whose POSITION came from
  // the scroll value, and leaving one behind would have made the rule above a preference rather
  // than a rule.
  //
  // Safe to apply unconditionally, unlike the panel reveals: at scroll position 0 this interpolates
  // to fully opaque, so a value that never moves leaves the card visible rather than hiding it.
  const titleOut = scrollY.interpolate({
    inputRange: [0, viewport * 0.66],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // How far through the story the reader is. The one piece of chrome here, and it earns its place:
  // a scroll-told story hides its own length, so the rule is the only answer to "how much is left".
  // Pinned to the BOTTOM edge — the app shell's nav owns the top strip, where it would be hidden.
  const scrollable = Math.max(1, contentHeight - viewport);
  // SLID, NOT RESIZED. This used to animate `width` from "0%" to "100%", which is a layout
  // property: every scroll frame re-laid-out the rule and repainted the track under it, on the one
  // element that is guaranteed to be on screen for the entire story. A full-width rule translated
  // in from the left looks identical and is compositor-only.
  const progressSlide = scrollY.interpolate({
    inputRange: [0, scrollable],
    outputRange: ["-100%", "0%"],
    extrapolate: "clamp",
  });

  // THE BOOK REPLACES THE SCROLLER rather than living inside it: a book turns pages, it does not
  // scroll, and none of the scroll machinery above has anything to drive. Returned after every hook
  // so switching reading never changes the hook order. Switching to a scroll reading mounts it
  // fresh, at the top, on its title card.
  if (mode === "book") {
    return (
      <StoryBook
        story={story}
        lang={lang}
        onBack={onBack}
        onOpenRef={onOpenRef}
        chooser={<ModeChooser mode={mode} onChange={setMode} lang={lang} compact />}
      />
    );
  }

  return (
    <Screen tone="dark" scroll={false} padded={false}>
      {/* Measures the scrollport for everything below — see the note on `boxHeight`. */}
      <View style={s.fill} onLayout={(e) => setBoxHeight(e.nativeEvent.layout.height)}>
      <Animated.ScrollView
        style={s.fill}
        // The held shots go edge to edge — a place you are standing in does not have a margin. The
        // other reading keeps the centred column, so the two modes differ in structure and not only
        // in timing, and each mode's chrome gets its measure back via `s.stayColumn`.
        contentContainerStyle={stay ? s.contentStay : s.content}
        // 1, NOT 16. On native this is a minimum interval and 16 means "about every frame". On web
        // `react-native-web` implements it as `Date.now() - lastTick >= throttle` — so at 16 a
        // 120Hz display or a precision trackpad, both of which fire scroll about every 8ms, has
        // every other event DROPPED. The scroll container keeps moving on the compositor while
        // anything positioned from this value updates on only some of those frames, so it shifts
        // against its own container in unequal steps. That is what "the image is vibrating" was.
        // At 1 nothing is dropped and every interpolation matches the scroll position it was
        // computed from.
        scrollEventThrottle={1}
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
          const y = e.nativeEvent.contentOffset.y;
          scrollY.setValue(y);
          if (!live) {
            setLiveFromY(y);
            setLive(true);
          }
          // NOTHING ELSE HAPPENS HERE. `setLive` runs once, for the whole life of the screen; the
          // rest of this handler is a single `setValue`. Panels decide for themselves whether they
          // are close enough to be worth animating, by listening to that value — see
          // `useNearViewport`. A version of this handler that also kept a coarse scroll position in
          // React state re-rendered all nine panels every screen, and measured no better than the
          // per-frame cost it was trying to avoid.
        }}
        onContentSizeChange={(_w, h) => setContentHeight(h)}
      >
        {/* In the scroll rather than floating over it: the app shell's nav already owns the top
            strip, and a floating button there is simply hidden behind it. The shell's own nav is
            the persistent way out, so this one is free to scroll away. */}
        <View style={stay ? s.stayColumn : null}>
          <PressScale style={s.back} onPress={onBack} accessibilityLabel="Back">
            <Icon.ChevronLeft size={18} color={colors.muted} strokeWidth={2.2} />
            <Text style={s.backText}>Back</Text>
          </PressScale>
        </View>

        {/* Title card. Deliberately plain — the first photograph should be the first picture a
            reader sees, not a hero competing with it.
            In the held reading it takes a whole screen, which is not decoration: it puts the first
            stage's top at the fold, so the first stage is never partly on screen before the scroll
            goes live and its beats have nothing to pop out of (the same class of bug `liveFromY`
            fixes for the other mode). */}
        <Animated.View
          style={[
            s.title,
            stay ? s.stayColumn : null,
            { minHeight: stay ? viewport : Math.min(viewport * 0.62, 520) },
            reduced ? null : { opacity: titleOut },
          ]}
        >
          {/* The one mount animation in the story, and the only place one is right: the title card
              is on screen before there is any scroll to drive anything. The lines land in reading
              order, which sets the pace for the panels that follow. */}
          <Reveal delay={0}>
            <Text style={s.titleText}>{story.title}</Text>
          </Reveal>
          <Reveal delay={140}>
            <Text style={s.standfirst}>{story.standfirst}</Text>
          </Reveal>

          {/* The choice is offered before the story starts, not buried in a settings screen: it
              changes how the next twenty screens behave, so it belongs where the reader decides to
              begin. The same three chips the book carries in its top bar — see `ModeChooser`. */}
          <Reveal delay={260} style={s.modes}>
            <ModeChooser mode={mode} onChange={setMode} lang={lang} />
          </Reveal>

          {/* The cue lost its word when the mode chips arrived: one of them is already labelled
              "Scroll", and the same word twice within an inch of itself reads as a mistake rather
              than an invitation. The chevron alone says "there is more below", and the label it
              would have carried moves onto the control for anyone reading by screen reader.
              Stops bobbing for good on the first scroll — by then the reader has answered it. */}
          <Reveal delay={420} style={s.scrollHint}>
            <Bob active={!live}>
              <View accessibilityLabel={t(UI.scroll, lang)}>
                <Icon.ChevronDown size={20} color={colors.muted} />
              </View>
            </Bob>
          </Reveal>
        </Animated.View>

        {/* EVERY PANEL IS A DIRECT CHILD OF THE SCROLL CONTENT, and it has to stay that way.
            `RevealOnScroll` and `Stage` both position themselves by comparing the scroll offset to
            their own `onLayout` y — and `onLayout` reports y relative to the PARENT, not the
            scroller. Wrapping these in a grouping View silently offsets every measurement by
            whatever sits above it: done once here, it put the whole story's geometry a title card
            out and rendered a black screen. Panels are keyed by mode instead, which rebuilds them
            on a switch (the two readings measure against completely different geometry, and a
            stage must not inherit a reveal's latched state) without adding a level. */}
        {story.panels.map((p, i) => {
          const common = {
            panel: p,
            lang,
            scrollY,
            viewportHeight: viewport,
            align: (i % 2 === 0 ? "left" : "right") as "left" | "right",
            live,
            liveFromY,
            onOpenRef,
          };
          return stay ? (
            <StagePanel key={`stay-${p.id}`} {...common} />
          ) : (
            <Panel key={`scroll-${p.id}`} {...common} />
          );
        })}

        {/* T4: the story ends on where it came from, in the same scroll rather than a link. */}
        <RevealOnScroll
          scrollY={scrollY}
          viewportHeight={viewport}
          live={live}
          liveFromY={liveFromY}
          style={s.panelWrap}
        >
          <View style={[s.sources, stay ? s.stayColumn : null]}>
            <Text style={s.sourcesLabel}>{t(UI.sources, lang)}</Text>
            <Text style={s.sourcesText}>{story.sources}</Text>
          </View>
        </RevealOnScroll>

        <View style={{ height: spacing.xxl * 2 }} />
      </Animated.ScrollView>
      </View>

      {/* Sibling of the ScrollView, not inside it, so it stays put while the story moves. */}
      <View style={s.progressTrack} pointerEvents="none">
        <Animated.View style={[s.progressRule, { transform: [{ translateX: progressSlide }] }]} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  // The centred column the shell's "page" mode used to supply via `pageInner`. The story owns its
  // scrolling now (App.tsx's OWN_SCROLL), which means it also owns its measure — without this it
  // would go full-bleed to the window on a wide desktop, and a 34px headline over a 1500px-wide
  // photograph is not the same design.
  content: {
    paddingHorizontal: spacing.md, paddingTop: spacing.xxl,
    width: "100%", maxWidth: 1160, alignSelf: "center",
  },
  // The held reading is full-bleed: no padding, no measure, nothing between the photograph and the
  // edge of the screen. Chrome that still needs a measure asks for `stayColumn`.
  contentStay: { paddingTop: spacing.xxl },
  stayColumn: {
    width: "100%", maxWidth: 1160, alignSelf: "center", paddingHorizontal: spacing.md,
  },

  // A held shot fills the screen it is pinned to. No radius and no margin — a rounded corner would
  // draw the frame the mode is trying to make you forget.
  stage: { flex: 1, overflow: "hidden", justifyContent: "flex-end", backgroundColor: "#000" },
  // With a photograph the copy sits along the bottom edge, where it does not cover the subject.
  // With nothing behind it there is no subject to avoid, and bottom-anchored type on an empty
  // screen just looks like it has fallen down — so a beat centres itself in the screen it is given.
  stageBare: { justifyContent: "center" },
  stageCopy: {
    padding: spacing.xl, paddingBottom: spacing.xxl, maxWidth: 680,
    width: "100%", alignSelf: "flex-start",
  },
  stageCopyRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  // No photograph to sit on, so the beat centres itself in the screen it has been given and keeps
  // the gold rule the other mode uses for the same purpose.
  stageCopyBare: {
    alignSelf: "center", maxWidth: 760, borderLeftWidth: 2, borderLeftColor: colors.gold,
  },
  // Bigger than the panel headline: it has a whole screen, and this is the mode where the place is
  // supposed to be overwhelming rather than neat.
  stageHeadline: { color: "#fff", fontFamily: fonts.display, fontSize: 46, lineHeight: 50 },
  stageBody: {
    color: "rgba(255,255,255,0.9)", fontFamily: fonts.body, fontSize: 17, lineHeight: 29,
    marginTop: spacing.md, maxWidth: 620,
  },

  modes: { marginTop: spacing.xl },
  modesLabel: {
    color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase", marginBottom: spacing.sm,
  },
  modeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  modeCompact: { flexShrink: 1 },
  modeChip: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: radius.pill,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  modeChipOn: { borderColor: colors.gold, backgroundColor: "rgba(255,255,255,0.06)" },
  modeText: { color: "rgba(255,255,255,0.7)", fontFamily: fonts.bodyMedium, fontSize: 12 },
  modeTextOn: { color: "#fff" },

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

  // A hairline, not a loading bar: 2px, on a track dark enough to read as part of the black.
  progressTrack: {
    position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",             // clips the rule while it is still slid off to the left
  },
  progressRule: { height: 2, width: "100%", backgroundColor: colors.gold },

  back: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingVertical: spacing.sm },
  backText: {
    color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
