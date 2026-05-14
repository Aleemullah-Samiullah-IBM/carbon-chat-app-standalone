import {Link} from '@carbon/react'
import {jwtDecode} from 'jwt-decode'
import {
  AGENT_GETTING_STARTED_URL_OPREM,
  AGENT_GETTING_STARTED_URL_AWS,
} from '../../constants'

// Extend the Window interface to include apiConnectCfg
declare global {
  interface Window {
    apiConnectCfg?: {
      formFactor?: string
    }
  }
}
interface DecodedToken {
  realm?: string
  [key: string]: any
}

/**
 * Creates a "Learn more" link for API Agent configuration
 * @param accessToken Access token for authentication
 * @param frontendClientType - The client type (e.g., vscode)
 * @param vscode - The vscode API object if in VS Code environment
 * @returns React component with the appropriate learn more link
 */
export const documentationLink = (
  accessToken?: any,
  frontendClientType?: any,
  vscode?: any,
) => {
  let documentationVersion = AGENT_GETTING_STARTED_URL_OPREM
  const client = frontendClientType?.client
  if (client === 'apistudio-desktop' || client === 'vscode') {
    const data = accessToken ? jwtDecode<DecodedToken>(accessToken) : {}
    documentationVersion = data?.realm?.includes('provider/ibm-verify')
      ? AGENT_GETTING_STARTED_URL_AWS
      : AGENT_GETTING_STARTED_URL_OPREM
  } else {
    const {formFactor} = window.apiConnectCfg || {}
    documentationVersion = `${
      formFactor === 'aws'
        ? AGENT_GETTING_STARTED_URL_AWS
        : AGENT_GETTING_STARTED_URL_OPREM
    }`
  }

  return (
    <Link
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => {
        if (client === 'vscode') {
          vscode.postMessage({
            type: 'openAgentDocumentation',
            value: documentationVersion,
          })
        } else {
          window.open(documentationVersion, '_blank')
        }
      }}
    >
      documentation.
    </Link>
  )
}
