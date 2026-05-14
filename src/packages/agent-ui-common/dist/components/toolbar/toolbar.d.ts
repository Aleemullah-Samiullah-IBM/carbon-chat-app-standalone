import { PlatformAPI } from '../../interfaces/platform';
export type ToolbarButton = {
    buttonIcon: React.ComponentType<any>;
    callback: () => void;
    label: string;
};
type ToolbarProps = {
    label?: string;
    onClickCallback: (button: string) => void;
    isDarkTheme: boolean;
    platformAPI: PlatformAPI;
    frontendClientType?: string;
    hideToolbarMenu?: boolean;
    showCustomHeaderMenuItem?: boolean;
    showSidebarButton?: boolean;
    sidebarOpen?: boolean;
    dropdownButtons?: ToolbarButton[];
    rightButtons?: ToolbarButton[];
};
export default function Toolbar({ label, onClickCallback, isDarkTheme, platformAPI, frontendClientType, // used to determine whether to show switch org or not
hideToolbarMenu, showCustomHeaderMenuItem, showSidebarButton, sidebarOpen, dropdownButtons, rightButtons, }: Readonly<ToolbarProps>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=toolbar.d.ts.map