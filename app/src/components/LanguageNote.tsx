// "You are reading English because we have not translated this yet."
//
// The app offers eleven languages on every screen. The UI chrome honours that; most CONTENT does
// not. Two screens already say so when they fall back — CinematicReader and WatchItemScreen, via
// `resolveText`'s "fallback" status. Every other content surface fell back silently, which is the
// app quietly implying a translation exists.
//
// This is the shared note for surfaces whose content is plain English prose rather than a
// `Localized` value, so `resolveText` cannot speak for them — places being the first (SP-015 keeps
// sourced historical prose in one language on purpose).
//
// It deliberately does NOT promise a translation is coming. For nine of the eleven languages
// content coverage is currently zero, and "coming soon" on a screen that has said so for a year is
// its own small dishonesty. Run `npm run check:languages` for the real numbers.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, fonts } from "../theme/tokens";
import { t } from "../i18n";
import type { LangCode } from "../i18n/languages";

const UI = {
  englishOnly: {
    en: "Shown in English — not yet translated",
    tn: "E bontshitswe ka Sekgoa — ga e ise e ranolwe",
    af: "In Engels getoon — nog nie vertaal nie",
    zu: "Iboniswa ngesiNgisi — ayikahunyushwa",
    xh: "Iboniswa ngesiNgesi — ayikaguqulelwa",
    nso: "E bontšhitšwe ka Seisemane — ga se ya fetolelwa",
    st: "E bontšhitswe ka Senyesemane — ha e so fetolelwe",
    ss: "Ikhonjiswa ngeSingisi — ayikahunyushwa",
    ts: "Yi kombisiwa hi Xinghezi — a yi si hundzuluxiwa",
    nr: "Iboniswa ngesiNgisi — ayikatjhugululwa",
    ve: "I sumbedzwa nga Luisimane — a i athu ṱalutshedzelwa",
  },
};

/** Renders nothing for an English reader — there is nothing to disclose. */
export function LanguageNote({ lang }: { lang: LangCode }) {
  if (lang === "en") return null;
  return (
    <View style={s.wrap} accessibilityRole="text">
      <Text style={s.text}>{t(UI.englishOnly, lang)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  text: { color: colors.muted, fontFamily: fonts.body, fontSize: 11 },
});
