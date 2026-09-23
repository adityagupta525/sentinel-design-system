import React from 'react';
import { clientFaceFor } from '../brand/ClientAvatar.jsx';
/* The bound client, living in the composer. Tapping a client anywhere — the drawer's CLIENTS section,
   a picker sheet — does not navigate: it binds the next thread to that client and puts this chip in the
   composer. One mechanism, two entry points, and typing a name resolves to the same bound state.
   Removable by definition: a binding the advisor cannot undo in place is a trap. The ✕ carries a 44pt
   target even though the chip itself is 28px tall. */
export function ClientChip({ name, initial, avatar, onRemove, disabled = false }) {
  return (
    <span style={{ display: 'inline-flex', height: 'var(--h-chip-sm)', maxWidth: 200, alignItems: 'center', gap: 'var(--space-6)', borderRadius: 'var(--radius-full)', background: 'var(--color-chip)', boxShadow: '0 0 0 1px var(--color-line)', padding: onRemove ? '0 2px 0 4px' : '0 10px 0 4px', boxSizing: 'border-box', opacity: disabled ? 0.4 : 1 }}>
      {/* THE FACE BY DEFAULT, THE INITIAL WHEN THERE IS NO NAME TO DERIVE ONE FROM (23 Sep 2026).
          `avatar` was added first, so a caller could pass a face — and the owner's point was that a
          bound client in the composer is the same person as the row in the drawer, and should not
          depend on which screen remembered to pass one. `ClientAvatar` derives it from the name, the
          same function `ListRow` uses, so the two agree without either of them being told. An
          explicit `avatar` still wins, and it is clipped to the same 20pt disc either way, so a row
          of chips keeps one rhythm whichever it is given. */}
      <span style={{ display: 'flex', width: 20, height: 20, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--surface-avatar)', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-10)', color: 'var(--color-bronze-deep)' }}>
        {avatar
          || (clientFaceFor(name) ? <img src={clientFaceFor(name)} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : null)
          || initial || (name || '?').trim().charAt(0).toUpperCase()}
      </span>
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
