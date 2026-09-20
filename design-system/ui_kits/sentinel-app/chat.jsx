const { ScreenBackdrop, StatusSpacer, TopBar, UserBubble, SentinelBlock, SentinelText, SentinelTurn, ProgressTrace, InlineActionRow, AllocationCard, AttributionChart, ArtifactCard, Sparkline, MoveCard, AnswerChip, ChipRow, Composer, Dock, HomeIndicator, DrawnCheck, ExplainerSheet } = window.DS;
/* REDRAWN 20 Sep 2026 on the built thread. The attribution turn's two chips and its "Rebalance to his
   mandate" button, and the rebalance turn's chip and "Approve both moves", used to sit in the Dock —
   pinned above the composer, keyed off `phase` rather than off the message that offered them. The
   ruling of 18 Sep puts what a message offers inside that message, and `screens/journey-b/answer.jsx`
   has drawn it that way since. Each turn now carries its own chips and its own decision, so scrolling
   back through the thread shows which answer each one belonged to. The Dock keeps the composer. */
/* The drift thread: seed → trace → attribution → rebalance → approve → success.
   The artifact expands and collapses in place — there is no canvas to open. */
function ChatScreen({ seed, onMenu, onNew }) {
  const drift = /drift|sharma|rebalance/i.test(seed);
  const [phase, setPhase] = React.useState(drift ? 'loading' : 'static');
  const [msgs, setMsgs] = React.useState(drift ? ['user', 'trace'] : ['user', 'unknown']);
  const [v, setV] = React.useState('');
  const [sheet, setSheet] = React.useState(null);
  const [artifact, setArtifact] = React.useState('peek');
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs, phase]);
  const toRebalance = () => { setMsgs((m) => [...m, 'user2', 'rebalance']); setPhase('rebalance'); };
  const approve = () => { setMsgs((m) => [...m, 'success']); setPhase('done'); };
  const send = () => { const q = v.trim(); if (!q) return; setV(''); if (/drift|sharma/i.test(q)) { setMsgs((m) => [...m, ['u', q], 'trace']); setPhase('loading'); } else setMsgs((m) => [...m, ['u', q], 'unknown']); };
  const render = (m, i) => {
    if (m === 'user') return <UserBubble key={i} text={seed} />;
    if (Array.isArray(m)) return <UserBubble key={i} text={m[1]} />;
    if (m === 'user2') return <UserBubble key={i} text="What would fixing it cost?" />;
    if (m === 'trace') return <ProgressTrace key={i} steps={["Reading Sharma's holdings — 18 funds", 'Comparing against his mandate', 'Checking Q2 statements', 'Attributing the drift']} reasoning="Equity went from 62% to 71% against a 60% target. Three things moved it, and only one of them was a decision." onDone={() => { setMsgs((mm) => mm.map((x) => (x === 'trace' ? 'attribution' : x))); setPhase('attribution'); }} />;
    if (m === 'attribution') return (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SentinelBlock><SentinelText text="Two-thirds of the drift is the small-cap rally. You did not cause it, and selling into it has a cost." /><div style={{ marginTop: 12 }}><AllocationCard segments={KIT.alloc} /></div></SentinelBlock>
        <ArtifactCard state={artifact} eyebrow="Drift attribution · Q2 → Q3" title="62% → 71%, mostly the market"
          provenance="As of 30 Sep · from his Q3 statement and mandate on file"
          onToggle={() => setArtifact((a) => (a === 'expanded' ? 'peek' : 'expanded'))}
          onWhy={() => setSheet({ title: 'Why is 71% a problem?', body: ['Equity is 11% over the 60% you agreed. In a normal year that barely shows.', 'In a 20% fall it costs him more than the agreed mix would have.'] })}
          onShare={() => setSheet({ title: 'Share this', body: ['Sentinel drafts the note. You send it from your own client channel.'] })}
          onMenu={() => setSheet({ title: 'Table view', body: ['Small-cap rally +6.1 pts', 'His July top-up +2.0 pts', 'Funds crept up-cap +0.9 pts'] })}>
          {artifact === 'expanded'
            ? <AttributionChart from={62} to={71} contributions={KIT.drift} />
            : <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <Sparkline points={[62, 64, 67, 69, 71]} width={240} height={72} />
              <span style={f(700, 13, 18, 'var(--color-bronze-deep)')}>71%</span>
            </div>}
        </ArtifactCard>
        {phase === 'attribution' && (
          <SentinelTurn continued
            chips={<ChipRow>
              <AnswerChip label="Why is 71% a problem?" variant="tertiary" onClick={() => setSheet({ title: 'Why is 71% a problem?', body: ['Equity is 11% over the 60% you agreed. In a normal year that barely shows.', 'In a 20% fall it costs him more than the agreed mix would have — the drift only bites when markets drop.'] })} />
              <AnswerChip label="Show the 18 holdings" onClick={() => setArtifact('expanded')} />
            </ChipRow>}
            cta={{ label: 'Rebalance to his mandate', onClick: toRebalance }} />
        )}
      </div>);
    if (m === 'rebalance') return (
      <SentinelTurn key={i} say="Two moves, not seven. This alone brings equity from 71% back to 58% and costs ₹11,200."
        body={<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><MoveCard n={1} title="Move ₹1,85,000 out of Quant Small Cap" body="Into ICICI Corporate Bond. Brings equity from 67% to 58%." /><MoveCard n={2} title="Redirect her ₹30,000 monthly SIP" body="No exit load, no tax, and it stops the drift returning." /></div>}
        chips={phase === 'rebalance' ? <ChipRow><AnswerChip label="Show the five we skipped" onClick={() => setSheet({ title: 'The five I skipped', body: ['I recommended the two moves that do the most with the least cost and tax.', 'The other candidate trades aren\'t itemised in this build — I won\'t list moves I can\'t cost.'] })} /></ChipRow> : undefined}
        cta={phase === 'rebalance' ? { label: 'Approve both moves', onClick: approve } : undefined} />);
    if (m === 'success') return <SentinelBlock key={i}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...card, padding: '13px 14px' }}><DrawnCheck /><div><p style={f(600, 15)}>Two moves queued</p><p style={{ ...f(500, 12, null, 'var(--color-muted)'), marginTop: 2 }}>Placed 16 Sep, 9:41 · settles T+2</p></div></div>
      <p style={{ ...f(400, 14, 20, 'var(--color-ink-soft)'), marginTop: 10 }}>Sharma gets a note explaining both moves. Nothing else in his book changed.</p>
      <div style={{ marginTop: 12 }}><InlineActionRow actions={[{ label: 'Tell Sharma now', onClick: () => setSheet({ title: 'Note to R. Sharma', body: ['Before it sends: this goes to Sharma under your ARN. Review the wording, then send from your own client channel — this build drafts it, it doesn\'t send.', '“Hi Sharma — I\'ve rebalanced your portfolio back to the mix we agreed. Two switches, cost ₹11,200, and your monthly SIP now goes to debt so the drift doesn\'t return.”'] }) }, { label: 'Start a review for Sharma', onClick: () => setV("Review Sharma's portfolio") }]} /></div>
    </SentinelBlock>;
    return <SentinelBlock key={i}><SentinelText text="I did not follow that. I can look up a client, build a proposal, explain a drift, or search funds — which is closest?" /><div style={{ marginTop: 12 }}><InlineActionRow actions={[{ label: 'Explain a drift', onClick: () => { setMsgs((mm) => [...mm, ['u', "Why did Sharma's portfolio drift this quarter?"], 'trace']); setPhase('loading'); } }, { label: 'Build a proposal', onClick: () => setV('Build a proposal for ') }, { label: 'Look up a client', onClick: () => setV('Look up ') }]} /></div></SentinelBlock>;
  };
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <ScreenBackdrop /><StatusSpacer /><TopBar onMenu={onMenu} onNew={onNew} />
      <div ref={ref} className="noscroll" style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 16px 24px' }}>{msgs.map(render)}</div>
      </div>
      <Dock
        composer={<Composer value={v} onChange={setV} onSend={send} placeholder="Ask Sentinel" streaming={phase === 'loading'} onStop={() => setPhase('static')} />}
      />
      <HomeIndicator />
      <ExplainerSheet open={!!sheet} title={sheet ? sheet.title : ''} body={sheet ? sheet.body : []} onClose={() => setSheet(null)} />
    </div>
  );
}
window.ChatScreen = ChatScreen;