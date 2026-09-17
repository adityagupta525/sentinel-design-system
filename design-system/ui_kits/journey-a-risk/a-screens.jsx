const { ScreenBackdrop, StatusSpacer, TopBar, ProgressRail, SentinelBlock, SentinelText, QAPair, ParseNote, Pill, AnswerChip, ChipRow, Composer, MoneyComposer, Dock, HomeIndicator, EyebrowDivider, HeroNumberCard, DarkButton, Provenance } = window.DS;

function Artboard({ name, sub, children }) {
  return <div className="ab"><div className="ab-name">{name}</div>{sub && <div className="ab-sub">{sub}</div>}<div className="frame">{children}</div></div>;
}
const Shell = ({ children }) => <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}><ScreenBackdrop />{children}</div>;
/* Bottom-anchored AND pinned: marginTop auto handles a short thread, the ref pins a long one to the
   newest turn — the live question must never be the thing scrolled out of view. */
function Thread({ children }) {
  const ref = React.useRef(null);
  React.useEffect(() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; });
  return (
    <div ref={ref} className="noscroll" style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 16px 20px' }}>{children}</div>
    </div>
  );
}
/* An artboard abbreviates the thread to its last three answered questions — the product keeps all of them,
   but a static frame must show the LIVE question, not the top of a scroll it cannot move. */
const HISTORY_SHOWN = 3;
function History({ upto }) {
  const all = A.steps.slice(0, upto);
  const shown = all.slice(-HISTORY_SHOWN);
  const hidden = all.length - shown.length;
  return (
    <React.Fragment>
      {hidden > 0
        ? <p style={f(500, 11, 15, 'var(--color-data-deemph)')}>{hidden + (hidden === 1 ? ' earlier answer' : ' earlier answers')} · scroll up</p>
        : <QAPair answer="Let's go" />}
      {shown.map((s) => <React.Fragment key={s.n}><QAPair question={s.short} answer={s.answer} />{s.parse && <ParseNote text={s.parse} />}</React.Fragment>)}
    </React.Fragment>
  );
}
const Chips = ({ step }) => (
  step.subtitled
    ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {step.chips.map(([label, tone], i) => <AnswerChip key={label} label={label} subtitle={A.subtitles[label]} variant={tone || 'outline'} selected={i === 3} />)}
      </div>
    : <ChipRow animate={false}>{step.chips.map(([label, tone]) => <Pill key={label} label={label} tone={tone || 'outline'} />)}</ChipRow>
);

function A01() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <SentinelBlock>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SentinelText text={A.intro.lines[0]} />
            <SentinelText text={A.intro.lines[1]} weight="Regular" />
          </div>
          <div style={{ marginTop: 10 }}><Provenance text={A.intro.provenance} /></div>
        </SentinelBlock>
      </Thread>
      <Dock chips={<ChipRow animate={false}>{A.intro.chips.map(([l, t]) => <Pill key={l} label={l} tone={t} />)}</ChipRow>} composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.answering} />} />
      <HomeIndicator />
    </Shell>
  );
}

function Question({ i, reflectBefore }) {
  const step = A.steps[i];
  return (
    <Shell><StatusSpacer /><TopBar />
      <div style={{ position: 'relative', zIndex: 1 }}><ProgressRail n={reflectBefore ? step.n - 1 || 1 : step.n} total={12} dim={!!reflectBefore} /></div>
      <Thread>
        <History upto={reflectBefore ? i : i} />
        {reflectBefore
          ? <SentinelBlock><SentinelText text={reflectBefore} /></SentinelBlock>
          : <SentinelBlock><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><SentinelText text={step.sentinel} />{step.sub && <p style={f(400, 13, 18, 'var(--color-muted)')}>{step.sub}</p>}</div></SentinelBlock>}
      </Thread>
      <Dock
        chips={reflectBefore ? <ChipRow animate={false}><Pill label="Carry on" tone="primary" /></ChipRow> : <Chips step={step} />}
        composer={step.money && !reflectBefore ? <MoneyComposer onSend={() => {}} /> : <Composer value="" onChange={() => {}} placeholder={step.composer || PLACEHOLDER.answering} />} />
      <HomeIndicator />
    </Shell>
  );
}

function A16() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <div className="noscroll" style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px 16px' }}>
          <EyebrowDivider>Risk profile locked</EyebrowDivider>
          <HeroNumberCard title="Meera's risk number" meta="Locked · 15 Sep 2026" value={54} badge="Moderate" copy="We look at three things and go with the lowest of them. Her money can take more risk than she can." rows={A.result.meters} />
          <SentinelBlock>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SentinelText text={A.result.lines[0]} />
              <SentinelText text={A.result.lines[1]} weight="Regular" />
            </div>
            <div style={{ marginTop: 10 }}><Provenance text="As of 15 Sep · from her twelve answers, her ITR and her September statement" /></div>
          </SentinelBlock>
        </div>
      </div>
      <Dock chips={<ChipRow animate={false}>{A.result.chips.map(([l, t]) => <Pill key={l} label={l} tone={t} />)}</ChipRow>} cta={<DarkButton label={A.result.cta} />} composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.result} />} />
      <HomeIndicator tone="dark" />
    </Shell>
  );
}

const BOARD = [
  ['A / 01 Intro', 'No rail yet — nothing has been asked. Provenance names where her record came from.', <A01 />],
  ['A / 02 Q1 Age', 'Smart chip offers the KYC figure; the composer switches to "or type an age".', <Question i={0} />],
  ['A / 03 Q2 Income', 'The one question whose wording changes the meaning — card-with-subtitle chips.', <Question i={1} />],
  ['A / 04 Q3 Earns', 'MoneyComposer: ₹ in its own slot, Indian grouping.', <Question i={2} />],
  ['A / 05 Q4 Spends', 'Q3 has collapsed to a one-line question with its parse note beneath.', <Question i={3} />],
  ['A / 06 Q5 Emergencies', 'Sub-line qualifies the question: "Money she could reach by tomorrow."', <Question i={4} />],
  ['A / 07 Reflect', 'Interjection — Sentinel reflects, it does not ask. Rail holds and drops to 40%.', <Question i={5} reflectBefore={A.reflect1.text} />],
  ['A / 08 Q6 Dependents', 'Back to asking; the rail advances to 6.', <Question i={5} />],
  ['A / 09 Q7 Horizon', 'Five options, all self-evident — pills, no subtitles.', <Question i={6} />],
  ['A / 10 Q8 Goal', 'The muted chip is the escape hatch: "She isn\'t sure yet".', <Question i={7} />],
  ['A / 11 Q9 Behaviour', 'The most useful question in the set. Sub-line insists on behaviour, not intent.', <Question i={8} />],
  ['A / 12 Reflect', 'Second interjection, after the behaviour answer.', <Question i={9} reflectBefore={A.reflect2.text} />],
  ['A / 13 Q10 Drawdown', 'What she can sit through — the answer that binds the score.', <Question i={9} />],
  ['A / 14 Q11 Objective', 'Five objectives, ordered protect → push.', <Question i={10} />],
  ['A / 15 Q12 Knowledge', 'Sub-line states what this limits: complexity, not risk.', <Question i={11} />],
  ['A / 16 Result', 'Rail retires. 64px display numeral counts up; only the binding meter is full bronze.', <A16 />],
];
function App() { return <div className="board">{BOARD.map(([name, sub, el]) => <Artboard key={name} name={name} sub={sub}>{el}</Artboard>)}</div>; }
/* Mount only when a page provides #root. This file is also compiled into _ds_bundle.js, which is loaded
   by pages that have no #root of their own — an unguarded createRoot(null) throws React #299 there. */
const aRoot = document.getElementById('root');
if (aRoot) ReactDOM.createRoot(aRoot).render(<App />);