/* The ledger, as a module — shared by ledger.html and the end-to-end prototype.

   It was written inside ledger.html on 19 Sep and lifted out the moment the prototype needed it, for
   the same reason AskTurn and useAttachment were lifted: a second copy of a table is a second place for
   the status words to drift apart, and the whole point of this surface is that a status is a WORD that
   means the same thing everywhere.

   `book.jsx` is loaded before this file and provides LEDGER, LEDGER_PERIOD, clientById and inr. */
const LED_DS = window.SentinelDesignSystem_0682a2;

const LEDGER_ASK = 'What have I placed this month?';

/* THE STATUS IS A WORD, AND IT IS THE SAME SET THE IN-FLIGHT STATES USE (R2). A row never says "done"
   for something the RTA has not confirmed — "sent" is its own status and it reads differently, which is
   the whole reason this table is worth building. Rule 2: the tone colours the WORD, never a fill. */
const LED_TONE = { placed: 'ok', settled: 'ok', rejected: 'over', sent: 'under' };
const LED_WORD = { placed: 'Placed', settled: 'Settled', rejected: 'Rejected', sent: 'Sent · no answer' };

/* COLUMN ORDER IS THE ANSWER'S ORDER. The first cut ran What · Client · Amount · Status, and at 375 the
   Status column sat off the right edge — so the one question this table exists to answer, "did it go
   through", needed a sideways scroll to reach. Status now sits immediately after the sticky column and
   the client moves into the row's detail, where it reads as a sentence rather than a cell.
   THREE columns, not four, and overflow="fold": DataTable turns its horizontal scroller on at four
   non-sticky columns. Three fit 375 whole, with no scroller at all. */
const LED_COLUMNS = [
  { key: 'what', label: 'What', kind: 'text', sticky: true, sortable: true, width: 104 },
  { key: 'status', label: 'Status', kind: 'badge' },
  { key: 'amount', label: 'Amount', kind: 'currency', align: 'end', sortable: true },
];
const ledgerRows = (items) => items.map((l) => ({
  id: l.id,
  what: l.kind,
  amount: inr(l.amountRs),
  status: <LED_DS.Badge tone={LED_TONE[l.status]}>{LED_WORD[l.status]}</LED_DS.Badge>,
}));

/* The row's detail is the sentence the table cannot hold: what moved where, its reference, and — when
   the RTA said no — its reason in the RTA's own words. */
const LedgerDetail = ({ l }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: `0 var(--space-2)` }}>
    <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)' }}>{(clientById(l.client) || {}).name || l.client}</span>
    <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink-soft)' }}>{l.detail}</span>
    <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>
      {l.date} · {l.ref}{l.settles ? ` · settles ${l.settles}` : ''}
    </span>
    {l.note && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-status-over-fg)' }}>{l.note}</span>}
  </div>
);

function LedgerArtifact({ items = LEDGER, openRow = null, state = 'expanded', onDownload }) {
  const unsettled = items.filter((l) => l.status === 'sent').length;
  return (
    <LED_DS.ArtifactCard state={state} eyebrow={`Placed · ${LEDGER_PERIOD}`} title={`${items.length} instructions`}
      provenance={`As of 30 Sep · from the RTA, ${items.length - unsettled} of ${items.length} confirmed`}
      onToggle={() => {}} onMenu={() => {}}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        <LED_DS.DataTable columns={LED_COLUMNS} rows={ledgerRows(items)} emptyState={{ title: 'Nothing placed in this period.', body: 'Change the period, or place something and it appears here.' }}
          overflow="fold" defaultOpen={openRow} expandable={(r) => <LedgerDetail l={items.find((l) => l.id === r.id)} />} />
        {state === 'expanded' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
            <LED_DS.RangePills ranges={['Sep', 'Q2', 'FY 26-27']} value="Sep" onChange={() => {}} label="Period" />
            <LED_DS.DownloadAction format="CSV" onDownload={onDownload} size="sm" />
          </div>
        )}
      </div>
    </LED_DS.ArtifactCard>
  );
}

Object.assign(window, { LEDGER_ASK, LED_TONE, LED_WORD, LED_COLUMNS, ledgerRows, LedgerDetail, LedgerArtifact });
