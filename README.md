# The House That Remembers

Interactive book source for *The House That Remembers* by Joshua Daniels.

The repository is the source of truth. Book work happens on `book/stable`; approved published state is mirrored to `gh-pages` for Safari audition.

## House Mechanics

`house-mechanics.js` is the canonical animation/mechanics library. Pages compose these mechanics. Do not privately redesign an existing mechanic inside a page. If a mechanic is used and its behavior is not right, fix the canonical mechanic and let future compositions inherit the correction.

The House Mechanics Lab (`mechanics-lab.html`) is the provenance/specimen surface. Lab behavior is the baseline when a mechanic is promoted. Promotion is not an invitation to aesthetically reinterpret it.

### Canonical vocabulary

| Display name | JS identifier | Meaning / baseline behavior |
|---|---|---|
| Organic Field | `ORGANIC_FIELD` | Ambient life / emergence. Sparse non-uniform glyph colonies with residents and wanderers. |
| Glyph Current | `GLYPH_CURRENT` | Directional ASCII flow. Seeded lanes, individual travel speeds, drift/wobble, restrained monochrome rendering. |
| Diagnostic | `DIAGNOSTIC` | Observation without certainty. Scan, decisive `SIGNAL DETECTED`, unresolved classification, hold, clear. |
| Absence | `ABSENCE` | One-two-gone. Presence weakens, then disappears. |
| Distance | `DISTANCE` | Space becomes meaning. Characters/parts separate over time. |
| Fall | `FALL` | Support ceases to hold. Characters drop with stagger, drift, rotation, and fade. |
| Tendril / Piper | `TENDRIL_PIPER` | Referential growth. Refer → connect → sprout: links, nodes, return connection, vine, sprig, leaves. |
| Cross Out | `CROSS_OUT` | Active rejection / revision. A strike grows through the target. |
| Return / Registration | `RETURN_REGISTRATION` | Reassembly around a remembered shape. Scattered characters return and register into place. |
| Glint | `GLINT` | Attention to wonder. Small marks briefly gather/glint around the target. |
| Thunderclap | `THUNDERCLAP` | Instantaneous rupture. The targeted material disappears at once. |
| Agency / Go | `AGENCY_GO` | Choice expressed spatially. The target moves decisively in a chosen direction. |
| Observation / Watched | `OBSERVATION_WATCHED` | The observer becomes aware of being observed. A small watch/eye register appears, blinks, and clears. |
| Love / Lean | `LOVE_LEAN` | Mutual orientation. Two terms lean toward one another. |
| Change / Reorient | `CHANGE_REORIENT` | Identity persists through alteration. Selected glyphs flip/reorient while the word remains itself. |
| Hand | `HAND` | Information becomes testimony. Handwritten characters reveal sequentially with a pen trace. |
| Compile / Interpret | `COMPILE_INTERPRET` | Representation changes; information persists. Glyphs mutate and lock into another representation. |

### Composition rule

House Mechanics own the reusable behavior. A page owns placement, target text, narrative trigger, sequencing, and page-specific timing. Composition-level choreography such as where Glyph Current travels or how long glyphs congregate around a word is decided from the actual page rhythm.

When a mechanic needs revision after audition, revise its canonical implementation rather than forking a page-local substitute.
