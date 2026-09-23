import React, { useContext, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Platform, Pressable, StyleProp, ViewStyle } from "react-native";
import { motion } from "../theme/tokens";

/** An interpolation of the parent scroll position, or null when there is nothing to drive it. */
type ScrollSpan = ReturnType<Animated.Value["interpolate"]> | null;

/** The panel's own reveal, 0→1, for children that should arrive a beat after the panel does — see
 *  `Stagger`. Null while the panel is unmeasured, while the scroll is not yet live, while the panel
 *  is far from the reader, and whenever reduced motion is asked for — so that one check in
 *  `RevealOnScroll` turns off every descendant's motion at once.
 *
 *  DELIBERATELY UNEASED, unlike the transform `RevealOnScroll` applies to itself. A child slices a
 *  window out of this to get its own later start, and slicing an eased curve would squash those
 *  windows together unevenly — the cascade would bunch up wherever the curve happened to be steep.
 *  Sliced linear and eased afterwards, every line gets the same shape of arrival as the panel. */
const RevealProgressContext = React.createContext<ScrollSpan>(null);

// Small, dependency-free motion helpers (RN's built-in Animated). Keep transitions calm and
// consistent — durations come from the `motion` tokens.

/** Does the reader want motion kept to a minimum?
 *
 *  NOT A NICETY. Parallax and rise-on-scroll are exactly the effects that trigger vestibular
 *  symptoms — nausea, dizziness, migraine — in readers who have told their operating system so.
 *  Every animation in this file is therefore opt-out at the reader's request, and the opt-out
 *  always ends in visible, readable content rather than a blank screen.
 *
 *  One API covers all three platforms: on web `react-native-web` maps this straight onto the
 *  `prefers-reduced-motion: reduce` media query, and on Android and iOS it reads the OS setting.
 *  Its `addEventListener` returns nothing when there is no `matchMedia` to listen to, hence the
 *  optional call on `remove`.
 *
 *  Starts `false` — animating — and corrects itself on the first tick. Nothing has had a chance to
 *  move by then: every motion here is driven by a scroll or a mount that has not happened yet. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (alive) setReduced(!!v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => setReduced(!!v));
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

/** Ease-out, sampled for `Animated.interpolate` — which can only take a piecewise-linear curve.
 *
 *  A scroll-driven reveal that is linear in scroll position arrives at a constant speed and stops
 *  dead, which reads as mechanical. Easing it out means it covers most of the distance early and
 *  settles into place, which is what makes the panel feel like it is coming to rest rather than
 *  being dragged. Eight segments is enough that the joins are invisible. */
const EASE_IN = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
const EASE_OUT = EASE_IN.map((t) => 1 - Math.pow(1 - t, 3));
const easeOut = (v: NonNullable<ScrollSpan>) =>
  v.interpolate({ inputRange: EASE_IN, outputRange: EASE_OUT });

/** How far from the reader a panel keeps animating, in screens.
 *
 *  WHY THIS EXISTS. On web there is no native driver — every `Animated.Value.setValue` walks each
 *  attached node and writes its style synchronously, on the scroll handler. Measured on the Soweto
 *  story: 46 animated nodes, all rewritten on every scroll event, in a 535px viewport looking at a
 *  4499px story. About forty of those writes were for content nobody could see, and the result was
 *  three main-thread blocks of 91ms, 57ms and 112ms during one pass down the page — seven dropped
 *  frames on the worst of them, which is what "not smooth" actually was.
 *
 *  Three screens, not one, and the margin is the whole point: a panel's reveal starts one screen
 *  below the fold, so anything that switches on later would switch on mid-animation and pop. At
 *  three screens the value it switches on at is its own resting value at that distance — 0 for a
 *  panel still below, 1 for one already read — so nothing changes on screen as it crosses. */
const NEAR_SCREENS = 3;

/** Is this panel close enough to the reader to be worth animating?
 *
 *  EACH PANEL OWNS ITS OWN ANSWER, and that is the entire design. The obvious implementation —
 *  parent tracks the scroll, passes it down, children compare — re-renders every panel in the
 *  story each time that number changes, which trades a per-frame cost for a periodic spike and on
 *  measurement was no better. Here the parent never re-renders at all: each panel listens to the
 *  scroll value directly and calls `setState` only on the frame its own answer actually flips,
 *  which across a whole story is a handful of times. Ten closures doing one subtraction per scroll
 *  event is nothing next to forty style writes.
 *
 *  Unmeasured panel means yes: guessing wrong costs frames, but refusing to animate something the
 *  reader is looking at costs the effect. */
function useNearViewport(scrollY: Animated.Value, y: number | null, viewportHeight: number): boolean {
  const [near, setNear] = useState(true);
  useEffect(() => {
    if (y === null) return;
    const margin = viewportHeight * NEAR_SCREENS;
    const id = scrollY.addListener(({ value }) => {
      const now = Math.abs(y - value) < margin;
      setNear((prev) => (prev === now ? prev : now));
    });
    return () => scrollY.removeListener(id);
  }, [scrollY, y, viewportHeight]);
  return y === null ? true : near;
}

/** Fades its children in on mount. Give it a `key` that changes to re-trigger (e.g. per screen/scene). */
export function Fade({
  children,
  duration = motion.base,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    // Jump to the end rather than skipping the component: the content still has to appear.
    if (reduced) return opacity.setValue(1);
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }).start();
  }, [opacity, duration, reduced]);
  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

/** Reveals children with a rise-and-fade, optionally delayed — for orchestrated, staggered page loads. */
export function Reveal({
  children,
  delay = 0,
  distance = 18,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    // Same rule as `Fade`: a reader who wants no motion still wants the page.
    if (reduced) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: motion.slow, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: motion.slow, delay, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, delay, reduced]);
  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>
  );
}

/** A slow idle bob — the one animation here that a timer drives, and the one that has to.
 *
 *  Everything else in a scroll-told story is a function of the scroll. The "Scroll" cue under the
 *  title cannot be: it exists to tell a reader who has not scrolled that there is more, and an
 *  animation driven by the scroll would by definition be still at that moment.
 *
 *  So it is bounded on both sides. It stops the instant the reader scrolls (`active`), so it never
 *  competes with the story for attention, and it does not run at all for a reader who has asked for
 *  reduced motion — the cue is then simply a static word and a chevron, which still says it. */
export function Bob({
  children,
  distance = 5,
  active = true,
  period = 1100,
  style,
}: {
  children: React.ReactNode;
  distance?: number;
  /** False once the cue has served its purpose. */
  active?: boolean;
  period?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !active) return v.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: period, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: period, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, reduced, active, period]);
  return (
    <Animated.View
      style={[
        style,
        { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, distance] }) }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Fades in as it scrolls INTO view, rather than on mount — for a story told by scrolling.
 *
 *  FADES, AND ONLY FADES. This used to rise as well, and the rise is gone for the same reason the
 *  parallax is: it was a POSITION driven from the scroll value on the main thread, inside a
 *  container the browser is scrolling on the compositor. Those two can only ever be as
 *  synchronised as the main thread manages that frame, so the panel arrived in uneven steps
 *  against a background moving perfectly smoothly, and the reader sees that difference as judder.
 *
 *  An opacity that is a frame late is invisible — there is no reference against which to notice
 *  it, because nothing about where the panel IS depends on it. That is the whole argument: on a
 *  scrolling surface, fade things in, do not move them in. It costs a flourish and buys a story
 *  that cannot judder by construction.
 *
 *  `Reveal` above still rises, and may: it animates once on mount, from a timer, with the page
 *  standing still. It has nothing to be out of step with.
 *
 *  Driven by interpolating the scroll position against this panel's own measured `y`, so the
 *  animation is a pure function of where the reader is rather than a timer that has to be kept in
 *  sync with one. No sticky positioning and no scroll hijacking, so web, Android and iOS behave
 *  identically.
 *
 *  The parent sets the value from a plain `onScroll`, NOT `Animated.event` with the native driver.
 *  That is deliberate and expensive-sounding; see `live` below for what happened when it was not.
 *
 *  FIVE WAYS THIS DECLINES TO ANIMATE, all ending in visible content. If `onLayout` has not
 *  measured the panel, `y` is null. If no scroll event has arrived, `live` is false. If the reader
 *  has asked for reduced motion, nothing moves. If the panel was already on screen when the scroll
 *  went live, it stays put for good — see `liveFromY`. And if it is more than a few screens away
 *  from the reader it stops animating until they come back — see `nearScrollY`. In every case the
 *  animated style is omitted entirely and the content renders plainly. The failure mode is "no
 *  animation", never "no content" — a rule worth stating because the first version broke it. */
export function RevealOnScroll({
  children,
  scrollY,
  viewportHeight,
  live = true,
  liveFromY = 0,
  style,
}: {
  children: React.ReactNode;
  /** The `Animated.Value` driven by the parent `Animated.ScrollView`. */
  scrollY: Animated.Value;
  viewportHeight: number;
  /** Has the parent actually SEEN a scroll event yet?
   *
   *  This exists because of a real failure, not a hypothetical one. Driving the value with
   *  `Animated.event(..., {useNativeDriver: true})` left it pinned at 0 on web: every panel below
   *  the first interpolated to opacity exactly 0 and the screen was black. A story that hides
   *  itself is worse than one that does not animate.
   *
   *  So the animation is opt-IN, on evidence. Until a scroll event has demonstrably arrived,
   *  content renders plainly. Nothing is lost by waiting: before the first scroll, everything
   *  below the fold is off-screen anyway. */
  live?: boolean;
  /** The scroll offset at the moment `live` first became true.
   *
   *  THIS FIXES A VISIBLE POP, not a hypothetical one. `live` flips on the first scroll event, and
   *  at that instant every panel switches from plain rendering to an interpolation — including the
   *  panels the reader has been looking at since the page opened. On a short viewport the first
   *  panel's interpolation evaluates to roughly 0.8, so it jumped from fully opaque to faded on
   *  the reader's very first flick of the wheel. The reveal was animating something that had
   *  already arrived.
   *
   *  A panel whose top was already above the fold when the scroll went live has, by definition,
   *  been seen. It is latched as settled and never animates. The latch is one-way: scrolling back
   *  up must not re-run an entrance for a panel the reader has read. */
  liveFromY?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [y, setY] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const near = useNearViewport(scrollY, y, viewportHeight);

  // One-way latch, set on the first render where both the layout and the scroll are known.
  const settled = useRef<boolean | null>(null);
  if (settled.current === null && live && y !== null) settled.current = liveFromY >= y - viewportHeight;

  const animate = live && y !== null && !settled.current && !reduced && near;

  // Start when the panel's top is one viewport away, finish when it is two-thirds of the way up.
  // Reading, not decoration: the text should be settled by the time it is comfortable to read.
  // Kept linear here and eased at the point of use, so that `Stagger` can slice it — see the note
  // on `RevealProgressContext`.
  const progress = !animate
    ? null
    : scrollY.interpolate({
        inputRange: [(y as number) - viewportHeight, (y as number) - viewportHeight * 0.66],
        outputRange: [0, 1],
        extrapolate: "clamp",
      });
  const eased = progress === null ? null : easeOut(progress);

  return (
    <Animated.View
      onLayout={(e) => setY(e.nativeEvent.layout.y)}
      style={[
        style,
        eased === null ? null : { opacity: eased },
      ]}
    >
      <RevealProgressContext.Provider value={progress}>{children}</RevealProgressContext.Provider>
    </Animated.View>
  );
}

/** One line of a panel, arriving a beat after the line above it.
 *
 *  WHY A PANEL SHOULD NOT ARRIVE ALL AT ONCE. The reveal above fades the whole card as one block,
 *  which reads as a slab appearing. Giving the kicker, the headline and the body their own slightly
 *  later starts makes the panel assemble in the order it is meant to be read, and it costs no extra
 *  scroll distance because the offsets all land inside the panel's own reveal.
 *
 *  A CASCADE OF FADES, not of rises — same rule as `RevealOnScroll`, and the sequence carries it
 *  perfectly well without movement. Lines becoming legible one after another is still an order.
 *
 *  Driven by the panel's reveal progress through `RevealProgressContext`, so it inherits every one
 *  of that component's reasons not to animate: unmeasured panel, scroll not live, panel already
 *  seen, panel far away, reduced motion. With no progress to read it renders plainly. */
export function Stagger({
  children,
  /** 0 for the first line, 1 for the next, and so on. */
  index = 0,
  style,
}: {
  children: React.ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = useContext(RevealProgressContext);

  // Each line takes most of the panel's reveal, starting a little later than the one before, then
  // eases in on its own curve. The cap keeps the last line's window inside 0→1 however many lines a
  // panel grows to.
  const start = Math.min(index * 0.1, 0.4);
  const local =
    progress === null
      ? null
      : easeOut(
          progress.interpolate({
            inputRange: [start, start + 0.6],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        );

  return (
    <Animated.View style={[style, local === null ? null : { opacity: local }]}>{children}</Animated.View>
  );
}

/** How far a `Stage` has been held, 0→1. Null by the same rules as everything else here. */
const StageProgressContext = React.createContext<ScrollSpan>(null);

/** Read the enclosing `Stage`'s progress, to drive something this file has no opinion about — a
 *  slow zoom on a photograph, a scrim that deepens as the text lands. Null outside a stage, or
 *  whenever the stage has declined to animate; callers must handle that by rendering plainly. */
export function useStageProgress(): ScrollSpan {
  return useContext(StageProgressContext);
}

/** A held shot. The reader keeps scrolling; the picture does not move, and the story arrives on top
 *  of it a line at a time.
 *
 *  WHAT THIS IS FOR. `RevealOnScroll` moves a panel past the reader — the reader is travelling and
 *  the places go by. A `Stage` inverts that: it takes several screens of scroll and spends all of
 *  them in ONE place. You arrive, the picture stops, the story assembles on top of it a line at a
 *  time, and only then does the ground move on to the next picture. That is the difference between
 *  reading about Vilakazi Street and standing in it, and it is what Tumo was asking for all along.
 *
 *  HOW IT HOLDS STILL. The stage is a spacer `screens` viewports tall; inside it, one frame exactly
 *  one viewport tall sticks to the top of the scrollport for the spacer's slack, then releases. The
 *  next stage's frame comes up directly beneath, so they hand over without a seam.
 *
 *  A PREVIOUS VERSION DID THAT PIN IN JAVASCRIPT and it is the reason this comment is long. It
 *  absolutely positioned the frame and translated it DOWN by however far the page had scrolled UP,
 *  cancelling the scroll. Cancellation is the worst possible thing to ask of the main thread: the
 *  target is exact, so every millisecond the value is late — and every event `scrollEventThrottle`
 *  drops — shows up directly as the held picture sliding against a scroll that never stopped.
 *  Reported, accurately, as the image vibrating up and down. The browser can do the same job on the
 *  compositor, where the pin and the scroll are one operation and cannot disagree.
 *
 *  DECLINING TO BE A STAGE AT ALL. Reduced motion and both the tall spacer and the pin disappear:
 *  the content renders in the flow at its natural height with every beat visible. A held shot the
 *  reader cannot escape is the worst thing on this screen for someone who gets motion sick, so the
 *  fallback is not a lesser stage — it is no stage (SP-103, SP-106). */
export function Stage({
  children,
  scrollY,
  viewportHeight,
  live = true,
  /** How many viewports of scroll are spent here. Under about 2 the hold is too brief to read as a
   *  hold; much over 3 and the reader starts wondering whether the page is broken. */
  screens = 2.4,
  style,
}: {
  children: React.ReactNode;
  scrollY: Animated.Value;
  viewportHeight: number;
  live?: boolean;
  screens?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [y, setY] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const near = useNearViewport(scrollY, y, viewportHeight);

  const stageHeight = Math.round(viewportHeight * screens);
  const slack = stageHeight - viewportHeight;

  // TWO SEPARATE DECISIONS, and keeping them apart is the point.
  //
  //   `pinned`  is a LAYOUT question — does this stage hold its picture still? On web that is
  //             `position: sticky`, which costs nothing per frame, so it is on whenever the stage
  //             has room for it and the reader has not asked for reduced motion. It does not
  //             depend on the scroll value at all.
  //   `animate` is a BEATS question — should the lines be arriving right now? That is JavaScript
  //             reading the scroll, so it is gated on everything: live, measured, near, not
  //             reduced.
  //
  // They used to be one flag, which meant the pin switched off whenever the beats did.
  const pinned = !reduced && slack > 0;
  const animate = pinned && live && y !== null && near;

  // The stage keeps its full height whether or not the beats are running, so that going live does
  // not resize the document under the reader. Only reduced motion collapses it — there the extra
  // scroll length buys nothing, because nothing is being held.
  const height = pinned ? stageHeight : undefined;

  const progress = !animate
    ? null
    : scrollY.interpolate({
        inputRange: [y as number, (y as number) + slack],
        outputRange: [0, 1],
        extrapolate: "clamp",
      });

  // THE PIN IS CSS ON WEB, AND THAT IS THE WHOLE FIX.
  //
  // It used to be a JavaScript `translateY` that tried to exactly CANCEL the scroll — hold the
  // frame still by moving it down by however far the page had moved up. That is the single worst
  // thing to compute on the main thread, because the target is perfect cancellation: every
  // millisecond the value is late, and every scroll event `scrollEventThrottle` drops, shows up
  // directly as the "held" picture sliding against a scroll that did not stop. Tumo described it
  // exactly — the image going up and down as though it were vibrating.
  //
  // `position: sticky` asks the browser to do the same job on the compositor, where it cannot be
  // late, because the scroll and the pin are the same operation. `react-native-web` supports it
  // (it uses it for its own sticky headers) — RN's own style types do not admit the value, hence
  // the cast, which is narrow and deliberate rather than a shortcut.
  //
  // Native has no sticky, so it keeps the transform. That is not ideal and is worth revisiting if
  // the native build ever ships (issue #44), but web is the shipped target and web is where this
  // was reported.
  const stickyPin = { position: "sticky", top: 0, height: viewportHeight } as unknown as ViewStyle;

  const nativeHold =
    Platform.OS === "web" || !animate
      ? null
      : scrollY.interpolate({
          inputRange: [y as number, (y as number) + slack],
          outputRange: [0, slack],
          extrapolate: "clamp",
        });

  const frame =
    Platform.OS === "web"
      ? pinned
        ? stickyPin
        : null
      : nativeHold === null
      ? null
      : {
          position: "absolute" as const,
          left: 0,
          right: 0,
          top: 0,
          height: viewportHeight,
          transform: [{ translateY: nativeHold }],
        };

  return (
    <Animated.View onLayout={(e) => setY(e.nativeEvent.layout.y)} style={[style, { height }]}>
      <Animated.View style={frame}>
        <StageProgressContext.Provider value={progress}>{children}</StageProgressContext.Provider>
      </Animated.View>
    </Animated.View>
  );
}

/** One line of a staged panel, arriving at its own point in the hold.
 *
 *  `Stagger` spreads a panel's lines across the moment it comes into view — a fraction of a second.
 *  A `Beat` spreads them across several screens of scroll in a place that is standing still, which
 *  is a different thing to do and needs the caller to say WHERE in the hold each line lands rather
 *  than merely in what order. Hence `from` rather than an index: the rhythm of a held shot is an
 *  editorial decision, not an increment.
 *
 *  Fades, like everything else scroll-driven here — and in a held shot the case is even plainer,
 *  because the picture behind is deliberately motionless. A line sliding up in front of a still
 *  photograph is the one thing on the screen that could stutter, against the one background that
 *  makes stutter obvious.
 *
 *  Once a beat has arrived it stays. The reader is accumulating a story about one place, not
 *  watching lines replace each other. */
export function Beat({
  children,
  /** Where in the stage's 0→1 this line starts arriving. */
  from = 0,
  /** How much of the stage it takes to arrive. */
  span = 0.16,
  style,
}: {
  children: React.ReactNode;
  from?: number;
  span?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = useStageProgress();

  // `interpolate` requires a strictly increasing input range, and a caller asking for a beat near
  // the end of the hold would otherwise push the window past 1 and produce one.
  const start = Math.max(0, Math.min(from, 0.98));
  const end = Math.min(Math.max(start + span, start + 0.02), 1);
  const local =
    progress === null
      ? null
      : easeOut(progress.interpolate({ inputRange: [start, end], outputRange: [0, 1], extrapolate: "clamp" }));

  return (
    <Animated.View style={[style, local === null ? null : { opacity: local }]}>
      {children}
    </Animated.View>
  );
}

/* `ParallaxLayer` used to live here: it drifted a photograph against the scroll inside its panel,
   and settled it out of a slightly wider crop. It was deleted rather than left unused, because the
   reason it went is worth more than the component was.

   The panel is scrolled by the browser on the compositor. A scroll-linked transform on the picture
   inside that panel is computed in JavaScript from a scroll value that arrives a little late and,
   at `scrollEventThrottle` 16 on a high-refresh display, not on every frame at all. So the frame
   moved smoothly and the picture inside it did not quite, and the reader saw the picture shivering
   against its own edges. The settling zoom was worse still: resampling a photograph at a slightly
   different size every frame makes fine detail crawl, which is a rendering artefact and not a
   timing one, so no amount of better scheduling would have saved it.

   THE RULE THAT REPLACED IT: on a surface the browser is already scrolling, do not give anything
   inside it a second, JavaScript-driven motion. Entrances are fine — they run once and stop, and a
   frame of lag in something that has finished moving is invisible. It is the effects that never
   stop moving whose lag is on display the whole time the reader is looking at them. */

/** A pressable that gently scales down while pressed — tactile feedback on cards & buttons. */
export function PressScale({
  children,
  onPress,
  style,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(0.97)}
      onPressOut={() => to(1)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
