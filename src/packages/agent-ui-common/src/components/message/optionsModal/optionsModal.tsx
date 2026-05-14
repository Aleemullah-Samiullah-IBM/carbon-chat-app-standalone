import {CopyButton, Modal} from '@carbon/react'
import {getModalHeading} from '../message-helpers'

interface OptionsModalProps {
  chatUUID: string
  reqId: string
  debugResponse: string
  idDetailType: string //'chatUUID' | 'reqID' | 'debug'
  expandDetails: boolean
  setExpandDetails: (data: any) => void
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  chatUUID,
  reqId,
  debugResponse,
  idDetailType,
  expandDetails,
  setExpandDetails,
}) => {
  return (
    <Modal
      open={expandDetails}
      modalHeading={getModalHeading(idDetailType)}
      modalAriaLabel='show message details modal'
      passiveModal
      size='xs'
      className='show-id-to-copy-modal'
      onRequestClose={() => setExpandDetails(false)}
    >
      {idDetailType === 'chatUUID' && (
        <div>
          {chatUUID ?? 'undefined'}
          <CopyButton
            data-modal-primary-focus
            iconDescription='Copy chat session ID'
            feedback='Copied successfully'
            align='left'
            onClick={() => navigator.clipboard.writeText(chatUUID)}
          />
        </div>
      )}

      {idDetailType === 'reqID' && (
        <div>
          {reqId && reqId.trim() !== '' ? reqId : 'undefined'}

          <CopyButton
            data-modal-primary-focus
            iconDescription='Copy request ID'
            feedback='Copied successfully'
            align='left'
            onClick={() => navigator.clipboard.writeText(reqId)}
          />
        </div>
      )}

      {idDetailType === 'debug' && (
        <div>
          {debugResponse}

          <CopyButton
            data-modal-primary-focus
            iconDescription='Copy debug logs'
            feedback='Copied successfully'
            align='left'
            onClick={() => navigator.clipboard.writeText(debugResponse)}
          />
        </div>
      )}
    </Modal>
  )
}

export default OptionsModal
