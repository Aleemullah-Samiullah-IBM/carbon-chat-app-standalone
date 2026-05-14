import { RefObject } from 'react';
export type StreamingChunk = {
    type: 'status-update' | 'thought-update' | 'partial-output' | string;
    text: string;
};
export declare const StreamingMessage: ({ streamingContent, streamingComplete, isDarkTheme, tailRef, }: {
    streamingContent: StreamingChunk[];
    streamingComplete: boolean;
    isDarkTheme: boolean;
    tailRef?: RefObject<HTMLDivElement | null>;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=streamingMessage.d.ts.map