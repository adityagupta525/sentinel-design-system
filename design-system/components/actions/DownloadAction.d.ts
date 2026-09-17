export interface DownloadActionProps {
  /** Defaults to `Download ${format}`. */
  label?: string;
  format?: 'PDF' | 'PPTX' | 'CSV' | string;
  /** May return a promise — the pill holds its loading state until it settles. */
  onDownload?: (format: string) => void | Promise<void>;
  size?: 'md' | 'sm';
  tone?: 'outline' | 'smart' | 'tertiary' | 'muted' | 'primary' | 'filter';
  disabled?: boolean;
}
/** A deliberately thin Pill wrapper: "download" as one decision in one place instead of a loading flag
 *  wired by hand at every call site. Confirmation lands ON the control ("Saved to Files", 2s) because
 *  this product has no toasts; failure says what to do next, not what broke. */
export function DownloadAction(props: DownloadActionProps): JSX.Element;
