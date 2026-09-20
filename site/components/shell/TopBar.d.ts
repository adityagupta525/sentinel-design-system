export interface TopBarProps { onMenu?: () => void; onNew?: () => void; /** Centre pill label; "Sentinel" in the app. */ title?: string; }
export function TopBar(props: TopBarProps): JSX.Element;
