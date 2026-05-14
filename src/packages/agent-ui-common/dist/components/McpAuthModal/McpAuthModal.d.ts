interface AuthField {
    name: string;
    label: string;
    input: 'text' | 'password';
    required: boolean;
}
interface McpAuthModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (credentials: Record<string, string>) => void;
    authFields: AuthField[];
    serverName: string;
}
export declare const McpAuthModal: ({ open, onClose, onSubmit, authFields, serverName, }: McpAuthModalProps) => JSX.Element;
export {};
//# sourceMappingURL=McpAuthModal.d.ts.map