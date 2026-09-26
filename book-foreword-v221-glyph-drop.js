const V221_BUILD = 'BOOK FOREWORD v2.2.1 GLYPH DROP';
const V221_CACHE = 'book-foreword-v221-glyph-drop';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const facts = () => document.getElementById('render-facts');
const pageCount = () => Number(facts()?.dataset.pageCount || 21);
const currentPage = () => Number(facts()?.dataset.currentPage || 0);
const closingIndex = () => pageCount() - 2;

let pointerStart = null;
let sealRefused = false;
let dropStarted = false;
let sealUnlockedAt = 0;

function pulse(pattern) {
  try {
    if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
  } catch (_) {}
}

function markBuild() {
  const marker = document.querySelector('.build-marker');
  if (marker) {
    marker.dataset.build = V221_BUILD;
    marker.textContent = V221_BUILD;
  }
  const renderFacts = facts();
  if (renderFacts) {
    renderFacts.dataset.build = V221_BUILD;
    renderFacts.dataset.cache = V221_CACHE;
    renderFacts.dataset.glyphDrop = 'present';
    renderFacts.dataset.sealRefusal = 'armed';
    renderFacts.dataset.voidDrop = 'armed';
  }
}

function upgradeMarginalia() {
  document.querySelectorAll('.pi-marginalia').forEach((svg, index) => {
    const id = `v221-pi-${index}`;
    const digits = '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273'.repeat(2);
    const symbols = Array(170).fill('π').join(' ');
    svg.classList.add('v221-full-perimeter');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = `
      <defs>
        <path id="${id}-symbols" d="M 7 7 H 93 V 93 H 7 V 7"></path>
        <path id="${id}-digits" d="M 93 7 V 93 H 7 V 7 H 93"></path>
      </defs>
      <text class="pi-symbol-thread"><textPath href="#${id}-symbols" startOffset="0%">${symbols}</textPath></text>
      <text class="pi-digit-thread"><textPath href="#${id}-digits" startOffset="0%">${digits}</textPath></text>
    `;
  });
}

function showVerticalNotYet(event) {
  const old = document.querySelector('.tap-refusal');
  if (old) old.remove();

  const el = document.createElement('div');
  el.className = 'tap-refusal';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span>n</span><span>o</span><span>t</span><i></i><span>y</span><span>e</span><span>t</span>';

  const x = clamp(event.clientX + 7, innerWidth * 0.70, innerWidth - 24);
  const y = clamp(event.clientY - 44, 72, innerHeight - 124);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('seen'));
  setTimeout(() => el.classList.add('leaving'), 560);
  setTimeout(() => el.remove(), 960);
}

function triggerLocalSealFeedback(event) {
  const closing = document.querySelector('.foreword-closing-page');
  if (closing) closing.classList.add('v221-refused');
  showVerticalNotYet(event);
  pulse(10);
  sealRefused = true;
  sealUnlockedAt = performance.now() + 1125;
  const renderFacts = facts();
  if (renderFacts) renderFacts.dataset.sealRefusal = 'shown';
}

function createDropStage() {
  const book = document.querySelector('.book-root');
  const closing = document.querySelector('.foreword-closing-page');
  if (!book || !closing) return null;

  const rect = book.getBoundingClientRect();
  const stage = document.createElement('div');
  stage.className = 'void-drop-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.style.left = `${rect.left}px`;
  stage.style.top = `${rect.top}px`;
  stage.style.width = `${rect.width}px`;
  stage.style.height = `${rect.height}px`;

  const black = document.createElement('div');
  black.className = 'void-drop-black';

  const clone = closing.cloneNode(true);
  clone.classList.add('void-drop-page-clone');
  clone.classList.remove('is-current');

  stage.appendChild(black);
  stage.appendChild(clone);
  document.body.appendChild(stage);
  return stage;
}

function startVoidDrop() {
  if (dropStarted) return;
  dropStarted = true;
  const renderFacts = facts();
  if (renderFacts) renderFacts.dataset.voidDrop = 'started';

  const stage = createDropStage();
  pulse([8, 44, 18]);

  requestAnimationFrame(() => {
    if (stage) stage.classList.add('dropping');
  });

  setTimeout(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  }, 620);

  setTimeout(() => {
    if (renderFacts) renderFacts.dataset.voidDrop = 'complete';
    if (stage) stage.remove();
  }, 1180);
}

function initSealInterception() {
  const zones = document.querySelector('.tap-zones');
  if (!zones) return;

  zones.addEventListener('pointerdown', event => {
    pointerStart = { x: event.clientX, y: event.clientY, t: performance.now() };
  }, { capture: true, passive: true });

  zones.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    const moved = Math.hypot(dx, dy);
    const age = performance.now() - pointerStart.t;
    const isTap = moved <= 18 && age <= 820;
    const isRight = pointerStart.x > innerWidth * 0.67;
    const onClosing = currentPage() === closingIndex();
    pointerStart = null;

    if (!isTap || !isRight || !onClosing) return;

    if (!sealRefused) {
      triggerLocalSealFeedback(event);
      return;
    }

    if (performance.now() < sealUnlockedAt) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showVerticalNotYet(event);
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    startVoidDrop();
  }, { capture: true, passive: false });
}

function bootV221() {
  markBuild();
  upgradeMarginalia();
  initSealInterception();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootV221, { once: true });
} else {
  bootV221();
}
