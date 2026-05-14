declare let setError: ((msg: string) => void) | null;
declare let sendProviderMessage: ((type: string, payload: any) => void) | null;
export declare const InterceptorState: {
    readonly apicTokenExpirationDate: string;
    setApicTokenExpirationDate(value: string): void;
    setSetError(fn: typeof setError): void;
    setSendProviderMessage(fn: typeof sendProviderMessage): void;
    triggerError(message: string): void;
    triggerLogout(): void;
};
export {};
//# sourceMappingURL=interceptorState.d.ts.map