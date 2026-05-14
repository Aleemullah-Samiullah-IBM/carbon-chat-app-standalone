// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {vi} from 'vitest'
import {getLearnMoreLink} from './learnMoreLink'
import {
  AGENT_CONFIGURING_URL_OPREM,
  AGENT_CONFIGURING_URL_AWS,
} from '../../constants'
import {runLinkTestSuite} from './sharedLinkTests'

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))

// Adapter function to match the signature expected by test utilities
const renderLink = (
  accessToken?: any,
  frontendClientType?: any,
  vscode?: any,
) => {
  return getLearnMoreLink(frontendClientType, vscode, accessToken)
}

runLinkTestSuite({
  componentName: 'getLearnMoreLink',
  linkText: 'Learn more about configuring API Agent.',
  opremUrl: AGENT_CONFIGURING_URL_OPREM,
  awsUrl: AGENT_CONFIGURING_URL_AWS,
  renderLink,
  hasNoParamsTest: false,
})
