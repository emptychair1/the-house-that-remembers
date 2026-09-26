const BUILD = 'BOOK CLEAN SURFACE v1';
const reader = document.getElementById('reader');
const coverSrc = './assets/source/IMG_3301.png';
const pi = '3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273';

let pageFlip = null;
let currentPage = 0;
let lastTurnAt = 0;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const hash = (x, y, salt = 0) => {
  const s = Math.sin((x * 127.1) + (y * 311.7) + (salt * 74.7)) * 43758.5453123;
  return s - Math.floor(s);
};

function lockScroll() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.inset = '0';
  document.body.style.width = '100%';
  document.body.style.height = '100dvh';
  window.scrollTo(0, 0);
}

function setFact(name, value) {
  const facts = document.getElementById('render-facts');
  if (facts) facts.dataset[name] = String(value);
}

function setDebug(text) {
  const el = document.getElementById('tap-debug');
  if (!el) return;
  el.textContent = text;
  el.classList.add('seen');
  clearTimeout(setDebug.timer);
  setDebug.timer = setTimeout(() => el.classList.remove('seen'), 900);
}

function updatePageState(pageIndex) {
  currentPage = clamp(Number(pageIndex) || 0, 0, 1);
  setFact('currentPage', currentPage);
  document.documentElement.dataset.bookPage = String(currentPage);
  document.querySelectorAll('.book-page').forEach((page, index) => {
    page.classList.toggle('is-current', index === currentPage);
  });
}

function tryTurn(direction) {
  const now = performance.now();
  if (now - lastTurnAt < 480) {
    setDebug('cooldown');
    return;
  }
  lastTurnAt = now;

  const next = direction > 0 ? 1 : 0;
  if (next === currentPage) {
    setDebug(direction > 0 ? 'right edge: end' : 'left edge: cover');
    return;
  }

  setDebug(direction > 0 ? 'right edge: next' : 'left edge: previous');
  try {
    if (pageFlip && direction > 0 && typeof pageFlip.flipNext === 'function') {
      pageFlip.flipNext();
      return;
    }
    if (pageFlip && direction < 0 && typeof pageFlip.flipPrev === 'function') {
      pageFlip.flipPrev();
      return;
    }
  } catch (err) {
    console.warn('PageFlip turn failed, falling back to static state', err);
  }
  updatePageState(next);
}

function initRosettaCover(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const img = new Image();
  img.src = coverSrc;

  const PI = pi.replace(/\./g, '');
  let start = 0;
  let dpr = 1;
  let W = 0;
  let H = 0;
  let cover = null;
  let stream = [];
  const coverBox = { x: 0, y: 0, w: 0, h: 0 };

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth || innerWidth;
    H = canvas.clientHeight || innerHeight;
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
    buildStream();
  }

  function layout() {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    coverBox.w = img.naturalWidth * scale;
    coverBox.h = img.naturalHeight * scale;
    coverBox.x = (W - coverBox.w) / 2;
    coverBox.y = (H - coverBox.h) / 2;
  }

  function makeMonochromeCover() {
    cover = document.createElement('canvas');
    cover.width = img.naturalWidth;
    cover.height = img.naturalHeight;
    const cctx = cover.getContext('2d', { willReadFrequently: true });
    cctx.drawImage(img, 0, 0);
    const frame = cctx.getImageData(0, 0, cover.width, cover.height);
    const data = frame.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let v = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
      v = clamp((v - 0.030) / 0.970);
      v = Math.pow(v, 0.82);
      const out = Math.round(v * 255);
      data[i] = out;
      data[i + 1] = out;
      data[i + 2] = out;
    }
    cctx.putImageData(frame, 0, 0);
  }

  function toCanvas(nx, ny) {
    return { x: coverBox.x + nx * coverBox.w, y: coverBox.y + ny * coverBox.h };
  }

  function buildStream() {
    stream = [];
    if (!img.naturalWidth || !W || !H) return;
    const count = Math.round(clamp(W * H / 1650, 180, 360));
    for (let i = 0; i < count; i += 1) {
      stream.push({
        lane: hash(i, 0, 1),
        offset: hash(i, 0, 2),
        speed: 0.045 + hash(i, 0, 3) * 0.060,
        drift: (hash(i, 0, 4) - 0.5) * 2,
        size: 0.78 + hash(i, 0, 5) * 0.62,
        alpha: 0.34 + hash(i, 0, 6) * 0.56,
        digit: PI[i % PI.length]
      });
    }
  }

  function drawCover(t) {
    if (!cover) return;
    const reveal = ease(clamp((t - 0.15) / 3.25));
    const breathe = 0.96 + Math.sin(t * 0.32) * 0.04;
    ctx.save();
    ctx.globalAlpha = reveal * 0.62 * breathe;
    ctx.drawImage(cover, coverBox.x, coverBox.y, coverBox.w, coverBox.h);
    ctx.restore();
  }

  function drawDataCurrent(t) {
    if (!stream.length) return;
    const reveal = ease(clamp((t - 0.35) / 2.65));
    if (!reveal) return;
    const a = toCanvas(-0.060, 0.395);
    const b = toCanvas(0.435, 0.535);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < stream.length; i += 1) {
      const p = stream[i];
      const travel = (p.offset + t * p.speed) % 1;
      const width = coverBox.w * (0.150 * (1 - travel) + 0.030);
      const lane = (p.lane - 0.5) * 2;
      const wobble = Math.sin(t * 1.7 + i * 0.37) * coverBox.w * 0.007 * p.drift;
      const x = a.x + dx * travel + nx * lane * width + wobble;
      const y = a.y + dy * travel + ny * lane * width + Math.cos(t * 1.35 + i) * coverBox.h * 0.0035;
      const envelope = Math.sin(Math.PI * travel);
      const leadingSpark = travel > 0.72 ? 1.18 : 1;
      const alpha = clamp(reveal * envelope * p.alpha * leadingSpark, 0, 0.92);
      if (alpha < 0.025) continue;
      const font = Math.max(5.2, coverBox.w * 0.0095 * p.size);
      ctx.font = `420 ${font}px ui-monospace,SFMono-Regular,Menlo,monospace`;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.shadowColor = 'rgba(255,255,255,.24)';
      ctx.shadowBlur = 1.1;
      ctx.fillText(p.digit, x, y);
    }
    ctx.restore();
  }

  function frame(ts) {
    if (!start) start = ts;
    const t = (ts - start) / 1000;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    drawCover(t);
    drawDataCurrent(t);
    requestAnimationFrame(frame);
  }

  img.onload = () => {
    makeMonochromeCover();
    resize();
    addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(frame);
  };
  img.onerror = () => {
    canvas.insertAdjacentHTML('afterend', '<div class="cover-fallback">The House That Remembers</div>');
  };
}

function buildMarkup() {
  reader.innerHTML = `
    <div class="book-stage" aria-label="The House That Remembers clean surface">
      <div id="book" class="book-root">
        <section class="book-page cover-page" data-book-page="cover" data-density="hard" aria-label="Cover">
          <canvas class="rosetta-cover-canvas" aria-hidden="true"></canvas>
          <div class="cover-whisper">tap right to turn</div>
        </section>
        <section class="book-page foreword-title-page" data-book-page="foreword-title" data-density="hard" aria-label="Foreword title">
          <div class="foreword-title-card">
            <p class="kicker">Foreword</p>
            <h1>Possibility<br>and Curiosity</h1>
            <p class="subtitle">The House That Remembers</p>
            <p class="first-line">There are moments in human history when the important thing is not that we have found an answer.</p>
          </div>
        </section>
      </div>
    </div>
    <div class="tap-zones" aria-hidden="true"></div>
    <div class="build-marker" data-build="${BUILD}">${BUILD}</div>
    <div id="tap-debug" class="tap-debug" aria-hidden="true"></div>
    <div id="render-facts" hidden data-build="${BUILD}" data-surface="root-pwa" data-page-count="2" data-current-page="0" data-cache="disabled" data-library="stpageflip"></div>
  `;
  initRosettaCover(reader.querySelector('.rosetta-cover-canvas'));
}

function initFlipBook() {
  const book = document.getElementById('book');
  const pages = document.querySelectorAll('.book-page');
  updatePageState(0);

  if (!window.St || !window.St.PageFlip) {
    document.documentElement.dataset.flipEngine = 'fallback';
    setFact('flipEngine', 'fallback');
    return;
  }

  try {
    pageFlip = new window.St.PageFlip(book, {
      width: 390,
      height: 852,
      size: 'stretch',
      minWidth: 300,
      maxWidth: 460,
      minHeight: 520,
      maxHeight: 980,
      maxShadowOpacity: 0.36,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: true,
      flippingTime: 760,
      drawShadow: true,
      autoSize: true,
      startPage: 0
    });
    pageFlip.loadFromHTML(pages);
    pageFlip.on('flip', event => updatePageState(event.data));
    document.documentElement.dataset.flipEngine = 'stpageflip';
    setFact('flipEngine', 'stpageflip');
  } catch (err) {
    console.warn('StPageFlip init failed, keeping static fallback', err);
    document.documentElement.dataset.flipEngine = 'fallback-error';
    setFact('flipEngine', 'fallback-error');
  }
}

function initGestures() {
  const zones = document.querySelector('.tap-zones');
  let startX = 0;
  let startY = 0;
  let startT = 0;
  let tracking = false;

  zones.addEventListener('pointerdown', event => {
    tracking = true;
    startX = event.clientX;
    startY = event.clientY;
    startT = performance.now();
  }, { passive: true });

  zones.addEventListener('pointerup', event => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const age = performance.now() - startT;
    const w = innerWidth || 1;
    const moved = Math.hypot(dx, dy);

    if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      tryTurn(dx < 0 ? 1 : -1);
      return;
    }

    if (moved > 16 || age > 780) {
      setDebug('gesture ignored');
      return;
    }

    if (startX < w * 0.33) {
      tryTurn(-1);
      return;
    }
    if (startX > w * 0.67) {
      tryTurn(1);
      return;
    }
    setDebug('center: no turn');
  }, { passive: true });

  zones.addEventListener('pointercancel', () => {
    tracking = false;
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') tryTurn(1);
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') tryTurn(-1);
  });
}

function boot() {
  lockScroll();
  buildMarkup();
  initFlipBook();
  initGestures();
  window.addEventListener('scroll', () => window.scrollTo(0, 0), { passive: true });
}

boot();
