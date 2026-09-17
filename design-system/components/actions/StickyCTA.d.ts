export interface StickyCTAProps {
  label: string;
  onClick?: () => void;
}

/**
 * @deprecated SUPERSEDED — use `Dock`'s `cta` slot.
 *
 * This is C17, the sticky primary CTA wrapper, and the component's own header has said since v3 that
 * "the Dock's cta slot replaces this". Nothing in the system imports it, nothing renders it on any
 * board, page or kit, and it is the only component in the system that is true of.
 *
 * It is still exported, which is the problem: a dev team handed this library can reach for it and get
 * a wrapper that predates the dock law, with no chips row above it and no composer below it — which
 * is exactly the layout rule 3 exists to prevent. The replacement is one line:
 *
 *     <Dock chips={…} cta={<DarkButton label="Rebalance to his mandate" arrow full />} composer={…} />
 *
 * Kept rather than deleted so the removal is the owner's call and not a silent API break. Nothing new
 * should use it.
 */
export function StickyCTA(props: StickyCTAProps): JSX.Element;
