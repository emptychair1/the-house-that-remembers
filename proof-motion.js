const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha: false });
const img = new Image();
img.src = './assets/source/IMG_3301.png';

const PI = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
const BUILD = 'ROSETTA STREAM v6';

let start = 0;
let dpr = 1;
let W = 0;
let H = 0;
let cover = null;
let stream = [];
let coverBox = { x: 0, y: 0, w: 0, h: 0 };

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const hash = (x, y, salt = 0) => {
  const s = Math.sin((x * 127.1) + (y * 311.7) + (salt * 74.7)) * 43758.5453123;
  return s - Math.floor(s);
};

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
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
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let v = (r * .2126 + g * .7152 + b * .0722) / 255;

    // Strip the amber by collapsing to luminance, then crush the near-black
    // background so the cover fades in out of true black instead of gray haze.
    v = clamp((v - .030) / .970);
    v = Math.pow(v, .82);
    const out = Math.round(v * 255);

    data[i] = out;
    data[i + 1] = out;
    data[i + 2] = out;
  }

  cctx.putImageData(frame, 0, 0);
}

function toCanvas(nx, ny) {
  return {
    x: coverBox.x + nx * coverBox.w,
    y: coverBox.y + ny * coverBox.h
  };
}

function buildStream() {
  stream = [];
  if (!img.naturalWidth) return;

  const count = Math.round(clamp(W * H / 1650, 180, 360));
  for (let i = 0; i < count; i++) {
    const lane = hash(i, 0, 1);
    const offset = hash(i, 0, 2);
    const speed = .045 + hash(i, 0, 3) * .060;
    const drift = (hash(i, 0, 4) - .5) * 2;
    const size = .78 + hash(i, 0, 5) * .62;
    const alpha = .34 + hash(i, 0, 6) * .56;
    const digit = PI[i % PI.length];
    stream.push({ lane, offset, speed, drift, size, alpha, digit });
  }
}

function drawCover(t) {
  if (!cover) return;
  const reveal = ease(clamp((t - .15) / 3.25));
  const breathe = .96 + Math.sin(t * .32) * .04;

  ctx.save();
  ctx.globalAlpha = reveal * .62 * breathe;
  ctx.drawImage(cover, coverBox.x, coverBox.y, coverBox.w, coverBox.h);
  ctx.restore();
}

function drawDataCurrent(t) {
  if (!stream.length) return;

  const reveal = ease(clamp((t - .35) / 2.65));
  if (!reveal) return;

  // One deliberate current, matching the source-cover field: loose data enters
  // from the left, then narrows into the House wall/roof. No particles are
  // generated around title, author, symbols, or any other text.
  const a = toCanvas(-.060, .395);
  const b = toCanvas(.435, .535);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < stream.length; i++) {
    const p = stream[i];
    const travel = (p.offset + t * p.speed) % 1;

    // More width at the entrance, tighter as the data reaches the House.
    const width = coverBox.w * (.150 * (1 - travel) + .030);
    const lane = (p.lane - .5) * 2;
    const wobble = Math.sin(t * 1.7 + i * .37) * coverBox.w * .007 * p.drift;
    const x = a.x + dx * travel + nx * lane * width + wobble;
    const y = a.y + dy * travel + ny * lane * width + Math.cos(t * 1.35 + i) * coverBox.h * .0035;

    // Fade in from black, then taper particles at both ends of the current so
    // they appear to be entering and being absorbed by the House.
    const envelope = Math.sin(Math.PI * travel);
    const leadingSpark = travel > .72 ? 1.18 : 1;
    const alpha = clamp(reveal * envelope * p.alpha * leadingSpark, 0, .92);
    if (alpha < .025) continue;

    const font = Math.max(5.2, coverBox.w * .0095 * p.size);
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
  addEventListener('resize', resize);
  requestAnimationFrame(frame);
};
