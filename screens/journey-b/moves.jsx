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
  /* Scoped to THIS move, and said so: a redirect changes a future instruction and sells nothing, so
     it genuinely costs nothing — but sitting under move 1 it read as a claim about the pair. */
  { n: 2, title: 'Redirect his ₹30,000 monthly SIP', body: 'Nothing is sold here, so this one costs nothing — and it stops the drift coming back.' },
];
const MOVES_PROVENANCE = 'Costed 30 Sep · exit loads and tax from the scheme documents';
const SKIPPED = {
  title: 'The five I skipped',
  body: [
    'I picked the two moves that do the most with the least cost and tax.',
    'The other trades are not costed in this build. I will not list a move I cannot cost, so there is nothing real to show here yet.',
  ],
};
/* NOT "two switches" (F-46). One is a switch and one is a SIP redirect, and they are different acts:
   the switch sells units and is taxable, the redirect changes a future instruction and is not. Calling
   both a switch is the kind of small wrongness an advisor gets corrected on in front of a client. */
const CONFIRM_DISCLOSURE = 'One switch and one SIP change, both under your ARN. Nothing else in his book changes.';
const CONFIRM_ROWS = [
  { label: 'Compliance shelf', value: 'Passed' },
  { label: 'Single-fund ceiling', value: 'No fund over 25%' },
  { label: 'Client consent', value: 'Required', tone: 'required' },
];
/* The note this build DRAFTS and does not send. */
/* THE ONLY COPY IN THIS PRODUCT THAT REACHES A CLIENT — and until 19 Sep it told him a comfortable
   lie. It said "No exit load and no tax" about a pair the same screen costs at ₹11,200. That is true of
   the SIP redirect and false of the switch, and the note attributed it to both. A note the advisor sends
   under their own ARN saying the client paid nothing, when he paid ₹11,200, is the worst sentence this
   repository could ship. The figure now leads, as it does everywhere else. */
const CLIENT_NOTE = 'Mr. Sharma, your equity had drifted to 71% against the 60% we agreed. I am moving ₹1,85,000 from Quant Small Cap into ICICI Corporate Bond, and redirecting your ₹30,000 monthly SIP. The switch costs ₹11,200 in exit load and tax; the SIP change costs nothing. Together they bring you to 58%.';

/* THE SIMULATION — "what if", answered before the decision rather than inside it.
   One scale, two rows: where he is, and where these two moves put him. `Dumbbell` is the system's own
   two-values-on-one-scale mark, and the agreed 60% is the same reference on both rows, so the eye
   compares the thing that moved rather than two separate pictures. The cost sits under it, because a
   figure an advisor must defend never appears first on the surface where they approve it. */
/* No `run` prop: Dumbbell animates its own connector with ds-grow and takes no switch, so there is
   nothing here for a caller to freeze. A prop that does nothing is a prop that lies. */
/* `provenance` is a prop because the simulation is shown in two frames. Inside a SentinelBlock it is the
   only thing on screen that can say where the cost came from, so it says it. Inside a ResultCard the
   card already carries a provenance line, and two near-identical lines stacked is the repeated data the
   owner has objected to more than once. The figure is the same either way; only who states it moves. */
function MovesSimulation({ provenance = true }) {
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
      {provenance && <div style={{ marginTop: 'var(--space-8)' }}><MOVES_DS.Provenance text={MOVES_PROVENANCE} /></div>}
    </div>
  );
}

/* Step 5's turn: the sentence, the simulation, the two moves, then what the advisor is offered — all of
   it inside the turn, scrolling with it (contradiction 60). */
/* THE BODY OF A REBALANCE — the simulation and the moves, and nothing about the surface it sits on.
   Journey B reaches this from a drift answer, where it is a MESSAGE in a conversation; Journey E reaches
   it from the rail, where it is an ARTIFACT the advisor may save and download. Two surfaces, two frames,
   ONE body: the simulation and the two move cards are drawn here once so the figure on the card and the
   figure on the sheet can never disagree. */
function MovesBody({ provenance = true }) {
  return (
    <>
      <MovesSimulation provenance={provenance} />
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {MOVES.map((m) => <MOVES_DS.MoveCard key={m.n} n={m.n} title={m.title} body={m.body} />)}
      </div>
    </>
  );
}

function MovesTurn({ enter = false, actions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      <MOVES_DS.SentinelBlock>
        <MOVES_DS.SentinelText text={MOVES_ANSWER} />
        <div style={{ marginTop: 'var(--space-12)' }}><MovesBody /></div>
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

/* ── R2 · THE STATE BETWEEN "APPROVE" AND "PLACED" ─────────────────────────────────────────────────
   docs/RESEARCH.md's second theme, severity 4, and the one an advisor meets on a bad day. The study is
   full of it: "money stays blocked but app says failed" · "no acknowledgements are received regarding
   approval" · "the order does not get executed automatically". The reviews are not asking for speed.
   They are asking to be TOLD.

   Four outcomes, and they are four different sentences — collapsing them is the defect:
     · IN FLIGHT — sent, nothing back yet. Says when it was sent, and that it will say when it hears.
     · PLACED    — both done, with the order ids the advisor can quote to the RTA.
     · PARTIAL   — one placed, one rejected. The most likely real failure of a two-move rebalance, and
                   the one with a consequence worth stating: if the SIP redirect is the move that failed,
                   the mix is fixed today and starts drifting back on the 7th.
     · UNKNOWN   — sent, and Sentinel cannot tell whether it went. This is the ONLY state where the
                   product must refuse to guess in either direction. It never says "failed" for
                   something it has not confirmed failed, and it never offers to send again — a
                   duplicate switch is real money. It says how to check instead.

   StepTrace carries it: per-step state, a failed step keeps its place and offers its retry inline, and
   the head line collapses to one row once it is done. */
const EXEC_STEPS = {
  flight: [
    { label: 'Move 1 · ₹1,85,000 into ICICI Corporate Bond', state: 'running', meta: 'sent 3:04 pm' },
    { label: 'Move 2 · redirect the ₹30,000 SIP', state: 'pending' },
  ],
  placed: [
    { label: 'Move 1 · ₹1,85,000 into ICICI Corporate Bond', state: 'done', meta: 'ord 8841/22' },
    { label: 'Move 2 · redirect the ₹30,000 SIP', state: 'done', meta: 'ord 8841/23' },
  ],
  partial: [
    { label: 'Move 1 · ₹1,85,000 into ICICI Corporate Bond', state: 'done', meta: 'ord 8841/22' },
    { label: 'Move 2 · redirect the ₹30,000 SIP', state: 'failed', meta: 'not placed',
      detail: 'The NACH mandate on folio 9142/28 is registered for the old amount. The RTA rejected the change.' },
  ],
  unknown: [
    { label: 'Move 1 · ₹1,85,000 into ICICI Corporate Bond', state: 'running', meta: 'sent 3:04 pm' },
    { label: 'Move 2 · redirect the ₹30,000 SIP', state: 'running', meta: 'sent 3:04 pm' },
  ],
};
const EXEC_COPY = {
  flight: 'Both moves are with the exchange. I will tell you the moment either one is confirmed — you do not need to wait here.',
  partial: 'One of the two went through. His mix is back at 58% today, but the SIP still buys small cap on the 7th, so the drift starts again next month unless the mandate is fixed.',
  unknown: 'I sent both moves and I have not heard back. I do not know yet whether they were placed, so I am not going to tell you either way. Do not send them again — a duplicate switch is real money.',
};
const EXEC_SUMMARY = {
  /* A head line is given for every state, including in flight. Left to derive, StepTrace uses the running
     step's own label — so the card printed "Move 1 · ₹1,85,000 into ICICI Corporate Bond" twice, eleven
     points apart, which is the repetition rule the reviewer exists to catch. */
  flight: 'Sent · waiting for the exchange',
  placed: 'Both moves placed · settles T+2',
  partial: 'One placed, one rejected',
  unknown: 'Sent · no confirmation yet',
};

function ExecutionTurn({ state = 'flight', enter = false, onRetry, onCheck }) {
  const copy = EXEC_COPY[state];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      <MOVES_DS.SentinelBlock>
        <MOVES_DS.StepTrace id={`exec-${state}`} defaultOpen steps={EXEC_STEPS[state]} summary={EXEC_SUMMARY[state]} />
        {copy && <div style={{ marginTop: 'var(--space-12)' }}><MOVES_DS.SentinelText weight="Regular" text={copy} /></div>}
        {state === 'partial' && (
          <div style={{ marginTop: 'var(--space-12)' }}>
            <MOVES_DS.AnswerChip label="Fix the mandate and retry move 2" variant="primary" onClick={onRetry || (() => {})} />
          </div>
        )}
        {/* The unknown state offers CHECKING, never sending again. */}
        {state === 'unknown' && (
          <div style={{ marginTop: 'var(--space-12)' }}>
            <MOVES_DS.ChipRow>
              <MOVES_DS.AnswerChip label="Check with the RTA" variant="primary" onClick={onCheck || (() => {})} />
              <MOVES_DS.AnswerChip label="What do I tell Sharma?" onClick={() => {}} />
            </MOVES_DS.ChipRow>
          </div>
        )}
      </MOVES_DS.SentinelBlock>
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

Object.assign(window, { MovesBody, EXEC_STEPS, EXEC_COPY, EXEC_SUMMARY, ExecutionTurn, MOVES_ASK, MOVES_ANSWER, MOVES, MOVES_PROVENANCE, SKIPPED, CONFIRM_DISCLOSURE, CONFIRM_ROWS, CLIENT_NOTE, MovesSimulation, MovesTurn, MovesActions, SuccessTurn });
