import { ChatEvent } from '../types/Message';
import { POrgName } from '../types/POrgName';
import { ComponentType } from 'react';
/**
 * Creates a welcome message for the chat
 * @param porg Optional provider organization name
 * @param headers Optional headers
 * @param accessToken Access token for authentication
 * @param frontendClientType The client type (e.g., vscode)
 * @param vscode  The vscode API object if in VS Code environment
 * @returns A ChatEvent object with the welcome message
 */
export declare const createWelcomeMessage: (porg: POrgName, headers?: Map<string, any>, accessToken?: string, frontendClientType?: any, vscode?: any) => ChatEvent;
export declare const createBasicWelcomeMessage: (options?: {
    headers?: Map<string, any>;
    customMessage?: string;
    firstActions?: {
        icon: ComponentType<any>;
        message: string;
    }[];
}) => ChatEvent;
//# sourceMappingURL=welcomeMessage.d.ts.map