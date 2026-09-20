/* screens/ own page shell. Deliberately not design-system/pages/page-kit.jsx: that kit is built for
   component spec pages and links back to 00-Index.html, which does not exist from here.

   What it gives a screen page: a header that states the screen's job, a State frame that puts a real
   375x812 PhoneFrame under a caption, and two tables — motion with its reduced-motion answer, and
   provenance for every figure on the screen. Tokens only; no raw colour or type value. */
/* THE FOUR TURN COMPONENTS THE SCREENS WERE CARRYING THEMSELVES, destructured once here because
   screen-kit is the one file every screen page loads (20 Sep 2026). `UserTurn`, `AttachmentTurn`,
   `RefusalTurn` and `StepComposer` were defined inside `screens/` until today and are the system's
   now — the owner's rule: anything built on a screen that belongs in the design system goes into the
   design system. Every page compiles into ONE Babel scope, so this is the only place they may be
   named; a second `const UserTurn` anywhere under screens/ renders nothing at all. */
const { PhoneFrame } = window.SentinelDesignSystem_0682a2 || {};
/* Named on `window` rather than destructured into a const, for the reason the linter states plainly:
   every screen file is linted on its own, so a const here reads as unused and a use over there reads
   as undefined. `window` is what the one Babel scope actually shares, and the adherence config lists
   these four as screen globals — the same way it lists every other cross-file name. */
Object.assign(window, {
  UserTurn: (window.SentinelDesignSystem_0682a2 || {}).UserTurn,
  AttachmentTurn: (window.SentinelDesignSystem_0682a2 || {}).AttachmentTurn,
  RefusalTurn: (window.SentinelDesignSystem_0682a2 || {}).RefusalTurn,
  StepComposer: (window.SentinelDesignSystem_0682a2 || {}).StepComposer,
});
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

/* THE INERT COMPOSER A FROZEN SPECIMEN DRAWS — written once (20 Sep 2026).

   `const Ask = …` was declared TEN times across ten screen pages, seven of them byte-for-byte:
   05-decide:19 · funds:21 · rebalance:20 · proposal:19 · review:19 · ledger:22 · going-back:24, with
   03-thread-answer:23 differing by a placeholder and risk-profile:20 / refusals:20 branching to
   MoneyComposer. Ten copies of one decision, and the decision is rule 3 — every screen has a
   composer — drawn rather than wired, because a frozen specimen has nothing to send to.

   IT BELONGS HERE AND NOT IN design-system/. The system already ships `Composer`; a "pretend
   composer" beside it would be a one-off component in a system that has a rule against those. This
   is the screens' own shared layer, which exists for exactly this.

   Read through a namespaced const, never destructured: every .jsx and inline script a page loads
   compiles into ONE Babel scope, and ten of these pages already declare `const { Composer, … }` at
   their top level. A second declaration of that name here renders the page blank. */
const KIT_DS = window.SentinelDesignSystem_0682a2 || {};
function FrozenAsk({ about = false, money = false, placeholder, onAttach }) {
  /* Money is a different control, not a different placeholder: MoneyComposer owns its own value and
     hands back a formatted rupee string, which is why it takes no value/onChange even when wired. */
  if (money) return <KIT_DS.MoneyComposer onSend={() => {}} placeholder="or type the amount" />;
  return <KIT_DS.Composer value="" onChange={() => {}} onSend={() => {}} onAttach={onAttach}
    placeholder={placeholder || (about ? 'Ask about this' : 'Ask Sentinel')} />;
}

const MotionTable = ({ rows }) => <Table head={['Motion', 'Property', 'Duration', 'Under reduced motion']} rows={rows} />;
const ProvenanceTable = ({ rows }) => <Table head={['Figure on screen', 'Where it comes from', 'Shown to the advisor as']} rows={rows} />;

function mountScreen(node) {
  const el = document.getElementById('root');
  if (el) ReactDOM.createRoot(el).render(node);
}

Object.assign(window, { ScreenShell, Section, State, StateRow, Note, Table, MotionTable, ProvenanceTable, FrozenAsk, mountScreen, screenMuted: muted });
