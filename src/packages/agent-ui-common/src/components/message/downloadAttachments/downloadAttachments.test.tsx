import {describe, it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import DownloadAttachments from './downloadAttachments'
import {ArtifactMetadata} from '../../../types/FileData'

vi.mock('./fileDownloadCard', () => ({
  default: ({title}: {title: string}) => <div>{title}</div>,
}))

describe('DownloadAttachments', () => {
  const chatUUID = 'chat-123'

  it('renders nothing when attachments is empty', () => {
    const {container} = render(
      <DownloadAttachments
        chatUUID={chatUUID}
        attachments={[]}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders FileDownloadCard for each attachment', () => {
    const attachments: ArtifactMetadata[] = [
      {
        artifact_id: '1',
        filename: 'getaclu.pdf',
        data_hash: 'abc',
        data_size: 1234,
        source: 'client',
        created_at: '2025-04-07',
        description: '',
        label: '',
      },
      {
        artifact_id: '2',
        filename: 'getanotherclu.docx',
        data_hash: 'def',
        data_size: 456,
        source: 'client',
        created_at: '2025-07-19',
        description: '',
        label: '',
      },
    ]

    render(
      <DownloadAttachments
        chatUUID={chatUUID}
        attachments={attachments}
      />,
    )

    expect(screen.getByText('getaclu.pdf')).toBeInTheDocument()
    expect(screen.getByText('getanotherclu.docx')).toBeInTheDocument()
  })
})
