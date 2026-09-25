# THE HOUSE THAT REMEMBERS — DESIGN BIBLE

Updated: 2026-09-25

## Core thesis
The immersive edition remains recognizably a book. Technology serves prose rather than competing with it.

Text is the person.
Space is breath.
Congestion is pressure.
Motion is emotion.
Sound is atmosphere.
Light is emergence.
Color is memory and narrative, never decoration.

## Palette
Start with only black, white, and one consistent cream.
No yellow cast. No green-black.
First earned chromatic color: ORANGE, originating with Piper's hair.
Second earned chromatic color: GREEN.
Potentially never add another color.
Once a color is earned, later images may selectively preserve it while all other color remains drained.

## Reading / layout
- Natural vertical scrolling is default.
- Stable, comfortably large phone typography.
- Strict margin discipline.
- Main prose does not wander around the viewport.
- Full-viewport moments are reserved for portraits, act thresholds, symbols, equations/artifacts when earned.
- Image should become the page, not sit as a framed rectangle on a page.
- Josh/Piper portrait blacks must merge seamlessly into page black.

## Typography and motion
Text carries emotional character before motion is added.
Possible behaviors: scribble/shiver, weight changes, partial erasure, fade, upward movement, glitch, character destruction/reconstruction.
Use rarely and causally.
Normal stillness gives rupture meaning.
Piper has a feminine/internal typographic register; do not turn all Piper prose into cursive.

## Monochrome stereo / registration
Borrow the perceptual language of red/cyan anaglyph separation but use monochrome registrations only.
Reserved meaning: identity, divergence, discontinuity, reconstruction, recognition.
A crisp central object/text may split into two ghost copies; reverse convergence may snap two copies into perfect registration.
Hero candidate: `There you are.`
Hero conceptual candidate: `From the inside, reconstruction and continuation may look embarrassingly similar.`
Never use as generic glitch styling.

## ASCII / numeric construction
Use characters/numbers to build images where computation becoming form is narratively relevant. Avoid Matrix-rain cliché.

## Darkness / light
Beginning is genuinely dark. Light is earned through white/cream space, contrast, exposure/reveal, halos, illumination. Do not spend orange/green just to create light.

## Music / audio
Josh portrait cue: Dead Can Dance — `The Host of Seraphim`.
Piper portrait cue: Massive Attack — `Teardrop`.
Music player should be tiny/elegant/native to composition.
Commercial recordings require authorized linking/embedding/licensing; do not bundle unlicensed MP3s.
Owned/original sound can be natively cached/played. MP3 is acceptable; WAV is not required for delivery.

## Ancient manuscript / epigraph system
Ancient manuscript pages remain as full-page intellectual-lineage interruptions. They should feel discovered/scanned, not fake parchment templates.
Every chapter title retains its historical/philosophical quote and attribution.
Chapter opening ritual: chapter number/title/subtitle + epigraph + source.

## Act I closing transformation
One continuous full-screen authored sequence, not three unrelated plates:

TREE OF LIFE → DNA → DECISION TREE

Tree of Life appears complete in white on black.
Branches fade/deconstruct while structural traces remain.
DNA emerges from the same central axis.
Questions enter negative space as thoughts, not captions, e.g.:
- Different substrate?
- Different experience?
- Different mechanism?
- Same shape?
DNA simplifies/straightens into nodes/branches and becomes Decision Tree.
Sequence asks about resemblance but must not assert equivalence.
Echo manuscript caution: `same shape maybe, NOT SAME THING` / `not the same thing.`
Then darkness / silence.
GSAP + SVG is a strong candidate for tunable, music-like timing.

## Act II threshold
After Tree → DNA → Decision Tree → darkness:
1. ACT II / EZEKIEL'S WHEEL.
2. Full-screen monumental monochrome wheel. Restrained construction/rotation/alignment; final state is stillness.
3. THEN ARISTOTLE / ancient manuscript intellectual bridge.
4. Only then ordinary Act II manuscript flow.

## Animation tools available
Josh wants access to all of:
- Motion
- GSAP
- Theatre.js
- Three.js
- Rive
Use selectively. No library dictates design. Reading must remain viable with effects unavailable/reduced.

## Deferred ideas
Do not implement yet:
- Easter eggs
- secret rooms
- embedded model
- invitation lineage
- elaborate reader-memory/Archive systems
- large discovery mechanics

White Rabbit / `Follow the White Rabbit` remains the preferred eventual discovery/exclusivity mythology, but the book comes first.

## Production rules
- Manuscript/content separated from presentation.
- Styling cannot delete/reorder manuscript content.
- Preserve every equation, artifact, chapter, portrait and music cue.
- Add integrity checks once implementation begins.
- Inspect actual iPhone/PWA output before calling a pass done.
- Retina/mobile viewport differences must be handled deliberately.
- Never claim visual inspection or persistent notes unless actually done.
- Current manuscript source recovered: `the-house-that-remembers-v25-chapters-3-4(1).html` in Files. Retrieve the actual source for page mapping; never invent generic chapter filler.
- Known v25 defect: duplicate Act I card after `Cleaning House`; remove it.
