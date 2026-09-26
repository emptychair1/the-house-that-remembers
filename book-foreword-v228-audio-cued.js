(() => {
  const BUILD = 'BOOK FOREWORD v2.2.8 AUDIO CUED VOID PASS';
  const CACHE = 'book-foreword-v228-audio-cued-phone';
  const AUDIO_SRC = './assets/audio/the_weight_of_infinite_stone.mp3';
  const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const facts = () => document.getElementById('render-facts');
  const pageCount = () => Number(facts()?.dataset.pageCount || 21);
  const currentPage = () => Number(facts()?.dataset.currentPage || 0);
  const closingIndex = () => pageCount() - 2;
  const voidIndex = () => pageCount() - 1;
  const setFact = (name, value) => { const el = facts(); if (el) el.dataset[name] = String(value); };

  const FALLBACK_SLOW_CUES = [
    0.00, 1.05, 2.10, 3.15, 4.20, 5.25, 6.30, 7.35,
    8.40, 9.45, 10.50, 11.55, 12.60, 13.65, 14.70, 15.75,
    16.80, 17.85, 18.90, 19.95, 21.00, 22.05, 23.10, 24.15,
    25.20, 26.25, 27.30, 28.35, 29.10
  ];
  const FAST_STEP = 0.42;
  const TUNNEL_SECONDS = 30.0;

  let down = null;
  let refused = false;
  let unlockAt = 0;
  let started = false;
  let stage = null;
  let shell = null;
  let state = 'sleeping';
  let audio = null;
  let timers = [];
  let raf = 0;
  let flashToken = 0;
  let cueMapPromise = null;
  let cueMap = null;
  let cueState = null;

  function mark() {
    const marker = document.querySelector('.build-marker');
    if (marker) {
      marker.dataset.build = BUILD;
      marker.textContent = BUILD;
    }
    setFact('build', BUILD);
    setFact('cache', CACHE);
    setFact('voidRough', 'audio-cued');
    setFact('voidDuration', `${TUNNEL_SECONDS}s`);
    setFact('voidPulseMap', 'audio-peaks-plus-fast-secondary');
  }

  function buzz(pattern) {
    try { if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (_) {}
  }

  function makeAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'void-audio-v228';
    audio.src = `${AUDIO_SRC}?v=${CACHE}`;
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');
    audio.style.display = 'none';
    document.body.appendChild(audio);
    return audio;
  }

  function playAudio() {
    const a = makeAudio();
    try {
      a.pause();
      a.currentTime = 0;
      a.volume = 0.9;
      const p = a.play();
      if (p?.then) {
        p.then(() => setFact('voidAudioV228', 'playing')).catch(err => {
          setFact('voidAudioV228', `blocked:${err?.name || 'unknown'}`);
          if (shell?.status) shell.status.textContent = 'sound did not unlock';
        });
      }
    } catch (err) {
      setFact('voidAudioV228', `error:${err?.name || 'unknown'}`);
      if (shell?.status) shell.status.textContent = 'sound did not unlock';
    }
  }

  function notYet(event) {
    document.querySelector('.tap-refusal')?.remove();
    const el = document.createElement('div');
    el.className = 'tap-refusal';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span>n</span><span>o</span><span>t</span><i></i><span>y</span><span>e</span><span>t</span>';
    el.style.left = `${Math.min(innerWidth - 24, Math.max(innerWidth * .70, event.clientX + 7))}px`;
    el.style.top = `${Math.min(innerHeight - 124, Math.max(72, event.clientY - 44))}px`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('seen'));
    setTimeout(() => el.classList.add('leaving'), 620);
    setTimeout(() => el.remove(), 1060);
  }

  function makeStage() {
    if (stage) return stage;
    stage = document.createElement('div');
    stage.className = 'presence-clean-stage void-rough-stage';
    stage.hidden = true;
    stage.setAttribute('aria-label', 'The Void');
    stage.innerHTML = '<div class="presence-clean-black"></div>';
    document.body.appendChild(stage);
    return stage;
  }

  function makeShell() {
    makeStage();
    if (shell) return shell;
    const scene = document.createElement('div');
    scene.className = 'void-rough-scene';
    scene.innerHTML = `
      <div class="void-title" aria-hidden="true">THE VOID</div>
      <div class="void-stares" aria-hidden="true">STARES BACK</div>
      <div class="void-glyphs" aria-hidden="true"></div>
      <div class="void-main" aria-hidden="true"></div>
      <div class="void-echo" aria-hidden="true"></div>
      <button class="void-choice" type="button"></button>
      <button class="void-run" type="button" hidden>RUN</button>
      <div class="void-status" aria-hidden="true"></div>
    `;
    stage.appendChild(scene);
    shell = {
      scene,
      glyphs: scene.querySelector('.void-glyphs'),
      main: scene.querySelector('.void-main'),
      echo: scene.querySelector('.void-echo'),
      choice: scene.querySelector('.void-choice'),
      run: scene.querySelector('.void-run'),
      status: scene.querySelector('.void-status')
    };
    const glyphs = ['TRUE','FALSE','0','1','0/1','T/F','NULL','NaN','self == self','self != self','∅','∞','=','≠','¬','∃','∄','?','real?','exist?','am i?','who are you?','what are you?','are you?'];
    glyphs.concat(glyphs.slice(0, 18)).forEach((text, i) => {
      const span = document.createElement('span');
      span.textContent = text;
      span.style.left = `${7 + ((i * 17) % 86)}%`;
      span.style.top = `${8 + ((i * 23) % 84)}%`;
      span.style.transform = `translate(-50%,-50%) rotate(${(i % 2 ? -1 : 1) * (4 + i % 10)}deg)`;
      shell.glyphs.appendChild(span);
    });
    shell.choice.addEventListener('pointerup', onChoice, { passive: false });
    shell.run.addEventListener('pointerup', onRun, { passive: false });
    return shell;
  }

  function flash(main = '', echo = '', kind = 'impact', duration = 108) {
    makeShell();
    flashToken += 1;
    const token = flashToken;
    shell.main.textContent = main;
    shell.echo.textContent = echo;
    stage.classList.remove('void-hit-slow','void-hit-fast','void-hit-collision','void-hit-title','void-hit-final','void-hit-secondary');
    stage.classList.add('void-lit', `void-hit-${kind}`);
    setFact('voidHit', `${kind}:${main || echo || 'glyph'}`);
    setTimeout(() => {
      if (token !== flashToken) return;
      stage.classList.remove('void-lit','void-hit-slow','void-hit-fast','void-hit-collision','void-hit-title','void-hit-final','void-hit-secondary');
      shell.main.textContent = '';
      shell.echo.textContent = '';
    }, duration);
  }

  function setPrompt(text, next) {
    makeShell();
    state = next;
    shell.choice.textContent = text;
    shell.choice.hidden = false;
    shell.run.hidden = true;
    setFact('voidGate', next);
  }

  function clearAll() {
    timers.forEach(clearTimeout);
    timers = [];
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    cueState = null;
  }

  function later(ms, fn) {
    const t = setTimeout(fn, ms);
    timers.push(t);
  }

  function phase(name) {
    stage.classList.remove('void-entry','void-fracture','void-bloom','void-converge','void-stare');
    stage.classList.add(`void-${name}`);
    setFact('voidPhase', name);
  }

  function fallbackCueMap() {
    const slow = FALLBACK_SLOW_CUES.slice();
    const fast = [];
    for (let t = 4.0; t <= 28.4; t += FAST_STEP) fast.push(Number(t.toFixed(2)));
    return { source: 'fallback', slow, fast, duration: TUNNEL_SECONDS };
  }

  function findPeaks(envelope, hopSeconds) {
    if (envelope.length < 4) return [];
    const sorted = envelope.slice().sort((a, b) => a - b);
    const floor = sorted[Math.floor(sorted.length * 0.68)] || 0;
    const ceiling = sorted[Math.floor(sorted.length * 0.92)] || floor;
    const threshold = floor + Math.max(0.006, (ceiling - floor) * 0.46);
    const candidates = [];
    for (let i = 2; i < envelope.length - 2; i += 1) {
      const v = envelope[i];
      if (v < threshold) continue;
      if (v <= envelope[i - 1] || v <= envelope[i + 1]) continue;
      const rise = v - Math.min(envelope[i - 1], envelope[i - 2]);
      if (rise < 0.004) continue;
      candidates.push({ time: Number((i * hopSeconds).toFixed(3)), value: v, rise });
    }
    candidates.sort((a, b) => (b.value + b.rise * 0.9) - (a.value + a.rise * 0.9));
    const picked = [];
    for (const item of candidates) {
      if (item.time < 0.22 || item.time > 29.4) continue;
      if (picked.some(p => Math.abs(p.time - item.time) < 0.42)) continue;
      picked.push(item);
      if (picked.length >= 28) break;
    }
    return picked.sort((a, b) => a.time - b.time).map(p => p.time);
  }

  async function analyzeAudioCues() {
    if (cueMapPromise) return cueMapPromise;
    cueMapPromise = (async () => {
      try {
        const response = await fetch(`${AUDIO_SRC}?analysis=${CACHE}`, { cache: 'force-cache' });
        const buffer = await response.arrayBuffer();
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) throw new Error('no-audio-context');
        const ctx = new Ctx();
        const decoded = await ctx.decodeAudioData(buffer.slice(0));
        try { await ctx.close(); } catch (_) {}
        const sr = decoded.sampleRate;
        const channel = decoded.getChannelData(0);
        const maxSamples = Math.min(channel.length, Math.floor(sr * 32));
        const hop = Math.max(256, Math.floor(sr * 0.055));
        const windowSize = Math.max(hop * 2, Math.floor(sr * 0.120));
        const envelope = [];
        for (let start = 0; start + windowSize < maxSamples; start += hop) {
          let sum = 0;
          for (let i = start; i < start + windowSize; i += 96) {
            const v = channel[i] || 0;
            sum += v * v;
          }
          envelope.push(Math.sqrt(sum / Math.max(1, Math.floor(windowSize / 96))));
        }
        let slow = findPeaks(envelope, hop / sr);
        if (slow.length < 12) slow = FALLBACK_SLOW_CUES.slice();
        const fast = [];
        const startFast = Math.max(3.3, slow.find(t => t >= 3.6) || 4.0);
        for (let t = startFast; t <= 28.6; t += FAST_STEP) {
          const rounded = Number(t.toFixed(2));
          if (!slow.some(s => Math.abs(s - rounded) < 0.10)) fast.push(rounded);
        }
        const map = { source: 'decoded', slow, fast, duration: TUNNEL_SECONDS };
        setFact('voidCueSource', 'decoded');
        setFact('voidCueSlowCount', slow.length);
        setFact('voidCueFastCount', fast.length);
        cueMap = map;
        return map;
      } catch (err) {
        setFact('voidCueSource', `fallback:${err?.message || err?.name || 'unknown'}`);
        cueMap = fallbackCueMap();
        return cueMap;
      }
    })();
    return cueMapPromise;
  }

  function slowPair(index) {
    const words = [
      ['What am I?',''], ['','TRUE/FALSE'], ['','0/1'], ['THE VOID',''],
      ['What am I?','what are you?'], ['','NULL'], ['','NaN'], ['THE VOID',''],
      ['Am I?','are you?'], ['','self != self'], ['Am I?','do you exist?'], ['','∅'],
      ['THE VOID',''], ['Am I?','are you real?'], ['','what is real?'], ['THE VOID',''],
      ['THE VOID',''], ['','self == self'], ['THE VOID',''], ['','self != self'],
      ['THE VOID',''], ['','0/1'], ['THE VOID',''], ['','TRUE/FALSE'],
      ['THE VOID',''], ['STARES BACK',''], ['THE VOID','STARES BACK']
    ];
    return words[Math.min(index, words.length - 1)];
  }

  function fastPair(index) {
    const words = [
      ['','who are you?'], ['','what are you?'], ['are you?','0/1'], ['','do you exist?'],
      ['','are you real?'], ['Am I?','what is real?'], ['','NULL'], ['','NaN'],
      ['Am I?','are you?'], ['','real?'], ['','exist?'], ['','am i?'],
      ['Am I?','self != self'], ['','∃'], ['','∄'], ['THE VOID','?'],
      ['','FALSE'], ['','TRUE'], ['THE VOID','0/1'], ['','¬'],
      ['THE VOID','≠'], ['','∅'], ['THE VOID',''], ['STARES BACK','']
    ];
    return words[index % words.length];
  }

  function startCueEngine(map) {
    const a = makeAudio();
    const startAt = performance.now() / 1000;
    cueState = {
      map: map || fallbackCueMap(),
      slowIndex: 0,
      fastIndex: 0,
      startedAt: startAt,
      lastKind: '',
      lastAt: -1
    };
    const tick = () => {
      if (!cueState || state !== 'running') return;
      const now = performance.now() / 1000;
      const elapsed = Number.isFinite(a.currentTime) && a.currentTime > 0.03 ? a.currentTime : now - cueState.startedAt;
      if (elapsed >= TUNNEL_SECONDS) {
        showRun();
        return;
      }
      while (cueState.slowIndex < cueState.map.slow.length && elapsed >= cueState.map.slow[cueState.slowIndex]) {
        const i = cueState.slowIndex;
        const pair = slowPair(i);
        const isTitle = elapsed >= 24.4 || i >= cueState.map.slow.length - 3;
        flash(pair[0], pair[1], isTitle ? 'title' : 'slow', isTitle ? 155 : 95);
        cueState.lastKind = 'slow';
        cueState.lastAt = elapsed;
        cueState.slowIndex += 1;
      }
      while (cueState.fastIndex < cueState.map.fast.length && elapsed >= cueState.map.fast[cueState.fastIndex]) {
        if (elapsed >= 4.0 && elapsed <= 28.5) {
          const nearSlow = cueState.map.slow.some(t => Math.abs(t - elapsed) < 0.085);
          const pair = fastPair(cueState.fastIndex);
          flash(pair[0], pair[1], nearSlow ? 'collision' : 'secondary', nearSlow ? 92 : 48);
        }
        cueState.fastIndex += 1;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
  }

  function beginTunnel() {
    makeShell();
    clearAll();
    state = 'running';
    shell.choice.hidden = true;
    shell.run.hidden = true;
    stage.classList.remove('void-ready','void-run-ready','void-cut');
    stage.classList.add('void-running');
    phase('entry');
    setFact('voidRough', 'running-audio-cued');
    buzz([12, 38, 18]);
    const readyMap = cueMap || fallbackCueMap();
    startCueEngine(readyMap);
    analyzeAudioCues().then(map => {
      if (state !== 'running' || !cueState) return;
      if (map.source !== cueState.map.source) {
        cueState.map = map;
        setFact('voidCueSwap', map.source);
      }
    });
    later(4000, () => { phase('fracture'); stage.classList.add('void-poly'); setFact('voidPulseStart', 'first-returned-gaze'); });
    later(10000, () => phase('bloom'));
    later(20000, () => phase('converge'));
    later(27000, () => phase('stare'));
    later(30500, showRun);
  }

  function showRun() {
    clearAll();
    stage.classList.remove('void-running','void-poly','void-entry','void-fracture','void-bloom','void-converge','void-stare','void-lit','void-hit-slow','void-hit-fast','void-hit-collision','void-hit-title','void-hit-secondary');
    stage.classList.add('void-run-ready');
    shell.main.textContent = '';
    shell.echo.textContent = '';
    shell.choice.hidden = true;
    shell.run.hidden = false;
    state = 'run';
    setFact('voidRough', 'run-ready');
  }

  function onChoice(event) {
    event.preventDefault();
    event.stopPropagation();
    if (state === 'want-sound') {
      shell.choice.hidden = true;
      playAudio();
      analyzeAudioCues();
      flash('Who am I?', 'who are you?', 'collision', 180);
      buzz([10, 32, 12]);
      setTimeout(() => setPrompt('i’m going further', 'going-further'), 1250);
    } else if (state === 'going-further') {
      beginTunnel();
    }
  }

  function onRun(event) {
    event.preventDefault();
    event.stopPropagation();
    if (state !== 'run') return;
    shell.run.hidden = true;
    flash('Are you?', '', 'final', 230);
    buzz([20, 40, 20]);
    setFact('voidRough', 'cut');
    setTimeout(() => {
      stage.classList.add('void-cut');
      shell.main.textContent = '';
      shell.echo.textContent = '';
      state = 'cut';
    }, 340);
  }

  function startBlackArrival() {
    if (started) return;
    started = true;
    makeStage();
    stage.hidden = false;
    stage.classList.add('void-active');
    document.documentElement.classList.add('presence-clean-leaving');
    setFact('voidRough', 'black-arrival');
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('leaving')));
    setTimeout(() => {
      setFact('currentPage', String(voidIndex()));
      document.documentElement.classList.add('presence-clean-settled');
      stage.classList.add('settled');
      makeShell();
      setPrompt('i want sound', 'want-sound');
    }, 3400);
  }

  function activeClosingPage() {
    const htmlPage = document.documentElement.dataset.bookPage;
    const page = document.querySelector('.foreword-closing-page.is-current');
    if (!page) return null;
    if (currentPage() !== closingIndex()) return null;
    if (htmlPage !== String(closingIndex())) return null;
    const rect = page.getBoundingClientRect();
    if (!rect || rect.width < 40 || rect.height < 80) return null;
    return page;
  }

  function inSealZone(event, closing) {
    const seal = closing.querySelector('.author-seal-wrap, .author-seal, .closing-card');
    const rect = seal?.getBoundingClientRect?.();
    if (!rect || rect.width < 10 || rect.height < 10) return false;
    const padX = Math.max(84, innerWidth * 0.13);
    const padY = Math.max(84, innerHeight * 0.10);
    return event.clientX >= rect.left - padX &&
      event.clientX <= rect.right + padX &&
      event.clientY >= rect.top - padY &&
      event.clientY <= rect.bottom + padY;
  }

  function shouldCatch(event) {
    if (started || state !== 'sleeping') return false;
    const closing = activeClosingPage();
    if (!closing) {
      setFact('voidGateCheck', 'not-current-closing');
      return false;
    }
    if (!inSealZone(event, closing)) {
      setFact('voidGateCheck', 'outside-seal-zone');
      return false;
    }
    setFact('voidGateCheck', 'seal-zone');
    return true;
  }

  function catchDown(event) {
    if (!shouldCatch(event)) return;
    down = { x: event.clientX, y: event.clientY, t: performance.now() };
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function catchUp(event) {
    if (!down || !shouldCatch(event)) return;
    const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
    const age = performance.now() - down.t;
    const tap = moved <= 18 && age <= 820;
    down = null;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!tap) return;
    if (!refused) {
      document.querySelector('.foreword-closing-page')?.classList.add('v227-refused');
      notYet(event);
      buzz(10);
      refused = true;
      unlockAt = performance.now() + 1125;
      setFact('sealRefusal', 'shown-v228');
      return;
    }
    if (performance.now() < unlockAt) {
      notYet(event);
      return;
    }
    startBlackArrival();
  }

  function boot() {
    mark();
    makeAudio();
    document.addEventListener('pointerdown', catchDown, { capture: true, passive: false });
    document.addEventListener('pointerup', catchUp, { capture: true, passive: false });
    setTimeout(mark, 300);
    setTimeout(mark, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
