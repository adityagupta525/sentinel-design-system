export type ChipVariant = 'outline' | 'smart' | 'tertiary' | 'muted' | 'primary';
export interface AnswerChipProps { label: string; /** Turns the chip into a full-width card-with-subtitle (used only where the wording changes the meaning). */ subtitle?: string; variant?: ChipVariant; selected?: boolean; onClick?: () => void; }
export function AnswerChip(props: AnswerChipProps): JSX.Element;
