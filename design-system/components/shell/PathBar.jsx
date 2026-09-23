import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* WHERE YOU ARE, IN ONE LINE, WITHOUT SCROLLING BACK FOR IT.

   The problem it solves, in the owner's words on 23 Sep 2026: a funnel that appends down a long
   conversation eventually puts its own first question above the fold, and "aisa nahi hona chahiye ki
   mujhe uske liye jaana pade" — going back to change the second answer should not be a scroll
   through everything that came after it. The steps already collapse into their answers; what was
   missing is a way to reach an answer from anywhere.

   IT IS DELIBERATELY ONE LINE. His other constraint was that nothing may eat the height the
   conversation is read in. A second sticky panel, a floating card, a bottom sheet handle — each of
   them costs 60 to 120pt of a 812pt phone, permanently. This is 36: a row of crumbs and two
   controls, sticky at the top of the thread, and it is the only thing in the funnel that never
   scrolls away. Everything else — the search, the steps, the list — is content and behaves like it.

   THE CRUMBS ARE CONTROLS, NOT A LABEL. Tapping one reopens that step where it stands. So the bar is
   not a breadcrumb in the navigational sense (nothing here is a page, and nothing is navigated to);
   it is the funnel's own state, made touchable. The last crumb is the one you are in and is not a
   control — tapping where you already are is the affordance every breadcrumb gets wrong.

   IT TRUNCATES FROM THE LEFT. When the path is longer than the row, the OLDEST crumbs collapse to a
   single "..." that reopens the first step, because the recent end of a path is the part being
   worked on. Truncating the right would hide the answer the advisor is actually looking at. */

const NUM = { fontVariantNumeric: 'tabular-nums' };

export function PathBar({ steps = [], onStep, onReset, action, sticky = true }) {
  /* TWO, NOT THREE. Three crumbs plus a filter pill plus a reset is 343pt asking for 420: the
     first render truncated all three to "Eq… › Mutual… › Large Ca…", which is a bar that has
     stopped doing the one thing it is for. Two, with the rest behind the ellipsis. */
  const shown = steps.length > 2 ? steps.slice(-2) : steps;
  const hidden = steps.length - shown.length;

  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 'var(--z-sticky)',
      margin: `0 calc(-1 * var(--gutter))`, padding: `var(--space-6) var(--gutter)`,
      background: 'var(--color-canvas)',
      boxShadow: 'inset 0 -1px 0 0 var(--color-line-soft)',
      display: 'flex', alignItems: 'center', gap: 'var(--space-8)', minHeight: 36,
    }}>
      <nav aria-label="Where you are"
        style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', overflow: 'hidden' }}>
        {hidden > 0 && (
          <>
            <Pressable onClick={() => onStep && onStep(steps[0], 0)} label={`Back to ${steps[0].label}`}
              style={{ flex: '0 0 auto', padding: `0 var(--space-4)`, background: 'transparent', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
              …
            </Pressable>
            <span aria-hidden="true" style={{ color: 'var(--color-line)', flex: '0 0 auto' }}>›</span>
          </>
        )}
        {shown.map((s, n) => {
          const idx = hidden + n;
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={s.key || s.label}>
              {n > 0 && <span aria-hidden="true" style={{ color: 'var(--color-line)', flex: '0 0 auto' }}>›</span>}
              {isLast ? (
                /* The step you are in. Not a control — tapping where you already are is the thing
                   every breadcrumb gets wrong, and a control that does nothing is worse than none. */
                <span style={{
                  font: 'var(--type-caption-font)', color: 'var(--color-ink)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
                }}>{s.label}</span>
              ) : (
                <Pressable onClick={() => onStep && onStep(s, idx)} label={`Change ${s.label}`}
                  style={{
                    /* An earlier crumb is capped; the LAST one takes whatever is left. The step you
                       are in is the one that has to be readable. */
                    flex: '0 1 auto', minWidth: 0, maxWidth: 96, padding: `2px var(--space-6)`, background: 'transparent',
                    borderRadius: 'var(--radius-full)', font: 'var(--type-caption-font)',
                    color: 'var(--color-bronze-deep)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{s.label}</Pressable>
              )}
            </React.Fragment>
          );
        })}
        {steps.length === 0 && (
          <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>Nothing chosen yet</span>
        )}
      </nav>

      {action}

      {/* RESET IS A WORD, NOT A GLYPH. A circular arrow at this size is read as "refresh" as often as
          "start again", and the two are not the same promise. It appears only once there is
          something to clear — an always-present reset on an empty funnel is a control offering to
          undo nothing. */}
      {steps.length > 0 && onReset && (
        <Pressable onClick={onReset} label="Start again"
          style={{
            flex: '0 0 auto', padding: `2px var(--space-8)`, background: 'transparent',
            font: 'var(--type-caption-font)', color: 'var(--color-muted)', whiteSpace: 'nowrap', ...NUM,
          }}>Reset</Pressable>
      )}
    </div>
  );
}
