import FileDownloadCard from './fileDownloadCard'
import {ArtifactMetadata} from '../../../types/FileData'
import {FrontendContext} from '../../../interfaces/platform'
import ApiService from '../../../services/apiservice'

interface DownloadAttachmentsProps {
  chatUUID: string
  attachments: ArtifactMetadata[]
  frontendClient?: FrontendContext
  apiService?: ApiService | null | undefined
}

const DownloadAttachments: React.FC<DownloadAttachmentsProps> = ({
  chatUUID,
  attachments,
  frontendClient,
  apiService,
}) => {
  if (!attachments.length) return null

  return (
    <>
      {attachments.map(artifact => (
        <FileDownloadCard
          chatUUID={chatUUID}
          key={artifact.artifact_id}
          attachmentId={artifact.artifact_id}
          title={artifact.label || artifact.filename}
          description={artifact.description}
          fileName={artifact.filename}
          frontendClient={frontendClient}
          apiService={apiService}
        />
      ))}
    </>
  )
}

export default DownloadAttachments
