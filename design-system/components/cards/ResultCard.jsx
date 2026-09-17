import React from 'react';
import { ArtifactCard } from './ArtifactCard.jsx';
import { Badge } from './Badge.jsx';
import { Pill } from '../actions/Pill.jsx';
import { DownloadAction } from '../actions/DownloadAction.jsx';
import { DarkButton } from '../actions/DarkButton.jsx';
import { InlineActionRow } from '../actions/InlineActionRow.jsx';
import { Provenance } from '../text/Provenance.jsx';
import { DrawnCheck } from '../data/DrawnCheck.jsx';
/* The end state of a proposal, a review or a rebalance — built ON the artifact card, not beside it.
   Component request spec Part 4, re-pointed by v9 §1.1.

   THREE EXPORTS, BECAUSE THE SPEC PUTS THE ACTIONS IN THE DOCK, NOT IN THE CARD. "Layout follows the
   dock law: the secondary pills sit in an InlineActionRow, the dark CTA below them, and the composer
   below that." A single component cannot render into three dock slots, and wiring the actions into the
   card would put a CTA inside a scrolling thread where the composer law says it does not go. So:

     ResultCard     the artifact card — title, provenance, summary, the content, the saved badge
     ResultActions  Save + Download, for the Dock's `chips` slot
     ResultPrimary  the one dark CTA, for the Dock's `cta` slot — and the success state that replaces it

   The composer is the caller's, unchanged, below both. Nothing here replaces it. */

/* One primary per card, and it differs by journey (§4.1). The labels name the consequence rather than
   the control: an advisor about to put their ARN on a recommendation should read what happens. */
const PRIMARY = {
  proposal: ({ client }) => `Send to ${client || 'the client'}`,
  review: () => 'Fix it',
  rebalance: ({ moves }) => (moves === 1 ? 'Approve the move' : moves ? `Approve ${moves === 2 ? 'both' : `all ${moves}`} moves` : 'Approve the moves'),
};

const SETTLES = {
  proposal: 'The client sees it exactly as you did.',
  review: 'Nothing was placed — the review is yours to act on.',
  rebalance: 'Placed · settles T+2.',
};

export function ResultCard({ journey, state = 'draft', title, provenance, summary, savedAt, children }) {
  /* An end state is never a peek: the advisor arrived here to read the thing, so the card opens
     expanded and the thread carries the scroll, per ArtifactCard's no-nested-scroll contract. */
  const eyebrow = state === 'sent' ? 'Sent' : state === 'saved' ? 'Saved work' : journey === 'review' ? 'Client review' : journey === 'rebalance' ? 'Rebalance' : 'Proposal';
  return (
    <ArtifactCard state="expanded" eyebrow={eyebrow} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {summary && (
          <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-ink-soft)' }}>{summary}</p>
        )}
        {children}
        {/* Provenance is REQUIRED by the contract, not optional styling: every figure an advisor may
            have to defend carries where it came from. A result with no provenance is a number the
            client can ask about and the advisor cannot answer. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Provenance text={provenance} />
          {savedAt && state !== 'draft' && <Badge variant="meta">{`Saved · ${savedAt}`}</Badge>}
        </div>
      </div>
    </ArtifactCard>
  );
}

/* Save and Download, in the dock's chip row. Both are Pill size="md" tone="outline" (§4.1); Download
   is the DownloadAction wrapper so the wait, the confirmation and the failure wording are the ones
   every other download in the product uses. */
export function ResultActions({ state = 'draft', onSave, onDownload, format = 'PDF', saveLabel = 'Save' }) {
  const saved = state !== 'draft';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--chip-gap)', flexWrap: 'wrap' }}>
      <Pill label={saved ? 'Saved' : saveLabel} tone="outline" selected={saved} onClick={saved ? undefined : onSave} disabled={saved} />
      <DownloadAction format={format} onDownload={onDownload} />
    </div>
  );
}

/* The dark CTA, and what replaces it once the work is done.

   §4.2 — THE PRIMARY NEVER FIRES DIRECTLY. onPrimary opens the confirm step; it does not send, fix or
   place anything. Sending a recommendation under an advisor's ARN is the moment they take
   responsibility for it, so they see what the client will see first. This component only asks. */
export function ResultPrimary({ journey, state = 'draft', client, moves, label, onPrimary, sentAt }) {
  if (state === 'sent') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', minHeight: 'var(--h-cta)', padding: `0 var(--space-4)` }}>
        <DrawnCheck size={20} />
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, font: 'var(--type-body-strong-font)', color: 'var(--color-ink)' }}>
            {journey === 'rebalance' ? 'Both moves approved' : journey === 'review' ? 'Review closed' : 'Sent'}
            {sentAt ? ` · ${sentAt}` : ''}
          </p>
          <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{SETTLES[journey]}</p>
        </div>
      </div>
    );
  }
  const text = label || (PRIMARY[journey] || PRIMARY.review)({ client, moves });
  return <DarkButton label={text} arrow full onClick={onPrimary} />;
}
