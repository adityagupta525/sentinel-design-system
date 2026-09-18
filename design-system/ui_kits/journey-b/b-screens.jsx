const { ScreenBackdrop, StatusSpacer, TopBar, GreetingDivider, SuggestionRow, Eyebrow, EyebrowDivider, Pill, ChipRow, InlineActionRow, DarkButton, Composer, Dock, HomeIndicator, UserBubble, SentinelBlock, SentinelText, ProgressTrace, AllocationCard, AttributionChart, ArtifactCard, MoveCard, ConstraintCallout, DisclosureBlock, StatTile, Sparkline, DrawnCheck, Badge, Provenance, StandingDisclosure, ScrollToBottomButton, Pressable } = window.DS;

const Shell = ({ children }) => <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}><ScreenBackdrop />{children}</div>;
/* Bottom-anchored AND pinned to the newest turn (see journey-a-risk for the reasoning). */
function Thread({ children, pad = '16px 16px 24px' }) {
  const ref = React.useRef(null);
  React.useEffect(() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; });
  return (
    <div ref={ref} className="noscroll" style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: pad }}>{children}</div>
    </div>
  );
}

/* B / 01 — Home / Default. The three suggestion rows restored verbatim: one external, one generative, one diagnostic. */
function B01() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 4 }}><GreetingDivider>Good afternoon, Ashish</GreetingDivider></div>
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 16px 0' }}>
        <div style={{ ...cardS, boxShadow: 'var(--shadow-card-soft)', padding: '0 12px' }}>{B.suggestions.map((s, i) => <SuggestionRow key={s} label={s} last={i === 2} />)}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px 0' }}>
        <div style={{ margin: '0 4px 8px' }}><Eyebrow>Jump back in</Eyebrow></div>
        <div style={{ ...cardS, boxShadow: 'var(--shadow-card-soft)', padding: '0 12px' }}>
          {B.jump.map((r, i) => (
            <div key={r.label} style={{ display: 'flex', height: 'var(--h-row-lg)', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 3 ? '0.5px solid var(--color-line-soft)' : 'none' }}>
              <span style={f(600, 13, 18)}>{r.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={f(500, 11.5, 16, 'var(--color-muted)')}>{r.meta}</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3 7.5 6l-3 3" stroke="var(--color-bronze)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '13px 8px', padding: '0 16px 12px' }}>{B.homeChips.map((c) => <Pill key={c} label={c} />)}</div>
      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px 12px' }}><Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.home} /></div>
      <HomeIndicator />
    </Shell>
  );
}

/* B / 02 — the typed query. Thread bottom-anchored; composer focused with the sentence still editable. */
function B02() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread><SentinelText text="Ask about a client, a fund or a plan. I will tell you if I do not follow." weight="Regular" /></Thread>
      <div style={{ position: 'relative', zIndex: 1, padding: '6px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Composer value={B.query} onChange={() => {}} placeholder={PLACEHOLDER.thread} autoFocus />
        <StandingDisclosure />
      </div>
      <HomeIndicator />
    </Shell>
  );
}

/* B / 03 — the progress trace. Steps name real work; Stop occupies the send slot so the composer never leaves. */
function B03() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <UserBubble text={B.query} />
        <FrozenTrace steps={B.steps} active={2} seconds={3} />
      </Thread>
      <Dock composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.thread} streaming />} />
      <HomeIndicator />
    </Shell>
  );
}

/* B / 04 — trace collapsed, artifact card filling in. Never a blank wait: each skeleton row carries its live label. */
function B04() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <SentinelBlock><Pressable style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={f(500, 13, null, 'var(--color-muted)')}>Thought for 4s</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3 7.5 6l-3 3" stroke="var(--color-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></Pressable>
          <div style={{ marginTop: 10, borderLeft: '1px solid var(--color-line)', paddingLeft: 12 }}><p style={f(400, 13, 19, 'var(--color-muted)')}>{B.reasoning}</p></div>
          <div style={{ marginTop: 12 }}><SentinelText text={B.answer} /></div>
        </SentinelBlock>
        <div style={{ ...cardS, overflow: 'hidden' }}>
          <div style={{ padding: '14px 14px 0' }}>
            <Eyebrow>{B.cardEyebrow}</Eyebrow>
            <p style={{ ...f(500, 16, 24), marginTop: 4 }}>{B.cardTitle}</p>
          </div>
          <div style={{ padding: '10px 14px 0' }}>
            <SkeletonRow label={null} wide={132} />
            <SkeletonRow label="Reading his July top-up" />
            <SkeletonRow label={null} wide={98} />
          </div>
        </div>
      </Thread>
      <Dock composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.streaming} streaming />} />
      <HomeIndicator />
    </Shell>
  );
}

/* B / 05 — artifact card complete in the thread, with the three-slot footer. */
function B05() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <SentinelBlock><SentinelText text={B.answer} /></SentinelBlock>
        <ArtifactCard eyebrow={B.cardEyebrow} title={B.cardTitle} provenance={B.provenance} onToggle={() => {}} onWhy={() => {}} onShare={() => {}}><AttributionPreview /></ArtifactCard>
        <p style={f(400, 11, 15, 'var(--color-data-deemph)')}>Share opens the message draft — B / 11.</p>
      </Thread>
      <Dock
        chips={<InlineActionRow actions={[{ label: 'Why is 71% a problem at all', tone: 'tertiary' }, { label: 'Show me the 18 holdings' }]} animate={false} />}
        composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.thread} />} />
      <HomeIndicator />
    </Shell>
  );
}

/* B / 06 — the EXPANDED artifact card. Replaces the A2 canvas artboard: that surface was removed from the
   product (v5 Part 1), so this documents the pattern that took its job — the card's own header row
   (eyebrow, title, ⋯), the V3 chart and stat tiles in situ, the Collapse ⌃ footer slot, and the
   no-nested-scroll contract: the THREAD scrolls, the card never does. */
function B06() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <SentinelBlock><SentinelText text={B.answer} /></SentinelBlock>
        <ArtifactCard state="expanded" eyebrow={B.cardEyebrow} title={B.cardTitle} provenance={B.provenance}
          onToggle={() => {}} onWhy={() => {}} onShare={() => {}} onMenu={() => {}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AttributionChart from={62} to={71} target={60} contributions={B.contributions} />
            <p style={f(400, 13, 19, 'var(--color-ink-soft)')}>{B.verdict}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <StatTile label="Cost of doing nothing" value="₹4,40,000" note="in a 20% fall" />
              <StatTile label="Cost of fixing it now" value="₹11,200" note="exit load + STCG" />
            </div>
            <StatTile label="Drift added since 30 Jun" value="+9 points" note="62% to 71% against a 60% target" sparkline={<Sparkline points={[62, 64, 67, 69, 71]} width={120} />} />
          </div>
        </ArtifactCard>
        <p style={f(400, 11, 15, 'var(--color-data-deemph)')}>No nested scroll: the card takes its natural height and the thread carries the scroll. On expand the thread brings this header under the app bar; on collapse it returns to the card. The table view lives in the ⋯.</p>
      </Thread>
      <ResultDock
        chips={<ChipRow animate={false}><Pill label="Why is 71% a problem at all" tone="tertiary" /><Pill label="Show me the 18 holdings" /></ChipRow>}
        cta={<DarkButton label="Fix it" />}
        placeholder={PLACEHOLDER.expanded} />
      <HomeIndicator />
    </Shell>
  );
}

/* B / 07 — a follow-up asked while the artifact is expanded. The card does not collapse and nothing is
   pushed aside: the thread scrolls past it, so only its foot is in view and the newest turn sits at the
   bottom. That is the no-nested-scroll contract seen from the other end. */
function B07() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread pad="0 16px">
        <div style={{ borderRadius: 16, background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div style={{ padding: '0 14px' }}><AttributionPreview /></div>
          <div style={{ margin: '12px 14px 0', height: 1, background: 'var(--color-line-soft)' }} />
          <div style={{ display: 'flex', padding: '0 14px' }}>
            {[['Collapse ⌃', true], ['Why?', false], ['Share', false]].map(([t, strong]) => (
              <span key={t} style={{ flex: 1, display: 'flex', height: 44, alignItems: 'center', ...f(700, 12, 16, strong ? 'var(--color-bronze-deep)' : 'var(--color-muted)') }}>{t}</span>
            ))}
          </div>
        </div>
        <UserBubble text={B.followUpQ} />
        <SentinelBlock><SentinelText text={B.followUpA} />
          <div style={{ marginTop: 12, ...cardS, boxShadow: '0 0 0 1px var(--color-line)', padding: '0 14px' }}>
            {[['Cost of doing nothing', '₹4,40,000'], ['Cost of fixing it now', '₹11,200']].map(([l, v], i) => (
              <div key={l} style={{ display: 'flex', height: 'var(--h-row-xl)', alignItems: 'center', justifyContent: 'space-between', borderBottom: i === 0 ? '0.5px solid var(--color-line-soft)' : 'none' }}>
                <span style={f(500, 14, 20)}>{l}</span><span style={f(600, 16, 20, 'var(--color-bronze-deep)')}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}><Provenance text="As of 30 Sep · exit load from scheme documents, STCG at 20%" /></div>
          <div style={{ marginTop: 12 }}><InlineActionRow actions={[{ label: 'Show the five we skipped' }]} animate={false} /></div>
        </SentinelBlock>
      </Thread>
      <ResultDock
        chips={<ChipRow animate={false}><Pill label="Why 20% STCG?" tone="tertiary" /></ChipRow>}
        cta={<DarkButton label="Fix it" />}
        placeholder={PLACEHOLDER.expanded} />
      <HomeIndicator />
    </Shell>
  );
}

/* B / 08 — the rebalance response: two move cards and the cost breakdown, ending in the CTA above the composer. */
function B08() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <UserBubble text="Fix it" />
        <SentinelBlock>
          <div style={{ marginBottom: 12 }}><EyebrowDivider>Two moves, not seven</EyebrowDivider></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{B.moves.map((m) => <MoveCard key={m.n} {...m} />)}</div>
          <div style={{ marginTop: 14 }}><CostBreakdown items={B.costs} /></div>
          <div style={{ marginTop: 12 }}><Provenance text="As of 30 Sep · exit load from scheme documents, STCG at 20%" /></div>
        </SentinelBlock>
      </Thread>
      <Dock
        chips={<ChipRow animate={false}><Pill label="Show the five we skipped" /></ChipRow>}
        cta={<DarkButton label="Approve both moves" />}
        composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.thread} />} />
      <HomeIndicator />
    </Shell>
  );
}

/* B / 09 — the confirm sheet. Modal, so it keeps the scrim. Disclosure ABOVE the numbers; compliance stated as rows.
   The one surface with no composer: commit or dismiss, no third path (§ readme, confirm-sheet exception). */
function B09() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread pad="16px 16px 10px">
        <div style={{ opacity: 0.5 }}><MoveCard {...B.moves[0]} /></div>
      </Thread>
      <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'var(--scrim)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30, maxHeight: '93%', display: 'flex', flexDirection: 'column', borderRadius: '24px 24px 0 0', background: 'var(--color-canvas)', boxShadow: '0 -8px 40px -12px rgba(37,31,27,.28)' }}>
        <div style={{ margin: '12px auto 10px', height: 5, width: 44, borderRadius: 9999, background: 'var(--color-line)' }} />
        <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={f(600, 18, 24)}>Approve — R. Sharma</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: 16, background: 'var(--color-surface)', padding: '9px 12px', boxShadow: '0 0 0 1px var(--color-line)' }}>
            <span style={f(500, 13, 18)}>2 moves · ₹1,85,000 · equity 71% → 58%</span>
            <Pill label="Edit" size="sm" tone="filter" />
          </div>
          <ConstraintCallout eyebrow="Before you approve" body={B.confirmDisclosure} />
          <DisclosureBlock />
          <ComplianceCard rows={B.compliance} />
        </div>
        <Dock
          chips={<ChipRow animate={false}><Pill label="What Sharma will not see" tone="tertiary" /></ChipRow>}
          cta={<DarkButton label="Approve both moves" />} />
        <HomeIndicator tone="dark" />
      </div>
    </Shell>
  );
}

/* B / 10 — success. A drawn check, a timestamp, a settlement line. No confetti: wrong register for money. */
function B10() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread>
        <UserBubble text="Approve both moves" />
        <SentinelBlock>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...cardS, padding: '13px 14px' }}>
            <DrawnCheck />
            <div><p style={f(600, 15, 22)}>{B.successTitle}</p><p style={{ ...f(500, 12, 16, 'var(--color-muted)'), marginTop: 2 }}>{B.successMeta}</p></div>
            <div style={{ marginLeft: 'auto' }}><Badge variant="status" tone="ok">Queued</Badge></div>
          </div>
          <p style={{ ...f(400, 14, 20, 'var(--color-ink-soft)'), marginTop: 10 }}>{B.successBody}</p>
          <div style={{ marginTop: 10 }}><Provenance text="Placed 16 Sep, 9:41 · confirmation from the RTA on T+2" /></div>
          <div style={{ marginTop: 12 }}><InlineActionRow actions={[{ label: 'Tell Sharma now' }, { label: 'Back to his portfolio' }]} animate={false} /></div>
        </SentinelBlock>
      </Thread>
      <Dock composer={<Composer value="" onChange={() => {}} placeholder={PLACEHOLDER.thread} />} />
      <HomeIndicator />
    </Shell>
  );
}
/* B / 11 — where Share goes: the message draft as an expanded ArtifactCard in the thread. No canvas, no
   back pill. Thread padding is 0 top/bottom — a box shorter than its card is anchored to the bottom,
   never padded toward fitting. Disclosure stays locked above the body. */
function B11() {
  return (
    <Shell><StatusSpacer /><TopBar />
      <Thread pad="0 16px">
        <ArtifactCard state="expanded" eyebrow={B.draft.eyebrow} title={B.draft.title}
          provenance="As of 30 Sep · drafted from the drift attribution. You send it, not Sentinel."
          onToggle={() => {}} onWhy={() => {}} onShare={() => {}} onMenu={() => {}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <DisclosureBlock />
            <div style={{ ...cardS, boxShadow: '0 0 0 1px var(--color-line)', padding: 10 }}>
              <p style={f(400, 14, 20, 'var(--color-ink-soft)')}>{B.draft.body}</p>
            </div>
          </div>
        </ArtifactCard>
      </Thread>
      <ResultDock
        chips={<ChipRow animate={false}><Pill label="What must the disclosure say?" tone="tertiary" /></ChipRow>}
        cta={<DarkButton label="Send to R. Sharma" />}
        placeholder={PLACEHOLDER.expanded} />
      <HomeIndicator />
    </Shell>
  );
}
Object.assign(window, { B01, B02, B03, B04, B05, B06, B07, B08, B09, B10, B11 });