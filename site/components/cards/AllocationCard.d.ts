export interface AllocSeg { label: string; value: number; /** Use var(--color-alloc-equity) / -debt / -cash — never a new hue. */ color: string; }
export interface AllocationCardProps { segments: AllocSeg[]; animate?: boolean; }
export function AllocationCard(props: AllocationCardProps): JSX.Element;
