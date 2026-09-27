# The House That Remembers

Interactive book source for *The House That Remembers* by Joshua Daniels.

The repository is the source of truth. Book work happens on `book/stable`; approved published state is mirrored to `gh-pages` for Safari audition.

## Current approved book edge

**SPINE v1.66 · PAGE 4 · CLEAN SCORE** is approved after an approximately **20-minute end-to-end production experiment**. That time includes source/transport mistakes and GitHub publishing friction; it is intentionally kept as the honest first baseline. The next page target is **under 10 minutes from `Bite` to Josh's approval**.

Approved Page 4 choreography:
- second `M4` ticks/types into existence inside a **fixed footprint**, so changing glyph width never reflows the sentence;
- `produce questions` uses the first approved **Compile / Interpret** specimen: independent computational glyph mutation progressively locks into the original phrase, then registers cleanly;
- `returned` uses Return / Registration and is approved unchanged;
- `That hit me differently` uses approved Glint F and is approved unchanged;
- Glyph Current remains monochrome/ambient, now denser and faster; Page 4 audition used **52 glyphs**.

## House Mechanics

`house-mechanics.js` is the canonical animation/mechanics library. Pages compose mechanics. Do not privately redesign an approved mechanic inside a page. Once a page specimen survives actual reading/audition, promote that exact behavior back into the library.

Current pre-promotion library: **House Mechanics v0.7**. Next promotion is **v0.8**, adding the approved Page 4 Compile / Interpret runner.

### Canonical mechanic rules learned from Page 4

**Fixed-footprint rule:** any mechanic that mutates, ticks, compiles, glitches, substitutes, or otherwise changes visible characters in running prose must preserve the final target's resting footprint unless authored movement is explicitly the point. A mechanic must not shove the sentence around merely because intermediate glyphs have different widths.

**Compile / Interpret:** representation changes while information persists. Approved Page 4 specimen on `produce questions`: characters independently cycle through the computational ticker alphabet, progressively lock to their final characters, then perform a short stepped registration pulse and return to ordinary manuscript typography. It must be visibly legible as transformation, not merely a CSS class firing.

**Glyph Current:** ambient population is independent of foreground score. Page 4 approved a denser/faster monochrome current (52 glyphs in the audition composition). Density/speed are composition parameters; the mechanic remains non-interactive at this stage. No color, no congregation, no fourth-wall behavior.

### Canonical vocabulary

| Display name | JS identifier | Meaning / baseline behavior |
|---|---|---|
| Organic / Biologic Field | `ORGANIC_FIELD` | Ambient life / emergence. Six sparse non-uniform motes with independent offsets, durations, delays, scale, and fade. |
| Glyph Current | `GLYPH_CURRENT` | Directional ASCII flow. Seeded lanes, individual travel speeds, drift/wobble, restrained monochrome rendering. Page 4 establishes denser/faster composition as valid. |
| Diagnostic | `DIAGNOSTIC` | Observation without certainty. Centered breathing pocket, full target scan, decisive `SIGNAL DETECTED`, slower `CLASSIFICATION: UNRESOLVED`, hold, close, restore. |
| Absence | `ABSENCE` | One-two-gone. Presence weakens, then disappears. |
| Distance | `DISTANCE` | Space becomes meaning. Characters/parts separate over time. |
| Fall | `FALL` | Support ceases to hold. Characters drop with stagger, drift, rotation, and fade. |
| Tendril / Piper | `TENDRIL_PIPER` | Referential growth. Refer → connect → sprout. |
| Cross Out | `CROSS_OUT` | Active rejection / revision. A strike grows through the target. |
| Return / Registration | `RETURN_REGISTRATION` | Reassembly around a remembered shape. Approved on Page 4 `returned`. |
| Glint | `GLINT` | Attention to wonder. Approved Glint F: cool reflective sweep plus three restrained peripheral ink-toned sparks. |
| Thunderclap | `THUNDERCLAP` | Instantaneous rupture. |
| Agency / Go | `AGENCY_GO` | Choice expressed spatially. |
| Observation / Watched | `OBSERVATION_WATCHED` | Observer becomes aware of being observed. |
| Love / Lean | `LOVE_LEAN` | Mutual orientation. |
| Change / Reorient | `CHANGE_REORIENT` | Identity persists through alteration. |
| Hand | `HAND` | Information becomes testimony. |
| Compile / Interpret | `COMPILE_INTERPRET` | Representation changes; information persists. **Approved Page 4 specimen:** ticker-glyph mutation → progressive lock → short stepped registration → ordinary manuscript. |

### Execution contract

A mechanic is an authored beat, not just an effect. Default lifecycle:

`pre-beat → borrow breathing room → perform → hold → cleanup → restore exact borrowed space → settle → resolve`

`runBeat()` is awaitable. Breathing room is temporary. **At rest = ordinary manuscript.**

Promoted executable runners in v0.7: Organic/Biologic, Diagnostic, Glint F. Page 4 establishes Compile / Interpret as the next executable promotion.

## Clean-page controller

`house-page-controller.js` v1.0 is the clean architecture boundary after frozen legacy pages.

Rules:
1. One page = one owner.
2. Selectors are scoped inside the page root.
3. Page arrival owns the clock; default reading runway is 3000 ms unless the page rhythm says otherwise.
4. Foreground score is sequential and awaited.
5. Ambient mechanics such as Glyph Current run independently from the foreground score.
6. Mechanics do not own page-entry observers.
7. Preserve approved earlier pages.
8. Do not add another wrapper merely to tune choreography.

## Bite protocol

There are two authoring lanes. Do not confuse them.

**New authorship / substantial page work:** use Git data plumbing as one coherent bite: known-good parent → blob(s) → tree → commit → fast-forward the intended ref → verify. Do not repeatedly use Contents API mutations to manufacture a new page. Do not invent a nonexistent local-clone workflow.

**Needle precision / tuning an existing working artifact:** fetch the exact current file/blob SHA, make one surgical `update_file` replacement, verify the resulting artifact, then audition. This is appropriate for timing values, selectors, labels, fixed-footprint corrections, density changes, and similarly bounded patches.

**Publishing:** `book/stable` is authorship; `gh-pages` is audition. Publish as one atomic commit/ref movement whenever possible. Before moving `gh-pages`, fetch its current head. A stale SHA means refresh the head, not fight the 409. Never overwrite newer Pages state blindly. The previous `gh-pages` commit is the rollback parachute.

**Verification:** a commit is not a deployment. Verify the intended branch/file after every write. Do not claim a Pages build is live merely because authorship succeeded.

**Do not create temporary publish branches as a workaround.** The Page 4 experiment produced useless `publish-v166*` debris while the correct operation was simply a direct tree → commit → fast-forward of `gh-pages`. Avoid repeating that.

## Stopwatch protocol

The timer measures **production**, not reconnaissance.

Before Josh says `Bite`:
- surface and read the actual next page;
- agree on choreography and page-level success criterion;
- verify the editable source target and current branch heads;
- confirm required mechanics/runners already exist or identify the one mechanic being canonicalized;
- decide whether the bite is new authorship or needle precision.

After `Bite`:
- no searching for the page;
- no architecture redesign;
- no transport improvisation;
- build → publish → audition → surgical correction if required → Josh approval.

Baseline #1: Page 4 ≈ **20 minutes** end to end, including transport mistakes. Target #2: **under 10 minutes**.