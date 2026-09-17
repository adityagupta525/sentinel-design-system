import React from 'react';
/* Aura wash + paper texture, sampled from the source frame. */
export function ScreenBackdrop() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--color-canvas)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--paper-texture)', backgroundSize: 'var(--paper-texture-size)' }} />
      <div style={{ position: 'absolute', left: -93, top: -105, width: 320, height: 320, borderRadius: '50%', background: 'var(--aura-bronze)' }} />
      <div style={{ position: 'absolute', right: -120, top: -40, width: 320, height: 320, borderRadius: '50%', background: 'var(--aura-shadow)' }} />
    </div>
  );
}
