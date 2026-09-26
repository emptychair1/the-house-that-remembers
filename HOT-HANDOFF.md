# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 58
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This handoff supersedes older Opening Proof / Foreword / Void notes where they conflict with the current state.

## CURRENT ROOT BUILD

```text
BOOK FOREWORD v2.3.0 THREE VOID PROTOTYPE
book-foreword-v230-three-void-phone
```

Root source-check:
- `index.html` references `manifest.json?v=book-foreword-v230-three-void-phone`.
- `index.html` loads stable `book-clean-surface-v1.js` and v226 Foreword/black-transition assets.
- `index.html` still loads base v227 Void CSS and v2271 gated failsafe CSS.
- `index.html` loads new `book-foreword-v230-three-void.css`.
- `index.html` loads `book-foreword-v230-three-void.js` instead of v229.
- `manifest.json`, `sw.js`, and `refresh.html` all point to `book-foreword-v230-three-void-phone`.

Relevant v230 commits:
- `244e41dc4d3a87cfc2b63e422c363e98f40d95ae` — added v230 lightweight Three.js Void scene.
- `95e6faef7017b65ec701aba8d14652e7a9e6a787` — added v230 Three Void styling.
- `246e9a66035b63b8207165b3ab00246e1317ab75` — wired root to v230.
- `ec420f8ac270a8fa894d66e192d6293b3f9d9e62` — bumped manifest to v230.
- `ab7ad26e8770576971e15ffcad01640bb307bd9c` — bumped service worker marker to v230.
- `4683ed80ce82d783b53b2f792308042b5fc3d9db` — pointed refresh to v230.
- `5b9c770d8925b6d6793c20c7e667af231eaffc8a` — fixed Three import state so the library and live scene context do not collide.

## WHY v230 EXISTS

Josh tested v229 and identified that CSS perspective was not giving real enough spatial control:
- The secondary light read as a visible rectangle, not a light behind letters.
- The questions/glyphs were getting buried behind giant text.
- `THE VOID / STARES BACK` did not read as a locked presence.
- The big letters drifted diagonally instead of coming straight forward.
- Light-temperature variants did not matter because the geometry was wrong.

Josh explicitly chose a live Three.js scene rather than pre-rendered video because the effect should still feel made out of the book. The instruction was to keep it light: no reusable framework, no StageHost, no future-proof cathedral. Scene by scene.

## CURRENT VOID CREATIVE LOCK

- Act name should be `THE VOID`, not `THE VOID STARES BACK`.
- `STARES BACK` may remain as an internal event/phrase, but not the act title.
- There should be a final flash after `run` where the experience resolves into white title text:
  - `ACT I`
  - `THE VOID`
- The main scene should persist instead of pivoting into a late glyph-only section.
- Extra time is okay only if it deepens the same event.
- Fast secondary pulses are desired for the art; the file should expose tuning knobs.
- Glyphs should stay small, same size family as established book glyphs, and peripheral.
- All scene letters/glyphs should be pure black when exposed. The final title flash is intentionally white.

## v230 IMPLEMENTATION SUMMARY

v230 JS:
- build marker: `BOOK FOREWORD v2.3.0 THREE VOID PROTOTYPE`
- cache marker: `book-foreword-v230-three-void-phone`
- duration: 40 seconds
- contains top-level `VOID_TUNING` knobs:
  - `durationSeconds`
  - `primaryPulseMs`
  - `secondaryPulseMs`
  - `collisionPulseMs`
  - `secondaryEveryMs`
  - `voidStartZ`, `voidEndZ`
  - `questionZ`, `secondaryZ`
  - `glyphDensity`, `glyphCount`, `glyphScale`
- imports Three.js dynamically only inside the Void scene:
  `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`
- creates one temporary WebGL canvas in `.void-three-mount`
- uses a camera looking down the Z axis so `THE VOID` moves straight toward the viewer
- uses canvas text textures on Three planes:
  - back/presence plane: `THE VOID`
  - internal phrase: `STARES BACK`
  - foreground question plane: `WHO AM I?`, `WHAT AM I?`, `AM I?`
  - small echo plane: `who are you?`, `what are you?`, `are you?`
  - small peripheral glyph planes
- uses white light planes behind black text, not gray text
- keeps the v2271 seal gate safety checks:
  - actual `.foreword-closing-page.is-current`
  - matching `render-facts.currentPage`
  - matching `documentElement.dataset.bookPage`
  - tap must land in/near seal/closing-card area
- begins with `i want sound`, then `i’m going further`
- decodes the MP3 in browser when possible to build cue points; fallback cue map remains available
- small sideways `run`; tap run shows final white `ACT I / THE VOID`

v230 CSS:
- hides `.void-three-stage` unless `.void-active` is set
- full-screen black WebGL mount
- center prompt buttons for `i want sound` / `i’m going further`
- small sideways lowercase `run` on the right margin
- final white `ACT I / THE VOID` overlay

## CURRENT TEST URL

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v230-three-void-phone
```

Expected marker:

```text
BOOK FOREWORD v2.3.0 THREE VOID PROTOTYPE
```

## TEST PRIORITIES

Josh should test Safari/browser first, not installed PWA first.

Judge:
- Do normal pages stay visible before the seal?
- Does the seal still require first `not yet`, second black arrival?
- Does Three.js load or does it fall back?
- Does `THE VOID` move straight toward the reader instead of diagonally?
- Are the big self-questions readable in the foreground?
- Does the secondary light feel behind the questions instead of becoming a flat square?
- Are glyphs small/peripheral instead of becoming the main event?
- Is 40 seconds enough, too long, or still not earned?
- Does the small sideways `run` and final white `ACT I / THE VOID` flash work?

## KNOWN RISKS / NEXT FIXES IF TEST FAILS

- If Safari blocks/delays dynamic Three import, consider loading Three earlier from root or making a local vendored copy.
- If the scene jumps forward after waiting on `i’m going further`, reset audio/current scene timing at tunnel start or use a scene-local clock instead of raw `audio.currentTime`.
- If the light still reads rectangular, replace the rectangular plane with multiple overlapping planes or a radial texture.
- If the Void is too small/far, tune `voidStartZ`, `voidEndZ`, and plane width/height.
- If the secondary pulse needs more speed, Josh can tune `secondaryEveryMs`, `secondaryPulseMs`, and `collisionPulseMs` in `VOID_TUNING`.
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
