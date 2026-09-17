const { ScreenBackdrop, StatusSpacer, TopBar, GreetingDivider, SuggestionRow, Eyebrow, Pill, Composer, HomeIndicator } = window.DS;
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
        <div style={{ margin: '0 4px 8px' }}><Eyebrow>Jump back in</Eyebrow></div>
        <div style={{ ...card, boxShadow: 'var(--shadow-card-soft)', padding: '0 12px' }}>
          {KIT.jump.map((r, i) => (
            <button key={r.label} type="button" onClick={() => onGo(r.go)} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', height: 46, width: '100%', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', borderBottom: i < 3 ? '0.5px solid var(--color-line-soft)' : 'none' }}>
              <span style={f(600, 13, 18)}>{r.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={f(500, 11.5, 16, 'var(--color-muted)')}>{r.meta}</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3 7.5 6l-3 3" stroke="var(--color-bronze)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '13px 8px', padding: '0 16px 12px' }}>{KIT.chips.map((c, i) => <div key={c} style={rise(2 + i)}><Pill label={c} onClick={() => onSubmit(c)} /></div>)}</div>
      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px 12px', ...rise(5) }}><Composer value={v} onChange={setV} onSend={() => v.trim() && onSubmit(v.trim())} /></div>
      <HomeIndicator />
    </div>
  );
}
window.HomeScreen = HomeScreen;