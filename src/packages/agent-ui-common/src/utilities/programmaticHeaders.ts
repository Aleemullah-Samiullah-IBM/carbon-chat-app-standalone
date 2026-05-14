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
export function parseProgrammaticHeaders(
  env: Record<string, any>,
  prefix: string = 'VITE_CUSTOM_HEADER_',
): Record<string, string> {
  const headers: Record<string, string> = {}

  // Iterate through all environment variables
  Object.keys(env).forEach(key => {
    if (key.startsWith(prefix)) {
      // Extract header name from env var name
      // e.g., VITE_CUSTOM_HEADER_X_IBM_ORG_ID -> X-ibm-org-id
      const headerName = key
        .substring(prefix.length)
        .replace(/_/g, '-')
        .toLowerCase()
        // Capitalize first letter of each segment
        .split('-')
        .map((segment, index) => {
          // Keep 'ibm' lowercase, capitalize others
          if (segment === 'ibm') return segment
          return index === 0
            ? segment.charAt(0).toUpperCase() + segment.slice(1)
            : segment
        })
        .join('-')

      const value = env[key]
      if (value && typeof value === 'string') {
        headers[headerName] = value
      }
    }
  })

  return headers
}

/**
 * Create programmatic headers from a simple object
 * Useful for non-environment-based configuration
 *
 * @param headers - Object with header key-value pairs
 * @returns Validated headers object
 */
export function createProgrammaticHeaders(
  headers: Record<string, string | undefined>,
): Record<string, string> {
  const validHeaders: Record<string, string> = {}

  Object.entries(headers).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      validHeaders[key] = value.trim()
    }
  })

  return validHeaders
}

/**
 * Merge multiple header sources with priority
 * Later sources override earlier ones
 *
 * @param headerSources - Array of header objects to merge
 * @returns Merged headers object
 */
export function mergeProgrammaticHeaders(
  ...headerSources: Array<Record<string, string> | undefined>
): Record<string, string> {
  return headerSources.reduce<Record<string, string>>((acc, headers) => {
    if (headers) {
      return {...acc, ...headers}
    }
    return acc
  }, {})
}
