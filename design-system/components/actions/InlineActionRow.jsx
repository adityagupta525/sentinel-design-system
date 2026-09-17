import React from 'react';
import { Pill } from './Pill.jsx';
/* Not a card — no background, no radius, no padding. A flex-wrap row of Pills that follows a Sentinel reply.
   Pill owns the press state; the row owns the entrance (fade + rise, 60ms stagger — the same rhythm as ChipRow). */
export function InlineActionRow({ actions, animate = true }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
      {actions.map((a, i) => (
        <div key={a.label} style={animate ? { animation: 'ds-rise var(--dur-enter) var(--ease) both', animationDelay: `${i * 60}ms` } : undefined}>
          <Pill label={a.label} size="md" tone={a.tone || 'outline'} onClick={a.onClick} />
        </div>
      ))}
    </div>
  );
}
