/* The Home screen itself, so that every page which needs to draw Home draws the SAME Home — the
   drawer opens over it, and a hand-copied Home behind a scrim would drift from the real one within a
   week. Loaded by 01-home.html and by shell/drawer.html. */
const { ScreenBackdrop, StatusSpacer, TopBar, GreetingDivider, SuggestionRow, Dock, Composer,
        Pill, ChipRow, HomeIndicator } = window.SentinelDesignSystem_0682a2;

/* TWO LISTS, TWO JOBS — and the difference is what stops them being the same list twice.

   READY PROMPTS (the card under the greeting) are the advisor's OWN BOOK, written out as whole
   sentences they can send as they stand: a named client, a piece of work already waiting. Tap one and
   Sentinel answers about that person.

   STARTERS (the chips above the composer) are CAPABILITIES with no client attached: tap one and the
   thread asks which client — the same disambiguation the router already does in reverse when a name
   arrives without an intent.

   So "Build a proposal for Mr. Amit Aggrawal" and "Build proposal" are not one thing said twice: the
   first is this proposal, the second is a proposal. When the book is unavailable the card is omitted
   ENTIRELY rather than falling back to capability-shaped rows, because that fallback WOULD be the
   chips again, one card higher up.

   Every label routes: checked by hand against the three intent patterns in
   docs/screens-source/src/lib/router.ts, which match on "risk profil", "propos" and "drift". */
const NAMED = [
  "Start Meera Nair's risk profile",
  'Build a proposal for Mr. Amit Aggrawal',
  "Why did Sharma's portfolio drift this quarter?",
];
const STARTERS = ['Build proposal', 'Review portfolio', 'Fund explorer'];

function greetingFor(hour) {
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

/* onRow / onStarter / onSend exist for the live prototype, which has to know what was tapped. The
   frozen pages pass nothing and the rows stay inert, as before. */
function Home({ hour = 15, time = '3:04', advisor = 'Ashish', rows = NAMED, onMenu, onRow, onStarter, onSend }) {
  const [value, setValue] = React.useState('');
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <ScreenBackdrop />
      <StatusSpacer time={time} />
      <TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={() => setValue('')} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 'var(--space-4)' }}>
        <GreetingDivider>{greetingFor(hour)}, {advisor}</GreetingDivider>
      </div>

      {/* The ready prompts. Omitted, not emptied, when there is no book to draw them from. */}
      {rows.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, padding: '24px var(--gutter) 0' }}>
          <div style={{ width: '100%', boxSizing: 'border-box', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', padding: '0 var(--space-12)', boxShadow: 'var(--shadow-card-soft)' }}>
            {rows.map((s, i) => <SuggestionRow key={s} label={s} last={i === rows.length - 1} onClick={() => onRow && onRow(s)} />)}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* The starters sit in the Dock's chips slot, directly above the composer. Correcting my own
          earlier argument for taking them out: I read "Contextual AnswerChips" in Dock.d.ts as meaning
          only follow-ups to something Sentinel had just said. The slot is chips above the composer;
          on Home the context is the advisor having asked nothing yet, and a starter is what that
          context calls for. The duplication objection was the real one, and the two-lists split above
          is what answers it. */}
      <Dock
        chips={<ChipRow>{STARTERS.map((c) => <Pill key={c} label={c} onClick={() => onStarter && onStarter(c)} />)}</ChipRow>}
        composer={<Composer value={value} onChange={setValue} placeholder="Ask Sentinel about a client, a fund, or a plan" onSend={() => { if (onSend && value.trim()) { onSend(value.trim()); setValue(''); } }} />} />
      <HomeIndicator />
    </div>
  );
}

Object.assign(window, { Home, HOME_NAMED: NAMED, HOME_STARTERS: STARTERS, greetingFor });
