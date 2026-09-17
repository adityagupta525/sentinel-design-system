AnswerChip — the journey answer. Without a subtitle it IS a <Pill size="md"> (alias for the journey vocabulary); with a subtitle it is the full-width card chip. Variants: outline (default), smart (peach, prefilled-from-record glyph), tertiary (dashed, "?" — opens an explainer, never advances), muted (60% label, e.g. "Skip"), primary (sand fill, ink label — the forward move). selected = sand fill + bronze ring + check.
```jsx
<AnswerChip label="Let's go" variant="primary" />
<AnswerChip label="Use her KYC age — 38" variant="smart" />
<AnswerChip label="Why a 25% cap?" variant="tertiary" />
<AnswerChip label="Fixed salary" subtitle="Same every month" />
```
