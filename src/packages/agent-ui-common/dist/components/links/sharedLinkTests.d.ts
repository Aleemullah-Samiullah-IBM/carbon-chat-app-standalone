/**
 * Shared test suite runner for link components
 * Eliminates duplication between documentationLink and learnMoreLink tests
 */
export interface LinkTestConfig {
    componentName: string;
    linkText: string;
    opremUrl: string;
    awsUrl: string;
    renderLink: (accessToken?: any, frontendClientType?: any, vscode?: any) => any;
    hasNoParamsTest?: boolean;
}
export declare const runLinkTestSuite: (config: LinkTestConfig) => void;
//# sourceMappingURL=sharedLinkTests.d.ts.map