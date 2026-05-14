// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {
  AGENT_GETTING_STARTED_URL_OPREM,
  AGENT_GETTING_STARTED_URL_AWS,
} from '../../constants'
import {createDocumentationLink} from './linkUtils'

/**
 * Creates a documentation link for API Agent
 * @param accessToken - Access token for authentication
 * @param frontendClientType - The client type (e.g., vscode)
 * @param vscode - The vscode API object if in VS Code environment
 * @returns React component with the appropriate documentation link
 */
export const documentationLink = (
  accessToken?: any,
  frontendClientType?: any,
  vscode?: any,
) => {
  return createDocumentationLink(
    'documentation.',
    AGENT_GETTING_STARTED_URL_OPREM,
    AGENT_GETTING_STARTED_URL_AWS,
    frontendClientType,
    vscode,
    accessToken,
  )
}
