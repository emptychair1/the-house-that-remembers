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

  // Rosetta v3: keep the particle assembly, but sample much more aggressively.
  // Smaller cells + local-neighborhood detection keep faint roof and silhouette data
  // that the first proof discarded, without changing the overall house scale.
  const cell = Math.max(2.15, Math.min(3.35, W / 152));
  const rowStep = cell * .88;
  const font = Math.max(3.35, cell * 1.22);
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
  const lumAt = (x, y) => {
    x = Math.max(0, Math.min(off.width - 1, x));
    y = Math.max(0, Math.min(off.height - 1, y));
    const k = (y * off.width + x) * 4;
    return (data[k] * .2126 + data[k + 1] * .7152 + data[k + 2] * .0722) / 255;
  };
  let n = 0;

  for (let y = 0; y < off.height; y++) {
    for (let x = 0; x < off.width; x++) {
      const lum = lumAt(x, y);
      const local = Math.max(
        lum,
        lumAt(x - 1, y), lumAt(x + 1, y),
        lumAt(x, y - 1), lumAt(x, y + 1),
        lumAt(x - 1, y - 1), lumAt(x + 1, y - 1),
        lumAt(x - 1, y + 1), lumAt(x + 1, y + 1)
      );
      const contrast = local - lum;

      // Very low gate: this is what pulls the full house out of the dark.
      // The random dither prevents flat bands while keeping the whole silhouette.
      const keep = local > .009 || (local > .006 && Math.random() > .34) || (contrast > .016 && Math.random() > .18);
      if (!keep) continue;

      const tx = ox + (x + .5) * cell;
      const ty = oy + (y + .5) * rowStep;
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.max(W, H) * (.18 + Math.random() * .84);
      const strength = clamp(Math.pow(Math.max(local, lum + contrast * .7), .20) * 3.4, .34, 1);

      glyphs.push({
        tx,
        ty,
        x: tx + Math.cos(ang) * rad,
        y: ty + Math.sin(ang) * rad,
        ch: PI[n++ % PI.length],
        lum: strength,
        delay: Math.random() * 1.45,
        font,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
}

function lightning(t) {
  let a = 0;
  if (t > 2.55 && t < 2.61) a = Math.sin((t - 2.55) / .06 * Math.PI);
  if (t > 4.42 && t < 4.47) a = Math.max(a, Math.sin((t - 4.42) / .05 * Math.PI));
  if (!a) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(255,255,255,${a * .18})`;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function frame(ts) {
  if (!start) start = ts;
  const t = (ts - start) / 1000;

  // True black. No headlight layer, no bottom fog, no global wash.
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const g of glyphs) {
    const p = ease(clamp((t - .12 - g.delay) / 4.05));
    if (p <= 0) continue;

    const alive = p > .985 ? Math.sin(t * .9 + g.phase) * .18 : 0;
    const x = g.x + (g.tx - g.x) * p + alive;
    const y = g.y + (g.ty - g.y) * p + alive * .45;
    const alpha = clamp((.62 + .55 * p) * g.lum, .38, 1);

    ctx.font = `420 ${g.font}px ui-monospace,SFMono-Regular,Menlo,monospace`;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.shadowColor = 'rgba(255,255,255,.28)';
    ctx.shadowBlur = .9;
    ctx.fillText(g.ch, x, y);
    ctx.shadowBlur = 0;
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
