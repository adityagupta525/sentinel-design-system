import React from 'react';
import { linear, niceDomain, band, markColor, PLOT, AXIS_BAND, tabular } from './chartMath.jsx';
/* Vertical for time, horizontal for comparison. 24px maximum thickness, 4px rounded at the data end
   and square where it meets the baseline, values direct-labelled at the end in tabular figures.
   Growth is scaleY from transform-origin bottom (scaleX from left when horizontal), 480ms, staggered
   60ms down the rows, so an allocation assembles rather than appears.

   v11 · every bar in this chart sits directly on the page, so every bar must clear 3:1 against it — and
   measured, only ramp 1 does (6.59 / 7.24; ramp 2 is 2.57, ramp 3 is 1.66, ramp 4 is 1.30). So bars are
   ONE colour, from markColor. That is not a loss: rank in a bar chart is encoded by LENGTH, which is
   the strongest channel there is, and the ramp was encoding it a second time in a channel three
   quarters of which nobody can see. tone still overrides per bar for the one crossed limit. */
const FONT = 'var(--font-ui)';
const MAX_THICK = 24;
export function ChartBar({ bars = [], orientation = 'horizontal', density = 'expanded', tone = 'ramp', width = 311, valueFormat = (v) => `${v}%`, run = true, caveat }) {
  const peek = density === 'peek';
  const plot = PLOT[peek ? 'peek' : 'expanded'];
  const [on, setOn] = React.useState(!run);
  React.useEffect(() => { if (run) { const t = setTimeout(() => setOn(true), 20); return () => clearTimeout(t); } }, [run]);
  const [d0, d1] = niceDomain(0, Math.max(...bars.map((b) => b.value), 1), peek ? 2 : 4);
  if (orientation === 'vertical') {
    const labels = bars.map((b) => b.label);
    const x = band(labels, [0, width - 8], 0.34);
    const thick = Math.min(x.bandwidth(), MAX_THICK);
    const y = linear([d0, d1], [plot, 0]);
    return (
      <div style={{ width: '100%' }}>
        <div style={{ position: 'relative', height: plot, width: '100%' }}>
          {bars.map((b, i) => (
            <div key={b.label} style={{ position: 'absolute', left: x(b.label) + (x.bandwidth() - thick) / 2, bottom: 0, width: thick, height: Math.max(plot - y(b.value), 2), borderRadius: 'var(--radius-4, 4px) var(--radius-4, 4px) 0 0', background: markColor(b.tone || tone), transformOrigin: 'bottom', transform: on ? 'none' : 'scaleY(0)', transition: run ? 'transform var(--dur-bar) var(--ease)' : 'none', transitionDelay: run ? `${i * 60}ms` : '0ms' }} />
          ))}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: -0.5, height: 'var(--border-1)', background: 'var(--color-line)' }} />
        </div>
        <div style={{ position: 'relative', height: AXIS_BAND, width: '100%' }}>
          {bars.map((b) => (
            <span key={b.label} style={{ position: 'absolute', left: x(b.label), width: x.bandwidth(), textAlign: 'center', fontFamily: FONT, fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)', lineHeight: `${AXIS_BAND}px`, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{b.label}</span>
          ))}
        </div>
      </div>
    );
  }
  const rowH = peek ? 18 : 22;
  const barH = Math.min(rowH - 6, MAX_THICK);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: peek ? 4 : 8, width: '100%' }}>
      {bars.map((b, i) => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <span style={{ flex: '0 0 33%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 'var(--weight-medium)', fontSize: peek ? 11 : 12.5, lineHeight: `${rowH}px`, color: 'var(--color-ink)' }}>{b.label}</span>
            <span style={{ position: 'relative', flex: 1, minWidth: 0, height: rowH, display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-track)', boxShadow: 'inset 0 0 0 var(--border-hairline) var(--color-line)' }}>
              <span style={{ position: 'absolute', left: 0, top: (rowH - barH) / 2, height: barH, width: `${((b.value - d0) / (d1 - d0)) * 100}%`, borderRadius: '0 4px 4px 0', background: markColor(b.tone || tone), transformOrigin: 'left', transform: on ? 'none' : 'scaleX(0)', transition: run ? 'transform var(--dur-bar) var(--ease)' : 'none', transitionDelay: run ? `${i * 60}ms` : '0ms' }} />
            </span>
          {/* ONE RIGHT EDGE. The value span used to size to its own text, so "+6.1" and "+2.0" measured 19
              and 22 and the three TRACKS — which are flex: 1 — ended 4pt apart. Three bars that do not
              share a right edge read as a drawing rather than a scale, and it was visible in the artifact
              peek before it was measured. A shared minimum in `ch` (not px) holds the column at the width
              of four tabular figures, so every track ends at the same x and a longer value still grows. */}
          <span style={{ ...tabular, flexShrink: 0, minWidth: '4ch', textAlign: 'right', fontFamily: FONT, fontWeight: 'var(--weight-bold)', fontSize: peek ? 11 : 12.5, lineHeight: `${rowH}px`, color: 'var(--color-bronze-deep)' }}>{valueFormat(b.value)}</span>
        </div>
      ))}
      {caveat && <p style={{ margin: 'var(--space-2) 0 0', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{caveat}</p>}
    </div>
  );
}
