// Guards for the bottom-right floating layer.
//
// WHAT THESE CAN AND CANNOT DO. They read source as text and check that the floating elements still
// ask `useFloatingBottom()` instead of choosing their own number. That catches the regression that
// produced all three bugs — someone writes `bottom: spacing.lg` because it looks right on a desktop
// window — but it CANNOT see a collision. Nothing in this repo renders (issue #53); the only real
// check is a person looking at a phone. These tests exist so the fix does not quietly rot, not so
// anyone can skip that look.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");
const CHATBOT = read("../components/ChatbotWidget.tsx");
const HOME = read("../components/HomeGallery.tsx");
const APP = read("../../App.tsx");
const TABBAR = read("../components/shell/MobileTabBar.tsx");
const NAV = read("../components/shell/nav.ts");

test("the chatbot FAB and its panel are placed by useFloatingBottom, not by a literal", () => {
  assert.match(CHATBOT, /useFloatingBottom\(\)/, "ChatbotWidget must ask the hook for its bottom offset");
  // Both the collapsed FAB and the open panel used `bottom: spacing.lg` — 24px from the window, which
  // is INSIDE the tab bar. Either one regressing puts the bubble back on top of the tabs.
  assert.equal(
    /bottom:\s*spacing\.\w+\s*,\s*right:/.test(CHATBOT),
    false,
    "a `bottom: spacing.*` literal is back in ChatbotWidget — it cannot know whether the tab bar is on screen"
  );
});

test("the chatbot is gated on `immersive`, so it leaves the reader's Next button alone", () => {
  // `!storyActive` covered only the full-screen dot-story; the Reader is immersive too, and that is
  // where the FAB sat on top of Next.
  assert.match(APP, /ready\s*&&\s*!immersive\s*&&\s*<ChatbotWidget/, "App.tsx must unmount the chatbot on immersive screens");
});

test("the home scroll cue is not vertically centred — that is what put it on the hero title", () => {
  const cue = /scrollCue:\s*\{([^}]*)\}/.exec(HOME);
  assert.ok(cue, "could not find the scrollCue style in HomeGallery — this test needs rewriting");
  // top:0 + bottom:0 + justifyContent:center centres it in the viewport, where the wordmark is.
  assert.equal(/top:\s*0/.test(cue[1]) && /bottom:\s*0/.test(cue[1]), false, "scrollCue is stretched top-to-bottom again");
  assert.match(HOME, /styles\.scrollCue,\s*\{\s*bottom:\s*floatingBottom\s*\+\s*FAB_H/, "the cue must stack above the FAB using the shared numbers");
});

test("TAB_BAR_H is the tab bar's own floor, so clearing it actually clears the bar", () => {
  assert.match(NAV, /export const TAB_BAR_H = \d+;/, "TAB_BAR_H must live in nav.ts — importing it from MobileTabBar closes a cycle through the ui barrel");
  assert.match(TABBAR, /minHeight:\s*TAB_BAR_H\s*\+/, "MobileTabBar must apply TAB_BAR_H, or the constant is a guess about someone else's layout");
});

test("ui/floating.ts owns the tab-bar breakpoint rather than trusting a caller's `wide`", () => {
  const FLOATING = read("./floating.ts");
  assert.match(FLOATING, /WIDE_MIN/, "the hook must compare against the shell's WIDE_MIN");
  // ChatbotWidget and HomeGallery both carry a local `wide = width >= 768`; the tab bar goes at 900.
  // A caller passing its own `wide` would be wrong for every window in between.
  assert.equal(/\bwide\s*[,:}]/.test(FLOATING.split("export function useFloatingBottom")[1] ?? ""), false,
    "useFloatingBottom must not take `wide` as a parameter — 768 is not 900");
  for (const [name, src] of [["ChatbotWidget", CHATBOT], ["HomeGallery", HOME]] as const) {
    assert.equal(/useFloatingBottom\(\{[^}]*wide/.test(src), false, `${name} must not pass its local \`wide\` into the hook`);
  }
});
