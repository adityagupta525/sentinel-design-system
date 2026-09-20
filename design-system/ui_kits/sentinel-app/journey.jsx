const { ScreenBackdrop, StatusSpacer, TopBar, ProgressRail, QAPair, ParseNote, SentinelThinking, SentinelTurn, ChipRow, AnswerChip, Composer, MoneyComposer, Dock, HomeIndicator, EyebrowDivider, HeroNumberCard } = window.DS;
/* REDRAWN 20 Sep 2026 on the built rail. The question's chips and the result's button used to sit in
   the Dock, pinned above the composer; the ruling of 18 Sep moved what a message offers INTO that
   message, and this artboard was one of the reasons `Dock.cta` could not be deleted. `SentinelTurn`
   carries both now — the same grammar `screens/journey-a/rail.jsx` uses, so the kit and the screen
   are one shape rather than two. The Dock keeps the composer and nothing else. */
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
              <SentinelTurn bodyFirst
                body={<HeroNumberCard title="Meera's risk number" meta="Locked · 15 Sep 2026" value={54} badge="Moderate" copy="We look at three things and go with the lowest of them. Her money can take more risk than she can." rows={[{ label: 'What her finances can absorb', value: 71 }, { label: 'What she can sit through calmly', value: 54, binding: true }, { label: 'What her ₹2 crore goal needs', value: 62 }]} />}
                then="She is a 54, Moderate. Her finances could carry more, but she would not sleep through it — so 54 is what we build against."
                cta={{ label: 'Build her a portfolio', onClick: onNew }} />
            </div>
          ) : (
            <SentinelTurn say={step.sub ? [step.q, step.sub] : [step.q]}
              chips={<ChipRow>{step.chips.map(([l, vnt]) => <AnswerChip key={l} label={l} variant={vnt || 'outline'} onClick={() => advance(l)} />)}</ChipRow>} />
          )}
        </div>
      </div>
      {!thinking && <Dock
        composer={step && step.money ? <MoneyComposer onSend={(vv) => advance(vv, 'understood as ' + vv)} /> : <Composer value={text} onChange={setText} onSend={() => text.trim() && advance(text.trim())} placeholder={result ? 'Ask about this' : step.composer || 'or type your answer'} />}
      />}
      <HomeIndicator tone={result ? 'dark' : 'bronze'} />
    </div>
  );
}
window.JourneyScreen = JourneyScreen;