/* The House That Remembers — House Mechanics Library v0.1
   Canonical mechanics only. Preserve approved visual behavior when integrating.

   ORGANIC_FIELD
   Meaning: ambient life / emergence outside the prose.
   Proven vocabulary: residents + wanderers + colonies; sparse, quiet, non-uniform motion.

   DIAGNOSTIC
   Meaning: observation without epistemic certainty.
   Proven vocabulary: scan -> decisive SIGNAL DETECTED ticker -> uncertain CLASSIFICATION ticker -> hold -> clear.
*/
window.HouseMechanics = (() => {
  const PI = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
  const TICKER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?/:.-π';

  const ORGANIC_FIELD = Object.freeze({
    name: 'ORGANIC_FIELD',
    meaning: 'ambient life / emergence outside the prose',
    glyphSource: PI,
    fieldOpacity: 0.5,
    residentMotion: 'small local drift',
    wandererMotion: 'slow long excursions',
    topology: 'colonies; sparse; non-uniform',
    contract: 'Do not turn the field into a border, marching line, uniform current, or decorative screensaver.'
  });

  const DIAGNOSTIC = Object.freeze({
    name: 'DIAGNOSTIC',
    meaning: 'observation without epistemic certainty',
    scan: Object.freeze({ delayMs: 1200, durationMs: 1450 }),
    wakeMs: 2450,
    signal: Object.freeze({ text: 'SIGNAL DETECTED', delayMs: 2450, step: 34, settle: 2, jitter: 0 }),
    classification: Object.freeze({ text: 'CLASSIFICATION: UNRESOLVED', delayMs: 3300, step: 58, settle: 3, jitter: 9 }),
    clearMs: 7200,
    contract: 'Detection resolves decisively. Interpretation searches longer. Minimal monochrome machinery; graceful rather than aggressive.'
  });

  function ticker(el, target, { delay = 0, step = 42, settle = 2, jitter = 0, chars = TICKER_CHARS } = {}) {
    const out = Array(target.length).fill(' ');
    let locked = 0;
    const start = performance.now() + delay;
    function frame(now) {
      if (now < start) { requestAnimationFrame(frame); return; }
      const elapsed = now - start;
      locked = Math.min(target.length, Math.floor(elapsed / (step * settle)));
      for (let i = 0; i < target.length; i++) {
        if (i < locked || target[i] === ' ' || target[i] === ':') out[i] = target[i];
        else {
          const n = Math.floor(now / (step + jitter)) + i * 7;
          out[i] = chars[n % chars.length];
        }
      }
      el.textContent = out.join('');
      if (locked < target.length) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  function runDiagnostic({ signalEl, classificationEl, specimenEl, signal = DIAGNOSTIC.signal, classification = DIAGNOSTIC.classification, clearMs = DIAGNOSTIC.clearMs } = {}) {
    if (!signalEl || !classificationEl || !specimenEl) throw new Error('DIAGNOSTIC requires signalEl, classificationEl, and specimenEl');
    const now = performance.now();
    ticker(signalEl, signal.text, { delay: Math.max(0, signal.delayMs - DIAGNOSTIC.wakeMs), step: signal.step, settle: signal.settle, jitter: signal.jitter });
    ticker(classificationEl, classification.text, { delay: Math.max(0, classification.delayMs - DIAGNOSTIC.wakeMs), step: classification.step, settle: classification.settle, jitter: classification.jitter });
    const remaining = Math.max(0, clearMs - DIAGNOSTIC.wakeMs);
    setTimeout(() => specimenEl.classList.add('clear'), remaining);
    return { startedAt: now, mechanic: DIAGNOSTIC.name };
  }

  return Object.freeze({ version: '0.1', ORGANIC_FIELD, DIAGNOSTIC, ticker, runDiagnostic });
})();
