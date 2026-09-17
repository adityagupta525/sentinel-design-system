ExplainerSheet — bottom sheet answering a tertiary "?" chip: ink 40% scrim, white sheet with 24px top radius, 18px title, 14/20 paragraphs, "Got it".
```jsx
<ExplainerSheet open title="Why a 25% cap?" body={["No single fund…","Six is the smallest number…"]} onClose={close} />
```
Absolutely positioned — parent must be position:relative (the PhoneFrame).
