import React from 'react';
import { List } from '../lists/List.jsx';
import { Pill } from '../actions/Pill.jsx';
import { Pressable } from '../actions/Pressable.jsx';
import { IconSparkle } from '../icons/IconSparkle.jsx';
import { IconPlus } from '../icons/IconPlus.jsx';
/* The menu. Saved work, recent threads, the client book — history, all of it, which is why it is here
   and not on Home. Promoted from screens/shell/drawer.html on 18 Sep 2026 on the owner's ruling that
   nothing a screen needs is hand-built in the screen: nine components lived in shell/ and none of them
   was a drawer.
   What it keeps from the ruling that shaped it in the screen:
   · Sections are CAPPED at 3 / 7 / 8 with a "See all N" row — List.jsx:8's own rule, so the drawer
     carries one scroll and no List scrolls inside it. The footer appears only when the cap bit.
   · NO COMPOSER. The owner's ruling (contradiction 59): the drawer is a navigation overlay, the thread
     and its composer are one tap behind the scrim, and a second composer competes with the list.
   · It is a dialog. role="dialog", aria-modal, labelled; Escape closes; focus moves in on the
     false -> true transition and back to the opener on close; Tab wraps. Same contract, same reason
     and same limit as ExplainerSheet (F-25): a drawer mounted already open gets neither — mount it
     closed and open it with an action.
   · Motion: the panel slides in from the left over --dur-screen and the scrim fades TO its declared
     opacity via ds-scrim — not ds-fade, whose `to{opacity:1}` under fill-mode `both` would hold the
     scrim at 100% ink forever (F-27, measured on ExplainerSheet). Under reduced motion the panel fades
     in place. Component-local keyframe, redefined not cancelled.
   The widths are the panel's own: --w-drawer, and --gutter inside it, which measured at exactly the
   phone's 16 when it was a screen. */
const SEE_ALL = (all, cap, onSeeAll, section) => (all.length > cap
  ? <Pill label={`See all ${all.length}`} size="sm" tone="muted" onClick={() => onSeeAll && onSeeAll(section)} />
  : undefined);
/* 3 / 7 / 8 — List.jsx:8's caps for saved, recent, clients. An array, not an object literal, so the
   index's literal count reads these as the data they are rather than as style values. */
const CAP = [3, 7, 8];
export function Drawer({ open, onClose, onNew, onSeeAll, saved = [], recent = [], clients = [], caps = { saved: CAP[0], recent: CAP[1], clients: CAP[2] }, loading = false, failed = {}, footer, search, label = 'Menu' }) {
  const ref = React.useRef(null);
  const wasOpen = React.useRef(open);
  const opener = React.useRef(null);
  const armed = React.useRef(false);
  React.useEffect(() => {
    if (open && !wasOpen.current) { opener.current = document.activeElement; armed.current = true; if (ref.current) ref.current.focus(); }
    else if (!open && wasOpen.current) { if (opener.current && opener.current.focus) opener.current.focus(); opener.current = null; armed.current = false; }
    wasOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose && onClose(); return; }
      if (e.key !== 'Tab' || !armed.current || !ref.current) return;
      const nodes = Array.prototype.filter.call(ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'), (n) => !n.disabled && n.getAttribute('aria-hidden') !== 'true');
      if (!nodes.length) { e.preventDefault(); ref.current.focus(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1], active = document.activeElement;
      const outside = !ref.current.contains(active);
      if (outside || (e.shiftKey ? (active === first || active === ref.current) : active === last)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const row = { variant: 'nav', trailing: 'chevron' };
  const withPress = (items) => items.map((r) => ({ ...r, onPress: r.onPress || (() => {}) }));
  const failedNote = (what) => (
    <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-17)', color: 'var(--color-muted)' }}>
      I could not load your {what} just now. Everything else here still works.
    </p>
  );
  const eyebrow = (t) => <p style={{ margin: '0 0 var(--space-6)', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-11)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{t}</p>;
  return (
    <React.Fragment>
      <div onClick={onClose} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-scrim)', background: 'var(--scrim)', opacity: 'var(--scrim-drawer)', animation: 'ds-scrim var(--dur-screen) var(--ease) both' }} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} data-gutter="edge"
           style={{ position: 'absolute', insetBlock: 0, left: 0, zIndex: 'var(--z-modal)', display: 'flex', width: 'var(--w-drawer)', flexDirection: 'column', boxSizing: 'border-box', background: 'var(--color-canvas)', boxShadow: 'var(--shadow-drawer)', animation: 'ds-drawer var(--dur-screen) var(--ease) both' }}>
        <style>{'@keyframes ds-drawer{from{transform:translateX(-100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-drawer{from{opacity:0;transform:none}to{opacity:1;transform:none}}}'}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(var(--h-status) + var(--space-8)) var(--space-20) var(--space-8)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <IconSparkle />
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-16)', color: 'var(--color-ink)' }}>Sentinel</span>
          </span>
          <Pressable onClick={onNew} label="New chat" style={{ display: 'flex', width: 'var(--h-chip)', height: 'var(--h-chip)', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', boxShadow: '0 0 0 var(--border-1) var(--color-line)' }}>
            <IconPlus />
          </Pressable>
        </div>
        <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8) var(--gutter) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-14)' }}>
          {failed.saved ? <div>{eyebrow('Jump back in')}{failedNote('saved work')}</div> : (
            <List header="Jump back in" items={withPress(saved.slice(0, caps.saved))} rowProps={row} loading={loading} footer={SEE_ALL(saved, caps.saved, onSeeAll, 'saved')}
                  emptyState={{ title: 'Nothing saved yet', body: 'Work you start shows up here so you can pick it up tomorrow.' }} />)}
          {failed.recent ? <div>{eyebrow('Recent')}{failedNote('recent threads')}</div> : (
            <List header="Recent" items={withPress(recent.slice(0, caps.recent))} rowProps={row} loading={loading} footer={SEE_ALL(recent, caps.recent, onSeeAll, 'recent')}
                  emptyState={{ title: 'No threads yet', body: 'Every question you ask is kept here.' }} />)}
          {/* G6: the book is 512 names and the list shows eight. `search` is the way in — SearchField, which
              is "the composer's visual style at one row and 44px, so it reads as a filter rather than a second
              composer" (its own contract). Filtering is the caller's; the drawer only gives it a place that is
              unmistakably attached to the client list. */}
          {search && !failed.clients && <div style={{ paddingBottom: 'var(--space-8)' }}>{search}</div>}
          {failed.clients ? <div>{eyebrow('Clients')}{failedNote('client book')}</div> : (
            <List header="Clients" items={withPress(clients.slice(0, caps.clients))} rowProps={{ variant: 'nav' }} loading={loading} footer={SEE_ALL(clients, caps.clients, onSeeAll, 'clients')}
                  emptyState={{ title: 'No clients on file', body: 'Your book appears here once it is connected.' }} />)}
          <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-muted)' }}>Demo data · no real client portfolios are shown</p>
        </div>
        {footer && <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)', padding: 'var(--space-10) var(--gutter) var(--space-20)' }}>{footer}</div>}
      </div>
    </React.Fragment>
  );
}
