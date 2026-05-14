import { JwtPayload } from 'jwt-decode';
import { ChatEvent } from '../types/Message';
import { ArtifactMetadata } from '../types/FileData';
import { Command, ParsedCommandArgValue, ParsedCommandArgs } from '../types/Command';
interface UserIdJwtPayload extends JwtPayload {
    username: string;
}
export declare const getCurrentTime: (dateString?: string) => string;
export declare function getExpirationDate(expireInSeconds: number): string;
export declare function transformChatMessagesData(events: ChatEvent[]): ChatEvent[];
export declare function isNestedObject(obj: any): boolean;
export declare const getFileName: (path: string) => string | undefined;
export declare const getErrorMessage: (error: any) => string;
export declare const getFileExtension: (fileName: string) => string | null;
export declare const getFileMetadata: (filename: string, attachments: ArtifactMetadata[]) => ArtifactMetadata | undefined;
export declare const parseToolcallArguments: (toolcallArgs: Record<string, any>) => Record<string, any>;
export declare const decodeToken: (accessToken: any) => {
    data: UserIdJwtPayload;
    error?: undefined;
} | {
    error: unknown;
    data?: undefined;
};
export declare const tokenizeInput: (input: string) => string[];
export declare const cleanInput: (curr_input: string) => string;
export declare const parseInputandValidate: (userInput: string, commands: Command[], attachments: ArtifactMetadata[]) => {
    missingFields: string[];
    parsedCommandArgs: Record<string, ParsedCommandArgValue>;
};
export declare function getMissingRequiredFields(commands: Command[], commandName: string, parsedCommandArgs: ParsedCommandArgs): string[];
export declare const isAgentResponse: (type: string) => boolean;
export declare const shouldResetToolcalls: (type: string, response: any) => boolean;
export declare const shouldUpdatePlan: (type: string, response: any) => any;
export declare function updateContext(context: string | undefined, key: string, value: any): string;
/**
 * Processes formatted session data and updates state based on the last event
 * @param formattedSession Array of formatted chat messages
 * @param headers Headers to attach to each message
 * @param setMessages React setState function for messages
 * @param setPlan React setState function for plan
 * @param setIsToolcallMode React setState function for toolcall mode
 * @param resetToolcalls Function to reset toolcalls state
 */
export declare function processFormattedSession(formattedSession: any[], headers: any, setMessages: React.Dispatch<React.SetStateAction<any[]>>, setPlan: React.Dispatch<React.SetStateAction<any>>, setIsToolcallMode: React.Dispatch<React.SetStateAction<boolean>>, resetToolcalls: () => void): void;
/**
 * Find a specific executed toolcall based on operation_id and tool name
 * @param executed_toolcalls Array of executed toolcalls
 * @param operation_id Operation ID of executed operation
 * @returns The matching executed toolcall or undefined
 */
export declare const findExecutedToolcall: (executed_toolcalls: any[] | undefined, operation_id: string) => any;
/**
 * Find a specific response detail based on tool type and criteria
 * @param response_details Array of response details
 * @param toolType Type of tool to search for
 * @returns The matching response detail or undefined
 */
export declare const findResponseDetail: (response_details: any[] | undefined, toolType: "governance_validation" | "governance_remediation" | "suggestions" | "autocorrect") => any;
/**
 * Helper function to friendly relative time for Recent chats list
 * @param isoDate string date, e.g. "2026-06-14T23:27:49.892714Z"
 * @param date relative time, like "Just now", "6 hours ago", "14 days ago"
 */
export declare const formatLastInteractionDate: (isoDate: string) => string;
/**
 * Options for handleSlashCommand function
 */
export interface HandleSlashCommandOptions {
    input: string;
    attachments: ArtifactMetadata[];
    commands: Command[];
    chatUUID: string;
    apiService: any;
    setError: (error: any) => void;
    clearError: () => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatEvent[]>>;
    setIsToolcallMode: (value: boolean) => void;
    setPlan: (plan: any) => void;
    setLoading: (value: boolean) => void;
    chatUUIDRef: React.RefObject<string>;
    onOpenAttachments?: (attachments: ArtifactMetadata[]) => void;
}
/**
 * Helper function to handle slash commands
 * Shared between web-app and vscode-plugin to avoid code duplication
 * @param options Object containing all required parameters
 */
export declare const handleSlashCommand: (options: HandleSlashCommandOptions) => Promise<void>;
export {};
//# sourceMappingURL=helpers.d.ts.map