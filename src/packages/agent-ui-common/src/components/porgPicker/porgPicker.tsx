// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {useEffect, useState} from 'react'
import {
  FormGroup,
  RadioButton,
  RadioButtonGroup,
  Stack,
  unstable__AiSkeletonText as AiSkeletonText,
  unstable__ChatButton as ChatButton,
} from '@carbon/react'
import {useMyContext} from '../../contexts/ChatContext'
import {useAPI} from '../../contexts/APIContext'
import {useError} from '../../contexts/ErrorContext'

import {POrgName} from '../../types/POrgName'
import {PORG_ERROR_MESSAGE} from '../../constants'
import {fetchOrgs} from '../../utilities/porgHelpers'
import {FrontendContext} from '../../interfaces/platform'
import {getLearnMoreLink} from '../../components/links'
import {ErrorNotification} from '../../components/errorNotification'

import './porgPicker.scss'

interface Porg {
  name: string
  title: string
}

interface PorgPickerProps {
  vscode?: any
  frontendClient?: FrontendContext
  accessToken?: any
  setShowAPIMSelection?: (value: boolean) => void
  onPorgSelectedCallback?: (value: any) => void
}

// pick a porg inline chat for first time if pOrg not defined
// vs porgPickerModal which is in a modal, initiated via "Switch organization"
export default function PorgPicker({
  vscode,
  frontendClient,
  accessToken,
  setShowAPIMSelection,
  onPorgSelectedCallback,
}: Readonly<PorgPickerProps>) {
  const {apiService, isPorgError, setPorg, setIsPorgError} = useAPI()

  const {isApprovalSubmitting, setShowPorgSelection} = useMyContext()

  const {setError, clearError} = useError()

  const [selectedPorg, setSelectedPorg] = useState<POrgName>('')
  const [porgs, setPorgs] = useState<Porg[]>([])
  const [porgErrorMessage] = useState<string>(PORG_ERROR_MESSAGE)
  const learnMore = getLearnMoreLink(frontendClient, vscode, accessToken)

  useEffect(() => {
    const fetchProviderOrganizations = async () => {
      clearError()
      const result = await fetchOrgs(
        apiService,
        setError,
        vscode,
        frontendClient,
        accessToken,
      )

      setPorgs(result.porgs)
      setIsPorgError(result.isPorgError)
    }

    fetchProviderOrganizations()
  }, [apiService])

  const handleRadioChange = (value: POrgName) => {
    setSelectedPorg(value)
    clearError()
  }

  const savePorg = () => {
    // save this to vscode state to be added to all REST calls
    setPorg(selectedPorg)

    // persistent this on vscode side
    vscode?.postMessage({
      type: 'savePorg',
      value: selectedPorg,
    })

    // hide the porg selection message
    setShowPorgSelection(false)

    if (setShowAPIMSelection) {
      setShowAPIMSelection(false)
    }

    // set the apiService org for all REST calls
    apiService?.setPorg(selectedPorg)

    if (onPorgSelectedCallback) {
      onPorgSelectedCallback(selectedPorg)
    }
  }

  return (
    <div className='pick-porg-container bx--grid'>
      {porgs.length > 0 ? (
        <div className='bx--row'>
          <div className='chat-bubble pick-porg-description'>
            <div>
              The following provider organization(s) are enabled in API Manager.
            </div>
            <div>Which one would you like to use?</div>
          </div>

          <FormGroup legendText=''>
            <Stack gap={7}>
              <RadioButtonGroup
                name={'porg'}
                legendText={'Provider organization'}
                orientation='vertical'
                onChange={value => {
                  handleRadioChange(value)
                }}
              >
                {porgs?.map((porg: Porg) => (
                  <RadioButton
                    key={porg.name}
                    labelText={porg.name}
                    name={porg.name}
                    value={porg.name}
                    disabled={isApprovalSubmitting}
                    checked={porg.name === selectedPorg}
                  />
                ))}
              </RadioButtonGroup>
            </Stack>
          </FormGroup>

          <FormGroup legendText=''>
            <ChatButton
              isQuickAction
              disabled={!selectedPorg}
              onClick={savePorg}
            >
              Continue
            </ChatButton>
          </FormGroup>
        </div>
      ) : (
        <AiSkeletonText width={`120px`} />
      )}

      {isPorgError && porgs.length === 0 && (
        <ErrorNotification
          isError={isPorgError}
          setIsError={setIsPorgError}
          errorMessage={porgErrorMessage}
          frontendClient={frontendClient}
          title='No provider organizations'
          vscode={vscode}
        >
          {learnMore}
        </ErrorNotification>
      )}
    </div>
  )
}
