import React from 'react';
/* THE FOUR ASSET CLASSES AS MARKS — equity, debt, commodity, property.

   Why these exist at all: the explorer's first question is a four-tile grid, and four tiles carrying
   only a word and a number is the flattest surface in the product. The owner's note on 23 Sep 2026
   was exactly that — the tiles read as labels in boxes. A mark gives each tile a silhouette the eye
   can learn, so the second time an advisor opens the explorer they reach for a shape rather than
   read four words.

   THEY ARE TEXTURE, NOT ICONOGRAPHY, and that is the whole reason they are allowed. Sentinel's icon
   set is a 15px stroke family for controls; these are 64px+ fills drawn at 6% ink and clipped by the
   tile's own corner, so they sit UNDER the label rather than beside it. Nothing here is ever the
   only thing carrying a meaning — every tile states its class in words, so the mark can be decorative
   without breaking rule 1. A mark that had to be understood would need a legend, and a legend on a
   four-tile grid is an admission the tiles failed.

   WHY GEOMETRY AND NOT PICTURES. This system ships no images — not one, anywhere — and a photograph
   or an illustration of "equity" would be the first. Each mark is instead the shape the quantity
   already has in this product: equity is the rising step chart every fund page draws, debt is the
   coupon ladder a bond's payment schedule already is, commodity is the bar, property is the
   elevation. They are the same drawings the charts make, enlarged.

   ONE VIEWBOX, ONE FILL. 24x24, `currentColor`, no stroke — so a caller sizes it with `size` and
   tints it with `color` on the parent, and the four never drift apart in weight. */

const BOX = { display: 'block' };

function Svg({ size, children, label }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={BOX}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
      {children}
    </svg>
  );
}

/* EQUITY — the rising step. Four columns of increasing height, the shape a NAV curve makes when it
   is rendered as bars, which is the only picture of "equity" this product already draws. */
export function MarkEquity({ size = 24, label }) {
  return (
    <Svg size={size} label={label}>
      <rect x="2" y="15" width="4" height="7" rx="1" />
      <rect x="8" y="11" width="4" height="11" rx="1" />
      <rect x="14" y="6" width="4" height="16" rx="1" />
      <rect x="20" y="2" width="2" height="20" rx="1" />
    </Svg>
  );
}

/* DEBT — the coupon ladder, STAGGERED. The first drawing was three full-width rungs, and on a tile
   the mark bleeds past the right edge, so three full-width bars were cropped into three unfinished
   ones: the shape read as a mistake. Staggering the rungs from the left makes the right-hand crop
   land on the short ends rather than through the middle of every bar, and it says the truer thing
   anyway — a schedule of payments, each one landing and stopping. Flat against equity's rise is
   still the point. */
export function MarkDebt({ size = 24, label }) {
  return (
    <Svg size={size} label={label}>
      <rect x="2" y="3.5" width="19" height="3" rx="1.5" />
      <rect x="2" y="9" width="13" height="3" rx="1.5" />
      <rect x="2" y="14.5" width="17" height="3" rx="1.5" />
      <rect x="2" y="20" width="9" height="3" rx="1.5" />
    </Svg>
  );
}

/* COMMODITY — the ingot, stacked. Two trapezoids that TOUCH, not two that float: the first drawing
   left a 2-unit gap between them and once the tile cropped the lower one the upper read as an
   unrelated shape hanging in the corner. Stacked flush, the crop takes the base and what is left
   still reads as a bar seen slightly from above, which is how gold is actually sold. */
export function MarkCommodity({ size = 24, label }) {
  return (
    <Svg size={size} label={label}>
      <path d="M7 2.5h10l2.2 5.5H4.8L7 2.5Z" />
      <path d="M4 9h16l2.4 6H1.6L4 9Z" />
      <path d="M1 16h22l2 7.5H-1L1 16Z" />
    </Svg>
  );
}

/* PROPERTY — the elevation. Two towers with a floor line, for REITs and InvITs: the class is rent
   from built things, and an elevation is how a building is drawn when it is an asset rather than a
   place. */
export function MarkProperty({ size = 24, label }) {
  return (
    <Svg size={size} label={label}>
      <path d="M3 9h7v13H3V9Z" />
      <path d="M12 2h9v20h-9V2Z" />
      <rect x="5" y="12" width="3" height="2.5" rx="0.6" fill="var(--color-surface)" opacity="0.55" />
      <rect x="14.5" y="5" width="4" height="2.5" rx="0.6" fill="var(--color-surface)" opacity="0.55" />
      <rect x="14.5" y="10" width="4" height="2.5" rx="0.6" fill="var(--color-surface)" opacity="0.55" />
    </Svg>
  );
}

/* The catalogue's own `assetName` strings, which is what the screens hold — so a screen never keeps
   its own map from asset to mark and the two cannot drift. An unknown asset renders NOTHING rather
   than a fallback glyph: a wrong shape is worse than no shape, because the eye learns it anyway. */
export const ASSET_MARKS = {
  Equity: MarkEquity,
  Debt: MarkDebt,
  Commodity: MarkCommodity,
  'REITs / InvITs': MarkProperty,
};

export function AssetMark({ asset, size = 24, label }) {
  const M = ASSET_MARKS[asset];
  return M ? <M size={size} label={label} /> : null;
}
