export type StepState = 'pending' | 'running' | 'done' | 'failed';
export interface TraceStep {
  /** What was done, in the advisor's words — "read her holdings", not "fetched portfolio_v2". */
  label: string;
  state: StepState;
  /** Right-aligned, tabular — "12 holdings", "4 pages", "00:16". */
  meta?: string;
  /** One line of reasoning or provenance under the step. */
  detail?: string;
  /** Shown only on a failed step: a Pill that retries just this stage. */
  retry?: React.ReactNode;
}
export interface StepTraceProps {
  steps: TraceStep[];
  /** The collapsed one-liner. Derived when omitted: "Read 3 sources" / the running step / "Could not finish". */
  summary?: string;
  /** Controlled disclosure. Omit to let the component own it. */
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  /** id of the step list, wired to the summary's aria-controls. Unique per instance on a screen. */
  id?: string;
  /** 8px step gap instead of 12 — for the parse checklist inside a file chip. */
  dense?: boolean;
}
/** What the assistant did, as collapsible one-line rows with per-step state. Also serves FileUpload's
 *  staged parse: the stages ARE the success summary arriving progressively. Only the active step is at
 *  full opacity; pending steps sit at 40%. A failed step keeps its place, carries the word, and offers
 *  its retry inline — never disappears. */
export function StepTrace(props: StepTraceProps): JSX.Element;
