export interface SentinelThinkingProps {
  /** What Sentinel is doing, in place of the "Sentinel" label — "Reading his Q3 statement…",
   *  "Checking the mandate…", "Pricing 3 moves…".
   *
   *  It must be TRUE and it must be CHECKABLE. The verb names the source the answer will cite, so a
   *  waiting state that says "Reading his Q3 statement…" and then produces a figure from somewhere
   *  else has lied about provenance — which rule 4 exists to prevent, and which costs more here than
   *  a bare pulse ever saves. Never a decorative "Thinking…", never a rotating list of verbs the
   *  system is not actually performing.
   *
   *  Present participle, one clause, an ellipsis at the end. Keep it under about 40 characters: it
   *  sits on one line beside the sparkle and truncation would cut the source name off.
   *
   *  Omit it and the label is "Sentinel" — the behaviour before v12, unchanged. */
  verb?: string;
}
/** The waiting state. Three bronze dots pulsing on opacity, 1.2s, staggered 150ms, under a shimmering
 *  label. No bounce, no spinner, no skeleton of a shape the answer may not take.
 *
 *  `verb` changes the label and NOTHING else. The motion is identical with it and without it — that
 *  is the point: what makes a wait readable is the system saying what it is doing, not the wait
 *  looking busier. */
export function SentinelThinking(props: SentinelThinkingProps): JSX.Element;
