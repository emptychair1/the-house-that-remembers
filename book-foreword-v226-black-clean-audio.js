(() => {
  const V226_BUILD = 'BOOK FOREWORD v2.2.6 BLACK CLEAN AUDIO';
  const V226_CACHE = 'book-foreword-v226-black-clean-audio-phone';
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
  let audioCtx = null;
  let audioSource = null;
  let audioGain = null;
  let audioFallbackFrame = 0;
  let audioStartRequested = false;
  let audioBlocked = false;
  let cleanStage = null;

  function setFact(name, value) {
    const renderFacts = facts();
    if (renderFacts) renderFacts.dataset[name] = String(value);
  }

  function pulse(pattern) {
    try {
      if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
    } catch (_) {}
  }

  function markBuild() {
    const marker = document.querySelector('.build-marker');
    if (marker) {
      marker.dataset.build = V226_BUILD;
      marker.textContent = V226_BUILD;
    }
    setFact('build', V226_BUILD);
    setFact('cache', V226_CACHE);
    setFact('edgeCrawl', 'soft');
    setFact('glyphDrop', 'abandoned');
    setFact('presenceLeaves', 'black-clean');
    setFact('voidAudio', VOID_AUDIO_SRC);
    setFact('sealRefusal', 'armed');
    setFact('voidDrop', 'abandoned');
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
    if (svg.classList.contains('v226-edge-crawl') && prev === next) return;

    const edge = Math.max(10, Math.round(Math.min(width, height) * 0.024));
    const left = edge;
    const top = edge;
    const right = Math.max(edge + 10, width - edge);
    const bottom = Math.max(edge + 10, height - edge);
    const id = `v226-edge-${index}-${width}-${height}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const digits = `${PI_DIGITS}${PI_DIGITS}${PI_DIGITS}`;
    const symbols = Array(260).fill('π').join(' ');

    svg.classList.remove('v221-full-perimeter', 'v222-edge-crawl', 'v223-edge-crawl', 'v224-edge-crawl', 'v225-edge-crawl');
    svg.classList.add('v226-edge-crawl');
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
      <text class="pi-symbol-thread"><textPath class="v226-crawl-forward" href="#${id}-symbols" startOffset="0%">${symbols}</textPath></text>
      <text class="pi-digit-thread"><textPath class="v226-crawl-reverse" href="#${id}-digits" startOffset="52%">${digits}</textPath></text>
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
      document.querySelectorAll('.v226-crawl-forward').forEach((path, index) => {
        path.setAttribute('startOffset', `${((elapsed * 0.0026 + index * 5) % 100).toFixed(2)}%`);
      });
      document.querySelectorAll('.v226-crawl-reverse').forEach((path, index) => {
        path.setAttribute('startOffset', `${(100 - ((elapsed * 0.0022 + 52 + index * 3) % 100)).toFixed(2)}%`);
      });
      crawlFrame = requestAnimationFrame(tick);
    };
    crawlFrame = requestAnimationFrame(tick);
  }

  function getVoidAudio() {
    if (voidAudio) return voidAudio;
    voidAudio = document.createElement('audio');
    voidAudio.id = 'void-audio';
    voidAudio.src = `${VOID_AUDIO_SRC}?v=${V226_CACHE}`;
    voidAudio.preload = 'auto';
    voidAudio.loop = false;
    voidAudio.playsInline = true;
    voidAudio.setAttribute('playsinline', '');
    voidAudio.setAttribute('webkit-playsinline', '');
    voidAudio.volume = 1;
    voidAudio.style.display = 'none';
    document.body.appendChild(voidAudio);
    return voidAudio;
  }

  function ensureAudioGraph() {
    const audio = getVoidAudio();
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    if (!audioCtx) audioCtx = new Ctx();
    if (!audioSource) {
      audioSource = audioCtx.createMediaElementSource(audio);
      audioGain = audioCtx.createGain();
      audioGain.gain.value = 0.0001;
      audioSource.connect(audioGain);
      audioGain.connect(audioCtx.destination);
    }
    return true;
  }

  function easeInOut(t) {
    const x = clampLocal(t, 0, 1);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function rampFallbackVolume() {
    const audio = getVoidAudio();
    if (audioFallbackFrame) cancelAnimationFrame(audioFallbackFrame);
    const started = performance.now();
    const duration = 4200;
    const tick = now => {
      const progress = clampLocal((now - started) / duration, 0, 1);
      try { audio.volume = 0.82 * easeInOut(progress); } catch (_) {}
      setFact('voidAudioVolume', (0.82 * easeInOut(progress)).toFixed(3));
      if (progress < 1) audioFallbackFrame = requestAnimationFrame(tick);
    };
    audioFallbackFrame = requestAnimationFrame(tick);
  }

  function rampAudioIn() {
    if (audioGain && audioCtx) {
      const now = audioCtx.currentTime;
      const startValue = Math.max(0.0001, Number(audioGain.gain.value) || 0.0001);
      audioGain.gain.cancelScheduledValues(now);
      audioGain.gain.setValueAtTime(startValue, now);
      audioGain.gain.exponentialRampToValueAtTime(0.82, now + 4.2);
      setFact('voidAudioGain', 'ramping');
      return;
    }
    rampFallbackVolume();
  }

  function showAudioUnlock() {
    const stage = cleanStage || document.querySelector('.presence-clean-stage');
    if (!stage || stage.querySelector('.audio-unlock-button')) return;
    const button = document.createElement('button');
    button.className = 'audio-unlock-button';
    button.type = 'button';
    button.textContent = 'tap for sound';
    button.addEventListener('pointerup', event => {
      event.preventDefault();
      event.stopPropagation();
      startAudioFromGesture(true);
      rampAudioIn();
      button.remove();
    }, { passive: false });
    stage.appendChild(button);
  }

  function startAudioFromGesture(forceReset = false) {
    if (audioStartRequested && !forceReset) return;
    audioStartRequested = true;
    const audio = getVoidAudio();
    try {
      let graphOk = false;
      try { graphOk = ensureAudioGraph(); } catch (graphErr) { setFact('voidAudioGraph', `error:${graphErr?.name || 'unknown'}`); }
      if (graphOk && audioCtx?.state !== 'running') audioCtx.resume();
      if (graphOk && audioGain && audioCtx) {
        const now = audioCtx.currentTime;
        audioGain.gain.cancelScheduledValues(now);
        audioGain.gain.setValueAtTime(0.0001, now);
      } else {
        try { audio.volume = 0.02; } catch (_) {}
      }
      if (forceReset || audio.currentTime > 0.15 || audio.ended) audio.currentTime = 0;
      setFact('voidAudio', 'play-requested');
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          audioBlocked = false;
          setFact('voidAudio', 'playing');
        }).catch(err => {
          audioBlocked = true;
          setFact('voidAudio', `blocked:${err?.name || 'unknown'}`);
          showAudioUnlock();
        });
      }
    } catch (err) {
      audioBlocked = true;
      setFact('voidAudio', `error:${err?.name || 'unknown'}`);
      showAudioUnlock();
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
    if (closing) closing.classList.add('v226-refused');
    showVerticalNotYet(event);
    pulse(10);
    sealRefused = true;
    sealUnlockedAt = performance.now() + 1125;
    setFact('sealRefusal', 'shown');
  }

  function createCleanStage() {
    if (cleanStage) return cleanStage;
    const stage = document.createElement('div');
    stage.className = 'presence-clean-stage';
    stage.setAttribute('aria-hidden', 'true');
    const black = document.createElement('div');
    black.className = 'presence-clean-black';
    stage.appendChild(black);
    document.body.appendChild(stage);
    cleanStage = stage;
    if (audioBlocked) showAudioUnlock();
    return stage;
  }

  function startPresenceLeaves() {
    if (presenceStarted) return;
    presenceStarted = true;
    setFact('presenceLeaves', 'started');
    setFact('voidDrop', 'abandoned');

    startAudioFromGesture();
    rampAudioIn();
    const stage = createCleanStage();
    document.documentElement.classList.add('presence-clean-leaving');
    pulse([8, 38, 12]);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      stage.classList.add('leaving');
    }));

    setTimeout(() => {
      setFact('currentPage', String(voidIndex()));
      setFact('presenceLeaves', 'black-settled');
      document.documentElement.classList.add('presence-clean-settled');
      stage.classList.add('settled');
      if (audioBlocked) showAudioUnlock();
    }, 3400);
  }

  function shouldPrimeAudio(event) {
    return currentPage() === closingIndex() &&
      sealRefused &&
      performance.now() >= sealUnlockedAt &&
      event.clientX > innerWidth * 0.67;
  }

  function initSealInterception() {
    const zones = document.querySelector('.tap-zones');
    if (!zones) return;

    zones.addEventListener('pointerdown', event => {
      pointerStart = { x: event.clientX, y: event.clientY, t: performance.now() };
      if (shouldPrimeAudio(event)) startAudioFromGesture();
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

  function bootV226() {
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
    document.addEventListener('DOMContentLoaded', bootV226, { once: true });
  } else {
    bootV226();
  }
})();
