import React from 'react';
/* Lucide "download" (ISC). 24px grid, stroke 1.5 at 20px rendered — Lucide's 2px default is too heavy
   beside a 1px hairline divider. Geometry unmodified. */
export function IconDownload({ stroke = 'var(--color-bronze-deep)', size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
    </span>
  );
}
