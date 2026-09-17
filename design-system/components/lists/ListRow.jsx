import React from 'react';
import { Badge } from '../cards/Badge.jsx';
import { SelectionMark } from '../forms/SelectionMark.jsx';
import { IconChevronRight } from '../icons/IconChevronRight.jsx';
/* One row with constrained pairings — not three list components.
   The legal pairings are enforced here, not left to the caller: an illegal trailing is dropped to the
   variant's default and warned about once. The chevron belongs to `nav` and nowhere else — an affordance
   meaning "goes somewhere" must never sit on something that selects, the same rule that took chevrons
   off answer chips. `static` rows take no onPress and are exempt from the touch-target rule, like Badge. */
const LEGAL = { nav: ['chevron', 'meta'], select: ['radio'], multi: ['checkbox'], action: ['menu'], static: ['badge', 'meta', 'none'] };
const DEFAULT_TRAILING = { nav: 'chevron', select: 'radio', multi: 'checkbox', action: 'menu', static: 'none' };
const warned = {};
function resolveTrailing(variant, trailing) {
  const legal = LEGAL[variant] || LEGAL.static;
  if (!trailing) return DEFAULT_TRAILING[variant] || 'none';
  if (legal.indexOf(trailing) !== -1) return trailing;
  const key = variant + '/' + trailing;
  if (!warned[key]) { warned[key] = 1; console.warn(`ListRow: trailing="${trailing}" is not legal on variant="${variant}" (legal: ${legal.join(', ')}). Falling back to "${DEFAULT_TRAILING[variant]}".`); }
  return DEFAULT_TRAILING[variant];
}
export function ListRow({ variant = 'static', size, leading = 'none', leadingContent, index, title, subtitle, meta, chip, trailing, badge, selected = false, disabled = false, onPress, onMenu }) {
  const tr = resolveTrailing(variant, trailing);
  const isStatic = variant === 'static';
  const h = (size || (subtitle ? 'lg' : 'md')) === 'lg' ? 72 : 56;
  const [down, setDown] = React.useState(false);
  const lead = leading === 'none' ? null : (
    <span style={{ display: 'flex', width: leading === 'index' ? 20 : 32, height: leading === 'index' ? 20 : 32, flexShrink: 0, alignItems: 'center', justifyContent: leading === 'index' ? 'flex-start' : 'center', borderRadius: 'var(--radius-full)', background: leading === 'avatar' ? 'var(--surface-avatar)' : 'transparent' }}>
      {leading === 'avatar' ? <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: 'var(--color-bronze-deep)' }}>{leadingContent || (title || '?').trim().charAt(0).toUpperCase()}</span>
        : leading === 'index' ? <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: 'var(--color-muted)' }}>{index}</span>
          : leadingContent}
    </span>
  );
  const trail = tr === 'chevron' ? <IconChevronRight size={16} stroke="var(--color-bronze-deep)" />
    : tr === 'radio' ? <SelectionMark kind="radio" selected={selected} disabled={disabled} />
      : tr === 'checkbox' ? <SelectionMark kind="checkbox" selected={selected} disabled={disabled} />
        : tr === 'badge' && badge ? <Badge variant={badge.variant} tone={badge.tone}>{badge.text}</Badge>
          : tr === 'meta' && meta ? <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 11.5, lineHeight: 'var(--leading-16)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{meta}</span>
            : null;
  const body = (
    <React.Fragment>
      {lead}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', minWidth: 0 }}>
          <span style={{ flex: '0 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }}>{title}</span>
          {chip}
        </span>
        {subtitle && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{subtitle}</span>}
      </span>
      {tr !== 'meta' && meta && <span style={{ flexShrink: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 11.5, lineHeight: 'var(--leading-16)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{meta}</span>}
      {trail && <span style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>{trail}</span>}
      {tr === 'menu' && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onMenu && onMenu(); }} disabled={disabled}
          style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', width: 44, height: 44, marginRight: -12, flexShrink: 0, alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-16)', lineHeight: 1, color: 'var(--color-ink)' }}>⋯</button>
      )}
    </React.Fragment>
  );
  const shared = { display: 'flex', width: '100%', minHeight: h, alignItems: 'center', gap: 'var(--space-12)', padding: '8px 0', boxSizing: 'border-box', opacity: disabled ? 0.4 : 1 };
  if (isStatic || !onPress) return <div style={{ ...shared, background: 'transparent' }}>{body}</div>;
  return (
    <button type="button" onClick={onPress} disabled={disabled}
      onPointerDown={() => !disabled && setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ ...shared, appearance: 'none', border: 'none', margin: 0, cursor: disabled ? 'default' : 'pointer', outline: 'none', font: 'inherit', background: down ? 'var(--tint-bronze-06)' : 'transparent', transition: 'background-color var(--dur-press) var(--ease)' }}>
      {body}
    </button>
  );
}
