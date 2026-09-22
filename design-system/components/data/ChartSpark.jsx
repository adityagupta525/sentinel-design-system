import React from 'react';
import { linePath, markColor } from './chartMath.jsx';
/* A LINE SMALL ENOUGH TO LIVE IN A ROW — and the component `DataTable` has been promising since v1.

   `DataTable`'s contract declares a `sparkline` column kind and its ALIGN table has an entry for it,
   and nothing in this system could draw one: a caller reaching for that kind had to pass a node the
   system did not have. Same shape of gap as F-52, where seven files asked for a type role that was
   never published. Found on 22 Sep 2026 while mapping what the fund explorer needs.

   EVERY FUND LIST IN THE MARKET HAS ONE. Yahoo Finance runs a 1D chart column, Shopee puts a curve
   behind each fund's return, Bloomberg tints and Angel One sparks. The reason is not decoration: a
   number says where a fund ENDED and a spark says how it GOT there, and two funds on the same
   three-year return with different paths are not the same fund.

   IT IS A SINGLE MARK AGAINST THE PAGE, so it takes `markColor` — series-1 and nothing else. The
   ramp's later steps are for marks that separate from each other by edge and label; a 56px line in a
   table row has neither.

   NO AXIS, NO GRID, NO LABEL — that is what makes it a spark rather than a chart. The number it sits
   beside is the label. The one mark it may carry is the LAST point, because "where it ended" is the
   one thing a reader looks for and the eye should not have to hunt along the line for it. */

export function ChartSpark({ points = [], width = 56, height = 18, tone = 'ramp', endDot = true, label }) {
  const vals = points.filter((v) => typeof v === 'number');
  if (vals.length < 2) return <span style={{ display: 'inline-block', width, height }} aria-hidden="true" />;
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  const pad = 2;
  const x = (i) => (i / (vals.length - 1)) * (width - pad * 2) + pad;
  const y = (v) => height - pad - ((v - lo) / span) * (height - pad * 2);
  /* linePath takes [x, y] PAIRS, not {x, y} objects — it reads p[0] and p[1]. Passing objects gives
     a path of NaN, which the browser rejects silently except in the console. Caught by the render
     gate, not by reading. */
  const pts = vals.map((v, i) => [x(i), y(v)]);
  const d = linePath(pts);
  const last = pts[pts.length - 1];
  const color = markColor(tone);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img"
      aria-label={label || `${vals.length} points, ending ${vals[vals.length - 1]}`}
      style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {endDot && <circle cx={last[0]} cy={last[1]} r="2" fill={color} />}
    </svg>
  );
}
