export interface TableCol { key: string; header: string; align?: 'left' | 'right'; }
export type TableRow = Record<string, React.ReactNode>;
export interface DataTableCardProps { title: string; meta?: string; description?: string; columns: TableCol[]; rows: TableRow[]; footer?: string; /** Row of Pill size="sm" tone="filter" */ filters?: React.ReactNode; /** ConcentrationBar */ bar?: React.ReactNode; /** Label of the chip-surface "Show all" button */ showAll?: string; onShowAll?: () => void; }
export function DataTableCard(props: DataTableCardProps): JSX.Element;
