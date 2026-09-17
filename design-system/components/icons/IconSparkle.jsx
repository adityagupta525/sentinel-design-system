import React from 'react';
/* Path data verbatim from src/imports (Figma export), wrapped as in src/lib/icons.tsx. */
export function IconSparkle({ stroke = 'var(--color-bronze-deep)', size = 18 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 12.58 12.205" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M6.29 0.665L7.715 4.865L11.915 5.915L7.715 7.34L6.29 11.54L4.86501 7.34L0.665005 5.915L4.86501 4.865L6.29 0.665Z" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
