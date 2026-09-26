const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha: false });
const img = new Image();
img.src = './assets/source/IMG_3301.png';

const PI = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
let glyphs = [];
let start = 0;
let dpr = 1;
let W = 0;
let H = 0;

const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  build();
}

function build() {
  if (!img.complete || !img.naturalWidth) return;
  glyphs = [];

  // Denser than the original proof: smaller cells and tighter vertical sampling
  // so the particle field describes more of the House without changing scale.
  const cell = Math.max(2.7, Math.min(4.1, W / 118));
  const rowStep = cell * 1.02;
  const font = Math.max(3.8, cell * 1.18);
  const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const ox = (W - dw) / 2;
  const oy = (H - dh) / 2;

  const off = document.createElement('canvas');
  const oc = off.getContext('2d', { willReadFrequently: true });
  off.width = Math.max(1, Math.floor(dw / cell));
  off.height = Math.max(1, Math.floor(dh / rowStep));
  oc.drawImage(img, 0, 0, off.width, off.height);

  const data = oc.getImageData(0, 0, off.width, off.height).data;
  let n = 0;

  for (let y = 0; y < off.height; y++) {
    for (let x = 0; x < off.width; x++) {
      const k = (y * off.width + x) * 4;
      const lum = (data[k] * .2126 + data[k + 1] * .7152 + data[k + 2] * .0722) / 255;

      // Lower threshold keeps more faint architectural information.
      if (lum < .024) continue;

      const tx = ox + (x + .5) * cell;
      const ty = oy + (y + .5) * rowStep;
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.max(W, H) * (.2 + Math.random() * .82);

      glyphs.push({
        tx,
        ty,
        x: tx + Math.cos(ang) * rad,
        y: ty + Math.sin(ang) * rad,
        ch: PI[n++ % PI.length],
        lum: clamp(Math.pow(lum, .30) * 2.15),
        delay: Math.random() * 1.65,
        font,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
}

function lightning(t) {
  let a = 0;
  if (t > 2.55 && t < 2.64) a = Math.sin((t - 2.55) / .09 * Math.PI);
  if (t > 4.42 && t < 4.48) a = Math.max(a, Math.sin((t - 4.42) / .06 * Math.PI));
  if (t > 4.57 && t < 4.63) a = Math.max(a, .42 * Math.sin((t - 4.57) / .06 * Math.PI));
  if (!a) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(255,255,255,${a * .34})`;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function frame(ts) {
  if (!start) start = ts;
  const t = (ts - start) / 1000;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const g of glyphs) {
    const p = ease(clamp((t - .18 - g.delay) / 4.15));
    if (p <= 0) continue;

    const alive = p > .985 ? Math.sin(t * .9 + g.phase) * .28 : 0;
    const x = g.x + (g.tx - g.x) * p + alive;
    const y = g.y + (g.ty - g.y) * p + alive * .45;
    const alpha = clamp((.34 + .9 * p) * g.lum);

    ctx.font = `360 ${g.font}px ui-monospace,SFMono-Regular,Menlo,monospace`;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillText(g.ch, x, y);
  }

  lightning(t);

  if (t > 7.2) {
    ctx.fillStyle = `rgba(0,0,0,${clamp((t - 7.2) / 1.4)})`;
    ctx.fillRect(0, 0, W, H);
  }
  if (t > 9) {
    start = ts;
    build();
  }

  requestAnimationFrame(frame);
}

img.onload = () => {
  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(frame);
};
