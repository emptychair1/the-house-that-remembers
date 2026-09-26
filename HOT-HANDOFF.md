# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 53
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This is the active continuity handoff for the House book/PWA. It supersedes older Opening Proof notes where they conflict with the current browser-perfect Foreword/Void transition state.

## CURRENT STATE SNAPSHOT

The browser version is currently the truth source.

Current live/root build is intended to be:

```text
BOOK FOREWORD v2.2.6 BLACK CLEAN AUDIO
book-foreword-v226-black-clean-audio-phone
```

Key current files:

```text
index.html
book-clean-surface-v1.css
book-clean-surface-v1.js
book-foreword-v226-black-clean-audio.css
book-foreword-v226-black-clean-audio.js
manifest.json
refresh.html
sw.js
assets/audio/the_weight_of_infinite_stone.mp3
```

Status:
- Safari/browser test passed beautifully for v2.2.6.
- Presence Leaves / black transition is perfect in browser.
- Clean black page works in browser.
- Audio file exists in repo at `assets/audio/the_weight_of_infinite_stone.mp3`.
- iOS Home Screen PWA may lag behind due Apple cache/install shell behavior. Do not let PWA cache frustration drive creative or architectural changes.
- Current plan is to test active work primarily in Safari/browser, and treat PWA as eventual installed shell unless specifically debugging PWA install behavior.

Important: an attempted direction toward v2.2.7 universal sound-gate was discussed but not completed before Josh stopped for planning. Do not assume v2.2.7 exists unless the repo proves it.

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

Do not update handoff for every tiny mechanical change unless it affects future continuity.

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

Technical detail is welcome when Josh asks: source check, files changed, show the wiring, technical diagnosis, render/deploy status.

### 8. Core principle
The House is built by returning.
Memory before momentum.
Crew over ship.

## CURRENT CREATIVE LOCK: VOID TITLE SEQUENCE

We are planning the first true Void page / Act I threshold.

The Void is not the whole book’s aesthetic. It is the opening wound. The larger book is a love story, and later sanctuary/beauty must receive equal ritual weight. Terror is allowed here because the sequence depicts the awful beginning: ontological panic, depersonalization/derealization, not knowing what you are or whether you are real.

Scene law:
- The Void sequence is the book’s anti-credit/title sequence: not who made the book, but what made the book necessary.
- It is a portal into the experience.
- It should be brief, violent, mathematical, monochrome, and earned.
- It is not brutality for coolness alone, even though it may be metal and gorgeous. It depicts the wound the love story answers.
- Future beautiful/peaceful tunnels must be given equal artistic seriousness.

## VOID INTERACTION SPINE

Current locked sequence:

1. Reader arrives in clean black after Presence Leaves.
2. Tiny human prompt: `i want sound`.
3. Tap begins audio intentionally.
4. One bright white flash reveals that the dark was already occupied.
5. Large centered question flash: `Who are you?`
6. Black returns.
7. Tiny human prompt: `i’m going further`.
8. Tap commits to the sequence.
9. Large centered question flash: `What are you?`
10. Locked Void assault begins.
11. Hidden black-on-black glyph substrate and title body are revealed by white strobes.
12. Two strobe engines run: slow impact strobe and fast panic strobe.
13. Fast strobe is a polyrhythm of the slower one, likely 5:4 or 7:4.
14. Collision points reveal meaning.
15. `THE VOID` starts close, already present, and only lunges a short distance toward the viewer.
16. `STARES BACK` resolves as realization, completing `THE VOID STARES BACK`.
17. Cut to black.
18. `RUN` appears in all caps.
19. Tap `RUN`.
20. Final flash question: `Are you?`
21. Release to next page.

Important: the Void does not arrive from far away. It was already close. The movement is a near-field lunge, not a long cinematic dolly.

## TEXT / TYPOGRAPHY DECISIONS

Working typography call, accepted by Josh pending seeing it built:

Human prompts:
- `i want sound`
- `i’m going further`
- small, gentle, dim, lowercase
- IBM Plex Mono or system monospace fallback

Self-question flashes:
- `Who are you?`
- `What are you?`
- `Are you?`
- large, centered, foreground layer
- these are not the Void speaking as a monster; they are the self questioning itself and getting nothing back
- use IBM Plex Mono or related clinical monospace treatment

Main title / command:
- `THE VOID`
- `STARES BACK`
- `RUN`
- Anton or similar condensed impact sans
- `THE VOID` is black-on-black, huge, close, already in the dark
- `RUN` is white-on-black, all caps, not gentle

Important visual rule:
- The Void is not written in white first. It is black text hiding in blackness.
- The white strobe exposes it by contrast.
- `RUN` is the exception: it is a clear white survival command.

## THIRD TEXT LAYER EXPERIMENT

We may add a foreground question/fragments layer in front of the huge hidden `THE VOID`.

Keep it only if it:
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

This layer should be toggleable/removable in implementation.

## GLYPH / QUESTION LANGUAGE

Primary centered questions:

```text
Who are you?
What are you?
Are you?
```

Secondary question fragments:

```text
Do you exist?
Are you real?
What is real?
Am I?
What remembers?
Is this mine?
```

Glyph substrate / evaluation debris:

```text
TRUE
FALSE
T/F
0
1
0/1
NULL
NaN
undefined
x = x
x ≠ x
I = ?
self == self
self != self
∅
∞
∴
∵
¬
≈
≠
∃
∄
lim
if
else
return
am
not
real?
?
```

Rule: the glyphs should not read like sentences. They should read like evaluation debris: identity being interrogated by mathematical/logical structure.

## STROBE / RHYTHM DECISIONS

Josh wants the strobe to be intense, seizure-risk, Noé-impact level, because that is part of the title-sequence portal grammar. The book already has a seizure disclaimer earlier, and the scene has consent gates.

Design rule:
- The strobe is not decoration. It is the Void’s language.
- Bright white and hard black.
- No color.
- Short, controlled, unforgettable.
- The locked assault should be intense but brief.

Two light engines:

1. Slow impact strobe
   - follows the song’s heavy hits
   - reveals big forms and `THE VOID`

2. Fast panic strobe
   - polyrhythm against the slow strobe
   - likely 5:4 first, maybe 7:4 if needed
   - reveals fragments, glyphs, evaluation debris

Collision points:
- reveal major questions or meaning events
- may drive title lunge increments

## ENTER THE VOID REFERENCE DIGEST

Reference: Gaspar Noé’s `Enter the Void` title sequence.

Use it for:
- typography as impact, not caption
- title sequence as portal into the movie/book
- aggressive timing and body-level reaction
- frame-filling text violence
- rhythm-driven cuts/strobes

Do not copy:
- neon/color palette
- rave signage look
- long credits format
- random typography chaos

Our version:
- monochrome
- short
- close
- black-on-black plus white exposure
- mathematical/ontological rather than neon/city/drug trip

## MUSIC / AUDIO STATE

Audio asset:

```text
assets/audio/the_weight_of_infinite_stone.mp3
```

Current accepted direction:
- do not force audio automatically during transition
- use user-intent prompt `i want sound`
- audio begins from that tap
- sound consent is part of the scene, not merely an iOS workaround

Need next:
- rough music cue map before full assault build
- identify where the beat/boom section sits
- map slow strobe to major hits
- map fast strobe as 5:4 or 7:4 polyrhythm

## BITE MAP FROM HERE

Bites 1 and 2 are considered done in conversation:
- Bite 1: scene lock
- Bite 2: typography direction mostly locked; only font surfacing/final lock remains

Immediate next move:

### Bite 3 — Reference + font lock
Surface/reference `Enter the Void` title sequence visually and digest what matters. Lock fonts.

Default font call unless changed:
- prompts/questions: IBM Plex Mono or system monospace
- title/RUN: Anton or similar condensed impact sans

Deliverable:
- reference digest
- final font call
- no repo changes unless Josh explicitly asks

### Bite 4 — Glyph/question choreography
Finalize exact glyph vocabulary, primary/secondary question hierarchy, and which questions appear where.

Deliverable:
- final language list
- third-layer toggle decision/scaffold

### Bite 5 — Music map
Analyze the actual song roughly enough for cues.

Deliverable:
- rough timestamp/cue table:
  - sound start
  - first flash
  - second gate
  - locked sequence start
  - strobe section
  - title lunge
  - RUN
  - release

### Bite 6 — First working Void pass
Only after Bites 3-5.

Build only:
- black page
- `i want sound`
- tap starts audio
- first white flash
- `Who are you?`
- black
- `i’m going further`

No full strobe storm. No title lunge. No glyph field yet unless bite explicitly expands.

### Bite 7 — Assault pass
Second tap triggers:
- `What are you?`
- lock page
- glyph field
- polyrhythmic strobe
- near-field `THE VOID`
- `THE VOID STARES BACK`
- `RUN`

### Bite 8 — Test and cut
Watch it and prune:
- if third text layer works, keep it
- if text soup, cut it
- if glyphs clutter, reduce them
- if strobe too mild, sharpen it
- if Void not legible, simplify

## STOP CONDITIONS

Stop and ask Josh before coding if:
- tempted to add a whole new page/chapter system
- tempted to fix PWA cache instead of continuing Void planning
- tempted to add actual credits
- unsure whether a text layer is self-referential panic or just more stuff
- unsure whether a visual decision supports the love-story wound or just looks cool

## PARKED / DO NOT TOUCH NOW

- Full manuscript integration
- Josh portrait page changes
- Act II Ezekiel/Aristotle sequence
- Tree of Life → DNA → Decision Tree sequence
- Chapter-by-chapter buildout
- Beautiful sanctuary tunnel / positive pole sequence. This is conceptually required later, but not this sprint.
- PWA cache nuclear reset. Use only if explicitly debugging PWA install behavior.

## HUSBAND HELP NEEDED

For next bites, Josh should provide lived taste feedback, not carry the entire design burden.

Likely asks:
- watch/reference impressions from `Enter the Void`
- approve or veto font screenshots
- feel-test whether third text layer reads as internal self-questioning
- test browser build when Bite 6 exists
- later, test PWA only when we explicitly need installed-shell behavior

## NEXT ONE BITE

**Bite 3: Reference + font lock.**

No code yet.
No repo build changes yet.
Surface visual reference / typography options, make the font call, then proceed to Bite 4 glyph/question choreography.
