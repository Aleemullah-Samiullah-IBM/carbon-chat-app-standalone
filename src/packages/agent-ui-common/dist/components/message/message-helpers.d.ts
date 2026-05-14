import { ChatEvent, PlanEvent } from '../../types';
export declare const combineDebugResponses: (response_details: any) => any;
export declare function formatUserCommand(command: string, args: {
    [key: string]: any;
}): string;
export declare function getEventFlags(event: ChatEvent['event']): {
    isAgent: boolean;
    isOnlyAgentMessage: boolean;
    isSelectionMessage: boolean;
    isUser: boolean;
    isUserMessage: boolean;
    isUserCommand: boolean;
    isPlanEvent: boolean;
    isFirstMessage: boolean;
};
export declare function getModalHeading(idDetailType: string): "Request ID" | "Chat session ID" | "Debug" | "Unknown";
export declare const isPlanPending: (event: PlanEvent) => boolean;
export declare const isPlanCompleted: (event: PlanEvent) => boolean;
export declare function hasFilename(obj: any): obj is {
    filename: string;
};
export declare function hasRemoteDomContent(event: any): boolean;
export declare function getRemoteDomUrl(event: any): string | null;
export declare function shouldUseMockMode(): boolean;
//# sourceMappingURL=message-helpers.d.ts.map