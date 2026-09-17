import type { TraceStep } from '../chat/StepTrace';
export interface UploadedFile {
  name: string;
  /** "4 pages · 1.2 MB · added just now" — tabular, so the column does not jitter. */
  meta?: string;
}
export interface FileUploadProps {
  file: UploadedFile;
  /** The parse stages. The same TraceStep shape StepTrace takes — because the stages ARE the summary
   *  arriving progressively, there is no separate success state to design. */
  stages: TraceStep[];
  state?: 'parsing' | 'done' | 'failed';
  /** The outcome line, in the advisor's world: "read her September statement · 4 pages · 12 holdings".
   *  Never "uploaded successfully". */
  summary?: string;
  /** Retries ONE stage, so a failed step does not mean re-uploading a 40-page statement. */
  onRetry?: (stageLabel: string) => void;
  onRemove?: () => void;
  /** A follow-up row or chip under the trace — Notion's file-chip-then-follow-up shape. */
  actions?: React.ReactNode;
}
/** The file as a chip in the thread, parsing in stages. A failed stage keeps its place and carries its
 *  own retry. */
export function FileUpload(props: FileUploadProps): JSX.Element;
