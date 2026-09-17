const { ScreenBackdrop, StatusSpacer, TopBar, ProgressRail, QAPair, ParseNote, SentinelThinking, SentinelBlock, SentinelText, ChipRow, AnswerChip, Composer, MoneyComposer, Dock, HomeIndicator, EyebrowDivider, HeroNumberCard, DarkButton } = window.DS;
/* Journey A · Meera's risk profile (five of the twelve questions, then the result). */
function JourneyScreen({ onMenu, onNew }) {
  const [cursor, setCursor] = React.useState(0);
  const [answered, setAnswered] = React.useState([{ a: 'Start with Meera' }]);
  const [thinking, setThinking] = React.useState(true);
  const [text, setText] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => { setThinking(true); const t = setTimeout(() => setThinking(false), 620); return () => clearTimeout(t); }, [cursor]);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [answered, thinking]);
  const step = KIT.risk[cursor];
  const total = KIT.risk.length;
  const advance = (label, note) => { setAnswered((a) => [...a, { q: step.short, a: label, note }]); setCursor((c) => c + 1); setText(''); };
  const result = !step;
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <ScreenBackdrop /><StatusSpacer /><TopBar onMenu={onMenu} onNew={onNew} />
      {!result && <div style={{ position: 'relative', zIndex: 1 }}><ProgressRail n={cursor + 1} total={12} /></div>}
      <div ref={ref} className="noscroll" style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 16px 24px' }}>
          {answered.map((p, i) => <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><QAPair question={p.q} answer={p.a} />{p.note && <ParseNote text={p.note} />}</div>)}
          {thinking ? <SentinelThinking /> : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <EyebrowDivider>Risk profile locked</EyebrowDivider>
              <HeroNumberCard title="Meera's risk number" meta="Locked · 15 Sep 2026" value={54} badge="Moderate" copy="We look at three things and go with the lowest of them. Her money can take more risk than she can." rows={[{ label: 'What her finances can absorb', value: 71 }, { label: 'What she can sit through calmly', value: 54, binding: true }, { label: 'What her ₹2 crore goal needs', value: 62 }]} />
              <SentinelBlock><SentinelText text="She is a 54, Moderate. Her finances could carry more, but she would not sleep through it — so 54 is what we build against." /></SentinelBlock>
            </div>
          ) : (
            <SentinelBlock><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><SentinelText text={step.q} />{step.sub && <p style={f(400, 13, 18, 'var(--color-muted)')}>{step.sub}</p>}</div></SentinelBlock>
          )}
        </div>
      </div>
      {!thinking && <Dock
        chips={!result && <ChipRow>{step.chips.map(([l, vnt]) => <AnswerChip key={l} label={l} variant={vnt || 'outline'} onClick={() => advance(l)} />)}</ChipRow>}
        cta={result ? <DarkButton label="Build her a portfolio →" onClick={onNew} /> : undefined}
        composer={step && step.money ? <MoneyComposer onSend={(vv) => advance(vv, 'understood as ' + vv)} /> : <Composer value={text} onChange={setText} onSend={() => text.trim() && advance(text.trim())} placeholder={result ? 'Ask about this' : step.composer || 'or type your answer'} />}
      />}
      <HomeIndicator tone={result ? 'dark' : 'bronze'} />
    </div>
  );
}
window.JourneyScreen = JourneyScreen;