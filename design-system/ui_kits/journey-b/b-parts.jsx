const { Eyebrow, Pill, InlineActionRow, DarkButton, Composer, Dock, HomeIndicator, StatusSpacer, TopBar, ScreenBackdrop, DrawnCheck, Badge, StatTile, Sparkline, Pressable } = window.DS;

/* Artboard shell — every artboard is a real 375×812 screen. */
function Artboard({ name, sub, children }) {
  return (
    <div className="ab">
      <div className="ab-name">{name}</div>
      {sub && <div className="ab-sub">{sub}</div>}
      <div className="frame">{children}</div>
    </div>
  );
}

/* Skeleton row for the artifact card filling in (Plate 1, right) — each carries its own live label. */
function SkeletonRow({ label, wide }) {
  return (
    <div style={{ display: 'flex', height: 42, alignItems: 'center', justifyContent: 'space-between', gap: 10, borderBottom: '0.5px solid var(--color-line-soft)' }}>
      {label ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, ...f(500, 13, 18, 'var(--color-muted)') }}>
          <span style={{ width: 9, height: 9, borderRadius: 9999, boxShadow: 'inset 0 0 0 1.2px var(--color-bronze)', animation: 'sentinel-shimmer 1200ms ease-in-out infinite' }} />{label}
        </span>
      ) : <span style={{ height: 8, width: wide || 120, borderRadius: 9999, background: 'var(--color-track)' }} />}
      <span style={{ height: 8, width: 34, borderRadius: 9999, background: 'var(--color-track)' }} />
    </div>
  );
}

/* Compact attribution preview for the artifact card — 96px, never scrollable. */
function AttributionPreview() {
  const rows = [['Small-cap rally', 6.1, 1], ['His July top-up', 3.4, 0.56], ['Your switch out', -1.2, 0.2]];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 2 }}>
      {rows.map(([l, v, frac], i) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 108, flexShrink: 0, ...f(500, 12, 16, i === 2 ? 'var(--color-data-deemph)' : 'var(--color-ink)') }}>{l}</span>
          <div style={{ position: 'relative', height: 14, flex: 1 }}>
            <div style={{ position: 'absolute', inset: '0 auto 0 0', width: (frac * 100) + '%', borderRadius: '2px 5px 5px 2px', background: i === 2 ? 'var(--color-track)' : 'var(--color-bronze)', boxShadow: i === 2 ? 'inset 0 0 0 1px var(--color-data-deemph)' : 'none' }} />
          </div>
          <span style={{ width: 34, textAlign: 'right', ...f(700, 12, null, i === 2 ? 'var(--color-data-deemph)' : 'var(--color-bronze-deep)') }}>{v > 0 ? '+' : '−'}{Math.abs(v)}</span>
        </div>
      ))}
    </div>
  );
}

/* Compliance status card (Plate 4) — status is stated as a row, never implied. */
function ComplianceCard({ rows }) {
  return (
    <div style={{ ...cardS, boxShadow: '0 0 0 1px var(--color-line)', padding: '0 14px' }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: 'flex', minHeight: 52, alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderBottom: i < rows.length - 1 ? '0.5px solid var(--color-line-soft)' : 'none' }}>
          <div style={{ minWidth: 0 }}>
            <p style={f(500, 13, 18)}>{r.label}</p>
            {r.note && <p style={{ ...f(400, 11, 15, 'var(--color-data-deemph)'), marginTop: 2 }}>{r.note}</p>}
          </div>
          <span style={{ flexShrink: 0, ...f(700, 13, null, r.tone === 'over' ? 'var(--color-status-over-fg)' : 'var(--color-ink)') }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/* Cost breakdown on the rail — reuses the trace structure (Plate 4, middle). */
function CostBreakdown({ items }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={f(500, 13, 18, 'var(--color-ink)')}>What this costs</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: 'rotate(180deg)' }}><path d="M3 4.5 6 7.5 9 4.5" stroke="var(--color-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 2 }}>
        <div style={{ position: 'absolute', top: 8, bottom: 8, left: 9, width: 1, background: 'var(--color-line)' }} />
        {items.map((it) => (
          <div key={it.label} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'flex', width: 16, height: 16, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: 'var(--color-canvas)', boxShadow: 'inset 0 0 0 1.4px var(--color-bronze)' }}>
              {it.dir === 'eq'
                ? <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 3h5M1.5 5h5" stroke="var(--color-bronze-deep)" strokeWidth="1.2" strokeLinecap="round" /></svg>
                : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v6M1.8 4.8 4 7l2.2-2.2" stroke="var(--color-bronze-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span style={{ flex: 1, ...f(it.dir === 'eq' ? 600 : 500, 13, 18) }}>{it.label}</span>
            <span style={f(it.dir === 'eq' ? 700 : 500, 13, 18, it.dir === 'eq' ? 'var(--color-bronze-deep)' : 'var(--color-ink)')}>{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The standing dock for a canvas / result — chips, CTA, composer, disclosure. Composer always last and always present. */
function ResultDock({ chips, cta, placeholder, value = '', streaming = false }) {
  return <Dock chips={chips} cta={cta} composer={<Composer value={value} onChange={() => {}} placeholder={placeholder} streaming={streaming} />} />;
}
/* Frozen trace. The kit renders its own static trace rather than relying on ProgressTrace's autoplay gate —
   an artboard must never show a running clock, whatever the bundle carries. */
function FrozenTrace({ steps, active, seconds }) {
  const circle = (state) => {
    if (state === 'done') return <span style={{ display: 'flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: 'var(--color-bronze)' }}><svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.8 4.6 3.6 6.4 7.2 2.6" stroke="var(--color-surface)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
    if (state === 'active') return <span style={{ width: 16, height: 16, borderRadius: 9999, background: 'var(--color-canvas)', boxShadow: '0 0 0 2px var(--color-bronze)', boxSizing: 'border-box' }} />;
    return <span style={{ width: 16, height: 16, borderRadius: 9999, boxShadow: '0 0 0 1px var(--color-line)' }} />;
  };
  return (
    <window.DS.SentinelBlock>
      <div style={{ width: '100%' }}>
        <p style={{ ...f(500, 12, 16, 'var(--color-ink)'), marginBottom: 10 }}>Working · {seconds}s</p>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 2 }}>
          <div style={{ position: 'absolute', top: 8, bottom: 8, left: 9, width: 1, background: 'var(--color-line)' }} />
          {steps.map((s, i) => (
            <div key={s} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10, opacity: i === active ? 1 : 0.4 }}>
              {circle(i < active ? 'done' : i === active ? 'active' : 'pending')}
              <span style={f(500, 13, 18, 'var(--color-ink-soft)')}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </window.DS.SentinelBlock>
  );
}
Object.assign(window, { Artboard, SkeletonRow, AttributionPreview, ComplianceCard, CostBreakdown, ResultDock, FrozenTrace });