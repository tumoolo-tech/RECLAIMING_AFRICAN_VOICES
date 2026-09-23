# STATUS-LOG — Ubuntu Heritage change log

> The dated history behind [STATUS.md](STATUS.md). **Newest entry first.** Add yours at the top; do
> not edit older entries — a decision that turns out wrong is superseded by a new entry, not rewritten.
>
> This file is `merge=union` in [.gitattributes](.gitattributes): two branches that each add an entry
> merge without a conflict and **both entries survive** (the merging side's first). If the dates end up
> out of order, reorder them by hand. The board in STATUS.md is deliberately *not* union-merged — two
> people changing the same board row is a real disagreement and should stop the merge.

- **2026-09-23 (board de-dupe)** — **The same both-sides merge that broke `package.json` also broke
  the board, and the hotfix only fixed the first one.** `STATUS.md` came out of the #77/#78 conflict
  carrying **two `_Last updated:_` lines**, the **PR checks (CI)** row twice and the **Audit backlog**
  row twice. The duplicates were not merely redundant, they **disagreed**: one PR-checks row read 🔴
  "NOT a required check — and on 23 Sep that cost us a broken `main`", the other read 🟡 "#40 done
  (this branch)"; one backlog row listed #38 as done and #40 as *in review*, the other listed neither.
  A board that says two things is worse than a board that says nothing, because both readings look
  authoritative.
  **Resolved by keeping the newer row in each pair and folding in what only the older one carried** —
  the `engines` / `.nvmrc` item, which was **checked before it was moved, not assumed**: there is no
  `.nvmrc` anywhere in the repo and no `engines` field in `app/package.json`, so nothing pins the Node
  version that #77's `run-ts.mjs` launcher was written for. That is still Tumo's, alongside making PR
  checks required. The merged backlog row now names all six merged issues against their PRs
  (#36 · #25 · #34 · #51 · #40 · #38 → PRs #69, #71, #72, #75, #77, #78), each one verified against
  the PR state rather than copied across.
  **Why this is a separate commit from the hotfix.** #79 had to be small and fast — `main` could not
  install. This is the other half of the same damage, and it is board prose, so it belongs where it
  can be read rather than smuggled into an emergency fix. The rule the hotfix entry wrote down is the
  one that applies: keeping both sides is right for an append-only log and wrong for a map, and a
  board row is a map.

- **2026-09-23 (hotfix)** — **`main` could not run `npm` at all for about an hour, and the check that
  caught it was not allowed to stop it.** Resolving the `app/package.json` conflict between PR #77 and
  PR #78 kept **both** sides of the hunk: `cache:images` and `check:docs` appeared twice, and the
  duplicated block left `review:sheet` without its trailing comma. The result was **invalid JSON** —
  not a failing test, but a file `npm` refuses to parse, so `npm ci`, `npm test`, `npm run build:web`
  and any Vercel deploy all died at the first step on a fresh clone.
  **The check worked; the policy did not.** The PR-checks run on the merge commit `6660c5f` is
  recorded as **failure** — CI saw it immediately. But the check has never been made *required*, a
  line the board has carried since 12 Sep and #40 deliberately left for Tumo, so the merge went
  through over a red run. That is the whole cost of the deferral, paid once: **making PR checks a
  required status check on `main` is now the single highest-value thing Tumo can do in the repo
  settings.** No code needed.
  **The fix** keeps #77's launcher-routed versions, drops the duplicates, and finishes the one thing
  #38 left open on purpose: `review:sheet` now goes through `scripts/run-ts.mjs` like the other ten
  TypeScript-loading scripts, because `gen-review-sheet.mjs` imports `.ts` and that is exactly what the
  launcher exists for. It could not run on Node 22.16 until this commit; it can now.
  Verified on the repaired tree: `package.json` parses, **26 scripts, no duplicate keys** ·
  **292/292 tests** — the first fully green suite on a Node 22.16 machine, which is itself the proof
  that #77 did what it claimed · typecheck clean · `check:docs` clean · `build:web` green.
  **The lesson, recorded because it will recur.** A merge-conflict resolution that keeps both sides is
  the default gesture in every editor's conflict UI, and it is right for an append-only log and wrong
  for a map — `package.json` scripts, a board row, a registry. STATUS-LOG.md is `merge=union` precisely
  because it is the first kind; everything else should conflict loudly and be read by a person.

- **2026-09-23 (#38)** — **The reviewer kit: making the first ask small enough that a speaker says yes.**
  Phase 8 measured the gap and was right to; this is the half that acts on it. Ten of the eleven
  languages have never been read by a speaker — the chrome is machine-drafted and 100% complete, which
  is not the same as correct, and the content is 33% Setswana and **0% in the other nine**. The only
  review process was one hand-written document for one person, Setswana-only, untouched since July.
  **Why a volunteer has been saying no.** Reviewing "the app" means ~330 chrome strings plus 248
  content strings inside a TypeScript codebase. So the sheet is **markdown — a document, not source**
  — and it is ordered by what a wrong word *costs*, not by where the file walker reached it:
  **tier 1 is 34 strings** (consent, the data-cost gate, the erasure promise), which is one sitting,
  and it is the sitting worth having. Tier 2 is navigation and the undoable; tier 4 is the history,
  last because it is largest and slowest — not because it matters least.
  The ordering is **data with its reasoning** (`i18n/review-priority.ts`), pinned by tests, so moving
  the consent sheet down a tier has to be argued for in a diff. Tiers name whole *files*, never line
  ranges: the passport's privacy promise sits among its streak labels, and a line range would be wrong
  the first time someone edited the file — so a few low-harm strings ride along in tier 1, the cheaper
  of the two mistakes, and the comment says so.
  **`npm run review:sheet -- <code>`** writes `review/<code>.md`: English, the current wording, an empty
  Correction column, and the real `file:line` for whoever applies it. All ten generated and checked —
  every reference resolves to a real file and a spot-check lands on the exact string. **It writes only
  to `review/`**; a tool that edits the strings it is reading is one bad regex away from corrupting
  eleven languages at once, which is also why there is no write-back parser: a human applies
  corrections, deliberately, in v1. Generated sheets are gitignored (a stale sheet wastes a reviewer's
  hour); **returned** sheets are committed, because they are the record of what a person said.
  **A second counter needed pinning, not deduplicating.** `extract-strings.ts` finds the same strings
  `coverage.ts` counts, for a different job — "which ones and what do they say" against "how many".
  Phase 8's SP-082 put counting in one place precisely so numbers could not drift, so a test now
  asserts the two **agree** file by file. They do: both see 248 content strings.
  **A hole found on the way, and closed.** `ui-coverage.test.ts` walks `components/**/*.tsx` for
  `const UI` blocks. `shell/nav.ts` is a `.ts` file with no such block — so **the six nav labels, the
  most-seen strings in the app**, plus the mobile tabs and one string in `PlayOnceRow`, were guarded by
  nothing. Nine strings; all eleven languages present today, and nothing would have noticed one going
  missing. `chrome-gaps.test.ts` covers them from the other side, using the extractor rather than a
  second brace matcher, and deliberately does **not** edit `ui-coverage.test.ts` — that file is under
  active work by another contributor, and two overlapping sweeps are easier to keep honest than one
  both of us edit. Mutation-tested: deleting Tshivenḓa from the Journey label turns it red and names
  the file, line and language.
  **`reviewedUi` and `reviewers` join the registry.** One flag could not honestly describe two things
  in different states, so chrome review is now its own field — `false` for every language but English,
  which is the true starting position rather than a placeholder — and a review is recorded as a
  *person*: name, **what they actually read**, and the date. A test fails if a language claims review
  with nobody named; "reviewed the consent sheet" and "reviewed the app" are different claims and the
  registry keeps them apart. `specs/reviewer-guide.md` replaces the Emma-specific handoff with
  something any reviewer can follow, including permission to say the draft is bad — which is the whole
  reason the sheets exist.
  **⚠️ Open question for Tumo, raised not answered.** `languages.ts` marks Setswana
  `reviewedContent: true` and the picker renders a **gold tick** beside it — telling a reader a speaker
  verified the story text. `content/mhudi.ts` and `content/indaba.ts` say the opposite in as many
  words: *"the `tn` fields are AI-assisted DRAFTS and must be reviewed by a Setswana speaker."* Both
  cannot be true. **Did you review the Setswana yourself?** If yes, the notes go and you belong in
  `reviewers`; if no, the tick is unearned. Left alone deliberately — only Tumo knows, and it removes
  something a reader can see. Written up at the foot of the reviewer guide.
  Verified: typecheck clean · **292 tests, 291 pass** · `build:web` green · `check:docs` clean · all
  ten sheets generate with nothing under `src/` modified. **The one failure is #40's, not this
  branch's:** `topics.generated.test.ts` spawns node with hard-coded flags and crashes on Node 22.16 —
  proved pre-existing by stashing every change and watching it fail identically on bare `main`, while
  the generator itself reports the file current. It passes in CI (Node 24) and PR #77 fixes it. For the
  same reason `review:sheet` needs Node 22.18+ until #77 lands, when its package.json entry should be
  routed through `scripts/run-ts.mjs` like the other ten.
- **2026-09-23 (#40)** — **A test that failed on one machine and passed in CI, and the flag that
  cannot be hard-coded either way.** Pulling `main` on Node **22.16** — a current LTS — turned
  `topics.generated.test.ts` red: *"src/content changed and topics.generated.ts is stale."* It was not
  stale. The test shells out to the generator; the generator imports `.ts`; below Node 22.18 that
  needs `--experimental-strip-types`, so it **crashed**, and the test read a crash as a difference.
  CI pins Node 24 and was green throughout. A false failure that only appears on someone else's
  machine is the worst kind: the next contributor would have gone looking for a bug in the topic data.
  **Why the obvious fix is wrong.** Hard-coding the flag looked right until it was checked against the
  actual versions: needed on 22.6–22.17, a **silent no-op** on 22.18–25, and **undocumented in Node 26**
  — whose sibling `--experimental-transform-types` was *removed* in v26.0.0. Node 26 is what a fresh
  install gets today, so hard-coding the flag risks breaking every script for a new contributor, which
  is worse than the problem it fixes. Leaving it out breaks 22.x. **Neither constant is correct.**
  **So ask Node instead of guessing.** `scripts/run-ts.mjs` reads `process.features.typescript`
  (`false` → stripping off, `"strip"` → on, `undefined` → too old to say) and passes the flag **only
  when this Node actually needs it** — so a version that removed the flag never sees it. Below 22.6 it
  exits with a sentence telling you which Node to install rather than a stack trace. The **eleven**
  package.json scripts that load TypeScript now go through it; the eight that do not (`check:docs`,
  `webp`, `build:web`, `supabase:check`, …) were left alone, so the manifest itself documents which
  scripts touch `src/`. `fetch:place-photo` was routed through it by mistake and put back — it imports
  no TypeScript.
  **The same bug lived inside the test.** `topics.generated.test.ts` spawned `process.execPath` with
  its own hard-coded flag list. It now spawns the launcher, so there is exactly **one** place in the
  repo that knows about Node versions. Verified there are no others: `process.execPath` appears in the
  launcher and that test, nowhere else.
  **CI gained the step it never had:** `build:web`. Typecheck and tests both pass on code Metro then
  refuses to bundle, and `build:web` is what Vercel deploys — so it is what a PR should survive. Last
  in the file, because the cheapest signals should fail first.
  Verified on Node 22.16, the version that was broken: **269/269** (was 268/269) · typecheck clean ·
  `check:docs`, `check:languages`, `check:topic-links`, `gen:topics`, `check:place-links` all exit 0 ·
  `build:web` green · `topics.generated.ts` untouched by any of it · the launcher forwards exit codes
  (a child exiting 3 exits 3 — a swallowed failure would make CI lie) and refuses an empty invocation.
  **Deferred deliberately, awaiting Tumo's green light:** `engines`, `.nvmrc`, and making the PR check
  *required*. Those state a requirement; this change only makes the commands work wherever they land.
- **2026-09-21 (the held shot is now the default, and the pin is CSS)** — Tumo, describing what the
  screen should do: *"the image is supposed to stay there while you scroll until another picture
  needs to replace it… you get to see text as it gets revealed little by little over the image."*
  That is the held reading — the mode built on 21 Sep — and it had been sitting behind a toggle
  nobody would find, with the plain scrolling reading as the default. **It is now the default**
  (`SP-108` amended). Every report about this screen turned out to be about the other reading.

  **And the held reading had the vibration bug in its purest form.** The pin was a JavaScript
  `translateY` that tried to exactly CANCEL the scroll — hold the frame still by moving it down as
  fast as the page moved up. Cancellation is the worst thing to ask of the main thread, because the
  target is exact: every millisecond late, and every event `scrollEventThrottle` dropped, shows up
  as the held picture sliding against a scroll that never stopped. Up and down, as described.

  It is now **`position: sticky`** on web, which asks the browser to do the same job on the
  compositor where the pin and the scroll are one operation and cannot disagree. `react-native-web`
  supports it — it uses it for its own sticky headers — though RN's style types do not admit the
  value, hence one narrow cast. Native keeps the transform (issue #44). The pin is now a LAYOUT
  decision, separate from the beats: it costs nothing per frame, so it no longer switches off when
  the beats do.

  **A correction to the entry below.** It records that `onLayout` "does not fire on web" for
  anything wrapping the scroller. That was wrong, and wrong in a way worth naming: `onLayout`
  resolves through `UIManager.measure`, which defers on a `setTimeout`, and **background tabs
  throttle timers to a second or more** — so an automated probe reading the value too soon, with
  the tab hidden, reports "never fired" whether or not it did. Four elements were instrumented and
  all four "never fired". Given time, the wrapper fires correctly: verified `stickyH === scrollport
  height`, 535 = 535, where it had been reporting the window's 639. That hundred-pixel error was
  real and was clipping the last line of copy below the fold; it is fixed, and the lesson is that
  this harness cannot be trusted for anything timing-dependent.

  Verified on screen end to end: the picture arrives and holds still, kicker then headline then
  body then link fade in over it, the frame releases, and the next place comes up beneath.

- **2026-09-21 (the vibrating photograph — the parallax is deleted)** — Tumo, after the blocking fix
  below: *"it feels like the image is vibrating when I scroll."* A different fault from the long
  tasks, and a structural one (`SP-112`).

  **The browser scrolls the panel; JavaScript was scrolling the picture inside it.** The panel moves
  on the compositor, perfectly. The photograph had a scroll-linked `translateY` and a settling scale
  on top of that, computed on the main thread from a value that arrives late — and worse,
  `react-native-web` implements `scrollEventThrottle` as `Date.now() - lastTick >= throttle`, so at
  **16** a 120Hz display or a precision trackpad, both firing scroll about every 8ms, has **every
  other event dropped**. The frame moved smoothly and the picture inside it moved in unequal steps.
  The difference between the two is exactly what a reader sees as vibration. Throttle is now **1**.

  **The settling zoom was the worse half and could not have been scheduled away.** Resampling a
  photograph at a slightly different size every frame makes fine detail crawl — and these pictures
  are railings, brick courses and foliage. That is a rendering artefact, not a timing one.

  So `ParallaxLayer` is **deleted**, not left unused, and `StagePhoto` no longer pushes in during
  the hold. A photograph sits still in its panel and the panel scrolls. Verified in the DOM: the
  images now carry no transform at all, and the only one anywhere near them is the panel's own
  entrance, four levels up.

  **The rule that came out of it:** on a surface the browser is already scrolling, nothing inside it
  gets a second, JavaScript-driven motion. Entrances are exempt, and that is the useful line — a
  reveal runs once and stops, so a frame of lag in it passes unnoticed; an effect that never stops
  moving has its lag on display for as long as the reader is looking at it. This also returns the
  screen to what the note at the top of the file always said the reference page does: the effect
  comes from scale and restraint, and it is *not* parallax. The drift was mine, added on 19 Sep, and
  it was a mistake.

  **Then Tumo asked for the rest of it, and was right to.** Removing the photograph's motion fixed
  the picture but left every panel still arriving on a scroll-driven `translateY` — the same fault,
  one level out. So the reveal, the per-line stagger, the staged beats and the title card's exit
  are all **opacity-only** now. Nothing on this screen whose position comes from the scroll value
  survives. Verified in the DOM: **zero scroll-driven transforms**, 23 nodes driven by opacity.

  The argument in one line: an opacity that is a frame late is invisible, because nothing about
  where anything IS depends on it. There is no reference against which to notice it. It costs a
  flourish and buys a story that cannot judder by construction. Two movements remain and both are
  timer-driven with the page standing still, so they have nothing to be out of step with — the
  title card's entrance and the "Scroll" cue's bob.

  **Honest limit on the verification:** the browser harness cannot reproduce real scrolling — twenty
  wheel ticks through it produce four synthetic scroll events, so per-event cost is barely
  exercised and the long-task figures under it are dominated by image decode. The mechanism above
  was read out of the `react-native-web` source rather than inferred from those numbers, and the
  absence of transforms was checked directly. Whether it *feels* right is Tumo's call.

- **2026-09-21 (the story was janky, and the Home card was advertising it with the wrong picture)** —
  Tumo reported both. Both were real and both had been shipped.

  **The Home card for Sixteen June was showing rock art** (`SP-111`). Not a styling slip: the card
  asked for the Vilakazi Street photograph through `placeImageId`, which accepted only
  `typeof source === "number"` — what `require()` of a bundled asset returns on Android and iOS.
  On **web**, the platform this app actually ships, it returns a URL string. So the lookup failed
  for every caller, returned undefined, and the `?? heroSource(...)` fallback supplied a generic
  Atlas illustration. A story about Soweto in 1976 was being advertised with a picture of San rock
  art, and nothing looked broken, because a fallback that renders is indistinguishable from a
  lookup that works. The lookup now handles all three shapes, `Section.image` is optional so a
  missing photograph costs the section its picture rather than borrowing an unrelated one — and
  the card now names the **Hector Pieterson Memorial** rather than Vilakazi Street, which is a
  street with Mandela's house on it. The memorial commemorates the children killed that day.

  **The jank was measured, not guessed** (`SP-110`). A PerformanceObserver on `longtask` during one
  pass down the story: **three main-thread blocks — 91ms, 57ms, 112ms**. At a 16.7ms frame budget
  the worst drops seven frames. Cause: no native animation driver on web, so every `setValue` walks
  each attached node and writes its style inside the scroll handler — **46 animated nodes, all
  rewritten on every scroll event**, in a 535px viewport looking at a 4499px story. About forty of
  those writes were for content nobody could see. Panels now stop animating beyond three screens
  and decide it for themselves by listening to the scroll value, so the parent never re-renders.
  After: **one block of 78ms, 23 animated nodes** — 70% less total blocking. The remaining block
  looks like image decode, which is per-image and not per-frame.

  Also fixed while in there: the progress rule animated `width` from "0%" to "100%" — a layout
  property, re-laid-out and repainted every scroll frame, on the one element guaranteed to be on
  screen for the whole story. A full-width rule translated in from the left looks identical and is
  compositor-only.

  An interim version that kept a coarse scroll position in React state and passed it down is
  recorded here because it did not work: it re-rendered all nine panels every screen and measured
  no better than the per-frame cost it was replacing. tsc + 269 tests + check:docs green.

- **2026-09-21 (a second way to read Sixteen June: "In the place")** — Tumo asked for a mode where
  the reader feels they are standing in one place while the story arrives little by little, pointing
  at the Rockstar page again. That is not a timing tweak, so it is a **mode** (`SP-108`), chosen on
  the title card: **Scroll** (the original — the places go past you) and **In the place**.

  **What a held shot is.** A stage takes two and a half screens of scroll and spends all of them in
  ONE place. The photograph stops dead and stays nailed to the screen; the kicker, then the
  headline, then the body, then the link arrive on top of it; the scrim deepens by exactly as much
  as the words currently need, so the picture is never darkened for text that has not arrived. The
  last third of the hold has everything present and nothing arriving — the reader simply standing
  there — and that silence is the part that makes it a place rather than a slideshow.

  **It holds still without `position: sticky`**, which is web-only and would have broken this file's
  one real promise: every effect is an interpolation of scroll position against a measured layout,
  so web, Android and iOS behave identically. The stage is a tall spacer; inside it one frame
  exactly a viewport tall is translated down by however far the stage top has passed the top of the
  screen, clamped to the spacer's slack. The translation cancels the scroll while you cross it and
  runs out at either end, so stages hand over to each other without a seam.

  **Nzima's photograph is never staged** (`SP-109`). A stage is a full-bleed crop with a headline
  across it under a deepening scrim — exactly the three things SP-101 forbids for that picture,
  offered at the most immersive moment in the app. When the held reading reaches it, the mode stops
  performing and the panel falls back to the ordinary rendering: whole, on black, undarkened,
  photographer and subjects and date beneath it. Verified on screen. It reads as the story putting
  the camera down, which is the right thing for it to do there. No new test was needed — the
  existing `stories.test.ts` already pins the branch it depends on.

  **Two things only seeing it could have taught.** A grouping `<View>` around the panels put every
  `onLayout` y a title card out and rendered a **black screen** — `RevealOnScroll` and `Stage` both
  measure against the scroll offset, and `onLayout` reports y relative to the PARENT. Panels are now
  keyed by mode instead of wrapped, with the reason written above them. And a typographic beat,
  given the same treatment as a photograph, slid into view as an empty black screen with a lone gold
  rule on it — because a stage's progress only starts once it is pinned, and a beat has no picture
  to fill that gap. Its kicker and headline are no longer animated at all: they are simply there on
  the way in, and only the body and link arrive during the hold.

  **Reduced motion turns the whole mode off** (`SP-106` extends cleanly): stages collapse to natural
  height with every beat visible. Measured with the preference forced on — `pinnedFrames: 0`,
  `zeroOpacityDivs: 0`, and the story back to 4449px from 10083px, because scroll length that holds
  nothing is just scrolling. Same photographs, same prose, held still.

  Chrome strings for the toggle are in this file's `UI` block and carry the same unreviewed status
  as the rest of it; `t()` falls back to English honestly. tsc + 269 tests green.

- **2026-09-21 (the Sixteen June animation, and the reason there wasn't one)** — Tumo asked to
  improve the animation on the 16 June story. Measured it in a browser first, and the finding
  reframed the whole task: **there was no animation running at all.** At scroll offset 300 the
  title card was still `opacity: 1, translateY(0px)`, the progress rule was empty, and no panel
  carried an animated style. Every one of them was falling back to SP-103's plain render, which is
  why nobody had noticed — the story looked finished, because the fallback is a good fallback.

  **The cause was one missing string** (`SP-105`). `OWN_SCROLL` in App.tsx did not contain `story`,
  so the shell's "page" mode wrapped the route in the shell's own `ScrollView`. The story's
  `Animated.ScrollView` was then never height-constrained: it grew to its full content height, the
  shell did all the scrolling, and the story's `onScroll` never fired once. A screen whose entire
  premise is interpolating its own scroll offset was not the thing being scrolled. Two things fell
  out of fixing it — the route now supplies its own centred 1160px column (the shell's `pageInner`
  used to), and `viewport` is measured from the scroller's real box instead of the window, which is
  ~100px taller because it includes the shell header. The old comment blaming `onLayout` for
  over-reporting was right about the measurement and wrong about the cause: the box genuinely *was*
  the whole content, because nothing was constraining it.

  **A reader can now turn all of it off** (`SP-106`). Parallax and rise-on-scroll are the textbook
  triggers for vestibular symptoms, and the app was offering no way out. One gate in
  `RevealOnScroll` now switches off the reveal, the stagger and the parallax together, and `Fade`,
  `Reveal` and the new `Bob` jump to their end state instead of animating. It lands on the same
  branch as SP-103, so reduced motion is not a degraded screen — it is the same photographs and the
  same prose, held still.

  **The reveal was animating things that had already arrived** (`SP-107`). SP-103 makes the
  animation opt in on the first scroll event; at that instant panels the reader had been looking at
  since the page opened switched from plain rendering to an interpolation and visibly faded. Now a
  panel already above the fold when the scroll goes live is latched as seen, one way, so scrolling
  back up never replays an entrance for something that has been read.

  **What actually moves, beyond fixing it:** the reveal is eased rather than linear, so a panel
  settles instead of stopping dead; a panel's kicker, headline, body and button arrive a beat apart
  (`Stagger`) so it assembles in reading order rather than sliding up as one slab; a place
  photograph settles out of a 6% wider crop as it arrives; and the "Scroll" cue bobs — the one
  timer-driven animation here, and it has to be, because a scroll-driven hint is motionless exactly
  when the reader needs it. It stops on the first scroll and never returns. Nzima's photograph
  stays still throughout: SP-101 holds, and a moving crop of a documentary photograph is still a
  moving crop.

  Verified in the browser rather than asserted — measured mid-reveal, one panel read kicker `0.99`,
  headline `0.95`, body `0.85`, button `0.66`, each with a decreasing offset. tsc + 269 tests green.

- **2026-09-19 (a story told by scrolling)** — Tumo pointed at the Rockstar GTA VI page and asked
  for one demo feature in that shape. I looked at it: full-bleed art about a screen tall, a small
  kicker over a large headline, a line or two of body, text alternating side to side, a lot of
  black between. The effect is scale and restraint, **not** scroll-jacking — which is also what
  makes it portable to a phone. **"Sixteen June"**, reached from a card on Home. Nine panels: four
  licensed place photographs, Sam Nzima's archival photograph, four typographic beats, and the
  sources.

  **A panel cannot choose its own picture** (`SP-100`). It names a `placeId` or a `dayId`, and the
  image, credit and licence all come from that record — so a story cannot illustrate one place with
  another's photograph, and a credit cannot drift from the file it belongs to.

  **A documentary photograph gets a different panel from a place photograph** (`SP-101`), and this
  is the part worth keeping. A place photograph is scenery: cropping it to fill a panel loses
  nothing. Nzima's photograph is evidence — cropping changes what it shows, and a headline across
  it is writing on the record. So it is shown whole on black, undarkened, with the photographer,
  the people in the frame and the date beneath it, and the story text below that.
  `NationalDaysScreen` already drew that line; the new screen must not quietly undo it.

  **A bug that would have shipped a black screen.** The scroll was driven by
  `Animated.event(…, {useNativeDriver: true})`. Measured in the browser: panel 1 at opacity 0.74,
  **panels 2 through 9 at exactly 0** — the value never moves on web, so every interpolation clamps
  to zero. A nine-panel showcase with one visible panel, and the first screenshot looked fine
  because the first panel is the one that works. The rule that came out of it (`SP-103`): a surface
  may decline to animate, never to render.

  **The story tells the correction** (`SP-104`). This app holds Thando Sipuye's argument that the
  familiar telling of 16 June erases the women who organised and marched, and summarises it
  approvingly. The conventional version in the app's most visible feature would contradict its own
  scholarship, so the last third names Sibongile Mkhabela, Winnie Motlalepula Kgware and Hermina
  Leroke, and ends on Antoinette Sithole being a protester rather than only Hector's sister. A test
  fails if those names go.

  Also caught by looking rather than testing: the typographic beats had nothing giving them height
  and read as gaps between pictures; and the floating back button was invisible behind the shell's
  own nav. **269 tests**, typecheck clean, walked end to end in a browser.

- **2026-09-19 (topics link to each other)** — Tumo asked for it in one line: *"mandela house to
  mandela and vilakazi street to mandela house."* Asked who decides that two topics are linked,
  Tumo chose **automatic name matching** over hand-authored rows, having been shown the risk that
  the app would assert connections nobody checked.

  **The reconciliation is that a mention is not a claim.** Automatic matching cannot produce an
  editorial reason, and inventing one is the fabrication AGENTS.md §2 forbids. But if Mandela
  House's already-sourced sentence contains the words "Vilakazi Street", making those words
  navigable asserts nothing new — it is a way to move, not a statement about the past. So there
  are **two tiers and they are different TYPES** (`SP-090`): a curated link carries a required
  reason; a `Mention` has no `why` and no `relation` field at all, so no component can render an
  invented reason even by mistake. That is the same technique that makes `TopicLink.why` required.

  **What is live:** 87 topics indexed · **26 derived mentions** · **9 curated links**, each `why`
  restating a fact already published by both ends. Both of Tumo's examples work, in both
  directions, and Nelson Mandela's page lists Mandela House without a row having been written for
  it — one stored row, two pages, derived (`SP-091`).

  **Three things I got wrong and found by looking at the output rather than the tests.**

  1. The surface-length floor was 6. The Nelson Mandela Museum — whose single sentence names Qunu,
     Mvezo *and* Mandela, three real topics — produced **zero** links. Every topic name of four
     characters or more turns out to be a distinctive proper noun; length was standing in for
     distinctiveness and doing it badly.
  2. A self-match *skipped* its surface instead of claiming it, leaving those characters free for a
     shorter name — "Nelson Mandela International Day" would have had the president matched inside
     the day's own title. Your own name is yours.
  3. A mutual pair rendered **twice**, under both "Also mentioned here" and "Mentioned in". It was
     in Tumo's own example and the screenshot did not show it; printing the resolver's output did.

  Fixes 1 and 2 took the graph from 19 links to 36.

  **The report found its own bug.** `npm run check:topic-links` has a *near misses* section for
  bare surnames sitting in prose with no alias. Its first heuristic took the last word of any name,
  which for a place is a category noun — twenty rows of *District Six says "Museum" but does not
  link to Mafikeng Museum*. That is how you teach someone to skip a section. Restricted to people,
  it found exactly one real thing: Motlanthe's record says "Mbeki". Taken.

  **Not seeded, deliberately:** thematic links. `SP-030` reserves those for Tumo one at a time and
  `SP-055` rejects the arguable by default. One I nearly wrote and should not have —
  `womens-day → national-womens-memorial` — is **wrong**: the memorial commemorates the ~27,000
  Boer women and children who died in British concentration camps; Women's Day commemorates the
  1956 march to the Union Buildings. Different women, different century. Exactly the conflation §9
  exists to stop, and only reading both records showed it.

  **257 tests** (was 218), typecheck clean, every new guard mutation-tested. `npm run typecheck`
  measured before and after the navigation change — 61.4s against a 60.4–71.6s baseline, so the
  recursion trap `SP-085` describes is not re-sprung.

  **Seen working**, place page and person page both. Nelson Mandela's page renders the five
  curated links with their reasons, then his outgoing mentions, then eight incoming ones —
  none of which was written for that page.

  **And seeing it caught the last bug: the heading said "What happened here" above a list of
  places he lived in and was imprisoned in.** He is not somewhere you can stand, and the word
  quietly turned a person into a location. A place keeps that heading; every other kind now reads
  "Directly connected". No test would have found it — every test was about whether the link was
  true, and this one was about whether the sentence around it was.

  One thing still unseen: that heading fix itself. The dev server's renderer froze immediately
  after, and stayed frozen. It is one conditional and it typechecks, but it has not been on a
  screen — worth a glance before the demo.

- **2026-09-19 (#51)** — **The log moves out of STATUS.md, and the docs stop contradicting the code.**
  This is the first entry written in the new file. **The split:** STATUS.md was 1,611 lines, of which
  1,313 were this log, and every PR inserted at the same two spots — a board row and the top of the
  log — so two open PRs always conflicted (PR #71 did). The 57 entries moved here **byte-identical**
  (checked with `cmp`), newest first; STATUS.md keeps the 300-line board and a pointer. This file is
  `merge=union` in `.gitattributes`: proved on throwaway branches — two branches each adding an entry
  merged with **no conflict and both entries kept**, while the same experiment on a STATUS.md board row
  still conflicts, which is correct, because two people changing one fact should stop a merge. Union
  merge is safe only because nobody edits old entries; the header says so.
  **The drift, item by item.** *Maloba* as the product name in **28 places** — CLAUDE.md's first line,
  AGENTS.md, all four skills, docs/01/04/05/06/11, the demo script (which would have had Tumo say
  "This is Maloba" on camera), six code comments, and the `anchor.mjs` header template that regenerates
  `heritage.data.ts`. Renamed; the tagline, the naming notes, the on-chain identity (`p:"maloba"` is
  immutable; the certificates match it) and the Setswana word in `localize.test.ts` stay, deliberately.
  **"ElevenLabs is static-only — never called at runtime"** in six places, wrong since 30 Aug; docs/02,
  docs/03 §3, `.env.example` and CLAUDE.md now describe the per-language, cached, runtime ladder and
  point the bundled-key exposure at #43. **NativeWind, Lottie, WatermelonDB** "locked" in docs/02,
  named in CLAUDE.md, README and docs/01 — none was ever a dependency; the table rows are struck
  through with what is actually used beside them, docs/01 is annotated *(as built)* in four places
  rather than rewritten, and CLAUDE.md's stack paragraph now says what ships. **Three different test
  counts** (79 / 85 / 179) replaced by dated figures or a pointer to `npm test`. `supabase/README`'s
  "not wired to the app yet" section — live since July — replaced with where each step lives and which
  issues cover the gaps. CLAUDE.md's timeline and "one builder (Emma)" brought to today: Tumo, three
  contributors, PR checks, the #58 backlog. **tasks.md:** T010/T020/T027/T033 ticked with the commits
  that did them, T006/T029/T032 struck as never adopted, the rest pointed at their issue; docs/06's
  checklist ticked where verifiable, with the demo video and the aeroplane-mode check left honestly open.
  **The guard:** `npm run check:docs` (`app/scripts/check-docs.mjs`), now a CI step. It walks every
  tracked text file and fails on the product name outside an allow-list of history/identity/tagline
  lines, and on the count-of-eleven language claim anywhere in the docs. Run before the rename it found
  **30** — the 28 name sites plus two nobody had caught: a test title in `ui-coverage.test.ts` and a
  line in `countries/bw-botswana.md`. It also caught its own README comment quoting the phrase, and the
  #36 guard (extended by the other contributor to cover `scripts/`) caught this script's comments —
  two guards policing each other, which is the point.
  Verified: `check:docs` green · typecheck clean · **218/218** · `build:web` green · union-merge proved
  both ways. *Not touched:* old log text, on-chain names, docs/00 (already historical), the pitch docs.

- **2026-09-19 (the photographs — 28 of 49, and the 21 that stay honest)** — PAGE-04. Every place
  was searched on Wikimedia Commons; **28 now carry a real licensed photograph** with photographer,
  licence and file page recorded. The other **21 keep the line the page already shows** — *"No
  licensed photograph of this place yet — we do not illustrate real places with AI."*

  **The looking is the work, and it is worth reporting what it caught.** Thirty-odd files were
  downloaded; **ten were rejected after being viewed**, every one of which the metadata had passed:

  | rejected | what it actually was |
  |---|---|
  | `table-mountain` | burnt fynbos on the plateau — on the mountain, unrecognisable as it (replaced) |
  | `1820-settlers-monument` | a bronze settler couple; Makhanda's monument is a 1974 modernist building |
  | `moses-mabhida-stadium` | the right stadium, twice, **under construction with cranes** — the entry says it opened in 2009 |
  | `victoria-street-market` | a Durban spice stall titled "curry market". Probably that market; probably is not a source |
  | `algoa-bay` | the bay, shot through an aircraft window with the wing across a third of the frame |
  | `phoenix-settlement` | a photograph **of a lantern slide** of a 1900s group portrait, sprocket holes and all |
  | `mafikeng-museum` | a shopping block in Mahikeng with a college sign — not the old Town Hall |
  | `tatham-art-gallery` | a Draper painting **hanging in** the gallery, not the gallery |
  | `ondini` | a portrait of Zibhebhu kaMaphitha |
  | `sol-plaatje-house` | a 1923 photograph of Sol Plaatje the man |

  A licence check and a filename check cannot tell you whether an image shows the place. Only
  opening it can, and that is why `fetch-place-photo.mjs` prints the record to paste rather than
  writing it (SP-086).

  **Retrying with a different search term is worth doing.** The Nelson Mandela Museum and Qunu were
  both written off in the first pass as having no usable Commons file; a second term found a good
  photograph of each. Emakhosini, Waaihoek, Magaliesberg, Pilanesberg and the Makhonjwa range came
  in the same way.

  **Commons genuinely has nothing** for the remaining 21 — searched repeatedly under several terms:
  Sol Plaatje House, William Humphreys Art Gallery, Egazini, Mvezo, the 1820 Settlers Monument,
  Phoenix Settlement, Victoria Street Market, Moses Mabhida, Pietermaritzburg Station, Tatham,
  oNdini, the Ulundi battlefield, Bakone Malapa, the Irish House, Dzata, Eureka City, the Lowveld
  garden, Mafikeng Museum, the Barolong royal kraal, Boekenhoutfontein, Algoa Bay. Filling these
  needs a photographer, an institution's own images, or a permissions email — **not a better query.**

  218/218 tests, typecheck clean.

- **2026-09-19 (a place is a page)** — **Places stop being a bottom sheet.** Tumo asked for
  locations like Vilakazi Street to have their own page, with pictures and a story of their own.

  **The overlay decision was built on a misreading, and it is worth admitting plainly.** SP-035 kept
  place detail out of the router because `App.tsx` recorded that the route union had pushed the
  type-checker to its limit — and SP-036 accepted "no deep link to a place" as the cost. Re-reading
  that comment, the recursion came from **inlining a component inside the route switch**, and the
  fix was extracting it (`StageRoute`). A route with an extracted component is the pattern that
  already works. Verified: typecheck stays clean with the 25th member. The cost was never real
  (`SP-085`).

  So `PlaceScreen` is a page: hero, story, sources, **what happened here** (pulled from the story
  links, with the editorial reason shown), and **elsewhere in this city**. Seen working end to end —
  Vilakazi Street → Hector Pieterson Memorial → back, with each page listing the others.

  **On pictures, the answer is real photographs or none.** The ART decision permits AI for literary
  scenes, disclosed as artistic interpretation. That reasoning does not carry here: an AI picture of
  Vilakazi Street depicts a **real, identifiable address this app is telling someone to travel to**,
  and a reader would take it for a photograph of that street. Getting a person onto a plane with an
  invented image is a different order of wrong from an interpretive illustration. Places therefore
  carry licensed photographs with photographer and licence recorded — which is precisely what ART
  said it was waiting for (`SP-086`). None are sourced yet, so **every page says so out loud**: "No
  licensed photograph of this place yet — we do not illustrate real places with AI."

  Two structural calls. Credit and licence render **on the page**, because CC BY-SA attribution is
  an obligation and a credit nobody scrolls to is not attribution (`SP-087`). And `places.ts` stores
  a file NAME while `place-images.ts` holds the `require()` — otherwise the data module would import
  image binaries and stop loading under `node --test`, the exact trap that makes `provinces.ts`
  un-importable (`SP-088`). A test pins every named file to a real entry, and was mutation-tested
  with an unregistered file, an empty credit and a bad source URL.

  **208 tests, typecheck clean.** Still open in Phase 9: sourcing the photographs *(done for 28 of
  49 — see the entry above)*, mapping URLs to the route so a place can actually be shared, and
  longer stories now that there is room.

- **2026-09-19 (#34)** — ***Indaba, My Children* is in copyright until 2070, and the Ledger never
  fingerprinted a single work.** Two findings, one fix. **One:** Vusamazulu Credo Mutwa died on
  25 March 2020; under the Copyright Act 98 of 1978 (life + 50) the book is protected to the end of
  2070, and for a year README, docs/10, docs/11, three specs and the demo script called the canon
  "public domain". `services/ingest/rights.ts` had encoded exactly this rule since July and had never
  been run against the canon it sat beside. **Two, found on the way:** `chain/anchor.mjs` hashes
  `JSON.stringify(module)` — the app's own two scenes, blurbs and drafts — not the original text. The
  comment said "canonicalise the public work"; the Ledger screen told readers "each text" was
  tamper-evident and "minted as a heritage certificate" (every `mint` is `pending`). The honest claim
  is better than the false one: *what the app says about a work cannot be quietly changed since
  anchoring.* That is now what the screen says, in eleven languages.
  **The fix is a required field.** `Module.rights: { status, authorDied?, basis }` — required, so
  `tsc` listed all ten modules and the ingest draft the moment it existed; an optional field is the
  field Indaba would have skipped. `RightsStatus` gained `"in-copyright"`, which `canIngest` refuses
  with no new code — verbatim reproduction of a protected work is what the gate exists to stop, while
  a module of the app's *own words about* the work is a different act. Indaba: `in-copyright`,
  basis = a summary in our own words, no passage reproduced (checked: the only borrowed phrase is the
  three-word title), not public domain. Plaatje (d. 1932), Mqhayi (d. 1945), Vilakazi (d. 1947):
  `public-domain` with the arithmetic. The six Atlas modules: `original`. New `rights.test.ts`
  runs `isPublicDomainByYear` over every PD claim and pins Indaba; **mutation-tested** — relabelling
  Indaba `public-domain` turns three tests red, naming the year. The basis renders on the Ledger
  card, the Watch page's provenance block and the About screen. docs/04 records the basis as *the
  project's stated basis, not a legal opinion*, and names the next step: approach the Mutwa estate.
  The devnet memo needed no correction — it never claimed rights; only the words around it did.
  Verified: typecheck clean · **217/217** (207 before) · `build:web` green · new strings in the
  bundle, "minted as a heritage certificate" out.

- **2026-09-18 (languages)** — **The multilingual claim now has a number behind it, and it is not
  a flattering one.**

  The framework was never the problem. `ui-coverage.test.ts` genuinely enforces all 11 languages
  across the UI chrome, and does it well. **The history is the gap: 248 English content strings
  against 82 Setswana (33%) and zero in the other nine languages.** `quiz.ts` alone is 84 strings
  with none translated. None of that was measured, no test protected it, and on every content screen
  except the two literary readers a reader who picked isiZulu simply got English with nothing saying
  so — the app quietly implying a translation existed.

  Three things, and deliberately **no new translations**. `npm run check:languages` reports coverage
  per language, names the widest Setswana gaps, and lists what is English *by design* — places,
  provinces and articles, where SP-015 keeps sourced historical prose in one language on purpose. A
  **ratchet** test (`content-coverage.test.ts`) fails only when coverage goes *down*, because
  demanding 100% is exactly what would invite machine-translated history passed off as reviewed. And
  `LanguageNote` discloses the English fallback on surfaces `resolveText` cannot speak for, starting
  with the 49 places.

  Two calls worth recording. The counting lives in **one** module imported by both the report and
  the ratchet (`SP-082`) — if each had its own regex the numbers would drift, and the moment they
  disagreed neither could be quoted. And the note **does not say a translation is coming**
  (`SP-084`): for nine languages coverage is zero, and "coming soon" on a screen that has said so
  for a year is its own small dishonesty.

  All three mutation-tested: deleting one Setswana string turns the ratchet red; dropping Tshivenḓa
  from the new component turns the chrome sweep red. **205 tests, typecheck clean.**

  The report also prints the honest sentence to use in a pitch or against the rubric: *the interface
  is fully localised into all 11 official languages; content translation is under way, Setswana
  leads at 33%, and the app tells a reader when they are seeing English instead.* That is defensible.
  "Multilingual" on its own was not.

  **Built directly on #36, which landed while this was in flight.** That PR established the honest
  form of the claim — *eleven of the twelve* — and a guard against the derived shape
  `${…} official languages`. This work used the wrong phrasing in its report until that landed; the
  report now says "eleven of the twelve official languages" and names South African Sign Language as
  the one not yet served. The guard is also extended to cover `scripts/`, because a script that
  prints a sentence into a pitch can make the same false claim a component can.

- **2026-09-19 (#25)** — **Three corrections to `country-languages.ts`, each checked against its
  instrument first — and one of them went the opposite way from the research.** The 30 Aug research
  had flagged four things from Wikipedia and marked every instrument `[NEEDS SOURCE]`; the file's own
  rule is *constitution or government source*, so the verification was the work.
  **Lesotho:** the Tenth Amendment to the Constitution Act, 2025 (Act No. 2 of 2025, 13 Aug 2025)
  rewrote §3(1) to *Sesotho, English, isiXhosa, isiPhuthi and sign language* — five, not two.
  Wikipedia's prose was right and its infobox stale, and so was our `sourceNote`. `xh` added;
  isiPhuthi and sign language named in `notYet` — isiPhuthi stays out of `supported` because it is
  **not** siSwati, the README's first trap. **Namibia:** Article 3 names only English and contains **no
  list** of national languages at all; "recognised" has to rest on the Ministry of Basic Education,
  Sport and Culture's *Language Policy for Schools* (2003) §5.10, which names Setswana among thirteen.
  `tn` added, four more `notYet` names from the same list, and the note says which claim rests on
  which instrument. **Zimbabwe:** the "constitution embraces only two nationally, Shona and English"
  line the issue asked us to *sharpen the comment with* is **not in the Act** — §6(3)(a) requires all
  sixteen to be "treated equitably". Rejected, recorded in the note, and a test now pins the phrase
  out. **Mozambique: deferred, deliberately.** The instrument is in hand (Arts. 9–10: Portuguese
  official, national languages unnamed), but the entry cannot be wired honestly: the tests require
  English in every entry and English is not official there; `ts` needs a government list naming
  Xichangana plus the Changana↔Xitsonga citation; and `lead` is required with no honest candidate.
  All three are #19's, parked under SA-first. Written up in `mz-mozambique.md` as the first entry to
  wire when #19 lands. The four research files and `countries/README.md` carry the resolutions and the
  new primary sources (Constitute texts; the 2003 policy PDF, read directly).
  Verified: typecheck clean · **207/207** (204 before) · `build:web` green.

- **2026-09-18 (#36)** — **South Africa has twelve official languages, and the app said eleven in seventeen
  places.** Issue #36. The Constitution Eighteenth Amendment Act, 2023 added South African Sign
  Language; `countries/za-south-africa.md` had cited it since August and `country-languages.ts` had
  SASL under `notYet` — the research knew, the copy did not. Worst of the seventeen was
  [CountriesScreen.tsx](app/src/components/CountriesScreen.tsx): `` `${LANGUAGES.length} official
  languages` `` — the app's registry count rendered *as* a constitutional claim, which would have read
  "12 official languages" the day Swahili landed, right number for the wrong reason. It is now a real
  UI string in all eleven languages, `%n of the 12 official languages`, with the two numbers kept from
  different sources on purpose. The `za` `sourceNote` names the Amendment; the chatbot's answer says
  "eleven of the twelve" and names the one not served; the two tests that were titled "all eleven
  official" are renamed and the `za` test now **pins** SASL under `notYet`. New guard,
  [`i18n/claims.test.ts`](app/src/i18n/claims.test.ts): fails the build on the literal claim in either
  word order **and on the derived shape** — any `${…} official languages` interpolation — because no
  number-matching pattern can see the bug that was actually shipped. Scoped to `src/`; docs were fixed
  by hand (README, docs/07, three specs, the i18n skill) and the wider docs lint stays with #51.
  **Not done here, deliberately:** captions and transcripts — the half of #36 that would actually
  serve a Deaf reader. That is a separate PR (mechanism first; anthem lyrics as the first public-domain
  content) and the film/poem transcripts wait on the media-rights register (#35), because
  transcribing media that may be replaced is wasted work. Verified from a clean `npm ci`: typecheck
  clean · **204/204** tests (201 before) · `build:web` green · the new string is in the bundle and the
  old one is not.

- **2026-09-18 (Stage C)** — **The tourism layer stops rotting, and the pitch stops overclaiming.
  Phase 7 complete bar one line.**

  `npm run check:place-links` exists (TOUR-11). Two jobs, and the order is deliberate: it prints the
  layer's honest numbers from data alone **before** any network call, so a flaky host cannot cost
  Tumo the figures an hour before a meeting; then it checks every outbound link and tells a human
  what to do. Three calls worth keeping. **It will not stamp `lastChecked`** — a 200 and a human
  verification are different facts, and letting a green ping refresh that date would quietly turn
  SP-021's human guarantee into a ping log with nobody deciding to drop it (`SP-076`). **A 403 is
  never reported as dead**, because a bot filter refusing a script is not evidence an operator
  folded, and saying so would have the tool manufacture a death and hand a human a wrong edit
  (`SP-077`). **Three exit codes, not two** — in a pre-send checklist "the wifi was bad" must not
  read like "you are about to demo a dead booking link" (`SP-078`). It also gained `--probe <url>`,
  which is the other half of SP-021: check a candidate before it enters the repo (`SP-079`).

  Verified against the real network, not mocked: a 200 exits 0, a 404 exits 1, and a URL carrying
  `?ref=&click=` is refused **without being fetched**. A full run over four temporary fixtures
  produced one ok, one gone, one **200-but-verification-expired** — red on the date, not the status
  code — and one unverified, exiting 1. Fixtures reverted, `experiences.ts` hash-identical,
  `places.ts` never touched: SP-047 demonstrated rather than asserted.

  TOUR-12 was already done and merely unticked; it is now also **structural** (`SP-080`). No
  component may call `window.open`/`Linking.openURL` directly, with the six pre-existing sites
  grandfathered **by name** — the same way the 25 unlabelled pre-v2 controls are handled. Mutation-
  tested both ways: a new offender turns it red, and emptying the allowlist *also* turns it red,
  which proves the list is load-bearing rather than matching nothing.

  **TOUR-13 went wider than the task, on Tumo's call.** The task named §3's "direct, *traceable*",
  but the identical false claim sat in §6 — "visibly routes visitors *and spend*" — and the pitch
  described a booking step that does not exist, in the present tense. Both partnership documents now
  separate what is built from what a partnership would unlock, the product is renamed **Maloba →
  Ubuntu Heritage**, and the team-size byline is a placeholder for Tumo rather than a guess. The
  limitation is now stated as a principle instead of hidden: *"Ubuntu Heritage does not and will not
  track who went"*, with the POPIA reasoning and the Kids-mode consequence spelled out. That is a
  stronger pitch than the one that overclaimed.

  Housekeeping worth naming, because it was this phase's own rot: `sim_plan.md` §3 still said **"0 of
  13 started, 179 tests"** while ten were done; `places.ts`'s header still said `coords` was required
  after SP-073 made it optional; and `experiences.ts` documented `lastChecked` as "stamped by" the
  script that must never stamp it. All three corrected. And the **pre-send checklist that SP-056 and
  §12 have both required since this morning, and which never existed, is now `sim_plan.md` §13.**

  **202 tests, typecheck clean.** Phase 7 is complete except TOUR-10's screen-reader audit, which no
  test in this repo can perform.

- **2026-09-18 (planning)** — **The two decisions that were blocking Phase 7 are made, and the build
  plan is written.**

  [docs/sim_plan.md](docs/sim_plan.md) is now the document `TOUR-*` work is run from — doc 15 keeps
  the design argument, sim_plan carries the order, the files, and the done-when for each of the
  thirteen tasks. **T7: the layer surfaces inside Atlas + Provinces, no new room**, so Architecture
  v2 **D1** stands and [shell/nav.ts](app/src/components/shell/nav.ts) is not edited — if a diff
  touches it, the scope has drifted. **T8: the v1 pilot is Soweto only**, because its four landmarks
  and its two 16 June 1976 articles are already in the repo, so zero new historical research gates
  the mechanism. Both Stage A and Stage B are unblocked. **T9 — who owns partner relationships as
  links go stale — was answered later the same day** (see below).

  Two things written down that were previously assumed. The `direct` vs `thematic` editorial rule now
  has a factual test (*did the event happen here, or did the person occupy this place?*) and a stated
  reason it is load-bearing: the two relations render differently, and collapsing them would let the
  UI imply that standing somewhere puts you where the history happened when it does not. And the
  Soweto seed is written with `[NEEDS SOURCE]` against all four places rather than plausible
  citations, because an unsourced landmark stays a bare string rather than being promoted into an
  entity with invented provenance. No `visit.url` goes into the repo unverified by a human.
  *(Superseded below: Tumo chose to have all four researched and cited, so the pilot is four places
  rather than the one or two the in-repo citations alone would have supported.)*

  **Then rewritten, same day, as the phase's decision register**, at Tumo's request: all three stages
  planned to decision level rather than task level, so there is one place to look up why any choice
  was made, from the pitch through to delivery. **12 inherited decisions** (the rename, Architecture
  v2 **D1**, the AI-art call, `T1`–`T9`) are back-filled with their origins; **50 new `SP-*` rows**
  carry a reason each; **6 are open** and every one of them names a default so no single unanswered
  question stalls the other twelve tasks. The register is append-only — a decision that turns out
  wrong is superseded by a new row, never edited away.

  Two Stage B decisions came out of the code rather than the plan. **Place detail will be an overlay
  inside `CityScreen`, not a 25th `Route` member** — [App.tsx](app/App.tsx) already records that
  inlining a stage in the route switch "made the type-checker recurse over the (now 24-member) route
  union until it stopped finishing," and `ArticleReader` is already a modal rather than a route, so
  the precedent exists. The honest cost is written down beside it: **no deep link to a place in v1.**
  And the Stage A tests cannot import `provinces.ts` at all — verified, not assumed: it `require()`s
  `.webp` assets and throws in ESM scope under `node --test`.

  One data problem surfaced that no plan doc had caught: **"Hector Pieterson Memorial" and "Mandela
  House" are listed under both Johannesburg and Soweto**, and they are in Soweto. It is now an open
  decision rather than something discovered mid-build.

  **Then all seven open decisions answered, same day, and the register closed.** Nothing in Phase 7
  is now blocked. Tumo's calls: **coordinates are kept and filled** for all four places, which makes
  each one a sourced factual claim rather than a convenience field; a place carries **`alsoListedIn`**
  so the two landmarks Johannesburg *and* Soweto both list resolve to one entity instead of a dead
  chip; **all four places get researched citations** rather than the thin in-repo line, which takes
  the pilot from one-or-two places to four and puts **8 citations + 4 coordinates** in front of Tumo
  to review; **real `thematic` candidates** are proposed for approval rather than a test fixture, so
  the "Related, never *visit this*" rule is proven by content; tests **read `provinces.ts` as text**,
  the pattern `ui-coverage.test.ts` already uses, leaving that file unedited; and **Kids mode shows
  the place but never an outbound booking link** — a child gets the heritage, not the commercial path
  out of the app. **T9: Tumo owns partner links** and checks them before every demo or send-out.

  Seven consequences were registered rather than left implicit (`SP-051`–`SP-057`), the useful one
  being that citations now land in a **review sheet, `design/places-content.md`**, before they become
  code — the convention `provinces.ts` already names for itself. TOUR-05 split into **05a** (the
  sheet) and **05b** (the code) so no citation becomes code before it has been read.

  Docs only up to this point — planning, not built.

  **Then TOUR-01 landed, and Tumo's question changed the shape before it set.** Asked before a line
  was written: *what happens when one booking covers several places?* The pitch's own flagship
  example is exactly that — "book a bike tour through Soweto" visits Vilakazi Street, the memorial,
  Mandela House and Regina Mundi — and the designed shape could not hold it. A booking hanging off a
  single `Place` forced a four-stop tour to either pick one arbitrary stop (showing "book" on
  Vilakazi Street but not Mandela House) or be copied onto all four, leaving four URLs to keep fresh
  and a reader inferring four tours. **So everything bookable became its own entity**: `Experience`
  with `placeIds: string[]`, and a museum's own ticketing is simply an Experience with one stop
  (`SP-058`, amending T2 — the place stays first-class, the booking stops hanging off it).

  Three things fell out of that, all better than the shape it replaced. **History and commerce now
  have different truth standards** and different files: a `Place` needs a citation, an `Experience`
  needs a verified URL, and `experiences.ts` has no `sources` field on purpose (`SP-059`). **The Kids
  rule became structural** — Kids surfaces import `places.ts` and never `experiences.ts`, so "no
  booking path in front of a child" is a property of the import graph rather than a button someone
  has to remember to hide (`SP-062`). And the one file that points a reader at a commercial offer is
  now the only file that does.

  `app/src/content/places.ts` and `experiences.ts` are written, both arrays deliberately empty until
  the review sheet is signed off. **The guardrails were proved rather than asserted**: a probe
  confirmed that a place with no `sources`, a place with no `coords`, an invented `kind`, and an
  experience with no places **all fail to compile**. Typecheck clean, **179/179 tests still pass**,
  no `.tsx` touched.

  **TOUR-02 followed** — `place-links.ts`, the story↔place registry. One table rather than a `places`
  field on nine content files (T3), and content → place only, with the reverse derived in TOUR-03
  rather than stored, so there is nothing to keep in sync. One finding worth recording: the join key
  needs `kind` as well as `id`, because **51 ids in `src/content` appear in more than one file** —
  `eastern-cape` is a journey stage *and* a province, `de-klerk` a journey stage *and* a president,
  and nearly every totem is also a journey stage. A bare id would have been genuinely ambiguous, not
  theoretically so. The registry knows nothing about `experiences.ts` on purpose: a link pointing at
  an experience would mean an operator folding orphans a *story*, and the history does not stop being
  about that place because a tour company closed. Guardrails proved by probe again — a link with no
  `why`, a bare-string ref, an invented `kind` and an invented `relation` all fail to compile.

  Typecheck clean, **179/179**, no `.tsx` in the diff.

  **TOUR-03 — the resolvers, and the first tests. 179 → 199.** Each resolver is a pure core plus a
  bound wrapper, so behaviour is testable before the data exists; the alternative would have left
  ordering, `kind` disambiguation and status filtering untested for three more tasks.
  `bookableAtPlace` filters to `live` **in the resolver rather than in the UI**, so a Stage B surface
  cannot render a dead or unverified booking even by mistake. Eight of the twenty new tests pass
  vacuously on empty registries, which proves nothing — so they were **mutation-tested**: a place
  with a duplicate id, a non-existent city, an unmatched `landmarkLabel`, a London coordinate and a
  stub source, plus an experience with no operator, a ghost place, a `?ref=` tracking parameter and a
  non-ISO date, turned **six of them red**. Probe reverted; 199/199 green.

  **TOUR-04** — the `direct`/`thematic` rule is written in [sim_plan §9](docs/sim_plan.md) and again
  as the doc comment where it is applied.

  **TOUR-05a — the review sheet is drafted and waiting on Tumo**
  ([design/places-content.md](design/places-content.md)). Mandela House is grounded on the Soweto
  Heritage Trust's own record — 8115 Vilakazi Street, heritage status 16 March 1999 — which is
  exactly the institution-first standard SP-054 asks for. The memorial rests on SAHO.

  **Three findings, and two of them block the seed.** First: **no coordinate can be sourced to
  SP-054 standard.** Museums publish street addresses, not decimal coordinates; the only candidates
  are Wikipedia, which SP-054 does not admit — so by the project's own rule the four coordinates
  cannot ship (`SP-067`, blocks TOUR-05b). Second: **a street has no coordinate** — Vilakazi Street
  can carry a representative point at best, the same shape problem that made a bike tour an
  `Experience` (`SP-068`). Third, and not blocking but worth Tumo's judgement: the **"only street in
  the world to have housed two Nobel laureates"** line already in `provinces.ts` is a superlative
  that South African Tourism, Brand South Africa, CNN and Mandela House all repeat and **none
  evidence.** That Mandela and Tutu both lived there is solid; the superlative is not.

  Regina Mundi's founding date is **genuinely contested** — 1960 groundbreaking/1962 completed versus
  "built in 1964", with Wikipedia contradicting itself — so every date was left out of its entry
  rather than guessed. One `thematic` candidate is proposed and one rejected: `module:vilakazi` →
  `vilakazi-street`, because **the street is named after the poet whose *Inkondlo kaZulu* (1935) is
  the app's fourth literary pillar** — the literary core reaching the tourism layer from the other
  direction. The rejected one, `herstory-soweto-erasure` → `regina-mundi-church`, was dropped because
  the article never mentions the church: linking them would have been inventing the connection.

  **Then the sweep widened to every city, and the research changed what the job is.** Tumo asked for
  every landmark clickable, not Soweto alone — right on the merits, and **no code change was needed**:
  `placeForLandmark` is city-agnostic, which Johannesburg proved with no special-case code. The
  blocker was never code. It was that the repo knew nothing about 71 of 75 landmarks but the string.

  The classification pass was worth more than the research. It is **73 unique places, not 75**. **Six
  are not places at all** — "the wine estates", "the goldfields headgears", "the traffic-circle street
  plan", "the Kruger's southern gates", "the historic gold-rush streets", "Mmabatho" — phrases and
  plurals, not somewhere you can stand, so they stay strings (SP-071) and the real number is **67**.
  Four strings conflate several places, worst of them "Nelson Mandela Museum", which is **three**
  sites two of which `provinces.ts` also lists separately. And two entries look wrong: Thulamela is
  filed under Thohoyandou but sits in the northern Kruger, and Sun City is a commercial resort in a
  list otherwise made of museums, memorials and sacred places.

  **`coords` became optional (SP-073)** — not a concession to volume but to fact. A third of the list
  has no single point: the Magaliesberg and Makhonjwa are ranges, Algoa Bay a bay, the Msunduzi a
  river, District Six and Bo-Kaap districts, Qunu and Mvezo villages, Vilakazi and Dorp streets.
  Keeping it required would have blocked a third of the sweep **including Vilakazi Street, which the
  whole pitch rests on**.

  **SP-072 is the finding that matters most, and no plan anticipated it.** Lake Fundudzi is among the
  most sacred Venda sites and access is controlled by its custodians; Thathe Vondo forest is a holy
  forest. A "plan a visit" button on either would be this layer overriding a living custom — a harm
  that acts on the world rather than merely asserting something false. `Place.access:
  "sacred-restricted"` now exists **and a test fails if any `Experience` lists such a place**, so the
  guarantee is in the data rather than in a component someone might forget. Mutation-tested: a tour
  booking Lake Fundudzi turns the suite red.

  **All 67 are now drafted** — the last 22 turned up the two findings that matter most. **Thathe Vondo
  forest is a stronger case than Lake Fundudzi, not a weaker one**: ordinary Venda people may not walk
  in it, and the taboo extends to visitors, so the app would be inviting people into a place the
  community itself does not enter. And **Bumbane Great Place is the home of the reigning aBaThembu
  king** — a living residence and a seat of living authority, currently the subject of a succession
  dispute, not a heritage site. `Place.access` now carries `"sacred-restricted" | "living-residence"`
  and the guard blocks on `access` being set **at all**, so a category added later is protected by
  default rather than by someone remembering (SP-074, SP-075).

  Nine places are recommended to stay bare strings on top of the six that are not places — commercial
  attractions and geographic features with no story the repo can tell, because a card that says
  nothing is worse than a plain chip. That leaves about **45 ready to seed** on sign-off.

  ~55 grounded to the SP-054 standard, the rest marked `[VERIFY]` or
  `[NEEDS SOURCE]` rather than guessed. Two happy findings: **Sol Plaatje turns up twice** — his house
  museum in Kimberley and a dedicated display in the Mafikeng Museum, where he kept his siege diary —
  so the literary core reaches the tourism layer in three cities now, counting Vilakazi Street. Two
  superlatives are flagged as repeated everywhere and evidenced nowhere. **201 tests, typecheck clean.**

  **TOUR-05b: 49 places seeded, across 18 of the 19 cities.** Tumo's instruction was to seed what has
  sources, so that is what shipped — every entry names a real one, and the `landmarkLabel` cross-check
  against `provinces.ts` passed on the first run, em-dash and all. **The chips are now live in the
  app**, which is what was asked for three turns ago.

  What was held back is the point. Three entries could not be grounded at all (`castle-of-good-hope`,
  `bo-kaap`, `cookes-lake`). Nine have no story this repo can tell — Sun City, Gold Reef City, uShaka,
  the Golden Mile, a stadium, a river — and a card that says nothing is worse than a plain chip. Six
  are not places. Three are access-restricted and wait on Tumo. All of them stay bare strings, which
  is exactly what SP-028 is for, and the app is honest in every one of those cases.

  **One miss, found and fixed in the same pass:** Polokwane had been researched and then left out of
  the sheet entirely, while I claimed every landmark had been looked at. It had not. Bakone Malapa and
  the Irish House are now written up and seeded, which took the count from 47 to 49 and the coverage
  from 17 cities to 18. Only Welkom now has no place, and that is deliberate.

  **Stage B, built against a throwaway fixture that was never committed.** Two new
  components (`VisitPanel`, `PlaceView`), one extracted helper (`services/openExternal` — leaving the
  app now has exactly one owner, and `noopener,noreferrer` is not copied around), and edits to
  `ProvincesScreens` and `ArticleReader`. `shell/nav.ts` and `App.tsx` untouched, so Architecture v2
  **D1** stands and the route union was not grown.

  The Kids rule drew the component boundary rather than taste. Because Kids surfaces may never import
  `experiences.ts` (SP-062), `PlaceView` **cannot** import it either — so it carries heritage only and
  receives the commercial half as a slot. The heritage component now has no way to render a booking
  path, which is a stronger guarantee than remembering to hide a button.

  **Seen working in a browser, not just asserted.** With the fixture seeded, all four Soweto landmark
  chips became buttons exposed to the accessibility tree as `button "Vilakazi Street — open this
  place"`, and the place overlay rendered Mandela House showing **only** the `live` experience — the
  `unverified` one, deliberately named "must not render", stayed hidden. That is SP-019 holding in
  rendered UI rather than in a unit test. The four-stop bike tour surfacing at one of its stops is the
  shape Tumo's multi-place question forced, working.

  **Two guards mutation-tested**: dropping Venda from a `UI` block and adding an `experiences` import
  to `KidsScreen.tsx` turned the language sweep and the Kids import test red, then were reverted.

  **One thing could not be verified and is not claimed.** The `VisitPanel` inside the article reader
  is correct in the DOM — right coordinates, opacity 1, topmost by `elementFromPoint` — but the reader
  modal does not composite into a screenshot. Restoring `ArticleReader.tsx` to its **committed** state
  reproduced it exactly, so **this is pre-existing on `main`, not Stage B**. Whether a human sees the
  reader correctly is still unconfirmed and worth thirty seconds of Tumo's time.

  Fixture removed and verified by hash against the pristine files; zero `FIXTURE` residue in `src/`.
  Typecheck clean, **199/199**. **Stage A is 4 of 5.** `TOUR-05b` is deliberately not started — SP-053 says nothing reaches
  `places.ts` before the sheet is reviewed, and SP-067 blocks the coordinates regardless. `4 of 13`
  `TOUR-*` done, all three registries still shipping empty.

- **2026-09-17 (planning)** — **The tourism pitch gets an implementation plan, and the pitch gets an
  honest paragraph about AI.**

  [docs/15-heritage-tourism-plan.md](docs/15-heritage-tourism-plan.md) turns the two partnership
  drafts into `TOUR-01–13` in three staged gates. The useful finding was how little is actually new:
  the places, the sourced stories, the consent flow and the rights gate all exist, and
  [ingest/rights.ts](app/src/services/ingest/rights.ts) *already implements in code* the pitch's rule
  that literature is used only where rights are clear — `"unverified"` blocks ingest and publish.
  **Four things genuinely don't exist:** nothing models a bookable operator, `landmarks` is a bare
  `string[]` (Soweto already lists the pitch's own four landmarks that way), no relation joins a story
  to a place, and nothing would notice a dead booking link. Soweto is the pilot seed because the
  content is already there.

  **The AI claim was softened rather than the product changed** — Tumo's call: AI illustration stays
  until better visuals come from people. The pitch had said, in the present tense, that AI generates
  neither narrative nor visuals; the app does generate visuals with Gemini (Pollinations as runtime
  fallback). It now says what is true and is a stronger claim for it: **no historical claim is ever
  AI-generated**, images are AI-illustrated and labelled "Artistic interpretation" in all 11
  languages, never presented as photographs of real people, and commissioned/community artwork
  replaces them story by story as it becomes available. A partnership could accelerate exactly that.

  **One claim in the pitch is still wrong and is now a task.** §3 calls the contribution "direct,
  **traceable**." Traceable needs per-person click attribution, which is what POPIA compliance exists
  to prevent and would apply to minors in Kids mode. v1 can report places and operators linked, not
  conversions — TOUR-13, and the wording should change before the document is sent.

  Also still open in those drafts: §7, the actual ask, is an unfilled placeholder; the byline says a
  3-person team while CLAUDE.md says solo; and both call the product "Maloba" after the 3 Jul rename
  to Ubuntu Heritage. No app code touched.

- **2026-09-10** — **The dates were fiction, and the build was never as verified as it looked.**

  Every date at the top of the three entry-point documents was wrong. `CLAUDE.md` opened with "today
  is **2026-06-29**", `docs/00-project-plan.md` with the same, and this board with "today:
  **2026-08-26**" — while the actual date was **2026-09-10** and the last commit on `main` was
  2026-08-30. A reader arriving at `CLAUDE.md` was told the concept deadline was ten days away when
  it had passed two months earlier. All three now carry the real date, `docs/00` is marked as the
  historical document it is, and the hackathon phase table's heading no longer says "(complete)" over
  three rows that are not.

  **What was deliberately not written: an outcome.** Nothing in this repo records whether the 9 July
  concept submission was made. No log entry says it was; none says it was missed. The gap in the log
  runs 8 Jul → 26 Aug, straight through the deadline, the finalist announcement and the showcase. The
  temptation was to infer — the narrative is drafted and the video never was, so *probably* — and
  inferring is exactly what [AGENTS.md §4](AGENTS.md) forbids when the subject is the record itself.
  The ⬜ marks stay, relabelled **❓ unrecorded — needs Tumo**, and the question now sits above
  everything else on this board. **Only Tumo can close it**, and the answer decides what the
  remaining work is *for*.

  **Then the verification, and it did not start where it was meant to.** `npm run typecheck` failed
  immediately: **`app/node_modules` did not exist at all.** The tests had already passed 179/179
  before that was noticed — because they are pure-logic and Node 22 strips types natively, so they
  run with no dependencies installed whatsoever. That is a genuinely useful property of how they were
  written, and it is also a trap: **a green test run here is not evidence the project is
  installable.** `npm ci` then failed twice with Windows `ENOTEMPTY` against a half-written
  `node_modules`; a hard delete and a clean install fixed it, and nothing was holding the directory —
  no dev server, no stray process.

  Verified from a clean install: **`npm run typecheck` clean** · **179/179 tests pass** · `npm ci`
  succeeds from the committed lockfile (all three on 2026-09-10) · **`npm run build:web` green**
  (2026-09-11) — `expo export` produced a **3.9 MB** JS bundle and the PWA post-step precached the
  **10-file, 4.13 MB shell**, which is the 4.1 MB first-open cost the payload table above claims, now
  re-measured rather than remembered. Total `dist` is **564 files, 267.45 MB** — media is in the
  build output but deliberately **not** precached, which is the whole point of PWA-03 on a metered
  line. The counts in [docs/10](docs/10-status-and-roadmap.md) were stale in two places — it claimed
  **85** tests in one section and **117** in another — and both now read 179.

  No app code was touched. V2-12, EL-05 and PWA-05 are unchanged and still need a human.

- **2026-08-30 (planning)** — **Voice-per-story and emotional tone added to the backlog as VOICE-01–07,
  not built.** Tumo asked that the narrating voice suit the story and its theme, and that the tone
  carry the emotion — and asked for it to be planned rather than built now. Written up in
  [specs/tasks.md](specs/tasks.md) with the three non-obvious constraints stated up front: the
  narration cache key does not hash delivery settings (so tone changes would silently collide),
  the nine indigenous languages cannot be given a tone at all, and every re-cast re-spends
  characters out of a 40 000/month quota. Nothing in `services/tts/` changed.

- **2026-08-30 (later still)** — **All 54 country files researched. No scaffolds left in `countries/`.**

  The 51 remaining scaffolds were filled with sourced research: **languages and their legal status,
  the national anthem, a milestone spine, peoples, literature and heritage — each claim naming the
  numbered source it came from.** Sources were Wikipedia country pages, `nationalanthems.info`,
  per-country UNESCO World Heritage lists, and targeted literature searches; every file says out loud
  that these are **encyclopaedia-grade, not primary**, and ends with **Open questions** listing what it
  still needs. Where a section is empty it states whether that is *a gap in the research* or *a fact
  about the country* — the distinction matters and the files keep it.

  **What this deliberately is not:** Botswana-depth narrative for all 54. That could not be produced
  truthfully in one pass, and writing it from memory would have been the fabrication-at-scale this log
  already refused once.

  **Six findings that cut across files and are worth more than any single country entry.**

  🔴 **1. Africans have been inventing writing systems for two thousand years.** **Ge'ez** in Ethiopia
  and Eritrea, attested in a 3rd-century inscription and still the everyday script of Amharic and
  Tigrinya. **Vai** in Liberia, c. 1833, said to have come to Momolu Duwalu Bukele in a dream, taught
  in schools he built, used for letters, diaries, accounts and jewellery engraving — and the source
  records that **"since the 1830s, at least 27 new scripts have been invented for West African
  languages."** **N'Ko** in Guinea, built by Solomana Kanté in 1949 for the Manding languages and named
  with the words *"I say."* **Osmanya** in Somalia. The premise that African heritage is oral and
  therefore fragile is true of a great deal and **demonstrably false as a general claim** — and this is
  the strongest single argument the research produced for the submission narrative.

  🔴 **2. The first novel published in any African language was written in Sesotho** — Thomas Mofolo's
  *Moeti oa Bochabela*, **1907**, Lesotho — and his *Chaka* (1925), a Sesotho novel about Shaka,
  **predates the publication of *Mhudi* (1930)**. **The app already speaks Sesotho** and has
  `reviewedContent: false` for it. Every other major literary find is in a language the app does not
  have; this one is not. **This is the most actionable content proposal in the whole folder.**

  🔴 **3. Enoch Sontonga's melody is continental infrastructure.** *Nkosi Sikelel' iAfrika* is the
  national anthem of **Tanzania** (as *Mungu ibariki Afrika*, adopted 1961 — **before South Africa**)
  and **Zambia** (*Lumbanyeni Zambia*, 1964), sits inside South Africa's own, and **Zimbabwe left it in
  1994** by public competition, specifically because it wanted a song that was only its own. A Xhosa
  schoolteacher's composition, four countries, and a live argument about shared versus national
  heritage. **If one anthem recording is sourced for `/countries`, it should be this cluster.**

  🔴 **4. "African rhythms inside a European form" is a continental method, not six coincidences.**
  Kourouma bending French (Côte d'Ivoire), Craveirinha putting African rhythm in Portuguese verse
  (Mozambique), Silá and Semedo subverting Portuguese with Crioulo (Guinea-Bissau), Tutuola carrying
  Yoruba tales into English (Nigeria), Sutherland staging Ananse (Ghana) — and **Nuruddin Farah, whose
  prose alliteration is inherited from his mother Aleeli, an oral poet** (Somalia). Beside Vilakazi
  and European metre, that is the project's own thesis, evidenced in six countries.

  🔴 **5. The creole league table.** Eleven creoles across nine countries — Krio reaches **97%** of
  Sierra Leone, Kriol **94%** of Guinea-Bissau, Mauritian Creole **90%** of Mauritius — **and only two
  hold full official status** (Sango in the CAR, Seselwa in Seychelles). Meanwhile Mauritius's de facto
  official English is the home language of **0.6%**. The gap between what a country speaks and what its
  law names is the folder's most repeated finding.

  🔴 **6. Swahili should be the app's twelfth language.** Official or national in **five** researched
  countries — Tanzania, Kenya, Uganda, Rwanda, the DRC. The app has none of it. Four separate files
  reach the same recommendation independently.

  **Three concrete corrections to data already shipping**, each needing its instrument verified first:
  **Namibia** recognises **Setswana** nationally and it is missing from the `na` entry (the app has
  `tn`); **Lesotho**'s source names **isiXhosa** as official and the `ls` entry has only `st`/`en` (the
  app has `xh`); **Zimbabwe**'s constitution "embraces only two nationally, Shona and English", which
  sharpens the honest-technicality comment already in the code. Plus one new entry worth adding —
  **Mozambique**, whose Tsonga is the app's Xitsonga.

  **And the blocker restated:** for most of the 54 the app speaks **none** of the country's languages,
  and `country-languages.ts` still cannot say so, because `lead` is a required `LangCode`. **LANG-03
  cannot move much past Southern Africa until that shape exists.**

  **Handled with the care the integrity rule requires, not written up:** the Herero and Nama genocide
  (Namibia), the Congo Free State, the 1994 genocide against the Tutsi and the colonial construction of
  Hutu/Tutsi categories, Mauritania's three abolitions of slavery and the Haratin, Dahomey's role in
  the slave trade, and the Mfecane read from four northern vantages. Each is flagged in its file with
  what it needs before it can be shown to a reader. **Three live sovereignty disputes** — Western
  Sahara, Mayotte, Chagos — are each marked as disputed with the parties named, and the app needs
  **one** agreed wording rather than three ad-hoc sentences.

  `countries/README.md` rewritten: the two file shapes documented, all 54 marked, and the cross-file
  findings pointed at from the LANG-03 section. **No app code touched.**

- **2026-08-30 (later)** — **`countries/`: Burkina Faso restructured, and the Botswana shape becomes
  the house pattern for a researched country.**

  Tumo's Burkina Faso research had landed in the file as a raw paste — the scaffold's empty template
  sections still sitting above it, the demographic table flattened into tab-separated fragments, and
  14 references stacked three lines to an entry with "Opens in a new window" between them. It now
  follows [`bw-botswana.md`](countries/bw-botswana.md) exactly: **summary sections built only from
  claims made in the narrative** (every row naming the § it came from), **the report carried
  verbatim** — verified line by line against a backup of the original, not a word changed — and
  **the sources reformatted** with an honest note on what they are worth.

  **Two things the restructure surfaced that more research would not have.**
  *One:* among the 14 sources is **`r/imaginarymaps`**, a Reddit community for **fictional**
  alternate-history maps, sitting in a file whose single rule is that nothing is invented. Logged as
  the top open question — not "a weak source" but a disqualifying one, and the job now is finding
  what rested on it.
  *Two:* **Burkina Faso cannot be added to `country-languages.ts` at all**, and not for want of
  research. `lead` is a required `LangCode` — one of the eleven South African languages — and Ubuntu
  Heritage speaks **none** of Mooré, Dioula, Fulani, Berber or French. The structure has no shape for
  *"we speak none of what is spoken here"*, which will be the honest answer for most of the 54.
  **LANG-03 cannot move past Southern Africa until that shape exists.**

  Also: `countries/README.md` gains a **How a researched file is laid out** section (summary sections
  → verbatim report → sources), `_TEMPLATE.md` points at it, the "all 54 are scaffolds" line is true
  again (51), and Botswana's own claim about its sources was corrected — 12 Wikipedia entries and a
  Wikibooks, not 11. No app code touched, and no research done for any other country.

- **2026-08-30** — **KTR-02: a clean solve is finally worth more than a corrected one. PWA-06: a
  13 MB film asks before it spends someone's airtime. And ElevenLabs becomes the narration voice —
  for the two languages it can actually speak.**

  **KTR-02.** KTR-01 made a wrong answer *stop* you; it still left a stage solved perfectly worth
  exactly as much as one solved on the fourth attempt. `recordSolve` replaces the bare `recordQuiz`
  call: it keeps the best attempt, pays a bonus star per question answered without a correction, and
  counts a run of cleanly-solved stages. Four rules, each pinned by a test rather than by intent —
  **nothing is ever taken away** (stars, best run and the stored tally only rise); the bonus pays the
  **improvement**, once, so re-walking a stage you aced pays nothing and a shaky first pass can still
  be improved on later; the run advances on a stage's **first** clean solve and on nothing else,
  because otherwise re-opening one easy stage seven times "earns" a streak of seven; and **a
  milestone with no authored question decides nothing** — not a win, and emphatically not a break,
  which matters a great deal while 12 of the 25 milestones have no question yet. A broken run is
  never announced anywhere in the UI; `bestStreak` is stored separately precisely so the record of
  the best one survives. The `progress.test.ts` allow-list grew by exactly one key — `solve`, three
  counters, nothing time-stamped, nothing that identifies anyone — and it grew as a reviewed line of
  this change, which is the entire point of having an allow-list.

  **PWA-06.** The measured payload table said a story costs ~0.3 MB and a film costs 12.8 MB, and
  1816 plays **two** back to back — so one tap on "Watch the film" could pull 24 MB down a prepaid
  line with no warning at all. The low-data promise in [docs/07](docs/07-accessibility.md) was not
  honest while that was true, and caching does not help a first view. Now the button carries the real
  size and anything over 2 MB opens a gate **before the `<video>` element mounts**, because mounting
  it *is* the download. The gate states the cost and leads with "Play it anyway" — it exists to
  inform, not to talk anyone out of watching — and "don't ask again on this device" is remembered, so
  a reader on uncapped fibre meets it once. The one thing that checkbox cannot silence is an active
  **data saver**: that is a switch a person turned on in their browser or their phone, and a box
  ticked in this app last month does not get to cancel it. The sizes are declared next to each
  `require()` and `journey-media.test.ts` stats the real files, because a film re-cut without updating
  its number would quote a reader the wrong price for their airtime. **The films were not
  transcoded** — this change makes the cost honest, not smaller.

  **ElevenLabs.** Tumo's key was tested against the live API: valid, starter tier, 40 000 characters a
  month, instant voice cloning available, and four South African English voices already on the
  account. Then `GET /v1/models` was read, and it changed the design. Of our eleven languages
  ElevenLabs speaks **English and Afrikaans**; it does not speak Setswana, isiZulu, isiXhosa, Sepedi,
  Sesotho, siSwati, Xitsonga, Tshivenḓa or isiNdebele — and, crucially, it does not *say* so. Send it
  Setswana and it returns fluent, confident, wrong pronunciation. That is the exact harm
  [AGENTS.md §4](AGENTS.md) exists to prevent and the same reason
  [docs/14](docs/14-game-architecture.md) blocks challenge format F4. So the engine is chosen per
  language: ElevenLabs (Amara — Warm African-British) for English and Afrikaans, Botlhale for the
  nine, on-device underneath everything as the rung that always exists. `select.test.ts` asserts, for
  all nine and under every key combination, that ElevenLabs never appears on their ladder at all —
  the integrity rule as a test rather than a comment. Output is 32 kbps, not 128: PWA-06 had just
  finished measuring what generosity costs, and the same line is 34 KB against 6 KB. Every clip is
  cached on text + language + voice so a passage is paid for once, which is what lets the Listen
  button survive a month on 40 000 characters. Two things stay open and are logged as tasks, not
  hidden: **nobody has listened to a clip** (EL-05 — no test in this repo can hear), and the key is
  **bundled to the client** and must be rotated after the demo (EL-06).

  Verified: `npm run typecheck` clean · **179/179 tests** (136 before this session) ·
  `npm run build:web` green.

- **2026-08-27 (evening, later)** — **KTR-01 done: solving is now what moves you. Plus the language
  picker follows the country, and `countries/` opens for research.**
  **KTR-01.** A wrong answer no longer walks past you. It shows the sourced correction and hands the
  same question back with its options **reshuffled**, so answering again is a re-read rather than
  tapping a remembered position. You still cannot fail out — there is no penalty and no lost
  progress; what a wrong answer costs is the **first-try credit**. The reward card's score changed
  meaning accordingly: it now counts questions solved **without** a correction, which is the only
  version of that number that says anything. `recordQuiz` is finally called after being written and
  unit-tested since v2 — and it is called on re-visits too, because every reducer behind it is
  idempotent and `recordQuiz` keeps the best attempt, so returning to solve a stage cleanly can raise
  a score and never lower it.
  The shuffle lives in `content/quiz.ts`, not in the screen, specifically so it can be tested: three
  new tests pin that reordering keeps every option exactly once, never moves which one is correct,
  and actually permutes. A presentation trick that could silently change an answer is exactly the
  kind of thing that must fail a build rather than a reader.
  **The language picker now follows the country.** Choosing Botswana leads with **Setswana**, Lesotho
  with **Sesotho**, Eswatini with **siSwati** — because those genuinely are those countries' national
  languages, not because we mapped them by resemblance. It **groups, never filters**: a language you
  can read never disappears because of where you said you were.
  New sourced data in `content/country-languages.ts`, deliberately **only six countries** — `za` `bw`
  `ls` `sz` `na` `zw` — each citing the constitution or government source that makes the claim. Every
  other country falls back to the flat eleven-language list, which is the honest default. Filling in
  54 from memory would have been fabrication at scale.
  It also **names what we do not have**: pick Namibia and the picker says Oshiwambo, Otjiherero,
  Khoekhoegowab and German are spoken there and are not in Ubuntu Heritage. A picker showing only
  what we happen to support would quietly imply a country speaks only that.
  **The trap that shaped the data:** Zimbabwe's *Ndebele* is **Northern** Ndebele, a different
  language from South Africa's isiNdebele (`nr`). Mapping one to the other would have been a
  plausible-looking falsehood, so Zimbabwe's Ndebele is listed among the languages we lack — and a
  test now fails the build if anyone ever "fixes" that.
  **`countries/`** — a folder for Tumo's per-country research, one `.md` per nation, named by the same
  ISO code the flags use. Its README says which sections already feed code (Languages → the picker;
  Anthem → `/countries`) so the research lands somewhere instead of sitting in a drawer, and
  `za-south-africa.md` is filled in as a worked example from material already in the repo.
  **LANG-04, decided by Tumo the same evening: switch, but only while untouched.** Choosing a country
  now also switches the UI to that country's leading language — pick Botswana and the app comes up in
  Setswana. The moment the reader picks a language by hand, nothing overrides it again. Silently
  changing a language someone deliberately chose is worse than not being clever.
  Which language "leads" is itself a claim, so it is a `lead` field with its own justification rather
  than "whatever happened to be first in the array": South Africa leads with isiZulu (Census 2022
  home-language share — the Constitution lists the eleven **without** ranking, so the list and the
  order have different sources, and the note says so). Zimbabwe leads with English on an honest
  technicality, spelled out in the file: its two largest languages are Shona and Ndebele and we have
  neither, so English leads only among the languages we actually speak there.
  Verified: typecheck clean · **131/131 tests** · web bundle green.

- **2026-08-27 (evening)** — **Game layer decided: Know the Road v3, D7–D9.**
  Compared the "Know the Road v2" proposal against what the code actually does, and the proposal was
  right about the thing that matters. **The v2 loop looks like a game and is not one:**
  `StageScreen.finish()` awards the heritage card and all 50 stars **whether or not a single answer
  was right**; the score is rendered once and thrown away; and `recordQuiz` and `stampCountry` are
  written, unit-tested and **called by nothing** — the same dead-reducer pattern `setWatched` had
  until this morning. A reader can guess their way to a full Passport and the app congratulates them.
  On a project scored 30% on Humanities Depth that is the most expensive gap we have.
  **D7 — solving replaces landing.** Wrong answers are corrected and retried, never penalised.
  **D8 — no server, no accounts, no network play; competition is pass-and-play on one device.** The
  proposal's networked Arena would store a persistent per-device handle plus timestamps on a server:
  personal information by linkage, on a product used by children, where POPIA §35 applies. Its
  mitigation — "default off for under-13 Kids-mode devices" — **cannot be built**, because the app has
  no age signal and by design never will. Parked behind an explicit decision with Tumo, not rejected.
  **D9 — no timers outside pass-and-play.** Depth is the difficulty. A timer excludes the elders and
  children this is for.
  **Dropped from the proposal: the anti-AI hardening.** Canvas-rendered question text and answer-time
  forensics are cost with no return, and the proposal contradicts itself — F2 and F8 are plain text,
  pasteable inside a 15-second round, and are the two it schedules first. The real defence is that
  **winning buys nothing**: no wagering, no public losses, no rank.
  **Kept: the format catalogue**, which is the treasure and needs no competition to be worth building
  — F1 alone is free, since 22 totem calls are already bundled in `assets/animals/sounds/` and used
  only by Kids mode today. **F4 stays blocked**: its choices must be spoken in the language, and the
  only voices we could synthesise are the drafts already labelled unreviewed. No content, no format.
  **Corrected the record.** The proposal misdescribed the repo in four places, and two of the errors
  were ours: the quiz bank is **14 questions, not 17** (STATUS and docs/10 both said 17 — fixed);
  there are **27 totems, 22 with calls**; Supabase **Realtime is used nowhere**; and
  `roll-the-road-architecture.md`, which the proposal claims to supersede, **is not in this repo**.
  Plan: [docs/14-game-architecture.md](docs/14-game-architecture.md) · backlog: Phase 6, KTR-01…10.

- **2026-08-27 (later)** — **V2-15, V2-07 and V2-11 done. Architecture v2 is 30 of 31.**
  **V2-15 `WatchItemScreen` — the reason this was the load-bearing one.** `/watch` used to hand
  straight off to the `CinematicReader`. The Reader is a fine player but it is a *book*: a scene's
  sourcing lives in the margin of one paper page, visible only while you are on that page. The plan
  asked the watch page for a standing **Sources & provenance** block, and that is now what it has —
  what the film is adapted from (`module.source`), the passage behind **every** scene (each
  `scene.sourceNote`, tappable to jump there), the AI-imagery label, the full `references[]`, and the
  project's one rule in the reader's own language. **Not one word of it is authored**; it is all read
  off content that has been in `src/content/*.ts` since the modules were written. The data was always
  there — nothing had ever put it in front of a viewer.
  Also on the page: the scene player with a chapter-tick strip, the Child⇄Adult toggle, the language
  picker, Listen, "Continue the journey", "Open the full reader" (the Reader is unchanged and one tap
  away) and "Ask Ubuntu about this story".
  **Two things fell out of building it.** `progress.setWatched` existed, was unit-tested, and was
  **never called by anything** — so the "% watched" pill on the Watch cards was always 0. The watch
  page now reports its position and those pills mean something. And the chatbot had no way to be
  asked a question by a screen, so `services/chatbot/askBus.ts` is a one-listener bridge: the widget
  registers on mount, a page calls `askUbuntu(question)`. Deliberately a no-op when no widget is
  mounted rather than a crash.
  **V2-07 Home rebuilt to the planned order** — Hero → Continue → Watch rail → Journey preview →
  Countries → Atlas → Kids/Schools → Archive. The bookshelf **is** the watch rail (the four pillars
  are what the library leads with) and gained "Browse the whole library →". The Journey preview and
  the continent band read from `history-trail.ts` and `anthems.ts`, so the years, the milestone count
  and the 54 flags on the front page cannot drift from the data. **What changed for the worse and why
  it is still right:** Provinces, Presidents, Heroes, Totems and National Days each lost their own
  full-width band. They are rooms *inside* the Atlas hub, and six Atlas bands on one page was the old
  architecture arguing with the new one. They keep a labelled chip row under the single Atlas section,
  so nothing lost its shortcut from Home — but it is a real reduction and Tumo should look at it.
  **V2-11 Archive's Trust sub-nav** — the Heritage Ledger and Sources & provenance now sit at the top
  of the Archive itself, not only in the footer. A room that asks a person for their voice should show
  its own receipts in the same room.
  **V2-12 partly advanced, deliberately NOT ticked.** Added `src/routes.test.ts`: it parses the
  `Route` union, `renderRoute` and `nav.ts` and fails if a route loses its case, if a nav item or
  mobile tab points at a room that does not exist, or if the chatbot's orchestrator cannot open one.
  That closes the "dead nav item" class of regression. It does **not** close the gate — no test here
  can see a layout, and the browser re-walk still needs a human.
  Verified: typecheck clean · **117/117 tests** · web bundle green.

- **2026-08-27** — **Architecture v2: 27 of 31 tasks done — every room in the D1 nav is live and real.**
  **V2-20** the resume bar — and it renders **nothing** until a stage is actually finished. A bar
  reading "Chapter 1 · 0%" on a first visit makes an empty app look like a chore list.
  **V2-28 i18n as a test, not a sweep.** `i18n/ui-coverage.test.ts` walks every `const UI` block in
  every component and fails the build if a string is missing any of the 11 languages, or is an empty
  placeholder in one. It inspects **331 strings across 28 files** and all pass. I negative-tested it
  by deleting one `nr` string: it failed and named the exact file, key and language. Content is
  deliberately **out of scope** — a scene carries English plus what has actually been reviewed, and
  forcing 11 languages onto it would invite the fabrication the project forbids.
  **V2-29 a11y.** Every `Pressable` in every v2 room now carries a label and a role; 13 were missing.
  **Known gap, stated plainly:** 25 `Pressable`s in **pre-existing** screens (ArchiveScreen,
  CinematicReader, ConsentSheet, LanguagePicker, ProvincesScreens, SideIndexScroll, ArticleReader,
  HeritageLedgerScreen, ChatbotWidget, CountryPicker) still lack labels. Retrofitting them is real
  work on working code and was **not** in the v2 scope — it should be its own task, not smuggled in.
  **V2-30 POPIA** — reviewed and written up in
  [docs/05-popia-compliance.md](docs/05-popia-compliance.md). No v2 surface collects personal
  information; verified mechanically that no `fetch`, Supabase call or upload path exists anywhere in
  the new rooms or the progress store. The only text inputs are two search boxes, which are local
  filter state.
  Verified: typecheck clean · **112/112 tests** · web bundle green.

- **2026-08-26 (late night)** — **Week 3 rooms built: Passport, Kids, Schools (V2-22 → V2-27).**
  `PassportScreen` — level, stars, streak, journey progress, the 27-totem card grid with locked slots,
  country stamps, and a two-step **"Forget everything"** erasure. It deliberately holds no name, no
  photo and no account: a passport is normally the most identifying thing a person carries, and this
  one carries none of it, which is why it can be shown to a child with no consent flow.
  `KidsScreen` + `KidsStageScreen` — real greetings per language, an animal of the day, and a picture
  quiz that asks for the **real totem term** in the reader's own language family (Tau, Nkwe, Kwena),
  so a child learning "Tau is the lion" has learnt something true and sourced. No penalty, no timer.
  The grown-ups gate is a 3-second hold — friction, not security, and the comment says so rather than
  implying a lock that isn't there.
  `SchoolsScreen` — a working dashboard over **seeded demo data**, with the demo banner on screen at
  all times rather than in a footnote. Under D5 the app holds no learner records, so there is nothing
  real to show; a plausible-looking dashboard that didn't say so would be a lie told in UI.
  CAPS alignment is claimed only at **topic level** against the DBE Senior Phase document — no outcome
  codes are invented, and `schools.ts` says outright that any specific code must be read from CAPS itself.
  Deleted `ComingSoon.tsx` — every room is now real, which is what its own comment said to do.

- **2026-08-26 (late)** — **D2 reversed at Tumo's request, and the second sound credit got its face.**
  The hero walk is now confirmed as the **free trailer**: "Start the journey" opens the SA road in
  place, exactly as it always did, no lock and no sign-in. The deeper staged `/journey` page is reached
  from the nav and is where future chapters will be locked. `onStartJourney` stays in `useHomeJourney`
  as a documented escape hatch but is **deliberately unwired** — the comment now says that instead of
  claiming the opposite. Plan §2, §3 and V2-06 updated so the doc no longer contradicts the code.
  Footer: pulled the real **Baobab Roots Collective** channel avatar (the baobab-and-roots mark) and
  bundled it at 160×160 webp to match African Tribe Echoes exactly; the Lucide placeholder is gone.

- **2026-08-26 (late)** — **The core loop is closed: Journey + stages + quiz (V2-16 → V2-19).**
  `JourneyScreen` walks all **25 real milestones** from `history-trail.ts` rather than the source
  design's twelve invented chapters — sourced history costs nothing extra and is better history.
  A stage opens when the one before it is done; finished stages stay open, so progress is never taken
  away. `StageScreen` runs wireframe 2e: **WATCH → QUIZ → REWARD**, with a heritage card from
  `totems.ts` assigned in order so a stage always yields the same card.
  **Grounding (V2-17):** 14 questions across 13 milestones in `content/quiz.ts`, each answerable from
  the milestone's own cited note. Two rules hold: a distractor is normally a *real* fact from another
  milestone, so a half-remembered wrong answer is still true; and every question carries an
  explanation shown either way. The one deliberate exception is the "the land was empty" option at
  1652 — the terra nullius myth, offered **only** so choosing it is corrected on the spot. A test pins
  that it can never become the correct answer.
  **D2 is now live:** the hero's "Start the journey" hands off to `/journey` instead of opening its
  in-place overlay; the seam added in V2-06 is wired through `HomeGallery`.
  Verified: typecheck clean · **109/109 tests** · web bundle green.
  **Note on the toolchain:** the typecheck ran >7 min twice today and once reported an error against a
  file version that no longer existed on disk. Treat a single tsc result as suspect if files changed
  under it — re-run before believing it.

- **2026-08-27** — **The Journey is live: V2-16, V2-17, V2-18, V2-19 done. D2 closed.**
  **Quiz (V2-17)** `content/quiz.ts` — 14 questions across 14 milestones, each answerable from that
  milestone's own sourced note. The integrity rule is now **structural, not just intent**: 10 tests in
  `quiz.test.ts` enforce one correct answer, a real milestone link, an explanation, no duplicate
  options — and one test pins the 1652 question so the colonial "empty land" myth can never become the
  correct answer. Wrong options are mostly **real facts from other milestones**, so a wrong guess never
  teaches fiction.
  **Journey (V2-16)** All **25** grounded milestones as stages, not the source design's 12 invented
  chapters — more history, same effort. A stage unlocks when the one before it is done; finished
  stages stay open. Progress bar, stars, cards, level, and the trail's citation at the foot.
  **Stage (V2-18/19)** WATCH → QUIZ → REWARD. Honest about gaps: no film shows the picture and the
  record instead of faking one; no quiz goes straight to the reward instead of inventing a question.
  The reward is a real totem from `content/totems.ts` with its clans, its terms in three language
  groups, and its source shown.
  **D2 closed:** the hero's "Start the journey" now hands off to `/journey` via the `onStartJourney`
  seam left in Week 1. The in-place overlay path is retired.
  **Watch out — typecheck cost is trending badly.** Inlining the stage case in App's route switch made
  tsc walk the now 24-member route union per narrowing and **stop finishing at all** (two 5-minute
  timeouts). Extracting it to a top-level `StageRoute` component fixed it, but the full typecheck is
  now **157s, up from ~7s**. Week 3 adds three more routes. See "Open decisions" — this needs a real
  fix, not another extraction.
  Still open in Week 2: **V2-15** (the WatchItemScreen player page) and **V2-20** (the resume bar).
  Watch cards currently open the existing CinematicReader, which is a real player — the dedicated
  watch page with its provenance panel is still to come.
  Verified: typecheck clean · **109/109 tests** · web bundle green.

- **2026-08-26 (night)** — **Week 2 started: progress store + Watch library. Footer credits changed.**
  **V2-13** `services/progress/` — pure reducers in `progress.ts` (14 unit tests) plus the platform
  split the Archive uses: web persists to localStorage, native is session-only with `persists:false`
  so the Passport can say so honestly rather than implying a guarantee (no AsyncStorage dependency in
  this project yet). Holds **no personal data** — no name, no account, nothing identifying; a test
  asserts the shape's key list so nobody can quietly add an identifying field. Reducers are
  idempotent and never regress: a card cannot be collected twice, a re-watch cannot rewind progress,
  a retaken quiz cannot lower a score, and `normalise()` survives a corrupt stored blob.
  **V2-14** `WatchScreen` — the browsable library, built only from existing modules. The source
  design's Totems / National Days / Nine Provinces chips are **not** offered: in this codebase those
  are Atlas screens, not modules with scenes, so those chips would promise films that do not exist.
  Chips are All / The 4 Great Books / Cultural Atlas, plus search and real "% watched" from the store.
  **Bug I introduced and fixed:** the WatchScreen render first landed in `navigateTo` (the chatbot's
  orchestrator) instead of `renderRoute` — both switches open with the same `case "watch":` line. It
  typechecked cleanly because the orchestrator's return type is loose, so tsc would never have caught
  it; only reading the switch did. Worth remembering when scripting edits against this file.
  **Footer (Tumo's request):** UNISA and Botlhale AI partner plates removed; **tumoolo.tech** added as
  "Built by"; **Baobab Roots Collective** joins African Tribe Echoes under sound credits. Tumo's name
  stays. No avatar is bundled for the new channel, so a Lucide mark stands in — drop a webp into
  `assets/brand/` to swap it.
  Verified: typecheck clean · **99/99 tests** · web bundle green.

- **2026-08-26 (evening)** — **Countries + Atlas hub done (V2-08 → V2-10); branch pushed.**
  `CountriesScreen` carries all 54 nations, searchable, with the national anthems moved out of the
  hero dropdown (D3). `AtlasRooms` gathers Provinces · Presidents · Heroes · Totems · Days under the
  Atlas, which D1 left without a top-level slot; those five screens are untouched.
  **Grounding call:** the source design's per-country "atmosphere" copy (Ghana's kente, Mali's griots,
  Ethiopia's Adwa…) is **not** reproduced — it traces to nothing in this repo. Only South Africa has
  researched content, so only South Africa gets a journey; the other 53 carry an honest
  "not yet researched" note.
  Tumo asked whether the styling followed the source design — it did not, in three ways: the palette
  (D4, deliberate), the invented copy (integrity rule, deliberate), and the cinematic layout, which
  I had dropped **everywhere** including for South Africa. That third one was over-caution, not a
  principle: South Africa has real cached art, a real 12-chapter trail, real provinces. Fixed — the
  live country now gets the full treatment (Ken Burns backdrop from existing art, display name, and a
  "journey ahead" rail built from the **sourced** `history-trail` milestones with the citation shown);
  the other 53 keep the quiet panel. The design is earned by content rather than faked.
  Verified: typecheck clean · 85/85 tests · web bundle green.
  **Repo hygiene fix:** several files had been flipped LF → CRLF by scripted edits, which inflated the
  diff from ~2.2k real changed lines to ~6.2k and would have made the commit unreviewable. Normalised
  back to LF (this repo is LF) before committing. Worth remembering: write files with an explicit
  `newline=''` when scripting edits on Windows.
  Pushed as `feat/architecture-v2` (2 commits).

- **2026-08-26 (later still)** — **The shell is live: V2-01 → V2-04 done.** Tumo picked header
  **direction C, two-tier** from three mockups
  ([artifact](https://claude.ai/code/artifact/5259ecef-c9b6-46b4-bd46-e424feceb344)): tier 1 carries the
  wordmark + country ▾ + language ▾ + Passport chip, tier 2 carries the six D1 nav items, and the
  signature 8px sa-blue rule caps it. Built `shell/nav.ts` (one source of truth for the header, the tab
  bar **and** the chatbot's `navigate_to`, so the three can't drift), `SiteHeader`, `MobileTabBar`
  (4 tabs — Journey · Watch · Atlas · Me), `AppShell` (three modes: page / own-scroll / immersive) and
  `ComingSoon`. Extended the `Route` union with the nine v2 rooms; the country picker moved out of the
  hero into the header and its state is now app-wide (D3 groundwork). Added 7 Lucide icons.
  Unbuilt rooms serve an honest "being built · Week N" placeholder rather than a dead link — the Week 1
  gate says every nav item lands on a real page, and a page pretending to be finished fails it too.
  **Performance trap worth remembering:** writing the shell's route groupings as `Route["name"][]` and
  calling `.includes(route.name)` made tsc walk the whole (now much larger) union on every call — the
  typecheck went from seconds to not finishing in 7 minutes. Rewritten as module-level `Set<string>`
  with the route name widened to `string`; back to seconds. The union-recursion warning already in
  App.tsx now applies to lookups too, and there is a comment there saying so.
  Verified: typecheck clean · **85/85 tests** · `expo export --platform web` green.
  **Needs Tumo's eye:** the nav labels in `shell/nav.ts` are machine-quality across the 10 non-English
  languages — the Setswana especially should be checked (Leeto / Lebelela / Polokelo / Bana / Dikolo).

- **2026-08-26 (later)** — **V2-05 + V2-06 done: hero and footer extracted verbatim.** On branch
  `feat/architecture-v2`. The footer moved to `components/shell/SiteFooter.tsx` and the hero to
  `components/home/HomeHero.tsx`, both **byte-for-byte** — same markup, same styles, same strings (D6).
  One structural note: `JourneyStory` renders `position:absolute` and must stay a **sibling** of the
  ScrollView (inside it, "absolute" would resolve against the scroll *content*, so the full-screen film
  would sit at the top of the page instead of over the viewport). So the hero ships as a hook plus two
  pieces — `useHomeJourney` (shared state) + `HomeHero` (in-scroll) + `HomeJourneyStory` (sibling
  overlay) — which keeps behaviour identical and makes the Week 2 move to `/journey` a contained lift.
  Added the D2 seam: `onStartJourney` is optional and currently unwired, so "Start the journey" still
  opens the in-place overlay exactly as before. Pruned what the move orphaned: 4 imports, 13 UI strings,
  37 styles, 2 constants. `HomeGallery` is **1155 → 772 lines**. Verified: `npm run typecheck` clean ·
  **85/85 tests** · `expo export --platform web` green. **Pre-existing issue found (not caused by this
  work):** bare `npx tsc --noEmit` crashes with a stack overflow on this codebase — confirmed by
  stashing the changes and reproducing on clean `main`. `npm run typecheck` already carries the
  workaround (`node --stack-size=8000`); use that, not bare `tsc`.

- **2026-08-26** — **Architecture v2 planned and started.** Unpacked the three new standalone design
  bundles (Website, Countries, Wireframes 2a–2h) and read them against the live app. Found three
  conflicting navs across the source designs, and that the existing Atlas/Provinces/Presidents/Heroes/
  Totems/Days/Archive/Ledger screens had **no home** in any of them — resolved as **D1**. Confirmed Kids,
  Schools, quizzes, stars/streaks, heritage cards and the Passport are **entirely net-new** (zero code
  today), which is the bulk of the programme. Locked six decisions with Tumo (D1–D6): keep the hero
  SA-road trail and the footer byte-for-byte, move country selection **and the national anthems** to a
  new `/countries` page, keep the black + sa-blue palette rather than the designs' gold/brown, and keep
  all progress **local-only** so no minor's data ever leaves the device. Wrote the 3-week plan
  ([docs/13-architecture-v2-plan.md](docs/13-architecture-v2-plan.md)): 31 tasks, three week gates, a
  fixed de-scope order, and a definition of done. Backlog added as **Phase 5** in
  [specs/tasks.md](specs/tasks.md). Now starting Week 1 (the shell and the split).

- **2026-07-08** — **Journey walk-control fix + phone-mode pass.** Fixed the reported bug: on the guided
  walk, the floating "Keep walking" button sat *under* the caption card and its taps landed on "Play the
  story" instead (worst on phone, where the bottom row of dots crowds the caption). Moved the walk control
  **into the caption card** — `HistoryTrail` is now a `forwardRef` exposing `{ walkNext, restart }` and
  reports walk state via `onWalkChange`; `HomeGallery` renders the button in the caption. Styled the two
  actions distinctly so they're never confused: **Keep walking** = solid gold (primary), **Play the story**
  = outlined gold (secondary); they share one wrapping row so both stay tappable on narrow screens. Also
  **hide the floating chatbot for the whole journey** (not just during a story) so it never crowds the
  caption on a phone. The walker figure stays on the road. Verified: tsc clean · 79/79 tests · `expo export
  --platform web` green (bundles all 3 journey films + 25 dot images). **Phone note:** on mobile *web* the
  walker + films play; on a *native* build they still degrade (inline `<video>` is web-only by design) —
  flag for later if a native demo is needed. **Needs Tumo's eyeball:** open the journey on a phone browser,
  walk a few dots, confirm Keep walking / Play the story both press cleanly.
- **2026-07-08** — **1816 Zulu-kingdom dot — two films in order (ordered playlist support).** Tumo supplied
  two films for the 1816 "big dot": *Margaret Singana — We Are Growing* (the Shaka Zulu series theme) then
  *Shaka Zulu — Epic African Music (Song of Kings)*. Extended the dot-story model to a **playlist**:
  `JourneyMedia.videos?: number[]` (ordered; takes precedence over the single `video`), and `JourneyStory`
  now advances film→film (`onEnded`) and closes after the last; **Back** rewinds to the picture. Both films
  **web-optimized** with ffmpeg — H.264 360p (kept native res), CRF 29, AAC 96k, **`+faststart`** (moov atom
  up front so playback starts while streaming): 13.4MB→12.3MB and 18MB→12.9MB → `assets/journey/1816-we-are-
  growing.mp4` + `1816-song-of-kings.mp4`. So 1816 now plays: picture → We Are Growing → Song of Kings →
  close. tsc clean · 79/79 tests. **Needs an eyeball:** the picture→film1→film2 flow in a browser
  (`npm run web`, open the journey, tap 1816). Other big dots stay picture-only until Tumo adds their films.
- **2026-07-08** — **Big-dot journey pictures — all 24 remaining milestones (Gemini, Tumo-approved gen).**
  Extended the "dot story" treatment beyond 1652 to every **big dot** (the 24 top-level milestones in
  `history-trail.ts`). Added grounded, integrity-safe prompts to `scripts/generate-journey-images.mjs`
  and ran `npm run gen:journey-images` → `assets/journey/y<year>.webp` (24 new, 1652 skipped). Wired each
  into `content/journey-media.ts` as `image` + `imageIsAI:true` with **no film** — `JourneyStory` already
  degrades to picture + description + "Skip" when there's no video, and the "Watch the film" button
  auto-appears once Tumo adds a film per dot (branches/side-road dots deliberately have no media yet).
  **Integrity (humanities rule):** prompts depict the EVENT/SCENE, never a fabricated portrait of a real
  named person (Shaka/Mandela/Biko etc. shown via crowds/landscapes, not faces); Sharpeville + Madiba's
  passing kept sober and non-graphic; all labelled "Artistic interpretation" in the UI. Spot-checked the
  sensitive ones — Sharpeville (dropped passbooks + a lone shoe, no bodies), 1976 Soweto, 1955 Kliptown,
  1994 voting queue, 2013 mourning wall all read clearly South African + dignified; **1990 first came out
  European, regenerated with a Grand Parade / Table Mountain anchor** → now correct. tsc clean · 79/79
  tests. **Needs Tumo:** eyeball the 24 as a set (his call to keep/redo any); films land per-dot later.
- **2026-07-08** — **UI chrome finished in all 11 languages (in-session, no API).** Closed the last gaps
  in the fully-multilingual interface without the Gemini/Claude generation script — translated directly
  this session and wrote the strings into the inline `t({...})` chrome objects. Audit found most of the
  app was already all-11 (Reader, ConsentSheet, LanguagePicker, chatbot, Provinces, Presidents, Atlas,
  Totems, Archive were done); only **~39 chrome objects across 6 files** still had EN(+TSW)-only:
  **HeroesScreens** (16), **ArticleReader** (10), **HomeGallery** (7: heroes block, journey hint/title,
  daysSub), **NationalDays** (intro, mediaSoon, notHoliday), **HeritageLedger** (cid/hash labels),
  **CountryPicker** (moreSoon). All six now balance (en count == ve count per file). These are INTERFACE
  labels only — literary/heritage **content** stays honest EN-fallback / labelled drafts (integrity rule
  intact; scope confirmed with Tumo). tsc clean · **79/79 tests**. **Needs Tumo:** the `tn` Setswana was
  already authored; the 9 new languages are machine-quality chrome (af/zu/xh/nso/st/ss/ts/nr/ve) — a
  native-speaker eye welcome but not blocking, since chrome is explicitly best-effort.
- **2026-07-08** — **Interactive walking journey + "dot stories" on the home timeline.** Turned the
  history trail into a guided walk. (1) **Walker** — Tumo's Groovy walk-cycle, keyed white→transparent
  (VP9 alpha `assets/journey/walk.webm`), strolls the **main road** big-dot → big-dot along the real
  Catmull-Rom curve (reusing `HistoryTrail`'s `segAt`), facing the way it travels, stopping at each dot
  with its description + a **"Keep walking"** control (localized). (2) **Dot stories** — starting the
  journey opens a **full-screen story for 1652**: a picture first, then a film, with **Skip** (→ back to
  the walk) and **Back** (film → picture); a **"Play the story"** button re-opens it. `JourneyStory.tsx`
  + `content/journey-media.ts` (per-milestone media map). (3) **1652 picture** — the ONE Gemini image
  Tumo approved (`npm run gen:journey-images`, `assets/journey/y1652.webp`): Table Bay, VOC ships + fort
  **and** Khoekhoe herders in the foreground — honest, dignified, labelled "Artistic interpretation".
  **No other Gemini use.** (4) **1652 film** — Tumo's *They Came With Chains* compressed 39MB→7.3MB @720p
  (`assets/journey/1652.mp4`); streams on demand. Chatbot hides while a story plays. `metro.config.js`
  now bundles `.webm`/`.mp4`. **Only 1652 has media**; other dots show text until Tumo adds theirs.
  tsc clean · 79/79 tests · verified live (walker walks + faces correctly; story picture→film→skip).
  **Next:** branch turn-choices (keep walking vs turn to a side-road); more dots' media as Tumo sends them.

- **2026-07-08** — **Chatbot memory + home scroll cues + nav-matcher fix.** (1) **Conversation memory** —
  `services/chatbot/memory.ts`: device-local ONLY (web = localStorage, survives refresh; native = session),
  never uploaded (POPIA); the panel restores the prior chat on open and passes the last ~10 turns to Claude
  so it remembers context. Added a **"new chat" (↺) erase** button in the panel header — real erasure of the
  stored transcript. Verified live: sent a message → full page reload → conversation restored from
  localStorage. (2) **Scroll affordances on HomeGallery** — a bouncing **scroll-down chevron** on the right
  edge near the top, swapping to a **back-to-top arrow** near the bottom (both clear of the bottom-right
  chatbot); localized labels (`scrollDown`/`backToTop`). Verified live at top + bottom. (3) **Nav-matcher
  fix** — `matchNavigation` no longer hijacks short questions that name a page ("Who was Sol Plaatje?" is
  now answered, not navigated); unless an explicit "take me to" trigger is present. tsc clean · **79/79 tests**.
- **2026-07-07** — **Language (Claude drafts) + "Ask Ubuntu" chatbot (LangChain).** Two features toward
  the strict-scorecard gaps (Accessibility 12→ and a demonstrable AI wrapper). (1) **Claude translation
  pipeline** — new `scripts/generate-claude-translations.mjs` (`npm run gen:claude-drafts`) drafts every
  literary scene (title/adult/child) of the 4 pillars into the **9 not-yet-reviewed** SA languages using
  **Claude** (Anthropic SDK, model `claude-opus-4-8`, structured JSON output, resumable), guided by the
  human-reviewed Setswana as a register reference. Writes the existing `src/content/drafts.data.ts` that
  the Reader already renders + labels "machine translation — unreviewed" (integrity rule intact — no
  fabricated authority). **Gated on `ANTHROPIC_API_KEY` (build-time only)** to actually run. (2) **"Ask
  Ubuntu" chatbot** — `src/services/chatbot/` (knowledge base built ONLY from the app's own grounded
  content; pure retriever + nav-intent matcher w/ 8 unit tests; **LangChain `ChatAnthropic`** agent with
  a bound `navigate_to` orchestrator tool). Answers strictly from site content (RAG + no-invention system
  prompt); the orchestrator ("take me to the provinces") + retrieval answers work with **zero key**, and
  upgrade to full conversation on `EXPO_PUBLIC_ANTHROPIC_API_KEY`. Floating widget wired app-wide in
  `App.tsx` via a page→route resolver. **Chatbot chrome localized in all 11 languages** (`services/
  chatbot/uiStrings.ts` via `t()`; verified live switching the picker to isiZulu — header, greeting,
  chips, offline note, placeholder all switch); the LLM answer path is also told to **reply in the
  picked language** (grounded in EN site context). Installed `@anthropic-ai/sdk` + `@langchain/anthropic` +
  `@langchain/core`. **tsc clean · 77/77 tests · `expo export --platform web` green** (LangChain bundles;
  index 4.4MB). **Awaiting Tumo:** paste an Anthropic key into `app/.env` (both `ANTHROPIC_API_KEY` and
  `EXPO_PUBLIC_ANTHROPIC_API_KEY`, same value ok — see `.env.example`) → then run generation + live-drive
  the chatbot. Optional: `EXPO_PUBLIC_CHATBOT_MODEL` / `TRANSLATE_MODEL=claude-haiku-4-5` for a faster,
  cheaper path. **Update (same day):** localized the chatbot chrome in all 11 languages
  (`services/chatbot/uiStrings.ts`; verified live in isiZulu) + LLM replies in the picked language.
  Then **moved the chatbot off LangChain to the Anthropic SDK** — LangChain's `langsmith` dep
  TDZ-crashes the Expo *web dev server* under Fast Refresh (`Cannot access 'Client' before init`);
  production export was fine, but `expo start --web` white-screened. Same agent design (Claude tool-use
  + `navigate_to` + RAG), now runs in **dev AND prod**; uninstalled `@langchain/*`. Verified the dev
  server renders + the widget mounts with **zero runtime exceptions** (headless check). tsc clean · 77/77.
- **2026-07-06** — **Totems story — cinematic slideshow with per-animal sound.** Added a "Play the story"
  Journey on the Totems screen: all 22 animals, each showing the photo + name + a grounded one-line
  meaning while **its sound plays**. Extended the shared `Journey` (per-slide `sound`/`title`; the music
  bed is muted while slide sounds play) and added `totemsJourney`. **Sounds:** curated recordings from
  Tumo (`design/Animals sounds/`) imported + **web-optimized** via ffmpeg (`npm run import:sounds` →
  mono, capped ~6s with fade, ~96kbps → ~50–71KB each); the one animal with no curated file (duiker)
  keeps its **ElevenLabs**-generated sound (`npm run gen:sounds`, build-time only, key in gitignored
  `.env`). Runtime plays the **bundled** mp3s — the API is never called live. Sounds labelled honestly
  ("Real photos · AI-generated sounds"). `tsc` clean · tests pass · web export green.
- **2026-07-05** — **Totems & Clans — new Cultural Atlas compendium (grounded).** Added a full "Totems &
  Clans" screen (`TotemsScreen.tsx` + `content/totems.ts`) on the shared sidebar layout: the
  zoo-cosmological system of Southern African totemism — 22 animal totems (Sotho-Tswana / Nguni /
  Tshivenḓa terms, clans, meaning, oral genesis stories), two opening essays (ontology; lineage fission)
  and three governance lessons (conservation-by-distributed-taboo; kinship/hospitality; exogamy).
  **Grounding:** grokipedia dropped per the project's integrity rule; claims cited to reputable sources
  (National Museum Publications, BeingAfrican, SAHO, Wikipedia, Barolong official site, EcoTraining, MSU,
  Bennett, Noyam, U. Bologna, SA Tourism); oral origins framed as tradition. Home entry + route wired;
  11-language chrome. **Images:** 22 real photos → `assets/animals/*.webp` (52.6MB→6.3MB, 88% smaller);
  each shown at uniform width + its own natural height (measured on load) so nothing is cropped; cards
  laid out image-left / text-right on wide. **Shared UI:** the sidebar back link now sits atop the
  CONTENTS index on every index page (Atlas/Provinces/Presidents/Days/Totems) via `SideIndexScroll`
  `onBack` + `ScreenHeader` `showBack`. `tsc` clean · **66/66 tests** · web export green · ran locally &
  reviewed. **Needs Tumo:** Setswana + cultural review of the totems text (English-fallback for now).
- **2026-07-05** — **Mantswe a Batho pure core (Living Archive step 4, buildable half).** Built the
  no-key, testable heart of the oral-history consensus feature in `src/services/mantswe/`:
  **de-identify** (POPIA deterministic belt — strips SA phone/ID/email by regex, keeps historical
  names/places as content; reports types+counts, never the removed values) and **consensus**
  (`aggregate()` tallies claims across testimonies, links each back to its supporters, sorts most-voices
  first — it COUNTS and never crowns a winner; contradictions coexist). `withdraw()` + re-`aggregate()`
  implement the POPIA lifecycle: the aggregate is derived, so erasing a testimony recomputes it and its
  unique detail vanishes. 8 golden tests incl. **delete-recomputes**. `tsc` clean · **66/66 tests** ·
  web export green (services only, UI unaffected). **Gated on keys:** the Mantswe screen, Lelapa
  transcription, Gemini claim-extraction/redaction, and Supabase storage — the pure core is ready to
  wire the moment keys land.
- **2026-07-05** — **Ingestion Library v1 infra (Living Archive step 3).** Built `npm run ingest` — the
  build-time CLI that turns a rights-cleared public-domain plain-text book into a **draft literary
  `Module`** in the app's exact shape, grounded in and citing the source. Pure, golden-fixture-tested
  core in `src/services/ingest/`: **rights** (SA life+50 gate — v1 ingests only public-domain/licensed,
  blocks unverified), **extract** (strip Project Gutenberg boilerplate, de-hyphenate line breaks,
  normalise), **segment** (chapter detection), **draft** (one anchored scene stub per chapter; adult/
  child text emitted as `[NEEDS ADAPTATION]` behind the human-review gate — no fact invented). CLI
  writes `src/content/sources/<id>/` → `source.txt` (verbatim), `draft-module.json`, `review.md`
  (checklist). Verified end-to-end on a Gutenberg-format fixture (boilerplate stripped, `govern-\nment`
  → `government`, 2 chapters, anchored sourceNotes). `tsc` clean · **58/58 tests** (+11). Deferred:
  PDF/OCR extraction, the Gemini adapt→scenes stage (needs key). **Needs Tumo:** pick the first
  public-domain title to ingest for real.
- **2026-07-05** — **Living Archive plan + device-persistent recordings (Living Archive step 2).**
  Wrote [docs/12-living-archive-plan.md](docs/12-living-archive-plan.md) — the crowdsourced,
  AI-synthesised archive: **Mantswe a Batho** ("Voices of the People", oral history + AI consensus that
  *surfaces* agreement/divergence and never adjudicates), the **Ingestion Library** (public-domain books
  → draft `Module`s, cited), and a footer **"Built with"** row (locked to *official logo images*). 4 decisions locked. **Footer step
  1 (Solana):** sourced the official Solana horizontal logotype (`solana.com/branding`), converted it to
  `assets/brand/solana.webp` (transparent), and added a **"Built with"** row to the HomeGallery footer —
  distinct from "In partnership with", light logotype on the navy ground (Solana's high-contrast
  guideline), links to solana.com. Supabase/Lelapa/Expo marks deferred until those land. Then shipped
  **step 2**: recordings now
  persist device-locally via a platform-split store (`src/services/archive/`) — **web = durable
  IndexedDB** (audio Blob survives a refresh; delete is real erasure of the bytes), **native = in-session**
  fallback (WatermelonDB is still T024, now honestly flagged `persists:false`). Playback resolves a fresh
  object URL from the store, so it works after reload (the old `blob:` URL is dead). Pure list helpers
  unit-tested (7 new). `tsc` clean · **47/47 tests** · `expo export --platform web` green. **Needs an
  eyeball:** the mic-gated record→refresh→play→delete loop in a real browser (can't be automated here).
- **2026-07-03** — **In-app Lucide icons + UI audit/alignment + tsc fix.** Installed `lucide-react-native`
  + `react-native-svg`; replaced **all emoji/unicode glyphs** across the app (Home, Reader, Archive,
  Consent, Heritage, LanguagePicker, Provinces, Presidents) with a central `ui/Icon` set — mic, chevrons,
  lock, users, play, square, volume, trash, check, clock, arrow-up-right, sparkles, link2. **Alignment
  audit:** wrapped text-badges in `View` (province count, Est., stat pills) for clean centering, put all
  icon+label buttons in `flexDirection:row + gap` rows, swapped baseline-inconsistent `‹ › ▾ ● ✦` glyphs
  for centered SVGs. **Fixed a tsc stack-overflow**: lucide's ~1,500-icon barrel overflowed the type
  checker — `ui/Icon.tsx` now loads lucide via `require()` typed to a tiny local `IconProps`, so tsc
  never walks the barrel (runtime identical). Also refactored `App.tsx`'s route ternary → flat switch.
  `tsc` clean (stable across repeated runs) · **32/32 tests** · `expo export --platform web` green.
- **2026-07-03** — **B&W redesign lab + new features + app port (in progress).** In `design/` (throwaway
  lab, `index.html`) redesigned the whole app to a **pure black & white + gold-for-emphasis** system,
  zebra-inspired: black ground, white type, **colour photos**, gold/orange only on what matters
  (mission line, authors, primary actions). 10 lab screens (Launch, Home, Reader, Archive+consent,
  Heritage, Provinces grid/province/city, Presidents overview/detail). Added two grounded features:
  **Provinces → City history** (`design/provinces-content.md`) and **The Presidents** incl. **pre-1994
  heads of state** honestly framed (`design/presidents-content.md`) — all cited/flagged, controversies
  neither sanitised nor sensationalised. All lab icons are **Lucide** (Emma's rule). **App port started
  (staged, verified):** ✅ Launch (zebra + "UBUNTU HERITAGE" wordmark, `assets/brand/launch-bg.jpg`) ·
  ✅ Home (B&W + gold, colour photos, logo→wordmark). tsc clean · tests pass · web export green.
  **Port COMPLETE (all stages):** ✅ 1c — Reader/Archive/Heritage/About/ConsentSheet/LanguagePicker +
  the UI kit (Screen/Type/Card/ScreenHeader) all → B&W + gold, colour photos; cross-platform (pure RN
  StyleSheet, no web-only CSS). ✅ 2 — **Provinces feature** in-app (`content/provinces.ts` +
  `ProvincesScreens.tsx`: grid → province → city; 3 provinces, flagship cities, real colour photos in
  `assets/places/`; stats flagged cited/verify) + Home entry + nav. ✅ 3 — **Presidents feature**
  (`content/presidents.ts` + `PresidentsScreens.tsx`: overview with democratic-5 gold + pre-1994 grey,
  full detail w/ life timeline/family/quote/sources) + Home entry + nav. `tsc` clean · **32/32 tests** ·
  `expo export --platform web` green. **Pending Emma:** verify the ‘to verify’ stats (StatsSA/DBE);
  Setswana translations for the new features; optional in-app Lucide icons (emoji still in a few spots).
- **2026-07-03** — **Rebrand: Maloba → Ubuntu Heritage (product UI + logo).** Emma supplied a new emblem
  (sunburst of ndebele-patterned petals + rising sun over Table Mountain, rising from an open book) and
  chose to rename the app **Maloba → "Ubuntu Heritage · South Africa."** Scope this pass = **product UI +
  logo only** (docs/specs/narrative deferred; on-chain memos are immutable and keep the historical name).
  Done: logo added at `app/assets/brand/logo.png` (downscaled 6.8MB→1.5MB); **LaunchScreen** now shows the
  real logo on a warm-brown ground; **Home masthead** shows the logo on a gold-framed plate; renamed
  `app.json` name, About intro, and the Vilakazi content self-reference. **Kept** the Setswana tagline
  *Mantswe a maloba* ("voices of yesterday" — poetry, not the brand) and the `localize.test` "Maloba"=
  yesterday fixture. Design lab (`design/`) fully rebranded incl. a new **00·Launch** screen; all lab
  icons converted **emoji → Lucide** (Emma's standing rule). Verified: `tsc` clean · **32/32 tests** ·
  `expo export --platform web` green. **Deferred (needs go-ahead):** rename in docs, README, specs, and
  the judged `concept-submission.md`; a transparent-background emblem for non-plated placements.
- **2026-07-03** — **UI redesign pass (design lab → ported to app).** Built a throwaway `design/`
  sandbox (`index.html`) mocking the whole journey — Home, Reader, Archive+POPIA consent, Heritage
  Ledger — in a "cinematic editorial archive" direction on the locked brand palette. Emma-facing;
  delete the folder when done. **Ported the Home refinements into the real app:** added a **literary
  serif voice** (Playfair Display — already installed; now loaded in `App.tsx` + `fonts.serif/serifSemi/
  serifItalic` tokens) for work titles, blurbs and taglines; rebuilt the **Cultural Atlas as a 2-up
  image grid** (`AtlasChip`) instead of list rows; serif Reader scene title + Heritage work titles; a
  **live green status dot** on the on-chain Heritage Ledger button. Verified: `tsc` clean · **32/32
  tests** · `expo export --platform web` green (Playfair weights bundle). Remaining lab screens
  (Reader/Archive/Heritage full treatment) can follow once Emma signs off on the look.
- **2026-07-03** — **Submission-package + Atlas visual parity.** (1) **Atlas hero art:** wired the 3
  Cultural Atlas modules into the Gemini image pipeline and made `gen:images` **idempotent** (skips the
  4 cached literary heroes → no wasted quota; `--force` to regenerate). Generated 3 new cinematic heroes
  (Galeshewe, lobola, first-people) — dignified, no text, no fabricated author portraits; labelled AI
  interpretations. All **7 modules** now have local hero art. (2) **Written narrative** rewritten to
  match the app: folded in the Cultural Atlas (7 modules, not "four pillars"), the on-chain Heritage
  Ledger (described honestly as Solana **devnet** provenance — hashes/citations only, no PII), and a
  re-aligned rubric table + shot list. (3) New **demo-video script** ([specs/demo-video-script.md]) —
  shot-by-shot, ~2:55, web target. (4) New **review handoff** ([specs/emma-review-handoff.md]) — exact
  files/strings needing Emma's Setswana + cultural review, prioritised (3 on-camera strings first).
  Verified: `tsc` clean · **32/32 tests** · `expo export --platform web` green (exit 0, all new image
  `require()`s bundle). **Pending Emma:** record the video; Setswana review; Atlas cultural-accuracy pass.
- **2026-06-29** — Project kicked off. Read hackathon brief + rubric + architectural blueprint PDF +
  FrameFlow reference. Created governance scaffold, docs set, .claude skills, specs, and initialized
  the Expo app with a first cinematic literary module.
- **2026-06-29** — Renamed project **Lentswe → Maloba** ("yesterday"; tagline *Mantswe a maloba*).
  Added two more grounded pillars (*Ityala Lamawele*, *Indaba, My Children*) and a HomeGallery with
  gallery↔reader navigation + app-wide language. tsc + web bundle green.
- **2026-06-29** — Completed the **four pillars** (added Vilakazi), built the **About the Sources**
  screen, and shipped the **Community Archive**: POPIA `ConsentSheet` → record (expo-audio) → list →
  play → rename → delete (erasure). Session-state for now; cloud sync + WatermelonDB are stretch.
  tsc + web bundle green.
- **2026-07-02** — Researched **Botlhale AI** (SA indigenous-language ASR/TTS/translate; enterprise/
  sales-gated, no public free tier — Emma has a direct contact fast-tracking access). Built a
  **pluggable Reader TTS layer** (`app/src/services/tts/`): Botlhale neural voice as primary,
  **on-device `expo-speech` as a free offline fallback** so "Listen" works today and auto-upgrades to
  real Setswana audio when the key lands. Added a 🔊 Listen control to `CinematicReader`. Pure logic
  (lang mapping / request builder / provider select) unit-tested with Node's built-in runner —
  **12/12 pass**; `tsc --noEmit` clean; web bundle green (259 modules). New scripts: `npm test`,
  `npm run typecheck`. Follow-ups: confirm Botlhale endpoint/codes; Emma to review "Reetsa" label.
- **2026-07-02** — Refined the **written narrative** (`specs/concept-submission.md`) to submission
  quality: folded in the read-aloud/narration feature and the African-built-AI framing (Lelapa +
  Botlhale), updated the demo shot list + pre-submission TODO. Grounding preserved (no new facts).
  Drafted the Botlhale-contact request for TTS endpoint/key.
- **2026-07-03** — **Cultural Atlas — humanities depth level-up.** Added 3 grounded, cited modules
  (Unsung Heroes, Marriage Rites, Peopling of SA) from Emma's sourced history document, reusing the
  cinematic Reader (Child/Adult, 11-language framework, Listen). Applied the integrity guardrails:
  cut the genetic-% table, framed contested chronology as debated, dropped grokipedia sourcing, kept
  sensitive customs with context. New Home "Cultural Atlas" section; About screen now credits all 7
  modules; every Atlas entry links to the Community Archive ("record your family's version"). Extended
  `Module` (kind/archivePrompt/optional year). 32/32 tests; tsc clean; bundle green. **Needs Emma's
  Setswana + cultural-accuracy review** (flagged in files).
- **2026-07-02** — **On-chain heritage (Phase A).** Wrote the plan (docs/11) — honest case for
  blockchain (permanence + provenance + ownership), POPIA-safe design (no personal data on-chain,
  hash-anchor + consent only), what to tokenise (provenance cNFTs + custodian badges, never commodify
  heritage). Built `chain/` workspace (@solana/web3.js + ipfs-only-hash): `anchor.mjs` computes real
  SHA-256 + IPFS CID for all 4 canon works and submits a Memo tx (custodial wallet). Fixed the web
  `<Image>` source crash + `shadow*→boxShadow`. Added the in-app **Heritage Ledger** screen + nav +
  "Verify on Solana" links. Cluster = testnet (devnet RPC unreachable here); on-chain txs pending a
  faucet top-up. 32/32 tests; tsc clean; bundle green. `solana-ai-kit` reviewed for Phase B (Anchor
  program + cNFT minting).
- **2026-07-02** — **Consistency system + Gemini images.** Built a reusable **UI kit** (`src/ui/`:
  `Screen`, `ScreenHeader`, `Card`, `Rule`, and `Type` primitives) + a **page-building guide**
  (`src/ui/README.md`) so every screen — and any NEW tab — inherits the brief theme, Anton/Barlow type,
  colours and spacing by construction. Converted About + Archive onto the kit (light cream); modals +
  Reader stay dark-navy with gold accents (rule: orange on cream, gold on navy). Built the **Gemini
  image pipeline**: pure `services/images/gemini.ts` (+tests), offline `npm run gen:images` → cached
  local PNGs + manifest, app resolver auto-uses them (Pollinations fallback). Validated end-to-end
  (`gemini-2.5-flash-image`) and generated the **4 hero images**. 32/32 tests; tsc clean; bundle green
  (415 modules). Gemini key stored build-time-only in gitignored `app/.env`.
- **2026-07-02** — **Re-themed to the AADHIH brief identity** (Emma loved the brief's look): palette
  → deep **navy + burnt orange + gold on warm cream**; fonts → **Anton** (heavy caps display) +
  **Barlow** (body), repointed in `theme/tokens.ts` (all components inherit). Rebuilt **HomeGallery**
  in the light cream theme (Anton masthead, orange rules, featured pillar + numbered index, white cards
  with depth, navy CTA block) and **LaunchScreen** as a navy+orange banner. Tuned Pollinations prompts
  toward warm, dignified real-people photography. Other screens now render dark-navy (coherent) pending
  light conversion. Copied `frontend-design` + `brand-guidelines` skills into `.claude/skills/`.
  Stored the **Gemini key** in gitignored `app/.env` as build-time-only `GEMINI_API_KEY` (NOT
  EXPO_PUBLIC — never bundle a real key to the client; rotate after event). tsc clean; bundle green.
  Next: Gemini image pre-gen pipeline; convert remaining screens to the light theme.
- **2026-07-02** — **Visual polish pass** (all four picked): (1) **Cinematic typography** — Playfair
  Display (brand/titles) + Spectral (reading/UI) via bundled @expo-google-fonts (offline), centralized
  in `theme/tokens.ts` (`fonts`), applied across every component. (2) **Gradients + images** —
  `expo-linear-gradient` scrims (Reader + cards), `SceneImage` moved to `expo-image` (disk cache =
  offline/low-data win) with fade-in + slow Ken Burns on the Reader hero. (3) **Motion** — reusable
  `Motion.tsx` (Fade + PressScale): screen cross-fade on navigation, scene text cross-fade, press-
  scale on cards. (4) **Branded LaunchScreen** — animated "Maloba · Mantswe a maloba" over a dusk
  gradient while fonts load; root bg set to night (`app.json`) so no white flash. tsc clean; 27/27
  tests; web bundle green (410 modules). Note: final app-icon/splash PNG art still a designer asset.
- **2026-07-02** — Built the **machine-draft translation pipeline** (Emma's call: drafts once the
  Botlhale token lands). New `services/translate/botlhale.ts` (`/translate/v2` JSON, tested), resolver
  now 3-state **reviewed / draft / fallback**, drafts store (`content/drafts.ts` + generated
  `drafts.data.ts`), Reader labels drafts "machine translation, unreviewed" and narrates them in-
  language. Ready-to-run `npm run gen:drafts` script pre-generates drafts for the 9 not-yet-reviewed
  languages (gated on `EXPO_PUBLIC_BOTLHALE_API_KEY` + new `EXPO_PUBLIC_BOTLHALE_ORG_ID`). 27/27 tests
  pass; tsc clean; web bundle green (263 modules). [NEEDS from contact: org_id; confirm translate
  field semantics.]
- **2026-07-02** — Expanded to **all 11 official SA languages** as a data-driven framework: new
  `src/i18n/` (registry with endonyms + BCP-47 + Botlhale codes; `t`/`resolveText` with honest English
  fallback), widened `Lang` to 11 codes, `LocalizedText` non-EN fields now optional. Replaced the
  EN/TSW toggle with a **LanguagePicker** (all 11 by native name) in the gallery + Reader; migrated all
  47 string sites to `t()`. Reader shows a fallback badge + narrates in the *shown* language. TTS now
  covers all 11 (Botlhale primary + device fallback). Folded the old `tts/lang.ts` into the registry.
  **Honest state:** framework is all-11; human-reviewed *story text* is EN + Setswana — the other 9
  show English text (clearly labelled) until real translations land. 21/21 tests pass; tsc clean; web
  bundle green (262 modules). [NEEDS: confirm Botlhale codes for nr/ss/ve with contact.]
- **2026-07-02** — Researched Botlhale's public API docs and **wired the real TTS contract**:
  `POST api.botlhale.xyz/tts`, form-encoded (`text_msg`, `language_code`), Bearer token, JSON
  `audio_url` response; corrected Setswana code to `tn-ZA`. Updated `botlhale.ts`/`lang.ts`/tests +
  `.env.example`. 13/13 tests pass; tsc clean. 3 unknowns left for the contact (field name, host,
  token flow). **Next: lock demo target (web vs Expo Go).**
