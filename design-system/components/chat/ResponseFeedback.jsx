import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* Marking an answer wrong. Sentinel had nothing, anywhere — for a product whose whole value is the
   quality of its answers, and whose answers an advisor is expected to defend to a client, that is the
   gap worth closing even though it is the least visible thing in this pass.

   The mechanism is Mindvalley's Eve AI: 👍/👎 at the foot of a response. Two things change here.
   No emoji — the system's rule — so the glyphs are drawn at the icon set's 24px grid / 1.5px stroke.
   And confirmation happens ON THE CONTROL that was pressed, never as a toast: the pressed thumb fills
   bronze and the row says "Noted", in place, because the no-toasts law means the acknowledgement has
   nowhere else to go.

   Down is not symmetrical with up, and it should not be. An advisor marking an answer wrong has a
   reason, and the reason is the whole value of the signal — so down opens a short reason row
   (existing Pill chips, not a free-text field: a field asks for an essay between meetings). Up is one
   tap and done. */
const Thumb = ({ down, active }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', transform: down ? 'rotate(180deg)' : 'none' }}>
    <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3zm0 0 4.5-7a2 2 0 0 1 3.6 1.5L14 10h4.8a2 2 0 0 1 2 2.5l-1.7 7A2 2 0 0 1 17.1 21H7"
      stroke={active ? 'var(--color-bronze-deep)' : 'var(--color-muted)'} fill={active ? 'var(--color-selected)' : 'none'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const REASONS = ['The number is wrong', 'Not what I asked', 'Missing a holding', 'Too long'];
export function ResponseFeedback({ value, onRate, onReason, reasons = REASONS, note }) {
  const [rating, setRating] = React.useState(value || null);
  const [reason, setReason] = React.useState(null);
  const rate = (v) => { setRating(v); if (onRate) onRate(v); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', margin: `calc(-1 * var(--space-4)) 0 calc(-1 * var(--space-6))` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
        <Pressable onClick={() => rate(rating === 'up' ? null : 'up')} pressed={rating === 'up'} label="This answer was right"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--h-chip-sm)', height: 'var(--h-chip-sm)' }}>
          <Thumb active={rating === 'up'} />
        </Pressable>
        <Pressable onClick={() => rate(rating === 'down' ? null : 'down')} pressed={rating === 'down'} label="Something is wrong with this answer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--h-chip-sm)', height: 'var(--h-chip-sm)' }}>
          <Thumb down active={rating === 'down'} />
        </Pressable>
        {rating && <span role="status" style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{rating === 'up' ? 'Noted' : reason ? 'Noted · ' + reason : 'Noted — what was wrong?'}</span>}
      </div>
      {rating === 'down' && !reason && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
          {reasons.map((r) => (
            <Pressable key={r} onClick={() => { setReason(r); if (onReason) onReason(r); }} label={`Reason: ${r}`}
              style={{ display: 'inline-flex', height: 'var(--h-filter-chip)', alignItems: 'center', padding: `0 var(--space-12)`, borderRadius: 'var(--radius-full)', background: 'var(--color-chip)', boxShadow: `0 0 0 var(--border-1) var(--color-line)` }}>
              <span style={{ font: 'var(--type-label-font)', color: 'var(--color-bronze-deep)', whiteSpace: 'nowrap' }}>{r}</span>
            </Pressable>
          ))}
        </div>
      )}
      {note && <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-data-deemph)' }}>{note}</p>}
    </div>
  );
}
