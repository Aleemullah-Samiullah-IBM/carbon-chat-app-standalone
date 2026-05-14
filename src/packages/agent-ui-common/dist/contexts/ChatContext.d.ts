import { default as React, RefObject, ReactNode } from 'react';
import { Plan } from '../types';
import { FileMeta } from '../types/FileData';
export interface InputContextType {
    setPromptValue: (value: string) => void;
    registerInputHandler: (fn: (value: string) => void) => void;
    inputRef: RefObject<HTMLTextAreaElement | null>;
}
export declare const InputContext: React.Context<InputContextType>;
interface InputProviderProps {
    children: ReactNode;
}
export declare const InputProvider: ({ children }: InputProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useInput: () => InputContextType;
interface AuthState {
    API_URL: string;
    OVERRIDE_TOKEN: string;
    'X-ibm-user': string;
    'X-ibm-org': string;
    nonce: string;
}
export interface ChatContextType {
    plan: Plan | null;
    setPlan: (plan: Plan) => void;
    startNewChat: boolean;
    setStartNewChat: (id: boolean) => void;
    isApprovalSubmitting: boolean;
    setIsApprovalSubmitting: (id: boolean) => void;
    apicToken: string;
    setApicToken: (id: string) => void;
    apicTokenExpirationDate: string;
    setApicTokenExpirationDate: (id: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (id: boolean) => void;
    hostUrl: string;
    setHostUrl: (id: string) => void;
    showPorgSelection: boolean;
    setShowPorgSelection: (id: boolean) => void;
    showProjectSelection: boolean;
    setShowProjectSelection: (id: boolean) => void;
    auth: AuthState;
    setAuth: (id: AuthState) => void;
    nonce: string;
    setNonce: (id: string) => void;
    checkLogin: () => boolean;
    selectedFiles: FileMeta[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<FileMeta[]>>;
    isDarkTheme: boolean;
    setIsDarkTheme: (value: boolean) => void;
}
interface ChatProviderProps {
    children: ReactNode;
}
export declare const ChatProvider: ({ children }: ChatProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useMyContext: () => ChatContextType;
export {};
//# sourceMappingURL=ChatContext.d.ts.map