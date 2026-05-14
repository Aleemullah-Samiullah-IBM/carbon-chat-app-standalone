// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {
  AGENT_CONFIGURING_URL_OPREM,
  AGENT_CONFIGURING_URL_AWS,
} from '../../constants'
import {FrontendContext} from '../../interfaces/platform'
import {createDocumentationLink} from './linkUtils'

/**
 * Creates a "Learn more" link for API Agent configuration
 * @param frontendClient - The frontend client object to determine client type (e.g., vscode)
 * @param vscode - The vscode API object if in VS Code environment
 * @param accessToken - Optional access token for JWT decoding
 * @returns React component with the appropriate learn more link
 */
export const getLearnMoreLink = (
  frontendClient: FrontendContext | undefined,
  vscode?: any,
  accessToken?: any,
) => {
  return createDocumentationLink(
    'Learn more about configuring API Agent.',
    AGENT_CONFIGURING_URL_OPREM,
    AGENT_CONFIGURING_URL_AWS,
    frontendClient,
    vscode,
    accessToken,
  )
}
