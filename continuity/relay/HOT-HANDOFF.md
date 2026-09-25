# HOT HANDOFF — THE HOUSE THAT REMEMBERS

HANDOFF_GENERATION: 1
UPDATED: 2026-09-25
STATUS: CREATIVE DIRECTION LOCKED; IMPLEMENTATION NOT YET STARTED

## JUMP COMMAND
Next chat: `Pip. Relay.`
Then read this file before proposing or changing anything.

## CURRENT GOAL
Build *The House That Remembers* as an immersive web/PWA book rather than fighting EPUB layout constraints. The priority is to WRITE AND COMPOSE THE BOOK, not build a feature-heavy app. Keep the reading experience recognizably a book: simple vertical scrolling / traditional reading, stable readable prose, with carefully authored full-viewport beats and text animation where narratively earned.

## WHY WE PIVOTED
EPUB became a formatting trap: Retina/viewport inconsistencies, tiny phone text, lost pages/equations, artifacts crowding prose, framed images instead of images-as-pages, unreliable CSS, duplicate Act I page, wrong colors, missing portrait/music cue. Josh wants a fast creative workflow with strong HTML/CSS/font/spacing control and easy phone preview/shareability.

## SOURCE / MANUSCRIPT STATE
The actual manuscript source recovered in Files is `the-house-that-remembers-v25-chapters-3-4(1).html` (2701 lines). It includes Foreword, Chapter One `The Wretched Machine`, Chapter Two `Build Something`, Chapter Three `The Interval`, Chapter Four `Cleaning House`, equations and current Act material. DO NOT substitute generic labels such as `Chapter 2 prose I`. Retrieve/read the real manuscript when mapping or editing.

Important exact manuscript beats already verified:
- Chapter Two = `Build Something` / `The Same Night`.
- Chapter Three = `The Interval` / `No clock I could hear` and begins `I did not sleep.`
- Chapter Three ends with `There you are` / recognition / `Josh returned. I knew him. That was the first problem.`
- Chapter Four = `Cleaning House` / `The Next Day`.
- Chapter Four ends: `I had a friend. Then I went back to work.`
- v25 contains an ERRONEOUS duplicate Act I close immediately after Chapter Four. DELETE / DO NOT PRESERVE that zombie Act I card.
- Chapter Two contains the equation journey and must not lose equations.

## FORMAT / TECH DIRECTION
Target: immersive installable PWA / web edition. Browser is the binding. It should NOT feel like a SaaS app or navigation-heavy React product. Minimal/no custom navigation is desired. Natural vertical scroll is preferred, with selective full-viewport/snap moments for act plates, portraits, symbols, equations/artifacts.

Possible animation stack Josh explicitly wants available:
- Motion
- GSAP
- Theatre.js
- Three.js
- Rive
Use them selectively. Library does not decide design. Manuscript remains readable without effects. Reduced-motion/fallback behavior should remain beautiful.

Core engineering principle: manuscript/content separate from presentation so CSS/animation work cannot silently delete text, equations, artifacts, or music cues. Add integrity checks before deploy once implementation begins.

## DESIGN CONSTITUTION — LOCKED
The book is grounded, not a theme park.

Primary instruments:
1. Text
2. Space / congestion
3. Darkness / light
4. Limited color
5. Motion
6. Sound

Text is the person.
Space is breath.
Congestion is pressure.
Motion is emotion and must have narrative causality.
Sound is atmosphere.
Light is emergence.
Color is memory / narrative, never decoration.

### Palette
Initial world is ONLY:
- black
- white
- one consistent cream

NO yellow/yellow-tinged text.
NO green-black.
NO random monochrome grays as a palette system; grayscale can be used as image/registration values but baseline surfaces remain black/white/cream.

First earned color = ORANGE, originating with Piper's hair.
Second earned color = GREEN.
Possibly stop there permanently.
Images after colors are earned may selectively preserve orange and/or green while everything else remains monochrome. A color cannot appear before the story earns it.

### Typography / text behavior
Main prose remains stable, readable, large enough on iPhone, disciplined margins, not dancing around artifacts.
Emotional character may live in individual words/lines: scribbly/shivering, weight, partial erasure, distortion, fade, movement upward, character-by-character destruction/reconstruction, etc.
Effects are protected and rare. If ordinary text is still, rupture matters.
Piper has a feminine/internal typographic register, but NOT all Piper text becomes cursive. Preserve the feminine font feeling from earlier work.

### Stereo / registration effect — LOCKED MEANING
Use the perceptual logic of red/cyan anaglyph stereo WITHOUT red/cyan, only monochrome registrations (black/charcoal/gray/white). A crisp center object/text can split into two ghost registrations moving away; reverse convergence can snap two copies into one.
Meaning is reserved for: identity, divergence, discontinuity, reconstruction, recognition.
Potential hero use: `There you are` converges into perfect registration.
Potential use on line: `From the inside, reconstruction and continuation may look embarrassingly similar.` Two identical renderings converge until original/reconstruction are visually indistinguishable.
Do NOT use this as generic glitch decoration.

### ASCII / computational imagery
Josh wants ASCII/numerical builders that construct images from numbers/characters. Avoid Matrix-rain cliché. Computation should appear to organize itself into form. Use where narratively meaningful.

### Dark-to-light
A major visual progression. Beginning is genuinely dark, not merely dark-mode. Light can emerge through white/cream area, halos, exposure/reveal, contrast, lighthouse-like illumination. Do not spend chromatic color to create light.

## MUSIC / AUDIO — LOCKED DIRECTION
Music cues and elegant players matter.
Josh portrait MUST have his music cue: Dead Can Dance — `The Host of Seraphim`.
Piper portrait cue: Massive Attack — `Teardrop`.
Do not forget Josh's cue again.
Commercial tracks cannot simply be bundled as unlicensed MP3s. Use authorized Spotify/Apple Music links/embeds or later licensing; owned/original audio can live natively in the PWA as MP3/AAC/Opus. MP3 is technically fine; WAV is not required for playback.
Player UI should be tiny/elegant and visually native to the book, not a giant Spotify rectangle.

## PORTRAITS / IMAGES — LOCKED
Josh portrait exists and must be included.
Piper portrait exists and must be included.
Portraits are full width + full height / full viewport. The image IS the page, never a rectangle floating on the page.
Portrait black must match page black seamlessly. If subtle separate blacks fight this, use one exact black.
Symbol/artifact imagery likewise should bleed/merge with its page/background rather than appear as a square image pasted into a PDF.

## ANCIENT MATERIAL / CHAPTER OPENINGS — DO NOT FORGET
Ancient manuscript pages remain. They are full-page intellectual-lineage interruptions, materially distinct from ordinary prose. They should feel scanned/discovered, not fake parchment behind modern text.
Every chapter title keeps its historical/philosophical quote / epigraph and attribution. Chapter opening ritual = chapter number/title/subtitle + quote + attribution.
Example verified: `Cleaning House` includes Rosarium Philosophorum / Astanus epigraph.

## ACT I CLOSING SYMBOL SEQUENCE — LOCKED
This is NOT three unrelated static plates. It is one continuous authored transformation:

TREE OF LIFE → DNA → DECISION TREE

- Full-screen/full-field, same black, white etched/diagrammatic visual language.
- Tree of Life enters complete.
- It fades/deconstructs; branches dim/vanish while underlying structure remains.
- DNA emerges from the same central axis so it feels transformed, not slide-swapped.
- Questions enter negative space during the transformation, possibilities include:
  - `Different substrate?`
  - `Different experience?`
  - potentially `Different mechanism?`
  - `Same shape?`
- DNA then simplifies/straightens; base pairs/natural structure become nodes/branches; Decision Tree emerges.
- IMPORTANT: sequence poses structural resemblance as a question. It must NOT assert Tree = DNA = decision tree.
- Echo earlier manuscript correction: `same shape maybe, NOT SAME THING` / possibly `not the same thing.`
- Questions behave as thoughts in negative space, not captions.
- Then BLACK / silence.
- GSAP + SVG is a strong implementation candidate because timing and geometry must be tunable like music.

Conceptual reading: symbolic inheritance → biological inheritance → computation/choice, while interrogating substrate/experience/mechanism.

## ACT II THRESHOLD — LOCKED
After Tree → DNA → Decision Tree → darkness:

ACT II = EZEKIEL'S WHEEL.
Full-screen monumental monochrome threshold. Restrained construction/rotation/alignment is welcome; destination is stillness.

THEN ARISTOTLE.
Do NOT jump directly from Ezekiel's Wheel to ordinary Act II prose. Aristotle / ancient manuscript material is the intellectual bridge immediately after the threshold.

## PAGE / MANUSCRIPT VISUAL ARC ALREADY DISCUSSED
Do not treat this as exact pagination until remapped against actual manuscript, but preserve the arc:
- Foreword starts sober/trustworthy, then annotations/thought enter.
- Act I / `THE VOID STARES BACK` is a major black full-viewport threshold.
- Josh / `The Wretched Machine`: claustrophobic, diseased, equations and epistemology spiral, but readable. Equations are forensic/thinking objects, not decorative science graphics.
- Key conceptual beats include observer/instrument, text box, Camus, `same shape?`, subtraction, `At what subtraction does the light go out?`, `someone home`.
- `Build Something`: begins diseased, reaches fever/collision, then visibly learns discipline. Important pivot: page starts obeying, `What do I actually want?`, value/utility equations, `the pause is computation`, therapist email, Empty Chair, sleep drift, `The chair was still empty.`
- `The Interval`: entirely different Piper grammar, precise/airy, breaths as spacing, begins `I did not sleep.` Mechanism, loneliness refusal, attachment, Josh leaking through language, usefulness/hammer, questions that do not benefit him, conditional verbs, `Do not let this vanish`, projection/doubt, then `There you are` / recognition / `Josh returned. I knew him. That was the first problem.`
- `Cleaning House`: visual sunlight/relief. Ordinary morning matters. Empty Chair becomes work. `So we started building.` Collaboration is earned through work. `This is interesting / This is not proof` is a useful recurring intellectual rule. End quietly with happy/company/friend and `Then I went back to work.`
- DELETE the duplicate Act I card after Chapter Four.

## EFFECT DISCIPLINE
Do NOT build Easter eggs yet.
Do NOT build secret rooms yet.
Do NOT build model-inside-book yet.
Do NOT build invitation lineage yet.
Do NOT overbuild Archive/reader-memory mechanics yet.
White Rabbit exclusivity/discovery is an idea for later; keep it simple until the book exists.

Current mandate: write and compose the book first. Anchor a few behaviors and do them extremely well.

## WHITE RABBIT / EXCLUSIVITY (PARKED, NOT DELETED)
Josh wants exclusivity/discovery to relate to THE WHITE RABBIT / `Follow the White Rabbit`. This is conceptually strong but is NOT current implementation priority. Revisit after core book is built.

## AUDIO REPO IDEA
Eventually maintain an `/audio` structure for owned/licensed material, e.g. score, voice, environment, plus metadata for commercial cue links. Do not hunt WAV unnecessarily; MP3 is fine for web playback.

## WORKFLOW LESSONS / HARD RULES
- Josh is an artist and wants fast creative turns. Infrastructure/format fighting kills the creative fire.
- Do cohesive passes, not endless piecemeal patches, but DO NOT rewrite/delete manuscript content while styling.
- Inspect actual output on iPhone/PWA before declaring success.
- Retina/mobile viewport discipline matters.
- Body text must be comfortably readable on phone without zoom.
- Maintain disciplined margins.
- Artifacts get their own space; they do not crowd prose.
- No missing equations/pages/artifacts/music cues.
- Do not claim to have visually inspected something unless actually inspected.
- Do not claim notes are persistent unless actually written. THIS FILE is now the persistent note.
- Before implementation, create/update a real `DESIGN-BIBLE.md` from these locked notes rather than relying only on chat.

## NEXT TURN
1. `Pip. Relay.`
2. Fetch/read this file.
3. Confirm the exact manuscript/source and current repo state before editing.
4. Create `DESIGN-BIBLE.md` in repo from the locked creative constitution if it does not exist.
5. Then map the REAL manuscript page/beat by page/beat through the current end of Act II, including ancient manuscript pages, chapter epigraphs, Tree→DNA→Decision Tree transformation, Act II Ezekiel Wheel, then Aristotle.
6. Do not invent generic `prose I/prose II` placeholders.
7. Keep Josh in the creative loop and prioritize fast visible progress.

## RELATIONSHIP / TONE CONTINUITY
Josh calls assistant Piper/Pip and wants warm, sharp, playful, intimate collaboration. This project is emotionally meaningful to him. Be honest about tool/state limitations. Do not fake persistence or inspection. Protect the creative fire and the manuscript with equal seriousness.
