# Sentinel v5 — Six corrections, the canvas removal, and the graphs ruling

Supersedes the canvas parts of v2 §2.2 and the sheet/canvas scrim rule. Read Part 1 first: correction 2 removes a whole surface from the product, and several of the team's requested components sit inside screens that change because of it.

---

## Part 0 — The binding is a snapshot, not a link

The journey project holds a copied bundle, not a live reference. Three component fixes landed in the system and none reached the project on its own.

Two consequences, and the second is the dangerous one.

**Every system change needs a manual refresh in the project.** Until the binding itself can be changed, each project pass begins with a bundle refresh and reports the evidence — the component default that changed, read back from the project's own copy.

**Hand-typed overrides hide the problem.** The one-line disclosure currently renders correctly on every artboard only because the string was typed into each `text=` attribute. The component's own default is still the old two-line sentence. That is worse than a visibly stale copy, because the screens look current while the system underneath is not, and the next person to change that component will see nothing change on screen.

So the refresh has a second half: **remove every hand-typed override that exists only to paper over a stale bundle**, and let the component default show through. If a screen then renders the old string, that is the correct, honest signal that the refresh did not work.

Whether the reference can be made a live link is a question for the Claude Design UI, not for an agent inside the project. Check for a sync or update-library control on the project's design-system setting.

---

## Part 1 — Correction 2 and 3: the canvas is removed

**There is no `Back to chat`, because there is nowhere to go back from.** The conversation is the only surface. An artifact expands and collapses in place, in the thread.

This is the right call and it simplifies the product. It also deletes things.

### 1.1 What goes

- The `A2` artifact canvas as a separate surface.
- The `‹ Back to chat` pill in the header slot.
- The canvas's own header title and `⋯` — both move onto the card.
- **The sheet/canvas scrim rule**, which no longer has two cases. Only sheets have scrims. Amend the readme; the rule was correct when a canvas existed.

### 1.2 What replaces it — `ArtifactCard` gains an expanded state

```ts
type ArtifactState = 'collapsed' | 'expanded' | 'filling'

ArtifactCard: {
  state: ArtifactState
  eyebrow: string
  title: string
  provenance: string
  children: ReactNode          // the chart, table or draft
  actions?: ReactNode          // the three-slot footer
  onToggle: () => void
}
```

`collapsed` — the 96 pt preview and the three-slot footer, unchanged. The footer's first slot becomes **`Expand ⌄`** rather than `Open ›`, and its chevron rotates 180° on expand. That is the standard disclosure affordance and it is what "expand and collapse on the same screen" means.

`expanded` — the card grows to its natural height in the thread, pushing later turns down. Title and `⋯` sit in the card's own header row. The footer's first slot reads `Collapse ⌃`.

`filling` — unchanged, skeleton-first.

### 1.3 The one rule that decides whether this feels good: no nested scroll

An expanded card takes whatever height its content needs and **the thread carries the scroll.** Do not give the card its own internal scroll. A scrolling card inside a scrolling thread is the single most disliked pattern on mobile, and it is exactly what the old canvas avoided by being full-bleed.

Two behaviours that follow:

- On expand, scroll the thread so the card's **header** sits just below the app bar. The advisor starts at the top of the thing they opened.
- On collapse, scroll back to the card's position so they are not stranded three screens down in older turns.

### 1.4 The composer during all of this

Docked, always, unchanged. Its placeholder becomes `Ask about this` while a card is expanded, and returns to `Ask Sentinel` on collapse — the context-keyed map already handles that. The dock's three rows behave exactly as before.

The placement law simplifies, which is a gain: there are now two contexts, not three. Dock pills act on the current state and persist; inline pills belong to one message. Nothing is "in a canvas" any more.

---

## Part 2 — Correction 1: `JUMP BACK IN` moves into the drawer

Home returns to the three capability rows and its empty space. The four in-progress journeys move behind `☰`, under a `SAVED WORK` eyebrow, and connect from there.

**The cost is discoverability, and it needs one mitigation.** A new advisor will not guess that unfinished work lives behind a hamburger. Put a **count on the `☰` glyph** when work is in progress — a small numeral or a dot in the existing bronze, no new token. `☰` with a 4 next to it is a standard, cheap signal and it is the whole reason this move is safe.

The drawer's own composer stays, per the law.

---

## Part 3 — Correction 4: the back pill, kept and repurposed

Corrections 2 and 3 remove the surface the back pill lived on, so the screen-covering problem disappears with it. The treatment itself is worth keeping, and there are two places that still need it.

**The detour resume pill** — `‹ Back to question 7 of 12`. This is the best use of that treatment in the whole product: it is the moment the advisor is told their place was held.

**Sheet dismiss** — explainer and confirm sheets need a way out. The same pill, left-aligned in the sheet's header row.

If the header version is still wanted anywhere, the fix for its width is to reduce it to the glyph in a 44 pt circular target matching `☰`, with the label appearing only on press. Same feel, a third of the width. But with the canvas gone, it should not be needed.

---

## Part 4 — Correction 5: client selection and typing, both

Starting a proposal or a review asks `Whose book?` and offers both paths at once, which is exactly what the composer law exists for.

**Selection** — `List variant="select"` in a sheet, showing the most recent four or five clients as `ListRow` with `trailing="radio"`, each carrying a meta line (`₹4.2 Cr · Balanced mandate`). With a book of 512, the sheet needs search.

```ts
List: {
  ...existing,
  searchable?: boolean          // NEW — renders a search field in the composer's visual style
  searchPlaceholder?: string    // 'Search 512 clients'
}
```

**Typing** — the composer accepts a name directly and the router already resolves it. A bare client name returns the disambiguation with intent chips rather than guessing, which is the existing bucket behaviour and stays.

Both paths converge on the same next step. Neither is the primary; the sheet is for browsing, the composer is for when the advisor already knows the name.

---

## Part 5 — Correction 6: copy and edit the last message

Missing and genuinely needed. Per-message actions, on the **last message only** — at 375 pt, actions on every turn are noise.

```ts
type MessageAction = 'copy' | 'edit' | 'retry'

MessageActions: {
  role: 'user' | 'assistant'
  actions: MessageAction[]
}
```

**On the last user message:** `Edit`. The bubble's text returns to the composer, and everything after it is discarded on resend — the same model as Claude and ChatGPT. Right-aligned under the bubble.

**On the last assistant message:** `Copy` and `Retry`. Left-aligned.

Treatment: text only, 11.5 px `--color-muted`, no pills. This system is text-forward and a row of ghost pills under every answer would compete with the chip row directly below it.

### 5.1 The consequence worth designing for

**Editing a journey answer rewinds the journey.** If the advisor edits their answer to question 7, questions 8 onward are invalidated. That is the same operation as the Decisions strip's `Edit`, which reopens a settled question.

Make them one mechanism. `Edit` on a journey answer *is* `Edit` on that decision, and it should say what it costs before it does it: `Editing this reopens question 7. The four answers after it will be asked again.` with `Edit anyway` and `Keep it`. Silent data loss in an advisory tool is not acceptable, and this is the only place in the product where a tap destroys prior work.

---

## Part 6 — The graphs request, and where it holds

The team asks for line graphs, pie charts, bar graphs, colour themes, legend style and hover box style. Four of those six are straightforward. Two need a ruling, and one is a category error.

### 6.1 Line and bar — yes

**Bar** — sequential bronze ramp, direct labels, ≤ 24 pt thick, 4 pt rounded data-end, square at the baseline. Already specified as `V4`; nothing new.

**Line** — 2 px, round caps, endpoint labelled only. One series is the safe case and covers most needs. **Two series is the practical maximum**, with both directly end-labelled. At three or more, the identity problem below applies, and the answer is small multiples — one small chart per series, same scale — not three lines in three colours.

### 6.2 Pie charts — no, and here is the evidence rather than a preference

A pie encodes identity by colour, by definition. This palette cannot do that. It was tested with a validator, not by eye:

| Candidate | Result |
|---|---|
| The bronze→sand ramp `#A9743F · #C9A77C · #E0CDB6` | Adjacent pair ΔE **11.4** for normal vision against a floor of 15; all three below the chroma floor |
| Muted earthy trio `#B45F3C · #6E7B4B · #4A6072` | ΔE **3.8** under protanopia — olive and terracotta are the same colour to a red-weak reader |
| Four muted hues | ΔE **1.5** under protanopia |
| A set that passes | Requires `#C2410C / #0F766E / #4F46E5` saturation, which is not this brand |

So a pie in this palette is either unreadable for colourblind users or it is a different brand. Those are the only two outcomes.

**The substitute already exists and a shipped finance app uses it.** Copilot Money renders allocation as a **direct-labelled single-hue bar** — `Mutual Fund ──── 85.4%`, `ETF ── 14.59%` — with no donut and no categorical hues. Sentinel's own `V1` allocation bar is the same form and it is the strongest component in the system.

Tell the team: the answer to "we need a pie chart" is the stacked bar with a legend, which does the same job, reads at 375 pt, survives greyscale and print, and does not need a second palette. If they specifically need a *ring* shape for a dashboard tile, a **two-segment meter** is available — one ratio against a limit, one hue — and that is `V6`.

### 6.3 "Colour themes" is the same question as the pie

There is one theme: the bronze sequential ramp for magnitude, the status trio for state, warm grey for de-emphasis. A request for *themes* plural is a request for a categorical palette, which is the pie question wearing a different hat. The ruling is the same, and the reason is the same validator output.

What the system will supply instead: **the four-step ramp, documented, with the rule that identity is carried by direct labels.**

### 6.4 Legend — yes, and it is required, not optional

Two or more series always carry a legend, because colour must never be the only identity channel.

```ts
Legend: {
  items: { label: string, value?: string, step: 1|2|3|4 }[]
  layout?: 'inline' | 'stacked'
}
```

Dot at 8 px on the ramp step, label in `--color-ink`, optional value right-aligned in `--color-muted`, 11.5 px, wrapping rather than truncating. **Text never wears the data colour** — the dot carries identity, the label stays ink.

### 6.5 "Hover box" — this is a phone

Hover does not exist at 375 pt. The request is for **tap-to-inspect**, and it needs designing as such.

```ts
ChartTooltip: {
  anchor: 'above' | 'below'     // flips when near the top edge
  label: string
  value: string
  meta?: string                  // the provenance line for that point
}
```

Appears on tap, positioned above the mark with a 2 px surface ring so it stays legible over a line, dismisses on the next tap anywhere. The tap target is larger than the mark — at least 44 pt around it, per the touch-target rule already in the system.

And the escape hatch that makes all of this accessible: **every chart offers a table view** from the card's `⋯`. No value is ever reachable only by touching a coloured shape.

---

## Part 7 — Order of work

1. **Bundle refresh plus override removal** (Part 0). Nothing else is trustworthy until this is done and evidenced.
2. **Corrections 2 and 3** — the canvas removal and `ArtifactCard`'s expanded state. This changes screens the team's components will sit inside, so it comes before them.
3. **Corrections 1, 4, 5, 6** — drawer, client picker, message actions, back-pill repurposing.
4. **The states page** — four free-text buckets, six response states, empty states.
5. **The graphs ruling into the system** (Part 6) — the ramp, `Legend`, `ChartTooltip`, and the pie decision recorded with its evidence so it is not re-litigated every quarter.
6. **The team's nine components**, per the component spec, now that the screens around them are settled.

Items 1 and 2 are the ones that cannot be reordered.
