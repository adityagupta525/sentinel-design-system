import React from 'react';
import { Pill } from './Pill.jsx';
/* C2–C5 · answer chip.
   Without a subtitle it IS a <Pill size="md"> — kept as an alias because the journey vocabulary (src/journeys.tsx)
   speaks in AnswerChip variants. With a subtitle it becomes the full-width card chip, which is not a pill and is
   used only where the wording changes the meaning of the answer ("A monthly SIP instead — spread over months").
   Variant → Pill tone mapping is 1:1: outline · smart · tertiary · muted · primary. */
function Check() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.8 5 9.3l5.5-5.6" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CardChip({ label, subtitle, selected, onClick }) {
  const [down, setDown] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ appearance: 'none', border: 'none', cursor: 'pointer', display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-3)', borderRadius: 'var(--radius-16)', padding: '11px 14px', textAlign: 'left', background: selected ? 'var(--color-selected)' : 'var(--color-bubble)', boxShadow: `0 0 0 1px ${selected ? 'var(--color-bronze)' : 'var(--color-bubble-edge)'}`, transform: down ? 'scale(0.98)' : 'none', transition: 'transform var(--dur-press) var(--ease), background-color var(--dur-press)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-19)', color: 'var(--color-ink)' }}>{label}{selected && <Check />}</span>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: 'var(--color-muted)' }}>{subtitle}</span>
    </button>
  );
}
export function AnswerChip({ label, subtitle, variant = 'outline', selected = false, onClick }) {
  if (subtitle) return <CardChip label={label} subtitle={subtitle} selected={selected} onClick={onClick} />;
  return <Pill label={label} size="md" tone={variant} selected={selected} onClick={onClick} />;
}
