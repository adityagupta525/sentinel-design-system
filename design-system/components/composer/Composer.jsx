import React from 'react';
import { IconAttach } from '../icons/IconAttach.jsx';
import { IconArrow } from '../icons/IconArrow.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* The ask bar — present on every screen. Bronze focus ring, 150ms. streaming = Stop in the send slot.
   F-28 (18 Sep 2026): both buttons in the send slot were a glyph with no name — a 13px square and an
   arrow — so a screen reader announced "button" for the two most important controls on the screen.
   aria-label "Stop" / "Send"; nothing visible changes. */
/* `bound` — THE CLIENT THIS THREAD IS ABOUT, sitting above the field (19 Sep 2026).
   `ClientChip`'s contract has said since v9 that it is "composer-resident" and that "the drawer's
   client tap and a journey's client picker produce the same chip in the same place; typing a name
   resolves to the same state, so selection and typing are one flow, not two." The composer had no slot
   for it, so the chip was on no screen and the sentence was a promise with nowhere to land. This is
   that slot. Leave it off and the composer renders exactly as before. */
export function Composer({ value = '', onChange, onFocus, onSend, placeholder = 'Ask Sentinel', autoFocus = false, streaming = false, onStop, onAttach, attachLabel = 'Attach a file', accept, bound }) {
  const [focus, setFocus] = React.useState(false);
  const fileRef = React.useRef(null);
  const canSend = value.trim().length > 0 && !streaming;
  /* One disc, two renderings — the wired button and the inert drawing are the same 42pt circle, so they
     cannot drift apart. Identical to what shipped before `onAttach` existed. */
  const disc = { display: 'flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 22, background: 'var(--color-surface)', boxShadow: '0 0 0 1px var(--color-line)' };
  const btn = { appearance: 'none', border: 'none', cursor: 'pointer', display: 'flex', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--gradient-dark-cta)', padding: 0 };
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-20)', background: 'var(--color-surface)', padding: 'var(--space-12)', boxSizing: 'border-box', border: `1px solid ${focus ? 'var(--color-bronze)' : 'var(--color-line)'}`, boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-composer)', transition: 'box-shadow var(--dur-press), border-color var(--dur-press)' }}>
      {bound && <div style={{ marginBottom: 'var(--space-8)', display: 'flex' }}>{bound}</div>}
      <input value={value} autoFocus={autoFocus} onChange={(e) => onChange && onChange(e.target.value)} onFocus={() => { setFocus(true); onFocus && onFocus(); }} onBlur={() => setFocus(false)} onKeyDown={(e) => e.key === 'Enter' && canSend && onSend && onSend()} placeholder={placeholder}
        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }} className="ds-composer-input" />
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 'var(--space-2)' }}>
        {/* THE ATTACH DISC WAS A <div> — drawn in the archive and carried here verbatim, so the paperclip
            on every screen in the product was a picture of a control. FileUpload has been in the system
            since v7 with its staged parse, and nothing could open it. 18 Sep 2026, the owner's ruling:
            it works. Give `onAttach` and the disc becomes a real button with a hidden file input behind
            it; leave it off and the disc renders EXACTLY as before, pixel for pixel, because a control
            that is announced and does nothing is worse than a drawing that is honest about being one. */}
        {onAttach ? (
          <React.Fragment>
            <input ref={fileRef} type="file" accept={accept} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) onAttach(f); e.target.value = ''; }} style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <span data-attach="live" style={{ display: 'flex' }}>
              <Pressable onClick={() => fileRef.current && fileRef.current.click()} label={attachLabel} expand="none" style={disc}><IconAttach /></Pressable>
            </span>
          </React.Fragment>
        ) : (
          /* data-attach lets the screens harness tell a real paperclip from a drawing of one without
             guessing at an svg. `inert` is legitimate on a board or a spec page and a defect on a screen. */
          <div data-attach="inert" style={disc}><IconAttach /></div>
        )}
        {streaming ? (
          <button type="button" onClick={onStop} aria-label="Stop" style={btn}><span aria-hidden="true" style={{ width: 13, height: 13, borderRadius: 3, background: 'var(--color-surface)' }} /></button>
        ) : (
          <button type="button" onClick={() => canSend && onSend && onSend()} disabled={!canSend} aria-label="Send" style={{ ...btn, opacity: canSend ? 1 : 0.4, cursor: canSend ? 'pointer' : 'default' }}><IconArrow /></button>
        )}
      </div>
    </div>
  );
}
