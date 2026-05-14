import { FrontendContext } from '../interfaces/platform';
interface Porg {
    name: string;
    title: string;
}
interface FetchOrgsResult {
    porgs: Porg[];
    isPorgError: boolean;
}
/**
 * Fetches organizations from the API service
 * @param apiService - The API service instance
 * @param setError - Error context function to set errors
 * @param vscode - VSCode API for extension context
 * @param frontendClient - Client object for learn more links
 * @param accessToken - Access token for authentication
 * @returns Object containing porgs array and error state
 */
export declare const fetchOrgs: (apiService: any, setError?: (error: any) => void, vscode?: any, frontendClient?: FrontendContext, accessToken?: any) => Promise<FetchOrgsResult>;
export {};
//# sourceMappingURL=porgHelpers.d.ts.map