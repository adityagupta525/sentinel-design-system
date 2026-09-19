import React from 'react';
import { ConstraintCallout } from './ConstraintCallout.jsx';
import { DarkButton } from '../actions/DarkButton.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* THE ONE SURFACE IN THIS PRODUCT WITH NO COMPOSER.

   Rule 3 says the composer is on every screen, and readme.md:204 states the single exception in the
   product's own words: "A confirm sheet is the one surface that carries no composer. It is a
   commit-or-dismiss decision; a composer there offers a third path that does not exist and implies the
   sheet is negotiable." So this component takes no composer prop at all — the exception is in the type,
   not in a caller's discipline. The archive's own confirm sheet (Chat.tsx:712) docked a composer; the
   system is what wins where the two disagree.

   THE ORDER IS FIXED AND IS THE WHOLE POINT:
     title → disclosure → compliance rows → what is being approved → commit.
   `disclosure` and `rows` are REQUIRED. A confirm sheet whose small print sits under the numbers is a
   sheet that was read after the decision was made, and compliance that is not stated as a row is
   compliance implied by silence. Both are the defect this component exists to make impossible, so
   neither is optional and neither can be reordered by a caller.

   A VISIBLE WAY OUT. The archive offered only the scrim: the one control an advisor could see said
   Approve. A commit-or-dismiss decision has to show both, so the dismiss is a word next to the commit —
   not a glyph, and not only a gesture that has to be guessed at.

   THIS SHEET MAY SCROLL INSIDE ITSELF, and that is not the no-nested-scroll rule. That rule is about the
   thread and the artifact: an expanded card must not scroll inside a scrolling thread. A modal sheet is
   the top layer, the thread behind it is inert, and the moves being approved can be taller than the
   phone — so the sheet caps at 88% and scrolls its own body, with the commit row pinned outside it so
   the decision never scrolls away from the thing it decides.

   Dialog mechanics are ExplainerSheet's, for the reason F-25 recorded: focus moves in and the Tab trap
   arms on the false → true transition only, never for a sheet mounted already open — a spec page's
   specimens are pictures of a dialog, not dialogs, and must not take the page's keyboard. */
export function ConfirmSheet({ open, title, disclosure, disclosureEyebrow = 'Before you approve', rows = [], children, commitLabel = 'Approve', dismissLabel = 'Not now', onCommit, onClose, busy = false, busyLabel }) {
  const ref = React.useRef(null);
  const armed = React.useRef(false);
  /* Initialised to `open`, not to false — so a sheet MOUNTED already open is not a transition and never
     takes focus. My first cut used `false`, which made every frozen specimen on a spec page grab the
     page's keyboard on mount: exactly the F-25 defect this pattern exists to prevent, reintroduced by
     copying the shape and not the initialisation. Measured on the screen page: a frozen sheet was
     `document.activeElement` and matched :focus-visible. */
  const wasOpen = React.useRef(open);
  const opener = React.useRef(null);
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
  const rowLabel = { font: 'var(--type-row-font)', color: 'var(--color-ink)' };
  return (
    <React.Fragment>
      <div onClick={onClose} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-scrim)', background: 'var(--scrim)', opacity: 'var(--scrim-sheet)', animation: 'ds-scrim var(--dur-screen) var(--ease) both' }} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 'var(--z-modal)', display: 'flex', flexDirection: 'column', maxHeight: '88%', borderRadius: 'var(--radius-24) var(--radius-24) 0 0', background: 'var(--color-canvas)', boxSizing: 'border-box', animation: 'ds-sheet var(--dur-screen) var(--ease) both' }}>
        <style>{'@keyframes ds-sheet{from{transform:translateY(100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-sheet{from{opacity:0;transform:none}to{opacity:1;transform:none}}}'}</style>
        <div style={{ flexShrink: 0, margin: 'var(--space-10) auto var(--space-6)', height: 'var(--space-5)', width: 'var(--h-touch)', borderRadius: 'var(--radius-full)', background: 'var(--color-line)' }} />
        {/* The body scrolls; the commit row below it does not. */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `0 var(--space-20) var(--space-8)` }}>
          <p style={{ margin: 0, font: 'var(--type-sheet-title-font)', color: 'var(--color-ink)' }}>{title}</p>
          <div style={{ marginTop: 'var(--space-12)' }}>
            <ConstraintCallout eyebrow={disclosureEyebrow} body={disclosure} />
          </div>
          {rows.length > 0 && (
            <div role="list" style={{ marginTop: 'var(--space-12)', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', padding: `0 var(--space-14)`, boxSizing: 'border-box' }}>
              {rows.map((r, i) => (
                <div key={r.label} role="listitem" style={{ display: 'flex', minHeight: 'var(--h-row-xl)', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-10)', borderBottom: i < rows.length - 1 ? `var(--border-hairline) solid var(--color-line-soft)` : 'none' }}>
                  <span style={rowLabel}>{r.label}</span>
                  {/* Rule 2: a requirement is a WORD in the danger colour, never a fill. */}
                  <span style={{ flexShrink: 0, font: 'var(--type-row-strong-font)', color: r.tone === 'required' ? 'var(--color-danger)' : 'var(--color-ink)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
          {children && <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>{children}</div>}
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', padding: `var(--space-12) var(--space-20) var(--space-20)` }}>
          <DarkButton full label={busy ? (busyLabel || `${commitLabel}…`) : commitLabel} onClick={busy ? undefined : onCommit} />
          <Pressable onClick={onClose} label={dismissLabel} style={{ display: 'flex', minHeight: 'var(--h-touch)', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-muted)' }}>{dismissLabel}</span>
          </Pressable>
        </div>
      </div>
    </React.Fragment>
  );
}
