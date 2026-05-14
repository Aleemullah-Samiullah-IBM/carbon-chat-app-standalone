// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {vi} from 'vitest'
import {documentationLink} from './documentationLink'
import {
  AGENT_GETTING_STARTED_URL_OPREM,
  AGENT_GETTING_STARTED_URL_AWS,
} from '../../constants'
import {runLinkTestSuite} from './sharedLinkTests'

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))

runLinkTestSuite({
  componentName: 'documentationLink',
  linkText: 'documentation.',
  opremUrl: AGENT_GETTING_STARTED_URL_OPREM,
  awsUrl: AGENT_GETTING_STARTED_URL_AWS,
  renderLink: documentationLink,
  hasNoParamsTest: true,
})
