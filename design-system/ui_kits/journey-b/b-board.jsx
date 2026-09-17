/* Screens are resolved from window at RENDER time, not at module-evaluation time. b-screens.jsx registers
   them (Object.assign(window, {B01…})), and the bundle compiles files alphabetically — b-board before
   b-screens — so a top-level reference to B01 here throws "B01 is not defined" in the bundle. */
const BOARD = [
  ['B / 01 Home', 'Default. Three suggestion rows restored verbatim — external, generative, diagnostic.', 'B01'],
  ['B / 02 Query', 'Thread bottom-anchored; the sentence stays editable in the composer.', 'B02'],
  ['B / 03 Trace', 'Steps name real work. Stop sits in the send slot — the composer never leaves.', 'B03'],
  ['B / 04 Filling in', 'Trace collapsed to "Thought for 4s"; the card fills in with live row labels.', 'B04'],
  ['B / 05 Artifact', 'The result as an object in the thread: 96px preview, three-slot footer, provenance.', 'B05'],
  ['B / 06 Expanded', 'The artifact expanded in place: its own header row with ⋯, Collapse ⌃, and the thread carrying the scroll.', 'B06'],
  ['B / 07 Follow-up', 'A follow-up while the card stays expanded: the thread scrolls past it, so only its foot is in view.', 'B07'],
  ['B / 08 Rebalance', 'Two moves and what they cost. CTA stacks above the composer.', 'B08'],
  ['B / 09 Confirm', 'Modal, so it keeps the scrim. Disclosure above the numbers; compliance as rows.', 'B09'],
  ['B / 10 Success', 'Drawn check, timestamp, settlement line. No confetti.', 'B10'],
  ['B / 11 Share', 'Where Share goes: the message draft as an expanded artifact in the thread, disclosure locked above the body.', 'B11'],
];
function App() {
  return <div className="board">{BOARD.map(([name, sub, key]) => { const S = window[key]; return <Artboard key={name} name={name} sub={sub}>{S ? <S /> : null}</Artboard>; })}</div>;
}
/* Mount only when a page provides #root. This file is also compiled into _ds_bundle.js, which is loaded
   by pages that have no #root of their own — an unguarded createRoot(null) throws React #299 there. */
const bRoot = document.getElementById('root');
if (bRoot) ReactDOM.createRoot(bRoot).render(<App />);
