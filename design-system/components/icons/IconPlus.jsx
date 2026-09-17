import React from 'react';
/* Path data verbatim from src/imports (Figma export), wrapped as in src/lib/icons.tsx. */
export function IconPlus({ stroke = 'var(--color-ink)', size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.70)} height={Math.round(size * 0.70)} viewBox="0 0 17.33 17.33" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M8.665 0.665V16.665M0.665 8.665H16.665" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
