export interface MoneyComposerProps { /** Receives the formatted rupee string, e.g. "₹1,80,000". */ onSend: (value: string) => void; placeholder?: string; }
export function MoneyComposer(props: MoneyComposerProps): JSX.Element;
export function formatINR(digits: string): string;
