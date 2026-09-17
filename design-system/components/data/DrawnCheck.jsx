import React from 'react';
/* Step 7 · the drawn-check success mark — no confetti. */
export function DrawnCheck({ size = 22 }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)', width: size, height: size, flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12" fill="none"><path d="M2.2 6.2 4.8 8.8 9.8 3.2" stroke="var(--color-surface)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: 'ds-draw 400ms var(--ease) forwards' }} /></svg>
      <style>{'@keyframes ds-draw{to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){@keyframes ds-draw{from{stroke-dashoffset:0;opacity:0}to{stroke-dashoffset:0;opacity:1}}}'}</style>
    </span>
  );
}
