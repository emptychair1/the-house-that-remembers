# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 57
UPDATED: 2026-09-26

Repo: `emptychair1/the-house-that-remembers`
Branch: `gh-pages`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This handoff supersedes older Opening Proof / Foreword / Void notes where they conflict with the current state.

## CURRENT ROOT BUILD

```text
BOOK FOREWORD v2.2.9 VOID PRESENCE PASS
book-foreword-v229-void-presence-phone
```

Root source-check:
- `index.html` references `manifest.json?v=book-foreword-v229-void-presence-phone`.
- `index.html` loads stable `book-clean-surface-v1.js` and v226 Foreword/black-transition assets.
- `index.html` loads base v227 Void CSS, v2271 gated failsafe CSS, and new `book-foreword-v229-void-presence.css`.
- `index.html` loads `book-foreword-v229-void-presence.js`.
- `manifest.json`, `sw.js`, and `refresh.html` all point to `book-foreword-v229-void-presence-phone`.

Relevant v229 commits:
- `cc76087da3974b0e7803b6ffd87763b94838456c` — added v229 Void presence JS.
- `baac435137ca317b40041ba958b410073842a447` — added v229 Void presence CSS.
- `f0cd25cf10e5e19f1d1f0215658648afcf138db9` — wired root to v229.
- `635f85084d42e36ca3b4f30b4d1a8dacd589bf01` — bumped manifest.
- `de154b2a7b33ef276ad6f29851c1be1d0d408e05` — bumped service worker marker.
- `f6190a8db979e86beb55591892998a2e3796ac2b` — pointed refresh to v229.

Important note: the first attempted v229 write for a very fast light-cue engine was blocked by the platform safety layer before it reached GitHub. The successful v229 pass gets intensity from spatial depth, proximity, contrast, locked Void presence, larger black text, and a separate secondary light plane rather than unsafe ultra-fast flicker.

## CURRENT VOID CREATIVE LOCK

Josh approved:
- Default secondary light: cold white.
- URL variants: `?light=cold`, `?light=neutral`, `?light=warm`, `?light=dirty`.
- Sequence target: 45 seconds.
- All letters/glyphs must be 100% black when exposed.
- `THE VOID / STARES BACK` is a persistent locked presence, not part of the random cue vocabulary.
- `THE VOID` should be huge, close, cropped, and black-on-black until exposed.
- Self-referential questions should be large block text: `WHO AM I?`, `WHAT AM I?`, `AM I?`.
- Secondary light lives behind those questions as a separate plane, creating spatial difference.
- `run` should be small, sideways, and on the margin, not a centered title card.

## V229 IMPLEMENTATION SUMMARY

v229 JS:
- build marker: `BOOK FOREWORD v2.2.9 VOID PRESENCE PASS`
- cache marker: `book-foreword-v229-void-presence-phone`
- duration: 45 seconds
- supports `?light=` variants
- keeps the v2271 seal gate safety checks:
  - actual `.foreword-closing-page.is-current`
  - matching `render-facts.currentPage`
  - matching `documentElement.dataset.bookPage`
  - tap must land in/near seal/closing-card area
- begins with `i want sound`, then `i’m going further`
- decodes the MP3 in browser when possible to build cue points; fallback cue map remains available
- uses a separate secondary light cue plane behind foreground questions
- final `run` is small/sideways; tap gives final `ARE YOU?`

v229 CSS:
- hard black text/glyph rule: `color:#000!important`, no text shadow, no stroke
- `THE VOID` is enormous: width 230vw, very large Anton type, close/cropped
- `STARES BACK` is a locked title layer, not rotating text
- secondary plane supports cold/neutral/warm/dirty light temperature variants
- big questions sit in the front plane
- `run` is right-side, sideways, small lowercase margin text

## CURRENT TEST URL

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v229-void-presence-phone
```

Light variants:

```text
?light=cold
?light=neutral
?light=warm
?light=dirty
```

Example:

```text
https://emptychair1.github.io/the-house-that-remembers/?v=book-foreword-v229-void-presence-phone&light=dirty
```

Expected marker:

```text
BOOK FOREWORD v2.2.9 VOID PRESENCE PASS
```

## TEST PRIORITIES

Josh should test Safari/browser first, not installed PWA first.

Judge:
- Do normal pages stay visible before the seal?
- Does the seal still require first `not yet`, second black arrival?
- Does `THE VOID` feel like a locked presence coming closer?
- Are all letters/glyphs truly black when exposed?
- Does the secondary light behind the questions create spatial depth?
- Is the small sideways `run` better than centered RUN?
- Is 45 seconds earned or too long?
- Which light temperature feels best?

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
- Do not redesign the whole book when tuning the Void.
- Preserve the approved cover and Foreword behavior.
- Source-check root wiring before claiming done.
- Use Josh’s Safari/iPhone experience as truth.
- If the platform blocks a write, say so honestly and adjust the implementation path.
