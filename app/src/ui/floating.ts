// How much room the bottom edge is already spoken for — the one fact the floating layer was missing.
//
// THE BUG THIS EXISTS TO END. Anything that floats (the "Ask Ubuntu" chatbot FAB, the home screen's
// scroll cue) is positioned absolutely against the WINDOW, while the things it covers — the phone tab
// bar, a reader's Back/Next row — are laid out in FLOW. Nothing connected the two, so each floating
// element was placed by a literal and then nudged when someone noticed a collision: the FAB sat 24px
// from the bottom and therefore on top of the tab bar, and the scroll cue was moved to the vertical
// centre to dodge the FAB, which put it on top of the hero title. Dodging is not a layout system.
//
// Every floating element asks this instead of choosing a number.

import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../theme/tokens";
// Both from nav.ts, never from MobileTabBar: that component imports the ui barrel, and this file
// IS the ui barrel, so importing it back would close a cycle.
import { WIDE_MIN, TAB_BAR_H } from "../components/shell/nav";

/** The height of the chatbot FAB — pill, 22px icon, 14px padding top and bottom. Anything stacking
 *  ABOVE the FAB (the scroll cue) needs this, and guessing it is how the stack drifts apart. */
export const FAB_H = 50;

/**
 * The distance a floating control should sit from the bottom of the window.
 *
 * WHY THIS OWNS THE BREAKPOINT. The tab bar renders when `!wide && !immersive`, and the shell's
 * `wide` is `WIDE_MIN` (900) — but ChatbotWidget and HomeGallery each carry their own `wide` at 768,
 * for their own layout. A caller passing its local `wide` would be wrong for every window between
 * 768 and 900: the tab bar is on screen there and the FAB would sit back on top of it. So the
 * condition is evaluated here, against the same constant the shell uses, and is not a parameter.
 *
 * `immersive` is the caller's to declare, because only the caller's screen knows. It defaults to
 * false: a floating control on an immersive screen is chrome, and immersive means no chrome —
 * App.tsx unmounts the chatbot rather than repositioning it. The parameter stays so a deliberate
 * exception has somewhere honest to say so.
 */
export function useFloatingBottom({ immersive = false }: { immersive?: boolean } = {}): number {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const hasTabBar = width < WIDE_MIN && !immersive;
  // Below the bar: its reserved height, the home indicator it already pads for, and a breath.
  return hasTabBar ? TAB_BAR_H + Math.max(insets.bottom, spacing.sm) + spacing.sm : spacing.lg + insets.bottom;
}
