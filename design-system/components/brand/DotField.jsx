import React from 'react';
/* DOTS THAT BECOME THE MASCOT (21 Sep 2026).
   The owner sent Jakub Antalik's `thinking-orbs` — dotted thought-orbs for agent UIs, plain canvas
   arcs, monochrome, MIT — and said the splash should feel like that. It should. What is taken from
   it is the METHOD, recorded in sentinel-craft/references/borrowed.md: a dot is {x,y,z,r,a}; an
   outline is sampled evenly by arc length so spacing holds through every instant; motion is a
   smoothstep, not a spring; radius scales sub-linearly with size so small marks stay legible; one
   shared clock, paused offscreen; reduced motion is one static frame. What is NOT taken is the
   dependency (this system has none at runtime), the nine tuned states (this product claims three),
   and the grayscale theme machinery (one world, one bronze).

   The scene is the splash's story in dots. Every dot starts on a tilted orbit, the way the library's
   `working` state runs, and settles onto the mascot's own geometry — the SAME rounded rectangles
   `Mascot.jsx` draws, sampled evenly. The eyes settle first and brightest; then the plate; then the
   head. So the eyes open before the face exists, and when the last dot lands the field IS the
   mascot, ready to be swapped for the solid one without anything moving.

   One colour, read from the token at mount — never a literal. Depth is carried by alpha alone. */

const GEO = {                       // Mascot.jsx's geometry, 100 × 74
  head:  { x: 4,  y: 4,  w: 92, h: 66, rx: 18 },
  plate: { x: 27, y: 17, w: 46, h: 40, rx: 8 },
  eyes:  [{ x: 51, y: 42, w: 8, h: 8 }, { x: 61, y: 42, w: 8, h: 8 }],
};

const smooth = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };

/* A rounded rectangle as a closed polyline, then `n` points laid EVENLY along it by arc length —
   the library's morph technique, so the outline reads as one line of dots at every density. */
function roundedRectPoints(r, n) {
  const pts = [];
  const seg = 10;
  const corners = [[r.x + r.w - r.rx, r.y + r.rx, -Math.PI / 2, 0], [r.x + r.w - r.rx, r.y + r.h - r.rx, 0, Math.PI / 2],
                   [r.x + r.rx, r.y + r.h - r.rx, Math.PI / 2, Math.PI], [r.x + r.rx, r.y + r.rx, Math.PI, Math.PI * 1.5]];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= seg; i++) { const a = a0 + (a1 - a0) * (i / seg); pts.push([cx + Math.cos(a) * r.rx, cy + Math.sin(a) * r.rx]); }
  }
  const L = [0]; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; L.push(L[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); }
  const total = L[L.length - 1], out = [];
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total; let i = 0; while (L[i + 1] < target) i++;
    const p = pts[i], q = pts[(i + 1) % pts.length], f = (target - L[i]) / Math.max(1e-6, L[i + 1] - L[i]);
    out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]);
  }
  return out;
}
function filledGrid(r, cols, rows) {
  const out = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) out.push([r.x + (i + 0.5) * (r.w / cols), r.y + (j + 0.5) * (r.h / rows)]);
  return out;
}

/* Build the field once per size: each dot knows its target, its orbit, and the window of the settle
   in which it lands. Eyes 0–.38, plate .18–.72, head .40–1 — eyes first, by design. */
function buildField() {
  const dots = [];
  const add = (pts, group, win, weight) => pts.forEach(([tx, ty], i) => {
    const h1 = hash(i, group), h2 = hash(i + 7, group * 3 + 1), h3 = hash(i + 13, group * 5 + 2);
    const th = h1 * Math.PI * 2, phi = Math.acos(2 * h2 - 1);
    const nx = Math.sin(phi) * Math.cos(th), ny = Math.cos(phi), nz = Math.sin(phi) * Math.sin(th);
    let ux = -ny, uy = nx; const ul = Math.max(1e-6, Math.hypot(ux, uy)); ux /= ul; uy /= ul;
    const vx = -nz * uy, vy = nz * ux, vz = nx * uy - ny * ux;
    dots.push({ tx, ty, weight, win, orbit: { ux, uy, vx, vy, vz, ro: 0.55 + 0.5 * h3, a0: h1 * 6.283, speed: (0.25 + 0.55 * h3) * (h2 > 0.5 ? 1 : -1) },
                jitter: (h3 - 0.5) * 0.35 });
  });
  add(filledGrid(GEO.eyes[0], 3, 3), 1, [0.00, 0.38], 1.0);
  add(filledGrid(GEO.eyes[1], 3, 3), 2, [0.04, 0.42], 1.0);
  add(roundedRectPoints(GEO.plate, 48), 3, [0.18, 0.72], 0.85);
  add(roundedRectPoints(GEO.head, 92), 4, [0.40, 1.00], 0.72);
  return dots;
}

export function DotField({ size = 168, settleMs, delayMs = 0, working = false, label = 'Sentinel', onSettled }) {
  const ref = React.useRef(null);
  const field = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const css = getComputedStyle(canvas);
    const ink = css.getPropertyValue('--color-bronze').trim() || 'currentColor';
    const readMs = (name, fb) => { const v = css.getPropertyValue(name).trim(); const n = parseFloat(v); return Number.isFinite(n) ? (v.endsWith('ms') ? n : n * 1000) : fb; };
    const dur = settleMs != null ? settleMs : readMs('--dur-bar', 480) + readMs('--dur-enter', 240);
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    if (!field.current) field.current = buildField();
    const dots = field.current;

    const S = (size * 0.78) / 100, ox = (size - 100 * S) / 2, oy = (size - 74 * S) / 2;
    const cx = size / 2, cy = size / 2, R = size * 0.42;
    const rBase = 1.6 * Math.pow(size / 168, 0.6);
    const t0 = performance.now() + delayMs;
    let raf = 0, settledFired = false, running = true;

    const frame = (now) => {
      const t = (now - t0) / 1000;
      const p = Math.max(0, Math.min(1, (now - t0) / dur));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size); ctx.fillStyle = ink;
      const yaw = t * 0.12, tilt = 0.3;
      for (const d of dots) {
        const e = smooth((p - d.win[0]) / (d.win[1] - d.win[0]));
        const a = d.orbit.a0 + t * d.orbit.speed;
        const ro = R * d.orbit.ro;
        let x3 = (d.orbit.ux * Math.cos(a) + d.orbit.vx * Math.sin(a)) * ro;
        let y3 = (d.orbit.uy * Math.cos(a) + d.orbit.vy * Math.sin(a)) * ro;
        let z3 = (d.orbit.vz * Math.sin(a)) * ro;
        const cyaw = Math.cos(yaw), syaw = Math.sin(yaw); const xr = x3 * cyaw - z3 * syaw, zr = x3 * syaw + z3 * cyaw;
        const ct = Math.cos(tilt), st = Math.sin(tilt); const yr = y3 * ct - zr * st, zz = y3 * st + zr * ct;
        const depth = (zz / ro + 1) / 2;
        const ox0 = cx + xr, oy0 = cy + yr;
        const txp = ox + d.tx * S, typ = oy + d.ty * S;
        const x = ox0 + (txp - ox0) * e, y = oy0 + (typ - oy0) * e;
        let alpha = (0.32 + 0.5 * depth) * (1 - e) + d.weight * e;
        if (working && e >= 1) alpha *= 0.62 + 0.38 * (0.5 + 0.5 * Math.sin((t + d.jitter) * (Math.PI * 2 / 1.2)));
        const r = rBase * ((0.7 + 0.5 * depth) * (1 - e) + (d.weight >= 1 ? 1.35 : 1) * e);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (p >= 1 && !settledFired) { settledFired = true; onSettled && onSettled(); }
      if (running && !(p >= 1 && !working)) raf = requestAnimationFrame(frame);
    };

    if (reduced) { frame(t0 + dur); return; }   // one static, settled frame — the library's answer too
    const onVis = () => { if (document.hidden) { running = false; cancelAnimationFrame(raf); } else if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);
    return () => { running = false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); };
  }, [size, settleMs, delayMs, working, onSettled]);

  return <canvas ref={ref} className="ds-dotfield" role="img" aria-label={label} style={{ width: size, height: size, display: 'block' }} />;
}
