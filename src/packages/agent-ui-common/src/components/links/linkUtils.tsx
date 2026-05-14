// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {jwtDecode} from 'jwt-decode'
import {FrontendContext} from '../../interfaces/platform'

/**
 * Shared utilities for link components
 * Consolidates URL determination logic to reduce duplication
 */

interface DecodedToken {
  realm?: string
}

/**
 * Determines the appropriate URL based on client type and configuration
 * @param opremUrl - URL for on-premises deployment
 * @param awsUrl - URL for AWS deployment
 * @param frontendClient - Frontend client context
 * @param accessToken - Optional access token for JWT decoding
 * @returns The appropriate URL to use
 */
export const determineUrl = (
  opremUrl: string,
  awsUrl: string,
  frontendClient?: FrontendContext,
  accessToken?: string,
): string => {
  // For APIM and API Studio Embedded clients, check apiConnectCfg
  if (
    frontendClient?.client === 'apim' ||
    frontendClient?.client === 'apistudio-embedded'
  ) {
    const apiConnectCfg = (window as any).apiConnectCfg
    return apiConnectCfg?.formFactor === 'aws' ? awsUrl : opremUrl
  }

  // For VS Code and API Studio Desktop clients, check JWT token realm
  if (
    frontendClient?.client === 'vscode' ||
    frontendClient?.client === 'apistudio-desktop'
  ) {
    if (accessToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(accessToken)
        return decoded.realm?.includes('ibm-verify') ? awsUrl : opremUrl
      } catch {
        return opremUrl
      }
    }
    return opremUrl
  }

  // Default to OPREM URL
  return opremUrl
}

/**
 * Handles link click based on client type
 * @param url - The URL to open
 * @param frontendClient - Frontend client context
 * @param vscode - VS Code API object (if applicable)
 */
export const handleLinkClick = (
  url: string,
  frontendClient?: FrontendContext,
  vscode?: any,
) => {
  if (frontendClient?.client === 'vscode' && vscode) {
    vscode.postMessage({
      type: 'openAgentDocumentation',
      value: url,
    })
  } else {
    window.open(url, '_blank')
  }
}

/**
 * Creates a link element with appropriate click handler
 * @param text - Link text to display
 * @param opremUrl - URL for on-premises deployment
 * @param awsUrl - URL for AWS deployment
 * @param frontendClient - Frontend client context
 * @param vscode - VS Code API object (if applicable)
 * @param accessToken - Optional access token for JWT decoding
 * @returns JSX link element
 */
export const createDocumentationLink = (
  text: string,
  opremUrl: string,
  awsUrl: string,
  frontendClient?: FrontendContext,
  vscode?: any,
  accessToken?: string,
) => {
  const url = determineUrl(opremUrl, awsUrl, frontendClient, accessToken)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleLinkClick(url, frontendClient, vscode)
  }

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
    >
      {text}
    </a>
  )
}
