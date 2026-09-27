# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 60
UPDATED: 2026-09-27

Repo: `emptychair1/the-house-that-remembers`
Primary working branch for live Spine proofs: `gh-pages`
Continuity/handoff branch: `book/stable`
Production: `https://emptychair1.github.io/the-house-that-remembers/`

This handoff supersedes Generation 59 and older notes where they conflict.

## CURRENT COORDINATE — READ THIS FIRST

We are authoring the Foreword/manuscript pages in the Spine proof chain.

- `spine-v166.html` = LAST APPROVED BASELINE.
- `spine-v167.html` = PAGE 5 WORK IN PROGRESS. DO NOT CALL IT APPROVED YET.
- Ignore `proof-v232.html` and the old v231 proof lineage for current Spine versioning. A previous turn accidentally conflated the lineages. The legitimate next Spine version remains v1.67.
- Current v1.67 is intentionally in DIAGNOSTIC state after Page 5 animations repeatedly failed to fire.

## PAGE 5 CREATIVE PLAN — LOCKED

Page 5 manuscript/layout itself is acceptable. Required choreography:

1. `thunderclap` in “There was no thunderclap” → Thunderclap A: starts in normal/original state, then blinks/disappears once and stays gone. It must NOT animate in first.
2. `I felt an enormous burst of joy` → newest approved Glint / Glint F behavior.
3. `I could have been wrong` → Fall.
4. Glyph field → 78 glyphs (50% increase from 52), faster than prior page, monochrome only.
5. IMPORTANT CONDITION: increased 78-glyph density begins on Page 5 ONLY. It must not mutate/change glyph amount on earlier pages.
6. No color.
7. No fourth-wall behavior.
8. Page number/folio cleanup is still required. Folios should belong to the actual pages, not a fixed wrapper overlay. Previous pages must retain correct page numbers when flipping backward/forward.

Do NOT change the accepted manuscript/layout while fixing execution.

## WHAT JUST FAILED

We discovered Page 5 was never truly animation-approved. Josh reported he does not think he has ever seen its animations work.

We added a visible diagnostic to `spine-v167.html` with four stages:
- MANUSCRIPT FOUND
- TARGETS FOUND
- PAGE 5 ACTIVE
- SCORE FIRED

First diagnostic showed `LEAF NOT FOUND` despite visible manuscript. That proved the controller was incorrectly assuming the deepest iframe was the manuscript.

We changed discovery to locate the frame by manuscript content rather than depth.

Josh’s latest screenshot then showed:
- `MANUSCRIPT FOUND · depth 9` = GREEN
- `WRAP FAILED` = RED
- `PAGE 5 ACTIVE` = not reached
- `SCORE FIRED` = not reached

This is the critical clue.

## ROOT CAUSE / ARCHITECTURAL CORRECTION

The current Page 5 implementation regressed into WRAPPER SOUP.

It dynamically crawls nested iframes, finds manuscript paragraphs by prose, then tries to manufacture runtime spans around phrases. The wrapper assumes a target phrase exists inside one text node; at least one target does not, so wrapping fails and the controller aborts.

DO NOT FIX THIS BY BUILDING A SMARTER CROSS-NODE WRAPPER.
DO NOT ADD MORE IFRAME SPELUNKING.
DO NOT ADD ANOTHER WRAPPER AROUND v1.67.
DO NOT RECONSTRUCT PAGE 5 WITH RUNTIME DOM SURGERY.

Josh explicitly stopped this: “we need to not do wrapper soup again.”

The whole point of the preflight work was to use the clean architecture:

`Mechanics Library → Page Controller → explicit/stable targets → executable runners`

Page 5 must be rebuilt using that architecture.

## NEXT ACTION — EXACTLY WHERE TO RESUME

Before changing v1.67 again:

1. Inspect ONLY the approved Page 4 implementation in the v1.66 chain.
2. Identify exactly how Page 4 owns its page, stable targets, runner calls, and page activation.
3. Compare that with the Mechanics Library / Page Controller architecture established during preflight.
4. Rebuild Page 5 using the SAME ownership/activation pattern.
5. Use the library runners for Thunderclap A, newest Glint, and Fall. Do not hand-reimplement their CSS/JS inside the page wrapper.
6. Scope 78 glyphs to Page 5 only.
7. Keep the visible diagnostic only as long as necessary to prove: controller attached → Page 5 active → score fired. Then remove it.
8. Audition in Josh’s Safari/iPhone experience. Josh’s visible result is truth.

IMPORTANT: the previous turn started taking an expensive repo-archaeology route (`book/stable` recursive tree). Josh pulled Piper back. Do NOT resume broad repo archaeology. Go straight to the approved v1.66/Page 4 implementation with targeted reads.

## RECENT DIAGNOSTIC COMMITS ON gh-pages

- `3d8a064ebd81a78f0121278439e2c73d1e602c07` — added Page 5 lifecycle diagnostic.
- `b24ad9270663fe9c9e96a1dea1f5e3e42e5c658c` — changed diagnostic toward manuscript-frame location by content; Josh then captured the key `MANUSCRIPT FOUND · depth 9 / WRAP FAILED` state.

Current diagnostic/test URL lineage:
`https://emptychair1.github.io/the-house-that-remembers/spine-v167.html`

Do not trust cache query strings as version authority. The top-right label and repo source must agree.

## VERSIONING RULE

Spine lineage and historical proof lineage are separate.

Current authority:
- v1.66 = approved Spine baseline
- v1.67 = Page 5 WIP

Do not jump to v232 or any other historical proof number.

## GITHUB / BITE PROTOCOL

- One bite at a time.
- Prefer low/surgical GitHub API calls for known-file needle work.
- Use the broader route only when genuinely doing new authorship that requires it; do not fetch giant blobs/trees for a surgical fix.
- Commit does not automatically mean Josh has a working deployed page. Verify the published surface before claiming success.
- Do not give Josh guessed URLs.
- Source-check before claiming done.
- If a route fails, diagnose rather than stacking another wrapper.

## PERFORMANCE GOAL

Josh wants the clean system to make a close-to-page-ready animation bite take under 10 minutes when possible. The first Page 5 timing experiment became invalid because Josh fell asleep and the implementation hit publishing/architecture failures. Do not pretend there is a valid final stopwatch result.

The purpose of the speed target is NOT to cut corners. It is to prove that a clean Mechanics Library + Page Controller system eliminates hours of fighting wrappers.

## HOUSEKEEPING AFTER PAGE 5 EXECUTION WORKS

Before moving to Page 6:
- ensure 78 glyphs do not affect Pages 1–4;
- clean up/add page numbers as actual page-owned folios;
- verify backward/forward flipping does not leak folios or Page 5 state;
- remove diagnostic UI;
- lock v1.67 only after Josh actually sees the intended animations fire.

## OPERATING RULES

- No wrapper soup.
- No rubber soup.
- No smarter runtime prose wrapper as a workaround.
- Mechanics Library + Page Controller is the architecture.
- Explicit stable targets, executable runners, page-owned state.
- Preserve prior approved pages exactly.
- No color / no fourth wall on this manuscript sequence unless Josh changes the direction.
- One bite at a time.
- Josh’s Safari/iPhone visual result is authoritative.
- If uncertain, inspect the known-good previous page rather than inventing a new mechanism.
