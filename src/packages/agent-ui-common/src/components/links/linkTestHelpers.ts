// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import {jwtDecode} from 'jwt-decode'
import React from 'react'
import {
  createMockVscode,
  setupWindowMocks,
  cleanupWindowMocks,
  setApiConnectCfg,
} from '../../tests/sharedTestHelpers'

// Re-export shared helpers for backward compatibility
export {
  createMockVscode,
  setupWindowMocks,
  cleanupWindowMocks,
  setApiConnectCfg,
}

/**
 * Shared test utilities for link components
 * Reduces duplication between documentationLink and learnMoreLink tests
 */

export interface LinkTestConfig {
  linkText: string
  opremUrl: string
  awsUrl: string
  renderLink: (
    accessToken?: any,
    frontendClientType?: any,
    vscode?: any,
  ) => React.ReactElement
}

export interface LinkTestSetup {
  windowOpenSpy: any
  mockVscode: any
}

/**
 * Setup function for link tests
 */
export const setupLinkTests = (): LinkTestSetup => {
  vi.clearAllMocks()
  const mocks = setupWindowMocks()
  const mockVscode = createMockVscode()
  return {
    windowOpenSpy: mocks.windowOpenSpy,
    mockVscode,
  }
}

/**
 * Cleanup function for link tests
 */
export const cleanupLinkTests = (windowOpenSpy: any) => {
  cleanupWindowMocks(windowOpenSpy)
}

/**
 * Test suite for APIM client behavior
 */
export const testApimClient = (config: LinkTestConfig) => {
  const {linkText, opremUrl, awsUrl, renderLink} = config

  return {
    'renders link with correct text': () => {
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      expect(link).toBeInTheDocument()
    },

    'uses OPREM URL when formFactor is not aws': (windowOpenSpy: any) => {
      setApiConnectCfg('onprem')
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(opremUrl, '_blank')
    },

    'uses AWS URL when formFactor is aws': (windowOpenSpy: any) => {
      setApiConnectCfg('aws')
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(awsUrl, '_blank')
    },

    'uses OPREM URL when apiConnectCfg is undefined': (windowOpenSpy: any) => {
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(opremUrl, '_blank')
    },

    'uses OPREM URL when formFactor is undefined': (windowOpenSpy: any) => {
      setApiConnectCfg()
      ;(window as any).apiConnectCfg = {}
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(opremUrl, '_blank')
    },

    'opens link in new window when clicked': (windowOpenSpy: any) => {
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    },
  }
}

/**
 * Test suite for VS Code client behavior
 */
export const testVscodeClient = (config: LinkTestConfig) => {
  const {linkText, opremUrl, awsUrl, renderLink} = config

  return {
    'posts message to vscode when clicked': (
      mockVscode: any,
      windowOpenSpy: any,
    ) => {
      const frontendClientType = {client: 'vscode'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/default'})
      render(renderLink(mockToken, frontendClientType, mockVscode))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(mockVscode.postMessage).toHaveBeenCalledWith({
        type: 'openAgentDocumentation',
        value: opremUrl,
      })
      expect(windowOpenSpy).not.toHaveBeenCalled()
    },

    'uses OPREM URL when realm does not include ibm-verify': (
      mockVscode: any,
    ) => {
      const frontendClientType = {client: 'vscode'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/default'})
      render(renderLink(mockToken, frontendClientType, mockVscode))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(mockVscode.postMessage).toHaveBeenCalledWith({
        type: 'openAgentDocumentation',
        value: opremUrl,
      })
    },

    'uses AWS URL when realm includes ibm-verify': (mockVscode: any) => {
      const frontendClientType = {client: 'vscode'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/ibm-verify/test'})
      render(renderLink(mockToken, frontendClientType, mockVscode))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(mockVscode.postMessage).toHaveBeenCalledWith({
        type: 'openAgentDocumentation',
        value: awsUrl,
      })
    },

    'uses OPREM URL when accessToken is not provided': (mockVscode: any) => {
      const frontendClientType = {client: 'vscode'}
      render(renderLink(undefined, frontendClientType, mockVscode))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(mockVscode.postMessage).toHaveBeenCalledWith({
        type: 'openAgentDocumentation',
        value: opremUrl,
      })
    },

    'uses OPREM URL when decoded token has no realm': (mockVscode: any) => {
      const frontendClientType = {client: 'vscode'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({})
      render(renderLink(mockToken, frontendClientType, mockVscode))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(mockVscode.postMessage).toHaveBeenCalledWith({
        type: 'openAgentDocumentation',
        value: opremUrl,
      })
    },
  }
}

/**
 * Test suite for API Studio Desktop client behavior
 */
export const testApiStudioDesktopClient = (config: LinkTestConfig) => {
  const {linkText, opremUrl, awsUrl, renderLink} = config

  return {
    'uses OPREM URL when realm does not include ibm-verify': (
      windowOpenSpy: any,
    ) => {
      const frontendClientType = {client: 'apistudio-desktop'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/default'})
      render(renderLink(mockToken, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(opremUrl, '_blank')
    },

    'uses AWS URL when realm includes ibm-verify': (windowOpenSpy: any) => {
      const frontendClientType = {client: 'apistudio-desktop'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/ibm-verify/test'})
      render(renderLink(mockToken, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(awsUrl, '_blank')
    },

    'uses OPREM URL when accessToken is not provided': (windowOpenSpy: any) => {
      const frontendClientType = {client: 'apistudio-desktop'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(opremUrl, '_blank')
    },

    'opens link in new window when clicked': (windowOpenSpy: any) => {
      const frontendClientType = {client: 'apistudio-desktop'}
      const mockToken = 'mock.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/default'})
      render(renderLink(mockToken, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    },
  }
}

/**
 * Test suite for API Studio Embedded client behavior
 */
export const testApiStudioEmbeddedClient = (config: LinkTestConfig) => {
  const {linkText, opremUrl, awsUrl, renderLink} = config

  return {
    'uses OPREM URL when formFactor is not aws': (windowOpenSpy: any) => {
      setApiConnectCfg('onprem')
      const frontendClientType = {client: 'apistudio-embedded'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(opremUrl, '_blank')
    },

    'uses AWS URL when formFactor is aws': (windowOpenSpy: any) => {
      setApiConnectCfg('aws')
      const frontendClientType = {client: 'apistudio-embedded'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      fireEvent.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith(awsUrl, '_blank')
    },
  }
}

/**
 * Test suite for link attributes
 */
export const testLinkAttributes = (config: LinkTestConfig) => {
  const {linkText, renderLink} = config

  return {
    'has target="_blank" attribute': () => {
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      expect(link).toHaveAttribute('target', '_blank')
    },

    'has rel="noopener noreferrer" attribute': () => {
      const frontendClientType = {client: 'apim'}
      render(renderLink(undefined, frontendClientType))
      const link = screen.getByText(linkText)
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    },
  }
}

/**
 * Test suite for token decoding
 */
export const testTokenDecoding = (config: LinkTestConfig) => {
  const {renderLink} = config

  return {
    'calls jwtDecode with correct token for vscode client': (
      mockVscode: any,
    ) => {
      const frontendClientType = {client: 'vscode'}
      const mockToken = 'test.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/default'})
      render(renderLink(mockToken, frontendClientType, mockVscode))
      expect(jwtDecode).toHaveBeenCalledWith(mockToken)
    },

    'calls jwtDecode with correct token for apistudio-desktop client': () => {
      const frontendClientType = {client: 'apistudio-desktop'}
      const mockToken = 'test.jwt.token'
      vi.mocked(jwtDecode).mockReturnValue({realm: 'provider/default'})
      render(renderLink(mockToken, frontendClientType))
      expect(jwtDecode).toHaveBeenCalledWith(mockToken)
    },

    'does not call jwtDecode for apim client': () => {
      const frontendClientType = {client: 'apim'}
      setApiConnectCfg('aws')
      render(renderLink(undefined, frontendClientType))
      expect(jwtDecode).not.toHaveBeenCalled()
    },

    'does not call jwtDecode for apistudio-embedded client': () => {
      const frontendClientType = {client: 'apistudio-embedded'}
      setApiConnectCfg('aws')
      render(renderLink(undefined, frontendClientType))
      expect(jwtDecode).not.toHaveBeenCalled()
    },
  }
}
