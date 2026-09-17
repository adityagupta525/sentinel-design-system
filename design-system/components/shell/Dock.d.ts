export interface DockProps { /** Contextual AnswerChips, optional. */ chips?: React.ReactNode; /** DarkButton, optional — stacks ABOVE the composer, never replaces it. */ cta?: React.ReactNode; /** Composer or MoneyComposer — required on every screen. */ composer: React.ReactNode; disclosure?: boolean; }
export function Dock(props: DockProps): JSX.Element;
