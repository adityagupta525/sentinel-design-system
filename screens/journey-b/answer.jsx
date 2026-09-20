/* The answer turn of Journey B — screens 3 and 4 of the flow, which are ONE page, because the artifact
   expands in place and a second page for a state of the same screen is a page nobody needs.

   Shared by 03-thread-answer.html (frozen states) and prototype.html (live), so the two cannot drift.
   Everything drawn is the system's; this file only says what Sharma's answer contains and in what order.

   No top-level destructuring: every .jsx a page loads compiles into ONE scope, and home.jsx / thread.jsx
   are loaded beside this. One uniquely-named const cannot collide. */
const ANSWER_DS = window.SentinelDesignSystem_0682a2;

/* THE COPY IS PLAINER THAN THE ARCHIVE'S, on the owner's ruling of 18 Sep 2026: an advisor reading this
   aloud may not be a confident English reader, and every sentence here is one they have to say to a
   client. So: short sentences, no jargon where a plain word exists ("what moved the mix", not "drift
   attribution"), and the number before the explanation. The FACTS are unchanged — 62 → 71 against a 60
   target, two-thirds from the rally — and they are the product's own (docs/screens-source/src/screens/
   Chat.tsx:254-268). What changed is only the words around them. */
const DRIFT_ASK = "Why did Sharma's portfolio drift this quarter?";
const DRIFT_STEPS = [
  "Reading Sharma's holdings — 18 funds",
  'Comparing them with his mandate',
  'Checking his Q2 and Q3 statements',
  'Working out what moved',
];
const DRIFT_REASONING = 'Equity went from 62% to 71%. He agreed to 60%. Three things moved it, and only one was his own decision.';
const DRIFT_ANSWER = 'Most of it is the small-cap rally — about two of every three points. You did not cause it, and selling now has a cost.';

/* Colours are the allocation tokens, never a hex: the archive wrote #b69377 / #d9bb9e / #ebd4c3
   (Chat.tsx:36-40), which are exactly --color-alloc-equity / -debt / -cash. */
const SHARMA_ALLOC = [
  { label: 'Equity', value: 71, color: 'var(--color-alloc-equity)' },
  { label: 'Debt', value: 24, color: 'var(--color-alloc-debt)' },
  { label: 'Cash', value: 5, color: 'var(--color-alloc-cash)' },
];
/* Chat.tsx:42 marks these "[draft] … illustrative demo figures — the headline (62→71, small-cap rally)
   is from the pattern plate". So the headline is the product's; the 6.1 / 2.0 / 0.9 split is the
   archive's illustration of it, carried here as that and labelled as that on the page. The middle one is
   flagged as his own decision, which the reasoning line requires and the archive's data did not do. */
const DRIFT_CONTRIB = [
  { label: 'Small-cap rally', value: 6.1, note: 'the market did this, not you' },
  { label: 'His July top-up', value: 2.0, note: 'it went into Quant Small Cap', intentional: true },
  { label: 'The funds moved', value: 0.9, note: 'their managers went to large caps, not you' },
];
const DRIFT_PROVENANCE = 'As of 30 Sep · from his Q3 statement and the mandate on file';
/* COMPLETENESS, NOT JUST PROVENANCE (R1, docs/RESEARCH.md). The top theme in the study was a total that
   was quietly short because one AMC had not reported — "total AUM shown is less". Saying where a figure
   came from does not say whether it is all of it, so the allocation now states both. */
const ALLOC_PROVENANCE = 'As of 30 Sep · from his Q3 statement · all 18 funds reported';
const WHY_71 = {
  title: 'Why is 71% a problem?',
  body: [
    'He agreed to 60% in equity. He is at 71%, which is 11 points more. In a normal year you would barely notice it.',
    'If the market falls 20%, he loses more than he would have at 60%. That is when the extra equity shows.',
  ],
};

/* WHAT FITS IN 96px. The peek is recognition, not reading (ArtifactCard's header, readme:181), and a peek
   bar chart caps at four rows (readme:171 — 3 rows = 62). So the peek is ChartBar at density "peek":
   three ranked bars, one colour, direct-labelled. Rule 1 — the label carries the identity, never the hue.
   AttributionChart, with its target caption, notes and count-up, is the EXPANDED artifact. */
function DriftPeek({ run = false }) {
  return (
    <ANSWER_DS.ChartBar density="peek" run={run}
      bars={DRIFT_CONTRIB.map((c) => ({ label: c.label, value: c.value }))}
      valueFormat={(v) => `+${v.toFixed(1)}`} />
  );
}
function DriftExpanded({ run = false }) {
  return <ANSWER_DS.AttributionChart from={62} to={71} target={60} targetLabel="He agreed to" todayLabel="He is at" contributions={DRIFT_CONTRIB} run={run} />;
}

/* The table view every chart owes the advisor (readme.md:235 — no value is ever reachable only by
   touching a coloured shape), reached from the expanded card's ⋯. Same numbers, same order, as words. */
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
  footer: 'He agreed to 60% · he is at 71% · 9.0 points in all',
};
function DriftTable() {
  return <ANSWER_DS.DataTableCard title="What moved the mix · Q2 → Q3" meta="+9.0 pts" columns={DRIFT_TABLE.columns} rows={DRIFT_TABLE.rows} footer={DRIFT_TABLE.footer} />;
}

/* WHAT THE ADVISOR IS OFFERED SITS IN THE CONVERSATION (18 Sep 2026, the owner's ruling). Not pinned
   above the composer: a chip that outlives the turn that offered it makes the screen a toolbar, and an
   advisor scrolling back through the thread cannot tell which answer a pinned chip belonged to. So the
   chips and the CTA scroll with the message they came from. The Dock keeps the composer and nothing
   else — rule 3 is untouched, and the deprecation is written into Dock.d.ts.

   There is exactly ONE way to each thing here. "Why is 71% a problem?" used to sit in the Dock while the
   card's footer also carried "Why?", two controls opening the same sheet on the same screen; the card's
   Why? is gone and the plain question stays, because a question in words is a better door than a word. */
function AnswerActions({ onWhy, onHoldings, onRebalance, holdings = true, animate = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <ANSWER_DS.ChipRow animate={animate}>
        <ANSWER_DS.AnswerChip label={WHY_71.title} variant="tertiary" onClick={onWhy || (() => {})} />
        {holdings && <ANSWER_DS.AnswerChip label="Show the 18 holdings" onClick={onHoldings || (() => {})} />}
      </ANSWER_DS.ChipRow>
      <ANSWER_DS.DarkButton full arrow label="Rebalance to his mandate" onClick={onRebalance || (() => {})} />
    </div>
  );
}

/* The turn. `artifact` is ArtifactCard's own state plus 'failed', the case where the answer arrived and
   its breakdown did not. `enter` plays the system's ds-rise the way the archive's motion.div did
   (Chat.tsx:266) — the live page passes it, the frozen page does not.

   `continued` on the block: the trace above it already signed the turn "✦ Sentinel", and the name was
   appearing twice for one thing Sentinel said. */
function AnswerTurn({ artifact = 'peek', view = 'chart', run = false, enter = false, continued = true, actions, onToggle, onShare, onMenu, onRetry, cardRef }) {
  const filling = artifact === 'filling';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      <ANSWER_DS.SentinelBlock continued={continued}>
        <ANSWER_DS.SentinelText text={DRIFT_ANSWER} />
        <div style={{ marginTop: 'var(--space-12)' }}><ANSWER_DS.AllocationCard segments={SHARMA_ALLOC} animate={run} /></div>
        {/* R4: the cap split, because Equity 71 is not actionable and both 25% ceilings are written against
            caps. ConcentrationBar states the one that is breached — the small-cap sleeve — as a bar with its
            number and its limit in the label, so the figure is never carried by the bar alone. */}
        {/* F-54's other two dissents, ruled 20 Sep 2026: the card that followed a card at 8 takes the part
            gap (12) seven other sites use, and provenance takes the 10 that InfoCard, OverlapView and the
            rail all use. The box is Surface — a raised card with no shadow was the fifth elevation
            Surface exists to stop. */}
        <div style={{ marginTop: 'var(--space-12)' }}>
          <ANSWER_DS.Surface elevation="flat">
            <ANSWER_DS.ConcentrationBar fraction={0.31} label="Small cap 31% — the sleeve ceiling is 25%" />
          </ANSWER_DS.Surface>
        </div>
        <div style={{ marginTop: 'var(--space-10)' }}><ANSWER_DS.Provenance text={ALLOC_PROVENANCE} /></div>
        {artifact === 'failed' && (
          <>
            <div style={{ marginTop: 'var(--space-12)' }}>
              <ANSWER_DS.SentinelText weight="Regular" text="I know the mix moved, but not what moved it. His Q3 statement did not open, so I have not guessed the rest." />
            </div>
            <div style={{ marginTop: 'var(--space-12)' }}><ANSWER_DS.AnswerChip label="Try again" variant="primary" onClick={onRetry || (() => {})} /></div>
          </>
        )}
      </ANSWER_DS.SentinelBlock>
      {artifact !== 'failed' && (
        <div ref={cardRef}>
          <ANSWER_DS.ArtifactCard state={artifact} eyebrow="What moved the mix · Q2 → Q3"
            title={filling ? 'Working out what moved it' : 'Equity 62% → 71%. Mostly the market.'}
            provenance={filling ? undefined : DRIFT_PROVENANCE}
            onToggle={onToggle || (() => {})} onShare={onShare} onMenu={onMenu}>
            {artifact === 'expanded' ? (view === 'table' ? <DriftTable /> : <DriftExpanded run={run} />) : <DriftPeek run={run} />}
          </ANSWER_DS.ArtifactCard>
        </div>
      )}
      {actions}
    </div>
  );
}

Object.assign(window, { DRIFT_TABLE, DriftTable, DRIFT_ASK, DRIFT_STEPS, DRIFT_REASONING, DRIFT_ANSWER, SHARMA_ALLOC, DRIFT_CONTRIB, DRIFT_PROVENANCE, ALLOC_PROVENANCE, WHY_71, DriftPeek, DriftExpanded, AnswerTurn, AnswerActions });
