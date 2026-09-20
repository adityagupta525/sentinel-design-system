import React from 'react';
export function HomeIndicator({ tone = 'bronze' }) {
  return (
    /* `ds-homeindicator` is a hook, not a style, and its twin is on `StatusSpacer`. A build running on
       a real phone hides both, because the device draws the real ones in the same two places. */
    <div className="ds-homeindicator" style={{ position: 'relative', zIndex: 10, display: 'flex', height: 24, width: '100%', flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ height: 5, width: 134, borderRadius: 'var(--radius-full)', background: tone === 'dark' ? 'var(--color-ink)' : 'var(--color-bronze)', opacity: tone === 'dark' ? 0.8 : 1 }} />
    </div>
  );
}
