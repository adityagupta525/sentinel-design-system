/* screens/ own page shell. Deliberately not design-system/pages/page-kit.jsx: that kit is built for
   component spec pages and links back to 00-Index.html, which does not exist from here.

   What it gives a screen page: a header that states the screen's job, a State frame that puts a real
   375x812 PhoneFrame under a caption, and two tables — motion with its reduced-motion answer, and
   provenance for every figure on the screen. Tokens only; no raw colour or type value. */
const { PhoneFrame } = window.SentinelDesignSystem_0682a2 || {};
const FONT = 'var(--font-ui)';
const muted = { fontFamily: FONT, fontWeight: 400, fontSize: 12.5, lineHeight: '18px', color: 'var(--color-muted)', margin: 0 };

function ScreenShell({ journey, n, name, job, without, children }) {
  const ns = window.SentinelDesignSystem_0682a2 || {};
  const missing = (window.__screenRequires || []).filter((c) => !ns[c]);
  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 24px 72px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze-deep)' }}>{journey} · {n}</span>
          <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 26, lineHeight: '32px', color: 'var(--color-ink)' }}>{name}</h1>
          <a href="../index.html" style={{ marginLeft: 'auto', fontFamily: FONT, fontWeight: 700, fontSize: 11.5, color: 'var(--color-bronze-deep)', textDecoration: 'none' }}>Screens ›</a>
        </div>
        <p style={{ ...muted, fontSize: 13, lineHeight: '19px', color: 'var(--color-ink-soft)', maxWidth: '70ch' }}>{job}</p>
        {without && <p style={{ ...muted, maxWidth: '70ch' }}><strong style={{ fontWeight: 600, color: 'var(--color-ink-soft)' }}>Without this screen</strong> the advisor {without}</p>}
      </header>
      {missing.length ? (
        <div style={{ borderRadius: 'var(--radius-12)', background: 'var(--color-status-over-bg)', padding: 16 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-status-over-fg)' }}>Not in the bundle</p>
          <p style={{ ...muted, color: 'var(--color-ink-soft)' }}>This screen needs {missing.join(', ')}. Run <code>npm run build:bundle</code> and reload — the screen is not broken, the build is behind it.</p>
        </div>
      ) : children}
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderBottom: '1px solid var(--color-line)', paddingBottom: 8 }}>
        <h2 style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 15, lineHeight: '20px', color: 'var(--color-ink)' }}>{title}</h2>
        {sub && <p style={{ ...muted, maxWidth: '78ch' }}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

/* One state: the caption says which state, the note says why it looks like that. The phone is the
   real component tree at the real 375x812, never a picture of one. */
function State({ label, tone = 'ok', note, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 375 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-full)', padding: '3px 8px', background: `var(--color-status-${tone}-bg)`, color: `var(--color-status-${tone}-fg)`, fontFamily: FONT, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <PhoneFrame>{children}</PhoneFrame>
      {note && <p style={{ ...muted, width: 375 }}>{note}</p>}
    </div>
  );
}

function StateRow({ children }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>{children}</div>;
}

function Note({ title, children }) {
  return (
    <div style={{ borderRadius: 'var(--radius-16)', background: 'var(--color-bubble)', padding: 14, display: 'flex', flexDirection: 'column', gap: 5, maxWidth: '82ch' }}>
      {title && <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze-deep)' }}>{title}</p>}
      <p style={{ ...muted, color: 'var(--color-ink-soft)' }}>{children}</p>
    </div>
  );
}

function Table({ head, rows }) {
  const cell = { fontFamily: FONT, fontSize: 12, lineHeight: '17px', padding: '9px 12px', verticalAlign: 'top', textAlign: 'left' };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640, background: 'var(--color-surface)', borderRadius: 'var(--radius-12)' }}>
        <thead><tr>{head.map((h) => <th key={h} style={{ ...cell, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-line)' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} style={{ ...cell, fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--color-ink)' : 'var(--color-ink-soft)', borderBottom: i < rows.length - 1 ? '0.5px solid var(--color-line-soft)' : 'none' }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

const MotionTable = ({ rows }) => <Table head={['Motion', 'Property', 'Duration', 'Under reduced motion']} rows={rows} />;
const ProvenanceTable = ({ rows }) => <Table head={['Figure on screen', 'Where it comes from', 'Shown to the advisor as']} rows={rows} />;

function mountScreen(node) {
  const el = document.getElementById('root');
  if (el) ReactDOM.createRoot(el).render(node);
}

Object.assign(window, { ScreenShell, Section, State, StateRow, Note, Table, MotionTable, ProvenanceTable, mountScreen, screenMuted: muted });
