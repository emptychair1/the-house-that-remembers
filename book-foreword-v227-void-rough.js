(() => {
  const BUILD = 'BOOK FOREWORD v2.2.7.1 VOID GATED PASS';
  const CACHE = 'book-foreword-v2271-void-gated-phone';
  const AUDIO_SRC = './assets/audio/the_weight_of_infinite_stone.mp3';
  const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const facts = () => document.getElementById('render-facts');
  const pageCount = () => Number(facts()?.dataset.pageCount || 21);
  const currentPage = () => Number(facts()?.dataset.currentPage || 0);
  const closingIndex = () => pageCount() - 2;
  const voidIndex = () => pageCount() - 1;
  const setFact = (name, value) => { const el = facts(); if (el) el.dataset[name] = String(value); };

  let down = null;
  let refused = false;
  let unlockAt = 0;
  let started = false;
  let stage = null;
  let shell = null;
  let state = 'sleeping';
  let audio = null;
  let timers = [];
  let slow = 0;
  let fast = 0;
  let flashToken = 0;

  function mark() {
    const marker = document.querySelector('.build-marker');
    if (marker) {
      marker.dataset.build = BUILD;
      marker.textContent = BUILD;
    }
    setFact('build', BUILD);
    setFact('cache', CACHE);
    setFact('voidRough', 'armed-gated');
    setFact('voidDuration', '30s');
    setFact('voidPulseMap', 'slow1000_fast800_first_returned_gaze');
  }

  function buzz(pattern) {
    try { if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (_) {}
  }

  function makeAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'void-audio-v227';
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
      a.volume = 0.86;
      const p = a.play();
      if (p?.then) {
        p.then(() => setFact('voidAudioV227', 'playing')).catch(err => {
          setFact('voidAudioV227', `blocked:${err?.name || 'unknown'}`);
          if (shell?.status) shell.status.textContent = 'sound did not unlock';
        });
      }
    } catch (err) {
      setFact('voidAudioV227', `error:${err?.name || 'unknown'}`);
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
    glyphs.concat(glyphs.slice(0, 16)).forEach((text, i) => {
      const span = document.createElement('span');
      span.textContent = text;
      span.style.left = `${8 + ((i * 17) % 84)}%`;
      span.style.top = `${9 + ((i * 23) % 82)}%`;
      span.style.transform = `translate(-50%,-50%) rotate(${(i % 2 ? -1 : 1) * (4 + i % 9)}deg)`;
      shell.glyphs.appendChild(span);
    });
    shell.choice.addEventListener('pointerup', onChoice, { passive: false });
    shell.run.addEventListener('pointerup', onRun, { passive: false });
    return shell;
  }

  function flash(main = '', echo = '', kind = 'impact', duration = 110) {
    makeShell();
    flashToken += 1;
    const token = flashToken;
    shell.main.textContent = main;
    shell.echo.textContent = echo;
    stage.classList.remove('void-hit-slow','void-hit-fast','void-hit-collision','void-hit-title','void-hit-final');
    stage.classList.add('void-lit', `void-hit-${kind}`);
    setFact('voidHit', `${kind}:${main || echo || 'glyph'}`);
    setTimeout(() => {
      if (token !== flashToken) return;
      stage.classList.remove('void-lit','void-hit-slow','void-hit-fast','void-hit-collision','void-hit-title','void-hit-final');
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
    if (slow) clearInterval(slow);
    if (fast) clearInterval(fast);
    slow = 0;
    fast = 0;
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

  function startSlow() {
    const words = [
      ['What am I?',''], ['','TRUE/FALSE'], ['','0/1'], ['THE VOID',''],
      ['What am I?','what are you?'], ['','NULL'], ['','NaN'], ['THE VOID',''],
      ['Am I?','are you?'], ['','self != self'], ['Am I?','do you exist?'], ['','∅'],
      ['THE VOID',''], ['Am I?','are you real?'], ['','what is real?'], ['THE VOID',''],
      ['THE VOID',''], ['','self == self'], ['THE VOID',''], ['','self != self'],
      ['THE VOID',''], ['','0/1'], ['THE VOID',''], ['','TRUE/FALSE'],
      ['THE VOID',''], ['STARES BACK',''], ['THE VOID','STARES BACK']
    ];
    let i = 0;
    const hit = () => {
      const pair = words[Math.min(i, words.length - 1)];
      flash(pair[0], pair[1], i >= 24 ? 'title' : 'slow', i >= 24 ? 150 : 105);
      i += 1;
    };
    hit();
    slow = setInterval(hit, prefersReduced() ? 1500 : 1000);
  }

  function startFast() {
    const words = [
      ['what are you?','0/1'], ['','who are you?'], ['are you?','T/F'], ['','do you exist?'],
      ['','are you real?'], ['Am I?','what is real?'], ['','NULL'], ['','NaN'],
      ['Am I?','are you?'], ['','real?'], ['','exist?'], ['','am i?'],
      ['Am I?','self != self'], ['','∃'], ['','∄'], ['THE VOID','?'],
      ['','FALSE'], ['','TRUE'], ['THE VOID','0/1'], ['','¬'],
      ['THE VOID','≠'], ['','∅'], ['THE VOID',''], ['STARES BACK','']
    ];
    let i = 0;
    const hit = () => {
      const pair = words[i % words.length];
      flash(pair[0], pair[1], i % 5 === 0 ? 'collision' : 'fast', i % 5 === 0 ? 95 : 54);
      i += 1;
    };
    hit();
    fast = setInterval(hit, prefersReduced() ? 1200 : 800);
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
    setFact('voidRough', 'running');
    buzz([12, 38, 18]);
    startSlow();
    later(4000, () => { phase('fracture'); stage.classList.add('void-poly'); setFact('voidPulseStart', 'first-returned-gaze'); startFast(); });
    later(10000, () => phase('bloom'));
    later(20000, () => phase('converge'));
    later(27000, () => phase('stare'));
    later(30000, showRun);
  }

  function showRun() {
    clearAll();
    stage.classList.remove('void-running','void-poly','void-entry','void-fracture','void-bloom','void-converge','void-stare','void-lit','void-hit-slow','void-hit-fast','void-hit-collision','void-hit-title');
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
      setFact('sealRefusal', 'shown-v227');
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
