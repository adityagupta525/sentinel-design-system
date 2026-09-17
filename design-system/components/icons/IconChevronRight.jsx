import React from 'react';
/* Path data verbatim from src/imports (Figma export), wrapped as in src/lib/icons.tsx. */
export function IconChevronRight({ stroke = 'var(--color-bronze)', size = 15 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.73)} height={Math.round(size * 0.73)} viewBox="0 0 15 15" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M5.625 11.25L9.375 7.5L5.625 3.75" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
