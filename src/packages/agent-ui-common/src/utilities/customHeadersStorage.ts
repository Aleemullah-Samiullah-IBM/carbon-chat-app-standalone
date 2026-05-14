/**
 * Utility functions for managing custom HTTP headers in locaolstorage
 */

export interface CustomHeader {
  id: string
  key: string
  value: string
}

const STORAGE_KEY = 'custom_http_headers'
const HOST_URL_STORAGE_KEY = 'custom_host_url'
const AGENT_TYPE_STORAGE_KEY = 'custom_agent_type'

/**
 * Get all custom headers from localStorage
 */
export const getCustomHeaders = (): CustomHeader[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading custom headers from storage:', error)
    return []
  }
}

/**
 * Save custom headers to localStorage
 */
export const saveCustomHeaders = (headers: CustomHeader[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(headers))
  } catch (error) {
    console.error('Error saving custom headers to storage:', error)
  }
}

/**
 * Convert custom headers array to headers object for API calls
 */
export const customHeadersToObject = (
  headers: CustomHeader[],
): Record<string, string> => {
  return headers.reduce(
    (acc, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value
      }
      return acc
    },
    {} as Record<string, string>,
  )
}

/**
 * Get the custom host URL from localStorage
 */
export const getCustomHostUrl = (): string | null => {
  try {
    return localStorage.getItem(HOST_URL_STORAGE_KEY)
  } catch (error) {
    console.error('Error reading custom host URL from storage:', error)
    return null
  }
}

/**
 * Save custom host URL to localStorage
 */
export const saveCustomHostUrl = (hostUrl: string): void => {
  try {
    if (hostUrl) {
      localStorage.setItem(HOST_URL_STORAGE_KEY, hostUrl)
    } else {
      localStorage.removeItem(HOST_URL_STORAGE_KEY)
    }
  } catch (error) {
    console.error('Error saving custom host URL to storage:', error)
  }
}

/**
 * Get the selected agent type from localStorage
 */
export const getCustomAgentType = (): string | null => {
  try {
    return localStorage.getItem(AGENT_TYPE_STORAGE_KEY)
  } catch (error) {
    console.error('Error reading custom agent type from storage:', error)
    return null
  }
}

/**
 * Save selected agent type to localStorage
 */
export const saveCustomAgentType = (agentType: string): void => {
  try {
    if (agentType) {
      localStorage.setItem(AGENT_TYPE_STORAGE_KEY, agentType)
    } else {
      localStorage.removeItem(AGENT_TYPE_STORAGE_KEY)
    }
  } catch (error) {
    console.error('Error saving custom agent type to storage:', error)
  }
}
