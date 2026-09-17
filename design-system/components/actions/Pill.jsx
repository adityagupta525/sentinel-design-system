import React from 'react';
/* The one tappable pill. Two sizes, no third. Visual height 36 (md) / 32 (sm); the tap target is always ≥44
   via a transparent pseudo-element that extends the hit area vertically — callers cannot get it wrong. */
const SIZES = { md: { h: 36, px: 13, font: 12, lh: 18 }, sm: { h: 32, px: 12, font: 12, lh: 16 } };
const TONES = {
  outline: { bg: 'var(--color-chip)', ring: 'var(--color-bubble-edge)', fg: 'var(--color-bronze-deep)' },
  smart: { bg: 'var(--color-bubble)', ring: 'var(--color-bubble-edge)', fg: 'var(--color-bronze-deep)' },
  tertiary: { bg: 'transparent', ring: null, dashed: true, fg: 'var(--color-bronze-deep)' },
  muted: { bg: 'var(--color-chip)', ring: 'var(--color-bubble-edge)', fg: 'var(--color-bronze-deep)', fgOpacity: 0.6 },
  primary: { bg: 'var(--color-selected)', ring: 'var(--color-bubble-edge)', fg: 'var(--color-ink)' },
  filter: { bg: 'var(--color-chip)', ring: 'var(--color-line)', fg: 'var(--color-bronze-deep)' },
};
const SELECTED = { bg: 'var(--color-selected)', ring: 'var(--color-bronze)', fg: 'var(--color-ink)' };
function Glyph({ kind }) {
  if (kind === 'check') return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.8 5 9.3l5.5-5.6" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (kind === 'tertiary') return <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-13)', lineHeight: 1, color: 'var(--color-bronze-deep)' }}>?</span>;
  if (kind === 'smart') return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2.5" width="11" height="8" rx="1.5" stroke="var(--color-bronze-deep)" strokeWidth="1.1" /><path d="M3.2 5.2h2.2M3.2 7.2h4.4" stroke="var(--color-bronze-deep)" strokeWidth="1.1" strokeLinecap="round" /></svg>;
  return null;
}
/* Loading: the label HOLDS — the pill never becomes a spinner with no words, and it never changes width
   mid-press, which would move the thing under the finger. The glyph slot carries a 13px bronze spinner
   and the label drops to 60%; the press target and the width stay exactly as they were. Inert while
   loading, but not dimmed like `disabled`: a pill waiting on the network is working, not unavailable. */
function Spinner({ fg }) {
  return (
    <span style={{ display: 'inline-flex', width: 13, height: 13, flexShrink: 0, animation: 'ds-spin 900ms linear infinite' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2.6" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    </span>
  );
}
export function Pill({ label, size = 'md', tone = 'outline', selected = false, onClick, disabled = false, loading = false }) {
  const [down, setDown] = React.useState(false);
  const s = SIZES[size], t = selected ? SELECTED : TONES[tone];
  const hit = Math.max(0, (44 - s.h) / 2);
  const inert = disabled || loading;
  return (
    <button type="button" onClick={inert ? undefined : onClick} disabled={inert} className="ds-pill" aria-busy={loading || undefined}
      onPointerDown={() => !inert && setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ position: 'relative', appearance: 'none', border: 'none', cursor: inert ? 'default' : 'pointer', display: 'inline-flex', height: s.h, flexShrink: 0, alignItems: 'center', gap: 'var(--space-6)', borderRadius: 'var(--radius-full)', padding: `0 ${s.px}px`, background: t.bg, boxShadow: t.ring ? `0 0 0 1px ${t.ring}` : 'none', outline: t.dashed ? '1px dashed var(--tint-bronze-dashed)' : 'none', outlineOffset: -1, opacity: disabled ? 0.4 : 1, transform: down ? 'scale(0.98)' : 'none', transition: 'transform var(--dur-press) var(--ease), background-color var(--dur-press)', '--hit': `${hit}px` }}>
      <style>{'.ds-pill::before{content:"";position:absolute;left:0;right:0;top:calc(-1 * var(--hit));bottom:calc(-1 * var(--hit))}'}</style>
      {loading ? <Spinner fg={t.fg} /> : selected ? <Glyph kind="check" /> : <Glyph kind={tone} />}
      <span style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: s.font, lineHeight: `${s.lh}px`, color: t.fg, opacity: loading ? 0.6 : t.fgOpacity || 1 }}>{label}</span>
    </button>
  );
}
