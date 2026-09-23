import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
import { IconChevronRight } from '../icons/IconChevronRight.jsx';
/* A STEP OF A FUNNEL THAT COLLAPSES INTO ITS OWN ANSWER.

   The explorer asks four questions in order — which asset, which product, which category, which
   instrument — and the owner's ruling on 23 Sep 2026 is that all four live on ONE screen, in one
   thread, with nothing opening a second screen. That ruling only works if a question that has been
   answered stops taking a screenful. So a step collapses to a single row carrying the answer, and
   the row is the control that opens it again.

   WHY NOT A WIZARD, AND WHY NOT AN ACCORDION LIBRARY. A wizard hides the answers behind a back
   button, which is the thing an advisor changes most: "same thing, but debt instead". An accordion
   whose header is only a title makes the advisor open a step to remember what they chose. Here the
   header IS the answer — `① Asset class · Equity · Debt +2` — so the whole funnel reads as a
   sentence down the screen, and changing any word of it is one tap on that word.

   IT GROWS FROM ITS OWN ROW, IT DOES NOT SLIDE IN. The reference the owner picked is a collapsed
   pill that expands into a panel anchored where the pill was, and collapses back into it. That is
   `grid-template-rows: 0fr → 1fr`: the content animates from nothing to its own natural height with
   no measurement, no max-height guess, and no jump when the content changes size. It is also the
   one expansion this system already allows — rule: an artifact expands in place, there is no
   shared-element transition, and nothing here flies across the screen.

   THE CONTENT STAYS MOUNTED WHILE CLOSED — the grid row closes to `0fr` and the panel is marked
   `inert`, rather than the children being unmounted. A step that unmounts loses its scroll position,
   its search box and its half-made multi-selection every time the advisor glances at the step above — which is exactly the "I lost my filters" complaint
   the research recorded. `inert` keeps it out of the tab order so a closed step is not a keyboard
   trap.

   THE OVERFLOW IS A COUNT, NOT A FADE. Four chosen chips in a 343pt row do not fit; the answer is
   `+2`, never a gradient over the fourth. A count is legible, a fade is a guess. */

const CLUSTER_MAX = 3;

export function StepBlock({
  step, title, chips = [], summary, done = false, open = false, onToggle,
  maxChips = CLUSTER_MAX, count, unit = 'funds', children, id,
}) {
  const auto = React.useId ? React.useId() : 'step';
  const bodyId = `${id || auto}-body`;
  const shown = chips.slice(0, maxChips);
  const rest = chips.length - shown.length;
  const bodyRef = React.useRef(null);
  /* `inert` is a property, not an attribute React 18 forwards — set it directly or a closed step
     stays reachable by Tab while being invisible, which is worse than either state alone. */
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.inert = !open; }, [open]);

  return (
    <div style={{
      borderRadius: 'var(--radius-16)', background: 'var(--color-surface)',
      boxShadow: `0 0 0 var(--border-1) ${open ? 'var(--color-bronze)' : 'var(--color-line)'}`,
      transition: 'box-shadow var(--dur-fast) var(--ease)', overflow: 'hidden',
    }}>
      <Pressable
        onClick={onToggle}
        expanded={open}
        controls={bodyId}
        label={`${title}${chips.length ? `, ${chips.join(', ')}` : ''}. ${open ? 'Collapse' : 'Expand'}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-10)', width: '100%',
          minHeight: 'var(--h-touch)', padding: 'var(--space-12)', textAlign: 'left',
          background: 'transparent',
        }}>
        {/* THE MARK CARRIES THE STATE, so the row does not need a second signal. A step with an
            answer shows a tick; one still to answer shows its number; the open one shows its number
            on the accent. Never a colour alone — the tick is a shape and the number is a figure. */}
        {step != null && (
          <span aria-hidden="true" style={{
            flex: '0 0 auto', width: 22, height: 22, borderRadius: 'var(--radius-full)',
            display: 'grid', placeItems: 'center',
            font: 'var(--type-meta-font)', fontVariantNumeric: 'tabular-nums',
            background: done ? 'var(--color-bronze-deep)' : open ? 'var(--color-selected)' : 'var(--color-chip)',
            color: done ? 'var(--color-surface)' : 'var(--color-bronze-deep)',
            boxShadow: done ? 'none' : `inset 0 0 0 var(--border-1) var(--color-line)`,
            transition: 'background var(--dur-fast) var(--ease)',
          }}>{done ? '✓' : step}</span>
        )}

        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
          <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)' }}>{title}</span>
          {/* Closed, the row is the answer. Open, it is only the question — repeating the answer
              under a selector that is already showing it is the same fact printed twice. */}
          {!open && (chips.length > 0 || summary) && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'nowrap', minWidth: 0 }}>
              {chips.length > 0 ? (
                <>
                  {shown.map((c) => (
                    <span key={c} style={{
                      font: 'var(--type-caption-font)', color: 'var(--color-bronze-deep)',
                      background: 'var(--color-chip)', borderRadius: 'var(--radius-full)',
                      padding: '2px var(--space-8)', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 108,
                    }}>{c}</span>
                  ))}
                  {rest > 0 && (
                    <span style={{
                      font: 'var(--type-caption-font)', color: 'var(--color-muted)',
                      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                    }}>+{rest}</span>
                  )}
                </>
              ) : (
                <span style={{
                  font: 'var(--type-caption-font)', color: 'var(--color-muted)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{summary}</span>
              )}
            </span>
          )}
        </span>

        {count != null && !open && (
          <span style={{
            flex: '0 0 auto', font: 'var(--type-meta-font)', color: 'var(--color-muted)',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>{count.toLocaleString('en-IN')} {unit}</span>
        )}

        {/* One chevron, rotated — not two icons swapped. A swap is a second shape for one state and
            it cannot animate; a rotation is the same object turning, which is what the reference
            does and what reduced motion can safely flatten to nothing. */}
        <span aria-hidden="true" style={{
          flex: '0 0 auto', display: 'grid', placeItems: 'center',
          transform: `rotate(${open ? -90 : 90}deg)`,
          transition: 'transform var(--dur-fast) var(--ease)',
          color: 'var(--color-muted)',
        }}><IconChevronRight /></span>
      </Pressable>

      {/* 0fr → 1fr is the whole animation. The inner div must carry `min-height:0` and
          `overflow:hidden` or the grid row refuses to go below the content's height and the panel
          snaps instead of growing. */}
      <div id={bodyId} ref={bodyRef} style={{
        display: 'grid', gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows var(--dur-enter) var(--ease)',
      }}>
        <div style={{ minHeight: 0, overflow: 'hidden' }}>
          <div style={{
            padding: `0 var(--space-12) var(--space-12)`,
            opacity: open ? 1 : 0,
            transition: 'opacity var(--dur-fast) var(--ease)',
          }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* The funnel's own spacing, here rather than on each screen so three variations cannot drift apart.
   `--space-8`, not `--stack`: these are steps of one question, not separate messages in a thread. */
export function StepStack({ children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>{children}</div>;
}
