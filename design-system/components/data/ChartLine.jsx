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
  /* F-51(d), CLOSED 20 Sep 2026 — BY MEASURING THE LABEL INSTEAD OF ASSUMING IT.
     Three earlier attempts each guessed at the free side and each left a label on its own stroke;
     measured on screens/journey-c/funds, EIGHT of twelve labels sat across the line they named. The
     cause was not the side-finding — it was the height. Placement reserved `h` = 44 (a value plus TWO
     wrapped lines of name) while the real box, for a short name like "Benchmark", measures 29. Two
     stacked labels were asked to find a 90px clear band in a 180px plot when they needed 60, so the
     search failed and the clamp parked them on the line.
     So: render, measure, place. `hs` is null on the first pass and the reserved estimate is used, which
     is exactly what shipped before; the layout effect then measures each box and re-places with the
     real numbers. A label-placement routine that does not know how tall its label is cannot work for
     every series shape, and that is what the three guesses were really discovering. */
  const labelRefs = React.useRef([]);
  const [hs, setHs] = React.useState(null);
  React.useLayoutEffect(() => {
    const els = labelRefs.current.slice(0, use.length);
    const got = els.map((el) => (el ? Math.round(el.getBoundingClientRect().height) : 0));
    /* The WIDEST label is the column the ink has to clear. Reserving `labelW` instead measures a band
       half again as wide as the label actually is — 62 against a real 41 on the index card — and a
       wider window means a taller ink band and a placement pushed further than it needed to be. */
    const wid = Math.max(0, ...els.map((el) => (el ? Math.round(el.getBoundingClientRect().width) : 0)));
    const next = { h: got, w: wid };
    if (got.length && got.every((n) => n > 0)
      && (!hs || hs.w !== wid || hs.h.length !== got.length || got.some((n, i) => n !== hs.h[i]))) setHs(next);
  });
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
            /* The RESERVE, used only until the boxes have been measured once. */
            const hEst = peek ? 16 : 44;       /* value, plus up to two lines of series name */
            const hOf = (i) => (hs && hs.h[i] ? hs.h[i] : hEst);
            const gap = peek ? 5 : 7;
            /* THE FREE SIDE IS FOUND OVER THE LABEL'S OWN WIDTH, NOT FROM ONE SEGMENT (F-51).
               The old test compared the last point with the one before it. On a sixty-point monthly
               series that rises steeply at the end, "below the endpoint" is exactly where the line just
               came from — so the label sat on its own stroke, which is the one thing this block's
               comment promises never happens. Measured on screens/journey-c/funds.
               Now: take the slice of the line the label would cover, and put the label clear of that
               slice's whole vertical extent. */
            /* THE LARGEST EMPTY BAND — and this is what F-51(d) was asking for.
               Every earlier attempt, mine included, treated the ink under the label as ONE band from
               the highest point to the lowest, and then looked for room above it or below it. On two
               lines that run far apart that band is the whole plot and neither side has room — which
               is exactly the case that kept failing. But the ink is TWO STROKES, and the space between
               them is empty. Measured on pages/ChartLine: strokes at 16–40 and 155–164 in a 180px
               plot, and 115px of nothing in between that three passes threw away.

               So: take each series' vertical extent over the label's own column, merge the ones that
               overlap, and put the stack in the largest gap — above the top stroke, below the bottom
               one, or between them. That is one rule for every shape (rising, falling, V, spike,
               crossing) instead of a side-preference plus two special cases, and a label sits on ink
               only when no gap in the plot is tall enough to hold it.

               `cover` uses the MEASURED label width, and the stack uses the MEASURED heights — the
               routine cannot place a box whose size it is guessing at, which is what the three earlier
               attempts were really discovering. */
            const cover = Math.max(2, Math.round(use[0].points.length * ((hs && hs.w ? hs.w : labelW) / w)));
            const spans = use.map((s) => {
              const ys = s.points.slice(-cover).map((q) => y(q.y));
              return [Math.min(...ys), Math.max(...ys)];
            }).sort((a, b) => a[0] - b[0]);
            const merged = spans.reduce((acc, sp) => {
              const last = acc[acc.length - 1];
              if (last && sp[0] <= last[1] + gap) last[1] = Math.max(last[1], sp[1]);
              else acc.push([sp[0], sp[1]]);
              return acc;
            }, []);
            const heights = use.map((s, i) => hOf(i));
            const total = heights.reduce((a, n) => a + n, 0) + (heights.length - 1) * 2;
            /* Every gap in the plot, in order: above the first stroke, between each pair, below the
               last. A gap is usable from `gap` past the ink above it to `gap` before the ink below. */
            const gaps = [];
            gaps.push([0, Math.max(0, merged[0][0] - gap)]);
            for (let i = 1; i < merged.length; i++) gaps.push([merged[i - 1][1] + gap, Math.max(0, merged[i][0] - gap)]);
            gaps.push([merged[merged.length - 1][1] + gap, plot]);
            const room = (g) => g[1] - g[0];
            const fits = gaps.filter((g) => room(g) >= total);
            /* THE NEAREST GAP THAT FITS, NOT THE LARGEST. Taking the largest is clear of the ink and
               puts the label a long way from the line it names — on the five-year fund card it parked
               "This fund" 110px below the end of the fund's own line, and the whole point of an end
               label is that identity and value sit AT the end of the line. So among the gaps that
               hold the stack, take the one whose middle is closest to where the lines actually end.
               Failing all of them, the largest gap, clamped — deterministic either way, and the spec
               page documents the case where no gap is tall enough. */
            const ends = use.map((sr) => y(sr.points[sr.points.length - 1].y));
            const aim = ends.reduce((a, n) => a + n, 0) / ends.length;
            const mid = (g) => (g[0] + g[1]) / 2;
            const pick = fits.length
              ? fits.reduce((a, g) => (Math.abs(mid(g) - aim) < Math.abs(mid(a) - aim) ? g : a))
              : gaps.reduce((a, g) => (room(g) > room(a) ? g : a));
            /* Inside the chosen gap, sit as close to the endpoints as the gap allows. */
            const want = Math.min(Math.max(aim - total / 2, pick[0]), Math.max(pick[1] - total, pick[0]));
            let run = Math.min(Math.max(want, 0), Math.max(plot - total, 0));
            const placed = use.map((s, i) => {
              const top = run;
              run += heights[i] + 2;
              return { last: s.points[s.points.length - 1], h: heights[i], top };
            });
            return use.map((s, i) => {
            const last = placed[i].last;
            const top = placed[i].top;
            return (
              <div key={s.label} ref={(el) => { labelRefs.current[i] = el; }} style={{ position: 'absolute', right: 0, top, maxWidth: labelW, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', pointerEvents: 'none' }}>
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
