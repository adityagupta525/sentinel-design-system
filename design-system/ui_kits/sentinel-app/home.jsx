const { ScreenBackdrop, StatusSpacer, TopBar, GreetingDivider, SuggestionRow, List, ChipRow, Pill, Composer, Dock, HomeIndicator } = window.DS;
/* REDRAWN 20 Sep 2026. Two things on this artboard contradicted the component set rather than
   documenting it, which is the one state the kit's own standing rule forbids:

   - "Jump back in" was four hand-written `<button>`s with their own chevron SVG, hairline border and
     `--h-row-lg`. That row is `List` + `ListRow variant='nav' trailing='chevron'`, and has been since
     v9 — so a fix to the row reached the product and never reached this board. It is the List now,
     with `header` drawing the eyebrow the card used to draw itself.
   - The composer sat in a bare `<div>` with a hand-rolled flex-wrap row of pills above it. Rule 3 is
     that the composer is DOCKED; Home's starters are the one legitimate case of `Dock.chips`
     (Home has no conversation, so there is no message for them to sit under and no scroll for them
     to outlive), and `ChipRow` is what draws them. Both are the Dock's now. */
function HomeScreen({ onMenu, onSubmit, onGo }) {
  const [v, setV] = React.useState('');
  const rise = (i) => ({ animation: 'ds-rise var(--dur-screen) var(--ease) both', animationDelay: (i * 60) + 'ms' });
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <ScreenBackdrop /><StatusSpacer /><TopBar onMenu={onMenu} onNew={() => setV('')} />
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 4, ...rise(0) }}><GreetingDivider>Good afternoon, Ashish</GreetingDivider></div>
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 16px 0', ...rise(1) }}>
        <div style={{ ...card, boxShadow: 'var(--shadow-card-soft)', padding: '0 12px' }}>{KIT.suggestions.map((s, i) => <SuggestionRow key={s} label={s} last={i === 2} onClick={() => onSubmit(s)} />)}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px 0', ...rise(2) }}>
        <List header="Jump back in" dividers="inset"
          rowProps={{ variant: 'nav', trailing: 'chevron' }}
          items={KIT.jump.map((r) => ({ title: r.label, meta: r.meta, onPress: () => onGo(r.go) }))}
          emptyState={{ title: 'Nothing open yet — what you start will wait for you here.' }} />
      </div>
      <div style={{ flex: 1 }} />
      <Dock
        chips={<ChipRow>{KIT.chips.map((c) => <Pill key={c} label={c} onClick={() => onSubmit(c)} />)}</ChipRow>}
        composer={<Composer value={v} onChange={setV} onSend={() => v.trim() && onSubmit(v.trim())} />} />
      <HomeIndicator />
    </div>
  );
}
window.HomeScreen = HomeScreen;
