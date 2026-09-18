import React from 'react';
/* Partner (advisor) bubble — peach, right-aligned, 20px radius with a 6px tail corner.
   overflowWrap 'anywhere' because an advisor pastes scheme codes and ISINs. A hyphenated code wraps on
   its own; one unbroken token ran straight out of the bubble's own background and past the 280pt cap
   (F-18). It changes nothing for prose, which breaks at spaces long before it reaches this. */
/* EDITING IN PLACE (18 Sep 2026, the owner's ruling: "last prompt edit — everywhere, not one screen").
   `MessageActions role="user"` has offered Edit since v1 and nothing on any screen could receive it, because
   there was no edited state to go to. It is in place, in the bubble, the way the advisor already knows it
   from every other assistant — not a modal, and not the composer quietly filling up behind the thread.

   Three things the state has to get right, and each is a rule this system already holds:
     · The FIELD IS THE BUBBLE. Same peach, same edge, same 14/19 semibold — only the corner un-tails and
       the width is released, because a field that is narrower than the text is a field you cannot read.
     · Cancel and Send are WORDS, not glyphs and not ghost pills — MessageActions' own rule, one line up.
       44pt of target comes from padding, and the padding is pulled back so the optical spacing holds.
     · `costNote` says what sending will DESTROY, before it is destroyed. MessageActions' contract already
       required this ("Editing this reopens question 7…"); until now there was nowhere to render it.
   The caller owns the text: this is a controlled field, so a half-typed edit cannot survive a re-render
   that the caller did not intend. */
/* Roughly 38 characters fit a line at 14/19 inside 343 minus the bubble's own padding — measured, and
   capped at six lines so a pasted paragraph cannot push the composer off the screen. It is a text
   measurement, not a spacing value: there is no token for "how many characters fit". */
const rowsFor = (text) => Math.min(6, String(text).split('\n').length + Math.ceil(String(text).length / 38));
export function UserBubble({ text, editing = false, onChange, onCancel, onSave, saveLabel = 'Send', cancelLabel = 'Cancel', costNote, editLabel = 'Edit your question' }) {
  const bubble = { borderRadius: editing ? 'var(--radius-20)' : '20px 20px 6px 20px', background: 'var(--color-bubble)', padding: '10px 12px', boxShadow: '0 0 0 1px var(--color-bubble-edge)', boxSizing: 'border-box' };
  const type = { fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-19)', color: 'var(--color-ink)', overflowWrap: 'anywhere' };
  const action = (label, strong, onClick) => (
    <button type="button" onClick={onClick} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', minHeight: 'var(--h-touch)', padding: 'var(--space-12) var(--space-2)', font: 'var(--type-meta-font)', color: strong ? 'var(--color-bronze-deep)' : 'var(--color-muted)' }}>{label}</button>
  );
  if (editing) {
    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ ...bubble, width: '100%' }}>
          <textarea value={text} onChange={(e) => onChange && onChange(e.target.value)} rows={rowsFor(text)} aria-label={editLabel} autoFocus
            style={{ ...type, display: 'block', width: '100%', resize: 'none', border: 'none', outline: 'none', background: 'transparent', padding: 0, boxSizing: 'border-box' }} />
        </div>
        {costNote && <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-caption-font)', color: 'var(--color-muted)', textAlign: 'right' }}>{costNote}</p>}
        <div style={{ display: 'flex', gap: 'var(--space-16)', margin: 'calc(-1 * var(--space-8)) 0 calc(-1 * var(--space-10))' }}>
          {action(cancelLabel, false, onCancel)}
          {action(saveLabel, true, onSave)}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', animation: 'ds-rise var(--dur-enter) var(--ease) both' }}>
      <div style={{ ...bubble, maxWidth: 280 }}>
        <p style={{ margin: 0, ...type }}>{text}</p>
      </div>
    </div>
  );
}
