import React from 'react';
/* Path data verbatim from src/imports (Figma export), wrapped as in src/lib/icons.tsx. */
export function IconMenu({ stroke = 'var(--color-ink)', size = 18 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 18 18" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M3.0006 3.7494H14.9994M3.0006 9H14.9994M3.0006 14.2506H14.9994" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
