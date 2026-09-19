/* The menu's data and footer, shared by shell/drawer.html and journey-b/prototype.html so the two
   draw the SAME menu. The Drawer itself is the system's (shell/Drawer); this file only carries what
   this advisor's menu contains.

   No top-level destructuring: every .jsx a page loads compiles into ONE scope, and home.jsx already
   declares Composer, Dock and the rest. One uniquely-named const cannot collide. */
const MENU_DS = window.SentinelDesignSystem_0682a2;

const MENU_SAVED = [
  { title: "Meera Nair's risk profile", meta: '12 questions' },
  { title: '₹25 L proposal', meta: '6 funds' },
  { title: 'What Meera holds', meta: '43 funds' },
  { title: "Sharma's rebalance", meta: '2 moves' },
  { title: "Sunita Nair's Q2 review", meta: '31 funds' },
];
/* One line, both facts: the client is the TITLE, the topic is the META. Measured on 18 Sep: the two in
   one string needed 226pt where a 300pt drawer gives 153; two lines fixed that at 72pt a row and made
   the drawer long; this is the third try and the one that is both. The timestamp was dropped on
   purpose — three facts do not fit 244pt, and the topic is the one that picks the right thread. */
const MENU_RECENT = [['R. Sharma','Portfolio drift'],['Mr. Amit Aggrawal','Proposal draft'],['HDFC Diwali offer','AMC circular'],['Meera Nair','Q3 review'],
  ['Sunita Nair','Exit load'],['Meera Nair','SIP change'],['R. Sharma','Mandate note'],['HDFC AMC','NFO circular'],['Mr. Amit Aggrawal','KYC']].map(([t, m]) => ({ title: t, meta: m }));
const menuInitials = (n) => n.replace(/^Mr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2);
const menuClient = (name) => ({ title: name, leading: 'avatar', leadingContent: menuInitials(name), trailing: 'chevron' });
/* The book, not a second list of names — screens/data/book.jsx is where a client is written down. */
const MENU_CLIENTS = CLIENTS.map((c) => menuClient(c.name));
const MENU_CLIENTS_LONG = ['Ramasubramanian Venkataraghavan', 'Mr. Amit Aggrawal', 'Sunita Nair'].map(menuClient);

/* "Back to home" and the one-theme control. SegmentedRow is the system's; the row is locked because no
   token carries a dark value yet, and the caption says so rather than a dead button. */
/* One string, one control — the drawer's page used to draw a second copy of this row for its "light and
   dark" section, and two copies of a caption drift. */
const MenuFooterTheme = () => (
  <MENU_DS.SegmentedRow label="Appearance" options={['Light', 'Dark']} value="Light" locked lockedNote="One theme so far. Dark is coming." />
);
const MenuFooter = ({ onHome }) => (
  <>
    <MENU_DS.Pressable onClick={onHome || (() => {})} label="Back to home" style={{ display: 'flex', minHeight: 'var(--h-row-lg)', width: '100%', alignItems: 'center', boxSizing: 'border-box' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', color: 'var(--color-bronze-deep)' }}>‹ Back to home</span>
    </MENU_DS.Pressable>
    {/* THE SAME ROW, NOT A SECOND COPY OF IT (20 Sep 2026). This inlined SegmentedRow with the same
        five props as MenuFooterTheme above — which is exactly what the comment above it says the
        drawer's page used to do, moved one file inwards. drawer.html:117 renders MenuFooterTheme;
        this rendered its twin. Two copies of a caption drift. */}
    <MenuFooterTheme />
  </>
);

Object.assign(window, { MENU_SAVED, MENU_RECENT, MENU_CLIENTS, MENU_CLIENTS_LONG, MenuFooter, MenuFooterTheme });
