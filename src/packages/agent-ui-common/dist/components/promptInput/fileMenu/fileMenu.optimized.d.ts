import { RefObject } from 'react';
import { FileProvider } from '../../../interfaces/platform';
type FileMenuProps = {
    currentWord: string;
    getNewInput: (input: string) => string;
    menuRef: RefObject<HTMLDivElement | null>;
    onInputChange: (e: string) => void;
    setShowFileMenu: (show: boolean) => void;
    showFileMenu: boolean;
    isNavigating: boolean;
    fileProvider: FileProvider;
};
export declare const FileMenu: import('react').MemoExoticComponent<({ currentWord, getNewInput, menuRef, onInputChange, setShowFileMenu, showFileMenu, isNavigating, fileProvider, }: FileMenuProps) => import("react/jsx-runtime").JSX.Element | null>;
export {};
//# sourceMappingURL=fileMenu.optimized.d.ts.map