export interface ArtifactVersion {
  id: string;
  /** Short label — "V1", "V2". Tabular, so the column does not jitter. */
  name: string;
  /** What changed, in the advisor's words — "Swapped the mid-cap for a flexi-cap". */
  summary: string;
  /** When, and by whom if it matters — "Yesterday 4:12 pm". */
  meta?: string;
  /** True for the version the client actually received. The row says so, because that is the one
   *  that matters when the client rings. */
  sent?: boolean;
}
export interface VersionRowProps {
  versions: ArtifactVersion[];
  /** Defaults to the last version. */
  currentId?: string;
  onSelect?: (id: string) => void;
  /** Revert APPENDS the restored version as a new revision — it never destroys the trail. */
  onRevert?: (id: string) => void;
  label?: string;
}
/** Every revision of an artifact, in the thread, with a revert on each. Without it an advisor who has
 *  revised a proposal twice has no way back to the version the client saw. */
export function VersionRow(props: VersionRowProps): JSX.Element;
