import React from 'react';
/* Lucide "info" (ISC). 24px grid, stroke 1.5 — matches the other four additions. Geometry unmodified.
   This glyph is the one exception to the text-before-a-glyph rule, and only inside InfoDot: ⓘ beside a
   figure is a convention an advisor already reads, and the words it would otherwise need ("what is
   this?") would crowd the figure it is attached to. */
export function IconInfo({ stroke = 'var(--color-muted)', size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    </span>
  );
}
