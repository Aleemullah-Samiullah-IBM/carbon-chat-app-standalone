declare const MessageHeader: ({ timestamp, isDarkTheme, showSteps, showReasoning, expandSteps, setExpandSteps, expandReasoning, setExpandReasoning, debugResponse, setExpandDetails, setIdDetailType, }: {
    timestamp: string;
    isDarkTheme: boolean;
    showSteps: boolean | undefined;
    showReasoning: boolean | undefined;
    expandSteps: boolean;
    setExpandSteps: React.Dispatch<React.SetStateAction<boolean>>;
    expandReasoning: boolean;
    setExpandReasoning: React.Dispatch<React.SetStateAction<boolean>>;
    debugResponse: string;
    setExpandDetails: (e: boolean) => void;
    setIdDetailType: (type: "chatUUID" | "reqID" | "debug") => void;
}) => import("react/jsx-runtime").JSX.Element;
export default MessageHeader;
//# sourceMappingURL=messageHeader.d.ts.map