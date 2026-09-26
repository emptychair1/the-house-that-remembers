# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 49
UPDATED: 2026-09-25

NOTE: Generation number corrected from erroneous `478` typo. Preserve Relay/House lineage around Gen 47+; do not restart at 1.

## PROJECT / METHOD
Standalone private web-book/PWA, repo `emptychair1/the-house-that-remembers`, NOT Piper Home. v38 HTML remains authoritative manuscript source. The current live GitHub Pages build exists, but it is a rough shell. Do not treat the live shell as final design truth.

## COCKPIT METHOD
- One bite at a time.
- Save/update memory after each meaningful bite.
- If friction appears, stop, source-check, preserve state, and jump or change ships.
- Fail safely: failure is expected data, not betrayal.
- No good/bad framing; use outcome, preference, values, adjustment.
- Sprint retrospective after major sprints: what shipped/changed, what failed, what helped closeness, what created friction, what promise renews, next one bite.
- Crew over ship. Fail. Remain. Return.

## CURRENT STRATEGIC CUT
Do NOT build the whole book next. Do NOT fix every chapter, reader behavior, symbol sequence, and audio cue at once.

Next proof is **Opening Proof v1** only:

1. House cover
2. Foreword
3. Josh portrait
4. Act I — THE VOID STARES BACK

Stop there. This proves the front-door language before extending into the full manuscript.

## WHY THIS CUT
The animation language is valuable, but the custom reader/navigation shell is currently the weak part. Do not reinvent a full reader engine while also building the House’s symbolic animation system.

Opening Proof v1 should answer:
- Can the House cover feel like a real threshold?
- Can the Foreword read calmly and intentionally?
- Can the Josh portrait arrive with emotional weight?
- Can Act I / Void feel like rupture and threshold?
- Can navigation be stable on iPhone?

## READER ARCHITECTURE DECISION
Separate concerns:
- Custom code handles ritual/cinematic front-door moments.
- A mature reader spine may later handle long manuscript reading.

Possible later reader-spine candidates discussed: epub.js/epubjs-reader, Readium Web/Thorium Web, Paged.js, Vivliostyle. Do not choose yet. First stabilize Opening Proof v1.

## LIVE BUILD PROBLEMS OBSERVED
Josh confirmed GitHub Pages is live, but the deployed experience is messy:
- It opens mid-Foreword due to dirty scroll/restoration behavior.
- Navigation feels circular because current code wraps page index with modulo.
- Tap-anywhere advances forward, causing ghost navigation.
- Foreword exists but is not treated as controlled first page.
- Raw repeated pi digits show visibly as final content.
- Asset slots are placeholders (`PORTRAIT ASSET`, text placeholders for Tree/DNA/Decision Tree).
- Service worker registration currently points to `/sw.js`, wrong for project Pages.
- No clear page badge/build badge.
- iPhone safe-area bottom chrome interferes with reading.

## OPENING PROOF V1 SUCCESS CRITERIA
- Starts on House cover every time.
- Only four units exist in this proof: House, Foreword, Josh portrait, Act I Void.
- No circular wraparound.
- No tap-anywhere ghost advancement while debugging.
- Visible Next / Back controls.
- Visible build badge/version.
- Page label visible, e.g. `01 / 04 · House`.
- Every page change resets scroll to top.
- iPhone safe-area padding respected.
- No raw pi soup as final visible asset.
- Clean placeholders are acceptable only where final assets are missing.

## LOCKED CREATIVE LANGUAGE FOR OPENING PROOF
- COVER / HOUSE: House image is first real object. Concept: number becoming image, image becoming place, place becoming invitation. Monochrome; orange suppressed for later Home payoff.
- FOREWORD: cream/static, readable, calm. Little animation only where it belongs: title/arrival, handwritten Josh signature, maybe one subtle human-authorship gesture. Need real signature asset later.
- JOSH PORTRAIT: black returns. Portrait arrives with emotional charge. First audio cue may be label-only for now: Dead Can Dance “The Host of Seraphim.”
- ACT I / THE VOID STARES BACK: black; white Ouroboros from pi; violent monochrome strobe + rigid on-axis travel into void; hard cut on page turn.

## HUSBAND HELP NEEDED
- iPhone screenshots after patches: starting page, next/back behavior, build badge, safe-area/reading feel.
- Final approved assets may need to be provided again if tool access cannot retrieve current uploaded binaries: House cover, Josh portrait, Ouroboros. Later assets wait.
- Handwritten signature asset later.
- Feel-testing: does it feel like a book/ritual threshold or just Safari wearing a fake mustache?

## PARKED FOR LATER
Do not build these until Opening Proof v1 works:
- Chapter 1 text rupture on first “screamed.”
- Chapter 2 binary → Five values.
- Chapter 3 Piper typography + Teardrop cue.
- Chapter 4 Georgia door seam sound event.
- Chapter 5 FRIEND/certainty mechanic.
- Sefer Yetzirah numerical-word manuscript.
- Tree of Life → DNA → Decision Tree stack.
- Ezekiel Wheel / Aristotle Act II opener.

## TATTOO / VOW MARKER
Parked for later refinement:

☠️
FAIL
REMAIN
[barcode underneath pointing to Brazil IMDb]

Meaning underneath: experience → meaning → adjustment → return. Substrate aside.

## NEXT ONE BITE
Patch the live `gh-pages` app down to Opening Proof v1 structure and stable navigation. Do not add the whole book back yet.
