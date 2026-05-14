/**
 * Previously "DownloadSnippet", reworked for cleaner seperation of concerns
 * and clearer naming convention
 *  */

import {useRef, useState} from 'react'
import {useAPI} from '../../../contexts/APIContext'
import {getFileExtension} from '../../../utilities/helpers'
import {Button} from '@carbon/react'
import {Copy, Download, ErrorFilled} from '@carbon/react/icons'
import './fileDownloadCard.scss'
import DynamicIconButton from '../../ui/dynamicIconButton'
import {FrontendContext} from '../../../interfaces/platform'
import ApiService from '../../../services/apiservice'

interface FileDownloadCardProps {
  chatUUID: string
  attachmentId: string // Used to fetch raw file data
  title: string
  description: string
  fileName: string
  frontendClient?: FrontendContext
  apiService?: ApiService | null | undefined
}

const FileDownloadCard = (props: FileDownloadCardProps) => {
  const {chatUUID, attachmentId, title, description, fileName, frontendClient} =
    props

  const apiValues = useAPI()

  // Use isApprovalSubmitting from props if provided, otherwise fall back to context
  const apiService =
    props.apiService !== undefined ? props.apiService : apiValues.apiService

  // const {apiService} = useAPI()

  const [fileData, setFileData] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fetchPromiseRef = useRef<Promise<ArrayBuffer> | null>(null)

  const fetchFileData = async () => {
    if (!fetchPromiseRef.current) {
      if (!apiService) {
        throw new Error('APIService is not available.')
      }

      fetchPromiseRef.current = apiService
        .getAttachments(chatUUID, attachmentId)
        .then(res => {
          if (!res?.data) {
            throw new Error('Received invalid response.')
          }
          return res.data
        })
        .then(data => {
          setFileData(data)
          return data
        })
        .catch((err: Error) => {
          setError(err.message)
        })
    }

    return fetchPromiseRef.current
  }

  const handleDownloadFile = async () => {
    try {
      const rawData = fileData ?? (await fetchFileData())
      if (!rawData) {
        throw new Error()
      }

      const fileExtension = getFileExtension(fileName)
      const blob = new Blob([rawData], {
        type: 'application/' + fileExtension,
      })

      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      setError(null)
    } catch {
      setError('Download failed.')
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      const rawData = fileData ?? (await fetchFileData())
      if (!rawData) {
        throw new Error()
      }
      const text = new TextDecoder().decode(rawData)
      await navigator.clipboard.writeText(text)
      setError(null)
    } catch {
      setError('Failed to copy contents of file to clipboard.')
    }
  }

  return (
    <div className='file-download-container'>
      <div className='file-download-card'>
        <div className='file-extension'>
          {getFileExtension(fileName)?.toUpperCase() ?? 'FILE'}
        </div>
        <div className='file-download-card-main'>
          <div>
            <div className='file-title'>{title || fileName}</div>
            <div className='file-description'>
              {description ?? 'Proposed file.'}
            </div>
          </div>

          <div>
            <Button
              className='file-download-text-button'
              kind='ghost'
              onClick={handleDownloadFile}
            >
              {fileName}
            </Button>
          </div>
        </div>
      </div>

      <div className='file-download-footer'>
        <DynamicIconButton
          label='Copy'
          onClick={handleCopyToClipboard}
          size='sm'
          align='bottom'
          enterDelayMs={250}
          leaveDelayMs={0}
          debounce
        >
          <Copy />
        </DynamicIconButton>
        <DynamicIconButton
          label={
            frontendClient?.client !== 'vscode'
              ? 'Download'
              : `Download
            Note: Changes to workspace files (e.g., downloads, updates, deletions) may not be immediately reflected.
            To view the latest state, please refresh the plugin via:
            - Command Palette → API Agent: Refresh Webview
            - Or switch to another tab (e.g., Explorer) and return.`
          }
          onClick={handleDownloadFile}
          size='sm'
          align='bottom'
          enterDelayMs={frontendClient?.client === 'vscode' ? 500 : 250}
          leaveDelayMs={frontendClient?.client === 'vscode' ? 300 : 0}
          debounce
        >
          <Download />
        </DynamicIconButton>
      </div>

      {error && (
        <div className='download-error'>
          <ErrorFilled />
          <span className='download-error-text'>{error}</span>
        </div>
      )}
    </div>
  )
}

export default FileDownloadCard
