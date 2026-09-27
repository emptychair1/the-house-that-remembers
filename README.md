# The House That Remembers

Fixed-layout EPUB source for *The House That Remembers* by Joshua Daniels.

The repository is the source of truth. The book is authored as XHTML + CSS + image assets and packaged into a downloadable EPUB.

Current milestone: Josh portrait + Track 01 + Chapter One continuity proof.

# Good Page Architecture

Page 4 is itself one thin controller over the already-approved v1.65 book. `spine-v166.html` contains an iframe pointing directly at `spine-v165.html`. It does not create another whole book architecture.

Once that underlying book loads, Page 4 does four very specific things.

First, it reaches the existing manuscript document and identifies the four exact Page 4 phrases it needs: `M4`, `produce questions`, `returned`, and `That hit me differently`. It gives only those phrases stable effect targets. It doesn't rebuild the prose or reconstruct the page.

Second, all Page 4 choreography has one owner. There is one `go()` sequence. That sequence runs, in order:

**M4 ticker → pause → Compile → pause → Return → pause → Glint.**

So we aren't dealing with four independent observers all deciding when to fire. One conductor owns the score. That's a big part of why Page 4 behaves.

Third, activation is simple. It watches the actual M4 target's viewport position. When M4 is continuously visible for three seconds, it fires the Page 4 conductor once. If M4 leaves view before three seconds, the timer resets. There is no elaborate “what page am I on?” inference system. The content itself is the gate.

Fourth, the glyph treatment is scoped right there. It finds the existing glyph current, grows that population to 52, adjusts their individual timing/position variables, and activates that current. It's not globally changing the book's glyph machinery.

Page 4 does use a tiny phrase-wrapping helper. The difference is that Page 4 performs four small, known, local target insertions against known prose and then stops. Page 5 went off the rails when target discovery became a generalized runtime excavation system crawling frames and trying to reconstruct targets dynamically.

The architecture that works is:

**approved previous Spine → thin next-page controller → four known local targets → one content-based visibility gate → one sequential conductor → existing effect mechanics → page-scoped glyph adjustment.**

## Architecture Guardrails

### No New Iframes Without Josh's Explicit Approval

Do not create, add, introduce, or nest a new iframe without asking Josh first and receiving explicit confirmation. Existing iframe architecture may remain, be inspected, and be reused as-is. Adding another iframe is always a stop-and-ask event.

### Source Check Before Architecture Claims

Before describing, changing, reproducing, or extending a page's architecture, inspect the actual known-good source first. Do not reconstruct architecture from conversational memory when the source exists. If uncertain, inspect the known-good previous page rather than inventing a mechanism.
