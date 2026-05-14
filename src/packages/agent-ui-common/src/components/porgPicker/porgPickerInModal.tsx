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
} from '@carbon/react'
import {useMyContext} from '../../contexts/ChatContext'
import {useAPI} from '../../contexts/APIContext'

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

interface PorgPickerInModalProps {
  onPorgSelectedCallback?: (value: any) => void
  selectedPorg?: POrgName
  isOpen?: boolean
  vscode?: any
  frontendClient?: FrontendContext
  accessToken?: any
}

// alt version of PorgPicker nested in a modal
// nuanced differences between porgPicker.tsx
export default function PorgPickerInModal({
  selectedPorg,
  onPorgSelectedCallback,
  isOpen = false,
  vscode,
  frontendClient,
  accessToken,
}: Readonly<PorgPickerInModalProps>) {
  const {apiService} = useAPI()
  const {isApprovalSubmitting} = useMyContext()

  const [porgs, setPorgs] = useState<Porg[]>([])
  const [isPorgError, setIsPorgError] = useState<boolean>(false)
  const [porgErrorMessage] = useState<string>(PORG_ERROR_MESSAGE)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const learnMore = getLearnMoreLink(frontendClient, vscode, accessToken)

  useEffect(() => {
    const fetchProviderOrganizations = async () => {
      setIsLoading(true)
      const result = await fetchOrgs(
        apiService,
        vscode,
        frontendClient,
        accessToken,
      )

      setPorgs(result.porgs)
      setIsPorgError(result.isPorgError)
      setIsLoading(false)
    }

    // only fetch orgs when the modal is open
    if (isOpen && apiService) {
      fetchProviderOrganizations()
    }
  }, [apiService, isOpen])

  const handleRadioChange = async (value: POrgName) => {
    // notify parent component about selection
    if (onPorgSelectedCallback) {
      onPorgSelectedCallback(value)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <AiSkeletonText width={`120px`} />
    }

    if (porgs.length > 0) {
      return (
        <div className='bx--row'>
          <FormGroup legendText=''>
            <Stack gap={7}>
              <RadioButtonGroup
                // key needed to clear out old selected value
                key={selectedPorg === undefined ? 'reset' : 'active'}
                name={'porg'}
                legendText={'Select a provider organization'}
                orientation='vertical'
                defaultSelected={selectedPorg ?? undefined}
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
                    // checked={porg.name === selectedPorg}
                  />
                ))}
              </RadioButtonGroup>
            </Stack>
          </FormGroup>
        </div>
      )
    }

    return (
      <ErrorNotification
        isError={isPorgError}
        setIsError={setIsPorgError}
        errorMessage={porgErrorMessage}
        title='No provider organizations'
      >
        {learnMore}
      </ErrorNotification>
    )
  }

  return <div className='pick-porg-container bx--grid'>{renderContent()}</div>
}
