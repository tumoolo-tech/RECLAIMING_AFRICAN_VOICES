import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, radius, type, fonts } from "../theme/tokens";
import { Icon } from "../ui";

// The book — the site's reading convention. Shared by the literary Reader (CinematicReader) and the
// Book reading of a scroll-told story (StoryBook), so both are the same object: the same paper, the
// same spine, the same page turn, the same Back / n of N / Next bar.

/** The book's own chrome, shared so the two books say the same words for the same buttons. */
export const BOOK_UI = {
  prev: {
    en: "Back", tn: "Morago", af: "Terug", zu: "Emuva", xh: "Emva",
    nso: "Morago", st: "Morao", ss: "Emuva", ts: "Endzhaku", nr: "Emuva", ve: "Murahu",
  },
  next: {
    en: "Next", tn: "Pele", af: "Volgende", zu: "Okulandelayo", xh: "Okulandelayo",
    nso: "Tše di latelago", st: "E latelang", ss: "Lokulandzelako", ts: "Leswi landzelaka", nr: "Okulandelako", ve: "Zwi tevhelaho",
  },
};

// ── The book — a turn.js-style flipbook (modelled on the turn.js page-fold behaviour) ───────────────
// Faithful to turn.js's model: a two-page SPREAD around a centre spine (image plate verso, text
// recto), and on a turn the RIGHT leaf rotates a full 180° over the spine — its BACK face carries
// the incoming left page (backfaceVisibility, exactly like turn.js's folded page) — landing to
// reveal the next spread which sits statically underneath. Fold + cast shadow gradients follow the
// leaf, and single-page display (narrow screens) folds with a plain paper backside instead.

export function PaperPage({ side, pageNo, children }: { side: "left" | "right" | "single"; pageNo?: number; children: React.ReactNode }) {
  return (
    <View style={[bookStyles.paper, side === "left" ? bookStyles.paperLeft : side === "right" ? bookStyles.paperRight : bookStyles.paperSingle]}>
      <View style={bookStyles.paperInner}>{children}</View>
      {side !== "single" && (
        <LinearGradient
          colors={side === "left" ? ["rgba(0,0,0,0)", "rgba(70,52,30,0.20)"] : ["rgba(70,52,30,0.20)", "rgba(0,0,0,0)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[bookStyles.gutter, side === "left" ? { right: 0 } : { left: 0 }]}
          pointerEvents="none"
        />
      )}
      {pageNo != null && <Text style={bookStyles.pageNo}>{pageNo}</Text>}
    </View>
  );
}

export function Book({
  index,
  dir,
  wide,
  renderLeft,
  renderRight,
  reduced = false,
}: {
  index: number;
  dir: number;
  wide: boolean;
  renderLeft: (i: number) => React.ReactNode;
  renderRight: (i: number) => React.ReactNode;
  /** The reader has asked for reduced motion: commit the new spread at once, no leaf turns. A page
   *  turn is a large rotation across the whole screen — exactly the kind of motion that setting is
   *  for — and the page still changes, which is all the reader needs from it. */
  reduced?: boolean;
}) {
  // rot: 0 = turn not started, 1 = leaf landed
  const rot = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(index); // the committed spread on the desk
  const [turn, setTurn] = useState<null | { from: number; to: number; fwd: boolean }>(null);

  useEffect(() => {
    if (index === shown) return;
    rot.stopAnimation(); // a rapid second turn finalises the first instantly
    if (reduced) {
      setTurn(null);
      setShown(index);
      return;
    }
    const fwd = dir >= 0;
    setTurn({ from: shown, to: index, fwd });
    rot.setValue(0);
    Animated.timing(rot, { toValue: 1, duration: 600, useNativeDriver: true }).start(({ finished }) => {
      setShown(index);
      if (finished) setTurn(null);
    });
    // shown is captured at turn start; adding it would restart the animation on commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, dir, rot, reduced]);

  // shading, turn.js-style: the lifting face darkens to the fold, the landing face lightens out,
  // and a cast shadow sweeps off the page being uncovered.
  const frontShade = rot.interpolate({ inputRange: [0, 0.5, 0.55, 1], outputRange: [0, 0.6, 0, 0] });
  const backShade = rot.interpolate({ inputRange: [0, 0.45, 0.5, 1], outputRange: [0, 0, 0.6, 0] });
  const castShade = rot.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.45, 0] });

  if (!wide) {
    // single-page display (turn.js display:'single'): the leaf's backside is plain paper
    const desk = turn ? (turn.fwd ? renderRight(turn.to) : renderRight(turn.from)) : renderRight(shown);
    const leafFront = turn ? (turn.fwd ? renderRight(turn.from) : renderRight(turn.to)) : null;
    const rotateY = turn && !turn.fwd
      ? rot.interpolate({ inputRange: [0, 1], outputRange: ["-160deg", "0deg"] })
      : rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-160deg"] });
    const singleShade = turn && !turn.fwd
      ? rot.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.5, 0] })
      : rot.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.5, 0] });
    return (
      <View style={bookStyles.book}>
        <View style={bookStyles.pagesBox}>
          <View style={bookStyles.half}>
            {desk}
            {turn && (
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: castShade }]}>
                <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0)"]} start={{ x: 0, y: 0.5 }} end={{ x: 0.7, y: 0.5 }} style={StyleSheet.absoluteFill} />
              </Animated.View>
            )}
          </View>
          {turn && (
            <Animated.View
              pointerEvents="none"
              style={[bookStyles.leafSingle, { transformOrigin: "left center", transform: [{ perspective: 1600 }, { rotateY }] }]}
            >
              <View style={bookStyles.face}>
                {leafFront}
                <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: singleShade }]}>
                  <LinearGradient colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.55)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
                </Animated.View>
              </View>
              <View style={[bookStyles.face, bookStyles.faceBack]}>
                <LinearGradient colors={["#F3EDDF", "#E7E0CE"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }

  // two-page spread
  const deskLeft = turn ? (turn.fwd ? renderLeft(turn.from) : renderLeft(turn.to)) : renderLeft(shown);
  const deskRight = turn ? (turn.fwd ? renderRight(turn.to) : renderRight(turn.from)) : renderRight(shown);
  const rotateY = turn && !turn.fwd
    ? rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] })
    : rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-180deg"] });

  return (
    <View style={bookStyles.book}>
      <View style={bookStyles.pagesBox}>
        <View style={bookStyles.half}>
          {deskLeft}
          {turn && !turn.fwd && (
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: castShade }]}>
              <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]} start={{ x: 0.3, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
            </Animated.View>
          )}
        </View>
        <View style={bookStyles.half}>
          {deskRight}
          {turn && turn.fwd && (
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: castShade }]}>
              <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0)"]} start={{ x: 0, y: 0.5 }} end={{ x: 0.7, y: 0.5 }} style={StyleSheet.absoluteFill} />
            </Animated.View>
          )}
        </View>
        {turn && (
          <Animated.View
            pointerEvents="none"
            style={[
              bookStyles.leaf,
              turn.fwd ? bookStyles.leafRight : bookStyles.leafLeft,
              {
                transformOrigin: turn.fwd ? "left center" : "right center",
                transform: [{ perspective: 2200 }, { rotateY }],
              },
            ]}
          >
            {/* front of the leaf: the page being lifted */}
            <View style={bookStyles.face}>
              {turn.fwd ? renderRight(turn.from) : renderLeft(turn.from)}
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: frontShade }]}>
                <LinearGradient
                  colors={turn.fwd ? ["rgba(0,0,0,0.05)", "rgba(0,0,0,0.6)"] : ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.05)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            {/* back of the leaf: the incoming page, revealed as it lands (turn.js's folded page) */}
            <View style={[bookStyles.face, bookStyles.faceBack]}>
              {turn.fwd ? renderLeft(turn.to) : renderRight(turn.to)}
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: backShade }]}>
                <LinearGradient
                  colors={turn.fwd ? ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.05)"] : ["rgba(0,0,0,0.05)", "rgba(0,0,0,0.6)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          </Animated.View>
        )}
        <View style={bookStyles.spine} pointerEvents="none" />
      </View>
    </View>
  );
}

export function NavButton({
  label,
  onPress,
  disabled,
  dir,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  dir?: "prev" | "next";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[bookStyles.navBtn, disabled && bookStyles.navBtnDisabled]}
    >
      {dir === "prev" && <Icon.ChevronLeft size={16} color={colors.sand} />}
      <Text style={bookStyles.navBtnText}>{label}</Text>
      {dir === "next" && <Icon.ChevronRight size={16} color={colors.sand} />}
    </Pressable>
  );
}

export const bookStyles = StyleSheet.create({
  // ── the book (turn.js look: paper spread, centre spine, hard cover) ────────────────────────
  book: {
    flex: 1,
    backgroundColor: "#CFC9BA", // the cover peeking around the pages
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  pagesBox: { flex: 1, flexDirection: "row" },
  half: { flex: 1 },
  spine: { position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, marginLeft: -1, backgroundColor: "rgba(70,52,30,0.3)" },
  leaf: { position: "absolute", top: 0, bottom: 0, width: "50%" },
  leafRight: { left: "50%" },
  leafLeft: { left: 0 },
  leafSingle: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
  face: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", backgroundColor: "#F8F4EA" },
  faceBack: { transform: [{ rotateY: "180deg" }] },

  paper: { flex: 1, backgroundColor: "#F8F4EA", overflow: "hidden" },
  paperLeft: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  paperRight: { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  paperSingle: { borderRadius: 8 },
  paperInner: { flex: 1, padding: spacing.lg, paddingBottom: spacing.xl },
  gutter: { position: "absolute", top: 0, bottom: 0, width: 28 },
  pageNo: { position: "absolute", bottom: 9, left: 0, right: 0, textAlign: "center", color: "rgba(60,48,36,0.5)", fontFamily: fonts.serif, fontSize: 11 },

  pageTitle: { color: "#2A231B", fontFamily: fonts.serif, fontSize: 22, lineHeight: 27, marginBottom: spacing.md },
  pageScroll: { flex: 1 },
  ink: { color: "#332A20", fontFamily: fonts.serifBody, fontSize: type.body + 0.5, lineHeight: 27 },
  inkDrop: { fontFamily: fonts.display, fontSize: 44, lineHeight: 27, color: "#8A5A25" },
  inkNote: { color: "rgba(51,42,32,0.55)", fontFamily: fonts.body, fontSize: type.small - 0.5, fontStyle: "italic", marginTop: spacing.md, lineHeight: 16 },

  plate: { flex: 1, borderRadius: 4, overflow: "hidden", backgroundColor: "#E9E2D2", borderWidth: 1, borderColor: "rgba(70,52,30,0.18)" },
  plateMini: { height: 150, borderRadius: 4, overflow: "hidden", backgroundColor: "#E9E2D2", marginBottom: spacing.md, borderWidth: 1, borderColor: "rgba(70,52,30,0.18)" },
  plateCaption: { color: "#4A3E2F", fontFamily: fonts.serifItalic, fontSize: 13, textAlign: "center", marginTop: spacing.sm },
  plateNote: { color: "rgba(60,48,36,0.55)", fontFamily: fonts.body, fontSize: 10.5, textAlign: "center", marginTop: 3, lineHeight: 14 },

  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progress: { color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: type.small },
  navBtn: {
    backgroundColor: colors.scrimStrong,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navBtnDisabled: { opacity: 0.35 },
  navBtnText: { color: colors.sand, fontFamily: fonts.bodySemi, fontSize: type.body },
});
