const { Eyebrow, Pill, InlineActionRow, DarkButton, Composer, Dock, HomeIndicator, StatusSpacer, TopBar, ScreenBackdrop, DrawnCheck, Badge, StatTile, Sparkline, Pressable, ChartBar, FigureRow, Surface } = window.DS;
/* REDRAWN 20 Sep 2026. Three of the parts on this board were hand-drawn copies of devices the system
   now owns, so every fix to the real component has been invisible here since it was written — which
   is the exact failure the kit's own standing rule names: "the kit never ships an artboard that
   contradicts the current component set. Redraw it, or delete it."

   - `AttributionPreview` drew its own 108pt label column, its own bars and its own track. That is
     `ChartBar density='peek'`, which `screens/journey-b/answer.jsx` has used since it was built, and
     which enforces rule 1 — one hue, the label carries the identity.
   - `ComplianceCard` drew label / value rows with a quiet note and an `over` tone by hand. That pair
     is `FigureRow`, built 20 Sep out of four hand-written instances exactly like these, in a
     `Surface` rather than a card with its own ring.
   - `CostBreakdown` drew a rail of dots, its own chevron and its own total row. The product's cost
     breakdown is FigureRows with the total strong and the lines quiet — `screens/journey-b/moves.jsx`.

   And `ResultDock` no longer takes a `cta`: a decision belongs under the thing it decides about. */

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

/* Compact attribution preview for the artifact card — 96px, never scrollable.
   `ChartBar density='peek'` caps at four rows and ranks them; the three the product attributes the
   drift to are what it draws, and they are the product's own figures rather than the board's older
   ones. A hand-drawn third row in `--color-data-deemph` with a hollow bar was encoding "this one is
   different" in two ways the component does not have and the system does not allow. */
function AttributionPreview() {
  return (
    <ChartBar density="peek" run={false}
      bars={[{ label: 'Small-cap rally', value: 6.1 }, { label: 'His July top-up', value: 2.0 }, { label: 'The funds moved', value: 0.9 }]}
      valueFormat={(v) => `+${v.toFixed(1)}`} />
  );
}

/* Compliance status card (Plate 4) — status is stated as a row, never implied.
   `FigureRow` is that pair: label and figure on one baseline, the note as the quiet half, and `over`
   as TEXT colour rather than a fill. `Surface elevation='ring'` is the card it sits in. */
function ComplianceCard({ rows }) {
  return (
    <Surface elevation="ring">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {rows.map((r) => (
          <FigureRow key={r.label} label={r.label} value={r.value} tone={r.tone === 'over' ? 'over' : 'ink'}
            sub={r.note ? { label: r.note, value: '' } : undefined} />
        ))}
      </div>
    </Surface>
  );
}

/* Cost breakdown on the rail — the product's own shape now (`screens/journey-b/moves.jsx`): the total
   is the strong row because the total is what an advisor approves, and the lines that produce it are
   quiet under it. The rail of dots, the ring icons and the rotated chevron were three drawings doing
   the job of one component's `weight` prop. */
function CostBreakdown({ items }) {
  const total = items.find((it) => it.dir === 'eq');
  const lines = items.filter((it) => it.dir !== 'eq');
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {total && <FigureRow label={total.label} value={total.value} />}
      {lines.map((it) => <FigureRow key={it.label} label={it.label} value={it.value} weight="quiet" />)}
    </div>
  );
}

/* The standing dock for a result — the composer, and the disclosure under it. No chips, no CTA: both
   moved into the turn that offers them (ruling, 18 Sep). */
function ResultDock({ placeholder, value = '', streaming = false }) {
  return <Dock composer={<Composer value={value} onChange={() => {}} placeholder={placeholder} streaming={streaming} />} />;
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