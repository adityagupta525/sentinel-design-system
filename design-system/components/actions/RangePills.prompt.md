RangePills — the time range for a performance series (`1M 3M 1Y 3Y ALL`), the control our chart family had none of. A number with no period attached is not a number an advisor can defend. Pill's filter tone at 32px in one row; selected carries the sand fill and the bronze ring, which is how selection already reads here.
```jsx
<RangePills value={range} onChange={setRange} />
<RangePills ranges={['1M','3M','YTD','1Y','3Y','5Y','ALL']} value={range} onChange={setRange} />
<RangePills locked />     {/* performance source unconfirmed — inert, and it says why */}
```
**Not tabs:** tabs change what you are looking at, a range changes the window on the same thing — so it is a `role="group"` of `aria-pressed` buttons, not a `tablist` promising arrow-key panel navigation. Seven ranges overflow 343, so the row scrolls **horizontally**, which the no-nested-scroll law permits (it forbids vertical inside vertical). `locked` is the visually-locked state for a figure whose data owner has not been decided.
