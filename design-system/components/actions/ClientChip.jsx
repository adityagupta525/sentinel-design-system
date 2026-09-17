import React from 'react';
/* The bound client, living in the composer. Tapping a client anywhere — the drawer's CLIENTS section,
   a picker sheet — does not navigate: it binds the next thread to that client and puts this chip in the
   composer. One mechanism, two entry points, and typing a name resolves to the same bound state.
   Removable by definition: a binding the advisor cannot undo in place is a trap. The ✕ carries a 44pt
   target even though the chip itself is 28px tall. */
export function ClientChip({ name, initial, onRemove, disabled = false }) {
  return (
    <span style={{ display: 'inline-flex', height: 'var(--h-chip-sm)', maxWidth: 200, alignItems: 'center', gap: 'var(--space-6)', borderRadius: 'var(--radius-full)', background: 'var(--color-chip)', boxShadow: '0 0 0 1px var(--color-line)', padding: onRemove ? '0 2px 0 4px' : '0 10px 0 4px', boxSizing: 'border-box', opacity: disabled ? 0.4 : 1 }}>
      <span style={{ display: 'flex', width: 20, height: 20, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--surface-avatar)', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-10)', color: 'var(--color-bronze-deep)' }}>{initial || (name || '?').trim().charAt(0).toUpperCase()}</span>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-ink)' }}>{name}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} disabled={disabled} aria-label={`Unbind ${name}`}
          style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: disabled ? 'default' : 'pointer', display: 'flex', width: 44, height: 44, margin: '0 -12px 0 -4px', flexShrink: 0, alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </span>
  );
}
