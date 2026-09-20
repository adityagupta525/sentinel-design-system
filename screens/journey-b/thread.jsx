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
/* The shell itself is ScreenScaffold's now (20 Sep 2026) — the nineteen lines that used to be here
   were the same nineteen in rail.jsx, and the rail's copy had lost the scroll rule below. What stays
   here is what is the THREAD's rather than the phone's: the default clock, and the fact that the
   thread passes no chips to the Dock (`chips` and `cta` are deprecated, contradiction 60). */
function Thread({ time = '3:04', children, composer, banner, onMenu, onNew, scrollRef, revision = 0, anchor = 'newest' }) {
  return (
    <THREAD_DS.ScreenScaffold time={time} banner={banner} onMenu={onMenu} onNew={onNew}
      scrollRef={scrollRef} revision={revision} anchor={anchor} composer={composer}>
      {children}
    </THREAD_DS.ScreenScaffold>
  );
}

/* THE ADVISOR'S LAST PROMPT IS ALWAYS EDITABLE — and it is one component so it cannot be forgotten.

   The owner, 19 Sep: "jaise user jo last apna prompt edit karne ka option ho — wo missing hai,
   consistency nei hai." It was built on the answer screen and nowhere else, because every page rendered
   its own `UserBubble` and each one had to remember. A rule that every page has to remember is a rule
   that half the pages break, so the rule is a component now: `UserTurn` is the only way a screen renders
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
   Home has no prompt at all, so it has no UserTurn — that is not an exception, there is simply nothing
   there to edit yet. */
/* `UserTurn` AND `AttachmentTurn` WERE HERE AND ARE NOW THE SYSTEM'S (20 Sep 2026, the owner: anything
   built on a screen that belongs in the design system goes into the design system). They are
   `UserTurn` and `AttachmentTurn` — neither read the book, neither was journey-specific, and every
   journey in the product used the same twelve and ten lines of them. What stays here is what is
   genuinely this thread's: the attachment STATE, and this product's own parse stages. */
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
Object.assign(window, { Thread, useAttachment, PARSE_DONE, PARSE_PENDING });
