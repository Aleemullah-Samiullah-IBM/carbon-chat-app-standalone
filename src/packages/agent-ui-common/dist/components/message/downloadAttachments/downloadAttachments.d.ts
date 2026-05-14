import { ArtifactMetadata } from '../../../types/FileData';
import { FrontendContext } from '../../../interfaces/platform';
import { default as ApiService } from '../../../services/apiservice';
interface DownloadAttachmentsProps {
    chatUUID: string;
    attachments: ArtifactMetadata[];
    frontendClient?: FrontendContext;
    apiService?: ApiService | null | undefined;
}
declare const DownloadAttachments: React.FC<DownloadAttachmentsProps>;
export default DownloadAttachments;
//# sourceMappingURL=downloadAttachments.d.ts.map