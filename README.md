# The House That Remembers

Interactive book source for *The House That Remembers* by Joshua Daniels.

The repository is the source of truth. Book work happens on `book/stable`; approved published state is mirrored to `gh-pages` for Safari audition.

## House Mechanics

`house-mechanics.js` is the canonical animation/mechanics library. Pages compose these mechanics. Do not privately redesign an existing mechanic inside a page. If a mechanic is used and its behavior is not right, fix the canonical mechanic and let future compositions inherit the correction.

Current library: **House Mechanics v0.7**.

The House Mechanics Lab (`mechanics-lab.html`) is the provenance/specimen surface. Lab behavior is the baseline when a mechanic is promoted. Promotion is not an invitation to aesthetically reinterpret it.

### Canonical vocabulary

| Display name | JS identifier | Meaning / baseline behavior |
|---|---|---|
| Organic / Biologic Field | `ORGANIC_FIELD` | Ambient life / emergence. Approved Page 3 biologic specimen: six sparse non-uniform motes with independent offsets, durations, delays, scale, and fade. |
| Glyph Current | `GLYPH_CURRENT` | Directional ASCII flow. Seeded lanes, individual travel speeds, drift/wobble, restrained monochrome rendering. |
| Diagnostic | `DIAGNOSTIC` | Observation without certainty. Approved Page 3 developed specimen: centered breathing pocket, full target scan, decisive `SIGNAL DETECTED`, slower `CLASSIFICATION: UNRESOLVED`, hold, close, restore. |
| Absence | `ABSENCE` | One-two-gone. Presence weakens, then disappears. |
| Distance | `DISTANCE` | Space becomes meaning. Characters/parts separate over time. |
| Fall | `FALL` | Support ceases to hold. Characters drop with stagger, drift, rotation, and fade. |
| Tendril / Piper | `TENDRIL_PIPER` | Referential growth. Refer → connect → sprout: links, nodes, return connection, vine, sprig, leaves. |
| Cross Out | `CROSS_OUT` | Active rejection / revision. A strike grows through the target. |
| Return / Registration | `RETURN_REGISTRATION` | Reassembly around a remembered shape. Scattered characters return and register into place. |
| Glint | `GLINT` | Attention to wonder. Approved Glint Lab F / Page 3 v1.65: cool reflective sweep through the word plus exactly three restrained peripheral ink-toned sparks. |
| Thunderclap | `THUNDERCLAP` | Instantaneous rupture. The targeted material disappears at once. |
| Agency / Go | `AGENCY_GO` | Choice expressed spatially. The target moves decisively in a chosen direction. |
| Observation / Watched | `OBSERVATION_WATCHED` | The observer becomes aware of being observed. A small watch/eye register appears, blinks, and clears. |
| Love / Lean | `LOVE_LEAN` | Mutual orientation. Two terms lean toward one another. |
| Change / Reorient | `CHANGE_REORIENT` | Identity persists through alteration. Selected glyphs flip/reorient while the word remains itself. |
| Hand | `HAND` | Information becomes testimony. Handwritten characters reveal sequentially with a pen trace. |
| Compile / Interpret | `COMPILE_INTERPRET` | Representation changes; information persists. Glyphs mutate and lock into another representation. |

### v0.7 execution contract

A mechanic is an authored beat, not just an effect. Canonical mechanics carry default temporal and spatial envelopes.

Default lifecycle:

`pre-beat → borrow breathing room → perform → hold → cleanup → restore exact borrowed space → settle → resolve`

`runBeat()` is awaitable and returns control only after that lifecycle is complete. A page may override timing or space for a particular narrative moment, but the canonical defaults should arrive close to page-ready.

Breathing room is borrowed space. It opens only for the mechanic and must restore afterward. At rest, manuscript typography and pagination remain ordinary.

### Promoted executable runners

The following approved specimens are now executable canonical runners rather than metadata-only descriptions:

- `runOrganicField(target)` — exact Page 3 biologic/organic six-mote behavior from v1.37, accepted through v1.65.
- `runDiagnostic({...})` — developed Page 3 diagnostic behavior from v1.40/v1.41 as accepted in v1.65: target scan, centered readout pocket, digitized signal/classification, hold, close, cleanup.
- `runGlint(target)` — exact approved Glint F behavior from Page 3 v1.65: 3.2s cool reflective gradient sweep and three restrained peripheral sparks at the approved positions/delays.

`runBeat('ORGANIC_FIELD', target)`, `runBeat('DIAGNOSTIC', target, options)`, and `runBeat('GLINT', target)` automatically dispatch to these canonical runners.

**Promotion rule:** once a mechanic is approved in the book, promote the approved specimen back into `house-mechanics.js`. The page must not remain the only place where the real implementation exists.

### Composition rule

House Mechanics own reusable motion, internal timing, temporary geometry/breathing room, cleanup, and the definition of completion.

A page owns target text, narrative trigger, sequence, exceptional overrides, and its initial reading runway. Mechanics never decide when a page has been entered.

Composition-level choreography such as where Glyph Current travels or how long a narrative pause should last is decided from the actual page rhythm.

When a mechanic needs revision after audition, revise its canonical implementation rather than forking a page-local substitute.

## Clean-page controller

`house-page-controller.js` v1.0 establishes the clean architecture boundary after the frozen legacy Foreword pages.

Rules:

1. **One page = one owner.**
2. Every selector is scoped inside that page root. No global target lookup from clean-page choreography.
3. The controller waits for the page's existing `active` state, then applies the page's reading runway (default 3000ms).
4. The score runs sequentially and awaits each House Mechanic through completion before advancing.
5. Mechanics do not own page-entry observers or triggers.
6. Pages 1–3 and their working wrapper strata remain frozen unless explicitly revisited.
7. Do not add a new iframe/version wrapper for every choreography bite. Clean pages should be authored through the controller + score + canonical mechanics.

Conceptual score:

```js
const controller = HousePageController.create({
  root: pageElement,
  entryDelayMs: 3000
});

controller.run([
  { target: '.target-a', mechanic: 'ORGANIC_FIELD' },
  { target: '.target-b', mechanic: 'DIAGNOSTIC', options: { scanEl, readoutEl } },
  { target: '.target-c', mechanic: 'GLINT' }
]);
```

This is deliberately declarative. Creative tuning should usually change the score or a mechanic's canonical envelope, not create another page-local animation system.

## Bite protocol

For small changes to an existing working book, use the surgical Git workflow by default:

1. Start from the exact last approved artifact/commit.
2. Keep the approved baseline immutable.
3. Make one microscopic change.
4. Prefer Git/GitHub plumbing or exact known-good replacement over wrapper stacking.
5. Verify the resulting artifact after the write.
6. Publish the exact verified artifact to `gh-pages` only when an audition build is intended.
7. Fetch the published copy and verify stable/Pages identity before handing off an audition URL.
8. If a candidate is bad, discard it and take the next bite from the last approved baseline rather than endlessly repairing the bad candidate.

For genuinely new pages or substantial rewrites, normal authoring is appropriate. The purpose of the protocol is a smaller blast radius, not ceremony.