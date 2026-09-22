import React from 'react';
import { CHART_RAMP, toneColor, edgeColor, tabular } from './chartMath.jsx';
/* PART OF A WHOLE, WITH THE WHOLE IN THE MIDDLE — and never a pie.

   Asked for on 22 Sep 2026, and the research answers every question it raised.

   WHY A DONUT AND NEVER A PIE. Twenty finance screens were read (Origin, Acorns, Revolut, Fidelity,
   Cash App, Starling, Binance, Crypto.com, Quicken, Lloyds and more) and NOT ONE of them is a solid
   pie. Every one is a ring, and every one puts the thing the reader came for in the hole: "$X6K
   Portfolio", "+1.70% All time", "94% Cash balance", "198 KG CO₂E". A pie spends the middle on
   nothing. The hole is the component's best feature, so `center` and `centerNote` are how it is used.

   WHY IT IS CAPPED AT FIVE AND WHAT HAPPENS AFTER. The part-to-whole evidence is consistent: a ring
   is readable at four to six segments and a bar chart beats it past that, because comparing two arcs
   that are not adjacent is something the eye is bad at. One reference in the set proves it — a
   wardrobe app with sixteen slices, which is a colour wheel rather than a chart. So `max` defaults to
   5 and everything past it folds into one "Other" segment, which the caller names.

   COLOUR IS RANK, AND THAT IS ONLY LEGAL HERE BECAUSE THE SEGMENTS TOUCH. This system measured its
   own ramp: only step 1 clears 3:1 against the page, so a mark that must separate FROM THE PAGE takes
   `markColor` and nothing else. Steps 2–4 stay legal exactly where marks separate FROM EACH OTHER by
   edge and label — adjacent segments — which is what a ring is. So the ring uses CHART_RAMP by rank,
   every segment carries a hairline edge, a --space-2 gap of the card's own ground shows between them,
   and NO SEGMENT IS EVER LEFT TO COLOUR ALONE: the legend beneath names every one with its figure.
   That is the same rule `ChartBar` records, applied to a circle.

   ZERO IS NOT A SLICE. A category with no value is left out; a value the product does not KNOW is not
   passed at all. A zero-width arc that still holds a legend row states something untrue.

   ROUNDED CAPS AND A GAP, from the reference set: every ring that reads well at a glance has both, and
   every flush-segment ring reads as one solid shape until you look twice. */

const FONT = 'var(--font-ui)';
const TAU = Math.PI * 2;

/* An arc as an SVG path, drawn on the ring's centre-line as a stroke — a stroke takes `linecap` and a
   filled wedge does not, and the rounded cap is half of what makes this legible. */
function arcPath(cx, cy, r, a0, a1) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (a) => [cx + r * Math.cos(a - Math.PI / 2), cy + r * Math.sin(a - Math.PI / 2)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export function ChartDonut({
  slices = [], size = 168, thickness = 22, max = 5, otherLabel = 'Other',
  center, centerNote, valueFormat = (v) => `${v.toFixed(1)}%`,
  legend = true, selected = null, onSelect, run = true, caveat, label = 'Composition', leadChip = false,
}) {
  const clean = slices.filter((s) => s && typeof s.value === 'number' && s.value > 0);
  const ordered = clean.slice().sort((a, b) => b.value - a.value);
  const head = ordered.slice(0, max);
  const rest = ordered.slice(max);
  const rows = rest.length
    ? head.concat([{ label: `${otherLabel} · ${rest.length}`, value: +rest.reduce((t, s) => t + s.value, 0).toFixed(1), rest: true }])
    : head;
  const total = rows.reduce((t, s) => t + s.value, 0) || 1;

  const [on, setOn] = React.useState(!run);
  React.useEffect(() => { if (!run) return; const t = setTimeout(() => setOn(true), 20); return () => clearTimeout(t); }, [run]);

  const cx = size / 2, cy = size / 2, r = (size - thickness) / 2;
  const circumference = TAU * r;
  /* The gap is the card's own ground showing through rather than a painted line — the same trick the
     stacked bars use, and it survives any surface the chart is placed on. */
  const gapPx = 3;
  /* A ROUND CAP IS DRAWN OUTSIDE THE ARC IT CAPS, and that is a lie about the data if it is not paid
     for. `stroke-linecap: round` extends a stroke by half the stroke width BEYOND each endpoint, so an
     arc drawn flush from a0 to a1 paints `thickness` more ring than the value owns — at the default
     168/22 that is 17.2 degrees, 4.8% of the circle, added to every segment. A 6.2% slice was painting
     at 11% and overrunning its neighbours; the zoom showed the caps stacked on top of each other.
     So each arc is INSET by half a cap plus half a gap at both ends, and what the reader sees — cap
     included — is then exactly the value's own extent with the gap between. A segment too small to
     pay for its caps cannot be drawn round without overstating itself, so it gives them up and is
     drawn butt-capped at its true extent. It stays visible, and it stays honest. */
  const halfCap = thickness / 2 / r;
  const halfGap = gapPx / 2 / r;

  let acc = 0;
  const segs = rows.map((s, i) => {
    const frac = s.value / total;
    const a0 = acc * TAU, a1 = (acc + frac) * TAU;
    acc += frac;
    /* Round only when there is an ARC left to cap. Paying for two caps and having 3px of centre-line
       left turns a 6.2% slice into a circular blob that reads as a dot, not a segment — the first
       render of this fix did exactly that. So a segment goes round only if what remains after the
       insets is at least as long as the ring is thick; below that it takes butt caps and reads as a
       short clean band, which is the same shape the stacked bars already use for a small share. */
    const round = a1 - a0 > 2 * (halfCap + halfGap) + thickness / r;
    const inset = round ? halfCap + halfGap : halfGap;
    return { ...s, i, frac, a0, a1,
      d0: a0 + inset, d1: a1 - inset, cap: round ? 'round' : 'butt',
      color: s.rest ? 'var(--color-track)' : toneColor(s.tone, i),
      edge: s.rest ? 'var(--color-muted)' : edgeColor(s.tone, i) };
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox={`${leadChip ? -46 : 0} 0 ${size + (leadChip ? 92 : 0)} ${size}`} role="img" aria-label={`${label}: ${segs.map((s) => `${s.label} ${valueFormat(s.value)}`).join(', ')}`}>
          {/* The track, so a ring that does not sum to 100 reads as incomplete rather than as small. */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-chip)" strokeWidth={thickness} />
          {segs.map((s) => {
            /* The DRAWN length, not the value's length — the arc is inset for its caps, so a dash cut
               to the raw fraction would finish the draw-on before the stroke ended. */
            const len = Math.max((s.d1 - s.d0) * r, 1);
            const isSel = selected != null && selected === s.label;
            /* SELECTION PUSHES THE WEDGE OUT, it does not recolour it — the one move worth taking from
               the wider reference set, where a chosen slice is offset along its own mid-angle. Colour
               is already carrying rank here, so borrowing it for selection too would be two meanings
               in one channel; distance is free and rule 1 stays intact. */
            const mid = (s.a0 + s.a1) / 2 - Math.PI / 2;
            const push = isSel ? 5 : 0;
            const dx = Math.cos(mid) * push, dy = Math.sin(mid) * push;
            return (
              <g key={s.label} style={{ transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`, transition: `transform var(--dur-fast) var(--ease)` }}>
                <path d={arcPath(cx, cy, r, s.d0, s.d1)} fill="none" stroke={s.color}
                  strokeWidth={thickness} strokeLinecap={s.cap}
                  strokeDasharray={`${on ? len : 0} ${circumference}`}
                  style={{ transition: run ? `stroke-dasharray var(--dur-bar) var(--ease) ${s.i * 60}ms` : 'none' }} />
                {/* THE SEGMENT'S OWN EDGE, NOT A GENERIC HAIRLINE — this is what makes a pastel legal.
                    A pastel fill cannot clear 3:1 on a light page; its deeper sibling drawn along both
                    rims can and does, so the contour carries the contrast and the fill carries the
                    identity. A shared grey line would have left every segment at 1.3:1. */}
                <path d={arcPath(cx, cy, r + thickness / 2, s.d0, s.d1)} fill="none" stroke={s.edge} strokeWidth="1" opacity={on ? 1 : 0} strokeLinecap={s.cap} />
                <path d={arcPath(cx, cy, r - thickness / 2, s.d0, s.d1)} fill="none" stroke={s.edge} strokeWidth="1" opacity={on ? 1 : 0} strokeLinecap={s.cap} />
              </g>
            );
          })}
          {/* THE LEAD CHIP — a small label parked at the middle of the biggest arc, naming the one
              segment a reader should leave with. Taken from the reference set, where a ring almost
              always carries one figure ON the arc rather than only in a list. Only ever ONE, and only
              when that segment is large enough to hold it, because two chips on a 168px ring collide. */}
          {leadChip && segs.length > 0 && segs[0].frac >= 0.25 && (() => {
            const m = (segs[0].a0 + segs[0].a1) / 2 - Math.PI / 2;
            const lx = cx + (r + thickness / 2 + 12) * Math.cos(m);
            const ly = cy + (r + thickness / 2 + 12) * Math.sin(m);
            const anchor = lx < cx - 4 ? 'end' : lx > cx + 4 ? 'start' : 'middle';
            return (
              <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={anchor} dominantBaseline="middle"
                style={{ font: 'var(--type-meta-font)', fill: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {segs[0].label}
              </text>
            );
          })()}
        </svg>
        {/* The hole carries the answer — the one thing every reference in the set agrees on. */}
        {(center || centerNote) && (
          <div aria-hidden="true" style={{ marginLeft: -size, width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            {center && <span style={{ font: 'var(--type-figure-font)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>{center}</span>}
            {centerNote && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', textAlign: 'center', maxWidth: size - thickness * 2 }}>{centerNote}</span>}
          </div>
        )}
      </div>

      {/* THE LEGEND IS A LIST, NOT LABELS ON THE ARC. Every finance app in the reference set does this,
          and it is the only way a segment is never left to colour alone. */}
      {legend && (
        <div role="list" style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column' }}>
          {segs.map((s, i) => {
            const row = (
              <React.Fragment>
                {/* The dot is 8px — a pastel alone would be invisible there, so it carries its own
                    edge as a ring. Same rule as the arc, at a size where the ring is most of it. */}
                <span aria-hidden="true" style={{ flexShrink: 0, width: 'var(--space-8)', height: 'var(--space-8)', borderRadius: 'var(--radius-full)', background: s.color, boxShadow: `0 0 0 1px ${s.edge}` }} />
                <span style={{ flex: 1, minWidth: 0, font: 'var(--type-row-font)', color: 'var(--color-ink)' }}>{s.label}</span>
                <span style={{ flexShrink: 0, font: 'var(--type-row-strong-font)', color: 'var(--color-ink)', ...tabular }}>{valueFormat(s.value)}</span>
              </React.Fragment>
            );
            const style = { display: 'flex', alignItems: 'center', gap: 'var(--space-8)', width: '100%', minHeight: 'var(--h-row)', borderTop: i ? `var(--border-hairline) solid var(--color-line-soft)` : 'none', textAlign: 'left' };
            return onSelect
              ? <button key={s.label} role="listitem" type="button" onClick={() => onSelect(s.label)} style={{ ...style, background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>{row}</button>
              : <div key={s.label} role="listitem" style={style}>{row}</div>;
          })}
        </div>
      )}
      {caveat && <p style={{ margin: `var(--space-8) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{caveat}</p>}
    </div>
  );
}
