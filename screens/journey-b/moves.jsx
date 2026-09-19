/* Journey B, steps 5 to 7 — the moves, the decision, and what happened. Shared by 05-decide.html and
   prototype.html so the frozen states and the live run cannot disagree (screens/README rule 14).

   No top-level destructuring: every .jsx a page loads compiles into ONE scope. */
const MOVES_DS = window.SentinelDesignSystem_0682a2;

/* TWO COPY DEFECTS IN THE ARCHIVE, FIXED HERE AND RECORDED SO NOBODY RESTORES THEM.

   1. `Chat.tsx:281` says the pair brings equity "from 71% back to 58%", and `:283` says move 1 alone
      brings it "from 67% to 58%". Both cannot be true, and 67 is a figure from the review journey, not
      this one. The pair's effect is the one the product states twice and the one the answer screen's
      chart supports (he is at 71, he agreed to 60). So the pair's figure stays, stated ONCE on the
      simulation, and NO per-move figure is invented to replace the 67.
   2. `:284` and `:753` say "her ₹30,000 monthly SIP" in a journey that says *his* everywhere else.
      Sharma is a he throughout. Fixed. */
const MOVES_ASK = 'What would fixing it cost?';
const MOVES_ANSWER = 'Two moves, not seven. Together they bring equity from 71% back to 58%, and they cost ₹11,200.';
const MOVES = [
  { n: 1, title: 'Move ₹1,85,000 out of Quant Small Cap', body: 'Into ICICI Corporate Bond.' },
  { n: 2, title: 'Redirect his ₹30,000 monthly SIP', body: 'No exit load, no tax, and it stops the drift coming back.' },
];
const MOVES_PROVENANCE = 'Costed 30 Sep · exit loads and tax from the scheme documents';
const SKIPPED = {
  title: 'The five I skipped',
  body: [
    'I picked the two moves that do the most with the least cost and tax.',
    'The other trades are not costed in this build. I will not list a move I cannot cost, so there is nothing real to show here yet.',
  ],
};
const CONFIRM_DISCLOSURE = 'These two switches run under your ARN. Sharma gets a note explaining both moves and what they cost. Nothing else in his book changes.';
const CONFIRM_ROWS = [
  { label: 'Compliance shelf', value: 'Passed' },
  { label: 'Single-fund ceiling', value: 'No fund over 25%' },
  { label: 'Client consent', value: 'Required', tone: 'required' },
];
/* The note this build DRAFTS and does not send. */
const CLIENT_NOTE = 'Mr. Sharma, your equity had drifted to 71% against the 60% we agreed. I am moving ₹1,85,000 from Quant Small Cap into ICICI Corporate Bond and redirecting your ₹30,000 SIP. No exit load and no tax. This brings you back to 58%.';

/* THE SIMULATION — "what if", answered before the decision rather than inside it.
   One scale, two rows: where he is, and where these two moves put him. `Dumbbell` is the system's own
   two-values-on-one-scale mark, and the agreed 60% is the same reference on both rows, so the eye
   compares the thing that moved rather than two separate pictures. The cost sits under it, because a
   figure an advisor must defend never appears first on the surface where they approve it. */
/* No `run` prop: Dumbbell animates its own connector with ds-grow and takes no switch, so there is
   nothing here for a caller to freeze. A prop that does nothing is a prop that lies. */
function MovesSimulation() {
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)', boxSizing: 'border-box' }}>
      <MOVES_DS.Eyebrow>If you approve both</MOVES_DS.Eyebrow>
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        <MOVES_DS.Dumbbell label="Equity today" target={60} actual={71} targetLabel="He agreed to" actualLabel="He is at" />
        <MOVES_DS.Dumbbell label="Equity after these two moves" target={60} actual={58} targetLabel="He agreed to" actualLabel="He would be at" />
      </div>
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink)' }}>What it costs him</span>
        <span style={{ font: 'var(--type-row-strong-font)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>₹11,200</span>
      </div>
      <div style={{ marginTop: 'var(--space-8)' }}><MOVES_DS.Provenance text={MOVES_PROVENANCE} /></div>
    </div>
  );
}

/* Step 5's turn: the sentence, the simulation, the two moves, then what the advisor is offered — all of
   it inside the turn, scrolling with it (contradiction 60). */
function MovesTurn({ enter = false, actions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      <MOVES_DS.SentinelBlock>
        <MOVES_DS.SentinelText text={MOVES_ANSWER} />
        <div style={{ marginTop: 'var(--space-12)' }}><MovesSimulation /></div>
        <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {MOVES.map((m) => <MOVES_DS.MoveCard key={m.n} n={m.n} title={m.title} body={m.body} />)}
        </div>
      </MOVES_DS.SentinelBlock>
      {actions}
    </div>
  );
}

function MovesActions({ onSkipped, onApprove, animate = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <MOVES_DS.ChipRow animate={animate}>
        <MOVES_DS.AnswerChip label="Show the five we skipped" onClick={onSkipped || (() => {})} />
      </MOVES_DS.ChipRow>
      <MOVES_DS.DarkButton full arrow label="Approve both moves" onClick={onApprove || (() => {})} />
    </div>
  );
}

/* Step 7. WHAT HAS LEFT SENTINEL AND WHAT HAS NOT, said plainly — and undo offered only for what has not.
   The two switches are placed under the advisor's ARN: that has left, and an "undo" on it would be a lie.
   The note to the client is drafted and sits here until the advisor picks a channel and sends it outside
   Sentinel, so it can still be changed or dropped. A success screen that blurs those two is the one place
   in the product where a comfortable word costs real money. */
function SuccessTurn({ enter = false, onRead, onBack, note = false, onDrop }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      <MOVES_DS.SentinelBlock>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)', boxSizing: 'border-box' }}>
          <MOVES_DS.DrawnCheck />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ font: 'var(--type-body-strong-font)', color: 'var(--color-ink)' }}>Both moves placed</span>
            <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>19 Sep, 3:04 pm · settles T+2</span>
          </span>
        </div>
        <div style={{ marginTop: 'var(--space-12)' }}>
          <MOVES_DS.SentinelText weight="Regular" text="The two switches have gone to the exchange under your ARN — those cannot be pulled back from here. Sharma has not been told yet: his note is written and waiting for you." />
        </div>
        {note && (
          <div style={{ marginTop: 'var(--space-12)', borderRadius: 'var(--radius-16)', background: 'var(--color-bubble)', boxShadow: '0 0 0 var(--border-1) var(--color-bubble-edge)', padding: 'var(--space-14)', boxSizing: 'border-box' }}>
            <MOVES_DS.Eyebrow>Drafted for Sharma · not sent</MOVES_DS.Eyebrow>
            <p style={{ margin: 'var(--space-8) 0 0', font: 'var(--type-body-font)', color: 'var(--color-ink-soft)' }}>{CLIENT_NOTE}</p>
            <div style={{ marginTop: 'var(--space-12)' }}>
              <MOVES_DS.StandingDisclosure text="Nothing leaves Sentinel until you pick a channel and send it there." />
            </div>
          </div>
        )}
      </MOVES_DS.SentinelBlock>
      <MOVES_DS.ChipRow animate={enter}>
        <MOVES_DS.AnswerChip label={note ? 'Drop the draft' : 'Read the note to Sharma'} variant={note ? 'muted' : 'primary'} onClick={(note ? onDrop : onRead) || (() => {})} />
        <MOVES_DS.AnswerChip label="Back to his portfolio" onClick={onBack || (() => {})} />
      </MOVES_DS.ChipRow>
    </div>
  );
}

Object.assign(window, { MOVES_ASK, MOVES_ANSWER, MOVES, MOVES_PROVENANCE, SKIPPED, CONFIRM_DISCLOSURE, CONFIRM_ROWS, CLIENT_NOTE, MovesSimulation, MovesTurn, MovesActions, SuccessTurn });
