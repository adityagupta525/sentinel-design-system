import type { ListRowProps } from '../lists/ListRow';
export type DrawerSection = 'saved' | 'recent' | 'clients';
export interface DrawerProps {
  open: boolean;
  /** Called by the scrim, by Escape and by nothing else — the drawer has no close button because the
   *  scrim is one. The caller owns `open`, so a drawer never half-closes. */
  onClose: () => void;
  /** The "+" in the header: a new thread. */
  onNew?: () => void;
  /** The "See all N" footer of a capped section. */
  onSeeAll?: (section: DrawerSection) => void;
  /** Row props for each section — `title`, `meta`, `subtitle`, `leading`, `onPress`. Pass the FULL
   *  list; the drawer caps it and shows "See all N" only when the cap bit. */
  saved?: Array<Partial<ListRowProps>>;
  recent?: Array<Partial<ListRowProps>>;
  clients?: Array<Partial<ListRowProps>>;
  /** Default 3 / 7 / 8 — List.jsx's own rule, so the drawer carries ONE scroll and no List scrolls
   *  inside it. Change these only with the reason written down. */
  caps?: { saved: number; recent: number; clients: number };
  /** Skeleton rows in every section. Right here and wrong on Home: the drawer IS its history. */
  loading?: boolean;
  /** Per-section failure. The other sections, the header and the footer keep working — the drawer never
   *  blanks and the advisor is never trapped in an empty menu. */
  failed?: Partial<Record<DrawerSection, boolean>>;
  /** Below the lists: "Back to home", the appearance control. NEVER a composer — the owner's ruling,
   *  contradiction 59: the thread and its composer are one tap behind the scrim. */
  footer?: React.ReactNode;
  /** A `SearchField`, rendered directly above the client list. The book is 512 names and the list shows
   *  eight; without this the other 504 are reachable only by typing a name into the thread's composer.
   *  The drawer gives it a place — the filtering is the caller's, because the drawer does not own the book. */
  search?: React.ReactNode;
  /** The dialog's accessible name. Default "Menu". */
  label?: string;
}
/** The menu: saved work, recent threads, the client book — history, which is why it is here and not
 *  on Home. 300pt panel (--w-drawer) over a 25% scrim, sections capped 3 / 7 / 8 with "See all".
 *  A dialog: Escape closes, focus moves in on the false → true transition and back to the opener on
 *  close, Tab wraps. Like ExplainerSheet, both arm on the transition — NO SCREEN MOUNTS IT ALREADY OPEN.
 *  Mount it closed and open it with an action. */
export function Drawer(props: DrawerProps): JSX.Element | null;
