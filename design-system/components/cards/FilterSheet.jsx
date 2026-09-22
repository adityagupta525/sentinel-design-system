import React from 'react';
import { Pill } from '../actions/Pill.jsx';
import { DarkButton } from '../actions/DarkButton.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* THE FILTER SHEET — batch, not live; bands, not sliders; and the count rides the button.

   Three findings decided every part of this, and each came from measured evidence rather than taste.

   BATCH, NOT LIVE. NN/g's mobile guidance is explicit that a phone should filter in a batch — a tray
   that re-renders the list behind it on every tap spends a page load per tap on a connection that is
   usually worse than the designer's. So the sheet holds its selections and commits once, and the commit
   carries the number: Coin's "View 1,731 funds", Airbnb's "Show 45 homes". Baymard calls a live count on
   the apply control one of the highest-impact things a filter interface can do, and the second is a
   count beside each option — which is why `count` sits on every option and is not optional decoration.

   BANDS, NOT SLIDERS. GoldenPi and IndiaBonds both run three or four NAMED bands where a desktop tool
   would put a range slider — "AAA (Low risk) / AA (Balanced) / A and below (High yield)", "Up to 8% /
   8–11% / 11%+" — and they are right: a slider on a phone is a fine motor task that an advisor cannot do
   mid-call, and it produces a number ("0.63%") where the advisor thinks in a band ("under 0.7"). Every
   option here is a chip, which is also the only shape that can carry its own count.

   APPLIED FILTERS STAY VISIBLE. Baymard measured that a fifth of sites hide what is currently applied.
   Worse here than in retail: an advisor has to be able to read the applied filters ALOUD to a client, so
   they are removable chips at the top of the sheet AND the caller is expected to keep them on the list
   behind it. Google's AI Mode and Zillow set filter state the user never sees; that is the anti-pattern
   this component is built against.

   ZERO IS A SENTENCE, NOT A DISABLED BUTTON. When nothing matches, the commit says so and offers the one
   thing that helps — Redfin's recovery, which relaxes a criterion in words rather than dead-ending. The
   button stays operable so the advisor can still close the sheet and see what they asked for.

   THE TAB TRAP IS THE THIRD COPY IN THIS SYSTEM (ConfirmSheet, ExplainerSheet, here) and arms on the
   false → true transition only, never for a sheet mounted already open — F-25. Three hand-written copies
   is three chances to drift; extracting it is recorded in FINDINGS.md rather than done here, because
   changing two shipped dialogs to prove a new one is the wrong order. */

export function FilterSheet({
  open, title = 'Filters', groups = [], value = {}, onChange,
  resultCount = null, unit = 'funds', onApply, onClose, onClearAll,
}) {
  const ref = React.useRef(null);
  const armed = React.useRef(false);
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
        (n) => !n.disabled && n.tabIndex >= 0 && n.getAttribute('aria-hidden') !== 'true');
      if (!nodes.length) { e.preventDefault(); ref.current.focus(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1], active = document.activeElement;
      const outside = !ref.current.contains(active);
      if (outside || (e.shiftKey ? (active === first || active === ref.current) : active === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);
  if (!open) return null;

  const isOn = (g, opt) => {
    const v = value[g.key];
    return g.mode === 'multi' ? Array.isArray(v) && v.includes(opt.value) : v === opt.value;
  };
  const toggle = (g, opt) => {
    if (!onChange) return;
    if (g.mode === 'multi') {
      const v = Array.isArray(value[g.key]) ? value[g.key] : [];
      onChange(g.key, v.includes(opt.value) ? v.filter((x) => x !== opt.value) : v.concat(opt.value));
    } else {
      onChange(g.key, value[g.key] === opt.value ? null : opt.value);
    }
  };
  /* Applied is derived from `value`, never held alongside it — two sources for one truth is how a chip
     row and a list stop agreeing. */
  const applied = [];
  groups.forEach((g) => {
    const v = value[g.key];
    const vals = g.mode === 'multi' ? (Array.isArray(v) ? v : []) : (v == null ? [] : [v]);
    vals.forEach((val) => {
      const opt = (g.options || []).find((o) => o.value === val);
      if (opt) applied.push({ group: g, opt });
    });
  });
  const none = resultCount === 0;
  const commit = resultCount == null
    ? 'View matches'
    : none ? `No ${unit} match — drop a filter` : `View ${resultCount.toLocaleString('en-IN')} ${unit}`;

  return (
    <React.Fragment>
      <div onClick={onClose} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-scrim)', background: 'var(--scrim)', opacity: 'var(--scrim-sheet)', animation: 'ds-scrim var(--dur-screen) var(--ease) both' }} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 'var(--z-modal)', display: 'flex', flexDirection: 'column', maxHeight: '88%', borderRadius: 'var(--radius-24) var(--radius-24) 0 0', background: 'var(--color-canvas)', boxSizing: 'border-box', animation: 'ds-sheet var(--dur-screen) var(--ease) both' }}>
        <style>{'@keyframes ds-sheet{from{transform:translateY(100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-sheet{from{opacity:0;transform:none}to{opacity:1;transform:none}}}'}</style>
        <div style={{ flexShrink: 0, margin: 'var(--space-10) auto var(--space-6)', height: 'var(--space-5)', width: 'var(--h-touch)', borderRadius: 'var(--radius-full)', background: 'var(--color-line)' }} />

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', padding: `0 var(--space-20)` }}>
          <p style={{ margin: 0, font: 'var(--type-sheet-title-font)', color: 'var(--color-ink)' }}>{title}</p>
          {applied.length > 0 && (
            <Pressable onClick={onClearAll} label="Clear all filters" style={{ display: 'inline-flex', minHeight: 'var(--h-touch)', alignItems: 'center' }}>
              <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>Clear all</span>
            </Pressable>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `var(--space-12) var(--space-20) var(--space-8)` }}>
          {/* What is applied, readable aloud, removable one at a time. */}
          {applied.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
              {applied.map(({ group, opt }) => (
                <Pill key={`${group.key}:${opt.value}`} tone="filter" size="sm" selected removable
                  label={`${group.label}: ${opt.label}`} onClick={() => toggle(group, opt)} />
              ))}
            </div>
          )}

          {groups.map((g) => (
            <div key={g.key} style={{ marginBottom: 'var(--space-16)' }}>
              <p style={{ margin: `0 0 var(--space-8)`, font: 'var(--type-label-font)', letterSpacing: 'var(--tracking-eyebrow)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{g.label}</p>
              {g.note && <p style={{ margin: `0 0 var(--space-8)`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{g.note}</p>}
              <div role="group" aria-label={g.label} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
                {(g.options || []).map((opt) => (
                  <Pill key={opt.value} tone="filter" size="sm" selected={isOn(g, opt)}
                    disabled={opt.count === 0 || undefined}
                    label={opt.count == null ? opt.label : `${opt.label} (${opt.count.toLocaleString('en-IN')})`}
                    onClick={opt.count === 0 ? undefined : () => toggle(g, opt)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', padding: `var(--space-12) var(--space-20) var(--space-20)` }}>
          <DarkButton full label={commit} onClick={onApply} />
        </div>
      </div>
    </React.Fragment>
  );
}
