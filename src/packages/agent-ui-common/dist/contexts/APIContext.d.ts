import { ReactNode } from 'react';
import { default as ApiService } from '../services/apiservice';
import { AuthContext, FrontendContext } from '../interfaces/platform';
type PorgType = string | number | undefined;
interface APIContextType {
    apiService: ApiService | null;
    setApiService: (id: ApiService) => void;
    configureService: (hostUrl: string, apiBasePath: string, token: string, user: string, porg: string, frontendContext: FrontendContext | undefined, authContext: AuthContext, programmaticHeaders?: Record<string, string>) => void;
    porg: PorgType;
    setPorg: (id: string | number | undefined) => void;
    hidePorg: boolean;
    setHidePorg: (id: boolean) => void;
    isPorgError: boolean;
    setIsPorgError: (error: boolean) => void;
}
interface APIProviderProps {
    children: ReactNode;
}
export declare const APIProvider: ({ children }: APIProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useAPI: () => APIContextType;
export {};
//# sourceMappingURL=APIContext.d.ts.map