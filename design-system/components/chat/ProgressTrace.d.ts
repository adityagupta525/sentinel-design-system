export interface ProgressTraceProps { /** Real work, named: "Reading Sharma's holdings — 18 funds". */ steps: string[]; stepMs?: number; /** Shown behind a left hairline once done and expanded. */ reasoning?: string; onDone?: () => void; /** false freezes the trace — and its clock — for specimens and artboards. Freeze it PAST the last
   *  step (initialActive >= steps.length) and it freezes in the FINISHED state instead: the header
   *  reads "Thought for Ns", the chevron appears and `reasoning` renders. That is the state worth
   *  putting on an artboard, and before v12 there was no way to reach it without running the clock. */
  autoplay?: boolean; initialActive?: number; /** Duration shown while frozen (autoplay=false). */ seconds?: number; }
export function ProgressTrace(props: ProgressTraceProps): JSX.Element;
