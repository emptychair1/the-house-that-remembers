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

// Stable pseudo-random helpers: the same source pixel makes the same decision on
// every rebuild, so the House breathes instead of turning into visual static.
const hash = (x, y, salt = 0) => {
  const s = Math.sin((x * 127.1) + (y * 311.7) + (salt * 74.7)) * 43758.5453123;
  return s - Math.floor(s);
};
const noise = (x, y, salt = 0) => hash(Math.floor(x), Math.floor(y), salt);

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

  // V5: keep the full House and bright glyphs, but stop rendering it as a
  // solid filled sticker. Edges/roof/windows carry the form; the interior is
  // deliberately thinned into spectral dust.
  const cell = Math.max(2.75, Math.min(4.15, W / 124));
  const rowStep = cell * 1.04;
  const font = Math.max(3.7, cell * 1.16);
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
    const v = y / off.height;

    // House-only band. Tight enough to kill cover title/text residue while
    // leaving the chimney/roof and lower silhouette in the particle field.
    if (v < .365 || v > .862) continue;

    for (let x = 0; x < off.width; x++) {
      const u = x / off.width;
      const lum = lumAt(x, y);
      const l = lumAt(x - 1, y);
      const r = lumAt(x + 1, y);
      const t = lumAt(x, y - 1);
      const b = lumAt(x, y + 1);
      const tl = lumAt(x - 1, y - 1);
      const tr = lumAt(x + 1, y - 1);
      const bl = lumAt(x - 1, y + 1);
      const br = lumAt(x + 1, y + 1);
      const localMax = Math.max(lum, l, r, t, b, tl, tr, bl, br);
      const localMin = Math.min(lum, l, r, t, b, tl, tr, bl, br);
      const avg = (lum + l + r + t + b + tl + tr + bl + br) / 9;
      const edge = Math.max(
        localMax - localMin,
        Math.abs(r - l),
        Math.abs(b - t),
        Math.abs(br - tl),
        Math.abs(bl - tr)
      );

      // Spatial guard trims stray bands/flecks, but keeps the asymmetric left
      // roof/porch character and the broader right body.
      const cx = Math.abs(u - .53);
      const inCore = cx < .37;
      const inLowerWide = v > .55 && v < .80 && cx < .47;
      const inLeftRoof = v < .56 && u > .16 && u < .61;
      const inRightBody = v > .48 && v < .83 && u > .39 && u < .92;
      if (!(inCore || inLowerWide || inLeftRoof || inRightBody)) continue;

      const source = Math.max(localMax, avg * 1.08);
      if (source < .015) continue;

      const roofZone = v < .51;
      const lowerZone = v > .75;
      const outlineish = edge > .024 && source > .016;
      const detailish = edge > .014 && source > .022;
      const interior = !outlineish && !detailish;

      // Dense on contours/detail. Thinned in flat interior, so the House is
      // complete but airy instead of a packed silhouette.
      let keep = false;
      let role = 'interior';
      if (outlineish) {
        keep = true;
        role = 'edge';
      } else if (detailish) {
        keep = noise(x, y, 1) > .16;
        role = 'detail';
      } else if (source > .050) {
        keep = noise(x, y, 2) > .58;
      } else if (source > .028) {
        keep = noise(x, y, 3) > .72;
      } else if ((roofZone || lowerZone) && source > .018) {
        keep = noise(x, y, 4) > .78;
      }
      if (!keep) continue;

      // Cull isolated residual title/text rows: long horizontal bands with very
      // little local vertical contrast are usually cover typography, not House.
      const bandLike = edge < .020 && Math.abs(l - r) < .010 && Math.abs(t - b) < .007;
      if (bandLike && (v < .44 || v > .80) && noise(x, y, 9) < .82) continue;

      const tx = ox + (x + .5) * cell;
      const ty = oy + (y + .5) * rowStep;
      const ang = hash(x, y, 5) * Math.PI * 2;
      const rad = Math.max(W, H) * (.18 + hash(x, y, 6) * .84);
      const roleBoost = role === 'edge' ? .27 : role === 'detail' ? .13 : 0;
      const strength = clamp(.46 + Math.pow(source, .30) * .72 + edge * 1.55 + roleBoost, .38, 1);

      glyphs.push({
        tx,
        ty,
        x: tx + Math.cos(ang) * rad,
        y: ty + Math.sin(ang) * rad,
        ch: PI[n++ % PI.length],
        lum: strength,
        delay: hash(x, y, 7) * 1.48,
        font,
        phase: hash(x, y, 8) * Math.PI * 2
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
  ctx.fillStyle = `rgba(255,255,255,${a * .14})`;
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
    const p = ease(clamp((t - .12 - g.delay) / 4.1));
    if (p <= 0) continue;

    const alive = p > .985 ? Math.sin(t * .9 + g.phase) * .16 : 0;
    const x = g.x + (g.tx - g.x) * p + alive;
    const y = g.y + (g.ty - g.y) * p + alive * .45;
    const alpha = clamp((.52 + .46 * p) * g.lum, .26, .96);

    ctx.font = `360 ${g.font}px ui-monospace,SFMono-Regular,Menlo,monospace`;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.shadowColor = 'rgba(255,255,255,.18)';
    ctx.shadowBlur = .45;
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
