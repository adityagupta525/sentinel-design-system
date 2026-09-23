import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
import { IconChevronRight } from '../icons/IconChevronRight.jsx';
/* A FIGURE THAT OPENS INTO WHAT IT IS MEASURED AGAINST.

   A fund one-pager is a column of numbers and a number on its own answers nothing. `Alpha 1.64` is
   only a fact once the reader knows the category did 8.64 and the benchmark did 9.12 — and the
   catalogue carries all three, so the comparison exists and was simply not being shown. The choice
   was between printing three figures per row, which makes a wall, and hiding two of them behind a
   tap. This hides them: the row prints the fund's own figure, and opening it lays the peers beside
   it.

   THIS IS NOT `StatTile` AND NOT AN EXPLAINER. StatTile is a headline figure in a grid with a door to
   a definition — what alpha MEANS. This is a row in a list with a door to a COMPARISON — what alpha
   IS HERE, against the two things it is always quoted against. A one-pager wants both and they are
   different doors; a component that did both would put two chevrons on one row.

   THE PEERS ARE TILES, NOT A SENTENCE. Three labelled figures on one line at caption size read as a
   run-on; three tiles with the fund's own tile carrying the accent read as a comparison, and the eye
   lands on which is largest without parsing. The pattern is the one Finimize and N26 both use for
   exactly this job, in this system's geometry.

   IT USES THE FUNNEL'S ONE EXPANSION — `grid-template-rows: 0fr → 1fr`, the same as StepBlock and
   FundCard. Three components, one gesture, one behaviour. */

const NUM = { fontVariantNumeric: 'tabular-nums' };

export function MetricRow({ label, value, peers = [], note, open = false, onToggle, id, last = false }) {
  const auto = React.useId ? React.useId() : 'metric';
  const bodyId = `${id || auto}-peers`;
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.inert = !open; }, [open]);
  const canOpen = peers.length > 0 || !!note;

  return (
    <div style={{ borderBottom: last ? 'none' : 'var(--border-hairline) solid var(--color-line)' }}>
      <Pressable
        onClick={canOpen ? onToggle : undefined}
        expanded={canOpen ? open : undefined}
        controls={canOpen ? bodyId : undefined}
        label={`${label}, ${value}${canOpen ? `. ${open ? 'Hide' : 'Show'} what it is measured against` : ''}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-10)', width: '100%',
          minHeight: 'var(--h-row-xl)', padding: `var(--space-8) 0`, textAlign: 'left',
          background: 'transparent', cursor: canOpen ? undefined : 'default',
        }}>
        <span style={{ flex: 1, minWidth: 0, font: 'var(--type-row-font)', color: 'var(--color-ink)' }}>{label}</span>
        <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)', ...NUM }}>{value}</span>
        {canOpen && (
          <span aria-hidden="true" style={{
            flex: '0 0 auto', display: 'grid', placeItems: 'center',
            transform: `rotate(${open ? -90 : 90}deg)`,
            transition: 'transform var(--dur-fast) var(--ease)', color: 'var(--color-muted)',
          }}><IconChevronRight /></span>
        )}
      </Pressable>

      {canOpen && (
        <div id={bodyId} ref={bodyRef} style={{
          display: 'grid', gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows var(--dur-enter) var(--ease)',
        }}>
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <div style={{
              /* THE PANEL CLIPS, SO ITS CONTENT NEEDS ROOM TO BE CLIPPED AROUND. `overflow:hidden` is
                 what makes `0fr → 1fr` animate, and a `box-shadow: 0 0 0 1px` ring renders OUTSIDE the
                 element's border-box — so a tile, chip or card sitting flush at the top of this panel
                 had its top stroke sliced off. The owner saw it on the asset tiles, the product tiles
                 and the category pills, and it was the same one line of padding in all three. 4pt, not
                 1: a focus ring is 2px of outline at 2px offset, and an outline clipped by its own
                 container is an accessibility defect wearing a cosmetic one. */
              padding: `var(--space-4) 0 var(--space-12)`, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)',
              opacity: open ? 1 : 0, transition: 'opacity var(--dur-fast) var(--ease)',
            }}>
              {peers.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${peers.length}, 1fr)`, gap: 'var(--space-6)' }}>
                  {peers.map((p) => (
                    <div key={p.label} style={{
                      display: 'flex', flexDirection: 'column', gap: 2,
                      padding: 'var(--space-10)', borderRadius: 'var(--radius-12)',
                      /* The fund's own tile is the one the other two are read against, so it carries
                         the accent surface. The accent is a SURFACE here and the label still says
                         which is which — colour is not doing the work alone. */
                      background: p.self ? 'var(--color-selected)' : 'var(--color-chip)',
                    }}>
                      {/* A MISSING PEER IS NOT A FIGURE, so it is not set like one. Rendered at
                          figure weight, "not on file" read as a third value with the same standing
                          as 9.76% and the eye compared three things when there were two. It keeps
                          its tile — dropping it would hide that a comparison is meant to exist —
                          and loses only the weight. */}
                      <span style={{
                        font: p.missing ? 'var(--type-caption-font)' : 'var(--type-row-strong-font)',
                        color: p.missing ? 'var(--color-muted)' : 'var(--color-ink)',
                        ...(p.missing ? null : NUM),
                      }}>{p.value}</span>
                      <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {note && (
                <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{note}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* The list, so a one-pager does not hand-roll the divider rule. The LAST row drops its rule — a
   hairline with nothing under it draws the bottom of a box that is not there. */
export function MetricList({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div>
      {items.map((c, i) => (React.isValidElement(c) ? React.cloneElement(c, { last: i === items.length - 1 }) : c))}
    </div>
  );
}
