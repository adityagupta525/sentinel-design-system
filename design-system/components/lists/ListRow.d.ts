export type ListRowVariant = 'nav' | 'select' | 'multi' | 'action' | 'static';
export type ListRowSize = 'md' | 'lg';
export type ListRowLeading = 'none' | 'avatar' | 'icon' | 'index';
export type ListRowTrailing = 'chevron' | 'radio' | 'checkbox' | 'badge' | 'menu' | 'meta' | 'none';
/** One row, constrained pairings enforced in the component — an illegal `trailing` falls back to the
 *  variant's default and warns once. Legal: nav → chevron|meta · select → radio · multi → checkbox ·
 *  action → menu · static → badge|meta|none. The chevron belongs to `nav` and nowhere else.
 *  `static` takes no `onPress` and is exempt from the touch-target rule, exactly like Badge. */
export interface ListRowProps {
  variant: ListRowVariant;
  /** 56 / 72. Defaults to 'lg' when a subtitle is present, 'md' otherwise. */
  size?: ListRowSize;
  leading?: ListRowLeading;
  /** Icon node for leading='icon'; overrides the derived initial for leading='avatar'. */
  leadingContent?: React.ReactNode;
  /** Number shown for leading='index'. */
  index?: number;
  title: string;
  subtitle?: string;
  /** Right-aligned secondary, 11.5px --color-muted. The drawer's relative time ("2h ago") goes here. */
  meta?: string;
  /** Inline node after the title — the drawer's bound-client variant passes a <ClientChip>. */
  chip?: React.ReactNode;
  trailing?: ListRowTrailing;
  badge?: { variant: 'status' | 'meta'; tone?: 'over' | 'under' | 'ok'; text: string };
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onMenu?: () => void;
}
export function ListRow(props: ListRowProps): JSX.Element;
