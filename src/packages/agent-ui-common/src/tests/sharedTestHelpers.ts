// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {vi} from 'vitest'

/**
 * Shared test utilities for all component tests
 * This file consolidates common test helpers to reduce duplication
 */

// ============================================================================
// Mock Creation Helpers
// ============================================================================

export const createMockVscode = () => ({
  postMessage: vi.fn(),
})

export const createMockApiService = () => ({
  createNewChat: vi.fn(),
  getAllChats: vi.fn(),
  getChat: vi.fn(),
  getCommands: vi.fn(),
  postChat: vi.fn(),
  postPlan: vi.fn(),
  postSelection: vi.fn(),
  fetchOrgs: vi.fn(),
  setPorg: vi.fn(),
})

export const createMockContextSetters = () => ({
  mockSetError: vi.fn(),
  mockClearError: vi.fn(),
  mockSetPlan: vi.fn(),
  mockSetStartNewChat: vi.fn(),
  mockSetSelectedFiles: vi.fn(),
  mockSetShowPorgSelection: vi.fn(),
  mockSetShowProjectSelection: vi.fn(),
  mockSetHostUrl: vi.fn(),
  mockSetApicToken: vi.fn(),
  mockSetIsDarkTheme: vi.fn(),
  mockSetPorg: vi.fn(),
  mockSetHidePorg: vi.fn(),
  mockConfigureService: vi.fn(),
})

export const createMockApiConfig = (overrides?: any) => ({
  hostUrl: 'https://test.com',
  token: 'test-token',
  user: 'test-user',
  org: 'test-org',
  ...overrides,
})

export const createMockParentContext = (clientType: string = 'web') => ({
  clientType,
  apimInstances: [],
  selectedAPIMInstance: undefined,
  selectedPorg: undefined,
})

export const createMockPorgs = () => [
  {name: 'org1', title: 'Organization 1'},
  {name: 'org2', title: 'Organization 2'},
  {name: 'org3', title: 'Organization 3'},
]

export const createMockFrontendClient = (client: string = 'vscode') => ({
  client,
})

// ============================================================================
// Window Mock Helpers
// ============================================================================

export const setupWindowMocks = () => {
  const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  delete (window as any).apiConnectCfg
  return {windowOpenSpy}
}

export const cleanupWindowMocks = (windowOpenSpy: any) => {
  windowOpenSpy.mockRestore()
}

export const setApiConnectCfg = (formFactor?: string) => {
  if (formFactor) {
    ;(window as any).apiConnectCfg = {formFactor}
  } else {
    delete (window as any).apiConnectCfg
  }
}

// ============================================================================
// Clipboard Mock Helpers
// ============================================================================

export const setupClipboardMock = () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(),
    },
  })
}

export const verifyClipboardWrite = (expectedText: string) => {
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText)
}

// ============================================================================
// API Service Setup Helpers
// ============================================================================

export const setupSuccessfulOrgFetch = (fetchOrgs: any, porgs: any[]) => {
  vi.mocked(fetchOrgs).mockResolvedValue({
    porgs,
    isPorgError: false,
  })
}

export const setupErrorOrgFetch = (fetchOrgs: any) => {
  vi.mocked(fetchOrgs).mockResolvedValue({
    porgs: [],
    isPorgError: true,
  })
}

export const setupDelayedOrgFetch = (
  fetchOrgs: any,
  porgs: any[],
  delay: number = 100,
) => {
  vi.mocked(fetchOrgs).mockImplementation(
    (() =>
      new Promise(resolve => {
        setTimeout(() => resolve({porgs, isPorgError: false}), delay)
      })) as any,
  )
}

export const setupChatWithMessages = (mockApiService: any, events: any[]) => {
  mockApiService.getChat.mockResolvedValue({
    data: {events},
    headers: {},
  })
}

export const setupChatWithPlan = (mockApiService: any) => {
  mockApiService.getChat.mockResolvedValue({
    data: {
      events: [
        {
          type: 'agent-plan',
          planned_toolcalls: [{name: 'test_tool', args: {}}],
          executed_toolcalls: [],
        },
      ],
    },
    headers: {},
  })
}

// ============================================================================
// Table/Selection Test Helpers
// ============================================================================

export const createMockHeaders = () => [
  {data_key: 'name', title: 'Name', format: 'plain'},
  {data_key: 'details', title: 'Details', format: 'plain'},
]

export const createMockRows = () => [
  {id: 0, name: 'Item 1', details: 'Details 1'},
  {id: 1, name: 'Item 2', details: 'Details 2'},
  {id: 2, name: 'Item 3', details: 'Details 3'},
]

export const createLongRows = (count: number = 10) =>
  Array.from({length: count}, (_, i) => ({
    name: `Item ${i + 1}`,
    details: `Details ${i + 1}`,
  }))

export const createMarkdownHeaders = () => [
  {data_key: 'name', title: 'Name', format: 'plain'},
  {data_key: 'description', title: 'Description', format: 'markdown'},
]

export const createSecretHeaders = () => [
  {data_key: 'name', title: 'Name', format: 'plain'},
  {data_key: 'sensitiveData', title: 'Sensitive Data', format: 'secret'},
]

export const createObjectHeaders = () => [
  {data_key: 'name', title: 'Name', format: 'plain'},
  {data_key: 'data', title: 'Data', format: 'plain'},
]

// ============================================================================
// DOM Query Helpers
// ============================================================================

export const getExpandButton = (screen: any) => {
  return screen.getByLabelText('expand row')
}

export const getContinueButton = (screen: any) => {
  return screen.getByRole('button', {name: /continue/i})
}

export const getSelectNoneButton = (screen: any) => {
  return screen.getByRole('button', {name: /select none/i})
}

export const getAllCheckboxes = (screen: any) => {
  return screen.getAllByRole('checkbox')
}

export const getAllRadioButtons = (screen: any) => {
  return screen.getAllByRole('radio')
}

export const getSelectAllCheckbox = (screen: any) => {
  return screen.getByRole('checkbox', {name: /select all rows/i})
}

// ============================================================================
// Interaction Helpers
// ============================================================================

export const expandAllRows = (screen: any, fireEvent: any) => {
  const expandButton = getExpandButton(screen)
  fireEvent.click(expandButton)
}

export const selectSingleRow = (
  screen: any,
  fireEvent: any,
  rowIndex: number,
) => {
  const radioButtons = getAllRadioButtons(screen)
  fireEvent.click(radioButtons[rowIndex])
}

export const selectMultipleRows = (
  screen: any,
  fireEvent: any,
  rowIndices: number[],
) => {
  const checkboxes = getAllCheckboxes(screen)
  rowIndices.forEach(index => {
    fireEvent.click(checkboxes[index])
  })
}

export const selectAllRows = (screen: any, fireEvent: any) => {
  const selectAllCheckbox = getSelectAllCheckbox(screen)
  fireEvent.click(selectAllCheckbox)
}

export const selectPorg = async (screen: any, user: any, orgName: string) => {
  const radioButton = screen.getByRole('radio', {name: orgName})
  await user.click(radioButton)
}

export const clickContinueButton = async (screen: any, user: any) => {
  const continueButton = screen.getByText('Continue')
  await user.click(continueButton)
}

export const sendMessage = async (
  screen: any,
  fireEvent: any,
  message: string,
) => {
  const input = screen.getByTestId('prompt-input-field')
  const sendButton = screen.getByTestId('send-button')
  fireEvent.change(input, {target: {value: message}})
  fireEvent.click(sendButton)
}

// ============================================================================
// Verification Helpers
// ============================================================================

export const verifyContinueButtonDisabled = (screen: any) => {
  const continueButton = getContinueButton(screen)
  expect(continueButton).toBeDisabled()
}

export const verifyContinueButtonEnabled = async (
  screen: any,
  waitFor: any,
) => {
  const continueButton = getContinueButton(screen)
  await waitFor(() => expect(continueButton).not.toBeDisabled())
}

export const verifyOnSaveCalled = (onSave: any, expectedValue: any) => {
  expect(onSave).toHaveBeenCalledWith(expectedValue)
}

export const verifyFetchOrgsCall = (
  fetchOrgs: any,
  apiService: any,
  vscode?: any,
  frontendClient?: any,
  accessToken?: any,
) => {
  expect(fetchOrgs).toHaveBeenCalledWith(
    apiService,
    vscode,
    frontendClient,
    accessToken,
  )
}

export const verifyFetchOrgsCallWithSetError = (
  fetchOrgs: any,
  apiService: any,
  setError: any,
  vscode?: any,
  frontendClient?: any,
  accessToken?: any,
) => {
  expect(fetchOrgs).toHaveBeenCalledWith(
    apiService,
    setError,
    vscode,
    frontendClient,
    accessToken,
  )
}

export const waitForOrgsToRender = async (screen: any, waitFor: any) => {
  await waitFor(() => {
    expect(screen.getByText('org1')).toBeInTheDocument()
  })
}

// ============================================================================
// Event Trigger Helpers
// ============================================================================

export const triggerUnauthorizedEvent = () => {
  const event = new Event('api-unauthorized')
  document.dispatchEvent(event)
}

export const triggerReconnectionSuccess = (config: any) => {
  const event = new CustomEvent('reconnection-success', {detail: config})
  document.dispatchEvent(event)
}

// ============================================================================
// Test Data Generators
// ============================================================================

export const getTestSecret = () => `${'test'}-${'password'}-${'mock'}-${123}`

export const createMockAccessToken = () => 'mock-token'

export const createDelayedResolve = (
  porgs: any[],
  isPorgError: boolean,
  delay: number = 100,
) => {
  return () =>
    new Promise<{porgs: any[]; isPorgError: boolean}>(resolve => {
      setTimeout(() => resolve({porgs, isPorgError}), delay)
    })
}

/**
 * Creates a complete mock context value for testing
 * This is the standard context structure used across all tests
 */
export const createMockContextValue = () => ({
  plan: null,
  setPlan: vi.fn(),
  startNewChat: false,
  setStartNewChat: vi.fn(),
  isApprovalSubmitting: false,
  setIsApprovalSubmitting: vi.fn(),
  apicToken: '',
  setApicToken: vi.fn(),
  apicTokenExpirationDate: '',
  setApicTokenExpirationDate: vi.fn(),
  isLoggedIn: true,
  setIsLoggedIn: vi.fn(),
  hostUrl: '',
  setHostUrl: vi.fn(),
  showPorgSelection: false,
  setShowPorgSelection: vi.fn(),
  showProjectSelection: false,
  setShowProjectSelection: vi.fn(),
  auth: {
    API_URL: '',
    OVERRIDE_TOKEN: '',
    'X-ibm-user': '',
    'X-ibm-org': '',
    nonce: '',
  },
  setAuth: vi.fn(),
  nonce: '123',
  setNonce: vi.fn(),
  checkLogin: () => true,
  selectedFiles: [],
  setSelectedFiles: vi.fn(),
  isDarkTheme: false,
  setIsDarkTheme: vi.fn(),
})
