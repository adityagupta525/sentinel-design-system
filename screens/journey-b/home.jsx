/* The Home screen itself, so that every page which needs to draw Home draws the SAME Home — the
   drawer opens over it, and a hand-copied Home behind a scrim would drift from the real one within a
   week. Loaded by 01-home.html and by shell/drawer.html. */
const { ScreenBackdrop, StatusSpacer, TopBar, GreetingDivider, SuggestionRow, Dock, Composer,
        HomeIndicator } = window.SentinelDesignSystem_0682a2;

/* The three rows are BUILT FROM THE ADVISOR'S OWN BOOK. Named when it is there, capability-shaped when
   it is not — and the capability-shaped set is the base case, not the exception, which is why this
   screen has no loading state and no error state. Every row routes: checked by hand against the three
   intent patterns in docs/screens-source/src/lib/router.ts, which match on "risk profil", "propos"
   and "drift". Each of the six labels below contains one of them. */
const NAMED = [
  "Start Meera Nair's risk profile",
  'Build a proposal for Mr. Amit Aggrawal',
  "Why did Sharma's portfolio drift this quarter?",
];
const UNNAMED = [
  'Start a risk profile',
  'Build a proposal',
  "Explain a portfolio's drift",
];

function greetingFor(hour) {
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

function Home({ hour = 15, time = '3:04', advisor = 'Ashish', rows = NAMED, onMenu }) {
  const [value, setValue] = React.useState('');
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <ScreenBackdrop />
      <StatusSpacer time={time} />
      <TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={() => setValue('')} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 'var(--space-4)' }}>
        <GreetingDivider>{greetingFor(hour)}, {advisor}</GreetingDivider>
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '24px var(--gutter) 0' }}>
        <div style={{ width: '100%', boxSizing: 'border-box', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', padding: '0 var(--space-12)', boxShadow: 'var(--shadow-card-soft)' }}>
          {rows.map((s, i) => <SuggestionRow key={s} label={s} last={i === rows.length - 1} onClick={() => {}} />)}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* No chips row. Dock.d.ts calls that slot "Contextual AnswerChips"; on Home nothing has been
          said, so there is no context for it to carry. Composer and the standing disclosure only. */}
      <Dock composer={<Composer value={value} onChange={setValue} placeholder="Ask Sentinel about a client, a fund, or a plan" onSend={() => {}} />} />
      <HomeIndicator />
    </div>
  );
}

Object.assign(window, { Home, HOME_NAMED: NAMED, HOME_UNNAMED: UNNAMED, greetingFor });
