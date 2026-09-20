/* JOURNEY D — the proposal. Shared by proposal.html and the end-to-end prototype.

   This is the second journey on the RAIL, and SCREENS-PLAN's count is the reason it is four steps and
   not twelve: 22 rail steps across the product, Risk 16, Proposal 4, Review 1, Rebalance 1. A proposal
   does not interrogate the client — it asks the four things the document cannot be written without.

   THE THING THIS JOURNEY IS REALLY ABOUT. Amit Aggrawal's record says his KYC is in process and he has
   no nominee. So the proposal can be built, saved and SENT, and not one rupee of it can be placed. Every
   other journey in this product ends in something moving; this one ends in a document, and the screen
   says the difference out loud instead of letting a green tick imply otherwise.

   `book.jsx` and `journey-a/rail.jsx` are loaded before this file. */
const PROP_DS = window.SentinelDesignSystem_0682a2;

const AMIT = clientById('amit');
const PROP_ASK = 'Build a proposal for Mr. Amit Aggrawal';

/* THE FOUR STEPS. Step 2 is not a question — it is Sentinel holding a line, and it is the same sentence
   the router's bucket 2 refuses with, from the same number in the book. A constraint stated in two
   voices is a constraint an advisor stops believing. */
const PROP_STEPS = [
  { name: 'Amount', short: 'How much is he putting in?', progress: [1, 4],
    provenance: 'As of 14 Sep · from the mandate he stated and his KYC record',
    sentinel: [`${AMIT.name}, 52, Delhi. Your client since 2026. Nothing on file yet — this would be his first money.`,
      'How much is he putting in?'],
    chips: [c('₹25,00,000', 'smart'), c('₹50,00,000'), c('₹10,00,000')], money: true },

  { name: 'Ceiling', short: 'The ceiling on his mandate', progress: [2, 4],
    sentinel: [`${inr(PROPOSAL_ASKED)} is above the ${inr(AMIT.mandate.ceilingRs)} ceiling on his mandate. I have not applied it.`,
      `I can build ${inr(PROPOSAL_AMOUNT)} now, or you raise the mandate with him first and we start again.`],
    chips: [c(`Use ${inr(PROPOSAL_AMOUNT)}`, 'primary'), c('Raise the mandate first', 'muted'),
      c('Where does the ceiling come from?', 'tertiary', { sheet: {
        title: 'Where does the ceiling come from?',
        body: [`He stated it himself on 14 Sep, as part of the mandate: equity 65, debt 30, cash 5, and ${inr(AMIT.mandate.ceilingRs)} to commit.`,
          'It is not a rule I applied and not a score anyone worked out. It is his instruction, and I will not quietly exceed it — raising it is a conversation with him, not a setting.'] } })] },

  { name: 'Purpose', short: 'What is this money for?', progress: [3, 4],
    sentinel: 'What is this money for, and by when?',
    chips: [c(`Wealth, by ${AMIT.goal.byYear}`, 'smart'), c('Retirement'), c("A child's education"), c('No fixed date', 'muted')],
    composer: 'or type the goal' },

  { name: 'Mix', short: 'Against which mix?', progress: [4, 4],
    sentinel: [`Against which mix? He stated equity ${AMIT.mandate.equity}, debt ${AMIT.mandate.debt}, cash ${AMIT.mandate.cash}.`,
      'He has no risk profile, so there is no number to check that against — I will build to what he stated and say so on the document.'],
    chips: [c('Use his stated mix', 'primary'), c('Profile his risk first', 'muted'),
      c('Why does that matter?', 'tertiary', { sheet: {
        title: 'Why does a missing risk profile matter?',
        body: ['A risk profile is the thing a mix is checked AGAINST. Without one, the mix is his instruction rather than a recommendation, and nobody has tested whether he could sit through what it does in a bad quarter.',
          'The proposal is still real and still sendable. It simply carries the caveat instead of hiding it — and the caveat is the sentence you read to him.'] } })] },

  { name: 'Result', result: true,
    chips: [c('Show the six funds', 'tertiary'), c('What stops this being placed?', 'tertiary')],
    cta: 'Send to Mr. Aggrawal' },
];
const PROP_TOTAL = 4;

/* The table is the proposal. Cash is a ROW and not a footnote, because 5% of the money not being invested
   is a decision the client agreed to and the document has to show it. */
const PROP_COLUMNS = [
  { key: 'fund', label: 'Fund', kind: 'text', sticky: true, width: 132 },
  { key: 'amount', label: 'Amount', kind: 'currency', align: 'end', sortable: true },
  { key: 'pct', label: 'Share', kind: 'text', align: 'end' },
];
const propRows = () => [
  ...PROPOSAL_SPLIT.map((r) => ({ id: r.fund, fund: (fundById(r.fund) || {}).name || r.fund, amount: inr(r.amountRs), pct: `${r.pct.toFixed(1)}%` })),
  { id: 'cash', fund: 'Kept in cash', amount: inr(PROPOSAL_CASH.amountRs), pct: `${PROPOSAL_CASH.pct.toFixed(1)}%` },
];
const PropDetail = ({ id }) => {
  const row = id === 'cash' ? PROPOSAL_CASH : PROPOSAL_SPLIT.find((r) => r.fund === id);
  const f = id === 'cash' ? null : fundById(id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: '0 var(--space-2)' }}>
      <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink-soft)' }}>{row.why}</span>
      {f && (
        <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
          {f.category} · {f.plan === 'direct' ? 'Direct plan' : f.plan} · riskometer {f.riskometer} · exit load {f.exitLoad}
        </span>
      )}
    </div>
  );
};

/* WHAT STOPS IT BEING PLACED. Rule 2 holds: the blocking rows are TEXT on the peach bubble, never a red
   fill, and a row that is merely a caveat does not borrow the blocking tone to look serious. */
function ProposalBlockers() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {PROPOSAL_BLOCKERS.map((b) => (
        <div key={b.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)' }}>{b.label}</span>
            <PROP_DS.Badge tone={b.blocking ? 'over' : 'under'}>{b.value}</PROP_DS.Badge>
          </div>
          <span style={{ font: 'var(--type-caption-font)', color: b.blocking ? 'var(--color-status-over-fg)' : 'var(--color-muted)' }}>{b.note}</span>
        </div>
      ))}
    </div>
  );
}

const PROP_SUMMARY = `${inr(PROPOSAL_AMOUNT)} across six funds and a cash line, built to the mix he stated — equity ${AMIT.mandate.equity}, debt ${AMIT.mandate.debt}, cash ${AMIT.mandate.cash}. The largest single fund is 24%, under the ${LIMITS.singleFund}% ceiling.`;
const PROP_PROVENANCE = 'As of 14 Sep · from the mandate he stated and your own shelf · he has no risk profile';
/* The confirm sheet's disclosure is the whole point of this journey. */
const PROP_DISCLOSURE = 'Sending this emails him the document. It places nothing, opens no folio and moves no money — his KYC is still in process.';
/* VersionRow takes the WHOLE list, not one row per version — shaped here so the screen never hand-maps
   the book. `sent` marks the version the CLIENT received, which is the one that matters when he rings. */
const PROP_VERSION_LIST = PROPOSAL_VERSIONS.map((v) => ({
  id: `v${v.v}`, name: `V${v.v}`, summary: v.note, meta: v.at, sent: v.state === 'sent',
}));
const PROP_CONFIRM_ROWS = [
  { label: 'What is sent', value: 'A PDF proposal, version 3' },
  { label: 'To', value: `${AMIT.name} · on file` },
  { label: 'What it commits', value: 'Nothing' },
  { label: 'Before anything can be placed', value: 'CKYC clear · nominee on file' },
];

function ProposalResult({ state = 'draft', savedAt, openRow = null, onSave, onDownload, onPrimary, sentAt, blockers = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <PROP_DS.ResultCard journey="proposal" state={state} savedAt={savedAt}
        title={`Where ${inr(PROPOSAL_AMOUNT)} would go`} provenance={PROP_PROVENANCE} summary={PROP_SUMMARY}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <PROP_DS.DataTable columns={PROP_COLUMNS} rows={propRows()} overflow="fold" maxRows={7} defaultOpen={openRow}
            emptyState={{ title: 'Nothing proposed yet.', body: 'Give me an amount and a mix and I will build it.' }}
            expandable={(r) => <PropDetail id={r.id} />} />
          {blockers && <ProposalBlockers />}
        </div>
      </PROP_DS.ResultCard>
      {/* INSIDE THE TURN, not pinned. The ruling of 18 Sep moved every chip and every CTA into the turn
          that offered them, and ResultCard's own contract still said "the Dock's chips slot" until this
          screen became its first consumer. */}
      <PROP_DS.ResultActions state={state} onSave={onSave} onDownload={onDownload} format="PDF" />
      <PROP_DS.ResultPrimary journey="proposal" state={state} client="Mr. Aggrawal" onPrimary={onPrimary} sentAt={sentAt} />
      {/* ResultPrimary's success line says the client has it. It cannot say what this journey has to say
          next — that the document went and the money did not — because that is true of a proposal and
          not of a rebalance, and the component serves both. So the consequence is a sentence in the turn,
          the same shape Journey B's success turn uses to say the opposite. */}
      {/* F-54's first dissent, ruled 20 Sep 2026 ("tumare vote"): the 8 between two sentences that five
          other sites set at 10 is now SentinelTurn's 10, and this is no longer a site at all. */}
      {state === 'sent' && (
        <PROP_DS.SentinelTurn continued
          say={[`The document has gone to ${AMIT.name}. Nothing has been placed — no folio is open and no money has moved.`,
            'Two things have to clear before any of it can be: his CKYC, and a nominee on file. I will tell you when they do.']} />
      )}
    </div>
  );
}

/* THE FUND THE JOURNEY WAS ENTERED WITH — and the honest half of it.

   A fund carried in from the explorer does NOT skip a question: the advisor said which fund, not how
   much, not what for. So this sits above the first step and says two things — that the fund arrived,
   and what this journey can actually do with it.

   AND IT CANNOT RE-BUILD THE SPLIT. `PROPOSAL_SPLIT` is a fixture written for Amit, not an allocation
   engine, and swapping a fund into a mix is a decision about somebody's money rather than a formatting
   change. So when the fund is already in the mix, Sentinel names its share; when it is not, it says so
   plainly and offers the swap as a decision rather than doing it quietly. Inventing a re-optimised
   split here would be the one kind of lie this product never tells. */
function propCarriedLines(fundId) {
  const f = fundById(fundId); if (!f) return null;
  const row = PROPOSAL_SPLIT.find((x) => x.fund === fundId);
  if (row) {
    return [`${f.name} is already in the mix I would build for ${AMIT.name} — ${row.pct.toFixed(1)}% of it, ${inr(row.amountRs)}.`,
      `${row.why} I will still ask the four questions, because you told me the fund and not the amount.`];
  }
  if (!f.onShelf) {
    return [`${f.name} is not on your compliance shelf, so I cannot put it in a proposal for ${AMIT.name}.`,
      'I will build the mix without it. Take it off the shelf question with your compliance team and we can start again.'];
  }
  const same = PROPOSAL_SPLIT.map((x) => fundById(x.fund)).filter((x) => x && x.category === f.category);
  return [`${f.name} is not in the mix I would build for ${AMIT.name}.`,
    same.length
      ? `That sleeve is already held by ${same.map((x) => x.name).join(' and ')}. Swapping ${f.name} in is a decision about his money, not a formatting one — say so and I will, and the document will name what changed.`
      : `Nothing in the mix covers ${f.category.toLowerCase()} yet. Adding it changes what he is exposed to, so it is your call rather than mine — say so and I will put it in.`];
}
const PropCarried = ({ fundId }) => {
  const lines = propCarriedLines(fundId);
  return lines ? <PROP_DS.SentinelTurn say={lines} /> : null;
};

Object.assign(window, { AMIT, PROP_ASK, PropCarried, propCarriedLines, PROP_STEPS, PROP_TOTAL, PROP_VERSION_LIST, PROP_COLUMNS, propRows, PropDetail,
  ProposalBlockers, ProposalResult, PROP_SUMMARY, PROP_PROVENANCE, PROP_DISCLOSURE, PROP_CONFIRM_ROWS });
