import { FrontendContext } from '../../interfaces/platform';
import { ReactNode } from 'react';
interface ErrorNotificationProps {
    isError: boolean;
    setIsError: (value: boolean) => void;
    errorMessage: string;
    frontendClient?: FrontendContext;
    title?: string;
    vscode?: any;
    children?: ReactNode;
}
/**
 * Reusable error notification component
 * @param isError - Boolean to control if the error is shown
 * @param setIsError - Function to update the error state
 * @param errorMessage - Message to display in the notification
 * @param title - Title of the notification (defaults to 'No provider organizations')
 * @param frontendClient - The frontend client object to determine client type and show different component (e.g., vscode)
 * @param children - Optional child elements to render inside the notification
 * @returns InlineNotification component
 */
export declare const ErrorNotification: ({ isError, setIsError, errorMessage, frontendClient, title, vscode, children, }: ErrorNotificationProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=errorNotification.d.ts.map