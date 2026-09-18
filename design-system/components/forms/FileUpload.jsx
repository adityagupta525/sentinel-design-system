import React from 'react';
import { Pill } from '../actions/Pill.jsx';
import { StepTrace } from '../chat/StepTrace.jsx';
import { IconFile } from '../icons/IconFile.jsx';
/* The file, in the thread, parsing in stages.

   The field standard for document parsing is a per-stage list, not one progress bar, because the
   stages are what the reader cares about: Alan shows `✓ Document detection` then `••• Anti-fraud
   analysis`; Monese/Veriff tick four stages with a spinner on the active one; Airwallex shows the
   file row with a determinate line. Notion is closest to Sentinel's shape — the file sits as a chip
   in the thread above the answer, with a follow-up beside it.

   This is why StepTrace earns twice: the stages ARE the success summary arriving progressively, which
   is already the system's rule ("not 'uploaded successfully' but 'read her September statement · 4
   pages · 12 holdings'"). So there is no separate success state to design — when the last stage
   ticks, the summary line IS the outcome, and the trace collapses to it.

   A failed stage keeps its place and carries its own retry, so an advisor retries the stage that
   failed rather than re-uploading a 40-page statement. */
export function FileUpload({ file, stages = [], state = 'parsing', summary, onRetry, onRemove, actions, side = 'advisor' }) {
  const failed = state === 'failed' || stages.some((s) => s.state === 'failed');
  const done = state === 'done';
  const withRetry = stages.map((s) => (s.state === 'failed' && onRetry ? { ...s, retry: <Pill label="Retry this step" size="sm" tone="tertiary" onClick={() => onRetry(s.label)} /> } : s));
  /* WHOSE MESSAGE IS THIS (18 Sep 2026, the owner: "wo advisor ki side se lagna chahiye — abhi lag raha
     hai sentinel ka response hai jaise"). The advisor attached the file, so the card sits on the
     advisor's side of the thread and is capped like their bubble. The stages inside it are Sentinel's
     work on that file, and they stay inside the card rather than becoming a separate reply, because the
     advisor is looking at the file while it is read. `side="sentinel"` restores the full-width card for
     a file Sentinel produced. */
  const mine = side === 'advisor';
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: mine ? 'flex-end' : 'stretch' }}>
    <div style={{ width: '100%', maxWidth: mine ? 300 : undefined, borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-10)' }}>
        <span style={{ display: 'flex', flexShrink: 0, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-8)', background: 'var(--color-chip)' }}>
          <IconFile size={16} />
        </span>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', font: 'var(--type-body-strong-font)', color: 'var(--color-ink)' }}>{file.name}</span>
          <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{file.meta}</span>
        </span>
        {onRemove && <Pill label="Remove" size="sm" tone="muted" onClick={onRemove} />}
      </div>
      <div style={{ marginTop: 'var(--space-12)' }}>
        <StepTrace dense id={`parse-${file.name.replace(/\W+/g, '-')}`} defaultOpen={!done} steps={withRetry}
          summary={done ? (summary || 'Read it') : failed ? 'Could not read all of it' : undefined} />
      </div>
      {actions && <div style={{ marginTop: 'var(--space-12)' }}>{actions}</div>}
    </div>
    </div>
  );
}
