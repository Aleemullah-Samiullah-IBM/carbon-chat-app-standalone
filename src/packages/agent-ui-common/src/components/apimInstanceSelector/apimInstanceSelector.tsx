import React, {useState, useEffect} from 'react'
import {
  Dropdown as CarbonDropdown,
  FormLabel,
  unstable__AiSkeletonText as AiSkeletonText,
} from '@carbon/react'
import {useMyContext} from '../../contexts/ChatContext'
import './apimInstanceSelector.scss'

// Use type casting to fix TypeScript errors with Carbon components
const Dropdown = CarbonDropdown as any

export interface ApimInstance {
  id: string
  name: string
  url: string
  access_token: string
}

export interface ApimInstanceSelectorProps {
  instances?: ApimInstance[]
  apimInstances?: ApimInstance[] // Support the prop name used in ChatPane
  onInstanceSelect: (instance: ApimInstance) => void
  isLoading?: boolean
  initialSelectedInstance?: ApimInstance // Add prop to set initial selection
}

export default function ApimInstanceSelector({
  instances = [],
  apimInstances = [],
  onInstanceSelect,
  isLoading = false,
  initialSelectedInstance,
}: Readonly<ApimInstanceSelectorProps>) {
  // Get the ChatContext for setting hostUrl, token, and auth
  const {setHostUrl, setApicToken, setAuth} = useMyContext()

  // Use either instances or apimInstances (for backward compatibility)
  const actualInstances = apimInstances.length > 0 ? apimInstances : instances

  // Process instances to ensure they have id properties
  const processedInstances = actualInstances.map(instance => {
    // If the instance doesn't have an id but has a name, use the name as id
    if (!instance.id && instance.name) {
      return {...instance, id: instance.name}
    }
    return instance
  })

  const [selectedInstance, setSelectedInstance] = useState<string>()

  // Set initial selection when component mounts or initialSelectedInstance changes
  useEffect(() => {
    if (initialSelectedInstance) {
      setSelectedInstance(
        initialSelectedInstance.id || initialSelectedInstance.name,
      )
    } else {
      setSelectedInstance(undefined)
    }
  }, [initialSelectedInstance])

  const handleInstanceChange = (event: {selectedItem: ApimInstance}) => {
    const instance = event.selectedItem
    setSelectedInstance(instance.id)

    // Update the ChatContext with the selected instance's URL and token
    if (instance.url) {
      setHostUrl(instance.url)
    }
    if (instance.access_token) {
      setApicToken(instance.access_token)
    }

    // Set auth in ChatContext
    if (instance.url && instance.access_token) {
      setAuth({
        API_URL: instance.url,
        OVERRIDE_TOKEN: instance.access_token,
        'X-ibm-user': '',
        'X-ibm-org': '',
        nonce: '',
      })
    }

    // Pass the full instance object to the parent component
    onInstanceSelect(instance)
  }

  return (
    <div className='apim-instance-selector-container'>
      {isLoading ? (
        <AiSkeletonText width='100%' />
      ) : (
        <div>
          <FormLabel className='apim-instance-selector-label'>
            Select an API Manager
          </FormLabel>
          <Dropdown
            id='apim-instance-dropdown'
            titleText=''
            label='Select an API Manager'
            items={processedInstances}
            itemToString={(item: ApimInstance) => (item ? item.name : '')}
            onChange={handleInstanceChange}
            selectedItem={processedInstances.find(
              instance => instance.id === selectedInstance,
            )}
            className='apim-instance-dropdown'
          />
        </div>
      )}
    </div>
  )
}
