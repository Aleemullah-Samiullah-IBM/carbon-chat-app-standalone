/**
 * PorgPicker test utilities - now using shared helpers
 * Re-exporting from shared test helpers for backward compatibility
 */
export { createMockPorgs, createMockVscode, createMockFrontendClient, createMockAccessToken, createDelayedResolve, createMockApiService, setupSuccessfulOrgFetch, setupErrorOrgFetch, setupDelayedOrgFetch, waitForOrgsToRender, selectPorg, clickContinueButton, verifyFetchOrgsCall, verifyFetchOrgsCallWithSetError, } from '../../tests/sharedTestHelpers';
export declare const createMockPorgPickerContextSetters: () => {
    mockSetPorg: import('vitest').Mock<(...args: any[]) => any>;
    mockSetIsPorgError: import('vitest').Mock<(...args: any[]) => any>;
    mockSetShowPorgSelection: import('vitest').Mock<(...args: any[]) => any>;
    mockSetError: import('vitest').Mock<(...args: any[]) => any>;
    mockClearError: import('vitest').Mock<(...args: any[]) => any>;
};
//# sourceMappingURL=porgPickerTestHelpers.d.ts.map