Pill — the ONE tappable rounded-full chip. Two sizes (md 36 on the surface, sm 32 inside a card), six tones; the tap target is always ≥44px regardless of size.
```jsx
<Pill label="Let's go" tone="primary" />
<Pill label="Use her KYC age — 38" tone="smart" />
<Pill label="Why a 25% cap?" tone="tertiary" />
<Pill label="All 43" size="sm" tone="filter" selected />
<Pill label="Download PDF" loading />
```
Replaces Chip, AnswerChip (pill form) and FilterChip. If it isn't tappable, it's a Badge.

**Loading is "working", not "unavailable".** The label holds, the glyph slot becomes a 13px spinner, the label drops to 60%, and the width and press target do not move — a pill that shrinks mid-press moves the thing under the finger. It is inert while loading but never dimmed like `disabled`. `DownloadAction`, `FileUpload`'s retry and `ResultCard`'s primary all wait on this state.
