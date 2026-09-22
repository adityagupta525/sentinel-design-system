import * as React from 'react';

export interface FilterOption {
  /** The value stored in `value[group.key]`. */
  value: string;
  /** What the advisor reads: a BAND, not a number — "Under 0.7%", "AA and above", "1–3 years". */
  label: string;
  /** How many rows this option would leave. Rendered beside the label, because a count beside each
   *  option is one of the two highest-impact things a filter interface can carry. `0` renders the
   *  option inert — an option that leads nowhere should not be tappable. */
  count?: number | null;
}

export interface FilterGroup {
  key: string;
  /** The facet's name, shown as an eyebrow: "Expense ratio", "Risk". */
  label: string;
  /** One line under the label where the facet needs a word of explanation. */
  note?: string;
  /** 'single' clears on re-tap; 'multi' accumulates into an array. Default 'single'. */
  mode?: 'single' | 'multi';
  options: FilterOption[];
}

export interface FilterSheetProps {
  open: boolean;
  title?: string;
  groups: FilterGroup[];
  /** Selections, keyed by group. A string for 'single', an array for 'multi'. The applied-chip row is
   *  DERIVED from this — never pass applied filters separately, or the chips and the list can disagree. */
  value?: Record<string, string | string[] | null>;
  onChange?: (groupKey: string, next: string | string[] | null) => void;
  /** How many rows the current selection leaves. Rides the commit button. `null` when not yet known;
   *  `0` turns the button into a sentence that says so and offers the fix. */
  resultCount?: number | null;
  /** What `resultCount` counts. Defaults to 'funds'. */
  unit?: string;
  onApply?: () => void;
  onClose?: () => void;
  onClearAll?: () => void;
}

/**
 * A batch filter sheet: selections are held and committed once, with the result count on the commit.
 *
 * Batch rather than live because a phone should not spend a page load per tap; bands rather than
 * sliders because an advisor mid-call thinks in "under 0.7", not in 0.63 — and a band can carry its
 * own count where a slider cannot. Applied filters stay visible as removable chips, because an
 * advisor has to be able to read them aloud to a client.
 *
 * MUST be mounted closed and opened by a state change. The Tab trap arms on the false → true
 * transition only (F-25); a sheet rendered already open takes the page's keyboard.
 *
 * Zero matches is a sentence on the button, not a dead control: the sheet still closes, so the
 * advisor can see what they asked for and relax one filter.
 */
export function FilterSheet(props: FilterSheetProps): JSX.Element | null;
