import { FrontendContext } from '../../interfaces/platform';
/**
 * Determines the appropriate URL based on client type and configuration
 * @param opremUrl - URL for on-premises deployment
 * @param awsUrl - URL for AWS deployment
 * @param frontendClient - Frontend client context
 * @param accessToken - Optional access token for JWT decoding
 * @returns The appropriate URL to use
 */
export declare const determineUrl: (opremUrl: string, awsUrl: string, frontendClient?: FrontendContext, accessToken?: string) => string;
/**
 * Handles link click based on client type
 * @param url - The URL to open
 * @param frontendClient - Frontend client context
 * @param vscode - VS Code API object (if applicable)
 */
export declare const handleLinkClick: (url: string, frontendClient?: FrontendContext, vscode?: any) => void;
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
export declare const createDocumentationLink: (text: string, opremUrl: string, awsUrl: string, frontendClient?: FrontendContext, vscode?: any, accessToken?: string) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=linkUtils.d.ts.map