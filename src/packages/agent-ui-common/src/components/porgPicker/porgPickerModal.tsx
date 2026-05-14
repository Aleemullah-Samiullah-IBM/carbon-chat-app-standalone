// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {useState, useEffect} from 'react'
import {Modal} from '@carbon/react'
import ApimInstanceSelector, {ApimInstance} from '../apimInstanceSelector'
import PorgPickerInModal from './porgPickerInModal'

import {useAPI} from '../../contexts/APIContext'
import {useMyContext} from '../../contexts/ChatContext'
import {useError} from '../../contexts/ErrorContext'
import {POrgName} from '../../types/POrgName'
import {FrontendContext} from '../../interfaces/platform'

interface PorgPickerModalProps {
  open: boolean
  parentContext?: any
  frontendClient?: FrontendContext
  onClose: () => void
  vscode?: any
  accessToken?: any
  onPorgSelectedCallback?: (value: any, apimInstance?: ApimInstance) => void
  selectedAPIMInstance?: any
  setSelectedAPIMInstance?: any
}

// alt version of PorgPicker in the modal initiated by
// "Switch organization" in the toolbar menu
export default function PorgPickerModal({
  open,
  parentContext,
  frontendClient,
  onClose,
  vscode,
  accessToken,
  onPorgSelectedCallback,
  selectedAPIMInstance,
  setSelectedAPIMInstance,
}: Readonly<PorgPickerModalProps>) {
  const {apiService, configureService, setPorg, porg} = useAPI()
  const {setShowPorgSelection} = useMyContext()
  const {clearError} = useError()

  const [showModalPorgSelection, setShowModalPorgSelection] =
    useState<boolean>(false)
  const [selectedPorgValue, setSelectedPorgValue] = useState<
    POrgName | undefined
  >(undefined)

  // Local state for APIM instance selection in modal (separate from ChatPane state)
  const [modalSelectedAPIMInstance, setModalSelectedAPIMInstance] = useState<
    ApimInstance | undefined
  >(undefined)

  const [selectedAPIMaccessToken, setSelectedAPIMaccessToken] = useState<
    string | undefined
  >(accessToken || undefined)

  const client = frontendClient?.client

  // Reset modal state to current active values when modal opens
  useEffect(() => {
    if (open) {
      // Clear any previous errors
      clearError()

      // Reset to currently active porg from API context
      setSelectedPorgValue(porg as POrgName)

      // Reset to currently active APIM instance from ChatPane
      setModalSelectedAPIMInstance(selectedAPIMInstance)

      // Reconfigure service with current APIM instance to fetch orgs correctly
      if (selectedAPIMInstance) {
        configureService(
          selectedAPIMInstance.url,
          'api-agent/api-assistant',
          selectedAPIMInstance.access_token,
          '',
          porg as string,
          frontendClient,
          {}, // MCP authContext, in vscode-only, not relevant to web
        )
        setSelectedAPIMaccessToken(selectedAPIMInstance.access_token)
      }

      if (client === 'vscode' || selectedAPIMInstance) {
        setShowModalPorgSelection(true)
      }
    } else {
      // Reset when modal closes to ensure clean state on next open
      setSelectedPorgValue(undefined)
      setModalSelectedAPIMInstance(undefined)
      setShowModalPorgSelection(false)
    }
  }, [open, porg, selectedAPIMInstance])

  const handlePorgSelection = (value: any) => {
    setSelectedPorgValue(value)
    clearError()
  }

  const onAPIMInstanceSelect = (instance: ApimInstance) => {
    // Update local modal state only, don't update ChatPane state yet
    setModalSelectedAPIMInstance(instance)
    setSelectedAPIMaccessToken(instance.access_token)

    // Clear porg selection when APIM instance changes
    setSelectedPorgValue(undefined)

    // Configure service temporarily for fetching orgs
    configureService(
      instance.url,
      'api-agent/api-assistant',
      instance.access_token,
      '',
      '',
      frontendClient,
      {}, // MCP authContext, in vscode-only, not relevant to web
    )
    setShowModalPorgSelection(true)
  }

  const savePorg = () => {
    // Reconfigure service with the selected APIM instance and porg
    if (modalSelectedAPIMInstance) {
      configureService(
        modalSelectedAPIMInstance.url,
        'api-agent/api-assistant',
        modalSelectedAPIMInstance.access_token,
        '',
        selectedPorgValue as string,
        frontendClient,
        {}, // MCP authContext, in vscode-only, not relevant to web
      )
    }

    // save this to vscode state to be added to all REST calls
    setPorg(selectedPorgValue)

    // persistent this on vscode side
    vscode?.postMessage({
      type: 'savePorg',
      value: selectedPorgValue,
    })

    // hide the porg selection message
    setShowPorgSelection(false)

    // set the apiService org for all REST calls
    apiService?.setPorg(selectedPorgValue)

    // Update ChatPane's APIM instance state only when Update is clicked
    if (modalSelectedAPIMInstance && setSelectedAPIMInstance) {
      setSelectedAPIMInstance(modalSelectedAPIMInstance)
    }

    // Call the callback with the selected porg and APIM instance
    if (onPorgSelectedCallback) {
      // Pass the APIM instance directly to the callback
      setTimeout(() => {
        onPorgSelectedCallback(selectedPorgValue, modalSelectedAPIMInstance)
      }, 0)
    }
  }

  const handleUpdate = () => {
    savePorg()
    onClose()
  }

  return (
    <Modal
      className='porg-picker-modal'
      modalHeading=''
      open={open}
      size='lg'
      primaryButtonText='Update'
      secondaryButtonText='Cancel'
      onRequestClose={onClose}
      onRequestSubmit={handleUpdate}
      primaryButtonDisabled={!selectedPorgValue}
      preventCloseOnClickOutside
    >
      {client !== 'vscode' && (
        <ApimInstanceSelector
          key={`apim-selector-${open}`}
          apimInstances={parentContext?.apimInstances || []}
          onInstanceSelect={onAPIMInstanceSelect}
          initialSelectedInstance={modalSelectedAPIMInstance}
        />
      )}

      {showModalPorgSelection && (
        <PorgPickerInModal
          onPorgSelectedCallback={handlePorgSelection}
          selectedPorg={selectedPorgValue}
          isOpen={open}
          vscode={vscode}
          frontendClient={frontendClient}
          accessToken={selectedAPIMaccessToken}
        />
      )}
    </Modal>
  )
}
