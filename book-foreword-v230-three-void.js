(() => {
  const BUILD = 'BOOK FOREWORD v2.3.0 THREE VOID PROTOTYPE';
  const CACHE = 'book-foreword-v230-three-void-phone';
  const AUDIO_SRC = './assets/audio/the_weight_of_infinite_stone.mp3';

  const VOID_TUNING = {
    durationSeconds: 40,
    primaryPulseMs: 72,
    secondaryPulseMs: 44,
    collisionPulseMs: 98,
    secondaryEveryMs: 180,
    secondaryBurstEveryMs: 900,
    secondaryBurstCount: 3,
    secondaryBurstGapMs: 95,
    voidStartZ: -36,
    voidEndZ: -7.2,
    voidStartScale: 1.0,
    voidEndScale: 1.12,
    questionZ: -4.6,
    secondaryZ: -5.4,
    glyphDensity: 0.35,
    glyphCount: 44,
    glyphScale: 0.62
  };

  const facts = () => document.getElementById('render-facts');
  const pageCount = () => Number(facts()?.dataset.pageCount || 21);
  const currentPage = () => Number(facts()?.dataset.currentPage || 0);
  const closingIndex = () => pageCount() - 2;
  const voidIndex = () => pageCount() - 1;
  const setFact = (name, value) => { const el = facts(); if (el) el.dataset[name] = String(value); };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);

  let down = null;
  let refused = false;
  let unlockAt = 0;
  let started = false;
  let stage = null;
  let shell = null;
  let state = 'sleeping';
  let audio = null;
  let cueMap = null;
  let three = null;
  let token = 0;
  let timers = [];

  function mark() {
    const marker = document.querySelector('.build-marker');
    if (marker) { marker.dataset.build = BUILD; marker.textContent = BUILD; }
    setFact('build', BUILD);
    setFact('cache', CACHE);
    setFact('voidRough', 'three-prototype');
    setFact('voidDuration', `${VOID_TUNING.durationSeconds}s`);
    setFact('voidTextColor', 'black-100');
    setFact('voidActTitle', 'ACT I / THE VOID');
  }

  function buzz(pattern) {
    try { if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (_) {}
  }

  function makeAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'void-audio-v230';
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
      if (p?.then) p.then(() => setFact('voidAudioV230', 'playing')).catch(err => setFact('voidAudioV230', `blocked:${err?.name || 'unknown'}`));
    } catch (err) {
      setFact('voidAudioV230', `error:${err?.name || 'unknown'}`);
    }
  }

  function fallbackCueMap(source = 'fallback') {
    const slow = [0.0, .9, 1.8, 2.75, 3.65, 4.55, 5.45, 6.35, 7.3, 8.25, 9.15, 10.05, 11.0, 12.0, 13.0, 14.05, 15.0, 16.0, 17.1, 18.15, 19.2, 20.25, 21.3, 22.35, 23.45, 24.55, 25.7, 26.85, 28.05, 29.25, 30.5, 31.75, 33.0, 34.25, 35.5, 36.75, 38.0, 39.05];
    return { source, slow: slow.filter(t => t < VOID_TUNING.durationSeconds - .2) };
  }

  function analyzeAudioCues() {
    if (cueMap) return Promise.resolve(cueMap);
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) { cueMap = fallbackCueMap('fallback-no-context'); return Promise.resolve(cueMap); }
    return fetch(`${AUDIO_SRC}?v=${CACHE}`)
      .then(res => res.arrayBuffer())
      .then(buffer => new Ctx().decodeAudioData(buffer))
      .then(decoded => {
        const channel = decoded.getChannelData(0);
        const sampleRate = decoded.sampleRate;
        const hop = Math.max(1024, Math.floor(sampleRate * 0.055));
        const maxTime = Math.min(VOID_TUNING.durationSeconds, decoded.duration || VOID_TUNING.durationSeconds);
        const bins = [];
        for (let i = 0; i < channel.length && i / sampleRate < maxTime; i += hop) {
          let sum = 0;
          for (let j = i; j < Math.min(channel.length, i + hop); j += 1) sum += channel[j] * channel[j];
          bins.push({ t: i / sampleRate, e: Math.sqrt(sum / hop) });
        }
        const sorted = bins.map(b => b.e).sort((a, b) => a - b);
        const mid = sorted[Math.floor(sorted.length * 0.55)] || 0;
        const high = sorted[Math.floor(sorted.length * 0.86)] || mid;
        const threshold = mid + (high - mid) * 0.55;
        const slow = [];
        let last = -1;
        bins.forEach((b, i) => {
          const prev = bins[i - 1]?.e || 0;
          const next = bins[i + 1]?.e || 0;
          if (b.e >= threshold && b.e >= prev && b.e >= next && b.t - last > 0.42) {
            slow.push(Number(b.t.toFixed(3)));
            last = b.t;
          }
        });
        cueMap = { source: slow.length > 12 ? 'decoded-peaks' : 'fallback-too-few-peaks', slow: slow.length > 12 ? slow : fallbackCueMap().slow };
        setFact('voidCueMap', `${cueMap.source}:${cueMap.slow.length}`);
        return cueMap;
      })
      .catch(err => {
        cueMap = fallbackCueMap(`fallback-${err?.name || 'decode'}`);
        setFact('voidCueMap', cueMap.source);
        return cueMap;
      });
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
    stage.className = 'presence-clean-stage void-rough-stage void-three-stage';
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
    scene.className = 'void-three-shell';
    scene.innerHTML = `
      <div class="void-three-mount" aria-hidden="true"></div>
      <button class="void-three-choice" type="button"></button>
      <button class="void-three-run" type="button" hidden>run</button>
      <div class="void-three-titleflash" aria-hidden="true"><span>ACT I</span><strong>THE VOID</strong></div>
      <div class="void-three-status" aria-hidden="true"></div>
    `;
    stage.appendChild(scene);
    shell = {
      scene,
      mount: scene.querySelector('.void-three-mount'),
      choice: scene.querySelector('.void-three-choice'),
      run: scene.querySelector('.void-three-run'),
      titleflash: scene.querySelector('.void-three-titleflash'),
      status: scene.querySelector('.void-three-status')
    };
    shell.choice.addEventListener('pointerup', onChoice, { passive: false });
    shell.run.addEventListener('pointerup', onRun, { passive: false });
    return shell;
  }

  function setPrompt(text, next) {
    makeShell();
    state = next;
    shell.choice.textContent = text;
    shell.choice.hidden = false;
    shell.run.hidden = true;
    setFact('voidGate', next);
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function makeTextTexture(text, opts = {}) {
    const canvas = document.createElement('canvas');
    const w = opts.w || 2048;
    const h = opts.h || 512;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${opts.weight || 900} ${opts.size || 210}px ${opts.family || 'Anton, Impact, Arial Black, sans-serif'}`;
    ctx.fillText(text, w / 2, h / 2 + (opts.dy || 0));
    const texture = new three.Texture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = three.SRGBColorSpace;
    return texture;
  }

  function makeTextPlane(text, opts = {}) {
    const tex = makeTextTexture(text, opts.tex || {});
    const geom = new three.PlaneGeometry(opts.w || 18, opts.h || 4.4);
    const mat = new three.MeshBasicMaterial({ map: tex, transparent: true, opacity: opts.opacity ?? 1, depthTest: false, depthWrite: false, color: 0x000000 });
    const mesh = new three.Mesh(geom, mat);
    mesh.renderOrder = opts.order || 10;
    mesh.position.set(opts.x || 0, opts.y || 0, opts.z || -10);
    return mesh;
  }

  function replacePlaneText(mesh, text, opts = {}) {
    const old = mesh.material.map;
    mesh.material.map = makeTextTexture(text, opts);
    mesh.material.needsUpdate = true;
    if (old) old.dispose();
  }

  function createFallbackScene(reason) {
    setFact('voidThree', `fallback:${reason || 'unknown'}`);
    if (shell?.status) shell.status.textContent = 'webgl fallback';
    showRun();
  }

  async function buildThreeScene() {
    makeShell();
    if (three) return three;
    if (document.fonts?.ready) {
      try { await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 450))]); } catch (_) {}
    }
    try {
      three = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch (err) {
      createFallbackScene(err?.name || 'import');
      throw err;
    }

    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera(44, innerWidth / innerHeight, 0.1, 200);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -20);

    let renderer;
    try {
      renderer = new three.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (err) {
      createFallbackScene(err?.name || 'renderer');
      throw err;
    }
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight);
    shell.mount.replaceChildren(renderer.domElement);

    const lightMat = new three.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, depthTest: false });
    const primaryLight = new three.Mesh(new three.PlaneGeometry(88, 52), lightMat.clone());
    primaryLight.position.set(0, 0, -50);
    primaryLight.renderOrder = 1;
    scene.add(primaryLight);

    const secondaryLight = new three.Mesh(new three.PlaneGeometry(15.5, 5.3), lightMat.clone());
    secondaryLight.position.set(0, 0, VOID_TUNING.secondaryZ);
    secondaryLight.renderOrder = 5;
    scene.add(secondaryLight);

    const voidText = makeTextPlane('THE VOID', { w: 44, h: 9.4, z: VOID_TUNING.voidStartZ, order: 3, tex: { size: 236, w: 2048, h: 512 } });
    scene.add(voidText);

    const stares = makeTextPlane('STARES BACK', { w: 18, h: 3.2, y: -4.2, z: VOID_TUNING.voidStartZ + 1, order: 4, opacity: 0, tex: { size: 178, w: 2048, h: 384 } });
    scene.add(stares);

    const question = makeTextPlane('WHO AM I?', { w: 18, h: 4.4, z: VOID_TUNING.questionZ, order: 12, opacity: 0, tex: { size: 232, w: 2048, h: 512 } });
    scene.add(question);

    const echo = makeTextPlane('who are you?', { w: 7.8, h: 1.1, x: 3.6, y: -2.7, z: VOID_TUNING.questionZ - .15, order: 13, opacity: 0, tex: { size: 112, w: 1200, h: 220, family: 'IBM Plex Mono, Menlo, monospace', weight: 700 } });
    scene.add(echo);

    const glyphWords = ['∅','∃','∄','¬','=','≠','0/1','T/F','NULL','NaN','self==self','self!=self','?','real?','exist?'];
    const glyphs = [];
    let seed = 19;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const count = Math.round(VOID_TUNING.glyphCount * VOID_TUNING.glyphDensity);
    for (let i = 0; i < count; i += 1) {
      const word = glyphWords[i % glyphWords.length];
      const side = rand() > .5 ? 1 : -1;
      const x = side * lerp(5.1, 8.6, rand());
      const y = lerp(-5.8, 5.8, rand());
      const z = lerp(-7, -26, rand());
      const g = makeTextPlane(word, { w: 2.1 * VOID_TUNING.glyphScale, h: .56 * VOID_TUNING.glyphScale, x, y, z, order: 14, opacity: 0, tex: { size: 64, w: 700, h: 180, family: 'IBM Plex Mono, Menlo, monospace', weight: 700 } });
      glyphs.push(g);
      scene.add(g);
    }

    const onResize = () => {
      if (!renderer) return;
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener('resize', onResize, { passive: true });

    const dispose = () => {
      removeEventListener('resize', onResize);
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        renderer.domElement.remove();
      }
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(mat => { mat.map?.dispose?.(); mat.dispose?.(); });
        }
      });
    };

    three = { scene, camera, renderer, dispose, primaryLight, secondaryLight, voidText, stares, question, echo, glyphs, cueIndex: 0, primaryAt: -99, secondaryAt: -99, lastQuestion: '', lastEcho: '' };
    setFact('voidThree', 'ready');
    return three;
  }

  function chooseQuestion(elapsed) {
    if (elapsed < 8) return ['WHO AM I?', 'who are you?'];
    if (elapsed < 20) return ['WHAT AM I?', 'what are you?'];
    if (elapsed < 34) return ['AM I?', 'are you?'];
    return ['AM I?', 'are you?'];
  }

  function updateTextIfNeeded(ctx, main, small) {
    if (ctx.lastQuestion !== main) {
      replacePlaneText(ctx.question, main, { size: 232, w: 2048, h: 512 });
      ctx.lastQuestion = main;
    }
    if (ctx.lastEcho !== small) {
      replacePlaneText(ctx.echo, small, { size: 112, w: 1200, h: 220, family: 'IBM Plex Mono, Menlo, monospace', weight: 700 });
      ctx.lastEcho = small;
    }
  }

  function beginThreeTunnel() {
    makeShell();
    state = 'running';
    shell.choice.hidden = true;
    shell.run.hidden = true;
    shell.titleflash.classList.remove('seen');
    stage.classList.add('void-three-running');
    setFact('voidRough', 'three-running');
    buzz([12, 38, 18]);
    Promise.all([buildThreeScene(), analyzeAudioCues()]).then(([ctx, map]) => {
      const startedAt = performance.now() / 1000;
      const a = makeAudio();
      token += 1;
      const local = token;
      ctx.cueIndex = 0;
      ctx.primaryAt = -99;
      ctx.secondaryAt = -99;
      const step = () => {
        if (local !== token || state !== 'running') return;
        const now = performance.now() / 1000;
        const elapsed = Number.isFinite(a.currentTime) && a.currentTime > 0.03 ? a.currentTime : now - startedAt;
        const p = clamp(elapsed / VOID_TUNING.durationSeconds, 0, 1);
        if (elapsed >= VOID_TUNING.durationSeconds) {
          showRun();
          return;
        }
        while (ctx.cueIndex < map.slow.length && elapsed >= map.slow[ctx.cueIndex]) {
          ctx.primaryAt = elapsed;
          ctx.cueIndex += 1;
        }
        if (elapsed > 3.5) {
          const period = VOID_TUNING.secondaryEveryMs / 1000;
          const phase = (elapsed - 3.5) % period;
          if (phase < 0.025) ctx.secondaryAt = elapsed;
        }

        const q = chooseQuestion(elapsed);
        updateTextIfNeeded(ctx, q[0], q[1]);

        const deep = ease(p);
        ctx.voidText.position.z = lerp(VOID_TUNING.voidStartZ, VOID_TUNING.voidEndZ, deep);
        const s = lerp(VOID_TUNING.voidStartScale, VOID_TUNING.voidEndScale, deep);
        ctx.voidText.scale.set(s, s, 1);
        ctx.stares.position.z = ctx.voidText.position.z + 1.2;
        ctx.stares.scale.set(s * .94, s * .94, 1);
        ctx.stares.material.opacity = clamp((p - .55) / .18, 0, .55);

        const primaryAge = elapsed - ctx.primaryAt;
        const secondaryAge = elapsed - ctx.secondaryAt;
        const primaryAlpha = primaryAge >= 0 && primaryAge < VOID_TUNING.primaryPulseMs / 1000 ? 1 - primaryAge / (VOID_TUNING.primaryPulseMs / 1000) : 0;
        const secondaryAlpha = secondaryAge >= 0 && secondaryAge < VOID_TUNING.secondaryPulseMs / 1000 ? 1 - secondaryAge / (VOID_TUNING.secondaryPulseMs / 1000) : 0;
        const collision = primaryAlpha > .35 && secondaryAlpha > .35;
        ctx.primaryLight.material.opacity = collision ? .98 : primaryAlpha * .86;
        ctx.secondaryLight.material.opacity = collision ? .96 : secondaryAlpha * .88;

        ctx.question.material.opacity = Math.max(primaryAlpha, secondaryAlpha, p > .72 ? .14 : 0);
        ctx.echo.material.opacity = Math.max(secondaryAlpha * .9, p > .50 ? .10 : 0);
        ctx.question.scale.setScalar(collision ? 1.08 : secondaryAlpha > 0 ? 1.035 : 1);
        ctx.secondaryLight.scale.set(collision ? 1.25 : 1, collision ? 1.12 : 1, 1);

        ctx.glyphs.forEach((g, i) => {
          const edge = (i % 3 === 0 ? primaryAlpha : secondaryAlpha) * .58;
          g.material.opacity = Math.max(edge, p > .62 ? .10 : 0);
          g.position.z += 0.006 + p * .012;
          if (g.position.z > -4.2) g.position.z = -24 - (i % 7);
        });

        ctx.renderer.render(ctx.scene, ctx.camera);
        ctx.raf = requestAnimationFrame(step);
      };
      step();
    }).catch(err => {
      setFact('voidThreeError', err?.name || 'unknown');
      createFallbackScene(err?.name || 'unknown');
    });
  }

  function showRun() {
    state = 'run';
    token += 1;
    clearTimers();
    if (three?.renderer) three.renderer.render(three.scene, three.camera);
    stage.classList.remove('void-three-running');
    stage.classList.add('void-three-run-ready');
    shell.choice.hidden = true;
    shell.run.hidden = false;
    setFact('voidRough', 'run-ready');
  }

  function onChoice(event) {
    event.preventDefault();
    event.stopPropagation();
    if (state === 'want-sound') {
      shell.choice.hidden = true;
      playAudio();
      analyzeAudioCues();
      buildThreeScene().catch(() => null);
      const t = setTimeout(() => setPrompt('i’m going further', 'going-further'), 1050);
      timers.push(t);
    } else if (state === 'going-further') {
      beginThreeTunnel();
    }
  }

  function onRun(event) {
    event.preventDefault();
    event.stopPropagation();
    if (state !== 'run') return;
    state = 'cut';
    shell.run.hidden = true;
    shell.titleflash.classList.add('seen');
    setFact('voidRough', 'act-title-flash');
    buzz([18, 38, 18]);
    const t = setTimeout(() => {
      shell.titleflash.classList.remove('seen');
      stage.classList.add('void-three-cut');
      three?.dispose?.();
      setFact('voidRough', 'cut');
    }, 1150);
    timers.push(t);
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
    return event.clientX >= rect.left - padX && event.clientX <= rect.right + padX && event.clientY >= rect.top - padY && event.clientY <= rect.bottom + padY;
  }

  function shouldCatch(event) {
    if (started || state !== 'sleeping') return false;
    const closing = activeClosingPage();
    if (!closing) { setFact('voidGateCheck', 'not-current-closing'); return false; }
    if (!inSealZone(event, closing)) { setFact('voidGateCheck', 'outside-seal-zone'); return false; }
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
      document.querySelector('.foreword-closing-page')?.classList.add('v230-refused');
      notYet(event);
      buzz(10);
      refused = true;
      unlockAt = performance.now() + 340;
      setFact('voidRefusal', 'seen');
      return;
    }
    if (performance.now() < unlockAt) return;
    startBlackArrival();
  }

  function boot() {
    mark();
    makeAudio();
    document.addEventListener('pointerdown', catchDown, { capture: true, passive: false });
    document.addEventListener('pointerup', catchUp, { capture: true, passive: false });
    setFact('voidThreeGate', 'armed');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
