const { PhoneFrame } = window.DS;
/* The conversation is the only surface. There is no canvas branch and no product screens in this kit:
   Home, the thread, the risk journey, the drawer — the states a design system needs to show. Product
   screens (client review, proposal) live with the product, where they are kept current. */
function App() {
  const [screen, setScreen] = React.useState('home');
  const [seed, setSeed] = React.useState('');
  const [drawer, setDrawer] = React.useState(false);
  const openChat = (t) => { setSeed(t); setScreen('chat'); };
  const SEED = { proposal: 'Build a proposal for Mr. Amit Aggrawal', portfolio: 'What does Meera hold?', chat: 'Rebalance Sharma to his mandate' };
  const go = (where) => { setDrawer(false); if (where === 'journey') setScreen('journey'); else openChat(SEED[where] || where); };
  const submit = (t) => (/risk|profil|meera's risk/i.test(t) ? setScreen('journey') : openChat(t));
  const home = () => { setDrawer(false); setScreen('home'); };
  const menu = () => setDrawer(true);
  return (
    <PhoneFrame>
      <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
        <div key={screen} style={{ position: 'absolute', inset: 0, animation: screen === 'home' ? 'none' : 'kit-slide var(--dur-screen) var(--ease) both' }}>
          {screen === 'home' && <HomeScreen onMenu={menu} onSubmit={submit} onGo={go} />}
          {screen === 'chat' && <ChatScreen seed={seed} onMenu={menu} onNew={home} />}
          {screen === 'journey' && <JourneyScreen onMenu={menu} onNew={home} />}
        </div>
        <DrawerPanel open={drawer} onClose={() => setDrawer(false)} onNew={home} onGo={go} />
      </div>
    </PhoneFrame>
  );
}
/* Mount only when a page provides #root. This file is also compiled into _ds_bundle.js, which is loaded
   by pages that have no #root of their own — an unguarded createRoot(null) throws React #299 there. */
const appRoot = document.getElementById('root');
if (appRoot) ReactDOM.createRoot(appRoot).render(<App />);
