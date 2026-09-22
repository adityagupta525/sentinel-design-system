/* VARIATION 3 — THE AUDITABLE SHELF. Change what a sentence PRODUCES, not where the advisor stands.

   This variation is built on the largest finding in the research, which neither of the other two is
   centred on: the biggest theme across 231 mined verbatims is not people who got NO recommendation —
   it is people who GOT one and did not trust it (29 verbatims, severity 4, the top of the ranked list,
   and the low point of the journey map is Decide rather than Search). So the stakeholder's
   "recommendation nahi aa raha" is the wrong diagnosis of a real problem. Answering it with a louder
   "Recommended for you" reproduces the complaint — and an AMFI-registered distributor may not display
   an auto-ranked list anyway.

   WHAT REPLACES IT: a shortlist that shows its work and stays put. Named by the advisor, dated,
   versioned, tied to a client, carrying the filters that produced it on its face and a peer line on
   every row. Every serious advisor tool has this durable object and Sentinel had none — Tickertape
   saves a screen with a note, Wealthy Select is a monthly playbook, NJ ships a Recommended Portfolio.

   ENTRY IS UNCHANGED, DELIBERATELY. No new funnel, no new surface: the composer, the same router
   bucket, the same parsed chips. The one new place is a section in the Drawer where saved shortlists
   live, because a thing you keep needs somewhere to be kept.

   THE SCORE IS NOT THE TRUST MECHANISM, and cannot be until compliance rules on it: a proprietary
   ranking is a research report needing a registered owner and a published methodology, and Sentinel's
   weights are invented with PLACEHOLDER on the card twice. Peer context and provenance carry the
   burden instead — both are factual comparisons, and neither waits on that answer. */

const { useState: useState3 } = React;

const SHELF_FILTERS = ['Flexi cap', 'Under 0.7%', 'On your shelf'];
const SHELF_IDS = ['ppfas-flexi', 'hdfc-flexi'];

function ShelfThread({ mode = 'mfd', stale = false, saved = true }) {
  return (
    <React.Fragment>
      <UserBubble text="flexi cap under 0.7% for Sharma" />
      <div style={{ marginTop: 'var(--space-12)' }}>
        <SentinelBlock>
          <SentinelText text={mode === 'ria'
            ? 'Two funds match, and both suit his profile on file. I have recorded why.'
            : 'Two funds match your filters. Saved as a shortlist you can come back to.'} />
          <div style={{ marginTop: 'var(--space-12)' }}>
            <ShortlistCard
              name="Sharma — flexi cap" client="R. Sharma" count={SHELF_IDS.length}
              savedAt={saved ? '22 Sep' : undefined} version={saved ? 2 : 1} filters={SHELF_FILTERS}
              stale={stale ? { text: 'HDFC Flexi Cap changed category on 26 Feb.' } : null}
              onOpen={() => {}} onRefresh={stale ? () => {} : undefined}>
              {SHELF_IDS.map((id) => <FundRow key={id} id={id} compact />)}
            </ShortlistCard>
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}>
            {/* THE COPY IS THE MODE. Distributor: "match your filters", never "recommended". Adviser:
                a suggestion is allowed, and only once the suitability record exists. */}
            <Provenance text={mode === 'ria'
              ? `Suggested for R. Sharma · suitability on file 11 Feb 2026 · generated with AI assistance, reviewed by ${ADVISOR.name}`
              : explorerProvenance()} />
          </div>
        </SentinelBlock>
      </div>
    </React.Fragment>
  );
}

function V3({ mode = 'mfd', stale = false, saved = true, drawer = false }) {
  const [open, setOpen] = useState3(drawer);
  return (
    <React.Fragment>
      <ScreenScaffold title="Sentinel" body="thread" onMenu={() => setOpen(true)}
        composer={<Composer placeholder="Ask Sentinel" onAttach={() => {}} />}>
        <ShelfThread mode={mode} stale={stale} saved={saved} />
      </ScreenScaffold>
      {/* The one new place in the product: a thing you keep needs somewhere to be kept. The Drawer
          already has a `saved` section, so this is a row in an existing surface, not a new one. */}
      <Drawer open={open} onClose={() => setOpen(false)} onNew={() => {}}
        saved={[
          { title: 'Sharma — flexi cap', subtitle: '2 funds · 22 Sep · v2' },
          { title: 'Short duration cash', subtitle: '4 funds · 12 Aug · v3 · one moved' },
          { title: 'Nobody holds it yet', subtitle: '4 funds · 19 Sep' },
        ]}
        recent={[{ title: "Meera's review", subtitle: 'Yesterday' }]}
        clients={[{ title: 'R. Sharma', subtitle: '9 funds' }]} />
    </React.Fragment>
  );
}

function App_V3() {
  return (
    <ScreenShell journey="Fund explorer" n="Variation 3" name="The auditable shelf"
      job="Change what a sentence produces rather than where the advisor stands. The shortlist becomes a named, dated, versioned object tied to a client, carrying the filters that made it and a peer line on every row — and it survives the thread, in a section of the Drawer. Entry, composer and router are untouched."
      without="gets a fresh table every turn that dies with the conversation, so an eight-turn session leaves eight stale tables and nothing to return to — which is what '2–3 funds, bas' was actually describing.">

      <Section title="Live" sub="The shortlist arrives named and saved, with its filters on its face and a peer line under every fund. Open the menu to see where it is kept.">
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}><PhoneFrame><V3 /></PhoneFrame></div>
      </Section>

      <Section title="What the card carries, and why each part is there"
        sub="The name the ADVISOR gave it, so next week it still means something. The count, the client, the date and the version, because every one of those is a thing they get asked. The filters, because an advisor reads them aloud to a client and Google AI Mode's invisible filter state is the anti-pattern the whole product is built against. And the peer line on every row, because a fund shown alone is a number.">
        <StateRow>
          <State label="Saved" note="v2 — it has been re-run once since it was first made."><V3 /></State>
          <State label="Not yet saved" note="A first shortlist carries no version; 'v1' on a first save is noise."><V3 saved={false} /></State>
        </StateRow>
      </Section>

      <Section title="Stale is a sentence, not a dot"
        sub="A saved list whose data has moved says WHAT moved and offers to re-run. A coloured dot would say something is wrong; nothing is wrong, the world moved — and colour never encodes in this system. The re-run is the advisor's call: a list that changed silently between opening it and reading it aloud is the defect the card exists to prevent.">
        <StateRow>
          <State label="Stale" tone="over" note="Rule 2's shape — text on the peach surface with the offer beside it, never a badge and never an automatic refresh."><V3 stale /></State>
        </StateRow>
      </Section>

      <Section title="Where it is kept"
        sub="The one new place this variation asks for: a Saved section in the Drawer, beside Recent and Clients. No funnel, no browse canvas, no sixth surface — a thing you keep needs somewhere to be kept, and the Drawer already had the shelf for it.">
        <StateRow>
          <State label="Drawer" note="Each row says how many, when, which version, and whether anything moved — enough to choose without opening."><V3 drawer /></State>
        </StateRow>
      </Section>

      <Section title="The same object, two registrations"
        sub="A client is either advisory or distribution within the group, never both, so this is a per-client mode rather than a setting. The data underneath is identical; the copy and the CTA are not — and the distributor version never uses the word the regulation reserves.">
        <StateRow>
          <State label="Distributor" note="'Two funds match your filters.' Regular plan, no auto-ranking, no 'recommended'. The provenance line is the data's."><V3 mode="mfd" /></State>
          <State label="Adviser" tone="under" note="'Suggested for R. Sharma', allowed only once the suitability record exists — and the AI-use disclosure the adviser regulation requires is on the card, not in a footer."><V3 mode="ria" /></State>
        </StateRow>
      </Section>

      <Note title="What this variation is honest about">
        It changes the <strong>object model</strong>, not the surface — so at a glance it reads like the
        thread the product already has, and the saved card has to carry the difference on its own face.
        That is its real risk and the first thing to test. It is also the variation that needs the least
        new data: everything on the card is already in the book. And a shortlist that survives sessions
        and re-runs its filters on a cadence is new product <em>behaviour</em>, closer to a data-layer
        commitment than a screen — which is a cost worth naming before it is chosen, not after.
      </Note>
    </ScreenShell>
  );
}
/* The prototype page loads all three variation files to put their phones side by side, so each one
   publishes its component and mounts its own board ONLY when it is the page being opened. */
Object.assign(window, { V3 });
if (!window.__EXPLORER_PROTOTYPE) mountScreen(<App_V3 />);
