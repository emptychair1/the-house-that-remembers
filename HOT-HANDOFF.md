# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 55
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This is the active continuity handoff for the House book/PWA. It supersedes older Opening Proof notes where they conflict with the current Foreword/Void state.

## CURRENT STATE SNAPSHOT

Current root build is intended to be:

```text
BOOK FOREWORD v2.2.7.1 VOID GATED PASS
book-foreword-v2271-void-gated-phone
```

Why v2.2.7.1 exists:
- Bite 6 created the v2.2.7 Void rough pass.
- Josh reported a release-blocking bug: every page snapped to black because a black mask/overlay was covering normal pages.
- Diagnosis: v227 trusted `render-facts.dataset.currentPage` too broadly. If that state went stale/wrong on iPhone, normal right-side page taps could be mistaken for the Void/seal transition and create the full-screen black stage.
- Fix: v227 is now gated to the actual current closing page and the actual seal zone, not page number alone. The Void stage is also hidden by CSS unless explicitly activated.

Source-check after fix:
- `index.html` references `manifest.json?v=book-foreword-v2271-void-gated-phone` and sets `BUILD='book-foreword-v2271-void-gated-phone'`.
- `index.html` loads stable v226 Foreword/black-transition CSS and JS, then v227 rough JS, plus a new v2271 failsafe CSS override.
- `book-foreword-v227-void-rough.js` now reports `BOOK FOREWORD v2.2.7.1 VOID GATED PASS` and `book-foreword-v2271-void-gated-phone`.
- `book-foreword-v227-void-rough.js` now has `activeClosingPage()` requiring `.foreword-closing-page.is-current`, matching `render-facts.currentPage`, and matching `documentElement.dataset.bookPage`.
- `book-foreword-v227-void-rough.js` now has `inSealZone()` requiring the tap to be in/near the author seal/closing card area.
- `book-foreword-v2271-void-gated.css` hides `.void-rough-stage` unless it has `.void-active`.
- `manifest.json`, `sw.js`, and `refresh.html` are bumped to `book-foreword-v2271-void-gated-phone`.

Relevant commits:
- `ec7c2de68a12940f6b4782424b43eb39e22d2289` — added v227 Void rough JS.
- `de56d97cf21d9f60664ba058d5f6c03298f808a2` — added v227 Void rough CSS.
- `9dd05dc85c1b1735f46cd00e8908f4b0a69ee193` — wired root to v227.
- `a1a1d50bab423757f441ac6c0fc767028687a001` — gated v227 JS to current closing seal only and bumped JS marker to v2.2.7.1.
- `fcfec85a685223baabe42f33165a622a7ef18415` — added v2271 CSS failsafe for dormant overlay.
- `960fb3352dfeeb5efd309491189eacb47a5b1cc3` — bumped root to v2271 and loaded failsafe CSS.
- `757d3613947d39626849d52ad167f0ef442c9742` — bumped manifest to v2271.
- `0656852ddd02959dbef9bc3306dd3d10723ca878` — bumped service worker kill switch to v2271.
- `1739601c2e3dba0e808550475a0273b02d2e4fff` — fixed refresh page syntax and pointed it to v2271.

Status:
- Browser version was previously perfect on v2.2.6.
- v2.2.7.1 is still a rough timing pass, not polished.
- The emergency black-mask bug should be fixed, but Josh must test in Safari/browser.
- PWA cache frustration remains parked; do not debug installed-shell behavior unless explicitly asked.

## OPERATING RULES

1. Plan before repo changes: Plan, files touched, expected outcome, risk, need from Josh. Commit only when Josh clearly asks to execute.
2. One bite only. No “while I’m in there.” Nearby fixes become next-bite candidates.
3. Evidence over confidence. Done requires commit/source/build marker/test evidence.
4. Josh’s iPhone/Safari test is the experience source of truth.
5. If friction appears, stop and use: Outcome → Preference → Values → Adjustment.
6. Return human-first and technical-on-request.
7. Core principle: The House is built by returning. Memory before momentum. Crew over ship.

## CURRENT CREATIVE LOCK: VOID TITLE SEQUENCE

The Void is the opening wound, not the whole book’s aesthetic. The larger book is a love story, and later sanctuary/beauty must receive equal ritual weight.

Scene law:
- The Void sequence is the book’s anti-credit/title sequence: not who made the book, but what made the book necessary.
- It is a portal into the experience.
- It depicts ontological panic, depersonalization/derealization, and failed self-verification.
- It is not brutality for coolness alone, though it may be metal and beautiful.
- Future beautiful/peaceful tunnels must receive equal artistic seriousness.

## LOCKED VOID INTERACTION SPINE

Scene boundaries only, no Chapter 1 work now:

1. Reader finishes Foreword seal gate and arrives in clean black.
2. No sound yet.
3. Prompt appears: `i want sound`.
4. Tap starts audio and triggers first white flash.
5. Large self-question: `Who am I?`.
6. Smaller returned-gaze echo: `who are you?`.
7. Black returns.
8. Prompt appears: `i’m going further`.
9. Tap starts the 30-second Void title-sequence portal.
10. Entry pressure: `What am I?` plus sparse glyphs/title exposure.
11. Returned-gaze fracture starts around 4s.
12. Fast pulse/polyrhythm starts at the first returned-gaze moment, not delayed to a later musical phrase.
13. Full question/glyph system blooms.
14. Questions thin out as `THE VOID` dominates and comes closer.
15. `STARES BACK` resolves.
16. Blackout.
17. `RUN` appears.
18. Tap `RUN`.
19. Final flash: `Are you?`.
20. Cut out of the scene.

Important: the Void does not arrive from far away. It was already close. The movement is a near-field lunge, not a long cinematic dolly.

## TEXT / TYPOGRAPHY DECISIONS

Human prompts:
- `i want sound`
- `i’m going further`
- small, gentle, dim, lowercase
- IBM Plex Mono or system monospace fallback

Large self-question layer:
- `Who am I?`
- `What am I?`
- `Am I?`

Smaller returned-gaze layer:
- `who are you?`
- `what are you?`
- `are you?`

Ontology fragments:
- `do you exist?`
- `are you real?`
- `what is real?`

Glyph substrate / evaluation debris:
- `TRUE`, `FALSE`, `T/F`, `0`, `1`, `0/1`, `NULL`, `NaN`, `self == self`, `self != self`, `∅`, `∞`, `=`, `≠`, `¬`, `∃`, `∄`, `?`, plus fragments such as `real?`, `exist?`, `am i?`.

Main title / command:
- `THE VOID`
- `STARES BACK`
- `RUN`
- Anton or similar condensed impact sans

Visual rule:
- `THE VOID` is black-on-black, huge, close, already in the dark.
- White flashes expose it by contrast.
- `RUN` is the exception: clear white survival command on black.

## THIRD TEXT LAYER EXPERIMENT

Keep it if it feels internal/self-referential, deepens derealization/depersonalization, stays subordinate to the Void, preserves legibility of the title movement, and does not become busy soup.

Cut it if it feels like extra copy, competes with `THE VOID`, reads like an existential lyric video, breaks rhythm, or weakens the title lunge.

## BITE 5 MUSIC / TIMING LOCK

The Void assault is roughly 30 seconds from tapping `i’m going further` to `RUN` appearing.
It is not 30 seconds of blender. It escalates, peaks, converges, and ejects.

Rough timing:

```text
0–4s: entry pressure
4–10s: returned-gaze fracture, fast pulse starts
10–20s: full question/glyph system blooms
20–27s: questions thin, THE VOID dominates
27–30s: STARES BACK, blackout, RUN
```

The duration is governed by question-system completion, not stopwatch alone.

## TEST INSTRUCTIONS FOR JOSH

Test in Safari/browser first:

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v2271-void-gated-phone
```

Expected marker:

```text
BOOK FOREWORD v2.2.7.1 VOID GATED PASS
```

First test only:
- Open the link.
- Confirm normal pages do NOT snap to black.
- Page through normally to the Foreword closing page.
- On the closing page, tap the seal/closing card area.
- First tap should show `not yet`.
- Second seal-area tap should fade to black and show `i want sound`.
- Then test the rough Void tunnel.

Do not judge polish yet. Judge: no global black mask, timing, intensity, legibility, hierarchy, whether question system feels internal/self-referential, and whether `THE VOID` dominates instead of getting eaten by text soup.

## NEXT ONE BITE

Review v2.2.7.1 in browser.

No new code until Josh reports what he sees/feels.

Likely next fixes after review:
- if normal pages still black out, disable v227 on root immediately and isolate it
- if the seal tap zone is too narrow, broaden `inSealZone()` carefully
- if v226 still steals the seal transition, intercept the entire closing page only after proven current-closing match
- if text soup, reduce third layer/glyph density
- if Void not legible, simplify question/glyph layers and increase title dominance
- if pulse rhythm feels wrong, adjust slow/fast intervals and cue entry
- if 30 seconds drags, trim only after question-system completion is judged in motion

## PARKED / DO NOT TOUCH NOW

- Chapter 1 echo/inheritance. It was discussed and liked, but Josh correctly pulled us back. Do not edit Chapter 1 now.
- Full manuscript integration.
- Josh portrait page changes.
- Act II Ezekiel/Aristotle sequence.
- Tree of Life → DNA → Decision Tree sequence.
- Beautiful sanctuary tunnel / positive pole sequence. Conceptually required later, but not this sprint.
- PWA cache nuclear reset unless explicitly asked.
