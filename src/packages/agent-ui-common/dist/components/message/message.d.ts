import { default as React } from 'react';
import { ChatEvent } from '../../types';
import { FrontendContext } from '../../interfaces/platform';
interface MessageProps {
    msg: ChatEvent;
    isLatestMessage: boolean | undefined;
    chatUUID: string;
    onSave: () => void;
    onSaveSelection: (index: number | number[]) => void;
    setIsEditPage: (e: boolean) => void;
    isDarkTheme: boolean;
    frontendClient?: FrontendContext;
    RemoteDomRenderer?: React.ComponentType<any>;
    useTextualPlan?: boolean;
}
export declare const Message: React.FC<MessageProps>;
export {};
//# sourceMappingURL=message.d.ts.map