import React from 'react';
/* Path data verbatim from src/imports (Figma export), wrapped as in src/lib/icons.tsx. */
export function IconAttach({ stroke = 'var(--color-muted)', size = 18 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 12.3683 13.7241" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M11.7033 6.89579L6.45329 12.1458C5.79837 12.7495 4.93535 13.0765 4.04483 13.0584C3.15431 13.0402 2.30531 12.6784 1.67548 12.0486C1.04566 11.4188 0.683831 10.5698 0.665715 9.67924C0.647598 8.78872 0.974598 7.9257 1.57829 7.27079L7.57829 1.27079C7.96616 0.882908 8.49224 0.665 9.04079 0.665C9.58933 0.665 10.1154 0.882908 10.5033 1.27079C10.8912 1.65867 11.1091 2.18474 11.1091 2.73329C11.1091 3.28183 10.8912 3.80791 10.5033 4.19579L4.87828 9.82079" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
