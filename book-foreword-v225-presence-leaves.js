(() => {
  const V225_BUILD = 'BOOK FOREWORD v2.2.5 PRESENCE LEAVES';
  const V225_CACHE = 'book-foreword-v225-presence-leaves-phone';
  const VOID_AUDIO_SRC = './assets/audio/the_weight_of_infinite_stone.mp3';
  const PI_DIGITS = '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273';

  const clampLocal = (value, min, max) => Math.max(min, Math.min(max, value));
  const facts = () => document.getElementById('render-facts');
  const pageCount = () => Number(facts()?.dataset.pageCount || 21);
  const currentPage = () => Number(facts()?.dataset.currentPage || 0);
  const closingIndex = () => pageCount() - 2;
  const voidIndex = () => pageCount() - 1;

  let pointerStart = null;
  let sealRefused = false;
  let presenceStarted = false;
  let sealUnlockedAt = 0;
  let crawlFrame = 0;
  let voidAudio = null;
  let audioFadeFrame = 0;

  function pulse(pattern) {
    try {
      if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
    } catch (_) {}
  }

  function markBuild() {
    const marker = document.querySelector('.build-marker');
    if (marker) {
      marker.dataset.build = V225_BUILD;
      marker.textContent = V225_BUILD;
    }
    const renderFacts = facts();
    if (renderFacts) {
      renderFacts.dataset.build = V225_BUILD;
      renderFacts.dataset.cache = V225_CACHE;
      renderFacts.dataset.edgeCrawl = 'soft';
      renderFacts.dataset.glyphDrop = 'abandoned';
      renderFacts.dataset.presenceLeaves = 'armed';
      renderFacts.dataset.voidAudio = VOID_AUDIO_SRC;
      renderFacts.dataset.sealRefusal = 'armed';
      renderFacts.dataset.voidDrop = 'replaced-by-fade';
    }
  }

  function pageRectFor(svg) {
    const page = svg.closest('.book-page') || svg.parentElement;
    const reader = document.getElementById('reader');
    const root = document.querySelector('.book-root');
    const pageRect = page?.getBoundingClientRect?.();
    const readerRect = reader?.getBoundingClientRect?.();
    const rootRect = root?.getBoundingClientRect?.();
    const width = Math.round(
      (pageRect && pageRect.width > 120 ? pageRect.width : 0) ||
      (page && page.clientWidth > 120 ? page.clientWidth : 0) ||
      (rootRect && rootRect.width > 120 ? rootRect.width : 0) ||
      (readerRect && readerRect.width > 120 ? readerRect.width : 0) ||
      innerWidth
    );
    const height = Math.round(
      (pageRect && pageRect.height > 240 ? pageRect.height : 0) ||
      (page && page.clientHeight > 240 ? page.clientHeight : 0) ||
      (rootRect && rootRect.height > 240 ? rootRect.height : 0) ||
      (readerRect && readerRect.height > 240 ? readerRect.height : 0) ||
      innerHeight
    );
    return { width, height };
  }

  function drawMeasuredPerimeter(svg, index) {
    const { width, height } = pageRectFor(svg);
    if (width < 120 || height < 240) return;
    const prev = svg.dataset.edgeSize || '';
    const next = `${width}x${height}`;
    if (svg.classList.contains('v225-edge-crawl') && prev === next) return;

    const edge = Math.max(10, Math.round(Math.min(width, height) * 0.024));
    const left = edge;
    const top = edge;
    const right = Math.max(edge + 10, width - edge);
    const bottom = Math.max(edge + 10, height - edge);
    const id = `v225-edge-${index}-${width}-${height}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const digits = `${PI_DIGITS}${PI_DIGITS}${PI_DIGITS}`;
    const symbols = Array(260).fill('π').join(' ');

    svg.classList.remove('v221-full-perimeter', 'v222-edge-crawl', 'v223-edge-crawl', 'v224-edge-crawl');
    svg.classList.add('v225-edge-crawl');
    svg.dataset.edgeSize = next;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.innerHTML = `
      <defs>
        <path id="${id}-symbols" d="M ${left} ${top} H ${right} V ${bottom} H ${left} V ${top}"></path>
        <path id="${id}-digits" d="M ${right} ${top} V ${bottom} H ${left} V ${top} H ${right}"></path>
      </defs>
      <text class="pi-symbol-thread"><textPath class="v225-crawl-forward" href="#${id}-symbols" startOffset="0%">${symbols}</textPath></text>
      <text class="pi-digit-thread"><textPath class="v225-crawl-reverse" href="#${id}-digits" startOffset="52%">${digits}</textPath></text>
    `;
  }

  function upgradeMarginalia() {
    document.querySelectorAll('.pi-marginalia').forEach((svg, index) => drawMeasuredPerimeter(svg, index));
  }

  function startCrawl() {
    if (crawlFrame) cancelAnimationFrame(crawlFrame);
    const origin = performance.now();
    const tick = now => {
      const elapsed = now - origin;
      document.querySelectorAll('.v225-crawl-forward').forEach((path, index) => {
        path.setAttribute('startOffset', `${((elapsed * 0.0026 + index * 5) % 100).toFixed(2)}%`);
      });
      document.querySelectorAll('.v225-crawl-reverse').forEach((path, index) => {
        path.setAttribute('startOffset', `${(100 - ((elapsed * 0.0022 + 52 + index * 3) % 100)).toFixed(2)}%`);
      });
      crawlFrame = requestAnimationFrame(tick);
    };
    crawlFrame = requestAnimationFrame(tick);
  }

  function getVoidAudio() {
    if (voidAudio) return voidAudio;
    voidAudio = new Audio(`${VOID_AUDIO_SRC}?v=${V225_CACHE}`);
    voidAudio.preload = 'auto';
    voidAudio.loop = false;
    voidAudio.volume = 0;
    voidAudio.setAttribute('playsinline', '');
    voidAudio.setAttribute('webkit-playsinline', '');
    return voidAudio;
  }

  function easeInOut(t) {
    const x = clampLocal(t, 0, 1);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function fadeAudioIn() {
    const audio = getVoidAudio();
    if (audioFadeFrame) cancelAnimationFrame(audioFadeFrame);
    const started = performance.now();
    const target = 0.78;
    const duration = 4200;
    const tick = now => {
      const progress = clampLocal((now - started) / duration, 0, 1);
      audio.volume = target * easeInOut(progress);
      const renderFacts = facts();
      if (renderFacts) renderFacts.dataset.voidAudioVolume = audio.volume.toFixed(3);
      if (progress < 1) audioFadeFrame = requestAnimationFrame(tick);
    };
    audioFadeFrame = requestAnimationFrame(tick);
  }

  function startVoidAudio() {
    const audio = getVoidAudio();
    const renderFacts = facts();
    try {
      audio.volume = 0;
      if (audio.currentTime > 0.15 || audio.ended) audio.currentTime = 0;
      const playPromise = audio.play();
      if (renderFacts) renderFacts.dataset.voidAudio = 'starting';
      fadeAudioIn();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          if (renderFacts) renderFacts.dataset.voidAudio = 'playing';
        }).catch(err => {
          if (renderFacts) renderFacts.dataset.voidAudio = `blocked:${err?.name || 'unknown'}`;
        });
      }
    } catch (err) {
      if (renderFacts) renderFacts.dataset.voidAudio = `error:${err?.name || 'unknown'}`;
    }
  }

  function showVerticalNotYet(event) {
    const old = document.querySelector('.tap-refusal');
    if (old) old.remove();

    const el = document.createElement('div');
    el.className = 'tap-refusal';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span>n</span><span>o</span><span>t</span><i></i><span>y</span><span>e</span><span>t</span>';

    const x = clampLocal(event.clientX + 7, innerWidth * 0.70, innerWidth - 24);
    const y = clampLocal(event.clientY - 44, 72, innerHeight - 124);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('seen'));
    setTimeout(() => el.classList.add('leaving'), 620);
    setTimeout(() => el.remove(), 1060);
  }

  function triggerLocalSealFeedback(event) {
    const closing = document.querySelector('.foreword-closing-page');
    if (closing) closing.classList.add('v225-refused');
    showVerticalNotYet(event);
    pulse(10);
    sealRefused = true;
    sealUnlockedAt = performance.now() + 1125;
    const renderFacts = facts();
    if (renderFacts) renderFacts.dataset.sealRefusal = 'shown';
  }

  function measuredPageRect() {
    const closing = document.querySelector('.foreword-closing-page.is-current') || document.querySelector('.foreword-closing-page');
    const book = document.querySelector('.book-root');
    const reader = document.getElementById('reader');
    const candidates = [closing, book, reader].filter(Boolean);
    for (const el of candidates) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 120 && rect.height > 240) return { rect, el, closing };
    }
    return { rect: { left: 0, top: 0, width: innerWidth, height: innerHeight }, el: document.body, closing };
  }

  function createPresenceStage() {
    const { rect, closing } = measuredPageRect();
    const source = closing || document.querySelector('.book-root');
    const stage = document.createElement('div');
    stage.className = 'presence-leaves-stage';
    stage.setAttribute('aria-hidden', 'true');

    const black = document.createElement('div');
    black.className = 'presence-leaves-black';

    const clone = document.createElement('section');
    clone.className = 'book-page foreword-closing-page visual-page composition-locked-page presence-leaves-page-clone';
    clone.innerHTML = source ? source.innerHTML : '';
    clone.style.left = `${Math.round(rect.left)}px`;
    clone.style.top = `${Math.round(rect.top)}px`;
    clone.style.width = `${Math.round(rect.width)}px`;
    clone.style.height = `${Math.round(rect.height)}px`;

    stage.appendChild(black);
    stage.appendChild(clone);
    document.body.appendChild(stage);
    return stage;
  }

  function advanceBehindPresence() {
    const renderFacts = facts();
    try {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      if (renderFacts) renderFacts.dataset.currentPage = String(voidIndex());
    } catch (_) {}
  }

  function startPresenceLeaves() {
    if (presenceStarted) return;
    presenceStarted = true;
    const renderFacts = facts();
    if (renderFacts) {
      renderFacts.dataset.presenceLeaves = 'started';
      renderFacts.dataset.voidDrop = 'abandoned';
    }

    startVoidAudio();
    const stage = createPresenceStage();
    pulse([8, 38, 12]);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (stage) stage.classList.add('leaving');
    }));

    setTimeout(advanceBehindPresence, 2450);
    setTimeout(() => {
      if (renderFacts) renderFacts.dataset.presenceLeaves = 'complete';
      if (stage) stage.classList.add('settled');
    }, 3300);
    setTimeout(() => {
      if (stage) stage.remove();
    }, 4300);
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

      event.preventDefault();
      event.stopImmediatePropagation();

      if (performance.now() < sealUnlockedAt) {
        showVerticalNotYet(event);
        return;
      }

      startPresenceLeaves();
    }, { capture: true, passive: false });
  }

  function bootV225() {
    markBuild();
    getVoidAudio();
    upgradeMarginalia();
    startCrawl();
    initSealInterception();
    window.addEventListener('resize', () => requestAnimationFrame(upgradeMarginalia), { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(upgradeMarginalia, 180), { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) requestAnimationFrame(upgradeMarginalia);
    });
    setTimeout(upgradeMarginalia, 250);
    setTimeout(upgradeMarginalia, 900);
    setTimeout(upgradeMarginalia, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootV225, { once: true });
  } else {
    bootV225();
  }
})();