import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
import { Pill } from '../actions/Pill.jsx';
/* A SHORTLIST THE ADVISOR KEEPS — named, dated, versioned, and re-runnable.

   The durable object in every serious advisor tool is a named list that changes on a cadence, and
   Sentinel had none. Tickertape saves a screen with a note ("Top 5 tax-saving ELSS funds"); Wealthy
   Select is "a monthly playbook of top-performing funds"; NJ's MARS ships a Recommended Portfolio.
   Kabir's teardown put it in one line: "the shortlist is the durable object, not the query." What the
   explorer did instead was re-send a fresh table every turn, so an eight-turn session left eight stale
   tables and nothing an advisor could return to — which is what "2–3 funds, bas" was actually
   describing, since no app in the mined set has too few funds to complain about.

   HOW IT DIFFERS FROM `ArtifactCard`, WHICH IT DOES NOT REPLACE. ArtifactCard is a thing Sentinel made
   in THIS THREAD: it peeks, expands and fills, and it dies with the conversation. This is a thing the
   advisor KEPT: it has a name they gave it, a date, a version count, and a client it belongs to. One
   is an answer; the other is a working file. A screen that needs both uses both.

   THE FILTERS ARE ON ITS FACE, NOT BEHIND IT. An advisor reads this to a client — "flexi cap, under
   0.7%, on our shelf, three funds" — so the chips that produced the list are part of the card rather
   than something to open it for. Google AI Mode and Zillow set filter state the user never sees; the
   whole product is built against that.

   STALE IS A SENTENCE, NOT A DOT. A saved list whose data has moved says what moved and offers to
   re-run. A red dot would say something is wrong; nothing is wrong, the world moved — and rule 1 says
   colour never encodes anyway. The refresh is an offer, never automatic: a list that silently changed
   under an advisor between opening it and reading it aloud is the defect this card exists to prevent. */

const NUM = { fontVariantNumeric: 'tabular-nums' };

export function ShortlistCard({
  name, client, count, unit = 'funds', savedAt, version = 1,
  filters = [], stale = null, onOpen, onRefresh, children,
}) {
  return (
    <div style={{ borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-14)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, font: 'var(--type-title-font)', color: 'var(--color-ink)' }}>{name}</p>
            {/* One line of provenance the advisor can read: how many, for whom, since when, and which
                version of it — every one of those a thing they will be asked. */}
            <p style={{ margin: `var(--space-2) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
              <span style={NUM}>{count.toLocaleString('en-IN')}</span> {unit}
              {client && <> · {client}</>}
              {savedAt && <> · saved {savedAt}</>}
              {version > 1 && <> · <span style={NUM}>v{version}</span></>}
            </p>
          </div>
          {onOpen && (
            <Pressable onClick={onOpen} label={`Open ${name}`} style={{ flexShrink: 0, display: 'inline-flex', minHeight: 'var(--h-touch)', alignItems: 'center' }}>
              <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>Open</span>
            </Pressable>
          )}
        </div>

        {filters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
            {filters.map((f) => <Pill key={f} tone="filter" size="sm" label={f} />)}
          </div>
        )}

        {children && <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>{children}</div>}
      </div>

      {/* Rule 2's shape: what the product cannot stand behind is TEXT, on the peach surface, with the
          offer beside it — never a badge and never a silent refresh. */}
      {stale && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', padding: `var(--space-10) var(--space-14)`, background: 'var(--color-status-over-bg)' }}>
          <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-ink)' }}>{stale.text}</p>
          {onRefresh && (
            <Pressable onClick={onRefresh} label="Run this shortlist again on today's data" style={{ flexShrink: 0, display: 'inline-flex', minHeight: 'var(--h-touch)', alignItems: 'center' }}>
              <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>Run again</span>
            </Pressable>
          )}
        </div>
      )}
    </div>
  );
}
