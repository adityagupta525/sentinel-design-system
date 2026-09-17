import React from 'react';
/* Lucide "loader-circle" (ISC). 24px grid, stroke 1.5 at 20px rendered — Lucide's 2px default is too heavy
   beside a 1px hairline divider. Geometry unmodified. */
export function IconSpinner({ stroke = 'var(--color-bronze-deep)', size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0, animation: 'ds-spin 900ms linear infinite' }}>
      <style>{'@keyframes ds-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){@keyframes ds-spin{from{transform:none}to{transform:none}}}'}</style>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </span>
  );
}
