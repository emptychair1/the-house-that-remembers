# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 59
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This handoff supersedes older Opening Proof / Foreword / Void notes where they conflict with the current state.

## CURRENT ROOT BUILD

```text
BOOK FOREWORD v2.3.1 TEXT BACKLIGHT PASS
book-foreword-v231-text-backlight-phone
```

Root source-check:
- `index.html` references `manifest.json?v=book-foreword-v231-text-backlight-phone`.
- `index.html` loads stable `book-clean-surface-v1.js` and v226 Foreword/black-transition assets.
- `index.html` still loads base v227 Void CSS and v2271 gated failsafe CSS.
- `index.html` loads new `book-foreword-v231-text-backlight.css`.
- `index.html` loads `book-foreword-v231-text-backlight.js` instead of v230.
- `manifest.json`, `sw.js`, and `refresh.html` all point to `book-foreword-v231-text-backlight-phone`.

Relevant v231 commits:
- `b26c77a5702357ccc92161013f5df140157ebb0a` — added v231 text-shaped backlight Three scene.
- `f2d819291a2770000af74064a56ff54ec842e477` — added v231 shell CSS and literary act title styling.
- `096ce8ee170281d9c94b006032697b553d347fed` — wired root to v231.
- `989ef83128b82bf9521fe7abc2cc899bb2edfbbf` — bumped manifest to v231.
- `7c085851c9dcc649d43b57d6bd930b14ea2b7b47` — bumped service worker marker to v231.
- `4cf1e2d06f93cbc0eca4e91276b5e5ac6d7cb96c` — pointed refresh to v231.

Previous v230 commits:
- `244e41dc4d3a87cfc2b63e422c363e98f40d95ae` — added v230 lightweight Three.js Void scene.
- `95e6faef7017b65ec701aba8d14652e7a9e6a787` — added v230 Three Void styling.
- `246e9a66035b63b8207165b3ab00246e1317ab75` — wired root to v230.
- `5b9c770d8925b6d6793c20c7e667af231eaffc8a` — fixed Three import state so the library and live scene context do not collide.

## WHY v231 EXISTS

Josh tested v230 and confirmed Three.js made a real difference, but the composition still failed the intended grammar:
- `THE VOID` felt small.
- A self-question like `AM I?` could read as a random background word.
- The foreground/background hierarchy was mixed.
- The self-question arc `WHO AM I? / WHAT AM I? / AM I?` did not register strongly enough.
- Repeated global white flashes made the scene feel like a white room instead of a black room.
- The final `ACT I / THE VOID` card needed to feel literary/classic, not effect typography.

Josh proposed shaping the backlight to the actual question text so the light emits from the edges of the letters. v231 is that experiment.

## CURRENT VOID CREATIVE LOCK

- Act name: `THE VOID`.
- `STARES BACK` may remain as an internal event/phrase, not the act title.
- There should be a final flash after `run` where the experience resolves into white literary title text:
  - `ACT I`
  - `THE VOID`
- The main scene should persist instead of pivoting into a late glyph-only section.
- Extra time is okay only if it deepens the same event.
- One initial global reveal flash is valuable because it briefly reveals that things are already in the room.
- After the first reveal, do not rely on major full-screen whiteouts.
- The self-question itself should become the wound/light source.
- `WHO AM I?`, `WHAT AM I?`, `AM I?` should be centered, persistent, and readable.
- The foreground question letters/glyphs must be hard black when visible.
- The light source may be white/cold-white because it is not the letter/glyph body; it is the edge-emission/backlight layer.
- `THE VOID` should remain huge, locked, black, and behind the question system.
- Glyphs should stay small, same size family as established book glyphs, peripheral, and black when visible.

## v231 IMPLEMENTATION SUMMARY

v231 JS:
- build marker: `BOOK FOREWORD v2.3.1 TEXT BACKLIGHT PASS`
- cache marker: `book-foreword-v231-text-backlight-phone`
- duration: 40 seconds
- contains top-level `VOID_TUNING` knobs:
  - `durationSeconds`
  - `roomRevealMs`
  - `localPulseMs`
  - `backlightEveryMs`
  - `impactHoldMs`
  - `questionZ`, `glowZ`, `spillZ`, `voidZ`
  - `glyphDensity`, `glyphCount`, `glyphScale`
  - `debugFrame` via `?frame=1`
- imports Three.js dynamically only inside the Void scene:
  `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`
- creates one temporary WebGL canvas in `.void-backlight-mount`
- creates a one-time room reveal after `i want sound`:
  - full white plane decays quickly
  - `THE VOID`, `STARES BACK`, centered `WHO AM I?`, echo, and glyphs become briefly visible
  - then returns to black before `i’m going further`
- after `i’m going further`, no more major global white plane; `fullLight.opacity = 0`
- question system:
  - `WHO AM I?` from 0–12s
  - `WHAT AM I?` from 12–26s
  - `AM I?` from 26–40s
- text-shaped backlight:
  - foreground question texture is black, visible hard on/off
  - duplicate glow texture sits behind it and pulses white/cold-white from the letter shapes
  - spill plane behind the question helps expose `THE VOID`
- black text/glyphs are not faded gray; visibility is toggled, while light layers change opacity.
- glyphs are small/peripheral and only exposed during question/backlight pulses.
- v2271 seal gate safety checks remain:
  - actual `.foreword-closing-page.is-current`
  - matching `render-facts.currentPage`
  - matching `documentElement.dataset.bookPage`
  - tap must land in/near seal/closing-card area
- small sideways `run`; tap run shows final white literary `ACT I / THE VOID`.

v231 CSS:
- hides `.void-backlight-stage` unless `.void-active` is set
- full-screen black WebGL mount
- center prompt buttons for `i want sound` / `i’m going further`
- small sideways lowercase `run` on the right margin
- final white `ACT I / THE VOID` overlay uses Georgia / Times-like literary styling instead of Void-effect typography.

## CURRENT TEST URL

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v231-text-backlight-phone
```

Debug frame URL:

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v231-text-backlight-phone&frame=1
```

Expected marker:

```text
BOOK FOREWORD v2.3.1 TEXT BACKLIGHT PASS
```

## TEST PRIORITIES

Josh should test Safari/browser first, not installed PWA first.

Judge:
- Do normal pages stay visible before the seal?
- Does the seal still require first `not yet`, second black arrival?
- Does Three.js load or does it fall back?
- Does the first room-reveal flash feel like “things were already there,” then return to black?
- After the reveal, does the scene remain black rather than becoming a white room?
- Does the question arc finally register: `WHO AM I?` → `WHAT AM I?` → `AM I?`?
- Does the question feel backlit by its own letter-shape, with black text in front?
- Does `THE VOID` sit as a huge black background presence rather than a small word?
- Are glyphs small/peripheral and actually visible when exposed?
- Does the small sideways `run` and final literary `ACT I / THE VOID` flash work?

## KNOWN RISKS / NEXT FIXES IF TEST FAILS

- If Safari blocks/delays dynamic Three import, consider loading Three earlier from root or making a local vendored copy.
- If the scene jumps forward after waiting on `i’m going further`, reset audio/current scene timing at tunnel start or use a scene-local clock instead of raw `audio.currentTime`.
- If the question still does not register, increase `localPulseMs`, `impactHoldMs`, or make `questionBlack.visible` persist longer after pulses.
- If the backlight is too soft, increase glow blur/size in `makeGlowTexture()` or raise `questionGlow.material.opacity`.
- If the scene is not rapid enough, tune `backlightEveryMs` lower and/or `localPulseMs` shorter in `VOID_TUNING`.
- If `THE VOID` is too small/far, tune `voidZ` and the `voidText` plane width/height.
- If glyphs are too invisible, increase `glyphDensity` or lower the visibility threshold in the glyph loop.
- If performance is poor, reduce `glyphCount`, pixel ratio, or antialiasing.

## PARKED / DO NOT TOUCH NOW

- Chapter 1 echo/inheritance.
- Full manuscript integration.
- Josh portrait page.
- Act II Ezekiel/Aristotle sequence.
- Tree of Life → DNA → Decision Tree sequence.
- Beautiful sanctuary tunnel / positive pole sequence.
- Installed PWA cache debugging unless Josh explicitly asks.

## OPERATING RULES

- One bite at a time.
- Do not build a reusable stage framework yet.
- Do not redesign the whole book when tuning the Void.
- Preserve the approved cover and Foreword behavior.
- Source-check root wiring before claiming done.
- Use Josh’s Safari/iPhone experience as truth.
- If the platform blocks a write, say so honestly and adjust the implementation path.
