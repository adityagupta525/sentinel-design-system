/* THE THREE VARIATIONS, SIDE BY SIDE AND ALL THREE DRIVEABLE.

   The boards next door are the argument — every state, with the reasoning under each phone. This page
   is the other thing an owner needs and a board cannot give: three live phones on one screen, so the
   choice is made by DRIVING them rather than by reading about them.

   Nothing here is a mock. Each phone is the same component the board renders, with its own state, so
   what happens in one does not touch the others and every number comes from `book.jsx`. If a variation
   is worse to use than it is to look at, this is where that shows. */

function Col({ n, name, one, what, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 375 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 92 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze-deep)' }}>Variation {n}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 17, color: 'var(--color-ink)' }}>{name}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, lineHeight: '18px', color: 'var(--color-ink-soft)' }}>{one}</span>
      </div>
      <PhoneFrame>{children}</PhoneFrame>
      <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: '17px', color: 'var(--color-muted)', width: 375 }}>
        <strong style={{ fontWeight: 600, color: 'var(--color-ink-soft)' }}>Try this. </strong>{what}
      </p>
    </div>
  );
}

function App() {
  return (
    <ScreenShell journey="Fund explorer" n="Prototype" name="Drive all three"
      job="The same shelf, the same ten funds and the same reverse lookup, reached three ways. Every phone below is live and independent — drive them, do not read them. The boards carry the states and the reasoning; this page carries the choice."
      without="picks a variation from a picture, which is how the last explorer was picked.">

      <Section title="Three live phones" sub="Each one holds its own state. Reload the page to put all three back to the start.">
        <div style={{ display: 'flex', gap: 34, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Col n="1" name="The guided journey" one="A structure you can walk and point at in front of a client."
            what="Tap Mutual funds, then Flexi cap. Change the sort. Open Filters and move the expense band — the count on the button follows. Then open a fund and use the strip at the top of its page.">
            <V1 />
          </Col>
          <Col n="2" name="The sheet over the live chat" one="A browse surface that rises on a funds query and never takes the composer."
            what="Tap the grabber at the top of the sheet to step down — half, peek, gone. At full, drop a chip in the rail or change the sort. The composer stays live at every height; the thread above stays readable.">
            <V2 />
          </Col>
          <Col n="3" name="The auditable shelf" one="The shortlist becomes a thing you keep, not a message that scrolls away."
            what="Read the card: its name, its client, its date, its version, its filters, and a peer line under every fund. Open the menu to see where it is kept alongside the others.">
            <V3 />
          </Col>
        </div>
      </Section>

      <Section title="What to watch for while you drive"
        sub="These are the three places the research says a fund explorer fails, and they are the questions this prototype exists to answer.">
        <Table rows={[
          ['Can you say WHY a fund is on screen?', 'Every row in all three carries its peer line and who already holds it. If a variation still reads as numbers thrown at you, that is the finding.'],
          ['Can you read your own filters aloud?', 'V1 puts the path on the list head. V2 keeps it in the rail while you work. V3 prints it on the saved card. Whichever you cannot read to a client is the weak one.'],
          ['Where does yesterday go?', 'V1 and V2 both lose the shortlist when the thread moves on. Only V3 keeps it. Decide whether that matters before you choose on looks.'],
        ]} head={['The question', 'What to look for']} />
      </Section>

      <Note title="What this prototype is not">
        It is <strong>mutual funds only</strong>, because bonds, PMS, AIF, GIFT City and unlisted have no
        rows in the book — V1's tiles say so in words rather than showing a zero. Every return, expense
        and holding is a design fixture the book labels as invented; the provenance line on each surface
        says so rather than claiming a scheme record. And V2's mechanic — a browse sheet over a live chat
        with the composer working underneath — <strong>has no incumbent anywhere</strong>, so driving it
        here on a trackpad is the cheapest test, not the real one: the real one is a thumb, mid-call.
      </Note>
    </ScreenShell>
  );
}
mountScreen(<App />);
