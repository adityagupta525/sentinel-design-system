/* global AttachedTurn, useAttachment -- thread.jsx declares both in the one Babel scope every page
   loads it into, before this file. The lint cannot see across files; the preview gate can, and fails a
   page that loads this one without thread.jsx. */
/* Journey A — Meera's risk profile. The rail: one question at a time, twelve of them, two interjections
   and a locked number at the end. Shared by risk-profile.html and any prototype that runs it.

   The steps, their wording and their chips are the product's own
   (docs/screens-source/src/journeys.tsx:67-204). Nothing here is written for a specimen.

   No top-level destructuring: every .jsx a page loads compiles into ONE scope. */
const RAIL_DS = window.SentinelDesignSystem_0682a2;

const c = (label, tone, extra) => ({ label, tone, ...extra });
const RAIL_STEPS = [
  { name: 'Intro', short: "Start Meera's risk profile",
    provenance: 'As of 15 Sep · from her account record and September statement',
    sentinel: ['Meera Nair, 38, Kochi. Your client since 2019. ₹18.4 L across 43 funds.',
      'Her risk profile was never completed, so nothing after it can be checked against anything. Let us fix that first — twelve short questions, mostly one tap each.'],
    chips: [c("Let's go", 'primary'), c('Why twelve questions?', 'tertiary', { sheet: {
      title: 'Why twelve questions?',
      body: ['Twelve short questions — mostly one tap each — are the minimum needed to score her finances, her temperament and her goal.',
        'With a real risk number, everything after it (the proposal, the drift, the rebalance) can be checked against something.'] } }),
      c('Skip to the result', 'muted', { goto: 15 })] },
  { name: 'Q1 Age', short: 'How old is Meera?', progress: [1, 12], sentinel: 'How old is Meera?',
    chips: [c('Use her KYC age — 38', 'smart'), c('Type it instead')], composer: 'or type an age' },
  { name: 'Q2 Income', short: 'How steady is her income?', progress: [2, 12], sentinel: 'How steady is her income?',
    chips: [c('Fixed salary'), c('Salary plus bonus'), c('Own business'), c('Freelance, varies'), c('Rent or pension')], composer: 'or type your answer' },
  { name: 'Q3 Earns', short: 'What does she earn a month?', progress: [3, 12], sentinel: 'What does she earn a month?',
    chips: [c('From her last ITR — ₹1,80,000', 'smart'), c('₹1,50,000'), c('₹2,00,000')], money: true },
  { name: 'Q4 Spend', short: 'And what does she spend a month?', progress: [4, 12], sentinel: 'And what does she spend a month?',
    chips: [c('₹75,000'), c('₹95,000'), c('₹1,20,000')], money: true },
  { name: 'Q5 Emergency', short: 'How much for emergencies?', progress: [5, 12], sentinel: 'How much has she kept aside for emergencies?',
    chips: [c('₹3,00,000'), c('₹6,00,000'), c('₹10,00,000')], money: true },
  { name: 'Reflect 1', progress: [5, 12], interjection: true,
    sentinel: 'That is about six months of her spending. Comfortable — it means a fall in the market will not force her to sell.',
    chips: [c('Carry on', 'primary')] },
  { name: 'Q6 Dependents', short: 'How many people depend on this?', progress: [6, 12], sentinel: 'How many people depend on this income?',
    chips: [c('Nobody'), c('1'), c('2'), c('3'), c('4 or more')] },
  { name: 'Q7 Horizon', short: 'When will she need this money?', progress: [7, 12], sentinel: 'When will she need this money?',
    chips: [c('Within a year'), c('1 to 3 years'), c('3 to 7 years'), c('7 to 15 years'), c('More than 15 years')] },
  { name: 'Q8 Goal', short: 'What is she saving towards?', progress: [8, 12], sentinel: 'What is she saving towards, in rupees?',
    chips: [c('₹50 lakh'), c('₹1 crore'), c('₹2 crore'), c("She isn't sure yet", 'muted')], money: true },
  { name: 'Q9 Behaviour', short: 'The last 20% fall — what did she do?', progress: [9, 12],
    sentinel: 'The last time markets fell 20% or more — what did she actually do?',
    chips: [c('Invested more'), c('Stayed put'), c('Sold some'), c('Sold everything')] },
  { name: 'Reflect 2', progress: [9, 12], interjection: true,
    sentinel: 'Good — that is the most useful answer in the whole set. Saying you can handle a fall and living through one are different things.',
    chips: [c('Carry on', 'primary')] },
  { name: 'Q10 Drawdown', short: 'How big a fall could she sit through?', progress: [10, 12],
    sentinel: 'How big a fall could she sit through without calling you?',
    chips: [c('Almost none'), c('About 10%'), c('About 20%'), c('About 30%'), c('More than that')] },
  { name: 'Q11 Objective', short: 'What is this money asked to do?', progress: [11, 12], sentinel: 'What is she asking this money to do?',
    chips: [c('Protect it'), c('Give steady income'), c('Grow steadily'), c('Grow it properly'), c('Push for the most')] },
  { name: 'Q12 Knowledge', short: 'How well does she understand it?', progress: [12, 12], sentinel: 'How well does she understand what she holds?',
    chips: [c('New to this'), c('Knows the basics'), c('Fairly experienced'), c('Works in finance')] },
  { name: 'Result', result: true,
    chips: [c('How is 54 worked out?', 'tertiary', { sheet: {
      title: 'How is 54 worked out?',
      body: ['Three scores: what her finances can absorb (71), what she can sit through calmly (54), and what her ₹2 crore goal needs (62).',
        'We go with the lowest of the three. Her money could carry more risk than she could, so 54 is what we build against.'] } }),
      c('Share with Meera on WhatsApp', 'outline', { external: true })],
    cta: 'Build her a portfolio' },
];
const RAIL_TOTAL = 12;
const RISK_RESULT = {
  title: "Meera's risk number", meta: 'Locked · 15 Sep 2026', value: 54, badge: 'Moderate',
  copy: 'We look at three things and go with the lowest of them. Her money can take more risk than she can.',
  rows: [
    { label: 'What her finances can absorb', value: 71 },
    { label: 'What she can sit through calmly', value: 54, binding: true },
    { label: 'What her ₹2 crore goal needs', value: 62 },
  ],
  trailing: 'She is a 54, Moderate. Her finances could carry more, but she would not sleep through it — so 54 is what we build against.',
};

/* THE RAIL SHELL. Same spine as the thread — backdrop, status, app bar, one scroller, the Dock with the
   composer — plus the rail itself pinned under the app bar, which is the one thing here that does not
   scroll because it is a state the whole surface is in. `dim` is the detour state: ProgressRail's own
   prop, which dims the rail and NOT its label.

   RULE 3 HOLDS HERE TOO: the composer is present on every question. An advisor can always type instead
   of tapping, and on a money question it is the MoneyComposer. */
function Rail({ n, total = RAIL_TOTAL, dim, banner, children, composer, onMenu, onNew, scrollRef, revision = 0 }) {
  const own = React.useRef(null);
  const el = () => (scrollRef ? scrollRef.current : own.current);
  React.useLayoutEffect(() => { const e = el(); if (e) e.scrollTop = e.scrollHeight; }, [revision]);
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <RAIL_DS.ScreenBackdrop />
      <RAIL_DS.StatusSpacer time="10:12" />
      {/* The rail has no back button, because this product has none: the way out of any surface is the
          menu’s "Back to home" or a new thread. onNew was hardcoded to a no-op until the prototype had to
          leave the rail — and inventing a back arrow here would have been a second door to one thing. */}
      <RAIL_DS.TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={onNew || (() => {})} />
      {n != null && (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 var(--gutter) var(--space-8)' }}>
          <RAIL_DS.ProgressRail n={n} total={total} dim={dim} />
        </div>
      )}
      {banner && <div style={{ position: 'relative', zIndex: 1, paddingBottom: 'var(--space-8)' }}>{banner}</div>}
      <div ref={scrollRef || own} style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--stack)', padding: '16px var(--gutter) 24px' }}>
          {children}
        </div>
      </div>
      <RAIL_DS.Dock composer={composer} />
      <RAIL_DS.HomeIndicator />
    </div>
  );
}

/* WHAT SHE HAS ALREADY ANSWERED. QAPair collapses a question and its answer to one line each, so twelve
   of them do not bury the one being asked now.

   THE LAST ANSWER IS EDITABLE, and this is the same gesture as editing a prompt in the thread — the
   owner's rule that a pattern valid from the advisor's side must exist everywhere it is valid. Here it
   costs more, and MessageActions' own contract says exactly what to say: "Editing this reopens question
   7. The four answers after it will be asked again." Nothing is discarded until the new answer is given. */
function AnsweredList({ items, onEdit, editable = true }) {
  if (!items.length) return null;
  const last = items.length - 1;
  return (
    <>
      {items.map((a, i) => (
        /* A plain div rather than a keyed Fragment: the lint reads `React.Fragment` in a file that never
           imports React (the bundle provides it globally), and a wrapper here costs nothing — the column
           it sits in already owns the gap. */
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <RAIL_DS.QAPair question={a.q} answer={a.a} />
          {a.note && <RAIL_DS.ParseNote text={a.note} />}
          {editable && i === last && onEdit && (
            <RAIL_DS.MessageActions role="user" onAction={(act) => act === 'edit' && onEdit(i)} />
          )}
        </div>
      ))}
    </>
  );
}

/* The question being asked, and its answers as chips INSIDE the turn — the 18 Sep ruling, applied to the
   rail rather than left as the one surface still answering from the Dock (contradiction 60). */
/* `extra` is a slot, not a feature. A step in the risk rail is a question and some chips; a step in the
   rebalance rail has to lay three sized options side by side before a chip means anything. Rather than
   teach this shared file about journey E, the caller renders what its own step needs and the rail keeps
   deciding only where things sit — inside the SentinelBlock, under the sentence, above the chips, so it
   reads as part of what Sentinel said rather than as a widget parked beside it. */
function StepTurn({ step, onChip, thinking, extra }) {
  if (!step) return null;
  const lines = Array.isArray(step.sentinel) ? step.sentinel : [step.sentinel];
  return (
    <RAIL_DS.SentinelTurn
      thinking={thinking ? 'Reading her account record…' : false}
      say={lines} body={extra} provenance={step.provenance}
      chips={step.chips && (
        <RAIL_DS.ChipRow>
          {step.chips.map((ch) => <RAIL_DS.AnswerChip key={ch.label} label={ch.label} variant={ch.tone || 'outline'} onClick={() => onChip && onChip(ch)} />)}
        </RAIL_DS.ChipRow>
      )} />
  );
}

function RiskResult({ onChip, chips, cta }) {
  return (
    <RAIL_DS.SentinelTurn
      bodyFirst body={<RAIL_DS.HeroNumberCard {...RISK_RESULT} />} then={RISK_RESULT.trailing}
      chips={chips && (
        <RAIL_DS.ChipRow>
          {chips.map((ch) => <RAIL_DS.AnswerChip key={ch.label} label={ch.label} variant={ch.tone || 'outline'} onClick={() => onChip && onChip(ch)} />)}
        </RAIL_DS.ChipRow>
      )}
      actions={cta ? <RAIL_DS.DarkButton full arrow label={cta} onClick={() => {}} /> : null} />
  );
}

/* THE WHOLE JOURNEY, RUNNING — lifted out of risk-profile.html when the end-to-end prototype needed it,
   so the spec page and the prototype run ONE rail rather than two that can drift apart. It carries its
   own composer, because which composer a step wants is a property of the step (`money`), not of the page.
   `onMenu` / `onNew` are the prototype's only addition: a rail reached from the thread has to be
   leavable, and it leaves by the same two doors every other surface uses. */
/* A REAL COMPOSER, NOT A DRAWING OF ONE (F-45). Every rail step says "or type your answer" and this
   was `value=""` with a no-op onChange and a no-op onSend — inert on journeys A, D, E and F, four of
   the six. The same defect was found and fixed on the thread's composer for the prototype and left
   here. A control that invites typing and drops it is the DEAD PAPERCLIP rule applied to the composer,
   and the gate only knew to look at the paperclip.
   The state lives HERE rather than in every caller: what an advisor types into a rail step is an
   answer to that step, and nothing else on the page needs it. */
function RailAsk({ step, onAttach, onSend }) {
  const [value, setValue] = React.useState('');
  const send = () => { const t = value.trim(); if (!t) return; setValue(''); if (onSend) onSend(t); };
  /* MoneyComposer owns its own value and hands back a formatted rupee string, so it takes only onSend
     — passing it value/onChange would be inventing a contract it does not have. */
  return step && step.money
    ? <RAIL_DS.MoneyComposer onSend={(v) => onSend && onSend(v)} placeholder="or type the amount" />
    : <RAIL_DS.Composer value={value} onChange={setValue} placeholder={(step && step.composer) || 'or type your answer'}
        onSend={send} onAttach={onAttach} />;
}

const SHARE_SHEET = {
  title: 'Share with Meera',
  body: ['This build prepares the summary and hands it to your own share sheet — it does not send anything on its own.',
    'Nothing leaves Sentinel until you pick a channel and send it there.'],
};

/* STEPS AND THE RESULT ARE ARGUMENTS, not this file's own. The rail is shared: SCREENS-PLAN counts 22
   steps across it — Risk 16, Proposal 4, Review 1, Rebalance 1 — so a second journey on a second copy of
   this loop would be two places for "what happens when you edit answer 3" to drift apart. The defaults
   are the risk journey, so every existing caller is unchanged. */
function LiveRail({ steps = RAIL_STEPS, total = RAIL_TOTAL, result, stepExtra, onAnswer, attachCaption = 'Here is her last ITR.', onEvent, onMenu, onNew }) {
  const [cursor, setCursor] = React.useState(0);
  const [answered, setAnswered] = React.useState([]);
  const [sheet, setSheet] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);
  const att = useAttachment();
  const step = steps[cursor];
  const log = (what, motion) => onEvent && onEvent(what, motion);
  /* `onAnswer` tells the caller WHICH chip was taken, which the answered list cannot: it stores the
     label the advisor sees, and a journey that branches on the answer needs the chip. Journey F is the
     first to branch — its one question picks who the review is for. */
  const advance = (label, goto, chip) => {
    if (onAnswer) onAnswer(step, chip || { label });
    setAnswered((a) => [...a, { q: step.short, a: label }]);
    setThinking(true);
    const next = goto != null ? goto : cursor + 1;
    log(`Answered “${label}”`, 'SentinelThinking for 520ms, then ds-rise on the next question');
    setTimeout(() => { setCursor(next); setThinking(false); }, 520);
  };
  const onChip = (ch) => {
    if (ch.sheet) { log('Explainer opens — a detour, the rail dims', 'ds-sheet 300ms; ProgressRail dim to 40%'); return setSheet(ch.sheet); }
    if (ch.external) { log('Share — the OS sheet, not ours', ''); return setSheet(SHARE_SHEET); }
    advance(ch.label, ch.goto, ch);
  };
  /* Edit answer i: the journey reopens THERE and everything after it is asked again. */
  const editAt = (i) => {
    log(`Edited answer ${i + 1} — everything after it is asked again`, 'the list truncates; the rail steps back');
    setAnswered((a) => a.slice(0, i));
    setCursor(steps.findIndex((s) => s.short === answered[i].q) || 0);
  };
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Rail n={step && step.progress ? step.progress[0] : undefined} total={total} revision={`${cursor}-${answered.length}-${!!att.file}`}
        onMenu={onMenu} onNew={onNew} composer={<RailAsk step={step} onAttach={att.onAttach}
          onSend={(t) => { log(`Typed \u201c${t}\u201d`, 'the same path a chip takes \u2014 typing is never a second-class answer'); advance(t); }} />}>
        <AnsweredList items={answered} onEdit={editAt} />
        {step && step.result
          ? (result ? result({ step, onChip }) : <RiskResult chips={step.chips} cta={step.cta} onChip={onChip} />)
          : <StepTurn step={step} thinking={thinking} onChip={onChip} extra={stepExtra ? stepExtra({ step, advance, onChip }) : undefined} />}
        <AttachedTurn file={att.file} caption={attachCaption} onRemove={att.clear} />
      </Rail>
      <RAIL_DS.ExplainerSheet open={!!sheet} title={(sheet || {}).title || ''} body={(sheet || {}).body || []}
        onClose={() => { setSheet(null); log('Explainer closes — the rail comes back to full', 'immediate'); }} />
    </div>
  );
}

Object.assign(window, { RailAsk, SHARE_SHEET, LiveRail, RAIL_STEPS, RAIL_TOTAL, RISK_RESULT, Rail, AnsweredList, StepTurn, RiskResult });
