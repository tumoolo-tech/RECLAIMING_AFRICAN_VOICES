import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleProp, ViewStyle } from "react-native";
import { motion } from "../theme/tokens";

// Small, dependency-free motion helpers (RN's built-in Animated). Keep transitions calm and
// consistent — durations come from the `motion` tokens.

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
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }).start();
  }, [opacity, duration]);
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
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: motion.slow, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: motion.slow, delay, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, delay]);
  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>
  );
}

/** Rises and fades as it scrolls INTO view, rather than on mount — for a story told by scrolling.
 *
 *  `Reveal` above animates once, when the component mounts. In a long scroll that is wrong twice
 *  over: everything below the fold animates while nobody is looking, and by the time a reader
 *  reaches it the motion has already happened.
 *
 *  Driven by interpolating the scroll position against this panel's own measured `y`, so the
 *  animation is a pure function of where the reader is rather than a timer that has to be kept in
 *  sync with one. No sticky positioning and no scroll hijacking, so web, Android and iOS behave
 *  identically — which is the whole reason to prefer this over the parallax effect it imitates.
 *
 *  The parent sets the value from a plain `onScroll`, NOT `Animated.event` with the native driver.
 *  That is deliberate and expensive-sounding; see `live` below for what happened when it was not.
 *
 *  TWO WAYS THIS DECLINES TO ANIMATE, both ending in visible content. If `onLayout` has not
 *  measured the panel, `y` is null. If no scroll event has arrived, `live` is false. Either way
 *  the animated style is omitted entirely and the content renders plainly. The failure mode is
 *  "no animation", never "no content" — a rule worth stating because the first version broke it. */
export function RevealOnScroll({
  children,
  scrollY,
  viewportHeight,
  live = true,
  distance = 28,
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
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [y, setY] = useState<number | null>(null);

  // Start when the panel's top is one viewport away, finish when it is two-thirds of the way up.
  // Reading, not decoration: the text should be settled by the time it is comfortable to read.
  const progress =
    y === null || !live
      ? null
      : scrollY.interpolate({
          inputRange: [y - viewportHeight, y - viewportHeight * 0.66],
          outputRange: [0, 1],
          extrapolate: "clamp",
        });

  return (
    <Animated.View
      onLayout={(e) => setY(e.nativeEvent.layout.y)}
      style={[
        style,
        progress === null
          ? null
          : {
              opacity: progress,
              transform: [
                { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
              ],
            },
      ]}
    >
      {children}
    </Animated.View>
  );
}

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
