(() => {
  const BUILD = 'BOOK FOREWORD v2.3.1 TEXT BACKLIGHT PASS';
  const CACHE = 'book-foreword-v231-text-backlight-phone';
  const AUDIO_SRC = './assets/audio/the_weight_of_infinite_stone.mp3';

  const VOID_TUNING = {
    durationSeconds: 40,
    roomRevealMs: 620,
    localPulseMs: 92,
    backlightEveryMs: 220,
    impactHoldMs: 150,
    questionZ: -4.2,
    glowZ: -4.55,
    spillZ: -5.15,
    voidZ: -17.5,
    glyphZNear: -6.4,
    glyphZFar: -14,
    glyphDensity: 0.42,
    glyphCount: 52,
    glyphScale: 0.62,
    debugFrame: new URLSearchParams(location.search).get('frame') === '1'
  };

  const facts = () => document.getElementById('render-facts');
  const pageCount = () => Number(facts()?.dataset.pageCount || 21);
  const currentPage = () => Number(facts()?.dataset.currentPage || 0);
  const closingIndex = () => pageCount() - 2;
  const voidIndex = () => pageCount() - 1;
  const setFact = (name, value) => { const el = facts(); if (el) el.dataset[name] = String(value); };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

  let down = null;
  let refused = false;
  let unlockAt = 0;
  let started = false;
  let stage = null;
  let shell = null;
  let state = 'sleeping';
  let audio = null;
  let cueMap = null;
  let THREE = null;
  let three = null;
  let token = 0;
  let timers = [];

  function mark() {
    const marker = document.querySelector('.build-marker');
    if (marker) { marker.dataset.build = BUILD; marker.textContent = BUILD; }
    setFact('build', BUILD);
    setFact('cache', CACHE);
    setFact('voidRough', 'text-shaped-backlight');
    setFact('voidDuration', `${VOID_TUNING.durationSeconds}s`);
    setFact('voidTextColor', 'black-100-hard');
    setFact('voidActTitle', 'ACT I / THE VOID');
  }

  function buzz(pattern) { try { if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (_) {} }

  function makeAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'void-audio-v231';
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
      if (p?.then) p.then(() => setFact('voidAudioV231', 'playing')).catch(err => setFact('voidAudioV231', `blocked:${err?.name || 'unknown'}`));
    } catch (err) { setFact('voidAudioV231', `error:${err?.name || 'unknown'}`); }
  }

  function fallbackCueMap(source = 'fallback') {
    const slow = [0.0, .92, 1.84, 2.76, 3.68, 4.58, 5.48, 6.38, 7.30, 8.24, 9.18, 10.10, 11.04, 12.0, 12.94, 13.9, 14.84, 15.8, 16.78, 17.74, 18.72, 19.68, 20.66, 21.64, 22.62, 23.6, 24.62, 25.64, 26.66, 27.7, 28.72, 29.76, 30.8, 31.86, 32.94, 34.0, 35.1, 36.18, 37.26, 38.36, 39.22];
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
    stage.className = 'presence-clean-stage void-rough-stage void-three-stage void-backlight-stage';
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
    scene.className = 'void-backlight-shell';
    scene.innerHTML = `
      <div class="void-backlight-mount" aria-hidden="true"></div>
      <button class="void-backlight-choice" type="button"></button>
      <button class="void-backlight-run" type="button" hidden>run</button>
      <div class="void-backlight-titleflash" aria-hidden="true"><span>ACT I</span><strong>THE VOID</strong></div>
      <div class="void-backlight-status" aria-hidden="true"></div>
    `;
    stage.appendChild(scene);
    shell = {
      scene,
      mount: scene.querySelector('.void-backlight-mount'),
      choice: scene.querySelector('.void-backlight-choice'),
      run: scene.querySelector('.void-backlight-run'),
      titleflash: scene.querySelector('.void-backlight-titleflash'),
      status: scene.querySelector('.void-backlight-status')
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

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function makeBlackTexture(text, opts = {}) {
    const canvas = document.createElement('canvas');
    const w = opts.w || 2048;
    const h = opts.h || 512;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${opts.weight || 900} ${opts.size || 210}px ${opts.family || 'Anton, Impact, Arial Black, sans-serif'}`;
    ctx.fillText(text, w / 2, h / 2 + (opts.dy || 0));
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function makeGlowTexture(text, opts = {}) {
    const canvas = document.createElement('canvas');
    const w = opts.w || 2048;
    const h = opts.h || 512;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${opts.weight || 900} ${opts.size || 210}px ${opts.family || 'Anton, Impact, Arial Black, sans-serif'}`;
    ctx.shadowColor = 'rgba(238,246,255,0.98)';
    ctx.shadowBlur = opts.blur || 42;
    ctx.fillStyle = opts.fill || 'rgba(245,250,255,0.96)';
    ctx.fillText(text, w / 2, h / 2 + (opts.dy || 0));
    ctx.shadowBlur = opts.blur2 || 16;
    ctx.fillText(text, w / 2, h / 2 + (opts.dy || 0));
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function makePlane(texture, opts = {}) {
    const geom = new THREE.PlaneGeometry(opts.w || 18, opts.h || 4.4);
    const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: opts.opacity ?? 1, depthTest: false, depthWrite: false, color: opts.color ?? 0xffffff });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.renderOrder = opts.order || 10;
    mesh.position.set(opts.x || 0, opts.y || 0, opts.z || -10);
    mesh.visible = opts.visible ?? true;
    return mesh;
  }

  function replaceTexture(mesh, texture) {
    const old = mesh.material.map;
    mesh.material.map = texture;
    mesh.material.needsUpdate = true;
    if (old) old.dispose?.();
  }

  function replaceQuestion(ctx, text) {
    if (ctx.currentQuestion === text) return;
    replaceTexture(ctx.questionBlack, makeBlackTexture(text, { size: 232, w: 2048, h: 512 }));
    replaceTexture(ctx.questionGlow, makeGlowTexture(text, { size: 232, w: 2048, h: 512, blur: 54, blur2: 22 }));
    ctx.currentQuestion = text;
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
    try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); }
    catch (err) { createFallbackScene(err?.name || 'import'); throw err; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 200);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -18);

    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' }); }
    catch (err) { createFallbackScene(err?.name || 'renderer'); throw err; }
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight);
    shell.mount.replaceChildren(renderer.domElement);

    const fullLight = new THREE.Mesh(new THREE.PlaneGeometry(90, 54), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    fullLight.position.set(0, 0, -42); fullLight.renderOrder = 1; scene.add(fullLight);

    const spillLight = new THREE.Mesh(new THREE.PlaneGeometry(22, 8.2), new THREE.MeshBasicMaterial({ color: 0eef6ff, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    spillLight.position.set(0, 0, VOID_TUNING.spillZ); spillLight.renderOrder = 4; scene.add(spillLight);

    const voidText = makePlane(makeBlackTexture('THE VOID', { size: 244, w: 2048, h: 512 }), { w: 48, h: 10.0, z: VOID_TUNING.voidZ, order: 5, visible: true });
    scene.add(voidText);

    const stares = makePlane(makeBlackTexture('STARES BACK', { size: 154, w: 2048, h: 360 }), { w: 17, h: 2.8, y: -4.2, z: VOID_TUNING.voidZ + .4, order: 6, visible: false });
    scene.add(stares);

    const questionGlow = makePlane(makeGlowTexture('WHO AM I?', { size: 232, w: 2048, h: 512, blur: 54, blur2: 22 }), { w: 18.5, h: 4.7, z: VOID_TUNING.glowZ, order: 11, opacity: 0, visible: true });
    scene.add(questionGlow);

    const questionBlack = makePlane(makeBlackTexture('WHO AM I?', { size: 232, w: 2048, h: 512 }), { w: 18.5, h: 4.7, z: VOID_TUNING.questionZ, order: 12, opacity: 1, visible: false });
    scene.add(questionBlack);

    const echo = makePlane(makeBlackTexture('who are you?', { size: 105, w: 1200, h: 220, family: 'IBM Plex Mono, Menlo, monospace', weight: 700 }), { w: 7.4, h: 1.1, x: 0, y: -2.8, z: VOID_TUNING.questionZ - .08, order: 13, visible: false });
    scene.add(echo);

    const glyphWords = ['∅','∃','∄','¬','=','≠','0/1','T/F','NULL','NaN','self==self','self!=self','?','real?','exist?'];
    const glyphs = [];
    let seed = 23;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const count = Math.round(VOID_TUNING.glyphCount * VOID_TUNING.glyphDensity);
    for (let i = 0; i < count; i += 1) {
      const side = rand() > .5 ? 1 : -1;
      const x = side * lerp(4.8, 8.2, rand());
      const y = lerp(-5.6, 5.6, rand());
      const z = lerp(VOID_TUNING.glyphZNear, VOID_TUNING.glyphZFar, rand());
      const g = makePlane(makeBlackTexture(glyphWords[i % glyphWords.length], { size: 64, w: 700, h: 180, family: 'IBM Plex Mono, Menlo, monospace', weight: 700 }), {
        w: 2.1 * VOID_TUNING.glyphScale,
        h: .56 * VOID_TUNING.glyphScale,
        x, y, z,
        order: 14,
        visible: false
      });
      glyphs.push(g); scene.add(g);
    }

    const debug = [];
    if (VOID_TUNING.debugFrame) {
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55, depthTest: false });
      const pts = [new THREE.Vector3(-8.5, -5.3, -3.2), new THREE.Vector3(8.5, -5.3, -3.2), new THREE.Vector3(8.5, 5.3, -3.2), new THREE.Vector3(-8.5, 5.3, -3.2), new THREE.Vector3(-8.5, -5.3, -3.2)];
      const frame = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat);
      frame.renderOrder = 99; scene.add(frame); debug.push(frame);
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
      if (renderer) { renderer.setAnimationLoop(null); renderer.dispose(); renderer.domElement.remove(); }
      scene.traverse(obj => {
        obj.geometry?.dispose?.();
        const mats = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
        mats.forEach(mat => { mat.map?.dispose?.(); mat.dispose?.(); });
      });
    };

    three = { scene, camera, renderer, dispose, fullLight, spillLight, voidText, stares, questionGlow, questionBlack, echo, glyphs, debug, cueIndex: 0, impactAt: -99, localAt: -99, currentQuestion: '' };
    setFact('voidThree', 'ready-text-backlight');
    renderer.render(scene, camera);
    return three;
  }

  function chooseQuestion(elapsed) {
    if (elapsed < 12) return ['WHO AM I?', 'who are you?'];
    if (elapsed < 26) return ['WHAT AM I?', 'what are you?'];
    return ['AM I?', 'are you?'];
  }

  function renderRoomReveal(ctx, ms = VOID_TUNING.roomRevealMs) {
    token += 1;
    const local = token;
    const start = performance.now();
    ctx.fullLight.material.opacity = 0;
    ctx.spillLight.material.opacity = 0;
    ctx.voidText.visible = true;
    ctx.stares.visible = true;
    ctx.questionBlack.visible = true;
    ctx.echo.visible = true;
    ctx.glyphs.forEach(g => { g.visible = true; });
    replaceQuestion(ctx, 'WHO AM I?');
    const loop = () => {
      if (local !== token || !three) return;
      const t = clamp((performance.now() - start) / ms, 0, 1);
      const a = 1 - easeOut(t);
      ctx.fullLight.material.opacity = a;
      ctx.spillLight.material.opacity = a * .55;
      ctx.questionGlow.material.opacity = a * .92;
      ctx.renderer.render(ctx.scene, ctx.camera);
      if (t < 1) requestAnimationFrame(loop);
      else {
        ctx.fullLight.material.opacity = 0;
        ctx.spillLight.material.opacity = 0;
        ctx.questionGlow.material.opacity = 0;
        ctx.stares.visible = false;
        ctx.questionBlack.visible = false;
        ctx.echo.visible = false;
        ctx.glyphs.forEach(g => { g.visible = false; });
        ctx.renderer.render(ctx.scene, ctx.camera);
      }
    };
    loop();
  }

  function beginThreeTunnel() {
    makeShell();
    state = 'running';
    shell.choice.hidden = true;
    shell.run.hidden = true;
    shell.titleflash.classList.remove('seen');
    stage.classList.add('void-backlight-running');
    setFact('voidRough', 'text-backlight-running');
    buzz([12, 38, 18]);
    Promise.all([buildThreeScene(), analyzeAudioCues()]).then(([ctx, map]) => {
      const startedAt = performance.now() / 1000;
      const a = makeAudio();
      token += 1;
      const local = token;
      ctx.cueIndex = 0;
      ctx.impactAt = -99;
      ctx.localAt = -99;
      const step = () => {
        if (local !== token || state !== 'running') return;
        const now = performance.now() / 1000;
        const elapsed = Number.isFinite(a.currentTime) && a.currentTime > 0.03 ? a.currentTime : now - startedAt;
        if (elapsed >= VOID_TUNING.durationSeconds) { showRun(); return; }
        while (ctx.cueIndex < map.slow.length && elapsed >= map.slow[ctx.cueIndex]) {
          ctx.impactAt = elapsed;
          ctx.localAt = elapsed;
          ctx.cueIndex += 1;
        }
        if (elapsed > 1.4) {
          const period = VOID_TUNING.backlightEveryMs / 1000;
          const phase = (elapsed - 1.4) % period;
          if (phase < 0.026) ctx.localAt = elapsed;
        }
        const q = chooseQuestion(elapsed);
        replaceQuestion(ctx, q[0]);
        const echoText = q[1];
        const echoMapText = ctx.echo.userData?.text;
        if (echoMapText !== echoText) {
          replaceTexture(ctx.echo, makeBlackTexture(echoText, { size: 105, w: 1200, h: 220, family: 'IBM Plex Mono, Menlo, monospace', weight: 700 }));
          ctx.echo.userData.text = echoText;
        }
        const localAge = elapsed - ctx.localAt;
        const impactAge = elapsed - ctx.impactAt;
        const localAlpha = localAge >= 0 && localAge < VOID_TUNING.localPulseMs / 1000 ? 1 - localAge / (VOID_TUNING.localPulseMs / 1000) : 0;
        const impactAlpha = impactAge >= 0 && impactAge < VOID_TUNING.impactHoldMs / 1000 ? 1 - impactAge / (VOID_TUNING.impactHoldMs / 1000) : 0;
        const pulse = clamp(Math.max(localAlpha, impactAlpha), 0, 1);
        const p = clamp(elapsed / VOID_TUNING.durationSeconds, 0, 1);
        ctx.fullLight.material.opacity = 0;
        ctx.spillLight.material.opacity = pulse * .42;
        ctx.questionGlow.material.opacity = pulse * .95;
        ctx.questionBlack.visible = pulse > .04;
        ctx.echo.visible = pulse > .38 || impactAlpha > .25;
        ctx.voidText.visible = true;
        ctx.stares.visible = p > .62 && pulse > .22;
        ctx.voidText.scale.setScalar(1.0 + p * .05);
        ctx.stares.scale.setScalar(1.0 + p * .035);
        ctx.questionBlack.scale.setScalar(1.0 + impactAlpha * .045);
        ctx.questionGlow.scale.setScalar(1.0 + pulse * .08);
        ctx.spillLight.scale.set(1.0 + pulse * .18, 1.0 + pulse * .10, 1);
        ctx.glyphs.forEach((g, i) => {
          const edge = (i % 2 ? pulse : impactAlpha);
          g.visible = edge > .32 || (p > .68 && pulse > .18);
        });
        ctx.renderer.render(ctx.scene, ctx.camera);
        requestAnimationFrame(step);
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
    stage.classList.remove('void-backlight-running');
    stage.classList.add('void-backlight-run-ready');
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
      buildThreeScene().then(ctx => renderRoomReveal(ctx)).catch(() => null);
      const t = setTimeout(() => setPrompt('i’m going further', 'going-further'), 1160);
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
      stage.classList.add('void-backlight-cut');
      three?.dispose?.();
      setFact('voidRough', 'cut');
    }, 1250);
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
      document.querySelector('.foreword-closing-page')?.classList.add('v231-refused');
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
    setFact('voidThreeGate', 'armed-text-backlight');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();