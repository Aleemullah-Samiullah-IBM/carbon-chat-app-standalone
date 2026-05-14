import { RefObject } from 'react';
import { Command } from '../../../types/Command';
type CommandMenuProps = {
    commands: Command[];
    input: string;
    menuRef: RefObject<HTMLDivElement | null>;
    onInputChange: (e: string) => void;
    showCommandOrParameterMenu: boolean;
    isNavigating: boolean;
    setIsNavigatingMenu: (e: boolean) => void;
};
export declare const CommandMenu: ({ commands: initialCommands, input, menuRef, onInputChange, showCommandOrParameterMenu, isNavigating, setIsNavigatingMenu, }: CommandMenuProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=commandMenu.d.ts.map