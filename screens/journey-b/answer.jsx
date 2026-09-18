/* The answer turn of Journey B — screen 3 — shared by 03-thread-answer.html (frozen states) and
   prototype.html (live), so the two cannot drift. Everything drawn is the system's; this file only
   says what Sharma's answer contains and in which order.

   No top-level destructuring: every .jsx a page loads compiles into ONE scope, and home.jsx /
   thread.jsx are loaded beside this. One uniquely-named const cannot collide. */
const ANSWER_DS = window.SentinelDesignSystem_0682a2;

/* The question, the steps, the reasoning and the answer are the product's own, from
   docs/screens-source/src/screens/Chat.tsx:254-268. Nothing here is written for the specimen. */
const DRIFT_ASK = "Why did Sharma's portfolio drift this quarter?";
const DRIFT_STEPS = [
  "Reading Sharma's holdings — 18 funds",
  'Comparing against his mandate',
  'Checking Q2 statements',
  'Attributing the drift',
];
const DRIFT_REASONING = 'Equity went from 62% to 71% against a 60% target. Three things moved it, and only one of them was a decision.';
const DRIFT_ANSWER = 'Two-thirds of the drift is the small-cap rally. You did not cause it, and selling into it has a cost.';

/* Colours are the allocation tokens, never a hex: the archive wrote #b69377 / #d9bb9e / #ebd4c3
   (Chat.tsx:36-40), which are exactly --color-alloc-equity / -debt / -cash. */
const SHARMA_ALLOC = [
  { label: 'Equity', value: 71, color: 'var(--color-alloc-equity)' },
  { label: 'Debt', value: 24, color: 'var(--color-alloc-debt)' },
  { label: 'Cash', value: 5, color: 'var(--color-alloc-cash)' },
];
/* Chat.tsx:42 marks these "[draft] … illustrative demo figures — the headline (62→71, small-cap rally)
   is from the pattern plate". So: 62 → 71 and "two-thirds is the rally" are the product's; the split
   6.1 / 2.0 / 0.9 is the archive's illustration of it, and it is carried here as that, not as data.
   The one that was a decision is flagged, which the archive's data did not do and its reasoning line
   ("only one of them was a decision") requires. */
const DRIFT_CONTRIB = [
  { label: 'Small-cap rally', value: 6.1, note: 'the market, not a decision of yours' },
  { label: 'His July top-up', value: 2.0, note: 'went into Quant Small Cap', intentional: true },
  { label: 'Funds crept up-cap', value: 0.9, note: 'managers drifted toward large caps' },
];
const DRIFT_PROVENANCE = 'As of 30 Sep · from his Q3 statement and mandate on file';
const ALLOC_PROVENANCE = 'As of 30 Sep · from his Q3 statement';
/* The explainer behind "Why is 71% a problem?" — Chat.tsx:362, two paragraphs, which is the sheet's
   own working limit. */
const WHY_71 = {
  title: 'Why is 71% a problem?',
  body: [
    'Equity is 11% over the 60% you agreed. In a normal year that barely shows.',
    'In a 20% fall it costs him more than the agreed mix would have — the drift only bites when markets drop.',
  ],
};

/* WHAT FITS IN 96px. The peek is recognition, not reading (ArtifactCard's header, readme:181), and a
   peek bar chart caps at four rows (readme:171 — 3 rows = 62). So the peek is ChartBar at density
   "peek": three ranked bars, one colour, direct-labelled. Rule 1 — the label carries the identity,
   never the hue. AttributionChart, with its target caption, hairline, notes and count-up, is the
   EXPANDED artifact: it does not fit 96 and is not meant to. */
function DriftPeek({ run = false }) {
  return (
    <ANSWER_DS.ChartBar density="peek" run={run}
      bars={DRIFT_CONTRIB.map((c) => ({ label: c.label, value: c.value }))}
      valueFormat={(v) => `+${v.toFixed(1)}`} />
  );
}
function DriftExpanded({ run = false }) {
  return <ANSWER_DS.AttributionChart from={62} to={71} target={60} contributions={DRIFT_CONTRIB} run={run} />;
}

/* THE TABLE VIEW EVERY CHART MUST OFFER (readme.md:235 — "no value in this product is ever reachable
   only by touching a coloured shape"), reached from the expanded card's ⋯. Same three numbers, same
   order, as words. The note column is what the chart draws under each bar, so nothing is lost by
   reading this instead of looking at that. */
const DRIFT_TABLE = {
  columns: [{ key: 'what', header: 'What moved it' }, { key: 'pts', header: 'Points', align: 'right' }],
  rows: DRIFT_CONTRIB.map((c) => ({
    what: (
      <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span style={{ font: 'var(--type-row-font)', color: c.intentional ? 'var(--color-data-deemph)' : 'var(--color-ink)' }}>{c.label}</span>
        <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{c.note}</span>
      </span>
    ),
    pts: <span style={{ font: 'var(--type-row-strong-font)', color: c.intentional ? 'var(--color-data-deemph)' : 'var(--color-bronze-deep)', fontVariantNumeric: 'tabular-nums' }}>+{c.value.toFixed(1)}</span>,
  })),
  footer: 'Target 60% · today 71% · +9.0 points in all',
};
function DriftTable() {
  return <ANSWER_DS.DataTableCard title="Drift attribution · Q2 → Q3" meta="+9.0 pts" columns={DRIFT_TABLE.columns} rows={DRIFT_TABLE.rows} footer={DRIFT_TABLE.footer} />;
}

/* The turn. `artifact` is ArtifactCard's own state plus 'failed', the case where the answer arrived
   and its breakdown did not. `enter` plays the system's ds-rise the way the archive's motion.div did
   (Chat.tsx:266: opacity 0 → 1, y 6 → 0, 240ms) — the live page passes it, the frozen page does not. */
function AnswerTurn({ artifact = 'peek', view = 'chart', run = false, enter = false, onToggle, onWhy, onShare, onMenu, onRetry, cardRef }) {
  const filling = artifact === 'filling';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      <ANSWER_DS.SentinelBlock>
        <ANSWER_DS.SentinelText text={DRIFT_ANSWER} />
        <div style={{ marginTop: 'var(--space-12)' }}><ANSWER_DS.AllocationCard segments={SHARMA_ALLOC} animate={run} /></div>
        <div style={{ marginTop: 'var(--space-8)' }}><ANSWER_DS.Provenance text={ALLOC_PROVENANCE} /></div>
        {artifact === 'failed' && (
          <>
            <div style={{ marginTop: 'var(--space-12)' }}>
              <ANSWER_DS.SentinelText weight="Regular" text="I have the drift but not its breakdown — his Q3 statement did not parse, so I have not drawn what moved it." />
            </div>
            <div style={{ marginTop: 'var(--space-12)' }}><ANSWER_DS.AnswerChip label="Try again" variant="primary" onClick={onRetry || (() => {})} /></div>
          </>
        )}
      </ANSWER_DS.SentinelBlock>
      {artifact !== 'failed' && (
        <div ref={cardRef}>
          <ANSWER_DS.ArtifactCard state={artifact} eyebrow="Drift attribution · Q2 → Q3"
            title={filling ? 'Working out what moved it' : '62% → 71%, mostly the market'}
            provenance={filling ? undefined : DRIFT_PROVENANCE}
            onToggle={onToggle || (() => {})} onWhy={onWhy} onShare={onShare} onMenu={onMenu}>
            {artifact === 'expanded' ? (view === 'table' ? <DriftTable /> : <DriftExpanded run={run} />) : <DriftPeek run={run} />}
          </ANSWER_DS.ArtifactCard>
        </div>
      )}
    </div>
  );
}

/* The Dock's chips for this turn. "Show the 18 holdings" is the artifact's door, so it goes when the
   artifact is not there; "Why is 71% a problem?" is about the allocation, which is, so it stays. */
function AnswerChips({ onWhy, onHoldings, holdings = true, animate = false }) {
  return (
    <ANSWER_DS.ChipRow animate={animate}>
      <ANSWER_DS.AnswerChip label={WHY_71.title} variant="tertiary" onClick={onWhy || (() => {})} />
      {holdings && <ANSWER_DS.AnswerChip label="Show the 18 holdings" onClick={onHoldings || (() => {})} />}
    </ANSWER_DS.ChipRow>
  );
}

Object.assign(window, { DRIFT_TABLE, DriftTable, DRIFT_ASK, DRIFT_STEPS, DRIFT_REASONING, DRIFT_ANSWER, SHARMA_ALLOC, DRIFT_CONTRIB, DRIFT_PROVENANCE, ALLOC_PROVENANCE, WHY_71, DriftPeek, DriftExpanded, AnswerTurn, AnswerChips });
