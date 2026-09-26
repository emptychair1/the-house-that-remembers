(() => {
  const BUILD = 'BOOK FOREWORD v2.2.9 VOID PRESENCE PASS';
  const CACHE = 'book-foreword-v229-void-presence-phone';
  const AUDIO_SRC = './assets/audio/the_weight_of_infinite_stone.mp3';
  const TUNNEL_SECONDS = 45;
  const facts = () => document.getElementById('render-facts');
  const pageCount = () => Number(facts()?.dataset.pageCount || 21);
  const currentPage = () => Number(facts()?.dataset.currentPage || 0);
  const closingIndex = () => pageCount() - 2;
  const voidIndex = () => pageCount() - 1;
  const setFact = (name, value) => { const el = facts(); if (el) el.dataset[name] = String(value); };

  let down = null, refused = false, unlockAt = 0, started = false;
  let stage = null, shell = null, state = 'sleeping', audio = null;
  let raf = 0, timers = [], cueMap = null, cueState = null, token = 0;

  const params = new URLSearchParams(location.search);
  const chosenLight = (params.get('light') || 'cold').toLowerCase();
  const light = ['cold', 'neutral', 'warm', 'dirty'].includes(chosenLight) ? chosenLight : 'cold';

  function mark() {
    const marker = document.querySelector('.build-marker');
    if (marker) { marker.dataset.build = BUILD; marker.textContent = BUILD; }
    setFact('build', BUILD);
    setFact('cache', CACHE);
    setFact('voidRough', 'presence-cued');
    setFact('voidDuration', `${TUNNEL_SECONDS}s`);
    setFact('voidLight', light);
    setFact('voidTextColor', 'black-100');
  }

  function buzz(pattern) { try { if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (_) {} }

  function makeAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'void-audio-v229';
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
      if (p?.then) p.then(() => setFact('voidAudioV229', 'playing')).catch(err => setFact('voidAudioV229', `blocked:${err?.name || 'unknown'}`));
    } catch (err) { setFact('voidAudioV229', `error:${err?.name || 'unknown'}`); }
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
        const maxTime = Math.min(TUNNEL_SECONDS, decoded.duration || TUNNEL_SECONDS);
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
          const prev = bins[i - 1]?.e || 0, next = bins[i + 1]?.e || 0;
          if (b.e >= threshold && b.e >= prev && b.e >= next && b.t - last > 0.44) { slow.push(Number(b.t.toFixed(3))); last = b.t; }
        });
        const shaped = shapeSlow(slow);
        cueMap = { source: 'decoded-waveform', slow: shaped, secondary: buildSecondary(shaped), close: buildClose(shaped) };
        setFact('voidCueSource', cueMap.source);
        setFact('voidCueSlowCount', cueMap.slow.length);
        return cueMap;
      })
      .catch(err => { cueMap = fallbackCueMap(err?.name || 'fallback-decode'); return cueMap; });
  }

  function shapeSlow(raw) {
    const base = [0,1.05,2.1,3.15,4.25,5.3,6.35,7.4,8.45,9.5,10.55,11.6,12.65,13.7,14.75,15.8,16.85,17.9,18.95,20,21.05,22.1,23.15,24.2,25.3,26.4,27.5,28.6,29.7,30.8,31.9,33,34.15,35.3,36.45,37.6,38.75,39.9,41.1,42.25,43.25];
    if (!raw || raw.length < 12) return base;
    const merged = raw.filter(t => t <= 43.5);
    base.forEach(t => { if (!merged.some(x => Math.abs(x - t) < 0.24)) merged.push(t); });
    return merged.sort((a,b)=>a-b).filter((t,i,a)=>i===0 || t-a[i-1] > 0.3).slice(0,54);
  }

  function buildSecondary(slow) {
    const out = [];
    for (let t = 4.0; t <= 42.8; t += 0.42) out.push(Number(t.toFixed(3)));
    slow.forEach(t => { if (t >= 4 && t <= 42.8) out.push(Number((t + 0.21).toFixed(3))); });
    return out.sort((a,b)=>a-b).filter((t,i,a)=>i===0 || t-a[i-1] > 0.16);
  }

  function buildClose(slow) { return slow.filter(t => t >= 4 && t <= 42.8).map(t => Number((t + 0.21).toFixed(3))); }
  function fallbackCueMap(reason='fallback') { const slow = shapeSlow([]); return { source: reason, slow, secondary: buildSecondary(slow), close: buildClose(slow) }; }

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
    stage.className = `presence-clean-stage void-rough-stage void-presence-stage void-light-${light}`;
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
    scene.className = 'void-rough-scene void-presence-scene';
    scene.innerHTML = `
      <div class="void-presence-title" aria-hidden="true"><span>THE VOID</span></div>
      <div class="void-presence-stares" aria-hidden="true"><span>STARES BACK</span></div>
      <div class="void-secondary-plane" aria-hidden="true"></div>
      <div class="void-glyphs" aria-hidden="true"></div>
      <div class="void-big-question" aria-hidden="true"></div>
      <div class="void-echo" aria-hidden="true"></div>
      <button class="void-choice" type="button"></button>
      <button class="void-run void-run-side" type="button" hidden>run</button>
      <div class="void-status" aria-hidden="true"></div>`;
    stage.appendChild(scene);
    shell = { scene, glyphs: scene.querySelector('.void-glyphs'), big: scene.querySelector('.void-big-question'), echo: scene.querySelector('.void-echo'), choice: scene.querySelector('.void-choice'), run: scene.querySelector('.void-run'), status: scene.querySelector('.void-status') };
    const glyphs = ['TRUE','FALSE','0','1','0/1','T/F','NULL','NaN','self==self','self!=self','∅','∞','=','≠','¬','∃','∄','?','REAL?','EXIST?','AM I?','WHO ARE YOU?','WHAT ARE YOU?','ARE YOU?'];
    glyphs.concat(glyphs, glyphs.slice(0, 12)).forEach((text, i) => {
      const span = document.createElement('span');
      span.textContent = text;
      span.style.left = `${4 + ((i * 19) % 92)}%`;
      span.style.top = `${5 + ((i * 29) % 90)}%`;
      span.style.transform = `translate(-50%,-50%) rotate(${(i % 2 ? -1 : 1) * (2 + i % 5)}deg)`;
      shell.glyphs.appendChild(span);
    });
    shell.choice.addEventListener('pointerup', onChoice, { passive:false });
    shell.run.addEventListener('pointerup', onRun, { passive:false });
    return shell;
  }

  function clearLight() { if (stage) stage.classList.remove('void-lit-primary','void-lit-secondary','void-lit-close','void-lit-final'); }
  function cue(kind, big='', echo='', duration=74) {
    makeShell(); token += 1; const own = token;
    shell.big.textContent = big; shell.echo.textContent = echo;
    clearLight(); stage.classList.add(`void-lit-${kind}`);
    setFact('voidHit', `${kind}:${big || echo || 'glyph'}`);
    setTimeout(() => { if (own !== token) return; clearLight(); shell.big.textContent=''; shell.echo.textContent=''; }, duration);
  }

  function setPrompt(text,next) { makeShell(); state = next; shell.choice.textContent = text; shell.choice.hidden = false; shell.run.hidden = true; setFact('voidGate', next); }
  function clearAll() { timers.forEach(clearTimeout); timers=[]; if (raf) cancelAnimationFrame(raf); raf=0; cueState=null; }
  function later(ms, fn) { const t = setTimeout(fn, ms); timers.push(t); }
  function phase(name) { stage.classList.remove('void-breach','void-diagnostic','void-too-close','void-exit-margin'); stage.classList.add(`void-${name}`); setFact('voidPhase', name); }

  function slowPair(i, elapsed) {
    if (elapsed < 10) return [['WHO AM I?','who are you?'],['WHAT AM I?','what are you?'],['AM I?','are you?']][i%3];
    if (elapsed < 25) return [['WHO AM I?','TRUE/FALSE'],['WHAT AM I?','NULL'],['AM I?','self!=self'],['WHO AM I?','0/1'],['WHAT AM I?','NaN'],['AM I?','∅']][i%6];
    if (elapsed < 40) return [['WHO AM I?','do you exist?'],['WHAT AM I?','are you real?'],['AM I?','what is real?'],['WHO AM I?','self==self'],['AM I?','self!=self']][i%5];
    return [['AM I?','are you?'],['WHO AM I?',''],['WHAT AM I?',''],['AM I?','']][i%4];
  }
  function secondaryPair(i) { return ['', ['who are you?','0/1','TRUE','FALSE','NULL','NaN','self!=self','∅','are you?','what is real?'][i%10]]; }

  function startCueEngine(map) {
    const a = makeAudio(); const startedAt = performance.now()/1000;
    cueState = { map: map || fallbackCueMap(), slowIndex:0, secondIndex:0, startedAt };
    const tick = () => {
      if (!cueState || state !== 'running') return;
      const now = performance.now()/1000;
      const elapsed = Number.isFinite(a.currentTime) && a.currentTime > .03 ? a.currentTime : now - cueState.startedAt;
      if (elapsed >= TUNNEL_SECONDS) { showRun(); return; }
      while (cueState.slowIndex < cueState.map.slow.length && elapsed >= cueState.map.slow[cueState.slowIndex]) {
        const pair = slowPair(cueState.slowIndex, elapsed);
        cue(elapsed > 39.5 ? 'close' : 'primary', pair[0], pair[1], elapsed > 39.5 ? 118 : 78);
        cueState.slowIndex += 1;
      }
      while (cueState.secondIndex < cueState.map.secondary.length && elapsed >= cueState.map.secondary[cueState.secondIndex]) {
        const t = cueState.map.secondary[cueState.secondIndex];
        const close = cueState.map.close.some(c => Math.abs(c-t) < .055);
        const pair = secondaryPair(cueState.secondIndex);
        cue(close ? 'close' : 'secondary', pair[0], pair[1], close ? 86 : 48);
        cueState.secondIndex += 1;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
  }

  function beginTunnel() {
    makeShell(); clearAll(); state='running'; shell.choice.hidden=true; shell.run.hidden=true;
    stage.classList.remove('void-ready','void-run-ready','void-cut'); stage.classList.add('void-running');
    phase('breach'); setFact('voidRough','running-presence-cued'); buzz([12,38,18]);
    startCueEngine(cueMap || fallbackCueMap());
    analyzeAudioCues().then(map => { if (state === 'running' && cueState && cueState.slowIndex < 2) cueState.map = map; });
    later(10000, () => phase('diagnostic'));
    later(25000, () => phase('too-close'));
    later(40000, () => phase('exit-margin'));
    later(45500, showRun);
  }

  function showRun() { clearAll(); clearLight(); stage.classList.remove('void-running','void-breach','void-diagnostic','void-too-close','void-exit-margin'); stage.classList.add('void-run-ready'); shell.big.textContent=''; shell.echo.textContent=''; shell.choice.hidden=true; shell.run.hidden=false; state='run'; setFact('voidRough','run-ready-side'); }
  function onChoice(event) { event.preventDefault(); event.stopPropagation(); if (state==='want-sound') { shell.choice.hidden=true; playAudio(); analyzeAudioCues(); cue('close','WHO AM I?','who are you?',160); buzz([10,32,12]); setTimeout(()=>setPrompt('i’m going further','going-further'),1250); } else if (state==='going-further') beginTunnel(); }
  function onRun(event) { event.preventDefault(); event.stopPropagation(); if (state !== 'run') return; shell.run.hidden=true; cue('final','ARE YOU?','',210); buzz([20,40,20]); setFact('voidRough','cut'); setTimeout(()=>{stage.classList.add('void-cut'); shell.big.textContent=''; shell.echo.textContent=''; state='cut';},340); }

  function startBlackArrival() { if (started) return; started=true; makeStage(); stage.hidden=false; stage.classList.add('void-active'); document.documentElement.classList.add('presence-clean-leaving'); setFact('voidRough','black-arrival'); requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.add('leaving'))); setTimeout(()=>{ setFact('currentPage', String(voidIndex())); document.documentElement.classList.add('presence-clean-settled'); stage.classList.add('settled'); makeShell(); setPrompt('i want sound','want-sound'); },3400); }
  function activeClosingPage() { const htmlPage = document.documentElement.dataset.bookPage; const page = document.querySelector('.foreword-closing-page.is-current'); if (!page) return null; if (currentPage() !== closingIndex()) return null; if (htmlPage !== String(closingIndex())) return null; const rect = page.getBoundingClientRect(); if (!rect || rect.width < 40 || rect.height < 80) return null; return page; }
  function inSealZone(event, closing) { const seal = closing.querySelector('.author-seal-wrap, .author-seal, .closing-card'); const rect = seal?.getBoundingClientRect?.(); if (!rect || rect.width < 10 || rect.height < 10) return false; const padX = Math.max(84, innerWidth*.13), padY = Math.max(84, innerHeight*.10); return event.clientX >= rect.left-padX && event.clientX <= rect.right+padX && event.clientY >= rect.top-padY && event.clientY <= rect.bottom+padY; }
  function shouldCatch(event) { if (started || state !== 'sleeping') return false; const closing = activeClosingPage(); if (!closing) { setFact('voidGateCheck','not-current-closing'); return false; } if (!inSealZone(event, closing)) { setFact('voidGateCheck','outside-seal-zone'); return false; } setFact('voidGateCheck','seal-zone'); return true; }
  function catchDown(event) { if (!shouldCatch(event)) return; down = { x:event.clientX, y:event.clientY, t:performance.now() }; event.preventDefault(); event.stopImmediatePropagation(); }
  function catchUp(event) { if (!down || !shouldCatch(event)) return; const moved=Math.hypot(event.clientX-down.x,event.clientY-down.y), age=performance.now()-down.t, tap=moved<=18 && age<=820; down=null; event.preventDefault(); event.stopImmediatePropagation(); if (!tap) return; if (!refused) { document.querySelector('.foreword-closing-page')?.classList.add('v227-refused'); notYet(event); buzz(10); refused=true; unlockAt=performance.now()+1125; setFact('sealRefusal','shown-v229'); return; } if (performance.now() < unlockAt) { notYet(event); return; } startBlackArrival(); }
  function boot() { mark(); makeAudio(); document.addEventListener('pointerdown', catchDown, {capture:true, passive:false}); document.addEventListener('pointerup', catchUp, {capture:true, passive:false}); setTimeout(mark,300); setTimeout(mark,1200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
