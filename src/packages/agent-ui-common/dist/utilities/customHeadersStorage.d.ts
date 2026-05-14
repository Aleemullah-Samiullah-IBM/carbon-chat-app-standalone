/**
 * Utility functions for managing custom HTTP headers in locaolstorage
 */
export interface CustomHeader {
    id: string;
    key: string;
    value: string;
}
/**
 * Get all custom headers from localStorage
 */
export declare const getCustomHeaders: () => CustomHeader[];
/**
 * Save custom headers to localStorage
 */
export declare const saveCustomHeaders: (headers: CustomHeader[]) => void;
/**
 * Convert custom headers array to headers object for API calls
 */
export declare const customHeadersToObject: (headers: CustomHeader[]) => Record<string, string>;
/**
 * Get the custom host URL from localStorage
 */
export declare const getCustomHostUrl: () => string | null;
/**
 * Save custom host URL to localStorage
 */
export declare const saveCustomHostUrl: (hostUrl: string) => void;
/**
 * Get the selected agent type from localStorage
 */
export declare const getCustomAgentType: () => string | null;
/**
 * Save selected agent type to localStorage
 */
export declare const saveCustomAgentType: (agentType: string) => void;
//# sourceMappingURL=customHeadersStorage.d.ts.map