/**
 * Utility functions for managing programmatic HTTP headers
 * These headers are set at application initialization time (e.g., from environment variables)
 * and are applied to all API requests.
 */
/**
 * Parse programmatic headers from environment variables
 * Expects format: VITE_CUSTOM_HEADER_KEY1=value1,VITE_CUSTOM_HEADER_KEY2=value2
 * Or individual variables: VITE_CUSTOM_HEADER_X_IBM_ORG_ID=value
 *
 * @param env - Environment variables object (e.g., import.meta.env)
 * @param prefix - Prefix for header environment variables (default: 'VITE_CUSTOM_HEADER_')
 * @returns Record of header key-value pairs
 */
export declare function parseProgrammaticHeaders(env: Record<string, any>, prefix?: string): Record<string, string>;
/**
 * Create programmatic headers from a simple object
 * Useful for non-environment-based configuration
 *
 * @param headers - Object with header key-value pairs
 * @returns Validated headers object
 */
export declare function createProgrammaticHeaders(headers: Record<string, string | undefined>): Record<string, string>;
/**
 * Merge multiple header sources with priority
 * Later sources override earlier ones
 *
 * @param headerSources - Array of header objects to merge
 * @returns Merged headers object
 */
export declare function mergeProgrammaticHeaders(...headerSources: Array<Record<string, string> | undefined>): Record<string, string>;
//# sourceMappingURL=programmaticHeaders.d.ts.map