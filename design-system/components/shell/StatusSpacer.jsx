import React from 'react';
/* 44px status bar: 9:41, signal, wifi, battery. Wifi glyph redrawn whole on 18 Sep 2026 — see the comment on it.
   v12 · `time` is a prop, because a screen can render a time of day and the clock could not follow.
   Found by building a screen, not by reading this file: screens/journey-b/01-home.html renders Home
   greeting the advisor good morning, good afternoon and good evening, and all three phones said 9:41.
   A specimen may hold a fixed clock; a screen showing a time-of-day state may not contradict itself.
   Default '9:41' so every render that exists today is unchanged — verified by hashing all 75 pages
   before and after. */
export function StatusSpacer({ time = '9:41' }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: 44, width: '100%', flexShrink: 0, alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 24px 6px', boxSizing: 'border-box' }}>
      <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', color: 'var(--color-ink)' }}>{time}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>{[6, 9, 12, 15].map((h) => <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: 'var(--color-ink)' }} />)}</div>
        {/* The wifi glyph, whole. Until 18 Sep 2026 the path drew only the RIGHT half of each arc
            (M8 2.5 → 13 4.6, M8 6 → 10.5 7) and a chevron for the dot, so on every phone the icon
            read as cut off at its left edge — the owner saw it on the screens and it was in every
            board and spec page too. Two symmetric arcs about x=8 and a dot; the stroke stays inside the
            16×12 box (2.5−0.65 … 13.5+0.65). Same size, same stroke, same colour: the icon is fixed,
            not restyled. */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M2.5 4.6C4 3.3 5.9 2.5 8 2.5s4 .8 5.5 2.1M5 7.2C5.9 6.4 6.9 6 8 6s2.1.4 3 1.2M8 9.8v.2" stroke="var(--color-ink)" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <div style={{ position: 'relative', height: 11, width: 22 }}><div style={{ position: 'absolute', inset: 0, borderRadius: 3, border: '1px solid var(--color-ink)', opacity: 0.4, boxSizing: 'border-box' }} /><div style={{ position: 'absolute', top: 1.5, bottom: 1.5, left: 1.5, right: 5, borderRadius: 1, background: 'var(--color-ink)' }} /></div>
      </div>
    </div>
  );
}
