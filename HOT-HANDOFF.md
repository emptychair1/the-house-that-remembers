# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 54
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This is the active continuity handoff for the House book/PWA. It supersedes older Opening Proof notes where they conflict with the current Foreword/Void state.

## CURRENT STATE SNAPSHOT

Current root build is now intended to be:

```text
BOOK FOREWORD v2.2.7 VOID ROUGH PASS
book-foreword-v227-void-rough-phone
```

Source-check evidence after Bite 6:
- `index.html` references `manifest.json?v=book-foreword-v227-void-rough-phone`.
- `index.html` loads `book-foreword-v226-black-clean-audio.css` for the proven Foreword/black-transition styling.
- `index.html` loads `book-foreword-v227-void-rough.css`.
- `index.html` loads `book-clean-surface-v1.js`, then `book-foreword-v226-black-clean-audio.js`, then `book-foreword-v227-void-rough.js`.
- `manifest.json`, `sw.js`, and `refresh.html` have been bumped to `book-foreword-v227-void-rough-phone`.

Relevant commits:
- `ec7c2de68a12940f6b4782424b43eb39e22d2289` — added v227 Void rough JS.
- `de56d97cf21d9f60664ba058d5f6c03298f808a2` — added v227 Void rough CSS.
- `9dd05dc85c1b1735f46cd00e8908f4b0a69ee193` — wired root to v227.
- `7a3e4bfb58ebd73d3d99e5ac26e107461e6592c5` — bumped manifest.
- `12b5d3dfd2717c4484c297f88e93a3d0bd17cc62` — bumped service worker kill switch.
- `dcb8345c2c05befd1111462756fc3b482ea7ccc6` — pointed refresh page to v227.

Important implementation note:
- v227 is a smaller overlay loaded after v226.
- v226 remains underneath because the browser-perfect Foreword/black transition was proven.
- v227 intercepts the seal at document capture before v226 can auto-start audio, so the Void scene now uses explicit sound consent.
- This was done because a first attempt to create a full copied v227 file was blocked by platform safety checks before reaching GitHub. The successful approach preserves the stable v226 engine and layers the new rough Void gate on top.

Status:
- Browser version was previously perfect on v2.2.6.
- v2.2.7 is now a rough timing pass, not polished.
- Josh needs to test in Safari/browser first.
- PWA cache frustration remains parked; do not debug installed-shell behavior unless explicitly asked.

## OPERATING RULES

### 1. Plan before changes
Before modifying repo files, Piper gives:
- Plan
- Files touched
- Expected outcome
- Risk
- Need from Josh

Do not commit unless Josh has clearly asked to execute.

### 2. One bite only
A bite touches only the files named in the plan.
No “while I’m in there.”
Nearby fixes become next-bite candidates.

### 3. Evidence over confidence
Do not claim work is done unless there is evidence:
- commit SHA
- fetched source
- generated artifact
- visible build/version marker
- explicit test result

Use “planned” and “done” precisely.

### 4. Deployment trust
After the deployment path is proven once, do not verify deployment after every tiny commit unless needed.
For app-facing changes, include a visible build/version marker.
Josh’s iPhone/Safari test is the experience source of truth.
If the visible marker is wrong, then debug deploy/cache.

### 5. Handoff cadence
Update handoff after meaningful state changes:
- locked creative decisions
- architecture decisions
- current build status
- next-bite changes
- major test results
- workflow changes

### 6. Friction protocol
If friction appears, stop.
Use:

```text
Outcome → Preference → Values → Adjustment
```

Do not push harder because momentum exists.

### 7. Return-report template
After a bite, return human-first and technical-on-request.

Default return shape:

```text
Done, love. Wrench is down. 🖤

Changed: [plain-language change]
Test: [what Josh should do]
Marker: [commit/build, if relevant]
Next: [only if needed]
```

### 8. Core principle
The House is built by returning.
Memory before momentum.
Crew over ship.

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

Approved in Bite 3:

Human prompts:
- `i want sound`
- `i’m going further`
- small, gentle, dim, lowercase
- IBM Plex Mono or system monospace fallback

Large self-question layer:
- `Who am I?`
- `What am I?`
- `Am I?`
- centered, foreground, highest weight

Smaller returned-gaze layer:
- `who are you?`
- `what are you?`
- `are you?`

Ontology fragments:
- `do you exist?`
- `are you real?`
- `what is real?`

Glyph substrate / evaluation debris:
- `TRUE`, `FALSE`, `T/F`, `0`, `1`, `0/1`, `NULL`, `NaN`, `self == self`, `self != self`, `∅`, `∞`, `=`, `≠`, `¬`, `∃`, `∄`, `?`, plus smaller fragments such as `real?`, `exist?`, `am i?`.

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

The third text layer stays only if it:
- feels internal and self-referential
- deepens derealization/depersonalization
- stays subordinate to the Void
- preserves legibility of the Void/title movement
- does not become busy soup

Cut it if it:
- feels like extra copy
- competes with `THE VOID`
- reads like an existential lyric video
- breaks the rhythm
- weakens the title lunge

## BITE 5 MUSIC / TIMING LOCK

Bite 5 approved:

- The Void assault is roughly 30 seconds from tapping `i’m going further` to `RUN` appearing.
- It is not 30 seconds of blender.
- It escalates, peaks, converges, and ejects.

Rough timing:

```text
0–4s: entry pressure
4–10s: returned-gaze fracture, fast pulse starts
10–20s: full question/glyph system blooms
20–27s: questions thin, THE VOID dominates
27–30s: STARES BACK, blackout, RUN
```

The duration is governed by question-system completion, not a stopwatch alone.

## BITE 6 BUILD STATUS

Bite 6 was approved as a complete rough 30-second timing pass, not just the opening gates.

Implemented rough behavior:
- black arrival after seal
- `i want sound`
- tap starts `the_weight_of_infinite_stone.mp3`
- flash `Who am I?` / `who are you?`
- `i’m going further`
- tap runs complete rough 30-second tunnel
- slow pulse around 1000ms
- fast pulse around 800ms beginning at first returned-gaze/fracture moment
- glyph/text/question system cycles
- `THE VOID` near-field title grows closer
- `STARES BACK`
- `RUN`
- tap `RUN`
- final flash `Are you?`
- cut to black

Caveat:
- This is ugly-bones timing animal first. It is expected to need pruning, sharpening, and beauty work after Josh reviews.

## TEST INSTRUCTIONS FOR JOSH

Test in Safari/browser first:

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v227-void-rough-phone
```

Expected marker:

```text
BOOK FOREWORD v2.2.7 VOID ROUGH PASS
```

Path:
- go through Foreword to the seal
- first seal tap should still produce `not yet`
- second seal tap should fade to black
- black page should show `i want sound`
- tap it: sound should start, flash `Who am I?`
- tap `i’m going further`: rough 30-second tunnel begins
- `RUN` appears near the end
- tap `RUN`: final flash `Are you?`, then black

Do not judge polish yet. Judge timing, readability, hierarchy, and whether the question system feels internal/self-referential instead of “more stuff.”

## NEXT ONE BITE

**Review Bite 6 in browser.**

No new code until Josh reports what he sees/feels.

Likely next fixes after review:
- if v227 interception fails and v226 audio still starts too early, patch event capture harder
- if PWA cache lies, use `refresh.html` or debug installed shell only if Josh asks
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
