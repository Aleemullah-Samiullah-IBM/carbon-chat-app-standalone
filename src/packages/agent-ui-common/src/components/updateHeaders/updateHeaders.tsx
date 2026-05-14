import {useState, useEffect, useCallback, useMemo} from 'react'
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  InlineNotification,
  TextArea,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  Loading,
  Select,
  SelectItem,
  Modal,
  Tooltip,
} from '@carbon/react'
import {
  Add,
  Checkmark,
  Clean,
  Information,
  TrashCan,
  Play,
} from '@carbon/icons-react'
import {useTranslation} from 'react-i18next'

import {
  CustomHeader,
  getCustomHeaders,
  saveCustomHeaders,
  getCustomHostUrl,
  saveCustomHostUrl,
  getCustomAgentType,
  saveCustomAgentType,
  customHeadersToObject,
} from '../../utilities/customHeadersStorage'
import {get} from '../../services/http/http'
import {useAPI} from '../../contexts/APIContext'
import {
  AgentType,
  PredefinedHeader,
  getAgentHeadersMap,
  AGENT_OPTIONS,
} from './constants'

import './updateHeaders.scss'

interface UpdateHeadersModalProps {
  apiConfig?: {
    hostUrl?: string
    token?: string
    user?: string
    org?: string
  }
  onClose?: () => void
  isOpen?: boolean
  showHostUrl?: boolean
}

export const UpdateHeadersModal: React.FC<UpdateHeadersModalProps> = ({
  apiConfig,
  onClose,
  isOpen,
  showHostUrl = false,
}) => {
  const {t} = useTranslation()
  const {apiService} = useAPI()
  const [headers, setHeaders] = useState<CustomHeader[]>([])
  const [predefinedHeaders, setPredefinedHeaders] = useState<
    Record<string, string>
  >({})
  const [hostUrl, setHostUrl] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)
  const [validationError, setValidationError] = useState<string>('')

  const [confirmMessage, setConfirmMessage] = useState<string>('')
  const [savedHeadersCount, setSavedHeadersCount] = useState(0)

  // agent type selector
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('APIC')

  // MCSP token generation states
  const [showMcspModal, setShowMcspModal] = useState(false)
  const [mcspApiUrl, setMcspApiUrl] = useState('')
  const [mcspApiKey, setMcspApiKey] = useState('')
  const [mcspServiceId, setMcspServiceId] = useState('')
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)
  const [mcspError, setMcspError] = useState<string>('')

  // test API connection states
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    status?: number
  } | null>(null)

  // Get agent headers map with i18n support
  const AGENT_HEADERS_MAP = useMemo(() => getAgentHeadersMap(t), [t])

  // helper to get current predefined headers based on selected agent
  const currentPredefinedHeaders = useMemo(
    () => AGENT_HEADERS_MAP[selectedAgent],
    [selectedAgent, AGENT_HEADERS_MAP],
  )

  // helper to load/ init predefined headers for a given agent type
  const loadPredefinedHeadersForAgent = useCallback(
    (agentType: AgentType): Record<string, string> => {
      const storedHeaders = getCustomHeaders()
      const storedAgentType = getCustomAgentType()

      // build a map of stored predefined headers
      const storedPredefined: Record<string, string> = {}
      const allPredefinedKeys = new Set<string>()
      Object.values(AGENT_HEADERS_MAP).forEach(headerList => {
        headerList.forEach(h => allPredefinedKeys.add(h.key.toLowerCase()))
      })

      storedHeaders.forEach(header => {
        if (allPredefinedKeys.has(header.key.toLowerCase())) {
          storedPredefined[header.key] = header.value
        }
      })

      // init predefined headers for agent type
      const currentAgentHeaders = AGENT_HEADERS_MAP[agentType]
      const initializedPredefined: Record<string, string> = {}
      currentAgentHeaders.forEach(header => {
        // Only populate from localStorage if the stored agent type matches
        if (storedAgentType === agentType) {
          initializedPredefined[header.key] = storedPredefined[header.key] || ''
        } else {
          initializedPredefined[header.key] = ''
        }
      })

      return initializedPredefined
    },
    [AGENT_HEADERS_MAP],
  )

  // update predefined headers when agent type changes
  useEffect(() => {
    // skip if predefined headers are empty (initial state or just cleared)
    if (Object.keys(predefinedHeaders).length === 0) {
      return
    }

    // check if current predefined headers match the selected agent's headers
    const currentAgentHeaders = AGENT_HEADERS_MAP[selectedAgent]
    const currentHeaderKeys = currentAgentHeaders.map(h => h.key).sort()
    const predefinedHeaderKeys = Object.keys(predefinedHeaders).sort()

    // If keys match, this is likely initial load, don't clear
    const keysMatch =
      currentHeaderKeys.length === predefinedHeaderKeys.length &&
      currentHeaderKeys.every(
        (key, index) => key === predefinedHeaderKeys[index],
      )

    if (keysMatch) {
      return
    }

    // user manually switched agent types - load headers for new agent
    const initializedPredefined = loadPredefinedHeadersForAgent(selectedAgent)
    setPredefinedHeaders(initializedPredefined)
    setHasChanges(true)
  }, [selectedAgent, predefinedHeaders, loadPredefinedHeadersForAgent])

  // load headers, host URL, and agent type from localStorage
  useEffect(() => {
    if (isOpen) {
      const storedHeaders = getCustomHeaders()
      const storedHostUrl = getCustomHostUrl()
      const storedAgentType = getCustomAgentType()

      // restore agent type if saved
      let agentToUse: AgentType = 'APIC'
      if (
        storedAgentType &&
        (storedAgentType === 'APIC' ||
          storedAgentType === 'AICS' ||
          storedAgentType === 'Solis')
      ) {
        agentToUse = storedAgentType as AgentType
      }

      // separate custom headers from predefined headers
      const custom: CustomHeader[] = []

      // use Set for faster lookup of predefined header keys (all agent types)
      const allPredefinedKeys = new Set<string>()
      Object.values(AGENT_HEADERS_MAP).forEach(headerList => {
        headerList.forEach(h => allPredefinedKeys.add(h.key.toLowerCase()))
      })

      storedHeaders.forEach(header => {
        const isPredefined = allPredefinedKeys.has(header.key.toLowerCase())
        if (!isPredefined) {
          custom.push(header)
        }
      })

      // load predefined headers for agent type using helper
      const initializedPredefined = loadPredefinedHeadersForAgent(agentToUse)

      setPredefinedHeaders(initializedPredefined)
      setHeaders(custom)
      setHostUrl(storedHostUrl || '')
      setSelectedAgent(agentToUse)

      // clear previous messages
      setValidationError('')
      setConfirmMessage('')
      setHasChanges(false)

      // clear test result
      setTestResult(null)
    }
  }, [isOpen])

  // memo-ize event handlers to prevent unnecessary re-renders
  const handleAddHeader = useCallback(() => {
    const newHeader: CustomHeader = {
      id: `header_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: '',
      value: '',
    }
    setHeaders(prev => [...prev, newHeader])
    setHasChanges(true)
  }, [])

  const handleDeleteHeader = useCallback((id: string) => {
    setHeaders(prev => prev.filter(header => header.id !== id))
    setHasChanges(true)
  }, [])

  const handleKeyChange = useCallback((id: string, newKey: string) => {
    setHeaders(prev =>
      prev.map(header =>
        header.id === id ? {...header, key: newKey} : header,
      ),
    )
    setHasChanges(true)
  }, [])

  const handleValueChange = useCallback((id: string, newVal: string) => {
    setHeaders(prev =>
      prev.map(header =>
        header.id === id ? {...header, value: newVal} : header,
      ),
    )
    setHasChanges(true)
  }, [])

  const handlePredefinedHeaderChange = useCallback(
    (key: string, value: string) => {
      setPredefinedHeaders(prev => ({
        ...prev,
        [key]: value,
      }))
      setHasChanges(true)
    },
    [],
  )

  const handleClearPredefinedHeader = useCallback((key: string) => {
    setPredefinedHeaders(prev => ({
      ...prev,
      [key]: '',
    }))
    setHasChanges(true)
  }, [])

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  const handleSubmit = async () => {
    // check incomplete headers (rows with only key or only value filled)
    const incompleteHeaders = headers.filter(
      header =>
        (header.key.trim() !== '' && header.value.trim() === '') ||
        (header.key.trim() === '' && header.value.trim() !== ''),
    )

    if (incompleteHeaders.length > 0) {
      setValidationError(t('updateHeaders.incompleteHeadersError'))
      return
    }

    // filter out empty custom headers
    const validCustomHeaders = headers.filter(
      header => header.key.trim() !== '' && header.value.trim() !== '',
    )

    // Validate that custom header keys start with 'X-ibm-'
    const invalidHeaders = validCustomHeaders.filter(
      header => !header.key.toLowerCase().startsWith('x-ibm-'),
    )

    if (invalidHeaders.length > 0) {
      const invalidKeys = invalidHeaders.map(h => h.key).join(', ')
      setValidationError(
        t('updateHeaders.invalidHeaderKeysError', {keys: invalidKeys}),
      )
      return
    }

    const allHeaders = combinedHeaders

    // clear previous validation errors
    setValidationError('')

    // test API connection if host URL is provided (validate before saving)
    if (showHostUrl && hostUrl.trim() !== '') {
      setIsTestingApi(true)
      setTestResult(null)

      const result = await testApiConnection(allHeaders)
      setTestResult(result)
      setIsTestingApi(false)

      if (!result.success) {
        // Don't save if validation fails
        return
      }
    }

    // save all headers, host URL, and agent type
    saveCustomHeaders(allHeaders)
    saveCustomHostUrl(hostUrl.trim())
    saveCustomAgentType(selectedAgent)
    setHasChanges(false)

    // refresh cached headers in API service
    if (apiService) {
      apiService.refreshCustomHeaders()
    }

    // show confirm message
    setSavedHeadersCount(allHeaders.length)
    const hostUrlSaved = showHostUrl && hostUrl.trim() !== ''
    if (allHeaders.length > 0 || hostUrlSaved) {
      const parts = []
      if (allHeaders.length > 0) {
        const headerText =
          allHeaders.length === 1
            ? t('updateHeaders.headerText')
            : t('updateHeaders.headersText')
        parts.push(`${allHeaders.length} ${headerText}`)
      }
      if (hostUrlSaved) {
        parts.push(t('updateHeaders.hostUrlText'))
      }
      const verb = parts.length === 1 ? 'has' : 'have'
      setConfirmMessage(
        t('updateHeaders.savedSuccessMessage', {
          items: parts.join(' and '),
          verb,
        }),
      )
    } else {
      const noItemsMessage = showHostUrl
        ? t('updateHeaders.noItemsSavedMessage')
        : t('updateHeaders.noHeadersSavedMessage')
      setConfirmMessage(noItemsMessage)
    }

    // auto-close after 3 seconds
    setTimeout(() => {
      if (onClose) {
        onClose()
      }
    }, 3000)
  }

  const combinedHeaders = useMemo((): CustomHeader[] => {
    // combine predefined headers (only non-empty values) with custom headers
    const predefinedHeadersList: CustomHeader[] = Object.entries(
      predefinedHeaders,
    )
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => ({
        id: `predefined_${key}`,
        key,
        value,
      }))

    const validCustomHeaders = headers.filter(
      header => header.key.trim() !== '' && header.value.trim() !== '',
    )

    return [...predefinedHeadersList, ...validCustomHeaders]
  }, [predefinedHeaders, headers])

  const handleTestApiCall = useCallback(async () => {
    setIsTestingApi(true)
    setTestResult(null)

    const result = await testApiConnection(combinedHeaders)
    setTestResult(result)
    setIsTestingApi(false)
  }, [combinedHeaders, hostUrl])

  // Helper to test API connection with given headers
  const testApiConnection = useCallback(
    async (
      headersToTest: CustomHeader[],
    ): Promise<{success: boolean; message: string; status?: number}> => {
      try {
        // build headers object using same utility function as apiService
        const headersObj = customHeadersToObject(headersToTest)

        // GET using the http service to test the API
        const {status, statusText} = await get(hostUrl.trim() + '/v1/chats', {
          headers: headersObj,
        })

        const statusTextDisplay = statusText || 'No status text'

        if (status >= 200 && status < 300) {
          return {
            success: true,
            message: t('updateHeaders.successMessage', {
              status,
              statusText: statusTextDisplay,
            }),
            status: status,
          }
        } else {
          return {
            success: false,
            message: t('updateHeaders.failedMessage', {
              status,
              statusText: statusTextDisplay,
            }),
            status: status,
          }
        }
      } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error'
        const status = error?.response?.status
        const statusText = error?.response?.statusText || ''

        return {
          success: false,
          message: t('updateHeaders.requestFailedMessage', {
            statusInfo: status ? ` with status ${status} ${statusText}` : '',
            error: errorMessage,
          }),
          status: status,
        }
      }
    },
    [hostUrl],
  )

  // generate MCSP token
  const handleGenerateMcspToken = async () => {
    // check inputs
    if (!mcspApiUrl.trim() || !mcspApiKey.trim() || !mcspServiceId.trim()) {
      setMcspError('All fields are required to generate MCSP token')
      return
    }

    setIsGeneratingToken(true)
    setMcspError('')

    try {
      const baseApiUrl = apiConfig?.hostUrl
      const response = await fetch(`${baseApiUrl}/api/generate-mcsp-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generateMcspTokenApi: mcspApiUrl.trim(),
          mcspApiKey: mcspApiKey.trim(),
          instance_id: mcspServiceId.trim(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Token generation failed. Status: ${response.status}. ${errorText}`,
        )
      }

      const body = await response.json()
      const token = body.token
      const token_type = body.token_type

      if (!token) {
        throw new Error('Token not found in response body')
      }

      // console.log('MCSP token generated successfully', body)

      // set the token_type + token in Authorization header
      handlePredefinedHeaderChange('Authorization', `${token_type} ${token}`)

      // close generate token modal and show success
      setShowMcspModal(false)
      setConfirmMessage('MCSP token generated and set successfully!')

      // clear form
      setMcspApiUrl('')
      setMcspApiKey('')
      setMcspServiceId('')
    } catch (error: any) {
      console.error('Failed to generate MCSP token:', error)
      setMcspError(error.message || 'Failed to generate MCSP token')
    } finally {
      setIsGeneratingToken(false)
    }
  }

  const handleCloseMcspModal = () => {
    setShowMcspModal(false)
    setMcspError('')
    setMcspApiUrl('')
    setMcspApiKey('')
    setMcspServiceId('')
  }

  return (
    <div className='update-headers-container'>
      <div>
        {t('updateHeaders.mainDescription')}{' '}
        <Toggletip
          align='right'
          autoAlign
        >
          <ToggletipButton label={t('updateHeaders.showBestPractices')}>
            <Information />
          </ToggletipButton>
          <ToggletipContent>
            <p>{t('updateHeaders.bestPractice1')}</p>
            <p>{t('updateHeaders.bestPractice2')}</p>
            <p>{t('updateHeaders.bestPractice3')}</p>
            <p>{t('updateHeaders.bestPractice4')}</p>
          </ToggletipContent>
        </Toggletip>
      </div>

      <InlineNotification
        aria-label='closes notification'
        kind='warning'
        hideCloseButton
        statusIconDescription={t('updateHeaders.warningStatus')}
        subtitle={t('updateHeaders.securityNoteSubtitle')}
        title={t('updateHeaders.securityNoteTitle')}
        lowContrast
      />

      {/* Host URL Configuration - only show if showHostUrl= true
      aka initiated from LandingPage */}
      {showHostUrl && (
        <div className='host-url-section'>
          <FormGroup legendText=''>
            <TextInput
              id='host-url-input'
              labelText={t('updateHeaders.apiHostUrlLabel')}
              placeholder={t('updateHeaders.apiHostUrlPlaceholder')}
              value={hostUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setHostUrl(e.target.value)
                setHasChanges(true)
                setTestResult(null) // clear test result when URL changes
              }}
              helperText={t('updateHeaders.apiHostUrlHelper')}
            />
          </FormGroup>
        </div>
      )}

      {/* Agent Type Selector */}
      {showHostUrl && (
        <div className='agent-selector-section'>
          <FormGroup legendText=''>
            <Select
              id='agent-type-select'
              labelText={t('updateHeaders.selectAgentTypeLabel')}
              value={selectedAgent}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedAgent(e.target.value as AgentType)
                setHasChanges(true)
              }}
            >
              {AGENT_OPTIONS.filter(option => option.enabled).map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  text={option.label}
                />
              ))}
            </Select>
          </FormGroup>
        </div>
      )}

      {/* Predefined IBM headers Section */}
      {showHostUrl && (
        <div className='predefined-headers-section'>
          <div className='section-header'>
            <div>
              <h3>
                {t('updateHeaders.agentHeadersTitle', {agent: selectedAgent})}
              </h3>
              <p className='section-description'>
                {t('updateHeaders.agentHeadersDescription', {
                  agent: selectedAgent,
                })}
              </p>
            </div>

            {/* disabled *unless* connected to web-sample backend which provides a proxy to the
                endpoint so that it can bypass CORS errors if initiated directly from browser UI */}
            {selectedAgent === 'AICS' && (
              <>
                {apiConfig?.hostUrl !== 'http://localhost:6005' ? (
                  <Tooltip
                    align='bottom'
                    label='API endpoint to fetch MCSP token not available'
                    enterDelayMs={300}
                  >
                    <span style={{display: 'inline-block'}}>
                      <Button
                        kind='tertiary'
                        size='sm'
                        onClick={() => setShowMcspModal(true)}
                        disabled={true}
                      >
                        {t('updateHeaders.generateMcspTokenButton')}
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    kind='tertiary'
                    size='sm'
                    onClick={() => setShowMcspModal(true)}
                  >
                    {t('updateHeaders.generateMcspTokenButton')}
                  </Button>
                )}
              </>
            )}
          </div>

          <div className='predefined-headers-list'>
            {currentPredefinedHeaders.map((header: PredefinedHeader) => (
              <FormGroup
                key={header.key}
                className='predefined-header-row'
                legendText=''
              >
                <div className='header-inputs'>
                  <TextInput
                    id={`predefined-key-${header.key}`}
                    labelText={t('updateHeaders.keyLabel')}
                    value={header.key}
                    disabled
                    readOnly
                  />

                  {header.type === 'json' ? (
                    <TextArea
                      id={`predefined-val-${header.key}`}
                      labelText={t('updateHeaders.valueLabel')}
                      // placeholder={header.placeholder}
                      helperText={header.description}
                      value={predefinedHeaders[header.key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handlePredefinedHeaderChange(header.key, e.target.value)
                      }
                      rows={3}
                    />
                  ) : (
                    <TextInput
                      id={`predefined-val-${header.key}`}
                      labelText={t('updateHeaders.valueLabel')}
                      placeholder={header.placeholder || header.description}
                      value={predefinedHeaders[header.key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handlePredefinedHeaderChange(header.key, e.target.value)
                      }
                    />
                  )}

                  <div className='header-actions'>
                    <Button
                      kind='ghost'
                      size='sm'
                      hasIconOnly
                      iconDescription='Clear'
                      renderIcon={(props: any) => <Clean {...props} />}
                      onClick={() => handleClearPredefinedHeader(header.key)}
                      disabled={!predefinedHeaders[header.key]}
                    />
                  </div>
                </div>
              </FormGroup>
            ))}
          </div>
        </div>
      )}

      {validationError && (
        <InlineNotification
          aria-label='validation error'
          kind='error'
          hideCloseButton
          statusIconDescription={t('updateHeaders.errorStatus')}
          subtitle={validationError}
          title={t('updateHeaders.validationErrorTitle')}
          onCloseButtonClick={() => setValidationError('')}
        />
      )}

      {/* custom IBM headers section */}
      <div className='custom-headers-section'>
        <h3>{t('updateHeaders.customHeadersTitle')}</h3>
        <p className='section-description'>
          {t('updateHeaders.customHeadersDescription')}
        </p>
        <div className='headers-list'>
          {headers.map((header, index) => (
            <FormGroup
              key={header.id}
              className='custom-request-header-row'
              legendText={t('updateHeaders.customHeaderLegend', {
                number: index + 1,
              })}
            >
              <div className='header-inputs'>
                <TextInput
                  id={`header-key-${header.id}`}
                  labelText={t('updateHeaders.keyLabel')}
                  placeholder={t('updateHeaders.keyPlaceholder')}
                  value={header.key}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleKeyChange(header.id, e.target.value)
                  }
                />

                <TextInput
                  id={`header-val-${header.id}`}
                  labelText={t('updateHeaders.valueLabel')}
                  placeholder={t('updateHeaders.valuePlaceholder')}
                  value={header.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleValueChange(header.id, e.target.value)
                  }
                />

                <div className='header-actions'>
                  <Button
                    kind='ghost'
                    size='sm'
                    hasIconOnly
                    iconDescription={t('updateHeaders.deleteHeaderTooltip')}
                    renderIcon={(props: any) => <TrashCan {...props} />}
                    onClick={() => handleDeleteHeader(header.id)}
                  />
                </div>
              </div>
            </FormGroup>
          ))}

          {headers.length === 0 && t('updateHeaders.noCustomHeaders')}
        </div>

        <Button
          kind='tertiary'
          size='sm'
          renderIcon={(props: any) => <Add {...props} />}
          onClick={handleAddHeader}
        >
          {t('updateHeaders.addHeaderButton')}
        </Button>
      </div>

      {/* test API connection button */}
      {showHostUrl && (
        <>
          <div className='test-api-section'>
            <Button
              kind='tertiary'
              size='sm'
              renderIcon={(props: any) => <Play {...props} />}
              onClick={handleTestApiCall}
              disabled={isTestingApi || !hostUrl.trim()}
            >
              {isTestingApi
                ? t('updateHeaders.testingButton')
                : t('updateHeaders.testApiButton')}
            </Button>
            {isTestingApi && (
              <Loading
                small
                withOverlay={false}
              />
            )}
          </div>

          {testResult && (
            <InlineNotification
              aria-label='API test result'
              kind={testResult.success ? 'success' : 'error'}
              hideCloseButton={false}
              statusIconDescription={
                testResult.success
                  ? t('updateHeaders.successStatus')
                  : t('updateHeaders.errorStatus')
              }
              subtitle={testResult.message}
              title={
                testResult.success
                  ? t('updateHeaders.connectionSuccessTitle')
                  : t('updateHeaders.connectionFailedTitle')
              }
              onCloseButtonClick={() => setTestResult(null)}
              lowContrast
            />
          )}
        </>
      )}

      {/* statuc confirmation message */}
      {confirmMessage && (
        <InlineNotification
          aria-label='header confirmation message'
          kind={savedHeadersCount > 0 ? 'success' : 'info'}
          statusIconDescription={
            savedHeadersCount > 0 ? t('updateHeaders.successStatus') : 'Info'
          }
          subtitle={confirmMessage}
          title={
            confirmMessage.includes('MCSP token')
              ? 'Token Generated'
              : savedHeadersCount > 0
                ? t('updateHeaders.headersSavedTitle')
                : t('updateHeaders.noHeadersSavedTitle')
          }
          onCloseButtonClick={() => setConfirmMessage('')}
        />
      )}

      <div className='modal-actions'>
        <Button
          kind='secondary'
          size='md'
          onClick={handleCancel}
        >
          {t('updateHeaders.cancelButton')}
        </Button>

        <Button
          kind='primary'
          size='md'
          renderIcon={(props: any) => <Checkmark {...props} />}
          onClick={handleSubmit}
          disabled={!hasChanges}
        >
          {t('updateHeaders.saveChangesButton')}
        </Button>
      </div>

      {/* MCSP Token Generation Modal */}
      <Modal
        open={showMcspModal}
        onRequestClose={handleCloseMcspModal}
        modalHeading='Generate MCSP Token'
        primaryButtonText={
          isGeneratingToken ? 'Generating...' : 'Generate Token'
        }
        secondaryButtonText='Cancel'
        onRequestSubmit={handleGenerateMcspToken}
        onSecondarySubmit={handleCloseMcspModal}
        primaryButtonDisabled={isGeneratingToken}
      >
        <Form
          onSubmit={e => {
            e.preventDefault()
            // handleGenerateMcspToken()
          }}
        >
          <p style={{marginBottom: '1rem'}}>
            Enter the required information to generate an MCSP token. The token
            will be automatically set in the Authorization header. Tokens do
            expire, so regenerate a new one if you experience authorization
            problems.
          </p>

          {mcspError && (
            <InlineNotification
              aria-label='MCSP error'
              kind='error'
              hideCloseButton={false}
              statusIconDescription='Error'
              subtitle={mcspError}
              title='Token Generation Failed'
              onCloseButtonClick={() => setMcspError('')}
              lowContrast
              style={{marginBottom: '1rem'}}
            />
          )}

          <FormGroup legendText=''>
            <TextInput
              id='mcsp-api-url'
              labelText='MCSP API URL'
              placeholder='e.g., https://account-iam.platform.test.saas.ibm.com/api/2.0/services'
              value={mcspApiUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMcspApiUrl(e.target.value)
              }
              disabled={isGeneratingToken}
            />
          </FormGroup>

          <FormGroup legendText=''>
            <TextInput
              id='mcsp-api-key'
              labelText='MCSP API Key'
              placeholder='Your MCSP API key'
              value={mcspApiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMcspApiKey(e.target.value)
              }
              disabled={isGeneratingToken}
              type='password'
              autoComplete='off'
            />
          </FormGroup>

          <FormGroup legendText=''>
            <TextInput
              id='mcsp-service-id'
              labelText='Service ID'
              placeholder='Your service ID'
              value={mcspServiceId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMcspServiceId(e.target.value)
              }
              disabled={isGeneratingToken}
            />
          </FormGroup>

          {isGeneratingToken && (
            <Loading
              description='Generating token...'
              withOverlay={false}
            />
          )}
        </Form>
      </Modal>
    </div>
  )
}
