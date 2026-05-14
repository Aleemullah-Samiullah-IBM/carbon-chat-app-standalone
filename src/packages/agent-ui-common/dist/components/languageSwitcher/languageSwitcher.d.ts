interface LanguageSwitcherProps {
    apiConfig?: {
        hostUrl?: string;
        token?: string;
    };
    onLanguageChange?: (language: string) => void;
    onError?: (error: string) => void;
    className?: string;
    titleText?: string;
}
export declare const LanguageSwitcher: ({ apiConfig, onLanguageChange, onError, className, titleText, }: LanguageSwitcherProps) => import("react/jsx-runtime").JSX.Element;
export default LanguageSwitcher;
//# sourceMappingURL=languageSwitcher.d.ts.map