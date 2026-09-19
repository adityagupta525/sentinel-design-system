/* The thread shell, shared by every screen of the journey that is a conversation — screens 2 to 5 and
   7. One file so the five do not drift into five slightly different threads.

   No top-level destructuring on purpose. Every .jsx a page loads compiles into ONE scope, so
   `const { Dock } = …` here and the same line in home.jsx would be a redeclaration and the page would
   render nothing. A single uniquely-named const, read through in JSX, cannot collide. */
const THREAD_DS = window.SentinelDesignSystem_0682a2;

/* The thread carries the scroll — never a card inside it, and never a second scroller. */
/* scrollRef: the live prototype owns the two thread scrolls ArtifactCard's contract assigns to the
   caller — header under the app bar on expand, back to the card on collapse — and needs the scroller. */
/* `banner` is pinned BETWEEN the app bar and the thread — the one slot in this shell that does not
   scroll, and the only thing that belongs in it is a state the whole thread is in: a journey paused
   behind the conversation (`DetourBanner`). It is deliberately not a place for what a message offered;
   that is inside the turn (contradiction 60). */
function Thread({ time = '3:04', children, composer, banner, onMenu, onNew, scrollRef, revision = 0, anchor = 'newest' }) {
  /* WHERE A THREAD RESTS. On mount, and whenever the caller says the turns changed (`revision`):
       'newest'  — the newest turn STARTS on screen; if it also fits, it ends on screen too (scroll to
                   the bottom). Measured on screen 3: the answer turn is ~500pt in a 462pt thread, so
                   sticking to the bottom scrolled the sentence off while it was being read, and when the
                   artifact arrived 900ms later it did it again. The rule keeps the first line where the
                   eye already is; the advisor scrolls to the card. The archive's useStickyScroll always
                   went to the bottom, and had the same problem.
       'bottom'  — the end of the thread, for a specimen of a thread that has been read.
       a number  — that turn at the top, for a specimen of a turn re-opened in place.
       a ref     — that ELEMENT at the top, which is what ArtifactCard's contract asks for on expand:
                   "bring the card's header just under the app bar". Anchoring the turn is not the same
                   thing — measured on screen 4, the card sits 291pt inside its own turn, so the turn at
                   the top leaves the card below the fold.
     It fires only on `revision`, never on every render, so the caller's own two scrolls (ArtifactCard's
     expand / collapse contract) are not fought. */
  const own = React.useRef(null);
  const el = () => (scrollRef ? scrollRef.current : own.current);
  React.useLayoutEffect(() => {
    const e = el(); if (!e) return;
    const col = e.firstElementChild; const kids = col ? Array.from(col.children) : [];
    const pad = col ? parseFloat(getComputedStyle(col).paddingTop) || 0 : 0;
    const target = anchor && anchor.current ? anchor.current
      : typeof anchor === 'number' ? kids[anchor]
      : anchor === 'newest' ? kids[kids.length - 1] : null;
    if (!target || (anchor === 'newest' && target.offsetHeight <= e.clientHeight - pad)) { e.scrollTop = e.scrollHeight; return; }
    /* Rect-based, not offsetTop: the target may be nested inside a turn rather than be one. */
    e.scrollTop = Math.max(0, e.scrollTop + (target.getBoundingClientRect().top - e.getBoundingClientRect().top) - pad);
  }, [revision, anchor]);
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
      <THREAD_DS.ScreenBackdrop />
      <THREAD_DS.StatusSpacer time={time} />
      <THREAD_DS.TopBar title="Sentinel" onMenu={onMenu || (() => {})} onNew={onNew || (() => {})} />
      {banner && <div style={{ position: 'relative', zIndex: 1, paddingBottom: 'var(--space-8)' }}>{banner}</div>}
      <div ref={scrollRef || own} style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--stack)', padding: '16px var(--gutter) 24px' }}>
          {children}
        </div>
      </div>
      {/* The Dock carries the composer and nothing else: `chips` and `cta` are deprecated (contradiction
          60) and no screen passes them, so the shell does not offer them either — a prop with nothing
          behind it is how a deprecated pattern quietly returns. */}
      <THREAD_DS.Dock composer={composer} />
      <THREAD_DS.HomeIndicator />
    </div>
  );
}

/* THE ADVISOR'S LAST PROMPT IS ALWAYS EDITABLE — and it is one component so it cannot be forgotten.

   The owner, 19 Sep: "jaise user jo last apna prompt edit karne ka option ho — wo missing hai,
   consistency nei hai." It was built on the answer screen and nowhere else, because every page rendered
   its own `UserBubble` and each one had to remember. A rule that every page has to remember is a rule
   that half the pages break, so the rule is a component now: `AskTurn` is the only way a screen renders
   what the advisor said.

   WHERE IT IS VALID, from the advisor's side:
     · A finished turn — yes. Edit replaces what came after it, and `costNote` says so before it happens.
     · A turn still running — no, and not silently: Stop is right there in the send slot, and it is the
       honest control for "I did not mean that". Edit returns the moment the turn finishes.
     · A journey ANSWER — yes, and it costs more: MessageActions' own contract says edit there "must warn
       what it costs (Editing this reopens question 7. The four answers after it will be asked again.)".
       Same component, same gesture, a bigger `costNote`.
     · A file the advisor attached — no. A file is not a sentence to re-word; it is removed and replaced,
       which is what FileUpload's own Remove is for.
   Home has no prompt at all, so it has no AskTurn — that is not an exception, there is simply nothing
   there to edit yet. */
function AskTurn({ text, editable = true, busy = false, costNote, onSave, onCancel, actions = true }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(text);
  React.useEffect(() => { if (!editing) setDraft(text); }, [text, editing]);
  const cancel = () => { setDraft(text); setEditing(false); onCancel && onCancel(); };
  const save = () => { setEditing(false); onSave && onSave(draft); };
  return (
    <>
      <THREAD_DS.UserBubble text={editing ? draft : text} editing={editing} onChange={setDraft}
        onCancel={cancel} onSave={save} costNote={costNote} />
      {actions && editable && !busy && !editing && (
        <THREAD_DS.MessageActions role="user" onAction={(a) => a === 'edit' && setEditing(true)} />
      )}
    </>
  );
}

/* THE PAPERCLIP IS REAL ON EVERY SCREEN, AND WHAT IT PRODUCES IS HONEST.

   The owner, 19 Sep: "attachment demo nei real hona chahiye har screen par, and output and prompt ke
   saath." Three of the four thread screens passed `onAttach={() => {}}` — a picker that opens and drops
   the file on the floor, which is a demo wearing a control's clothes. `useAttachment` gives every screen
   the same real one in one line.

   THE HONEST PART. The designed specimen (Sharma's Q3 statement) has a designed output: three stages and
   "14 pages · 18 holdings". A file the VIEWER picks has no such output — this is a rendered specimen, not
   the product, and nothing here parses a PDF. Printing "18 holdings" over someone's own file would be a
   fabricated figure, which is the one thing these screens never do. So a picked file shows its REAL name
   and size, its stages sit pending, and a ParseNote says plainly that the prototype does not read it.
   The control is real; the claim is not made. */
function useAttachment() {
  const [file, setFile] = React.useState(null);
  return {
    file,
    clear: () => setFile(null),
    onAttach: (f) => setFile({ name: f.name, meta: `${Math.max(1, Math.round(f.size / 1024))} KB · just now`, picked: true }),
  };
}

const PARSE_DONE = [
  { label: 'Read the file', state: 'done', meta: '14 pages' },
  { label: 'Found the holdings', state: 'done', meta: '18 funds' },
  { label: 'Checked them against his mandate', state: 'done', meta: '3 outside it' },
];
const PARSE_PENDING = PARSE_DONE.map((x) => ({ label: x.label, state: 'pending' }));

/* A file is a message from the ADVISOR: it lands at the end of the thread, on their side, capped like
   their bubble. The caption above it is theirs too — and it is NOT editable, because a file is not a
   sentence to re-word; it is removed and replaced, which is FileUpload's own Remove. */
function AttachedTurn({ file, caption = 'Here is his Q3 statement.', onRemove }) {
  if (!file) return null;
  return (
    <>
      <THREAD_DS.UserBubble text={caption} />
      <THREAD_DS.FileUpload file={file} stages={file.picked ? PARSE_PENDING : PARSE_DONE}
        state={file.picked ? 'parsing' : 'done'}
        summary={file.picked ? undefined : 'Read his Q3 statement · 14 pages · 18 holdings'}
        onRemove={onRemove} />
      {file.picked && <THREAD_DS.ParseNote text="This specimen does not read the file you picked — in the product these stages fill in and name what was found." />}
    </>
  );
}

Object.assign(window, { Thread, AskTurn, useAttachment, AttachedTurn, PARSE_DONE });
