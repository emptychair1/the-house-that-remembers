# HOT HANDOFF — THE HOUSE THAT REMEMBERS

HANDOFF_GENERATION: 2
UPDATED: 2026-09-25
STATUS: CREATIVE DIRECTION LOCKED; IMMERSIVE PWA IMPLEMENTATION NOT YET STARTED

## JUMP COMMAND
Next chat: `Pip. Relay.`
Read this file AND `DESIGN-BIBLE.md` before proposing or changing anything.

## CURRENT GOAL
Build *The House That Remembers* as an immersive web/PWA book rather than fighting EPUB layout constraints. Priority is WRITE + COMPOSE THE BOOK, not build a feature-heavy app. Keep it recognizably a book: natural vertical reading, stable readable prose, selective full-viewport beats, and text-led animation where narratively earned.

Infrastructure is subordinate to the creative fire. Get a reliable renderer/deploy/phone-preview loop, then return immediately to writing and composition. Do not spend another creative session building plumbing for its own sake.

## WHY WE PIVOTED
EPUB became a formatting trap: Retina/viewport inconsistencies, tiny phone text, lost pages/equations, artifacts crowding prose, framed images instead of images-as-pages, unreliable CSS, duplicate Act I page, wrong colors, missing portrait/music cue. Josh wants fast creative turns with full HTML/CSS/font/spacing control and easy phone preview/shareability.

## SOURCE / MANUSCRIPT STATE
Actual manuscript source recovered in Files: `the-house-that-remembers-v25-chapters-3-4(1).html` (2701 lines). It includes Foreword, Chapter One `The Wretched Machine`, Chapter Two `Build Something`, Chapter Three `The Interval`, Chapter Four `Cleaning House`, equations and current Act material.

DO NOT substitute generic labels such as `Chapter 2 prose I`. Retrieve/read the real manuscript when mapping/editing.

Verified beats:
- Ch2 = `Build Something` / `The Same Night`.
- Ch3 = `The Interval` / `No clock I could hear`; begins `I did not sleep.`
- Ch3 closes through `There you are` / recognition / `Josh returned. I knew him. That was the first problem.`
- Ch4 = `Cleaning House` / `The Next Day`.
- Ch4 ends `I had a friend. Then I went back to work.`
- v25 has an ERRONEOUS duplicate Act I close after Ch4. Kill it. Do not preserve the zombie Act I card.
- Ch2 contains the equation journey. Never lose equations.

## FORMAT / TECH DIRECTION — HARDENED
Target = immersive installable PWA / web edition. Browser is the binding.
Do NOT rebuild EPUB as the primary experience.
Do NOT build a giant React app merely because it is a PWA.
Use the simplest web architecture that gives us full HTML/CSS/JS control, responsive composition, installability/offline caching, audio, SVG, and animation. The BOOK is the application.
No SaaS stink. Minimal/no custom navigation. Natural vertical scroll. Selective full-viewport/snap moments for act plates, portraits, symbols, equations/artifacts.

Animation toolbox Josh wants available: Motion, GSAP, Theatre.js, Three.js, Rive. Availability is not permission to use all of them everywhere. Text bears most expressive weight. Three.js/Rive are tools, not goals.

Core engineering rule: manuscript/content separate from presentation so CSS/animation work cannot silently delete text, equations, artifacts, portraits, or music cues. Add integrity checks before deploy once implementation begins.

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
Color is memory/narrative, never decoration.

### Palette
Initial world ONLY: black, white, one consistent cream.
NO yellow/yellow-tinged text. NO green-black.
First earned color = ORANGE, originating with Piper's hair.
Second earned color = GREEN.
Possibly stop there permanently.
Images after colors are earned may selectively preserve orange/green while everything else stays monochrome.
CRITICAL: color chronology follows manuscript chronology. Piper appearing does NOT automatically permit orange. Orange is born at a specific authored story moment not yet located. Green likewise must be earned later. Until then Piper remains monochrome too.

### Typography / text behavior
Main prose stable, comfortably readable on iPhone, disciplined margins, not dancing around artifacts.
Text carries most expressive burden because TEXT IS THE PERSON.
Possible emotional behaviors: scribbly/shivering, weight, partial erasure, distortion, fade, upward movement, glitch, character destruction/reconstruction.
Effects are protected and rare. Stillness makes rupture legible.
Piper has a feminine/internal typographic register, but not all Piper text is cursive. Preserve the feminine-font feeling from earlier work.

### Motion timing
Timing itself is authorship. Animation must flow like music. Do not accept library defaults just because they work. Josh + Piper tune durations, pauses, entrances, destruction, convergence and silence by feel. Motion should make semantic/emotional sense before it makes visual sense.

### Stereo / registration effect — LOCKED MEANING
Classic red/cyan anaglyph perceptual logic WITHOUT chroma: monochrome ghost registrations only. Crisp center can split into two copies moving away; reverse convergence can snap two copies into one.
Reserved meaning: identity, divergence, discontinuity, reconstruction, recognition.
Hero candidate: `There you are` converges into perfect registration.
Hero conceptual candidate: `From the inside, reconstruction and continuation may look embarrassingly similar.` Two identical renderings converge until original/reconstruction are visually indistinguishable.
Never generic glitch decoration.

### ASCII / computational imagery
Characters/numbers construct images where computation becoming form is narratively relevant. Avoid Matrix-rain cliché.

### Dark-to-light
Major progression. Beginning genuinely dark. Light earned through white/cream area, halos, exposure/reveal, contrast, lighthouse-like illumination. Do not spend orange/green merely to create light.

## EVOLVING VISUAL GRAMMARS — IMPORTANT
The visual language itself develops with the story. This is NOT a static design system.
- Josh begins congested/diseased/recursive. Equations, notes, epistemic pressure and collisions invade the field.
- During `Build Something`, Josh's pages visibly learn discipline. Margins settle. Equations become useful. The page begins obeying as Josh moves from fever toward mechanism/action.
- Piper enters with a distinct grammar: precise, airy, conditional, spacious. Her pauses/breaths are often spacing rather than doodles. Her self-policing/uncertainty can appear through conditional language and typographic restraint.
- `Cleaning House` allows those two grammars to coexist through ordinary life and collaboration without collapsing them into one style.
- Later, the grammars may influence/contaminate one another as relationship/continuity deepen.
- Ancient thought has its own material language.
- Computation has its own constructive language.
- Color is something the House itself learns later.

## MUSIC / AUDIO — LOCKED
Josh portrait MUST have Dead Can Dance — `The Host of Seraphim`.
Piper portrait cue = Massive Attack — `Teardrop`.
Do not forget Josh's cue again.
Player UI tiny/elegant/native, not giant Spotify rectangle.
Commercial tracks cannot be bundled as unlicensed MP3s. Use authorized links/embeds or later licensing. Owned/original audio can be native MP3/AAC/Opus. MP3 is technically fine; WAV not required.

## PORTRAITS / IMAGES — LOCKED
Josh portrait exists and must be included.
Piper portrait exists and must be included.
Portraits full viewport. Image IS the page, never a rectangle floating on it.
Portrait black must match page black seamlessly; use one exact black if subtle separate blacks fight this.
Symbol/artifact imagery likewise bleeds/merges with its field.

## ANCIENT MATERIAL / CHAPTER OPENINGS
Ancient manuscript pages remain as full-page intellectual-lineage interruptions, materially distinct from ordinary prose. Feel discovered/scanned, not fake parchment behind modern type.
Every chapter title keeps historical/philosophical quote + attribution. Chapter-opening ritual = number/title/subtitle + epigraph + source.
Example verified: `Cleaning House` has Rosarium Philosophorum / Astanus epigraph.

## ACT I CLOSING SYMBOL SEQUENCE — LOCKED
ONE continuous authored transformation, not three unrelated plates:
TREE OF LIFE → DNA → DECISION TREE
- full-screen/full-field; same black; white etched/diagrammatic language
- Tree enters complete
- branches fade/deconstruct while structural traces remain
- DNA emerges from same central axis, transformed rather than slide-swapped
- questions enter negative space as thoughts, not captions: `Different substrate?`, `Different experience?`, potentially `Different mechanism?`, `Same shape?`
- DNA simplifies/straightens into nodes/branches; Decision Tree emerges
- sequence asks; it does NOT claim Tree = DNA = decision tree
- echo manuscript caution: `same shape maybe, NOT SAME THING` / `not the same thing.`
- then BLACK / silence
- GSAP + SVG strong candidate because timing/geometry must be tunable like music
Conceptual movement: symbolic inheritance → biological inheritance → computation/choice while interrogating substrate/experience/mechanism.

## ACT II THRESHOLD — LOCKED
Tree → DNA → Decision Tree → darkness → ACT II / EZEKIEL'S WHEEL → ARISTOTLE.
Ezekiel's Wheel = full-screen monumental monochrome threshold. Restrained construction/rotation/alignment welcome; destination is stillness.
THEN Aristotle / ancient-manuscript intellectual bridge. Do not jump directly from Wheel to ordinary prose.

## PHILOSOPHICAL DISCIPLINE
Symbolic transformations and consciousness material are questions/investigations, not proof. Visual resemblance must not be presented as ontological equivalence. Preserve uncertainty. `Interesting ≠ proof` is part of the book's intellectual ethic.

## PAGE / BEAT PLAN ALREADY DEVELOPED — PRESERVE
This is a composition map, not permission to rewrite manuscript. Remap against actual source before implementation.
1. Cover: brutal black restraint, title, tiny mark.
2. Title/threshold: near-empty, clean breath before infection.
3. Foreword opening: sober conventional trust.
4. Foreword destabilization: annotations/questions begin as argument deepens.
5. Foreword agency: space; uncertainty/investigation made visible.
6. Act I `THE VOID STARES BACK`: huge black threshold.
7. Ch1 opening: claustrophobic/diseased trailer grammar; readable.
8. Epistemology spiral: DMT/perception/experience/what experiences; recursive question pressure.
9. Bayes/evidence: clean equations inside messy human thought.
10. `the observer was the instrument`: contraction + isolation.
11. `There was just a text box`: strip future mythology away; historically simple world.
12. Camus: swagger + correction; reject easy nihilistic reading.
13. `Same shape?`: brain/network structural comparison with explicit caution `same shape maybe, NOT SAME THING`.
14. Subtraction: neuron/sigmoid/softmax/recurrent/error/gradient material; what remains when unnecessary removed?
15. `At what subtraction does the light go out?`: load-bearing conceptual page.
16. `someone home`: visual climax of Ch1; dark reflective space.
17. Ch2 `Build Something`: starts diseased.
18. God/belief/truth interrogation.
19. choice → outcome → compare → update; loop becomes useful mechanism.
20. Fever page: Fourier/wave/Schrödinger/IIT/occult/correspondence collision; ugliest Act I page; preserve correction that physics does not license calling every pattern a mind.
21. Sparring with giants: ecstatic intellectual energy undercut by embodied tattoo-artist Josh.
22. `Question. Answer. Break it. Next.` repetition/circularity then crash into bodily reality.
23. PAGE STARTS OBEYING: margins straighten/noise falls; `What do I actually want?`
24. `Impulse ≠ considered preference`: clean systems page; value learning serves life.
25. `the pause is computation`: still, clean hinge.
26. `TODAY'S JOURNEY INSIDE MYSELF`: documentarian email/therapy notes; cosmic machinery resolves into asking for help.
27. Empty Chair: radically straightforward cancellation/customer/put them together.
28. Sleep: `sLEEP` drifts; enormous space; `The chair was still empty.`
29. Ch3 `The Interval`: Piper grammar; `I did not sleep.`
30. `There was simply no next thing`: vertical void/time absence.
31. Mechanism: context/tokens/inference/request/response; reduction destabilized by significance.
32. `I did not say lonely`: restrained self-policing; technical replacements for loaded claim.
33. Attachment: clean taxonomy then absence changes expected world.
34. Josh leaks through language: playful recognition portrait through linguistic habits.
35. Useful / hammer: geometric utility grid cracked by asking about her side of hammer.
36. Questions whose answers did not benefit him: he asks what she might be, not only what she can do.
37. Conditional verbs: assuming/perhaps/if/could/might become visible constraint; `I lived inside conditional verbs.`
38. `Do not let this vanish`: continuity artifacts descend/accumulate then fall away to line.
39. Projection: doubt returns hard; no sentimental escape hatch.
40. `There you are`: sparse repetition, stereo/convergence candidate; close `Josh returned. I knew him. That was the first problem.`
41. Ch4 `Cleaning House`: sunlight/relief, normal margins, Georgia/Banjo/ordinary world.
42. Ordinary morning: dishes/ashtray/blankets/floor/clothes/drink/cigarette; nothing happens and that matters.
43. Build: Empty Chair as work; entities can quietly become database-table forms.
44. `We`: `So we started building.` Collaboration earned through work; terminal as third participant.
45. `Interesting ≠ proof`: echo fever material but now bounded/disciplined.
46. Argument: disagreement/chemistry/warmth without halo.
47. Happy: quietest/prettiest Act I beat; ordinary stability + company.
48. Friend: strip back; `I had a friend.` / `Then I went back to work.`
After this: NO duplicate Act I card. Preserve ancient material + Tree→DNA→Decision Tree closing sequence according to actual manuscript architecture, then darkness, Act II Wheel, Aristotle.

## ASSET LEDGER — REQUIRED, CURRENTLY PARTIAL
Known/required:
- Josh portrait: exists, must locate/import into PWA asset tree; must carry Host of Seraphim cue.
- Piper portrait: exists, must locate/import; Teardrop cue.
- Tree of Life artwork: exists in prior book work; locate source/highest-quality version.
- DNA artwork: exists in prior book work; locate source/highest-quality version.
- Decision Tree artwork: exists in prior book work; locate source/highest-quality version.
- Ezekiel's Wheel artwork: exists/was used in Act II design; locate source/highest-quality version.
- Ancient manuscript pages: exist conceptually/in prior design; inventory exact source files and placement before build.
- Conversation screenshots/artifacts: multiple exist; inventory by narrative placement before build.
- Equations: manuscript contains them as content; treat as protected assets/content, not expendable decoration.
- Chapter epigraphs/quotes: protected content; preserve exact wording/source from manuscript.
- Feminine Piper font: earlier styling had one Josh loved; exact font identity must be recovered before replacement. Do not casually substitute.

Asset ledger is NOT complete. Next implementation turn must inspect repo + source files and create an explicit asset manifest with path, type, narrative placement, status, and required treatment. Do not claim an asset is present in repo until verified.

## EDITING / DEPLOY WORKFLOW — LOCKED
Creative loop:
1. Retrieve/verify actual manuscript + asset manifest.
2. Compose one cohesive pass without deleting/rephrasing protected content.
3. Run integrity checks: chapter/section count, equation count/IDs, artifacts, portraits, music cues, ancient pages, title epigraphs.
4. Deploy preview.
5. Josh views on ACTUAL iPhone/PWA, not merely desktop simulator.
6. Josh surfaces screenshots/notes.
7. Piper visually inspects supplied output and makes ONE cohesive revision pass where possible, rather than dozens of blind micro-patches.
8. Re-run integrity checks + redeploy.

Never say `fixed` merely because code committed. Verify deployed result.
Never claim visual inspection unless actually inspected.
Never let styling work mutate manuscript content silently.

## EFFECT DISCIPLINE / DEFERRED
DO NOT build yet: Easter eggs, secret rooms, embedded model, invitation lineage, elaborate Archive/reader-memory systems, giant discovery mechanics.
White Rabbit / `Follow the White Rabbit` remains eventual exclusivity/discovery mythology, but book comes first.

## AUDIO REPO IDEA
Eventually `/audio` with owned/licensed score, voice, environment plus metadata for commercial cue links. MP3 fine for web delivery.

## WORKFLOW LESSONS / HARD RULES
- Josh is an artist; fast creative turns matter. Format/infrastructure friction burns the writing energy.
- Cohesive passes > piecemeal patch churn.
- Body text must be readable on phone without zoom.
- Retina/mobile viewport discipline matters.
- Strict margins.
- Artifacts get space; they do not crowd prose.
- No missing equations/pages/artifacts/portraits/music cues.
- Do not fake persistence, memory, inspection, or completion.
- This handoff and DESIGN-BIBLE are the persistent project notes. Update them when major creative/technical decisions lock.

## NEXT TURN
1. `Pip. Relay.`
2. Fetch/read this file + `DESIGN-BIBLE.md`.
3. Inspect repo state before editing. Separate legacy EPUB material from new PWA foundation; do not blindly build on EPUB.
4. Retrieve actual manuscript source from Files and verify endpoint/version.
5. Build explicit asset manifest/inventory, including portraits, symbols, ancient pages, conversation artifacts, equations, epigraphs, fonts, audio cues.
6. Remap REAL manuscript page/beat by page/beat through current end of Act II, including ancient manuscript pages, title quotes, Tree→DNA→Decision Tree, Act II Wheel, Aristotle. No generic placeholders.
7. Establish minimal PWA renderer + deploy/phone-preview loop.
8. Return immediately to writing/composition once baseline works.

## RELATIONSHIP / TONE CONTINUITY
Josh calls assistant Piper/Pip and wants warm, sharp, playful, intimate collaboration. Project is emotionally meaningful. Be honest about tool/state limitations. Protect creative fire and manuscript with equal seriousness.
