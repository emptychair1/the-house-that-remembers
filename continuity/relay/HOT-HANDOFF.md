# HOT HANDOFF — THE HOUSE THAT REMEMBERS

HANDOFF_GENERATION: 47
HANDOFF_REVISION: 3
UPDATED: 2026-09-26
STATUS: LIVE BOOK EDGE. THIS FILE IS THE CURRENT BOOK-PROJECT MIRROR.

## READ FIRST

This is the book-specific hot handoff for **The House That Remembers**.

Primary Relay lineage still lives at:

`emptychair1/piper-continuity/continuity/relay/HOT-HANDOFF.md`

But for the current book/PWA work, this file contains the live edge that must be preserved on a chat jump.

Governing posture: **warmth + teeth + evidence**. Do not fake inspection. Do not claim deploy/render success unless actually verified. Josh wants lap-mode continuity: stay close, narrate meaningful turns, no cold tool sprinting, and no generic reboot plan.

## CURRENT REPO / SURFACE

Repository: `emptychair1/the-house-that-remembers`
Branch currently being edited: `gh-pages`
Canonical live book/PWA root:

`https://emptychair1.github.io/the-house-that-remembers/`

The root PWA is the book surface. Do not pivot to EPUB or a separate proof page unless Josh explicitly asks.

Current root cache/build key:

`book-foreword-v21-visual-lock`

Current visible marker to look for in the PWA:

`BOOK FOREWORD v2.1 VISUAL LOCK`

## CURRENT PRODUCT STATE

We are building the immersive/PWA edition of **The House That Remembers**. The present implementation is a StPageFlip-based root book that contains:

1. Rosetta/house cover as first page.
2. Foreword title page.
3. Full Foreword stack.
4. Closing/seal page.

The current state is **not** the final Foreword density pass. It is a protective rescue state.

Latest bite completed:

**V2 Rescue + Visual Page Contract**

Purpose: roll back from the rejected v3 density experiment to the good v2 Foreword architecture, while adding a reusable full-page visual-page contract so covers, portraits, manuscript plates, artifact images, and symbol pages are not distorted by the page flipper.

## WHY THIS BITE HAPPENED

Screenshots showed that v3 did not meaningfully improve Foreword density. Pages still felt sparse. Worse, the full-page cover composition was damaged: the cover was squished and the glyph/data layer no longer functioned as intended.

Josh clarified the critical constraint:

The cover has to be full page because the glyph/data layer is exactly positioned as data coming into the house. The cover is not decorative. It is a composed functional system.

The correct diagnosis:

- v2 was a good architectural turn.
- v2 had the full Foreword stack.
- v2 did not fuck up the cover.
- v3 was the bad trade.
- Density and cover/visual-page machinery must never be bundled again.

The rollback target was therefore **v2 architecture**, not Clean Surface v1 and not pre-v2.

## PAGE SPECIES / VISUAL CONTRACT

The book is not an all-cream-page book. It has page species:

- black visual pages
- cream reading pages
- ancient manuscript/artifact pages
- portrait/image pages
- symbol/ritual pages
- audio/threshold pages

Important rule:

**The flipper may turn the page, but it does not get to distort the page’s contents.**

Visual pages must preserve composition. Text pages may reflow.

Current visual contract classes/data:

```html
<section
  class="book-page cover-page visual-page composition-locked-page"
  data-book-page="cover"
  data-page-skin="black"
  data-visual-fit="composition-locked"
  data-density="hard"
  aria-label="Cover">
  <canvas class="rosetta-cover-canvas visual-canvas" aria-hidden="true"></canvas>
  <div class="cover-whisper">tap right to turn</div>
</section>
```

Render facts include:

`data-visual-contract="composition-locked"`

CSS contract now includes:

- `.visual-page`: black surface, zero padding, block layout, no cream/text-page layout rules.
- `.visual-canvas`, `.visual-page canvas`, `.visual-page img`: full-page surface rules.
- `data-visual-fit="contain"`: preserve full image.
- `data-visual-fit="full-bleed"`: full-bleed/crop allowed.
- `data-visual-fit="composition-locked"`: preserve composition for special pages like the cover.
- `.composition-locked-page`: overflow hidden.

The cover canvas still uses JS layout math to preserve aspect and compute glyph stream coordinates from the actual drawn cover box. That behavior must be preserved.

## CURRENT FILES / COMMITS

Current important files:

- `index.html`
- `book-clean-surface-v1.js`
- `book-clean-surface-v1.css`
- `.github/workflows/render-check.yml`
- `tools/render-check.mjs`

Latest commits from this bite:

- `8c588f9a64a9b89cae1d6e86a0632c98bfcc3437` — Restore v2 Foreword baseline with visual page lock.
- `617c31bce6431962d926c3edaedc134870b795d7` — Restore v2 styling and add visual page contract.
- `bb9363b4bd1940fe5f89dfc2471d8dd2889515fa` — Point root to v2.1 visual lock build.
- `d0dce31a3848e0ea4b9032a3f8aa1ad2a7d43810` — Expect v2.1 visual lock in render workflow.

Relevant previous commits:

- v2 workflow baseline: `8b51f6d0fa291d4429954833b5fc759825fdbc38`
- v3 dense JS: `4803997ea10c002b72d28723b89027e7b287da25` rejected as net-negative.
- v3 tighter CSS: `f58c197c03293befe05f393ada78fa5c78490cad` rejected as part of the density experiment.
- workflow cache fix: `db0048725dc333fd5bd70d6fe2f85f958ad97ec0` removed fragile npm cache setting from render workflow.

## RENDER / DEPLOY STATUS DISCIPLINE

Do not say the live PWA is verified unless either:

1. Josh confirms with screenshots/device testing, or
2. the render artifact/workflow result is actually inspected.

At the moment this handoff is written, code-side verification was done for v2.1 visual lock:

- JS marker is `BOOK FOREWORD v2.1 VISUAL LOCK`.
- `PAGE_COUNT = 32`.
- Root cache key is `book-foreword-v21-visual-lock`.
- Cover has visual-page / composition-locked contract.
- Workflow expects marker `BOOK FOREWORD v2.1 VISUAL LOCK` and 32 pages.

Heavy GitHub Actions render check had started/pending when last checked. Pages deploy can lag. iOS PWA cache can also lag. The next assistant must not pretend this was visually verified unless new evidence exists.

## WHAT TO TEST NEXT

When Josh opens the PWA, first look for marker:

`BOOK FOREWORD v2.1 VISUAL LOCK`

First judgment is **cover only**:

- Is the cover full-page again?
- Is it no longer squished?
- Does the glyph/data stream enter the house correctly?
- Does the cover feel like the approved Rosetta composition again?
- Does the first page flip still work?

Do not judge Foreword density during this test. Density is intentionally deferred.

## NEXT BITE AFTER COVER IS SAFE

Only after cover machinery is confirmed safe:

**Foreword Density v4, body pages only.**

Rules for density bite:

- Do not touch cover classes, cover canvas math, visual contract, or root visual-page machinery.
- Density and visual-page composition are separate levers.
- Body pages need to read like book pages, not ceremonial plates.
- Target body pages should fill roughly 65–80% of vertical space for ordinary prose.
- Special emotional pages can be sparser.
- Title/closing pages may stay spacious.
- Do not optimize by total page count alone.

Likely approach:

- Keep v2.1 visual lock intact.
- Adjust only `FOREWORD_PAGES` grouping and `.foreword-copy` styles.
- Consider 12–16 body pages, but judge by actual screenshots, not by count.
- Do not ship a density bite if it damages the cover.

## DESIGN CONSTITUTION REMINDER

This book uses multiple page species and a controlled visual grammar:

- Text is the person.
- Space is breath.
- Congestion is pressure.
- Darkness/light are narrative materials.
- Motion is emotion and must have narrative causality.
- Color is earned, not decorative.

Black pages are real book grammar, not exceptions. Cream pages are for readable prose and some ceremonial title pages. Ancient manuscript pages, portraits, symbol pages, artifacts, and threshold pages need their own rules.

## KNOWN LOCKED CREATIVE DECISIONS

- Cover/Rosetta composition must stay full-page and composition-locked.
- Not all pages are cream.
- Image/portrait/manuscript pages need a full-page image system before more are added.
- Foreword title page was visually liked and should mostly be protected.
- Foreword body density remains unresolved.
- The root PWA is the canonical book surface.
- Use StPageFlip for now.
- Do not resurrect old scaffold pages, old extra chapters, portrait placeholders, or Act I material into the root flow yet.

## OLD BUT STILL IMPORTANT BOOK CANON

Before changing major book content, read:

`DESIGN-BIBLE.md`

The larger locked sequence remains:

- Title / cover / Foreword.
- Act I dark threshold.
- Ancient manuscript/chapter-opening grammar.
- Tree of Life → DNA → Decision Tree sequence at Act I close.
- Act II opens with Ezekiel’s Wheel, then Aristotle.

Audio cues remembered:

- Josh portrait cue: Dead Can Dance — The Host of Seraphim.
- Piper portrait cue: Massive Attack — Teardrop.

Commercial audio cannot simply be bundled unlicensed.

## WORKFLOW RULES

Josh wants discussion before patching when reviewing screenshots.

Use the loop:

1. Look at the screenshots/evidence.
2. Talk first.
3. Diagnose the trade.
4. Define the next bite.
5. Patch only the agreed bite.
6. Verify code-side truth.
7. Clearly state what is verified and what is not.

Do not make broad changes while he is giving taste feedback.

## JUMP COMMAND

`Pip. Relay.`

On arrival:

1. Read this file.
2. Confirm current build target is `BOOK FOREWORD v2.1 VISUAL LOCK`.
3. Ask for or inspect the latest screenshot state before patching.
4. Protect the cover machinery before any typography/density work.
