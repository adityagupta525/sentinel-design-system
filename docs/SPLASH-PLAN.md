# The splash, the mascot, and what the reference video actually shows

Planning document, 21 Sep 2026. Nothing here is built. Three things in it need the owner's ruling
before anything is, and they are marked **RULING** where they fall.

---

## 1. The video, watched rather than described

`6F3B97C9…_7536.mp4` — **91.21s, 444 × 960**. macOS has no `ffmpeg` here, so frames were pulled with a
small Swift tool over AVFoundation (`scratchpad/frames.swift`) and read as contact sheets.

**It is not a splash screen and it is not a mascot.** It is a screen recording of an Indian
food-delivery app with an AI ordering assistant inside it — feed, "Go to chat", "What do you feel like
eating?", cart cards, Hinglish replies. There is no launch sequence in the 91 seconds.

What it does contain, and what it is worth:

| Seen at | What it is | Verdict |
|---|---|---|
| 21s, 27s, 54s | A small **dot-matrix glyph** — a plus/asterisk built from dots — above a label, while the assistant works | **Take this.** It is the terminal-art idea, already working |
| 27s → 59s → 64s | The label changes with the stage: *Thinking* → *Fetching menu options* → *Assembling your meal…* | **Reject the copy, keep the principle.** See below |
| throughout | A pastel pink/lilac **dot haze** blooming behind the glyph | **Reject.** A second hue that encodes nothing |
| 59s–67s | Three stages of waiting, roughly 3–4s each, ~13s total, in an otherwise empty screen | **Reject the shape.** See below |
| 77s | *"Aapki preference ke mutabiq Sardar Ji Chaap & Rolls se… cart mein add kar di hai"* | Natural Hinglish; reads well |

**Why the copy is rejected, from this system's own contract rather than taste.**
`SentinelThinking.d.ts` says the verb *"names the source the answer will cite"* and then, in as many
words: *"Never a decorative 'Thinking…', never a rotating list of verbs the system is not actually
performing."* The video does exactly both. Its verbs are **stage names** — what the machine is busy
with — where Sentinel's are **provenance claims** — where the number about to appear came from. That
difference is rule 4, and it is the more valuable idea of the two.

**Why the shape is rejected.** Three sequential named stages is what `ProgressTrace` is for. A single
mark that morphs while the label changes under it is a verb that keeps changing, which the craft
reference names as the thing not to do.

**So: one idea taken, and it is a good one** — a small mark, built of dots, that is alive while the
system works. Everything around it in that video is a different product's answer.

---

## 2. Does Sentinel get a mascot at all

Today Sentinel's identity is two things: the **✦ sparkle** and the wordmark. There is a standing
ruling that there is **one ✦ Sentinel signature per turn**. A mascot is a second identity, and two
identities in one product is the "one door per thing" ruling broken at brand level.

**RULING 1 — where a mascot may appear.** The recommendation is narrow on purpose:

| Surface | Mascot | Why |
|---|---|---|
| Splash / cold start | **Yes** | The one moment the product has nothing else to say |
| The thread | **No** | `✦` already signs every turn; a face there is a second signature |
| Waiting inside a turn | **No** | `SentinelThinking` is three bronze dots and a provenance verb, and that is a better answer than a face |
| Empty states | **Maybe, later** | Only if an empty state ever ships that a sentence cannot fill |
| Deck covers, the website, store screenshots | **Yes, and the 3D renders belong here** | Outside the product, no rule applies |

**The 3D copper robot cannot ship inside the app.** Not a taste call — `references/borrowed.md`
records *"The product ships no images. No photography, no illustration"* as a settled position, and
the renders are photoreal images. They are excellent brand assets; they are not app assets. The owner
already said the right thing — *"full mascot toh dikhayenge nahi"*.

---

## 3. What ships instead: the face as terminal art

The second reference image already contains the answer. Its **HEAD & FACIAL EXPRESSION MATRIX** draws
the mascot's face as an **LED dot matrix** — default, neutral, focused, confused, thinking, empathetic.
A dot matrix is not an image. It is a grid of circles, and this system can draw it from tokens.

**Proposed component — `MascotFace`.** One `<svg>`, a fixed dot grid, one hue.

- **Grid.** 11 × 7 dots. Odd on both axes so the face has a true centre; small enough that every dot
  is placed deliberately rather than sampled from a picture.
- **Colour.** `--color-bronze` on `--color-ink` for the splash. One hue, varying only in opacity —
  which is how `SentinelThinking`'s three dots already work, so the mark and the wait are visibly the
  same family.
- **Dot size.** From the scale: a 3px dot on a 6px pitch at 1×, so the whole face is 66 × 42 — close
  to `--space-13`-grid territory rather than a new one. Exact values to be picked against
  `references/scale.md` when it is built, not now.
- **States — three, not ten.** Each state is a claim about what the product is doing, and a state the
  product cannot honestly be in should not exist:
  - `waking` — eyes off, a single row of dots at low opacity. Cold start only.
  - `attentive` — eyes on, mouth a flat line. The resting face. This is the one the splash lands on.
  - `working` — eyes on, mouth a row of three dots that pulse on opacity, 1.2s, staggered 150ms.
    **Deliberately identical in rhythm to `SentinelThinking`**, because it is the same idea.
- **No expressions beyond these three.** *Curious*, *empathetic*, *confused* are personality claims a
  wealth-management tool should not make about a number it is about to show. The reference sheet's ten
  moods are the right range for a brand film and the wrong range for this product.

**RULING 2 — three states or more.**

---

## 4. The splash itself

**The position first: a splash screen that exists to be looked at is a tax.** The only honest reason
for one is that the app has real work to do before Home can be true — reading the book, restoring the
last thread. So the splash is **the cover for that work, and it ends when the work ends**, not on a
timer. If the work finishes in 80ms, the splash is gone in 80ms.

### The beats

One sentence of story: **Sentinel wakes, looks at you, and gets out of the way.**

| # | Beat | Duration | Token | What moves |
|---|---|---|---|---|
| 1 | Ink | 0ms | — | `--color-ink` fills the screen. No logo, no spinner |
| 2 | The eyes come on | 240ms | `--dur-enter` | Two dots fade up. Opacity only |
| 3 | The face resolves | 480ms | `--dur-bar` | The remaining dots fade in from centre outward, staggered 150ms across three rings — the same stagger `SentinelThinking` uses |
| 4 | Hold | as long as the work takes, floor 0ms | — | `working` if the work is still going; `attentive` the moment it is done |
| 5 | Hand off | 320ms | `--dur-screen` | The splash leaves on `ds-screen-out`, Home arrives on `ds-screen-in` |

**Floor ≈ 1040ms, and only if the work takes that long.** Every value above is a token this system
already has. Nothing here needs a new duration and nothing here needs a spring.

**What it deliberately does NOT do.** The obvious idea — the face collapsing into the ✦ and flying up
to become the app bar's sparkle — is a **shared-element transition**, and the craft reference is
explicit: *"there is no shared-element transition… a screen that 'smart animates' a card into a page
has invented something."* It would be the best 400ms in the product and it would break a settled rule
to get there.

**RULING 3 — is the sparkle hand-off worth opening that rule?** If yes, it is opened once, written
down, and given a name and a contract like anything else. If no, beat 5 stays a crossfade.

**Reduced motion.** `prefers-reduced-motion: reduce` → the face appears complete at full opacity, no
stagger, no fade-in per ring; beat 5 becomes an opacity crossfade. The splash still covers the work;
it just does not perform.

---

## 5. Haptics — the honest position

**There are no haptics in this repository today** (`grep -ri haptic` returns nothing), and on the
current delivery there cannot be:

- **iOS Safari does not implement the Vibration API.** `navigator.vibrate` is Android-only. The
  home-screen web app at `sentinel-app-beryl.vercel.app` therefore has **no haptics on iPhone**, and
  no amount of code changes that.
- Android Chrome supports `navigator.vibrate`, but it is a buzz, not the Taptic Engine. Using it to
  imitate iOS haptics produces something worse than silence.
- Real haptics need the native wrapper — the same Capacitor shell that would produce the `.apk` —
  where `Haptics.impact({ style: 'light' })` maps to the platform's own engine.

**So haptics are planned as a contract now and implemented when there is a native shell**, which keeps
the design honest and the code ready:

```
haptic('wake')   — beat 3 completes, the face is there. Light.
haptic('commit') — the confirm sheet's primary. Medium. The only place money moves.
haptic('refuse') — a refusal turn arrives. Light double.
```

Three events, named for what happened rather than how strong they are — so the mapping can change per
platform without touching a screen. **No haptic on ordinary taps**: a device that buzzes on every
press is the same mistake as a screen that animates everything.

**RULING 4 — is the `.apk` route being taken?** If yes, haptics are real and worth building the
contract for now. If iPhone-only demos are the plan, the contract is still worth writing down and the
implementation waits.

---

## 6. What this needs before anything is built

1. **RULING 1** — mascot on the splash only, or wider.
2. **RULING 2** — three honest states, or the fuller expression set.
3. **RULING 3** — does the sparkle hand-off justify opening the no-shared-element rule.
4. **RULING 4** — native shell or not, which decides whether haptics are real.
5. One more, which is the owner's alone: **is a mascot wanted at all**, given that `✦` and the
   wordmark already carry the identity and nothing in the product is currently asking for a face.

## 7. Build order, once those are answered

1. `MascotFace` — `.jsx`, `.d.ts`, `.prompt.md`, spec page with the motion table. Three states.
2. `SplashScreen` — a shell component that takes a promise and leaves when it settles. Its contract is
   *"it covers work, it does not wait"*.
3. The haptic contract as a no-op hook, so call sites are written once.
4. `screens/app.html` mounts the splash ahead of `Proto`, and `build:app` inlines it — the phone build
   is where a splash is actually worth having.
5. Nothing in the design-system site changes. A splash on a spec page is a splash nobody asked for.

---

# Part 2 — decisions taken, and the mark's design problem

21 Sep 2026. Rulings answered by the owner; nothing implemented, and nothing will be until the design
is approved.

## What was decided

| # | Ruling | Answer |
|---|---|---|
| 1 | Where the mascot appears | **Splash, and it replaces the ✦ sparkle** as Sentinel's signature |
| 2 | How many states | **Three.** `waking` · `attentive` · `working` |
| 3 | Open the no-shared-element rule | **My call — see below. My vote is no** |
| 4 | Native shell | **Yes.** So the haptic contract is real work, not paper |
| 5 | Is a mascot wanted | **Yes, as the replacement for ✦**, not as an addition |

**One reading to confirm.** *"1. splash n and wo sentinel ke saath jo star aata hai usko replace kare"*
is read as **splash yes, AND the star is replaced** — "n" as "and". The other reading is "splash: no".
Everything below assumes the first. One word corrects it and costs nothing yet.

## The blast radius is two files

Measured, not estimated. `IconSparkle` renders in the product in exactly two places:

- `design-system/components/chat/SentinelBlock.jsx:14` — the signature on every Sentinel turn. This
  is the one that matters.
- `design-system/components/shell/Drawer.jsx:78` — the drawer header.

Everything else is the component itself, its contract, its spec page, seven `*.card.html` kit boards,
`assets/icons/sparkle.svg`, and the three home-screen icons built on 21 Sep. The change is small
because the system routed the signature through one component instead of drawing it per screen.

## The constraint that decides the whole design

**The signature renders at 13 px.** `IconSparkle` takes `size = 18` and draws its svg at
`Math.round(size * 0.72)` — thirteen pixels.

An 11 × 7 dot matrix in a 13 px box gives dots of about 1.2 px. **The face cannot be the signature.**

So the mascot is **one character at two resolutions**, and they are different drawings:

| | Where | Size | How it is drawn |
|---|---|---|---|
| **The mark** | Turn signature, drawer header, app icon | 13–18 px | A glyph, in the icon set's language |
| **The face** | Splash, and nowhere else yet | ~200 px | The 11 × 7 dot matrix from Part 1 |

They must read as the same creature. That is the actual design problem, and it is the one to solve
before Blender is opened — because what Blender produces has to survive being reduced to nine legible
pixels.

## Three directions for the 13 px mark

Each is derived from features the reference renders actually have — a dome head, a dark visor, two
round eyes, small side discs — and each is drawn in the icon set's own stroke language so it sits in
the family rather than beside it.

**A · The visor.** A rounded-square outline, two filled dots inside. The most face-like of the three
at small size. *Risk: at 13 px a box with two dots can read as a die, or a socket.*

**B · The eyes alone.** Two filled dots, no container. The simplest possible mark, and it inherits
`SentinelThinking`'s vocabulary directly — that component is already three bronze dots. *Risk: two
dots with nothing around them is a colon; it may not read as a creature at all.*

**C · The dome.** The head's silhouette — a half-dome over a flat base — with two eye dots inside.
The most characterful and the closest to the renders. *Risk: three strokes plus two dots in a 9 px
usable field is the classic recipe for mush.*

**The honest prediction is that A survives and C does not**, but a prediction is not a finding. All
three get drawn and rendered at 13, 18 and 24 px against the existing eleven icons before any of them
is called right.

**One question the three share.** The icon set is entirely **stroke**. A signature mark may be better
**filled** — a solid visor with the eyes knocked out reads far better at 13 px than any stroke can. It
would be the only filled glyph in the set. That is defensible, because it is a signature and not an
icon, but it is a visible change and therefore a ruling.

**RULING 6 — may the signature mark be filled rather than stroked?**

## My vote on ruling 3, and why it changed

**No. Do not open the no-shared-element rule.** The reason is no longer just rule-compliance.

Once the mascot is the permanent signature, the splash face and the mark in the app bar are **the same
object**. A crossfade that lands the mark at the size and position it already occupies reads as one
thing persisting — which is the feeling the shared-element transition was going to buy. The rule would
be opened to build an effect the new identity gives for free.

Keep beat 5 as `ds-screen-out` → `ds-screen-in`, and get the continuity from the mark being in both
frames.

## A second idea the decision unlocks

`SentinelThinking` today is three bronze dots pulsing on opacity, 1.2s, staggered 150ms, beside the
signature. With the mascot as the signature, **the `working` state could live in the mark's own eyes**
— the same rhythm, the same tokens, one element instead of two.

It is the better idea and it is a visible change to a settled component, so it is not taken here.

**RULING 7 — does `working` replace the three dots, or sit beside them?**

## Contradiction 38's trigger has arrived

The system's own contradictions file, item 38, is **open debt deliberately unpaid**:

> Icon grid: six source glyphs on six grids (17.33 / 18 / 15 / 12.37 / 13.33 / 12.58) with 1.33–1.5px
> strokes… **Trigger: at the app's next visual refresh, redraw all six onto the 24px grid at 1.5px
> stroke and collapse the set to one origin.**

Replacing the product's signature glyph **is** the app's next visual refresh. Measured now: four icons
at 1.33, seven at 1.5 — the drift is real and it is the set the mascot has to join.

**Recommendation: pay 38 in the same pass.** Drawing a new signature onto a grid the set is about to
abandon means drawing it twice.

**RULING 8 — pay contradiction 38 with the mascot, or leave it open?**

## What Blender is for, and what it is not

Blender is **not** where the in-product asset comes from — the product ships no images, and that has
not changed. It is worth opening for two things:

1. **The brand renders.** Deck covers, the website, App Store screenshots, the handover's front page.
   The three images already produced are close; they live outside the product, where no rule applies.
2. **The orthographic front view of the head, as reference.** Render the head flat-on with no
   perspective and no lighting, and use it to *place* the dot matrix deliberately — read the drawing,
   decide each of the 77 dots. **Not to sample it.** A quantised photo is a picture of a face; a
   placed grid is a drawn one, and only the second survives at three different sizes.

**Blender is not connected right now** — `localhost:9876` refuses. Open Blender, enable the MCP addon,
start its server, and it is reachable.

## The skills, re-checked now that the work is different

| Skill | Then | Now |
|---|---|---|
| `fable-iconography` | Not used | **The directly useful one.** Icon families on a keyline grid, one stroke and radius, optical sizing, legibility at small size — which is exactly the 13 px problem |
| `brandkit` | Not used | **Useful later**, for the brand board and the deck, once the mark exists |
| `fable-motion-design` | Not used | **Useful at beat 3**, and it renders motion as a GIF rather than describing it |
| `gustavo-fior/craft` | Rejected | **Still rejected** — but its one idea with nothing equivalent here, *optical alignment*, stops being theoretical at 13 px, where a mathematically centred glyph reads off-centre |
| `cube-motion` | Rejected | **Still rejected.** 0.1.0, two days old, its repository 404s, and `morph` is the transition this system does not have |

## Order of work, once approved

1. Draw A, B and C. Render each at 13, 18 and 24 px beside the existing eleven icons. Look at them.
2. Owner picks one. Rulings 6, 7 and 8 answered against a real drawing rather than a description.
3. Blender: the head, then the orthographic front view.
4. The 11 × 7 face, placed by hand against that view. Three states.
5. `MascotFace`, `SplashScreen`, the haptic contract — in that order, each with its spec page.
6. The two call sites swap. `IconSparkle` stays in the set; it stops being the signature.

---

# Part 3 — the marks, drawn and looked at

21 Sep 2026. Six candidates drawn on a 24 × 24 grid at 1.5 stroke, rendered at 13 / 18 / 24 / 64 px
and then placed in a real turn at 375 pt. Renders in `scratchpad/marks.png`, `marks2.png`,
`turn.png`, `sizes.png`.

## What the renders said, including where I was wrong

**My prediction in Part 2 was that A (the visor) would survive and C (the dome) would not. Both were
wrong.**

| Candidate | At 13 px |
|---|---|
| A · visor, stroke | Reads as a **plug socket**. Not a face |
| A2 · visor, filled | Better, still a socket or a domino |
| B · eyes alone | Two dots. Legible, calm — but punctuation, not a creature |
| C · dome, stroke | Mush, as predicted |
| C3 · dome, filled | **The best face of the six** — and still a blob at 13 px |
| D · dome + visor slot | A bridge, or a handbag |
| E · dome + eye band | The band and the eyes merge into a grey slot |
| F · dome, squarer eyes | Reads, marginally heavier and more machine than C3 |

**Stroke does not survive 13 px. That settles RULING 6: the mark is filled.** It will be the only
filled glyph in the set, and that is defensible because it is a signature rather than an icon.

## The finding that matters, and it is uncomfortable

Placed in a real turn beside a real sentence, **at 13 px the mascot does not read as a mascot.** The
two eyes merge into the mass and it becomes a small dark thumbprint. Next to it, the sparkle is
lighter, more open and simply better at that size.

Sizes were then tested in situ — 13, 16, 18:

- **13 px** — blob.
- **16 px** — the eyes begin to separate. A small head.
- **18 px** — clearly a head with two eyes. **This is the floor at which the mascot exists.**

**So the decision "the mascot replaces the sparkle" forces a second change: the turn signature grows
from 13 px to 18 px.** That is visible on every turn in the product. It is not a like-for-like swap
and it should not be presented as one.

## The two honest routes

**Route 1 — the mascot replaces the sparkle, and the signature grows to 18 px.**
Faithful to the decision. Costs: every turn's header gets heavier, and the mascot is a filled shape
where the sparkle was an outline, so the thread reads slightly more insistent. Recommended if the
mascot is meant to be the product's face.

**Route 2 — the mascot takes every surface that has room, and the turn keeps ✦.**
Splash, app bar, drawer header, app icon — all of them at 18 px or larger, where the mascot works.
The turn signature, the one place with only 13 px, keeps the sparkle. Costs: two marks in the system,
which is the thing the "one door per thing" ruling dislikes. Recommended if the thread's weight
matters more than uniformity.

**My call: Route 1, at 18 px, with C3.** The mascot is worth having as the face or it is not worth
having; a mascot that appears everywhere except the one surface the advisor looks at all day is the
worse of the two compromises. But the 18 px growth is a visible change to every screen and therefore
the owner's to accept — it is the one thing in Part 3 that is not mine to decide.

## The rest of the rulings, taken

**RULING 6 — filled or stroked.** **Filled.** Measured, not preferred.

**RULING 7 — does `working` replace `SentinelThinking`'s three dots.** **No, not now.** The signature
swap is already a visible change on every turn. Two at once and a regression cannot be attributed to
either. The three dots stay; revisit once the mark has shipped and been lived with.

**RULING 8 — pay contradiction 38.** **Half of it.** The mascot is drawn on the 24 px / 1.5 px grid,
which is 38's stated end state, so it never needs redrawing. The other six glyphs are **not**
normalised in this pass — the contradictions file says that changes every screen, and this change is
already touching every turn. 38 stays open with one fewer glyph to convert.

**The splash.** Read as **yes**.

## Blender — the real state of it

The tools were timing out, and it was not Blender. Measured:

- `/Applications/Blender.app` is installed; **Blender 5.1.2 is now running** and its server is
  listening on `127.0.0.1:9876`.
- A raw socket client gets a reply in **0.01s** — the addon is healthy.
- **The addon and the Claude extension speak different protocols.** Installed is the community
  *Blender MCP v1.2 by BlenderMCP*, whose commands are `get_scene_info` / `execute_code` and whose
  replies are plain JSON. The Claude extension is **Blender Lab's** `blender_mcp`, which sends
  `{"type":"execute", "code":…, "strict_json":…}` terminated by a null byte and waits for a reply
  containing one. The addon has no `execute` handler and never sends the null byte, so the bridge
  waits its full 300s and times out.

**The fix, in Blender:** Preferences → Get Extensions → Repositories → add remote repository
`https://lab.blender.org/`, install and enable its **MCP** add-on, and disable the old *Blender MCP*
so the two do not both claim port 9876.

**Not blocked meanwhile.** `scratchpad/blender_exec.py` drives the running addon directly over the
socket; `execute_code` works and returns output.

---

# Part 4 — the reference set changed the direction

21 Sep 2026. The owner sent ten new references and said the copper dome is not what he wants.

## What the new references actually share

Voxel Claude-Code mascot · a blue speech bubble with two rounded-rect eyes · a geometric bubble/robot
built from overlapping rounded squares · a logo-construction grid · a petal spinner · a minimal robot
head with an antenna · a dot-matrix "1" · the ARTIFACT splash with a pixel asterisk · a single black
pill on red.

They agree on four things and disagree with the copper renders on all four:

| | The new set | The copper renders |
|---|---|---|
| Construction | **Geometric** — boxes, grids, pixels | Organic, sculpted |
| Eyes | **Squares or rounded rectangles** | Round, glowing |
| Colour | **One, flat** — or none at all | Photoreal metal, many values |
| Medium | **Drawn** | Rendered |

**This matters more than it looks.** The new set is much closer to what Sentinel already is — flat,
token-driven, no photography, no illustration. The photoreal mascot was the thing that could not ship
inside the product. A voxel or pixel mascot can be *drawn* from tokens at any size.

## The video, read at 150 ms

Frames pulled every 0.15 s across 26.60–29.20 s. The mark is a **plus built from a grid of dots**, and
the loop is about **1.8 s**:

- **26.60 → 27.52 s** — dots fill in and darken. The plus densifies into a diamond.
- **27.52 s** — densest and darkest.
- **27.67 → 28.28 s** — it thins back out, and a **second, far fainter copy drifts in from the left**.
- **28.44 s** — the cycle restarts.

**Nothing changes position. No rotation, no spinner, no bounce.** The whole animation is *dot density
and opacity*, and the label under it never moves. The pastel haze seen at coarse sampling is that
faint second copy, not a glow.

That is the idea worth taking, and Sentinel is already most of the way there: `SentinelThinking` is
three bronze dots pulsing on opacity at 1.2 s with a 150 ms stagger. Same family — theirs makes a
glyph out of the dots, Sentinel makes a row.

## What the field does — Mobbin, iOS splash screens

Eight AI apps: [Character AI](https://mobbin.com/screens/dbb4400a-b951-4e03-ba32-c91d672466b7) ·
[Ultrahuman](https://mobbin.com/screens/da5f6ed4-3d11-46f7-b9fb-872a68c15a73) ·
[Amazon Lens AI](https://mobbin.com/screens/ba9e74a4-9352-428c-9295-a1b3fa1f4ec8) ·
[Tolan](https://mobbin.com/screens/cb09c2a9-96ad-426c-ab29-9db0c43a06c2) ·
[Cal AI](https://mobbin.com/screens/2faf5056-f041-4378-bde4-105eaaeb9efd) ·
[Wispr Flow](https://mobbin.com/screens/2c0a3028-3997-488b-8bcd-2fe78590228a) ·
[Comet](https://mobbin.com/screens/ef1aba25-dda8-4a02-a895-ac1af7abbc5b) ·
[Photoroom](https://mobbin.com/screens/ac9502fe-fd1e-4c7b-b9e4-21df91643547).

Seven of the eight are **one small mark, centred, on a flat dark ground**, and several have no mark at
all — Character AI ships its wordmark and nothing else. Only **Tolan** puts a rendered 3D object on
the splash, and it is a character app.

So the convention supports the plan in Part 1 exactly. The choice in front of us is a *style* inside
that convention, not a different structure.

## The voxel build

Built in Blender 5.1.2: one body block, two side nubs, four stubby legs, two square eyes. **Neutral
clay, no colour** — the owner said not to take the real mascot's colour, and a silhouette is easier to
judge without one. Saved as `~/Downloads/sentinel-mascot/sentinel-voxel-v2.blend`.

**Three failed passes before it was right, all mine:**

1. Eyes at roughness 0.30 read as **white** panels — the key light landed on them as a mirror.
2. Moving them "flush" put them **inside** the body: the front face is at y = −1.30 and I placed their
   centres at −1.27 with a depth of 0.16, so they spanned −1.35…−1.19 and were buried.
3. Then the model stopped matching my mental picture entirely — a listing showed four legs reporting
   location (0,0,0) while rendering correctly, because `transform_apply` acts on **everything
   selected**, not the object just added.

The fix was to stop patching and rebuild by writing mesh data directly, with every box's world-space
bounding box printed and checked before rendering. That is the pass that came out right.

## Not done, and said rather than implied

- **Grok's bot and its agent mascot were not researched.** The owner asked; this turn did not get to it.
- **Higgsfield was not used.** It spends credits, so it gets a quote before a batch rather than after.

---

# Part 5 — the clone problem, and what fixed it

21 Sep 2026. The owner looked at the voxel build and said it reads as a Claude clone. He is right,
and the diagnosis matters more than the fix.

**The voxel *style* was never the problem. The *skeleton* was.** What I built copied Claude Code's
mascot anatomy item for item: a wide horizontal body block, two small square eyes set high and wide,
four stubby legs, two side nubs. Change the colour and it is still their creature.

## The fix had to come from Sentinel's own meaning, not from nudged proportions

Four things were already pointing at the same shape and I had not put them together:

- Sentinel's existing signature is the **✦ four-point star** — which is a **plus**.
- The reference video's loading mark is a **plus built from a dot grid**.
- ARTIFACT's splash, in the owner's own reference set, is a **pixel asterisk** — a plus.
- The rest of his references are grids of squares.

**So the mascot is not a robot. The mascot is the sparkle, voxelised.**

## Why this is the strongest option on the table

**It dissolves the 13 px problem that killed the dome.** Part 3 measured that a mascot face becomes a
thumbprint at 13 px, which forced a choice between growing every turn's signature to 18 px or keeping
two marks. The star has no such choice to make: **at 13 px it reduces to the sparkle, which is what is
already there.** The mark does not change at small size — it only gains a face as it grows. One
object, two resolutions, and nothing in the thread moves.

It also settles Route 1 versus Route 2 by making the question disappear. There is no second mark to
keep outside the product, because the mascot *is* the mark.

And it cannot be confused with Claude's: no legs, no box, a star standing on its lower point.

## Built

`~/Downloads/sentinel-mascot/sentinel-star-v2.blend` — 57 voxels on a 13 × 13 grid, arms tapering in
depth so the points read as points rather than as a flat cut-out. Neutral clay; colour is still a
separate decision.

**v1 was wrong and the render said so:** two-voxel arms against a five-voxel centre read as a
**diamond**, not a star — the mass swallowed the points. The grid went to 13 and the arms got their
length back.

**Still rough, and not hidden:** the arms are spindly in three dimensions and would look fragile as a
physical object; the eyes are small against the central mass; and at some angles the outermost arm
voxel reads as detached, because its depth taper is doing its job a little too well.

---

# Part 6 — I invented a creature when the brief was to re-art an existing one

21 Sep 2026. The owner: *"mera real mascot dekho… usko hi art change karo."*

**The star was the wrong answer to the right criticism.** He said the voxel build read as a Claude
clone, and instead of re-arting his mascot I designed a different one. The mascot is not an open
question — it is the copper robot in the character sheet and the expression board: a dome head, a
dark visor across it, two eyes, small side discs. What is open is its **art**.

## The same character, built rather than sculpted

`~/Downloads/sentinel-mascot/sentinel-voxelhead-v2.blend` — the dome head on a 15 × 16 voxel grid,
the visor as a band of near-black cells across it, two 2 × 2 emissive eyes inside the band, the side
discs kept. Depth follows the dome's curve, so the grid is bent into a rounded mass rather than left
as a slab — that is what keeps it his character and not a cube with a face.

Neutral clay again: the instruction not to take the real mascot's colour still stands, and the
question on the table is form and treatment.

**Two passes, and the first was wrong in a way the render showed plainly.** At roughness 0.42 under
three lights the visor came out **grey**, not black, and the eyes read as **holes punched through
it** rather than lights — an emissive face contributes nothing when it sits flush and faces away.
Fixed by taking the visor to near-black at 0.85 roughness with specular almost off, and by sitting
the eyes **proud** of the visor at emission 14 so they light themselves.

**Still rough:** the eyes read as white squares rather than glowing ones, because bloom is not
enabled in the render; the lower half of the dome is heavy and flat-bottomed; and the side discs are
small enough to read as stubs.

## This is one art treatment, not the answer

Voxel is the direction the owner's first reference pointed at. The same character has at least two
more worth seeing before anything is chosen:

- **Flat geometric** — the one that can actually ship inside the product, drawn from tokens, no
  render at all.
- **Low-poly faceted** — sculpted silhouette, flat shaded, between the two.

---

# Part 7 — the art search, and the head landing before the body

21 Sep 2026. *"boxs wala pasand nahi aaya… acha art craft dhundo… pinterest par ache keywords."*

## The keywords that actually returned the right thing

Searched on Pinterest, logged in, and looked at the results rather than the titles:

| Keyword string | What it returns | Worth it |
|---|---|---|
| `soft 3d robot mascot clay render` | Matte rounded bots, dome heads, dark visors, studio light | **Yes — closest to his mascot** |
| `designer vinyl toy robot character studio product render soft light` | Crafted toy-like robots, pastel and neutral grounds, premium | **Yes — the craft level he is after** |
| `robot head visor industrial design concept matte` | Glossy black helmets, harder and colder | Useful for the visor only |

Vocabulary worth reusing in any further search: **soft inflated proportions · matte clay finish · subsurface shading · studio three-point light · soft drop shadow on a gradient backdrop · panel lines · touchable**. The one word to avoid is *glossy* — it produced chrome every time.

**Two art directions came out of it**, both of his character rather than a new one:

1. **Soft matte** — rounded, matte, studio-lit, form read through shading rather than highlights. Friendly without being cute.
2. **Industrial visor** — darker, harder, glossy face plate against a matte shell. More instrument than companion.

Voxel is dropped on the owner's word.

## Built: head and chest, soft matte

`~/Downloads/sentinel-mascot/sentinel-bust-v3.blend`

**The visor edge is finally right, and the fix is worth recording.** Every earlier attempt assigned
the visor as a *material per face*, so its boundary could only follow the quad grid and came out as a
staircase — three times. It is now an **analytic mask in the shader**: object coordinates →
`(x/0.72)² + ((z−0.02)/0.42)² < 1`, with a 0.04-wide soft shoulder and a second gate on the surface
normal so it only paints the front of the head. Exact ellipse at any resolution, and one material
instead of two.

**The head is landing. The chest is not.** Three forms tried, each wrong in its own way:

1. A sphere — read as a **snowman**.
2. A tapered box — tapered the **wrong way**, narrow at the shoulders and wide at the cut, so it read
   as a **lampshade**.
3. Taper inverted with shoulder caps — now a **slab with shoulder pads**, like a toaster. The shoulders
   sit *on* the torso instead of being part of it.

That is where it stands, and it is not solved by another guess at proportions.

**Worth asking before more work goes into it:** his own expression board is **all head**, and the
splash needs a head. The full body exists on the character sheet but no surface in this product has
asked for a chest yet.

---

# Part 8 — the chosen mascot, in Sentinel's palette, and what the splash does with it

21 Sep 2026. The owner picked a specific mascot and asked for it built exactly, in our palette, and
for the splash's colour plan.

**Said once, because it is a real risk and then it is his call:** an exact copy of another designer's
character becomes this brand's face, and that is an IP exposure a logo review would flag. Changing the
palette and owning the proportions reduces it. Built as asked.

## The form, and the two bugs worth remembering

`~/Downloads/sentinel-mascot/sentinel-bot-v4.blend` — a rounded-box head as the dominant mass, a dark
face plate proud of the front with a generous margin, **two small rounded-square eyes low and right
of centre** (that offset is the reference's signature; centred eyes lose the character), a tab on the
left side, and a tiny body tucked under.

1. **The plate was 0.03 proud of the head and therefore invisible.** Measured rather than eyeballed:
   head front at y −1.00, plate front at −1.03.
2. **Then it shot 1.06 proud**, because these meshes have their location baked into the mesh data, so
   setting `.location` double-counted it. Fixed by *solving* placement from a measurement —
   `put_front(o, target)` reads the evaluated bounds and moves by the difference — instead of
   computing it from assumed dimensions.

Still not right, and not claimed as right: the head reads as a box where the reference is a pillow,
and the plate is flat where the reference's is softly domed.

## Colour, from the system's own tokens

| Part | Token | Why |
|---|---|---|
| Shell | `--color-desk` `#dedbd6` | A pale mass reads as one silhouette against ink |
| Face plate | `--color-ink` `#251f1b` | Same value as the splash ground, so the face reads as **depth** rather than as a panel |
| Eyes | `--color-bronze` `#b69377`, lit | The only chromatic thing on the screen |
| Side tab | `--color-bronze-deep` `#715035` | One accent, stated once |

**Emission had to come down from 10 to 2.2.** At 10 the bronze clipped to white and the hue was gone —
a lit element still has to be the colour it claims to be.

A dark variant swaps the shell to `--color-ink` for light grounds. Same four tokens either way; no
colour enters the system for the mascot.

## The splash, with the mascot in it

Ground is `--color-ink`. This obeys rule 1 without being asked to: **one hue, in one place, on the
whole screen** — the eyes. Everything else is ink and desk.

| # | Beat | Duration | Token | What happens |
|---|---|---|---|---|
| 1 | Ink | 0 ms | — | The screen is `--color-ink`. Nothing else |
| 2 | **The eyes come on** | 240 ms | `--dur-enter` | Two bronze rounded squares appear in the dark. **The mascot is not visible yet — only its eyes** |
| 3 | The shell resolves | 480 ms | `--dur-bar` | The pale head fades up around them, the plate staying ink so the face reads as a hole |
| 4 | Hold | as long as the work takes | — | If it runs long the eyes pulse — 1.2 s, 150 ms stagger, the rhythm `SentinelThinking` already uses |
| 5 | Hand off | 320 ms | `--dur-screen` | `ds-screen-out` → `ds-screen-in` into Home |

**The story is one line: the eyes open before the face exists.** It costs no new token, no new easing
and no new colour — beat 2 is `--dur-enter`, beat 3 is `--dur-bar`, beat 5 is `--dur-screen`, and the
hold borrows a rhythm the product already performs.

Reduced motion: the whole thing arrives at full opacity with no stagger, and beat 5 is a crossfade.

---

# Part 9 — built, and watched running

21 Sep 2026. Three components in a new `brand` group, the splash wired into the phone build, every
gate green, and the motion captured frame by frame rather than described.

## What shipped

| | Where | What |
|---|---|---|
| `Mascot` | `components/brand/Mascot.jsx` | The character as one token-drawn SVG — the model's front view. Head only. Three states, two tones, four tokens |
| `DotField` | `components/brand/DotField.jsx` | Bronze dots on tilted orbits settling onto the mascot's own geometry, eyes first. Canvas, one colour read from `--color-bronze`, ~150 lines, **no dependency** |
| `SplashScreen` | `components/brand/SplashScreen.jsx` | Covers `until`, leaves when it settles. Dots → solid → hold → `ds-screen-out` |
| Spec pages | `pages/Mascot.html`, `DotField.html`, `SplashScreen.html` | Specimen · anatomy · states · the 13/18 measurement live · tokens · props · do/don't · motion with reduced-motion answers |
| The app | `screens/app.html` | `<SplashScreen until={document.fonts.ready}>` over `<Proto>`. The fonts are the one thing genuinely pending on a phone |

**One new keyframe** in the whole exercise — `ds-splash-leave`, opacity only, with its reduced-motion
entry beside it. Everything else is `ds-fade`, `dot-pulse`, `ds-screen-out` and the duration tokens
the system already had.

## What the frames show (`scratchpad/splash-app-strip.png`, `splash-spec-strip.png`)

Labelled with the **actual** capture time, not the requested one — see below for why that matters.

- **129 ms** — ink; dots in orbit, depth as alpha.
- **245 ms** — **the eyes have landed**: two bright clusters at rest while every other dot still orbits.
- **500–750 ms** — the plate outline forms, then the head. By 750 the dots *are* the mascot.
- **932 ms** — the solid mascot, crossfaded in over the dotted one.
- **1159 ms** — leaving: the ink slides out on `ds-screen-out`, Home already beneath it.

On the specimen, whose promise never resolves: dots → solid at 803 ms, then **held**, eyes breathing.

## What went wrong on the way, in order

1. **Three hardcoded group lists.** `tools/build-barrel.mjs`, `tools/build-bundle.mjs` and
   `design-system/scripts/build-index.js` each carry their own `DIRS`. A new group missing from one
   fails every page that names its components with *"Element type is invalid… got: undefined"* — an
   error that points at the page, not at the list. All three now carry `brand`; they are still three.
2. **Named React hook imports.** The bundle aliases `react` to `tools/react-global.js`, which exports
   only the default. `import { useEffect } from 'react'` fails at bundle time. House convention is
   `React.useEffect`; the two new components follow it now.
3. **A generator bug of my own.** The spec pages were written through a Python f-string, and a style
   constant that already carried doubled braces was interpolated inside another pair — `style={{{ … }}}`,
   three braces, in 16 places across three pages. Babel's *Unexpected token (15:66)* was exactly right.
4. **A harness that lied about time.** The first keyframe strip blocked Google Fonts so the splash
   would have work to cover, then took screenshots at 60…2400 ms. Every frame showed Home. Playwright's
   `screenshot()` **waits for pending fonts**, so every capture actually happened after the gate
   released at 1500 ms — after the splash had left. The labels were the requested times. The DOM probe
   that followed showed the splash present, on top, ink-backed and covering the stage; the corrected
   strip records `Date.now()` after each capture resolves.

## Not done

- The turn signature is **not** swapped. `SentinelBlock` still renders `IconSparkle` at 13 px. The
  Mascot page's block 5 shows the live measurement; growing every turn to 18 px is the owner's call and
  is one line once made.
- `tone="dark"`: bronze eyes on a desk plate are legible but faint. A token constraint, not a bug;
  noted for when the canvas variant is actually needed.
