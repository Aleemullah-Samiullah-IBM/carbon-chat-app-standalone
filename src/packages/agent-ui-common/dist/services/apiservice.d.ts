import { ResponseType } from 'axios';
import { ParsedCommandArgs, PlanItem } from '../types';
import { ArtifactMetadata } from '../types/FileData';
import { AuthContext, FrontendContext } from '../interfaces/platform';
export default class ApiService {
    BASE_URL: string;
    API_URL: string;
    TOKEN: string;
    USER: string;
    PORG: string | number | undefined;
    FRONTEND_CONTEXT: FrontendContext | undefined;
    AUTH_CONTEXT: AuthContext;
    private cachedCustomHeaders;
    private programmaticHeaders;
    constructor(hostUrl: string, apiBasePath: string, token: string, user: string, org: string, frontendContext: FrontendContext | undefined, authContext: AuthContext, programmaticHeaders?: Record<string, string>);
    setPorg(newPorg: string | number | undefined): void;
    /**
     * Load custom headers from localStorage and cache them
     * @private
     */
    private loadCustomHeaders;
    /**
     * Get cached custom headers, loading them if not already cached
     * @private
     */
    private getCustomHeadersCached;
    /**
     * Refresh the custom headers cache from localStorage
     * Call this method after headers are updated in the UI
     * @public
     */
    refreshCustomHeaders(): void;
    getDefaultHeaders(context?: FrontendContext, authContext?: AuthContext): {
        headers: {
            Authorization: string;
            'Content-Type': string;
            'X-ibm-user': string;
            'X-ibm-org': string;
            'X-ibm-agent-frontend-client': "vscode" | "apim" | "apistudio-desktop" | "apistudio-embedded" | undefined;
            'X-ibm-agent-frontend-version': string | undefined;
            'X-ibm-agent-frontend-context': string;
            'X-ibm-agent-auth-context': string;
        };
    };
    getOctetHeaders(filename: string, context?: FrontendContext, authContext?: AuthContext): {
        headers: {
            Authorization: string;
            'Content-Type': string;
            'Content-Disposition': string;
            'X-ibm-user': string;
            'X-ibm-org': string;
            'X-ibm-agent-frontend-client': string;
            'X-ibm-agent-frontend-version': string;
            'X-ibm-agent-frontend-context': string;
            'X-ibm-agent-auth-context': string;
        };
    };
    getAttachmentsHeader(context?: FrontendContext, authContext?: AuthContext): {
        headers: {
            accept: string;
            Authorization: string;
            'X-ibm-user': string;
            'X-ibm-org': string;
            'X-ibm-agent-frontend-client': string;
            'X-ibm-agent-frontend-version': string;
            'X-ibm-agent-frontend-context': string;
            'X-ibm-agent-auth-context': string;
        };
        params: {};
        responseType: ResponseType;
    };
    getAllChats(context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    createNewChat(context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    getChat(chat_session_uuid: string, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    postChat(chat_session_uuid: string, message: string, attachments: ArtifactMetadata[], context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    postPlan(chat_session_uuid: string, toolcalls: PlanItem[] | null | undefined, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    postSelection(chat_session_uuid: string, selectedIndex: number | number[], context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    postUserCommand(chat_session_uuid: string, tool: string, args: ParsedCommandArgs, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    getCommands(chat_session_uuid: string, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    getAttachments(chat_session_uuid: string, attach_id: string, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    postAttachment(chat_session_uuid: string, attachment_data: Uint8Array, attachment_filename: string, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    fetchOrgs(): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    postMessage(message: string, chat_session_uuid: string, context?: FrontendContext, authContext?: AuthContext): Promise<{
        data: any;
        headers: Map<string, unknown>;
    }>;
    /**
     * Creates a streaming connection for real-time updates.
     * If the SSE fails, do the 'application/json' for standard postChat()
     * The server will respond with SSE if supported, or JSON if not.
     * @param chat_session_uuid The chat session UUID
     * @param message The message to send
     * @param attachments The attachments to send
     * @param onMessageCallback
     * @param onErrorCallback
     * @param onOpenCallback
     * @param context Frontend context
     * @param authContext Authentication context
     * @returns Object with close() to terminate the connection
     */
    streamChat(chat_session_uuid: string, message: string, attachments: ArtifactMetadata[], onMessageCallback: (data: any) => void, onErrorCallback: (error: any) => void, onOpenCallback?: () => void, onCloseCallback?: () => void, context?: FrontendContext, authContext?: AuthContext): {
        close: () => void;
    };
}
//# sourceMappingURL=apiservice.d.ts.map