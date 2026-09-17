import React from 'react';
/* Path data verbatim from src/imports (Figma export), wrapped as in src/lib/icons.tsx. */
export function IconArrow({ stroke = 'var(--color-surface)', size = 18 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 13.33 11.83" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M0.665 5.915H12.665M7.415 11.165L12.665 5.915L7.415 0.665" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
