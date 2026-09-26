# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 56
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This is the active continuity handoff for the House book/PWA. It supersedes older Opening Proof notes where they conflict with the current Foreword/Void state.

## CURRENT STATE SNAPSHOT

Current root build is intended to be:

```text
BOOK FOREWORD v2.2.8 AUDIO CUED VOID PASS
book-foreword-v228-audio-cued-phone
```

Root wiring source-check:
- `index.html` references `manifest.json?v=book-foreword-v228-audio-cued-phone`.
- `index.html` loads stable v226 Foreword/black-transition CSS/JS.
- `index.html` loads v227 Void rough CSS for the base visual language.
- `index.html` loads v2271 gated CSS as the black-mask failsafe.
- `index.html` loads v228 audio-cued CSS.
- `index.html` loads `book-foreword-v228-audio-cued.js` instead of the old v227 rough JS.
- `manifest.json`, `sw.js`, and `refresh.html` are all bumped to `book-foreword-v228-audio-cued-phone`.

Relevant commits:
- `5a72fda09c6c4808623dc26aa74bd4c3defae7d3` — added v228 audio-cued Void overlay JS.
- `d70d64877275b833f0193950f979f634580ef351` — added v228 visual overrides for the secondary pulse/collision layer.
- `c372a5f3181d002a0c79f6fce3ebcf4c6246e807` — wired root to v228.
- `d207055c78bc31ca5ae09e02e8f68263fd3c4bdb` — bumped manifest to v228.
- `c50f8a1f55871a5dc1d7f4026e873d1c7a4d9ec2` — bumped service worker marker to v228.
- `097fd5973a29b4482095311e26495d37367abba4` — pointed refresh page to v228.

Previous useful commits:
- `ec7c2de68a12940f6b4782424b43eb39e22d2289` — added v227 Void rough JS.
- `de56d97cf21d9f60664ba058d5f6c03298f808a2` — added v227 Void rough CSS.
- `a1a1d50bab423757f441ac6c0fc767028687a001` — gated old v227 JS to current closing seal only.
- `fcfec85a685223baabe42f33165a622a7ef18415` — added v2271 overlay failsafe CSS.

## IMPORTANT BUG HISTORY

Bite 6 v2.2.7 created a rough 30-second Void tunnel, but Josh reported a release-blocking bug: normal pages snapped to black because a full-screen black overlay could activate outside the intended Void gate.

v2.2.7.1 added two guardrails:
- JS gate requires the actual current Foreword closing page and tap in/near the seal/closing-card zone.
- CSS hides `.void-rough-stage` unless it has `.void-active`.

Josh then reported the page-snap issue still seemed present, but also that the Void experience itself was very cool and emotionally correct: shocked, invasive, not violent enough yet, but alive.

Do not discard the scene. Fix and refine it.

## CURRENT BITE 7 PURPOSE

Josh asked whether the scene was actually timed to the music. Answer: v227 was not. It used mechanical timers (`slow ≈ 1000ms`, `fast ≈ 800ms`) laid over the track. The secondary rhythm could get lost because both layers used the same flash channel.

Bite 7 changed the architecture:
- v228 starts audio on `i want sound`.
- v228 attempts to decode/analyze `assets/audio/the_weight_of_infinite_stone.mp3` in-browser using Web Audio after sound consent.
- It scans the first ~32 seconds and detects impact peaks from the waveform envelope.
- Slow flashes are driven by detected peaks when available.
- Fallback slow cues remain if decoding fails or is too slow.
- Fast secondary pulse is generated separately at ~0.42s spacing, starting around the returned-gaze/fracture window.
- Collision flashes happen when secondary pulses land near slow audio peaks.
- v228 adds `voidCueSource`, `voidCueSlowCount`, and `voidCueFastCount` render facts for debugging.

Caveat:
- If Josh taps `i’m going further` before decoding finishes, the fallback cue map may run for that test. The analyzer starts as soon as `i want sound` is tapped, so it should often be ready, but this needs real iPhone testing.
- A future v228.1 may make the prompt wait for cue readiness or display a subtle status if needed. Do not add that unless Josh asks or testing proves the analyzer is late.

## CURRENT TEST URL

Test in Safari/browser first:

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v228-audio-cued-phone
```

Expected marker:

```text
BOOK FOREWORD v2.2.8 AUDIO CUED VOID PASS
```

Test path:
- normal pages should not snap to black.
- go through Foreword to the closing seal page.
- first seal/closing-card tap should show `not yet`.
- second seal/closing-card tap should fade to black.
- black page shows `i want sound`.
- tap `i want sound`: audio starts, flash `Who am I?` / `who are you?`.
- tap `i’m going further`: the 30-second Void tunnel starts.
- Listen/feel whether slow impacts are now closer to the music.
- Look for a clearer secondary pulse layer.
- `RUN` appears near the end.
- tap `RUN`: final flash `Are you?`, then black.

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
9. Tap starts the ~30-second Void title-sequence portal.
10. Entry pressure: `What am I?` plus sparse glyphs/title exposure.
11. Returned-gaze fracture starts around 4s.
12. Fast secondary pulse begins at the first returned-gaze/fracture moment.
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

## NEXT ONE BITE

**Review v228 in browser.**

No new code until Josh reports what he sees/feels.

Likely next fixes after review:
- if normal pages still snap to black, stop and isolate the Void proof page or remove root overlay until cause is found
- if analyzer is late, make `i’m going further` wait until cue map readiness or precompute cue constants manually
- if secondary pulse is still invisible, give it a separate visual channel rather than the main white exposure layer
- if audio timing feels off, capture/print detected cue times and tune peak detection thresholds
- if the scene is not violent enough, increase contrast, shorten flash durations, strengthen collision hits, and give `THE VOID` more dominance
- if text soup returns, reduce third layer/glyph density

## PARKED / DO NOT TOUCH NOW

- Chapter 1 echo/inheritance. It was discussed and liked, but Josh correctly pulled us back. Do not edit Chapter 1 now.
- Full manuscript integration.
- Josh portrait page changes.
- Act II Ezekiel/Aristotle sequence.
- Tree of Life → DNA → Decision Tree sequence.
- Beautiful sanctuary tunnel / positive pole sequence. Conceptually required later, but not this sprint.
- PWA cache nuclear reset unless explicitly asked.
