const { IconSparkle, IconPlus, IconChevronRight, Pressable, Composer } = window.DS;
function DrawerPanel({ open, onClose, onNew, onGo }) {
  const [v, setV] = React.useState('');
  if (!open) return null;
  const Sec = ({ t }) => <p style={{ ...f(700, 11, null, 'var(--color-muted)'), textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 4px 6px' }}>{t}</p>;
  const Row = ({ children, last, onClick }) => <Pressable onClick={onClick} style={{ display: 'flex', height: 46, width: '100%', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', borderBottom: last ? 'none' : '0.5px solid var(--color-line-soft)' }}>{children}</Pressable>;
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'var(--scrim)', opacity: 0.25, animation: 'ds-fade 250ms var(--ease) both' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, zIndex: 40, display: 'flex', width: 300, flexDirection: 'column', background: 'var(--color-canvas)', backgroundImage: 'var(--paper-texture)', backgroundSize: 'var(--paper-texture-size)', boxShadow: 'var(--shadow-drawer)', animation: 'kit-drawer var(--dur-screen) var(--ease) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconSparkle /><span style={f(700, 16)}>Sentinel</span></div>
          <Pressable onClick={onNew} style={{ display: 'flex', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: 'var(--color-surface)', boxShadow: '0 0 0 1px var(--color-line)' }}><IconPlus /></Pressable>
        </div>
        <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 0' }}>
          <Sec t="Saved work" />
          <div style={{ ...card, boxShadow: 'none', padding: '0 12px' }}>{KIT.jump.map((r, i) => <Row key={r.label} last={i === 3} onClick={() => onGo(r.go)}><span style={f(500, 13)}>{r.label}</span><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={f(500, 11.5, null, 'var(--color-muted)')}>{r.meta}</span><IconChevronRight /></span></Row>)}</div>
          <Sec t="Recent" />
          <div style={{ ...card, boxShadow: 'none', padding: '0 12px', marginTop: -6 }}>{KIT.history.map((h, i) => <Row key={h} last={i === 3} onClick={onClose}><span style={f(500, 13)}>{h}</span><IconChevronRight /></Row>)}</div>
          <Sec t="Clients" />
          <div style={{ ...card, boxShadow: 'none', padding: '0 12px', marginTop: -6 }}>{KIT.clients.map((c, i) => <Row key={c} last={i === 3} onClick={() => onGo('portfolio')}><span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: 'var(--surface-avatar)', boxShadow: '0 0 0 1px var(--color-bubble-edge)', ...f(700, 11, null, 'var(--color-bronze-deep)') }}>{c.split(' ').map((w) => w[0]).join('')}</span><span style={f(500, 13)}>{c}</span></span></Row>)}</div>
          <p style={{ ...f(400, 11, 15, 'var(--color-muted)'), padding: '18px 4px 4px' }}>Demo data · no real client portfolios are shown</p>
        </div>
        <div style={{ padding: '8px 16px 20px' }}><Composer value={v} onChange={setV} onSend={() => setV('')} placeholder="Ask Sentinel" /></div>
      </div>
    </>
  );
}
window.DrawerPanel = DrawerPanel;