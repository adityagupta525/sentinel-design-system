import React from 'react';
/* Lucide "circle-check" (ISC). 24px grid, stroke 1.5 at 20px rendered — Lucide's 2px default is too heavy
   beside a 1px hairline divider. Geometry unmodified. */
export function IconCheckCircle({ stroke = 'var(--color-status-ok-fg)', size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </span>
  );
}
