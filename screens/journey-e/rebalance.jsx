/* JOURNEY E — the rebalance, reached COLD. Shared by rebalance.html and the end-to-end prototype.

   Journey B already rebalances Sharma, and this is not a second copy of it. The difference is where the
   advisor came from. In B they have just read why he drifted, so the moves arrive as the next sentence
   in a conversation. Here they type "rebalance Sharma" with nothing in front of them — and Sentinel
   cannot answer that, because "rebalance" is not an instruction until someone says HOW FAR.

   That is the one rail step SCREENS-PLAN counts for this journey, and the three answers are three
   different RULES rather than three appetites: his mandate, the ±5 drift band, and the 25% single-fund
   ceiling. They are in `book.jsx` as REBALANCE_TARGETS with the arithmetic written out.

   THE PART THAT MATTERS. Only one of the three is costed, because costing needs the purchase dates on
   folio 9142/28 and nobody has supplied them. So Sentinel can SIZE all three and COST one — and it will
   not open a confirm sheet on a move whose cost it cannot state. A product that lets an advisor approve
   an uncosted switch has made the number optional, and the number is the whole job.

   `book.jsx`, `journey-a/rail.jsx` and `journey-b/moves.jsx` are loaded before this file. */
const REB_DS = window.SentinelDesignSystem_0682a2;

const SHARMA = clientById('sharma');
const REB_ASK = 'Rebalance Sharma';
const costed = (t) => t.costRs != null;

/* One row per target: what it is, where it lands him, what it moves, and what it costs — or, honestly,
   that it has no cost yet and why. Rule 2: the uncosted line is TEXT in the danger colour, never a fill,
   and it is not a failure — it is a missing input with a name. */
function TargetRow({ t, onPick, onAskCost }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: 'var(--space-12) 0', borderBottom: 'var(--border-1) solid var(--color-line-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)' }}>{t.label}</span>
        <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>Equity {t.equityAfter}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{t.rule}</span>
        <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>
          Moves {inr(t.amountRs)} · {t.points} points
        </span>
      </div>
      <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink-soft)' }}>{t.why}</span>
      {costed(t)
        ? <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>Costs him {inr(t.costRs)}</span>
        : <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-status-over-fg)' }}>
            Not costed. I need the purchase dates on folio {SHARMA.holdings[0].folio} before I can put a figure on this.
          </span>}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <REB_DS.ChipRow>
          {costed(t)
            ? <REB_DS.AnswerChip label="Take this one" variant="primary" onClick={() => onPick && onPick(t)} />
            : <REB_DS.AnswerChip label="Get the purchase dates" onClick={() => onAskCost && onAskCost(t)} />}
        </REB_DS.ChipRow>
      </div>
    </div>
  );
}

const REB_STEPS = [
  { name: 'How far', short: 'How far do you want to take it?', progress: [1, 1],
    provenance: 'As of 30 Sep · from his Q3 statement, his mandate and your own limits',
    sentinel: [`${SHARMA.name} is at equity ${SHARMA.allocation.equity}% against the ${SHARMA.mandate.equity}% he agreed to — ${driftPoints(SHARMA)} points over.`,
      '"Rebalance" is not an instruction until someone says how far. Three answers, and they are three different rules rather than three appetites.'],
    targets: true,
    chips: [c('Why are there three?', 'tertiary', { sheet: {
      title: 'Why are there three?',
      body: ['Each one is a different rule. His mandate is the mix he agreed to. The drift band is the ±5 points either side of it before I raise a review. The single-fund ceiling is 25% in any one scheme.',
        'Quant Small Cap is 31% of his book and it is the whole of his small-cap sleeve, so that one holding is over the fund ceiling and the sleeve ceiling at the same time — two rules, both 25, and they are not the same rule.',
        'Clearing the fund takes equity past the mandate to 58%. That is a consequence of the ceiling sizing the move, not a view about how much equity he should hold.'] } })] },
  { name: 'Result', result: true },
];
const REB_TOTAL = 1;

/* THE UNCOSTED PATH. Not a refusal and not an error — a missing input with a name, and the nearest real
   thing offered in the same breath, which is the rule every refusal in this product keeps. */
const REB_UNCOSTED = {
  tail: 'I will not put a figure on it, and I will not let you approve it without one. Here is what I can do instead.',
  chips: ['Ask the RTA for the dates', 'Take the one I can cost'],
};

/* The uncosted turn. Same shape as every refusal in this product: name the thing, say plainly what is
   missing, and offer the nearest real action in the same breath. The sentence is BUILT from the target
   rather than written per option, so a fourth target could never arrive with softer wording. */
function UncostedTurn({ target, onChip, continued = true }) {
  return (
    <REB_DS.SentinelBlock continued={continued}>
      <REB_DS.SentinelText text={`${target.label} moves ${inr(target.amountRs)} and lands him at equity ${target.equityAfter}%.`} />
      <div style={{ marginTop: 'var(--space-10)' }}>
        <REB_DS.SentinelText weight="Regular" text={`I can size it and I cannot cost it. A switch is a redemption plus a purchase, so it is taxable, and the tax depends on when each lot was bought — folio ${SHARMA.holdings[0].folio} has no purchase dates on file.`} />
      </div>
      <div style={{ marginTop: 'var(--space-10)' }}><REB_DS.SentinelText weight="Regular" text={REB_UNCOSTED.tail} /></div>
      <div style={{ marginTop: 'var(--space-12)' }}>
        <REB_DS.ChipRow>
          {REB_UNCOSTED.chips.map((l) => <REB_DS.AnswerChip key={l} label={l} onClick={() => onChip && onChip(l)} />)}
        </REB_DS.ChipRow>
      </div>
    </REB_DS.SentinelBlock>
  );
}

const REB_PROVENANCE = 'Costed 30 Sep · exit loads and tax from the scheme documents · purchase dates for folio 9142/28 not on file';
const REB_SUMMARY = `Two moves. Together they take equity from ${SHARMA.allocation.equity}% to 58% and Quant Small Cap from 31% to 18%. The ceiling sized them, so equity lands past the ${SHARMA.mandate.equity}% mandate.`;

/* The rail's result is an ARTIFACT, not a message: the advisor asked for a rebalance cold and may save
   it, download it, or come back to it. Journey B's MovesTurn is the same body in a SentinelBlock,
   because there it is the next sentence in a conversation. One body, two frames — and exactly ONE
   approve on either, never both. */
function RebalanceResult({ state = 'draft', savedAt, onSave, onDownload, onPrimary, sentAt }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <REB_DS.ResultCard journey="rebalance" state={state} savedAt={savedAt}
        title="Two moves" provenance={REB_PROVENANCE} summary={REB_SUMMARY}>
        <MovesBody provenance={false} />
      </REB_DS.ResultCard>
      <REB_DS.ResultActions state={state} onSave={onSave} onDownload={onDownload} format="PDF" saveLabel="Save the plan" />
      <REB_DS.ResultPrimary journey="rebalance" state={state} moves={MOVES.length} onPrimary={onPrimary} sentAt={sentAt} />
    </div>
  );
}

Object.assign(window, { SHARMA, REB_ASK, UncostedTurn, REB_STEPS, REB_TOTAL, REB_UNCOSTED, REB_PROVENANCE, REB_SUMMARY, TargetRow, RebalanceResult });
