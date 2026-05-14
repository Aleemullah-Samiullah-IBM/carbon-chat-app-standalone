// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

/**
 * PorgPicker test utilities - now using shared helpers
 * Re-exporting from shared test helpers for backward compatibility
 */

// Re-export shared helpers
export {
  createMockPorgs,
  createMockVscode,
  createMockFrontendClient,
  createMockAccessToken,
  createDelayedResolve,
  createMockApiService,
  setupSuccessfulOrgFetch,
  setupErrorOrgFetch,
  setupDelayedOrgFetch,
  waitForOrgsToRender,
  selectPorg,
  clickContinueButton,
  verifyFetchOrgsCall,
  verifyFetchOrgsCallWithSetError,
} from '../../tests/sharedTestHelpers'

import {vi} from 'vitest'

// PorgPicker-specific context setters
export const createMockPorgPickerContextSetters = () => ({
  mockSetPorg: vi.fn(),
  mockSetIsPorgError: vi.fn(),
  mockSetShowPorgSelection: vi.fn(),
  mockSetError: vi.fn(),
  mockClearError: vi.fn(),
})
