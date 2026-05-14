import { FrontendContext } from '../../../interfaces/platform';
import { default as ApiService } from '../../../services/apiservice';
interface FileDownloadCardProps {
    chatUUID: string;
    attachmentId: string;
    title: string;
    description: string;
    fileName: string;
    frontendClient?: FrontendContext;
    apiService?: ApiService | null | undefined;
}
declare const FileDownloadCard: (props: FileDownloadCardProps) => import("react/jsx-runtime").JSX.Element;
export default FileDownloadCard;
//# sourceMappingURL=fileDownloadCard.d.ts.map