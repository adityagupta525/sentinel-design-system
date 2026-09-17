import type { PillTone } from './Pill';
export interface InlineAction { label: string; onClick?: () => void; /** Defaults to 'outline'. */ tone?: PillTone; }
export interface InlineActionRowProps {
  actions: InlineAction[];
  /** 60ms staggered fade + rise, matching ChipRow. */
  animate?: boolean;
}
/** Pills placed INLINE IN A MESSAGE BODY — they act on the answer just given (open a canvas, start a branch).
 *  Pills in the Dock answer the pending question instead. Placement is what distinguishes them. */
export function InlineActionRow(props: InlineActionRowProps): JSX.Element;
