// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import {
  setupLinkTests,
  cleanupLinkTests,
  testApimClient,
  testVscodeClient,
  testApiStudioDesktopClient,
  testApiStudioEmbeddedClient,
  testLinkAttributes,
  testTokenDecoding,
  setApiConnectCfg,
} from './linkTestHelpers'
import {jwtDecode} from 'jwt-decode'

/**
 * Shared test suite runner for link components
 * Eliminates duplication between documentationLink and learnMoreLink tests
 */

export interface LinkTestConfig {
  componentName: string
  linkText: string
  opremUrl: string
  awsUrl: string
  renderLink: (accessToken?: any, frontendClientType?: any, vscode?: any) => any
  hasNoParamsTest?: boolean
}

export const runLinkTestSuite = (config: LinkTestConfig) => {
  describe(config.componentName, () => {
    let windowOpenSpy: any
    let mockVscode: any

    beforeEach(() => {
      const setup = setupLinkTests()
      windowOpenSpy = setup.windowOpenSpy
      mockVscode = setup.mockVscode
    })

    afterEach(() => {
      cleanupLinkTests(windowOpenSpy)
    })

    const testConfig = {
      linkText: config.linkText,
      opremUrl: config.opremUrl,
      awsUrl: config.awsUrl,
      renderLink: config.renderLink,
    }

    describe('APIM client (web-based)', () => {
      const tests = testApimClient(testConfig)

      it('renders link with correct text', () =>
        tests['renders link with correct text']())
      it('uses OPREM URL when formFactor is not aws', () =>
        tests['uses OPREM URL when formFactor is not aws'](windowOpenSpy))
      it('uses AWS URL when formFactor is aws', () =>
        tests['uses AWS URL when formFactor is aws'](windowOpenSpy))
      it('uses OPREM URL when apiConnectCfg is undefined', () =>
        tests['uses OPREM URL when apiConnectCfg is undefined'](windowOpenSpy))
      it('uses OPREM URL when formFactor is undefined', () =>
        tests['uses OPREM URL when formFactor is undefined'](windowOpenSpy))
      it('opens link in new window when clicked', () =>
        tests['opens link in new window when clicked'](windowOpenSpy))
    })

    describe('VS Code client', () => {
      const tests = testVscodeClient(testConfig)

      it('posts message to vscode when clicked', () =>
        tests['posts message to vscode when clicked'](
          mockVscode,
          windowOpenSpy,
        ))
      it('uses OPREM URL when realm does not include ibm-verify', () =>
        tests['uses OPREM URL when realm does not include ibm-verify'](
          mockVscode,
        ))
      it('uses AWS URL when realm includes ibm-verify', () =>
        tests['uses AWS URL when realm includes ibm-verify'](mockVscode))
      it('uses OPREM URL when accessToken is not provided', () =>
        tests['uses OPREM URL when accessToken is not provided'](mockVscode))
      it('uses OPREM URL when decoded token has no realm', () =>
        tests['uses OPREM URL when decoded token has no realm'](mockVscode))
    })

    describe('API Studio Desktop client', () => {
      const tests = testApiStudioDesktopClient(testConfig)

      it('uses OPREM URL when realm does not include ibm-verify', () =>
        tests['uses OPREM URL when realm does not include ibm-verify'](
          windowOpenSpy,
        ))
      it('uses AWS URL when realm includes ibm-verify', () =>
        tests['uses AWS URL when realm includes ibm-verify'](windowOpenSpy))
      it('uses OPREM URL when accessToken is not provided', () =>
        tests['uses OPREM URL when accessToken is not provided'](windowOpenSpy))
      it('opens link in new window when clicked', () =>
        tests['opens link in new window when clicked'](windowOpenSpy))
    })

    describe('API Studio Embedded client', () => {
      const tests = testApiStudioEmbeddedClient(testConfig)

      it('uses OPREM URL when formFactor is not aws', () =>
        tests['uses OPREM URL when formFactor is not aws'](windowOpenSpy))
      it('uses AWS URL when formFactor is aws', () =>
        tests['uses AWS URL when formFactor is aws'](windowOpenSpy))
    })

    describe('Link attributes', () => {
      const tests = testLinkAttributes(testConfig)

      it('has target="_blank" attribute', () =>
        tests['has target="_blank" attribute']())
      it('has rel="noopener noreferrer" attribute', () =>
        tests['has rel="noopener noreferrer" attribute']())
    })

    describe('Token decoding', () => {
      const tests = testTokenDecoding(testConfig)

      it('calls jwtDecode with correct token for vscode client', () =>
        tests['calls jwtDecode with correct token for vscode client'](
          mockVscode,
        ))
      it('calls jwtDecode with correct token for apistudio-desktop client', () =>
        tests[
          'calls jwtDecode with correct token for apistudio-desktop client'
        ]())
      it('does not call jwtDecode for apim client', () =>
        tests['does not call jwtDecode for apim client']())
      it('does not call jwtDecode for apistudio-embedded client', () =>
        tests['does not call jwtDecode for apistudio-embedded client']())
    })

    describe('URL selection logic', () => {
      it('correctly determines URL based on client type and configuration', () => {
        // Test APIM with AWS
        setApiConnectCfg('aws')
        const apimClient = {client: 'apim'}
        render(config.renderLink(undefined, apimClient))
        let link = screen.getByText(config.linkText)
        fireEvent.click(link)
        expect(windowOpenSpy).toHaveBeenLastCalledWith(config.awsUrl, '_blank')

        // Test vscode with AWS realm
        windowOpenSpy.mockClear()
        const vscodeClient = {client: 'vscode'}
        const mockToken = 'test.token'
        vi.mocked(jwtDecode).mockReturnValue({
          realm: 'provider/ibm-verify/test',
        })
        render(config.renderLink(mockToken, vscodeClient, mockVscode))
        link = screen.getAllByText(config.linkText)[1]
        fireEvent.click(link)
        expect(mockVscode.postMessage).toHaveBeenCalledWith({
          type: 'openAgentDocumentation',
          value: config.awsUrl,
        })
      })
    })

    if (config.hasNoParamsTest) {
      describe('No parameters provided', () => {
        it('uses default OPREM URL when no parameters are provided', () => {
          render(config.renderLink())
          const link = screen.getByText(config.linkText)
          fireEvent.click(link)

          expect(windowOpenSpy).toHaveBeenCalledWith(config.opremUrl, '_blank')
        })
      })
    }
  })
}
