export interface ComplianceRow {
  /** "Compliance shelf", "Single-fund ceiling", "Client consent". */
  label: string;
  /** The status, stated: "Passed", "No fund over 25%", "Required". Never a tick on its own. */
  value: React.ReactNode;
  /** 'required' renders the value in --color-danger as TEXT — rule 2, never a fill. */
  tone?: 'ok' | 'required';
}
export interface ConfirmSheetProps {
  open: boolean;
  /** Also the dialog's accessible name. Name what is being approved and for whom — "Approve · R. Sharma". */
  title: string;
  /** REQUIRED, and it renders ABOVE the numbers. What this will do, in the advisor's world: whose
   *  authority it runs under, who is told, and what does not change. A confirm sheet whose small print
   *  sits under the numbers is one that was read after the decision was made. */
  disclosure: React.ReactNode;
  /** Default "Before you approve". */
  disclosureEyebrow?: string;
  /** REQUIRED in practice: compliance is STATED as rows, never implied by silence. An empty array is
   *  accepted only for a confirm step where nothing is checked, which in this product does not exist yet. */
  rows: ComplianceRow[];
  /** What is being approved — the MoveCards, the amount, the document. It scrolls; the commit row does not. */
  children?: React.ReactNode;
  commitLabel?: string;
  /** The dismiss is a WORD beside the commit, not only the scrim. The archive showed one visible control
   *  and it said Approve; a commit-or-dismiss decision has to show both halves. */
  dismissLabel?: string;
  onCommit?: () => void;
  /** Called by the scrim, by the dismiss and by Escape. The caller owns `open`, so a sheet never half-closes. */
  onClose?: () => void;
  /** Between commit and outcome: the commit button says what it is doing and stops accepting taps. No
   *  spinner — this product's waits are named, not spun. */
  busy?: boolean;
  busyLabel?: string;
}
/** The decision surface, and THE ONE SURFACE IN THE PRODUCT WITH NO COMPOSER — rule 3's single documented
 *  exception (`readme.md:204`). It takes no composer prop, so the exception lives in the type rather than
 *  in a caller's discipline.
 *
 *  The order is fixed: title → disclosure → compliance rows → what is being approved → commit. `disclosure`
 *  and `rows` are required because a sheet missing either is the defect this component exists to prevent.
 *
 *  It may scroll inside itself and that is NOT the no-nested-scroll rule, which governs the thread and the
 *  artifact. This is the top layer over an inert thread; it caps at 88% and scrolls its body, with the
 *  commit row pinned outside the scroller so the decision never scrolls away from what it decides.
 *
 *  role="dialog" aria-modal, labelled by `title`; Escape closes; focus moves in and Tab is trapped, armed by
 *  the false → true transition only — never for a sheet mounted already open (F-25). */
export function ConfirmSheet(props: ConfirmSheetProps): JSX.Element | null;
