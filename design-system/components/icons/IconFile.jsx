import React from 'react';
/* Lucide "file" (ISC). 24px grid, stroke 1.5 at 20px rendered — Lucide's 2px default is too heavy
   beside a 1px hairline divider. Geometry unmodified. */
export function IconFile({ stroke = 'var(--color-muted)', size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    </span>
  );
}
