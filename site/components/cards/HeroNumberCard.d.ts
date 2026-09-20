export interface MeterRow {
  label: string;
  value: number;
  /** The binding (lowest) score — bronze fill, bold ink label, bronze-deep value. Every row is drawn; this one is only distinguished. */
  binding?: boolean;
}
export interface HeroNumberCardProps { title: string; meta: string; value: number; badge: string; copy: React.ReactNode; rows: MeterRow[]; }
export function HeroNumberCard(props: HeroNumberCardProps): JSX.Element;
export function useCountUp(target: number, ms: number, run?: boolean): number;
