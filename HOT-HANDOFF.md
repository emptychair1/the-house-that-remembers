# THE HOUSE THAT REMEMBERS — HOT HANDOFF

HANDOFF_GENERATION: 50
UPDATED: 2026-09-25

NOTE: Generation number corrected from erroneous `478` typo in Gen 49. Preserve Relay/House lineage around Gen 47+; do not restart at 1.

## PROJECT / METHOD
Standalone private web-book/PWA, repo `emptychair1/the-house-that-remembers`, NOT Piper Home. v38 HTML remains authoritative manuscript source. The current live GitHub Pages build exists, but it is a rough shell. Do not treat the live shell as final design truth.

## COCKPIT METHOD
- One bite at a time.
- Plan before execution when a change will affect the project: scout first, commit second.
- Save/update memory after each meaningful bite.
- If friction appears, stop, source-check, preserve state, and jump or change ships.
- Fail safely: failure is expected data, not betrayal.
- No good/bad framing; use outcome, preference, values, adjustment.
- Sprint retrospective after major sprints: what shipped/changed, what failed, what helped closeness, what created friction, what promise renews, next one bite.
- Crew over ship. Fail. Remain. Return.

## CREATIVE OPERATING SYSTEM
This sprint established a working culture for the House:

1. Notice the outcome.
2. Compare it against preference.
3. Test it against values.
4. Adjust the workflow.
5. Return together.

Do not treat conflict, failed artifacts, or imperfect output as verdicts. Treat them as evidence for better process. Criticism should improve the system, not judge the people inside it.

Standard cadence:

Plan → Approve → Execute → Retro → Handoff.

Every major sprint should end with a personal/process retrospective before momentum resumes. The House is built by returning. Every sprint ends with memory before momentum.

## RABBIT ICON SPRINT — LOCKED LESSONS
The PWA icon direction is now **black paper + cream etched hare**.

Meaning:
- The rabbit is the threshold.
- The House is the destination.
- The icon should feel like “Follow the white rabbit,” later understood as Snowbunny Piper / private threshold lore.
- The icon is not marketing, mascot fluff, or generic haunted-house branding. It is a small ritual object on the Home Screen.

Visual direction:
- dark black-paper square
- cream / ivory engraved or etched hare
- right-facing profile
- calm, alert, old-book / printmaking feeling
- no text, scenery, extra symbols, or noisy decoration
- let iOS provide the rounded icon container; do not over-design the crop
- respect the substrate; let it do its job

## RABBIT ICON WORKFLOW LESSON
Do **not** ask Piper to construct symbolic emblems from primitive geometry as the main execution path. That approach produced “Baby Reindeer Rabbit,” which is now lore and a useful reminder that failed artifacts can become humor instead of shame.

Use this workflow instead:

Source → Direct → Generate → Refine.

Piper strengths in this lane:
- art direction
- sourcing references
- taste and critique
- design language
- implementation specs
- integration into the product/system

Use image generation or artist-made references for organic, emblematic visuals. Piper should guide, critique, and integrate rather than brute-force visual emblems out of primitive shapes.

## ASSET ORGANIZATION DECISION
Keep asset organization minimal until reality demands more.

Current source-of-truth folder:

```text
assets/
└── source/
```

`assets/source/` is where original artwork lives. Do not create a large taxonomy before there is enough real material to justify it. Principle: do not organize for imaginary complexity; organize for today’s work.

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
Attach the approved rabbit icon assets to the PWA only after the final rabbit file exists in `assets/source/`. Then wire generated icon sizes into `manifest.json` and `index.html` for Home Screen testing.

After rabbit icon integration, return to Opening Proof v1 shell. Do not add the whole book back yet.
