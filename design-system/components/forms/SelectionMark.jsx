import React from 'react';
/* Radio and checkbox forms. These are drawn inside the component that uses them — they are not icons,
   so they take no size or stroke overrides and never appear on their own. 20px box, 1.5px stroke. */
export function SelectionMark({ kind, selected = false, disabled = false }) {
  const ring = selected ? 'var(--color-bronze)' : 'var(--color-line)';
  const base = { display: 'inline-flex', width: 20, height: 20, flexShrink: 0, alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', opacity: disabled ? 0.4 : 1, transition: 'background-color var(--dur-press) var(--ease)' };
  if (kind === 'radio') {
    return (
      <span style={{ ...base, borderRadius: 'var(--radius-full)', boxShadow: `inset 0 0 0 1.5px ${ring}` }}>
        {selected && <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)' }} />}
      </span>
    );
  }
  return (
    <span style={{ ...base, borderRadius: 'var(--radius-6)', background: selected ? 'var(--color-bronze)' : 'transparent', boxShadow: selected ? 'none' : `inset 0 0 0 1.5px ${ring}` }}>
      {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-surface)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-9" /></svg>}
    </span>
  );
}
