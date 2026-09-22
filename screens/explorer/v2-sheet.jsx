/* VARIATION 2 — THE EXPLORER SHEET OVER THE LIVE CHAT.

   The owner's ruling of 22 Sep: a SUMMONED sheet may rise over the composer's screen. The 18 Sep rule
   ("nothing pinned above the composer") removed `Dock.chips` and `Dock.cta`, which sat there on every
   screen whether or not the advisor asked. This is the opposite case — it opens only on a funds query,
   it always carries a visible dismiss, and it never covers the composer, which `ExplorerSheet` makes
   structural rather than a promise: its box stops at the composer's height.

   THE MECHANIC HAS NO INCUMBENT, and that is stated rather than hidden. Forty-two reference screens
   were read and no product raises a BROWSE sheet over a LIVE CHAT with the composer still working.
   Rufus is the mirror (a chat sheet over a store), Google Maps is the detent grammar (over a canvas,
   not a conversation), Spotify is the mutating object (inside one thread, not layered over it). Every
   half is proven; the seam is not. The board below is the thing to put in front of an advisor before
   this is trusted.

   ONE ARTIFACT, MUTATED — NOT A TABLE PER TURN. This is the fix for the pattern behind "2–3 funds,
   bas": the rejected build re-sent a fresh table on every refinement, so an eight-turn session left
   eight stale tables and nothing to come back to. Here there is exactly ONE live list, and the thread
   keeps only the sentence. When the sheet closes it leaves a single short note for the record. */

const { useState: useState2 } = React;

const V2_SORTS = [{ key: 'r3', label: '3Y return' }, { key: 'ter', label: 'Expense' }, { key: 'held', label: 'Held by clients' }];
function v2Sort(list, key) {
  const c = list.slice();
  if (key === 'ter') c.sort((a, b) => perfOf(a.id).ter - perfOf(b.id).ter);
  else if (key === 'held') c.sort((a, b) => holdersOf(b.id).length - holdersOf(a.id).length);
  else c.sort((a, b) => perfOf(b.id).r3 - perfOf(a.id).r3);
  return c;
}

/* The composer's own height, which is what keeps the sheet off it. Measured from the rendered
   Composer rather than guessed — 68 is the control, 16 the gutter it sits in. */
const COMPOSER_BOX = 84;

/* THE THREAD HAS TO RESERVE THE SHEET'S ROW, or the claim this variation rests on is false.
   Found by rendering it: a `thread` body bottom-anchors its content, so with the sheet open the last
   turn sat UNDERNEATH it and the conversation the sheet is supposed to leave readable was completely
   covered. A non-modal sheet that hides the thread is a modal with no scrim — the worst of both.
   The product already has this rule for a smaller case: ScreenScaffold reserves ScrollToBottomButton's
   row so the last line of a thread cannot rest under it (20 Sep). Same rule, bigger control.
   MEASURED, NOT ESTIMATED. The first cut of this table was guessed from the detents' percentages and
   was wrong on all three — peek by 26px, which is exactly enough to clip the last line of the answer
   the sheet is reporting on. Read off the rendered sheet at 375×812: peek 176, half 292, full 483.
   Plus --space-12, so the last thread line is not flush against the sheet's top edge. A build measures
   the element and reserves from that rather than carrying a table at all. */
const SHEET_RESERVE = { peek: 188, half: 304, full: 495 };

function V2Thread({ said, closed, count }) {
  return (
    <React.Fragment>
      <UserBubble text={said} />
      <div style={{ marginTop: 'var(--space-12)' }}>
        <SentinelBlock>
          <SentinelText text={closed
            ? `${count} funds matched — flexi cap, under 0.7%, on your shelf. Ask again to reopen the list.`
            : `${count} funds match. The list is open below — keep typing to narrow it.`} />
        </SentinelBlock>
      </div>
    </React.Fragment>
  );
}

function V2({ startDetent = 'half', startValue, startOpen = true, said = 'flexi cap under 0.7% on our shelf' }) {
  const [detent, setDetent] = useState2(startDetent);
  const [open, setOpen] = useState2(startOpen);
  const [value, setValue] = useState2(startValue || { bucket: ['Equity'], ter: '0.7' });
  const [sort, setSort] = useState2('r3');
  const list = v2Sort(applyFilters(value), sort);
  const labels = filterLabels(value);

  const rail = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* WHAT IS APPLIED STAYS ON SCREEN WHILE THE ADVISOR WORKS — the thing a scrolling thread
          structurally cannot do, and the whole reason to prefer a sheet to a turn. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
        {labels.map((l) => <Pill key={l} tone="filter" size="sm" selected removable label={l} onClick={() => setValue({})} />)}
        {!labels.length && <Pill tone="filter" size="sm" label="No filters" />}
      </div>
      <SegmentedRow label="Sort by" options={V2_SORTS.map((s) => s.label)}
        value={(V2_SORTS.find((s) => s.key === sort) || V2_SORTS[0]).label}
        onChange={(lbl) => setSort((V2_SORTS.find((s) => s.label === lbl) || V2_SORTS[0]).key)} />
    </div>
  );

  return (
    <ScreenScaffold title="Sentinel" body="thread" onMenu={() => {}}
      composer={<Composer placeholder="Ask Sentinel" onAttach={() => {}} />}>
      <V2Thread said={said} closed={!open} count={list.length} />
      {open && <div aria-hidden="true" style={{ flexShrink: 0, height: SHEET_RESERVE[detent] }} />}
      <ExplorerSheet open={open} detent={detent} onDetentChange={setDetent} onClose={() => setOpen(false)}
        count={list.length} title={labels.join(' · ') || 'Everything on your shelf'} bottom={COMPOSER_BOX}
        rail={rail}
        summary={list.length === 0
          ? <SentinelText text="Nothing matches every filter. Drop one and I will widen the search." />
          : <SentinelText text={`${fundById(v2Sort(list, 'ter')[0].id).name} is the cheapest; ${fundById(v2Sort(list, 'r3')[0].id).name} has the best three-year record.`} />}>
        {list.length === 0 ? (
          <RejectCallout eyebrow="NOTHING MATCHES EVERY FILTER"
            body="Under 0.3% expense and very high risk do not meet on this shelf. Drop one and I will widen the search."
            chips={labels} onDropChip={() => setValue({})} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {list.map((f) => <FundRow key={f.id} id={f.id} compact />)}
          </div>
        )}
        <div style={{ marginTop: 'var(--space-8)' }}><Provenance text={explorerProvenance()} /></div>
      </ExplorerSheet>
    </ScreenScaffold>
  );
}

function App_V2() {
  return (
    <ScreenShell journey="Fund explorer" n="Variation 2" name="The explorer sheet over the live chat"
      job="A browse surface that rises over the thread on a funds query and never takes the composer. Three heights, each answering a different question; one artifact that mutates rather than a table re-sent per turn; and the filter state visible while the advisor works, which a scrolling thread cannot do."
      without="loses what they asked for the moment two more turns push it up the thread, and has to scroll back to read their own filters to a client.">

      <Section title="Live" sub="The sheet is open at half. Tap the grabber to step down — half → peek → gone — and the composer stays live the whole way. Change the sort in the rail at full; drop a chip and the count, the list and the sentence all follow, because all three are derived from one value.">
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}><PhoneFrame><V2 /></PhoneFrame></div>
      </Section>

      <Section title="Three heights, three questions"
        sub="peek answers 'how many?' and keeps almost all of the thread. half answers 'which ones?'. full answers 'narrow it' and is the only height that carries the rail. Google Maps' three states, measured — with what is behind alive at all three, and no scrim anywhere.">
        <StateRow>
          <State label="peek" note="The count and one sentence. The advisor can read the answer without giving up the conversation."><V2 startDetent="peek" /></State>
          <State label="half" note="The shortlist, in the sheet's own scroll region. Every row carries the peer line and who already holds it."><V2 startDetent="half" /></State>
          <State label="full" note="List plus rail. Carrying the rail is what full IS — the applied chips and the sort stay on screen while the advisor works."><V2 startDetent="full" /></State>
        </StateRow>
      </Section>

      <Section title="The composer is never covered, and that is structural"
        sub="The sheet's box stops at the composer's height, so there is no detent at which it can reach it. Not a caller's discipline — a prop the screen sets and the component honours. This is what the owner's ruling turned on: chrome that sits there unasked was removed in September; a surface the advisor summons, that always carries a dismiss and never takes the input, is a different thing.">
        <StateRow>
          <State label="Full height" note="86% of what is left after the composer. The last thread line is still readable above it."><V2 startDetent="full" /></State>
          <State label="Closed" tone="under" note="One short note stays in the thread for the record — the sentence and the count, never the whole table. Eight refinements leave one note, not eight tables."><V2 startOpen={false} /></State>
        </StateRow>
      </Section>

      <Section title="Nothing matches"
        sub="Under 0.3% expense and very high risk is a real contradiction on this shelf. The sheet stays open and says so — Redfin's recovery, which relaxes a criterion in place rather than dead-ending — and the peek summary says the same thing in one line.">
        <StateRow>
          <State label="Zero, at half" tone="over" note="The count on the sheet head, the callout in the body and the sentence in the thread agree, because one value drives all three."><V2 startDetent="half" startValue={{ ter: '0.3', risk: ['Very high'] }} said="under 0.3% expense, very high risk" /></State>
          <State label="Zero, at peek" tone="over" note="Even collapsed, the advisor knows the answer is nothing and why."><V2 startDetent="peek" startValue={{ ter: '0.3', risk: ['Very high'] }} said="under 0.3% expense, very high risk" /></State>
        </StateRow>
      </Section>

      <Note title="The risk this variation carries, stated plainly">
        No shipped product raises a browse sheet over a live chat with the composer working underneath.
        Each half is proven — Amazon Rufus inverts it, Google Maps gives the detents over a canvas,
        Spotify mutates one object inside a thread — but the seam is not. Two things could break it in
        a real hand: <strong>the drag on the sheet fighting the scroll on the thread at the same gesture
        origin</strong>, and <strong>an advisor mid-client-call losing the thread because a sheet rose
        over it</strong>. Neither shows in a render. A driven prototype in front of six to eight
        practising distributors settles both, and it should happen before this is built rather than after.
      </Note>
    </ScreenShell>
  );
}
/* The prototype page loads all three variation files to put their phones side by side, so each one
   publishes its component and mounts its own board ONLY when it is the page being opened. */
Object.assign(window, { V2 });
if (!window.__EXPLORER_PROTOTYPE) mountScreen(<App_V2 />);
