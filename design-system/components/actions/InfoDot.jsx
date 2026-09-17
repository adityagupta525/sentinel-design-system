import React from 'react';
import { Pressable } from './Pressable.jsx';
import { IconInfo } from '../icons/IconInfo.jsx';
/* THE RULE, as a component: any figure an advisor must defend carries an ⓘ to its explanation.

   Two copy rules came out of the Monzo reading and this is the second one. The first — caveats sit at
   the number, not in a global footer — is a prop on the charts (`caveat`) and on StatTile. This one
   needed a control, because a caveat is a sentence and an explanation is a sheet.

   It opens the ExplainerSheet the system already has. It never opens a tooltip: a tooltip at 375pt is
   dismissed by the next tap and cannot hold a formula, a date range and a source, which is exactly
   what "CAGR 1Y" needs behind it. Shopee puts one of these on every stat in a fund detail; ours goes
   on any figure whose basis an advisor would be asked for.

   44pt target around a 14px glyph, from Pressable. The accessible name names the FIGURE, not the
   icon: "How is CAGR 1Y worked out?" rather than "info". */
export function InfoDot({ figure, onOpen, size = 14, stroke = 'var(--color-muted)' }) {
  return (
    <Pressable onClick={onOpen} label={`How is ${figure} worked out?`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle' }}>
      <IconInfo size={size} stroke={stroke} />
    </Pressable>
  );
}
