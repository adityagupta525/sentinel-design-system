import React from 'react';
import { linear, niceDomain, ticks, linePath, areaPath, markColor, PLOT, AXIS_BAND, tabular } from './chartMath.jsx';
import { ChartReadout } from './ChartReadout.jsx';
/* One or two series, never three — three or more is small multiples (one chart each, same scale,
   stacked down the card), because a third line would have to encode identity in a hue and this palette
   cannot. Both series end-labelled directly — the end label carries the value AND the series name, so
   there is no legend and no second label row: the block is plot + axis band and nothing else (194 at
   expanded, inside the 208 budget; 86 at peek, inside the 96 card). Stroke 2px round caps; series 2
   dashed 4-2, muted, drawn behind. Area fill (--tint-bronze-06) only on a single series. Baseline only
   — no gridlines — with one dashed line when there is a target to draw.
   Draw-on is stroke-dashoffset, the system's one named motion exception: ≤600ms, ease-out, first
   reveal only, never on a re-render, and nothing under prefers-reduced-motion.
   v11: both strokes come from markColor, so a line always clears 3:1 against the page — ramp 1 for
   the client's own series (6.59 / 7.24) and --color-muted for the benchmark (6.26 / 6.88), which also
   separates the two from each other. The old muted (--color-data-deemph, 2.52) drew an invisible line. */
const FONT = 'var(--font-ui)';
/* One decimal, because every figure in this product carries one — 18.4%, 12.1%, −14.2% — and because
   a default of `${v}%` printed 14.600000000000000075 on the fund card the first time a caller passed a
   computed series. A chart that renders whatever float it is handed is a chart an advisor cannot read
   out to a client. */
const oneDecimal = (v) => `${Number(v).toFixed(1)}%`;
export function ChartLine({ series = [], density = 'expanded', tone = 'ramp', target, width = 311, valueFormat = oneDecimal, xFormat = (x) => String(x), scrub = false, run = true, domain }) {
  const peek = density === 'peek';
  const plot = PLOT[peek ? 'peek' : 'expanded'];
  const labelBand = peek ? 14 : AXIS_BAND;
  const use = series.slice(0, 2);
  const [tip, setTip] = React.useState(null);
  const drawn = React.useRef(false);
  React.useEffect(() => { drawn.current = true; }, []);
  const animate = run && !drawn.current;
  /* v12 · THE PLOT IS THE FULL WIDTH OF THE CARD. It used to reserve a 34/62px gutter on the right
     and park the end label in it, which left the line, the baseline and the x-axis ending short of
     every other edge in the card — the title, the range pills and the stat rows all ran full width
     and the chart alone stopped early. Two stray edges, and the chart read as a pasted-in object
     rather than part of the card.
     The label now sits ON the plot at the end of the line, which is what the comment below always
     claimed it did. `labelW` is only how wide that overlay may grow before it wraps. */
  const labelW = peek ? 34 : 62;
  const w = Math.max(80, width);
  const all = use.flatMap((s) => s.points.map((p) => p.y));
  /* An explicit domain is how small multiples share one scale — without it each chart would nice its
     own range and three charts that look comparable would not be. */
  let [d0, d1] = domain || niceDomain(Math.min(...all, target ? target.value : Infinity), Math.max(...all, target ? target.value : -Infinity), peek ? 2 : 4);
  /* A target that lands on the domain floor would draw its dashed rule underneath the baseline, where
     nobody can see it. Drop the floor by one whole tick step — still on the grid, and the target reads. */
  if (target && !domain && target.value <= d0 + (d1 - d0) * 0.02) {
    const t = ticks(d0, d1, peek ? 2 : 4);
    d0 -= t.length > 1 ? t[1] - t[0] : (d1 - d0) / 4;
  }
  const xs = use[0] ? use[0].points.map((p) => p.x) : [0, 1];
  const x = linear([Math.min(...xs), Math.max(...xs)], [1, w - 1]);
  const y = linear([d0, d1], [plot - 1, 1]);
  const pts = (s) => s.points.map((p) => [x(p.x), y(p.y)]);
  const idx = tip == null ? (use[0] ? use[0].points.length - 1 : 0) : tip;
  const active = use[0] ? use[0].points[idx] : null;
  const svgRef = React.useRef(null);
  const onMove = (e) => {
    if (!scrub || !use[0]) return;
    const el = svgRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const rel = Math.min(Math.max(e.clientX - box.left, 0), box.width);
    const step = box.width / Math.max(use[0].points.length - 1, 1);
    setTip(Math.min(Math.round(rel / step), use[0].points.length - 1));
  };
  return (
    <div style={{ width: '100%' }}>
      {scrub && !peek && <div style={{ marginBottom: 'var(--space-6)' }}><ChartReadout label={active ? xFormat(active.x) : ''} value={active ? valueFormat(active.y) : ''} active={tip != null} /></div>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 0 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0, touchAction: 'pan-y' }} onPointerDown={onMove} onPointerMove={(e) => tip != null && onMove(e)} onPointerUp={() => setTip(null)} onPointerLeave={() => setTip(null)}>
          <svg ref={svgRef} width="100%" height={plot} viewBox={`0 0 ${w} ${plot}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
            <style>{'@keyframes ds-draw-on{to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){@keyframes ds-draw-on{from{stroke-dashoffset:0;opacity:0}to{stroke-dashoffset:0;opacity:1}}}'}</style>
            {target && <line x1="0" x2={w} y1={y(target.value)} y2={y(target.value)} stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />}
            {use.length === 1 && <path d={areaPath(pts(use[0]), plot - 1)} fill="var(--tint-bronze-06)" />}
            {use.slice().reverse().map((s, ri) => {
              const i = use.length - 1 - ri;
              const second = i === 1;
              return <path key={s.label} d={linePath(pts(s))} fill="none" vectorEffect="non-scaling-stroke"
                stroke={second ? markColor('muted') : markColor(s.tone || tone)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={second ? '4 2' : animate ? '1000' : undefined} strokeDashoffset={second ? undefined : animate ? 1000 : undefined}
                style={!second && animate ? { animation: 'ds-draw-on 600ms cubic-bezier(0.2,0.8,0.2,1) both' } : undefined} />;
            })}
            <line x1="0" x2={w} y1={plot - 0.5} y2={plot - 0.5} stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {scrub && tip != null && active && <line x1={x(active.x)} x2={x(active.x)} y1="0" y2={plot - 1} stroke="var(--color-bronze-deep)" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
          </svg>
          {/* End labels sit AT the end of each line, ON the plot: identity and value in one place, so
              the block costs plot + axis band and nothing more.
              Which SIDE of the endpoint they sit on is read from the line itself. A line arriving from
              below leaves the space above its end empty, and vice versa — so the label goes to the
              empty side and never lies across the stroke it is labelling. Right-aligned to the plot
              edge, where the last point already is. */}
          {(() => {
            /* TWO LABELS THAT LAND ON EACH OTHER (F-50, 19 Sep 2026). Each label used to be placed from
               its OWN line's direction, independently. When both series rise and end close together —
               a fund and its benchmark ending ₹184 apart on a ₹21,500 scale, which is the normal case
               for an index fund — both wanted the same slot and OVERPRINTED: "₹21,368" over "₹21,552",
               "Nifty 50 TRI" over "This fund", neither readable. Measured on screens/journey-c/funds.
               Resolved in two passes: place them the old way, then push the SECOND series (the
               benchmark, already the muted one) clear of the first. The primary never moves, so the
               series the advisor came for keeps the slot its own line earned. */
            /* THE NAME MAY TAKE TWO LINES, AND THE BOX RESERVES THEM (F-51, 19 Sep 2026). `h` was 30
               — a value plus ONE line of name — and Indian benchmark names are long: "Nifty Smallcap
               250 TRI" wrapped to three lines, overflowed the reserved box, and the plot's own stroke
               ran straight through the words. Measured on pages/InfoCard.html.
               Two lines is the cap, not a suggestion: a third line is a name the caller should shorten,
               and clamping is better than letting a chart draw over its own label. */
            const h = peek ? 16 : 44;          /* value, plus up to two lines of series name */
            const gap = peek ? 5 : 7;
            /* THE FREE SIDE IS FOUND OVER THE LABEL'S OWN WIDTH, NOT FROM ONE SEGMENT (F-51).
               The old test compared the last point with the one before it. On a sixty-point monthly
               series that rises steeply at the end, "below the endpoint" is exactly where the line just
               came from — so the label sat on its own stroke, which is the one thing this block's
               comment promises never happens. Measured on screens/journey-c/funds.
               Now: take the slice of the line the label would cover, and put the label clear of that
               slice's whole vertical extent. */
            const cover = Math.max(2, Math.round(use[0].points.length * (labelW / w)));
            const placed = use.map((s) => {
              const pts = s.points.slice(-cover);
              const ys = pts.map((q) => y(q.y));
              const lo = Math.min(...ys), hi = Math.max(...ys);   /* lo = highest on screen */
              const last = s.points[s.points.length - 1];
              const above = lo - gap - h;
              const below = hi + gap;
              /* Either side if it fits. When NEITHER does — a line that climbs through most of the
                 plot over the label's width — take the side with more room rather than defaulting,
                 which used to clamp the label to 0 and park it at the very top, on the line. */
              const roomAbove = lo, roomBelow = plot - hi;
              const wanted = above >= 0 ? above
                : below + h <= plot ? below
                : roomAbove >= roomBelow ? above : below;
              return { last, top: Math.min(Math.max(wanted, 0), plot - h) };
            });
            /* WHEN THE TWO END CLOSE TOGETHER, BOTH LABELS GO TO ONE SIDE (F-51). Pushing only the
               second one apart, which is what the first pass did, left the FIRST sitting on its own
               line — the exact thing this block's own comment promises never happens. A fund and its
               benchmark ₹184 apart on a ₹21,500 scale is the normal case for an index fund, and there
               is no empty side between them to use. So both stack BELOW the lower endpoint, in series
               order, and above it only when there is no room below. */
            if (placed.length === 2 && Math.abs(placed[0].top - placed[1].top) < h + 2) {
              const ends = placed.map((q) => y(q.last.y));
              const lower = Math.max(ends[0], ends[1]);
              const upper = Math.min(ends[0], ends[1]);
              const below = lower + gap;
              if (below + h * 2 + 2 <= plot) {
                placed[0].top = below;
                placed[1].top = below + h + 2;
              } else {
                const top0 = upper - gap - h * 2 - 2;
                placed[0].top = Math.max(top0, 0);
                placed[1].top = placed[0].top + h + 2;
              }
              placed.forEach((q) => { q.top = Math.min(Math.max(q.top, 0), plot - h); });
            }
            return use.map((s, i) => {
            const last = placed[i].last;
            const top = placed[i].top;
            return (
              <div key={s.label} style={{ position: 'absolute', right: 0, top, maxWidth: labelW, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', pointerEvents: 'none' }}>
                <span style={{ ...tabular, fontFamily: FONT, fontWeight: 'var(--weight-bold)', fontSize: peek ? 'var(--text-11-5)' : 'var(--text-12)', lineHeight: 'var(--leading-15)', color: i === 1 ? 'var(--color-data-deemph)' : 'var(--color-bronze-deep)' }}>{valueFormat(last.y)}</span>
                {!peek && <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'break-word', fontFamily: FONT, fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-10)', lineHeight: 'var(--leading-14)', color: i === 1 ? 'var(--color-data-deemph)' : 'var(--color-muted)' }}>{s.label}</span>}
              </div>
            );
            });
          })()}
        </div>
      </div>
      <div style={{ display: 'flex', height: labelBand, alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        {peek ? (
          <React.Fragment>
            <span style={{ fontFamily: FONT, fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-14)', color: 'var(--color-muted)' }}>{use[0] ? xFormat(use[0].points[0].x) : ''}</span>
            <span style={{ fontFamily: FONT, fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-14)', color: 'var(--color-muted)' }}>{use[0] ? xFormat(use[0].points[use[0].points.length - 1].x) : ''}</span>
          </React.Fragment>
        ) : (
          /* Two labels: first x and last x. This used to map over `ticks(d0, d1, 2)` — the Y domain's
             ticks — to decide how many X labels to draw, so the count of one axis was set by the other.
             When that call returned a single tick the trailing label silently vanished, which is what
             the fund card showed: a chart that started at 1 and ended nowhere. Same two labels as the
             peek branch above; only the tabular numerals differ. */
          [0, 1].map((i) => (
            <span key={i} style={{ ...tabular, fontFamily: FONT, fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-14)', color: 'var(--color-muted)' }}>
              {use[0] ? xFormat(use[0].points[i === 0 ? 0 : use[0].points.length - 1].x) : ''}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
/* Three or more series: one chart per series, same scale, stacked down the card. Never three colours. */
export function ChartLineMultiples({ series = [], width = 311, valueFormat, xFormat, tone = 'ramp' }) {
  const all = series.flatMap((s) => s.points.map((p) => p.y));
  const domain = niceDomain(Math.min(...all), Math.max(...all), 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-14)' }}>
      {series.map((s) => (
        <div key={s.label}>
          <p style={{ margin: '0 0 4px', font: 'var(--type-meta-font)', color: 'var(--color-ink)' }}>{s.label}</p>
          <ChartLine series={[{ ...s }]} domain={domain} density="peek" tone={tone} width={width} valueFormat={valueFormat} xFormat={xFormat} run={false} />
        </div>
      ))}
    </div>
  );
}
