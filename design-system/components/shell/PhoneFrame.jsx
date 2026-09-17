import React from 'react';
/* 375 × 812 device frame, 44px radius. */
export function PhoneFrame({ children }) {
  return (
    <div style={{ position: 'relative', width: 375, height: 812, overflow: 'hidden', borderRadius: 'var(--radius-44)', background: 'var(--color-canvas)', boxShadow: 'var(--shadow-phone), 0 0 0 1px var(--ring-frame)' }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>{children}</div>
    </div>
  );
}
