import {describe, it, expect, vi, beforeEach} from 'vitest'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import FileDownloadCard from './fileDownloadCard'

vi.mock('../../utilities/helpers', () => ({
  getFileExtension: (filename: string) => filename.split('.').pop(),
}))

const mockGetAttachments = vi.fn()
vi.mock('../../../contexts/APIContext', () => ({
  useAPI: () => ({
    apiService: {
      getAttachments: mockGetAttachments,
    },
  }),
}))

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('FileDownloadCard', () => {
  const baseProps = {
    chatUUID: '1234',
    attachmentId: 'id',
    title: 'Test File',
    description: 'Test Description',
    fileName: 'test.txt',
  }

  const mockFileData = new TextEncoder().encode('Hello world!').buffer
  const mockSetFileData = vi.fn()
  const mockSetError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and description', () => {
    render(<FileDownloadCard {...baseProps} />)
    expect(screen.getByText('Test File')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('test.txt')).toBeInTheDocument()
  })

  it('downloads file when download button is clicked', async () => {
    mockGetAttachments.mockResolvedValueOnce({data: mockFileData})

    render(<FileDownloadCard {...baseProps} />)

    const downloadButton = screen.getByText('test.txt')
    fireEvent.click(downloadButton)

    await waitFor(() => {
      expect(mockGetAttachments).toHaveBeenCalled()
    })
  })

  it('copies file content to clipboard', async () => {
    mockGetAttachments.mockResolvedValueOnce({data: mockFileData})

    render(<FileDownloadCard {...baseProps} />)

    const copyButton = screen.getByLabelText('Copy')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello world!')
    })
  })

  it('shows error if download fails', async () => {
    mockGetAttachments.mockRejectedValueOnce(new Error('Network error'))

    render(<FileDownloadCard {...baseProps} />)

    const downloadButton = screen.getByText('test.txt')
    fireEvent.click(downloadButton)

    await waitFor(() => {
      expect(screen.getByText('Download failed.')).toBeInTheDocument()
    })
  })

  it('shows error if copy fails', async () => {
    mockGetAttachments.mockResolvedValueOnce({data: mockFileData})
    navigator.clipboard.writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error('Clipboard error'))

    render(<FileDownloadCard {...baseProps} />)

    const copyButton = screen.getByLabelText('Copy')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to copy contents of file to clipboard.'),
      ).toBeInTheDocument()
    })
  })
})
