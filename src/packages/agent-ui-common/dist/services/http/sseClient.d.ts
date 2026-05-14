type SSEController = {
    close: () => void;
};
/**
 * Creates a fetch-based SSE connection that supports custom headers
 * @param url URL to connect to
 * @param options config options including headers
 * @param onMessage Callback function for every time SSE data arrives
 * @param onError Callback function for error events
 * @param onOpen Callback function when connection is established
 * @returns Object with close function to terminate the connection
 */
export declare function createSSEConnection(url: string, options: any | undefined, // anything type more specific not working,
onMessage: (event: MessageEvent) => void, onError: (error: Event) => void, onOpen?: () => void, onClose?: () => void): SSEController;
export {};
//# sourceMappingURL=sseClient.d.ts.map