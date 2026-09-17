import React from 'react';
import { CHART_RAMP, tabular, SEGMENT_GAP } from './chartMath.jsx';
import { ChartLegend } from './ChartLegend.jsx';
/* The pie, answered. A 100% stacked bar with a ranked legend beneath — the same information, and it
   reads at 375pt, in greyscale and in print, which a pie in this palette does not (the validator
   measured it: adjacent ramp pairs ΔE 11.4 against a floor of 15; a muted earthy trio collapses to
   ΔE 3.8 under protanopia).

   v11 · the segments carry the same perceivability problem the pie was rejected for, and no colour in
   this palette fixes it: measured, every separator candidate fails 3:1 against at least one ramp step
   (line 1.06, surface 1.42, muted 1.05, ink 2.25 at worst). So separation is by SHAPE and WORD — a
   --space-2 gap of the card's own background between segments, a --border-hairline edge around the
   bar, and a direct label on every segment. WCAG 1.4.11 exempts a graphic whose information is also
   present as text: the labels are that text, so the LABEL is the compliance mechanism and the gap is
   the perceptual aid. A segment with no label is a violation, not a style choice — so above two
   segments the legend is FORCED ON and the `legend` prop is ignored.

   AND THEREFORE: A PEEK SHARE CARRIES AT MOST TWO SEGMENTS. Forcing the legend on collided head-on
   with the 96pt peek budget — three legend rows measured a 99px block inside a 96px card, so the
   chart could neither legally drop the labels nor legally keep them. The resolution is not a smaller
   legend; it is fewer segments. `density="peek"` collapses the tail into one "Other" segment, so the
   bar is leader + Other, both DIRECT-labelled at the bar's ends, and the legend is unnecessary rather
   than suppressed — the label requirement is satisfied by the direct labels, which is the same reason
   `legend={false}` was always honoured at two segments or fewer. Peek is recognition, not reading:
   "Equity 71% · Other 29%" is the whole job of a 96pt preview, and the breakdown is one tap away in
   expanded. The guard then defers to density with no special case, because ranked.length <= 2 by
   construction. `legend` defaults to on when expanded and OFF at peek — without that the guard falls
   through to a `true` default after the collapse (ranked.length is 2, so the > 2 branch never fires)
   and the legend renders anyway: 77px measured where the contract said 30. Measured after: 8 + 6 + 15
   = 29px, two children (the direct-label row is --leading-15, not 16 — the first draft of this figure
   rounded it and was wrong by a pixel in the other direction). */
function collapse(ranked, total, otherLabel) {
  if (ranked.length <= 2) return ranked;
  const [lead] = ranked;
  const rest = ranked.slice(1).reduce((a, s) => a + s.value, 0);
  return [lead, { label: otherLabel, value: rest, other: true }];
}
export function ChartShare({ segments = [], density = 'expanded', height, legend, valueFormat = (v, pct) => `${pct.toFixed(0)}%`, run = true, caveat, otherLabel = 'Other' }) {
  const peek = density === 'peek';
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const sorted = segments.slice().sort((a, b) => b.value - a.value);
  const ranked = peek ? collapse(sorted, total, otherLabel) : sorted;
  const h = height || (peek ? 8 : 10);
  const [on, setOn] = React.useState(!run);
  React.useEffect(() => { if (run) { const t = setTimeout(() => setOn(true), 20); return () => clearTimeout(t); } }, [run]);
  /* The DEFAULT follows density, which is the whole point of collapsing: peek's two segments are
     direct-labelled at the bar's ends, so a legend there is a third row repeating what the row above
     it already says. Leaving `legend = true` as the default made the guard fall through to it after
     the collapse (ranked.length is 2, so the > 2 branch never fires) and the legend rendered anyway —
     77px where the contract said 30. Above two segments it is still forced on whatever the caller asks. */
  const showLegend = ranked.length > 2 ? true : (legend == null ? !peek : legend);
  return (
    <div style={{ width: '100%' }}>
      <div role="img" aria-label={ranked.map((s) => `${s.label} ${valueFormat(s.value, (s.value / total) * 100)}`).join(', ')}
        style={{ display: 'flex', width: '100%', height: h, gap: SEGMENT_GAP, borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--color-track)', boxShadow: 'inset 0 0 0 var(--border-hairline) var(--color-line)', transformOrigin: 'left', transform: on ? 'none' : 'scaleX(0)', transition: run ? 'transform var(--dur-bar) var(--ease)' : 'none' }}>
        {ranked.map((s, i) => (
          <span key={s.label} style={{ width: `calc(${(s.value / total) * 100}% - ${i ? 'var(--space-2)' : '0px'})`, background: s.tone === 'status' ? 'var(--color-status-over-fg)' : s.other ? 'var(--color-alloc-debt)' : CHART_RAMP[Math.min(i, CHART_RAMP.length - 1)] }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-8)', marginTop: 'var(--space-6)' }}>
        {ranked.slice(0, 1).map((s) => (
          <span key={s.label} style={{ ...tabular, font: 'var(--type-caption-font)', fontWeight: 'var(--weight-bold)', color: 'var(--color-bronze-deep)' }}>{s.label} {valueFormat(s.value, (s.value / total) * 100)}</span>
        ))}
        {ranked.length > 1 && (s => <span style={{ ...tabular, font: 'var(--type-caption-font)', fontWeight: 'var(--weight-medium)', color: 'var(--color-muted)' }}>{s.label} {valueFormat(s.value, (s.value / total) * 100)}</span>)(ranked[ranked.length - 1])}
      </div>
      {showLegend && (
        <div style={{ marginTop: 'var(--space-10)' }}>
          <ChartLegend items={ranked.map((s, i) => ({ label: s.label, value: valueFormat(s.value, (s.value / total) * 100), amount: s.value, step: Math.min(i + 1, 4) }))} />
        </div>
      )}
      {/* Monzo's rule: the caveat sits AT the number, not in a global footer. */}
      {caveat && <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{caveat}</p>}
    </div>
  );
}
