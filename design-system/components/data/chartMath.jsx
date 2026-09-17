/* Chart maths — scales, nice ticks and path generation. No marks, no styling.
   `d3-scale` and `d3-shape` do the arithmetic when they are on the page (window.d3 — load them as
   ESM from a CDN or via @visx/scale + @visx/shape). They are peer dependencies, not bundled: two
   small modules with no DOM, no defaults and no styling opinions, which is the whole reason they are
   the only chart dependency in the system. No charting library renders a Sentinel chart.
   The fallbacks below use d3's own 1/2/5 tick algorithm so a page without d3 still lands its
   baselines on the grid; what it loses is monotone curves (straight segments instead) and time
   scales. The visible difference is small; the maths discipline is not optional either way. */
const d3 = () => (typeof window !== 'undefined' && window.d3 ? window.d3 : null);
export function hasD3() { return !!(d3() && d3().scaleLinear && d3().line); }
function step125(raw) {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  return (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
}
/* A domain rounded outward to whole tick steps — never a raw data min/max, which is what puts a
   baseline half a pixel off the grid and reads as amateur. */
export function niceDomain(min, max, count = 4) {
  const lib = d3();
  if (lib && lib.scaleLinear) { const s = lib.scaleLinear().domain([min, max]).nice(count); return s.domain(); }
  if (max === min) return [min - 1, max + 1];
  const s = step125((max - min) / count);
  return [Math.floor(min / s) * s, Math.ceil(max / s) * s];
}
export function ticks(min, max, count = 4) {
  const lib = d3();
  if (lib && lib.ticks) return lib.ticks(min, max, count);
  const s = step125((max - min) / count);
  const out = [];
  for (let v = Math.ceil(min / s) * s; v <= max + 1e-9; v += s) out.push(Math.round(v * 1e6) / 1e6);
  return out;
}
export function linear(domain, range) {
  const lib = d3();
  if (lib && lib.scaleLinear) return lib.scaleLinear().domain(domain).range(range);
  const [d0, d1] = domain, [r0, r1] = range;
  const f = (v) => (d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0));
  f.domain = () => domain; f.range = () => range;
  return f;
}
/* Band scale for bar rhythm — even bands, even gaps, no arbitrary arithmetic per chart. */
export function band(labels, range, padding = 0.34) {
  const lib = d3();
  if (lib && lib.scaleBand) return lib.scaleBand().domain(labels).range(range).padding(padding);
  const [r0, r1] = range;
  const stepSize = (r1 - r0) / Math.max(labels.length, 1);
  const w = stepSize * (1 - padding);
  const f = (l) => r0 + labels.indexOf(l) * stepSize + (stepSize - w) / 2;
  f.bandwidth = () => w; f.step = () => stepSize;
  return f;
}
/* Monotone path through pixel-space [x, y] pairs — curveMonotoneX never overshoots a data point,
   which matters when the line is a portfolio value and an invented dip is a lie. */
export function linePath(pts) {
  const lib = d3();
  if (lib && lib.line) return lib.line().x((p) => p[0]).y((p) => p[1]).curve(lib.curveMonotoneX)(pts);
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('');
}
export function areaPath(pts, y0) {
  const lib = d3();
  if (lib && lib.area) return lib.area().x((p) => p[0]).y0(y0).y1((p) => p[1]).curve(lib.curveMonotoneX)(pts);
  return `${pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('')}L${pts[pts.length - 1][0]},${y0}L${pts[0][0]},${y0}Z`;
}
/* The four-step bronze ramp — the system's only chart palette, ordinal by rank. */
export const CHART_RAMP = ['var(--color-bronze-deep)', 'var(--color-bronze)', 'var(--color-alloc-debt)', 'var(--color-bubble-edge)'];
/* Colour comes from a data role, never from a prop. ramp = the client's own money · muted = benchmark,
   target, prior period · status = a crossed limit and nothing else. `tone` never accepts a colour.
   v11: muted swapped from --color-data-deemph (2.52 / 2.77 — below even the 3.0 non-text floor) to
   --color-muted (6.26 / 6.88). Same role, same warm grey family, already in the palette. */
export function toneColor(tone, rank = 0) {
  if (tone === 'muted') return 'var(--color-muted)';
  if (tone === 'status') return 'var(--color-status-over-fg)';
  return CHART_RAMP[Math.min(rank, CHART_RAMP.length - 1)];
}
/* v11 · PERCEIVABILITY. WCAG 1.4.11 asks a graphical object to clear 3.0:1 against adjacent colour.
   Measured against canvas #f6f4f1 / surface #ffffff:
     ramp 1 bronze-deep  6.59 / 7.24  pass
     ramp 2 bronze       2.57 / 2.83  FAIL
     ramp 3 alloc-debt   1.66 / 1.82  FAIL
     ramp 4 bubble-edge  1.30 / 1.42  FAIL
   So the palette carries exactly ONE chart mark that is legible as a shape against the page.
   `markColor` is therefore the only correct source for a mark that must separate FROM THE BACKGROUND
   — a line, a single bar, a crosshair, a sparkline. It returns ramp 1 regardless of rank.
   `CHART_RAMP` by rank stays legal only where marks separate from EACH OTHER by edge and label
   (stacked segments, adjacent bars), never from the page. No colour changed to fix this. */
export function markColor(tone) {
  if (tone === 'muted') return 'var(--color-muted)';
  if (tone === 'status') return 'var(--color-status-over-fg)';
  return CHART_RAMP[0];
}
/* Adjacent-segment separation cannot be solved by colour in this palette either — measured, every
   candidate fails against at least one ramp step (line 1.06, surface 1.42, ink 2.25, muted 1.05 at
   worst). So segments are separated by SHAPE and WORD: a --space-2 gap of the card's own background
   showing through, a --border-hairline --color-line edge on the bar, and the direct label the system
   already mandates. 1.4.11 exempts a graphic whose information is also present as text, and the
   label is that text — so the label is the compliance mechanism and the gap is the perceptual aid.
   Not the reverse: a segment with no label is a violation, not a style choice. */
export const SEGMENT_GAP = 'var(--space-2)';
export const trackInset = { boxShadow: 'inset 0 0 0 var(--border-hairline) var(--color-line)' };
export const PLOT = { peek: 72, expanded: 180 };
export const AXIS_BAND = 14;
export const tabular = { fontVariantNumeric: 'tabular-nums' };