import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";
import { Module, Lang, Mode } from "../content/types";
import { sceneImageSource } from "../content/images";
import { soundtrackClips } from "../content/soundtrackClips";
import { sharedPlaylist } from "../services/soundtrack";
import { useTts } from "../services/tts";
import { t, resolveText } from "../i18n";
import { draftText } from "../content/drafts";
import { LinearGradient } from "expo-linear-gradient";
import { SceneImage } from "./SceneImage";
import { LanguagePicker } from "./LanguagePicker";
import { Book, PaperPage, NavButton, bookStyles, BOOK_UI, DraftNote } from "./Book";
import { useReducedMotion } from "./Motion";
import { colors, spacing, radius, type, fonts } from "../theme/tokens";
import { Icon } from "../ui";

// The cinematic Reader: full-bleed AI background + scrim + overlaid story text, with
// Child/Adult and Setswana/English toggles and scene navigation. The Phase-0 demo spine.
// The passage sits on a book "page" (spine + paper panel) that FLIPS on Next/Prev, and a clip
// from the shared soundtrack sequence plays underneath at a whisper volume — low enough to read,
// present enough to feel — ducking further whenever the Listen narration is speaking.

// One non-repeating soundtrack sequence shared with the Journeys — reading continues it.
const playlist = sharedPlaylist(soundtrackClips.length);
const READING_VOLUME = 0.12; // a whisper under the text
const DUCKED_VOLUME = 0.03; // under narration, almost silent

// Scene title in the shown language — human-reviewed copy first, then a machine draft (drafts.data.ts),
// else an honest English fallback. Keeps the title in-language alongside the body (which resolves the
// same way), so a translated passage doesn't sit under an English heading.
function sceneTitleText(module: Module, scene: Module["scenes"][number], lang: Lang) {
  return resolveText(scene.title, lang, draftText(module.id, scene.id, "title", lang)).text;
}

const UI = {
  child: {
    en: "Child", tn: "Bana", af: "Kind", zu: "Ingane", xh: "Umntwana",
    nso: "Ngwana", st: "Ngwana", ss: "Umntfwana", ts: "N'wana", nr: "Umntwana", ve: "Ṅwana",
  },
  adult: {
    en: "Adult", tn: "Bagolo", af: "Volwassene", zu: "Omdala", xh: "Omdala",
    nso: "Yo mogolo", st: "E moholo", ss: "Lomdzala", ts: "Lonkulu", nr: "Omdala", ve: "Muhulwane",
  },
  source: {
    en: "Source", tn: "Motswedi", af: "Bron", zu: "Umthombo", xh: "Umthombo",
    nso: "Mothopo", st: "Mohlodi", ss: "Umtfombo", ts: "Xihlovo", nr: "Umthombo", ve: "Tshiko",
  },
  interpretation: {
    en: "AI image — artistic interpretation, not a historical photo.",
    tn: "Setshwantsho sa AI — kakanyo ya botaki, e seng senepe sa hisitori.",
    af: "KI-beeld — artistieke interpretasie, nie 'n historiese foto nie.",
    zu: "Isithombe se-AI — ukuhumusha kobuciko, hhayi isithombe somlando.",
    xh: "Umfanekiso we-AI — utoliko lobugcisa, hayi ifoto yembali.",
    nso: "Seswantšho sa AI — tlhathollo ya bokgabo, e sego senepe sa histori.",
    st: "Setshwantsho sa AI — tlhaloso ya bonono, eseng senepe sa histori.",
    ss: "Sitfombe se-AI — kuhumusha kwebuciko, hhayi sitfombe semlandvo.",
    ts: "Xifaniso xa AI — nhlamuselo ya vutshila, ku nga ri foto ya matimu.",
    nr: "Isithombe se-AI — ukuhlathulula kobuciko, ingasi ifoto yomlando.",
    ve: "Tshifanyiso tsha AI — ṱhalutshedzo ya vhutsila, hu si tshinepe tsha ḓivhazwakale.",
  },
};

export function CinematicReader({
  module,
  lang,
  onLangChange,
  country,
  onBack,
  onArchive,
}: {
  module: Module;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  /** Selected country — orders the language picker to that country's languages. */
  country?: string;
  onBack?: () => void;
  onArchive?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("adult");
  const tts = useTts();
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  const wide = width >= 760; // two-page spread vs single page
  // page-turn direction: +1 turning forward, -1 turning back
  const flipDir = useRef(1);
  const goTo = (next: number) => {
    flipDir.current = next > index ? 1 : -1;
    setIndex(next);
  };

  // ── ambient reading music — the shared clip sequence, at a whisper ───────
  const [ambientClip] = useState(() => soundtrackClips[playlist.next()]);
  const ambient = useAudioPlayer(ambientClip);
  const ambientStatus = useAudioPlayerStatus(ambient);
  const aLoaded = !!ambientStatus?.isLoaded;
  const aDur = ambientStatus?.duration ?? 0;
  const aTime = ambientStatus?.currentTime ?? 0;
  const armedRef = useRef(false);
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!aLoaded) return;
    try {
      ambient.loop = false;
      ambient.volume = READING_VOLUME;
      ambient.play(); // may wait for the reader's first tap on web (autoplay policy)
    } catch {}
  }, [aLoaded, ambient]);
  // duck under the Listen narration so the voice stays clear
  useEffect(() => {
    if (!aLoaded) return;
    try {
      ambient.volume = tts.speaking ? DUCKED_VOLUME : READING_VOLUME;
    } catch {}
  }, [aLoaded, tts.speaking, ambient]);
  // hand off to the next unused clip just before this one ends (web-safe, same as the Journey)
  useEffect(() => {
    if (!aLoaded || !ambientStatus?.playing || !isFinite(aDur) || aDur <= 0) return;
    if (aTime < aDur * 0.5) armedRef.current = true;
    if (armedRef.current && aTime >= aDur - 1) {
      armedRef.current = false;
      try {
        ambient.replace(soundtrackClips[playlist.next()]);
        ambient.play();
      } catch {}
    }
  }, [aLoaded, ambientStatus?.playing, aDur, aTime, ambient]);
  useEffect(() => {
    return () => {
      try {
        ambient.pause();
      } catch {}
    };
  }, [ambient]);

  const scene = module.scenes[index];
  const imageSource = useMemo(
    () => sceneImageSource(module.id, scene.id, scene.imagePrompt, { seed: scene.seed }),
    [module.id, scene]
  );

  // Resolve the passage in the chosen language: human-reviewed copy first, then a pre-generated
  // machine draft (labelled), else an honest English fallback. `bodyRes.lang` is the language the
  // text is ACTUALLY in — we narrate in that, never mislabelling it.
  const field = mode === "child" ? "childText" : "text";
  const bodyLoc = mode === "child" ? scene.childText : scene.text;
  const bodyRes = resolveText(bodyLoc, lang, draftText(module.id, scene.id, field, lang));
  const body = bodyRes.text;

  // Stop narration when the text underneath it changes (scene, language, or reading level),
  // so we never keep reading a passage that's no longer on screen.
  useEffect(() => {
    tts.stop();
  }, [index, lang, mode]);

  return (
    <View style={styles.root}>
      <SceneImage source={imageSource} kenBurns />
      {/* cinematic scrim — legible at top (title) and bottom (nav), image breathes in the middle */}
      <LinearGradient
        colors={["rgba(0,0,0,0.72)", "rgba(0,0,0,0.28)", "rgba(0,0,0,0.9)"]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safe}>
        {/* Top bar: title + language + mode toggles */}
        <View style={styles.topBar}>
          <View style={styles.titleWrap}>
            {onBack && (
              <Pressable onPress={onBack} style={styles.backBtn} hitSlop={10}>
                <Icon.ChevronLeft size={22} color={colors.sand} strokeWidth={2.4} />
              </Pressable>
            )}
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.kicker}>
                {module.title} · {module.author}
              </Text>
              <Text style={styles.sceneTitle}>{sceneTitleText(module, scene, lang)}</Text>
            </View>
          </View>
          <View style={styles.toggles}>
            <LanguagePicker lang={lang} onChange={onLangChange} compact country={country} />
            <Toggle
              options={[
                { key: "adult", label: t(UI.adult, lang) },
                { key: "child", label: t(UI.child, lang) },
              ]}
              value={mode}
              onChange={(v) => setMode(v as Mode)}
            />
            <Pressable
              onPress={() => (tts.speaking ? tts.stop() : tts.speak(body, bodyRes.lang))}
              style={[styles.listenBtn, tts.speaking && styles.listenBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={tts.speaking ? t(BOOK_UI.stopListen, lang) : t(BOOK_UI.listen, lang)}
            >
              {tts.speaking ? (
                <Icon.Square size={12} color={colors.night} fill={colors.night} />
              ) : (
                <Icon.Volume2 size={14} color={colors.sand} />
              )}
              <Text style={[styles.listenText, tts.speaking && styles.listenTextActive]}>
                {tts.speaking ? t(BOOK_UI.stopListen, lang) : t(BOOK_UI.listen, lang)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* The book — paper spread (image plate + text page) with a real page turn */}
        <View style={styles.bookArea}>
          <Book
            index={index}
            dir={flipDir.current}
            wide={wide}
            reduced={reduced}
            renderLeft={(i) => <ImagePage module={module} i={i} lang={lang} />}
            renderRight={(i) => (
              <TextPage module={module} i={i} lang={lang} mode={mode} single={!wide} onArchive={onArchive} />
            )}
          />
        </View>

        {/* Scene nav */}
        <View style={bookStyles.nav}>
          <NavButton
            label={t(BOOK_UI.prev, lang)}
            dir="prev"
            disabled={index === 0}
            onPress={() => goTo(Math.max(0, index - 1))}
          />
          <Text style={bookStyles.progress}>
            {index + 1} / {module.scenes.length}
          </Text>
          <NavButton
            label={t(BOOK_UI.next, lang)}
            dir="next"
            disabled={index === module.scenes.length - 1}
            onPress={() => goTo(Math.min(module.scenes.length - 1, index + 1))}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

// Verso: the scene's illustration as a book plate, with its caption and honest sourcing.
function ImagePage({ module, i, lang }: { module: Module; i: number; lang: Lang }) {
  const scene = module.scenes[i];
  const src = sceneImageSource(module.id, scene.id, scene.imagePrompt, { seed: scene.seed });
  return (
    <PaperPage side="left" pageNo={i * 2 + 1}>
      <View style={bookStyles.plate}>
        <SceneImage source={src} />
      </View>
      <Text style={bookStyles.plateCaption}>{sceneTitleText(module, scene, lang)}</Text>
      <Text style={bookStyles.plateNote}>{t(UI.interpretation, lang)}</Text>
      <Text style={bookStyles.plateNote}>
        {t(UI.source, lang)}: {scene.sourceNote}
      </Text>
    </PaperPage>
  );
}

// Recto: the passage in book type — serif ink on paper, drop cap, page number.
function TextPage({
  module,
  i,
  lang,
  mode,
  single,
  onArchive,
}: {
  module: Module;
  i: number;
  lang: Lang;
  mode: Mode;
  single: boolean;
  onArchive?: () => void;
}) {
  const scene = module.scenes[i];
  const field = mode === "child" ? "childText" : "text";
  const loc = mode === "child" ? scene.childText : scene.text;
  const res = resolveText(loc, lang, draftText(module.id, scene.id, field, lang));
  const text = res.text;
  return (
    <PaperPage side={single ? "single" : "right"} pageNo={single ? i + 1 : i * 2 + 2}>
      {single && (
        <View style={bookStyles.plateMini}>
          <SceneImage source={sceneImageSource(module.id, scene.id, scene.imagePrompt, { seed: scene.seed })} />
        </View>
      )}
      <Text style={bookStyles.pageTitle}>{sceneTitleText(module, scene, lang)}</Text>
      <ScrollView style={bookStyles.pageScroll} contentContainerStyle={{ paddingBottom: spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={bookStyles.ink}>
          <Text style={bookStyles.inkDrop}>{text.slice(0, 1)}</Text>
          {text.slice(1)}
        </Text>
        <DraftNote status={res.status} lang={lang} />
        {single && (
          <Text style={bookStyles.inkNote}>
            {t(UI.interpretation, lang)} · {t(UI.source, lang)}: {scene.sourceNote}
          </Text>
        )}
        {module.archivePrompt && onArchive && (
          <Pressable style={styles.archiveInk} onPress={onArchive} accessibilityRole="button">
            <Icon.Mic size={14} color="#8A5A25" />
            <Text style={styles.archiveInkText}>{t(module.archivePrompt, lang)}</Text>
          </Pressable>
        )}
      </ScrollView>
    </PaperPage>
  );
}

function Toggle({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.toggle}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.toggleItem, active && styles.toggleItemActive]}
          >
            <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  safe: { flex: 1, padding: spacing.lg, justifyContent: "space-between" },
  topBar: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexShrink: 1 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.scrimStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: colors.sand, fontSize: 24, lineHeight: 26, marginTop: -2 },
  kicker: {
    color: colors.gold,
    fontFamily: fonts.bodySemi,
    fontSize: type.small,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sceneTitle: { color: colors.sand, fontFamily: fonts.serif, fontSize: type.title + 5, lineHeight: type.title + 8, marginTop: 3 },
  toggles: { gap: spacing.sm, alignItems: "flex-end" },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.scrimStrong,
    borderRadius: radius.pill,
    padding: 3,
  },
  toggleItem: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radius.pill },
  toggleItemActive: { backgroundColor: "#FFFFFF" },
  toggleText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: type.small },
  toggleTextActive: { color: colors.night },
  listenBtn: {
    backgroundColor: colors.scrimStrong,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  listenBtnActive: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  listenText: { color: colors.sand, fontFamily: fonts.bodySemi, fontSize: type.small },
  listenTextActive: { color: colors.night },
  bookArea: { flex: 1, marginVertical: spacing.md, width: "100%", maxWidth: 1000, alignSelf: "center" },
  archiveInk: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.md, alignSelf: "flex-start" },
  archiveInkText: { color: "#8A5A25", fontFamily: fonts.bodySemi, fontSize: type.small },
});
