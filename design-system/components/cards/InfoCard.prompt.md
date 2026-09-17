InfoCard — fund detail, with the anatomy our stat tiles were missing: **figure → chart → range row → a stat pair where each figure carries its own ⓘ**. That is Shopee's fund-detail shape, and reading it surfaced both of the gaps it closes — we had no range control at all, and no way for a figure to explain itself.
```jsx
<InfoCard name="Parag Parikh Flexi Cap" meta="Direct · Growth · ₹4.1 L held"
  figure="18.4%" figureNote="3Y CAGR" range="3Y" onRange={setRange}
  caveat="Past performance does not indicate future returns."
  series={[{label:'NAV', points:[…]}]}
  stats={[{label:'CAGR 1Y', value:'12.1%'},{label:'Max drawdown 1Y', value:'−14.2%'}]}
  onExplain={openSheet} />
<InfoCard name="Parag Parikh Flexi Cap" locked />   {/* performance source unconfirmed */}
```
The **locked** case is the one that matters: the source of fund performance data is one of the three decisions that are not ours, so a series with no confirmed source renders visually locked and says so — `——` in the de-emphasised figure treatment — rather than drawing a plausible line. An invented number in a wealth tool is worse than a blank. A single stat can be locked on its own while the rest of the card works.
