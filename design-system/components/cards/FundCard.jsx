import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
import { SelectionMark } from '../forms/SelectionMark.jsx';
import { Badge } from './Badge.jsx';
import { ChartSpark } from '../data/ChartSpark.jsx';
/* AN INSTRUMENT, AS A CARD THAT OPENS INTO ITS OWN PAGE.

   THE CARD IS NOT A FUND CARD WITH SOME FIELDS MISSING. That was the first version's mistake and the
   catalogue is what proved it: of eight families, only mutual_fund and commodity carry a return and a
   NAV series at all. A bond has no return, no AUM, no expense ratio and no curve — it has a coupon, a
   yield, a face value, a maturity and a payment frequency, and those are not worse facts, they are
   different ones. A card that assumed a return printed an em dash in the place where the advisor
   looks first, which reads as "we do not know this fund" rather than "this is not that kind of
   thing". So the card takes ONE `headline` and a row of `facts`, and the caller — which has already
   asked `shapeOf(id)` — decides what those are. A card with no headline is not a broken card; it is a
   card whose instrument has no single number, and it lets the facts carry it instead.

   IT OPENS IN PLACE. The owner's ruling on 23 Sep 2026 is that the one-pager is not a screen: the
   card grows into it and shrinks back, in the same thread, with the scroll position kept. That is the
   same `grid-template-rows: 0fr → 1fr` StepBlock uses, deliberately — two different expansions in one
   funnel would teach the advisor two behaviours for one gesture. `children` is the page.

   THE CHECKBOX IS A SIBLING OF THE CARD'S CONTROL, NEVER INSIDE IT. A control inside a control is
   invalid HTML and this repository has already shipped that bug once (`ArtifactCard` wrapping its
   children in a <button>). Here the card body is one Pressable and the checkbox is another, laid out
   beside it — and when a card is selectable the badge moves down to the chip row, because both wanted
   the top-right corner and the first build had a tick sitting on top of a figure.

   THE SPARK IS THE PATH, NOT DECORATION. Two funds on the same three-year return are not the same
   fund, and the figure alone cannot say so. It is drawn only when a series exists; there is no
   placeholder, because an empty 56x18 box beside a number reads as a chart that failed to load.

   TWO COLUMNS, NOT FOUR STACKED ROWS (23 Sep 2026, on the owner's note that the card could be more
   compact). Measured before changing anything: the stacked build was 173pt tall at 375, so a phone
   held three funds — the reference apps hold four and five, and a list you cannot see four of is a
   list you scroll instead of compare. The headline had a whole row to itself and the spark had
   another. Now the identity runs down the left and the figure sits in a right rail beside it, and
   the spark moves onto the facts line where there was already vertical room for it. Nothing was
   removed and nothing shrank: two rows became one, twice. */

const NUM = { fontVariantNumeric: 'tabular-nums' };

export function FundCard({
  name, sub, logo, badge, badgeTone = 'ok', chips = [],
  headline, spark, facts = [],
  selectable = false, selected = false, onSelect,
  open = false, onToggle, children, id,
}) {
  const auto = React.useId ? React.useId() : 'fund';
  const bodyId = `${id || auto}-page`;
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.inert = !open; }, [open]);
  const hasPage = !!children;
  /* The badge yields the corner when a checkbox needs it. Two things in one corner is the collision
     the first build shipped, and moving the badge is cheaper than moving the control. */
  const badgeInline = selectable && !!badge;

  return (
    <div style={{
      borderRadius: 'var(--radius-16)', background: 'var(--color-surface)',
      boxShadow: `0 0 0 var(--border-1) ${open || selected ? 'var(--color-bronze)' : 'var(--color-line)'}`,
      transition: 'box-shadow var(--dur-fast) var(--ease)', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <Pressable
          onClick={hasPage ? onToggle : undefined}
          expanded={hasPage ? open : undefined}
          controls={hasPage ? bodyId : undefined}
          label={`${name}${headline ? `, ${headline.value} ${headline.label}` : ''}${hasPage ? `. ${open ? 'Collapse' : 'Open'}` : ''}`}
          style={{
            flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)',
            padding: 'var(--space-12)', textAlign: 'left', background: 'transparent',
            cursor: hasPage ? undefined : 'default',
          }}>
          {/* WHO IT IS, down the left — and WHAT IT DID, in a rail on the right. The AMC mark is a
              letter in a disc, not a logo image: this system ships no images, and a 24px remote logo
              is a request that can fail on a card. */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-10)', width: '100%' }}>
            {logo && (
              <span aria-hidden="true" style={{
                flex: '0 0 auto', width: 28, height: 28, borderRadius: 'var(--radius-8)',
                background: 'var(--color-chip)', color: 'var(--color-bronze-deep)',
                display: 'grid', placeItems: 'center', font: 'var(--type-meta-font)',
              }}>{logo}</span>
            )}
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)' }}>{name}</span>
              {sub && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{sub}</span>}
              {(chips.length > 0 || badgeInline) && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                  {badgeInline && <Badge variant="status" tone={badgeTone}>{badge}</Badge>}
                  {chips.map((c) => (
                    <span key={c} style={{
                      font: 'var(--type-caption-font)', color: 'var(--color-bronze-deep)',
                      background: 'var(--color-chip)', borderRadius: 'var(--radius-full)',
                      padding: '2px var(--space-8)',
                    }}>{c}</span>
                  ))}
                </span>
              )}
            </span>
            {/* The rail is `flex-start`-aligned with the name, not centred on the card: the figure
                and the fund's name are the two things being read together, and a figure that floats
                to the vertical middle of a two-line card sits beside neither of them. */}
            {(headline || (badge && !badgeInline)) && (
              <span style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                {badge && !badgeInline && <Badge variant="status" tone={badgeTone}>{badge}</Badge>}
                {headline && (
                  <>
                    <span style={{ font: 'var(--type-figure-font)', color: 'var(--color-ink)', ...NUM }}>{headline.value}</span>
                    <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{headline.label}</span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* ROW 3 — the facts this KIND of instrument has. Divided by a hairline, not by a gap: at
              caption size a gap between two label/value pairs reads as one run-on line. */}
          {(facts.length > 0 || (spark && spark.length > 1)) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-10)', width: '100%',
              paddingTop: 'var(--space-8)', borderTop: 'var(--border-hairline) solid var(--color-line)',
            }}>
              {/* The facts wrap; the spark does not. It is `flex: 0 0 auto` at the end of the row so
                  a fund with four facts pushes its own text onto a second line rather than squeezing
                  the chart into an unreadable 30pt. */}
              <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
              {facts.map((f, i) => (
                <React.Fragment key={f.label}>
                  {/* The middot is its OWN flex child, not a prefix inside the next pair. Nested, it
                      took the parent's gap on one side and its own margin on the other — 10px before,
                      6px after — and a separator that is not centred between the two things it
                      separates reads as belonging to one of them. It is also set in --color-muted
                      rather than --color-line: a middot is TYPE, and --color-line is the hairline
                      token, which at 1.06 against the card made the separator read as a wider gap
                      than the one it was separating. */}
                  {i > 0 && <span aria-hidden="true" style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>·</span>}
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
                    <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{f.label}</span>
                    <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-ink)', ...NUM }}>{f.value}</span>
                  </span>
                </React.Fragment>
              ))}
              </span>
              {spark && spark.length > 1 && (
                <span style={{ flex: '0 0 auto' }}>
                  <ChartSpark points={spark} width={76} height={22} />
                </span>
              )}
            </div>
          )}
        </Pressable>

        {selectable && (
          <Pressable
            onClick={onSelect}
            pressed={selected}
            label={`${selected ? 'Remove' : 'Add'} ${name} ${selected ? 'from' : 'to'} the comparison`}
            style={{
              flex: '0 0 auto', display: 'grid', placeItems: 'start center',
              padding: 'var(--space-14) var(--space-12) var(--space-14) 0', background: 'transparent',
            }}>
            <SelectionMark kind="checkbox" selected={selected} />
          </Pressable>
        )}
      </div>

      {hasPage && (
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
              padding: `var(--space-4) var(--space-14) var(--space-14)`,
              opacity: open ? 1 : 0, transition: 'opacity var(--dur-fast) var(--ease)',
            }}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
