/* JOURNEY F — the client review. Shared by review.html and the end-to-end prototype.

   SCREENS-PLAN counts one rail step for this journey, and the honest one is not a fact-finding
   question: the book already holds every fact this review can state. The one thing Sentinel cannot
   infer is WHAT THE REVIEW IS FOR — and the same holdings produce a different document for a filing,
   for a meeting, and for a decision to invest more. The facts do not change; what is left out and what
   is proposed does. A product that quietly turns a record into a proposal has sold something, and the
   advisor is the one who signed it.

   THE REVIEW'S REAL FINDING IS A MISSING FIGURE. Meera's record has her value, her fund count, her long
   tail, her SIP, her mandate, her risk and her goal — and NOT her 43 holdings, and NOT her actual
   equity / debt / cash split. So this review describes the shape of her book exactly and cannot say
   whether she is on her mandate, which is the most useful sentence a review would carry. It says so,
   with the reason and with what would fix it. `StatTile locked` is built for precisely that and had
   been on no screen since v9.

   `book.jsx` and `journey-a/rail.jsx` are loaded before this file. */
const REV_DS = window.SentinelDesignSystem_0682a2;

const MEERA = clientById('meera');
const REV_ASK = "Review Meera's portfolio";

/* The chip carries the audience id, so a branch reads the DECISION rather than matching the label text.
   Copy changes; an id does not. */
const REV_STEPS = [
  { name: 'What for', short: 'What is this review for?', progress: [1, 1],
    provenance: `As of ${MEERA.portfolio.asOf} · from her September statement and the mandate on file`,
    sentinel: [`${MEERA.name} holds ${inr(MEERA.portfolio.valueRs)} across ${MEERA.portfolio.funds} funds. Her risk number is ${MEERA.risk.score}, ${MEERA.risk.band}, locked ${MEERA.risk.lockedOn}.`,
      'The facts are the same whoever reads this. What changes is what I leave out and what I propose — so tell me what it is for, and I will not turn a record into a proposal on my own.'],
    audiences: true,
    chips: REVIEW_AUDIENCES.map((a) => c(a.chip, a.id === 'record' ? 'primary' : undefined, { audience: a.id })) },
  { name: 'Result', result: true },
];
const REV_TOTAL = 1;

/* THE SHAPE OF HER BOOK, which is the thing a review of 43 funds is actually about. Fourteen funds hold
   four-fifths of her money; twenty-nine hold the rest and none of them reaches 1.5%. The tail is ONE
   row, not twenty-nine: a list an advisor cannot read to a client is a list that hides the finding. */
function ReviewShape() {
  const tailPct = 100 - MEERA.tail.topSharePct;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <REV_DS.ConcentrationBar fraction={MEERA.tail.topSharePct / 100}
        label={`${MEERA.tail.topFunds} funds hold ${MEERA.tail.topSharePct}% — ${inr(REVIEW_TOP_RS)}`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <REV_DS.FigureRow label={`The other ${MEERA.tail.tinyFunds} funds`} value={`${inr(REVIEW_TAIL_RS)} · ${tailPct}%`} />
        <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink-soft)' }}>
          None of them reaches {MEERA.tail.tinyUnderPct}% of her book, which is {inr(REVIEW_TINY_CAP_RS)}. On average {inr(REVIEW_TAIL_AVG_RS)} each.
        </span>
        <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
          Too small to move the needle, and they still cost her a fee and a line on every statement.
        </span>
      </div>
    </div>
  );
}

/* WHAT IS ON FILE, AND WHAT IS NOT — side by side, because a review that shows only what it knows is
   the exact failure the research's top theme describes. The locked tile is not a placeholder for a
   figure we forgot; it is the review's finding, and it names what would produce it. */
function ReviewFacts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
      <REV_DS.StatTile label="Her book" value={inr(MEERA.portfolio.valueRs)} note={`${MEERA.portfolio.funds} funds · as of ${MEERA.portfolio.asOf}`} />
      <REV_DS.StatTile label="Her risk number" value={String(MEERA.risk.score)} note={`${MEERA.risk.band} · locked ${MEERA.risk.lockedOn}`} />
      <REV_DS.StatTile label="What she agreed to" value={`${MEERA.mandate.equity} / ${MEERA.mandate.debt} / ${MEERA.mandate.cash}`} note="Equity / debt / cash" />
      <REV_DS.StatTile locked label="What she actually holds" value="—" note="[PLACEHOLDER — her split, to supply]" />
    </div>
  );
}

const REV_MISSING = `Her statement was loaded fund by fund, and the ${MEERA.tail.tinyFunds} small funds have never been mapped to categories. So I can tell you the shape of her book exactly and I cannot tell you whether she is on the ${MEERA.mandate.equity}/${MEERA.mandate.debt}/${MEERA.mandate.cash} she agreed to. One category mapping fixes it for every review after this one.`;

/* The ending changes with the audience, and only the ending. */
const REV_ENDINGS = {
  record: { lines: [`Filed as at ${MEERA.portfolio.asOf}. I have proposed nothing.`,
      'What I could not check is written on the document, so the file says what was known on the day rather than implying everything was.'],
    chips: ['What could not be checked?', 'Add a note to the file'] },
  meeting: { lines: ['Twenty-nine of her forty-three funds are under ₹27,600 each. Together they are a fifth of her money and they do nothing a single fund would not do better.',
      'The question worth asking her: were those bought for a reason you would want kept, or did they arrive one SIP at a time?'],
    chips: ['Read it to her', 'Draft the question'] },
  invest: { lines: ['I cannot answer that one yet.',
      'Headroom is what her mandate allows her to add, and it is her mandate minus what she already holds. I have the first half and not the second.'],
    chips: ['Map her funds to categories', 'Review what I do have'] },
};

function ReviewEnding({ audience = 'record', onChip, continued = true }) {
  const e = REV_ENDINGS[audience];
  const blocked = audience === 'invest';
  return (
    <REV_DS.SentinelTurn continued={continued} say={e.lines}
      body={blocked ? <REV_DS.ConstraintCallout eyebrow="What is missing" body={REV_MISSING} /> : null}
      chips={
        <REV_DS.ChipRow>
          {e.chips.map((l) => <REV_DS.AnswerChip key={l} label={l} onClick={() => onChip && onChip(l)} />)}
        </REV_DS.ChipRow>
      } />
  );
}

const REV_PROVENANCE = `As of ${MEERA.portfolio.asOf} · from her September statement · her 43 holdings are not mapped to categories`;
const REV_SUMMARY = `${inr(MEERA.portfolio.valueRs)} across ${MEERA.portfolio.funds} funds. ${MEERA.tail.topFunds} of them hold ${MEERA.tail.topSharePct}% of it; the other ${MEERA.tail.tinyFunds} hold the rest and none reaches ${MEERA.tail.tinyUnderPct}%.`;

/* No `sentAt`: a review is never sent. A prop that does nothing is a prop that lies. */
function ReviewResult({ state = 'draft', savedAt, onSave, onDownload }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <REV_DS.ResultCard journey="review" state={state} savedAt={savedAt}
        title="What Meera holds" provenance={REV_PROVENANCE} summary={REV_SUMMARY}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-14)' }}>
          <ReviewFacts />
          <ReviewShape />
        </div>
      </REV_DS.ResultCard>
      {/* NO ResultPrimary. A review commits to nothing, so there is no dark CTA to press — the two
          secondary pills are the whole of it. `ResultPrimary journey='review'` exists in the contract
          and this screen deliberately does not use it: a review that ends in one big button is a
          proposal wearing a record's title. */}
      <REV_DS.ResultActions state={state} onSave={onSave} onDownload={onDownload} format="PDF" saveLabel="Save to her file" />
    </div>
  );
}

/* THE FUND THE JOURNEY WAS ENTERED WITH — and a review is the one journey where the answer is a
   question back.

   A review is about a CLIENT's book, not about a fund. So a fund carried in cannot change the facts of
   the review; what it can do is answer the thing an advisor is really asking when they send a fund for
   review — should she hold this? That is the reverse lookup, and it is the one this journey can do
   honestly: whether she already holds it, and what it would sit beside.

   It still does not skip the question. The audience decides whether this fund becomes a PROPOSAL inside
   the review or stays a note on the record, and that is exactly the choice step 1 asks for. */
function revCarriedLines(fundId) {
  const f = fundById(fundId); if (!f) return null;
  const holds = (MEERA.holdings || []).some((h) => h.fundId === fundId);
  const first = holds
    ? `${f.name} is already in ${MEERA.name}'s book, so a review can say how it has done and what it sits beside.`
    : `${MEERA.name} does not hold ${f.name} today.`;
  const second = f.onShelf
    ? 'What the review says about it depends on who reads it — a record states the position, an investment case argues for it. That is the question below.'
    : `It is also off your compliance shelf, so an investment case for it cannot be written whatever the audience. The record can still name it.`;
  return [first, second];
}
const RevCarried = ({ fundId }) => {
  const lines = revCarriedLines(fundId);
  return lines ? <REV_DS.SentinelTurn say={lines} /> : null;
};

Object.assign(window, { RevCarried, revCarriedLines, MEERA, REV_ASK, REV_STEPS, REV_TOTAL, ReviewShape, ReviewFacts, ReviewEnding,
  REV_ENDINGS, REV_MISSING, REV_PROVENANCE, REV_SUMMARY, ReviewResult });
