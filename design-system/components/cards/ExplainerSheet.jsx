import React from 'react';
import { Pill } from '../actions/Pill.jsx';
/* C20 · explainer bottom sheet — 24px top radius, 44×5 grabber, "Got it" primary chip.
   v12 · IT IS A DIALOG, AND IT DID NOT SAY SO. Measured in a browser, not read off the source: the
   sheet was an anonymous <div> with no role, no aria-modal and no label; Escape did nothing; and
   opening it left focus on the control that opened it, outside the scrim. The scrim is a <div> with
   onClick, so it was never a keyboard exit either — the only way out was to Tab forward until "Got it"
   came round. None of that is visible, which is why it lasted twelve versions.
   Focus moves on the false -> true TRANSITION only, never on mounting already-open: a spec page
   renders six open specimens, and each one grabbing focus on mount would fight the others.
   No `outline: none` on the dialog root: a programmatic .focus() on tabIndex={-1} does not satisfy
   :focus-visible, so no ring is painted anyway — and switching the browser's indicator off with
   nothing in its place is the exact mistake Pressable was corrected for in v11. Verified rendered.
   F-25 (18 Sep 2026) · TAB IS TRAPPED, WRAPPING AT THE BOUNDARY. aria-modal="true" tells assistive
   technology there is nothing outside the sheet; until this, a keyboard could still Tab out of it into
   the thread behind the scrim — measured on the spec page, where Tab from the live sheet's "Got it"
   landed on a static specimen's "Got it" and Shift+Tab landed on the opener. That is the contract
   lying. Tab on the last control goes to the first, Shift+Tab on the first (or on the dialog root) goes
   to the last; with one control, both keys keep it. If focus is somehow outside, Tab brings it back
   in — that is what modal means. The trap is ARMED by the same false -> true transition that moves
   focus in, and never for a sheet mounted already open: the spec page renders six of those, and a
   specimen that trapped would swallow the page's keyboard the moment Tab reached its "Got it" (it did,
   in the first cut of this fix — measured, then changed). A sheet that opened is a dialog; a sheet
   that was mounted open is a picture of one, and pictures do not take the keyboard. */
export function ExplainerSheet({ open, title, body, onClose }) {
  const ref = React.useRef(null);
  const wasOpen = React.useRef(open);
  const opener = React.useRef(null);
  const armed = React.useRef(false);
  React.useEffect(() => {
    if (open && !wasOpen.current) {
      opener.current = document.activeElement;
      armed.current = true;
      if (ref.current) ref.current.focus();
    } else if (!open && wasOpen.current) {
      if (opener.current && opener.current.focus) opener.current.focus();
      opener.current = null;
      armed.current = false;
    }
    wasOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose && onClose(); return; }
      if (e.key !== 'Tab' || !armed.current || !ref.current) return;
      const nodes = Array.prototype.filter.call(
        ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        (n) => !n.disabled && n.getAttribute('aria-hidden') !== 'true');
      if (!nodes.length) { e.preventDefault(); ref.current.focus(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1], active = document.activeElement;
      const outside = !ref.current.contains(active);
      if (outside || (e.shiftKey ? (active === first || active === ref.current) : active === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      {/* F-27 (18 Sep 2026): this was `opacity: 0.4` with `ds-fade … both`, and `both` holds the keyframe's
          final value — 1 — so the scrim computed to opacity 1 and the phone behind every open sheet went
          black. ds-scrim fades to the element's OWN opacity, so the declared value is the rendered one.
          Measured after the fix: 0.4. */}
      <div onClick={onClose} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-scrim)', background: 'var(--scrim)', opacity: 'var(--scrim-sheet)', animation: 'ds-scrim var(--dur-screen) var(--ease) both' }} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30, borderRadius: '24px 24px 0 0', background: 'var(--color-surface)', padding: '12px 20px 28px', animation: 'ds-sheet 300ms var(--ease) both' }}>
        <style>{'@keyframes ds-sheet{from{transform:translateY(100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-sheet{from{opacity:0;transform:none}to{opacity:1;transform:none}}}'}</style>
        <div style={{ margin: '0 auto 14px', height: 5, width: 44, borderRadius: 'var(--radius-full)', background: 'var(--color-line)' }} />
        <p style={{ margin: 0, ...{ font: 'var(--type-sheet-title-font)', color: 'var(--color-ink)' } }}>{title}</p>
        <div style={{ marginTop: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>{body.map((p, i) => <p key={i} style={{ margin: 0, ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink-soft)' } }}>{p}</p>)}</div>
        <div style={{ marginTop: 18 }}><Pill label="Got it" tone="primary" onClick={onClose} /></div>
      </div>
    </>
  );
}
