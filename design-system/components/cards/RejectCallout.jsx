import React from 'react';
import { ConstraintCallout } from './ConstraintCallout.jsx';
import { Pill } from '../actions/Pill.jsx';
/* Bucket-2 rejection: peach callout + the ways out as chips. */
export function RejectCallout({ eyebrow, body, chips = [], onChip }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <ConstraintCallout eyebrow={eyebrow} body={body} />
      {chips.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>{chips.map((c) => <Pill key={c} label={c} onClick={() => onChip && onChip(c)} />)}</div>}
    </div>
  );
}
