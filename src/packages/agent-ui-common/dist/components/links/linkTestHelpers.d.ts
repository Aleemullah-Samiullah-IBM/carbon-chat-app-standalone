import { default as React } from 'react';
import { createMockVscode, setupWindowMocks, cleanupWindowMocks, setApiConnectCfg } from '../../tests/sharedTestHelpers';
export { createMockVscode, setupWindowMocks, cleanupWindowMocks, setApiConnectCfg, };
/**
 * Shared test utilities for link components
 * Reduces duplication between documentationLink and learnMoreLink tests
 */
export interface LinkTestConfig {
    linkText: string;
    opremUrl: string;
    awsUrl: string;
    renderLink: (accessToken?: any, frontendClientType?: any, vscode?: any) => React.ReactElement;
}
export interface LinkTestSetup {
    windowOpenSpy: any;
    mockVscode: any;
}
/**
 * Setup function for link tests
 */
export declare const setupLinkTests: () => LinkTestSetup;
/**
 * Cleanup function for link tests
 */
export declare const cleanupLinkTests: (windowOpenSpy: any) => void;
/**
 * Test suite for APIM client behavior
 */
export declare const testApimClient: (config: LinkTestConfig) => {
    'renders link with correct text': () => void;
    'uses OPREM URL when formFactor is not aws': (windowOpenSpy: any) => void;
    'uses AWS URL when formFactor is aws': (windowOpenSpy: any) => void;
    'uses OPREM URL when apiConnectCfg is undefined': (windowOpenSpy: any) => void;
    'uses OPREM URL when formFactor is undefined': (windowOpenSpy: any) => void;
    'opens link in new window when clicked': (windowOpenSpy: any) => void;
};
/**
 * Test suite for VS Code client behavior
 */
export declare const testVscodeClient: (config: LinkTestConfig) => {
    'posts message to vscode when clicked': (mockVscode: any, windowOpenSpy: any) => void;
    'uses OPREM URL when realm does not include ibm-verify': (mockVscode: any) => void;
    'uses AWS URL when realm includes ibm-verify': (mockVscode: any) => void;
    'uses OPREM URL when accessToken is not provided': (mockVscode: any) => void;
    'uses OPREM URL when decoded token has no realm': (mockVscode: any) => void;
};
/**
 * Test suite for API Studio Desktop client behavior
 */
export declare const testApiStudioDesktopClient: (config: LinkTestConfig) => {
    'uses OPREM URL when realm does not include ibm-verify': (windowOpenSpy: any) => void;
    'uses AWS URL when realm includes ibm-verify': (windowOpenSpy: any) => void;
    'uses OPREM URL when accessToken is not provided': (windowOpenSpy: any) => void;
    'opens link in new window when clicked': (windowOpenSpy: any) => void;
};
/**
 * Test suite for API Studio Embedded client behavior
 */
export declare const testApiStudioEmbeddedClient: (config: LinkTestConfig) => {
    'uses OPREM URL when formFactor is not aws': (windowOpenSpy: any) => void;
    'uses AWS URL when formFactor is aws': (windowOpenSpy: any) => void;
};
/**
 * Test suite for link attributes
 */
export declare const testLinkAttributes: (config: LinkTestConfig) => {
    'has target="_blank" attribute': () => void;
    'has rel="noopener noreferrer" attribute': () => void;
};
/**
 * Test suite for token decoding
 */
export declare const testTokenDecoding: (config: LinkTestConfig) => {
    'calls jwtDecode with correct token for vscode client': (mockVscode: any) => void;
    'calls jwtDecode with correct token for apistudio-desktop client': () => void;
    'does not call jwtDecode for apim client': () => void;
    'does not call jwtDecode for apistudio-embedded client': () => void;
};
//# sourceMappingURL=linkTestHelpers.d.ts.map