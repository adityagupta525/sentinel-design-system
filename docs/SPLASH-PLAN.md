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
