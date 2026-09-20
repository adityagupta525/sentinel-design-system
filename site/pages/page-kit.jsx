/* The component-page kit — the nine blocks, in the one order, so every page reads identically and a
   reviewer builds a habit instead of hunting. Blocks, in order:
   1 Specimen · 2 Anatomy · 3 Variants · 4 States · 5 In context · 6 Tokens · 7 Props · 8 Do/Don't · 9 Motion
   Rules the kit enforces rather than asks for: the specimen sits alone on the product background;
   anatomy annotates OUTSIDE the frame (B/05's rule); the Tokens block resolves each name against the
   live stylesheet, so a value that is not a token shows up as missing; Props prints the real .d.ts. */
const { useState, useEffect } = React;
const FONT = 'var(--font-ui)';
const lbl = { fontFamily: FONT, fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', margin: 0 };
const note = { fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: '17px', color: 'var(--color-muted)', margin: '6px 0 0', maxWidth: 560 };

function PageShell({ name, group, status, summary, requires = [], children }) {
  const tone = status === 'shipped' ? 'ok' : status === 'building' ? 'under' : 'over';
  const ns = window.SentinelDesignSystem_0682a2 || {};
  const missing = requires.filter((n) => !ns[n]);
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 24px 64px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 26, lineHeight: '32px', color: 'var(--color-ink)' }}>{name}</h1>
          <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 9999, padding: '3px 8px', background: `var(--color-status-${tone}-bg)`, color: `var(--color-status-${tone}-fg)`, fontFamily: FONT, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{status}</span>
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 11.5, color: 'var(--color-muted)' }}>{group}</span>
          <a href="./00-Index.html" style={{ marginLeft: 'auto', fontFamily: FONT, fontWeight: 700, fontSize: 11.5, color: 'var(--color-bronze-deep)', textDecoration: 'none' }}>00 Index ›</a>
        </div>
        <p style={{ ...note, margin: 0, fontSize: 13, lineHeight: '19px', color: 'var(--color-ink-soft)' }}>{summary}</p>
      </header>
      {missing.length ? (
        <div style={{ borderRadius: 12, background: 'var(--color-status-over-bg)', padding: 16 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-status-over-fg)' }}>Not in the bundle yet</p>
          <p style={{ ...note, color: 'var(--color-ink-soft)' }}>This page needs {missing.map((n, i) => <React.Fragment key={n}>{i ? ', ' : ''}<code>{n}</code></React.Fragment>)}, which <code>ds_bundle.js</code> does not carry yet. The bundle recompiles from source at the end of a turn — reload then. The page is not broken; the build is behind it.</p>
        </div>
      ) : <PageBoundary>{children}</PageBoundary>}
    </div>
  );
}
/* A page whose component has gone says so, the way the index does — never a blank screen. */
class PageBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ borderRadius: 12, background: 'var(--color-status-over-bg)', padding: 16 }}>
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-status-over-fg)' }}>This page failed to render</p>
        <p style={{ ...note, color: 'var(--color-ink-soft)' }}>{String(this.state.err.message || this.state.err)}</p>
      </div>
    );
  }
}
function Block({ n, title, sub, children, frame = false }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <p style={lbl}>{String(n).padStart(2, '0')} · {title}</p>
        {sub && <p style={note}>{sub}</p>}
      </div>
      <div style={frame ? { borderRadius: 16, background: 'var(--color-canvas)', boxShadow: 'inset 0 0 0 1px var(--color-line)', padding: 24 } : undefined}>{children}</div>
    </section>
  );
}
/* 1 — the component alone, at real size, on the product background. Nothing else in frame. */
function Specimen({ children, width = 375 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', borderRadius: 16, background: 'var(--color-canvas)', boxShadow: 'inset 0 0 0 1px var(--color-line)', padding: '32px 24px' }}>
      <div style={{ width, maxWidth: '100%' }}>{children}</div>
    </div>
  );
}
/* 2 — the same specimen with dimensions annotated OUTSIDE the frame, per B/05.
   Side tags are anchored at left:100% / right:100% so they grow AWAY from the specimen. Anchoring them
   with right:-90 (the first version) pins the tag's right edge 90px outside the frame and lets the box
   grow leftwards instead — measured, a 245px annotation computed left:156px and laid 155px of itself
   across a 311px specimen, over the legend's own value column. Any annotation wider than the gutter
   did it; this one was just long enough to be seen. Tags wrap inside a fixed gutter width rather than
   nowrapping, so length cannot push them anywhere. */
const GUTTER = 128;
function Anatomy({ children, width = 343, top, bottom, left, right }) {
  const tick = { position: 'absolute', background: 'var(--color-bronze)', opacity: 0.5 };
  const tag = { position: 'absolute', fontFamily: FONT, fontWeight: 700, fontSize: 10, lineHeight: '14px', color: 'var(--color-bronze-deep)' };
  const side = { ...tag, width: GUTTER - 24, textWrap: 'pretty' };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', borderRadius: 16, background: 'var(--color-canvas)', boxShadow: 'inset 0 0 0 1px var(--color-line)', padding: `44px ${GUTTER}px 40px` }}>
      <div style={{ position: 'relative', width, maxWidth: '100%' }}>
        {children}
        {top && <React.Fragment><span style={{ ...tick, left: 0, right: 0, top: -14, height: 1 }} /><span style={{ ...tag, bottom: '100%', marginBottom: 18, left: 0, maxWidth: '100%', textWrap: 'pretty' }}>{top}</span></React.Fragment>}
        {bottom && <React.Fragment><span style={{ ...tick, left: 0, right: 0, bottom: -14, height: 1 }} /><span style={{ ...tag, top: '100%', marginTop: 18, left: 0, maxWidth: '100%', textWrap: 'pretty' }}>{bottom}</span></React.Fragment>}
        {left && <React.Fragment><span style={{ ...tick, top: 0, bottom: 0, left: -14, width: 1 }} /><span style={{ ...side, right: '100%', marginRight: 22, top: '50%', transform: 'translateY(-50%)', textAlign: 'right' }}>{left}</span></React.Fragment>}
        {right && <React.Fragment><span style={{ ...tick, top: 0, bottom: 0, right: -14, width: 1 }} /><span style={{ ...side, left: '100%', marginLeft: 22, top: '50%', transform: 'translateY(-50%)' }}>{right}</span></React.Fragment>}
      </div>
    </div>
  );
}
/* 3 / 4 — labelled grid; States takes only the states that genuinely exist. */
function Grid({ items, cols = 2, itemWidth }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 20 }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'flex', flexDirection: 'column', gap: 8, borderRadius: 12, background: 'var(--color-canvas)', boxShadow: 'inset 0 0 0 1px var(--color-line)', padding: 16 }}>
          <p style={lbl}>{it.label}</p>
          <div style={{ width: itemWidth, maxWidth: '100%' }}>{it.node}</div>
          {it.note && <p style={{ ...note, margin: 0, fontSize: 11 }}>{it.note}</p>}
        </div>
      ))}
    </div>
  );
}
/* 5 — inside a 375pt thread fragment: real width, real neighbours. Catches anything that only works alone. */
function Thread({ children, before, after, dock }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 375, borderRadius: 24, background: 'var(--color-canvas)', boxShadow: '0 0 0 1px var(--ring-frame)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 16px 16px' }}>
          {before}
          {children}
          {after}
        </div>
        {dock && <div style={{ borderTop: '1px solid var(--color-line-soft)', padding: '8px 16px 12px' }}>{dock}</div>}
      </div>
    </div>
  );
}
/* 6 — every token the component consumes, resolved against the live stylesheet. A name that does not
   resolve renders as MISSING, which is the page failing loudly instead of quietly. */
function Tokens({ names }) {
  const [vals, setVals] = useState({});
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const out = {};
    names.forEach((n) => { out[n] = cs.getPropertyValue(n).trim(); });
    setVals(out);
  }, [names.join()]);
  const isColor = (v) => /^(#|rgb|hsl)/.test(v);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '8px 20px' }}>
      {names.map((n) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ flexShrink: 0, width: 14, height: 14, borderRadius: 4, background: isColor(vals[n]) ? vals[n] : 'transparent', boxShadow: 'inset 0 0 0 1px var(--color-line)' }} />
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</code>
          <span style={{ marginLeft: 'auto', fontFamily: FONT, fontWeight: 500, fontSize: 10.5, color: vals[n] ? 'var(--color-muted)' : 'var(--color-status-over-fg)', whiteSpace: 'nowrap' }}>{vals[n] || 'MISSING'}</span>
        </div>
      ))}
    </div>
  );
}
/* 7 — the .d.ts, printed. Fetched, never retyped, so the page cannot drift from the contract. */
function Props({ src }) {
  const [text, setText] = useState('loading…');
  useEffect(() => { fetch(src).then((r) => (r.ok ? r.text() : Promise.reject(r.status))).then(setText).catch((e) => setText(`could not read ${src} (${e})`)); }, [src]);
  return <pre style={{ margin: 0, padding: 16, borderRadius: 12, background: 'var(--color-surface)', boxShadow: 'inset 0 0 0 1px var(--color-line)', fontFamily: 'ui-monospace, monospace', fontSize: 11.5, lineHeight: '17px', color: 'var(--color-ink-soft)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{text}</pre>;
}
/* 8 — one pair, the sharpest one. A page of eight don'ts teaches nothing. */
function DoDont({ doNode, doCaption, dontNode, dontCaption }) {
  const cell = (ok, caption, node) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 12, background: 'var(--color-canvas)', boxShadow: `inset 0 0 0 1px ${ok ? 'var(--color-status-ok-fg)' : 'var(--color-status-over-fg)'}`, padding: 16 }}>
      <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT, fontWeight: 700, fontSize: 11, color: ok ? 'var(--color-status-ok-fg)' : 'var(--color-status-over-fg)' }}>{ok ? 'Do' : "Don't"}</p>
      <div>{node}</div>
      <p style={{ ...note, margin: 0, fontSize: 11.5 }}>{caption}</p>
    </div>
  );
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>{cell(true, doCaption, doNode)}{cell(false, dontCaption, dontNode)}</div>;
}
/* 9 — the motion rows that apply, each with what it does under reduced motion. */
function Motion({ rows }) {
  const th = { textAlign: 'left', padding: '8px 12px', fontFamily: FONT, fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-line)' };
  const td = { padding: '9px 12px', fontFamily: FONT, fontWeight: 500, fontSize: 11.5, lineHeight: '16px', color: 'var(--color-ink)', borderBottom: '0.5px solid var(--color-line-soft)', verticalAlign: 'top' };
  return (
    <div style={{ borderRadius: 12, background: 'var(--color-surface)', boxShadow: 'inset 0 0 0 1px var(--color-line)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th style={th}>Motion</th><th style={th}>Property</th><th style={th}>Duration</th><th style={th}>Under reduced motion</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.name}><td style={td}>{r.name}</td><td style={{ ...td, fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>{r.property}</td><td style={td}>{r.duration}</td><td style={{ ...td, color: 'var(--color-muted)' }}>{r.reduced}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
/* Pages mount after d3-scale / d3-shape land, so a chart never renders its fallback maths here. */
function mountPage(App) {
  const go = () => ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  if (window.d3 && window.d3.scaleLinear) go(); else { let done = false; const once = () => { if (!done) { done = true; go(); } }; window.addEventListener('d3ready', once); setTimeout(once, 2500); }
}
Object.assign(window, { PageShell, PageBoundary, Block, Specimen, Anatomy, Grid, Thread, Tokens, Props, DoDont, Motion, mountPage, pageLbl: lbl, pageNote: note });
