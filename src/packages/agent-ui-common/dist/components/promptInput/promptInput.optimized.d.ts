import { JSX } from 'react';
import { Command } from '../../types/Command';
import { FileProvider } from '../../interfaces/platform';
interface PromptInputProps {
    commands: Command[];
    fetching: boolean;
    onSendMessage: (message: string) => void;
    fileProvider: FileProvider;
    fileInputRef?: any;
    onInputChange?: (value: string) => void;
    value?: string;
    handleAddImages?: any;
    isUploadingFiles?: boolean;
}
export declare const PromptInput: ({ commands, fetching, onSendMessage, fileProvider, fileInputRef, onInputChange, value, handleAddImages, isUploadingFiles, }: PromptInputProps) => JSX.Element;
export {};
//# sourceMappingURL=promptInput.optimized.d.ts.map