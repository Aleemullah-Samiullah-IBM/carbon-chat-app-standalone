import {JwtPayload, jwtDecode} from 'jwt-decode'

import {ChatEvent} from '../types/Message'
import {ArtifactMetadata} from '../types/FileData'
import {
  Command,
  ParsedCommandArgValue,
  ParsedCommandArgs,
} from '../types/Command'

interface UserIdJwtPayload extends JwtPayload {
  username: string
}

export const getCurrentTime = (dateString?: string) => {
  const now = dateString ? new Date(dateString) : new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  return `${formattedHours}:${minutes} ${period}`
}

// calculate the expiration date from the expiration in seconds
export function getExpirationDate(expireInSeconds: number): string {
  const currentDate = new Date()
  const expirationDate = new Date(
    currentDate.getTime() + expireInSeconds * 1000,
  )
  return expirationDate.toISOString()
}

export function transformChatMessagesData(events: ChatEvent[]): ChatEvent[] {
  return events
    .filter(
      item =>
        item.event.type === 'user-message' ||
        item.event.type === 'agent-plan' ||
        item.event.type === 'user-command' ||
        item.event.type === 'agent-message',
    )
    .map(item => ({
      ...item,
      event: {
        ...item.event,
      },
      timestamp: getCurrentTime(item.timestamp), //new Date(item.timestamp).toLocaleString(),
    }))
}

export function isNestedObject(obj: any) {
  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj)

    for (const key of keys) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        return true // nested object
      }
    }
    return false // single-level object
  }
  return false // not object
}

export const getFileName = (path: string) => {
  let trimmedPath = path.trim()

  // remove leading '@'
  if (trimmedPath.startsWith('@')) {
    trimmedPath = trimmedPath.slice(1)
  }
  // strip surrounding single or double quotes
  if (
    (trimmedPath.startsWith("'") && trimmedPath.endsWith("'")) ||
    (trimmedPath.startsWith('"') && trimmedPath.endsWith('"'))
  ) {
    trimmedPath = trimmedPath.slice(1, -1)
  }
  // if the path contains a '/', return last part (filename)
  if (trimmedPath.includes('/')) {
    return trimmedPath.split('/').at(-1)
  } else {
    return trimmedPath
  }
}

// Helper function to extract error message from different error types
export const getErrorMessage = (error: any): string => {
  if (error?.element) {
    return error.message
  } else if (error instanceof Error) {
    return error.message
  } else {
    return String(error)
  }
}

export const getFileExtension = (fileName: string): string | null => {
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return null
  }

  return fileName.substring(lastDotIndex + 1)
}

export const getFileMetadata = (
  filename: string,
  attachments: ArtifactMetadata[],
) => {
  return attachments.find(attachment => attachment.filename === filename)
}

export const parseToolcallArguments = (
  toolcallArgs: Record<string, any>,
): Record<string, any> => {
  // Helper to detect whether or not a value is a file
  function isFile(value: any): boolean {
    return typeof value === 'object' && value !== null && 'filename' in value
  }

  function recursiveParse(value: any): any {
    if (value === null || value === '') {
      // skip displaying any key:value if value null
      return undefined
    }

    if (isFile(value)) {
      return value.filename
    }

    if (Array.isArray(value)) {
      return value.map(recursiveParse)
    }

    if (typeof value === 'object' && value !== null) {
      const parsedObject: Record<string, any> = {}
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          parsedObject[key] = recursiveParse(value[key])
        }
      }
      return parsedObject
    }

    return value
  }

  // Deep copy
  const parsedToolcallArgs = recursiveParse(
    JSON.parse(JSON.stringify(toolcallArgs)),
  )

  // Toolcall args
  // return yaml.dump(parsedToolcallArgs)
  // yaml.dump may not be appropriate in all cases, returning parsed object
  return parsedToolcallArgs
}

// used to get username from accessToken returned from APIC
export const decodeToken = (accessToken: any) => {
  try {
    const data = jwtDecode<UserIdJwtPayload>(accessToken)
    return {data}
  } catch (error) {
    return {error}
  }
}

export const tokenizeInput = (input: string): string[] => {
  const regex = /@'[^']*'|@"[^"]*"|'[^']*'|"[^"]*"|[^ ]+/g
  return input.match(regex) ?? []
}

export const cleanInput = (curr_input: string) => {
  const tokens = tokenizeInput(curr_input)
  return tokens
    .map(token => (token.startsWith('@') ? getFileName(token) : token))
    .join(' ')
}

// used by slash command to parse prompt into key-value pairs to send to API
// do not split by colons or spaces (that will fail if user enters a url, json/yaml, etc), rather extract values between params
// and find any missing required fields to display to user in client side error handling
export const parseInputandValidate = (
  userInput: string,
  commands: Command[],
  attachments: ArtifactMetadata[],
) => {
  const commandName = extractCommandName(userInput)
  const inputAfterCommand = extractInputAfterCommand(userInput)

  const command = commands.find(cmd => cmd.name === commandName)
  if (!command) {
    return {missingFields: [], parsedCommandArgs: {}}
  }

  const paramNames = command.parameters.map(p => p.name)

  // validate input format
  validatePartsFormat(inputAfterCommand, paramNames)

  // parse all params
  const parsedCommandArgs = parseParams(
    inputAfterCommand,
    paramNames,
    attachments,
  )

  // check for missing required fields
  const missingFields = getMissingRequiredFields(
    commands,
    commandName,
    parsedCommandArgs,
  )

  return {missingFields, parsedCommandArgs}
}

// parseInputandValidate helpers

function extractCommandName(input: string): string {
  return input.split(' ')[0].slice(1)
}

function extractInputAfterCommand(input: string): string {
  return input.substring(input.indexOf(' ') + 1).trim()
}

function validatePartsFormat(input: string, paramNames: string[]): void {
  const parts = input.split(/\s+/)
  for (const part of parts) {
    if (paramNames.includes(part) && !part.includes(':')) {
      throw new Error(
        `Invalid format for part: '${part}'. Expected 'key:value' or 'key: value'.`,
      )
    }
  }
}

// find next param in remaining input
function findNextParam(
  remainingInput: string,
  paramNames: string[],
): {name: string; index: number} | null {
  let foundParam: {name: string; index: number} | null = null

  for (const paramName of paramNames) {
    const pattern = new RegExp(`\\b${paramName}:`, 'i')
    const match = pattern.exec(remainingInput)

    if (match && (foundParam === null || match.index < foundParam.index)) {
      foundParam = {name: paramName, index: match.index}
    }
  }

  return foundParam
}

// find idx where the param value ends
function findValueEndIndex(
  remainingInput: string,
  valueStartIndex: number,
  currentParamName: string,
  paramNames: string[],
): number {
  let nextParamIndex = remainingInput.length

  for (const nextParamName of paramNames) {
    if (nextParamName === currentParamName) continue

    const pattern = new RegExp(`\\b${nextParamName}:`, 'i')
    const match = pattern.exec(remainingInput.substring(valueStartIndex))

    if (match && valueStartIndex + match.index < nextParamIndex) {
      nextParamIndex = valueStartIndex + match.index
    }
  }

  return nextParamIndex
}

// process param value (handle file attachments)
function processParamValue(
  value: string,
  attachments: ArtifactMetadata[],
): ParsedCommandArgValue {
  if (value.startsWith('@')) {
    const fileName = getFileName(value) ?? value
    const fileMetadata = getFileMetadata(fileName, attachments)
    return fileMetadata || value
  }
  return value
}

// parse all params from input
function parseParams(
  inputAfterCommand: string,
  paramNames: string[],
  attachments: ArtifactMetadata[],
): Record<string, ParsedCommandArgValue> {
  const parsedCommandArgs: Record<string, ParsedCommandArgValue> = {}
  let remainingInput = inputAfterCommand

  while (remainingInput.length > 0) {
    const foundParam = findNextParam(remainingInput, paramNames)

    if (!foundParam) break

    const paramName = foundParam.name
    const valueStartIndex = foundParam.index + paramName.length + 1
    const valueEndIndex = findValueEndIndex(
      remainingInput,
      valueStartIndex,
      paramName,
      paramNames,
    )

    const rawValue = remainingInput
      .substring(valueStartIndex, valueEndIndex)
      .trim()

    parsedCommandArgs[paramName] = processParamValue(rawValue, attachments)
    remainingInput = remainingInput.substring(valueEndIndex).trim()
  }

  return parsedCommandArgs
}

export function getMissingRequiredFields(
  commands: Command[],
  commandName: string,
  parsedCommandArgs: ParsedCommandArgs,
) {
  const command = commands.find(cmd => cmd.name === commandName)

  if (!command || !Array.isArray(command.parameters)) return []

  const missingFields: string[] = []

  for (const param of command.parameters) {
    if (
      param.required &&
      (!parsedCommandArgs.hasOwnProperty(param.name) ||
        parsedCommandArgs[param.name] === '' ||
        parsedCommandArgs[param.name] === null)
    ) {
      missingFields.push(param.name)
    }
  }

  return missingFields
}

// end of parseInputandValidate helpers

// used by handleToolcallMode()
export const isAgentResponse = (type: string) =>
  ['agent-plan', 'agent-message', 'selection-request'].includes(type)

export const shouldResetToolcalls = (type: string, response: any) =>
  (type === 'agent-plan' && response.planned_toolcalls?.length === 0) ||
  type === 'agent-message' ||
  type === 'selection-request'

export const shouldUpdatePlan = (type: string, response: any) =>
  type === 'agent-plan' &&
  response.executed_toolcalls &&
  response.planned_toolcalls?.length > 0

// this is helper function specifically for the `x-ibm-agent-frontend-context` header
// to MERGE the data instead of OVERRIDING it
// here we are standardizing key-value pairs into a single json string
export function updateContext(
  context: string | undefined,
  key: string,
  value: any,
): string {
  let parsedContext: Record<string, any> = {}

  if (context && typeof context === 'string') {
    try {
      parsedContext = JSON.parse(context) as Record<string, any>
    } catch (e) {
      console.error('Existing context is not valid JSON. Start new.')
    }
  }

  parsedContext[key] = value

  return JSON.stringify(parsedContext)
}

/**
 * Processes formatted session data and updates state based on the last event
 * @param formattedSession Array of formatted chat messages
 * @param headers Headers to attach to each message
 * @param setMessages React setState function for messages
 * @param setPlan React setState function for plan
 * @param setIsToolcallMode React setState function for toolcall mode
 * @param resetToolcalls Function to reset toolcalls state
 */
export function processFormattedSession(
  formattedSession: any[],
  headers: any,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setPlan: React.Dispatch<React.SetStateAction<any>>,
  setIsToolcallMode: React.Dispatch<React.SetStateAction<boolean>>,
  resetToolcalls: () => void,
): void {
  if (formattedSession.length > 0) {
    setMessages(prevMessages => [
      ...prevMessages,
      ...formattedSession.map(msg => ({...msg, headers})),
    ])

    const lastEvent = formattedSession[formattedSession.length - 1].event
    if (lastEvent.type === 'agent-plan') {
      if ((lastEvent?.planned_toolcalls ?? []).length > 0) {
        setPlan({
          executed_toolcalls: [...(lastEvent.executed_toolcalls ?? [])],
          planned_toolcalls: [...(lastEvent.planned_toolcalls ?? [])],
        })
        setIsToolcallMode(true)
      } else {
        resetToolcalls()
      }
    } else {
      resetToolcalls()
    }
  }
}

/**
 * Find a specific executed toolcall based on operation_id and tool name
 * @param executed_toolcalls Array of executed toolcalls
 * @param operation_id Operation ID of executed operation
 * @returns The matching executed toolcall or undefined
 */
export const findExecutedToolcall = (
  executed_toolcalls: any[] | undefined,
  operation_id: string,
): any => {
  if (!executed_toolcalls || executed_toolcalls.length === 0) {
    return undefined
  }

  return executed_toolcalls?.find(
    toolcall => toolcall.arguments?.operation?.operation_id === operation_id,
  )
}

/**
 * Find a specific response detail based on tool type and criteria
 * @param response_details Array of response details
 * @param toolType Type of tool to search for
 * @returns The matching response detail or undefined
 */
export const findResponseDetail = (
  response_details: any[] | undefined,
  toolType:
    | 'governance_validation'
    | 'governance_remediation'
    | 'suggestions'
    | 'autocorrect',
): any => {
  if (!response_details || response_details.length === 0) {
    return undefined
  }

  switch (toolType) {
    case 'governance_validation':
      // Find response with validation_errors
      return response_details.find(
        detail => detail.extra_data?.validation_errors?.value,
      )

    case 'governance_remediation':
      // Find response with remediation
      return response_details.find(
        detail => detail.extra_data?.remediation?.value,
      )

    case 'suggestions':
      // Find OpenAPIEnhancer response with suggestions
      return response_details.find(
        detail => detail.extra_data?.enhanced_openapi?.value?.body?.suggestions,
      )

    case 'autocorrect':
      // Find OpenAPIEnhancer response with fixedOpenAPI
      return response_details.find(
        detail => detail?.extra_data?.enhanced_openapi?.value?.fixedOpenAPI,
      )
  }
}

/**
 * Helper function to friendly relative time for Recent chats list
 * @param isoDate string date, e.g. "2026-06-14T23:27:49.892714Z"
 * @param date relative time, like "Just now", "6 hours ago", "14 days ago"
 */
export const formatLastInteractionDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 30) {
    return 'Just now'
  }

  if (diffMinutes < 1) {
    return 'Less than a minute ago'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  }

  if (diffDays === 1) {
    return 'Yesterday'
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Options for handleSlashCommand function
 */
export interface HandleSlashCommandOptions {
  input: string
  attachments: ArtifactMetadata[]
  commands: Command[]
  chatUUID: string
  apiService: any
  setError: (error: any) => void
  clearError: () => void
  setMessages: React.Dispatch<React.SetStateAction<ChatEvent[]>>
  setIsToolcallMode: (value: boolean) => void
  setPlan: (plan: any) => void
  setLoading: (value: boolean) => void
  chatUUIDRef: React.RefObject<string>
  onOpenAttachments?: (attachments: ArtifactMetadata[]) => void
}

/**
 * Helper function to handle slash commands
 * Shared between web-app and vscode-plugin to avoid code duplication
 * @param options Object containing all required parameters
 */
export const handleSlashCommand = async (
  options: HandleSlashCommandOptions,
): Promise<void> => {
  const {
    input,
    attachments,
    commands,
    chatUUID,
    apiService,
    setError,
    clearError,
    setMessages,
    setIsToolcallMode,
    setPlan,
    setLoading,
    chatUUIDRef,
    onOpenAttachments,
  } = options

  try {
    const toolName = input.trim().split(' ')[0].slice(1)
    const {missingFields, parsedCommandArgs} = parseInputandValidate(
      input.trim(),
      commands,
      attachments,
    )

    // client side error handling for missing required fields
    if (missingFields.length > 0) {
      const error = `Missing required fields for command: ${missingFields.join(
        ', ',
      )}`
      setError(error)
      return
    } else {
      clearError()
    }

    // call the new REST endpoint with toolName and params
    const res = await apiService?.postUserCommand(
      chatUUID,
      toolName,
      parsedCommandArgs,
    )
    const userCommandResponse: any = res?.data

    // handle error message which we need to process into an agent message
    if (userCommandResponse.error) {
      console.log('userCommandResponse', userCommandResponse)

      // check if this response is for the current chat
      if (chatUUIDRef.current !== chatUUID) {
        console.warn('Discard response for old chatUUID', chatUUID)
        return
      }

      setMessages(prevMessages => [
        ...prevMessages,
        {
          event: {
            type: 'agent-message',
            agent_message: `${userCommandResponse.error?.response?.data?.message?.[0]}`,
            response_details: [
              {
                output: `${userCommandResponse.error?.name}: ${userCommandResponse.error?.message}`,
              },
            ],
            attachments: {},
          },
          timestamp: getCurrentTime(),
          headers: res?.headers,
        },
      ])
    }

    if (
      userCommandResponse.type === 'agent-plan' ||
      userCommandResponse.type === 'agent-message'
    ) {
      // check if this response is for the current chat
      if (chatUUIDRef.current !== chatUUID) {
        console.warn('Discard response for old chatUUID', chatUUID)
        return
      }

      setMessages(prevMessages => [
        ...prevMessages,
        {
          event: {...userCommandResponse},
          timestamp: getCurrentTime(),
          headers: res?.headers,
        },
      ])

      if (userCommandResponse.planned_toolcalls?.length > 0) {
        setIsToolcallMode(true)
        setPlan({
          executed_toolcalls: [...userCommandResponse.executed_toolcalls],
          planned_toolcalls: [...userCommandResponse.planned_toolcalls],
        })
      }

      // open non-zip attachments if they exist and callback is provided
      const responseAttachments =
        userCommandResponse?.response_details
          ?.flatMap((r: {artifacts?: ArtifactMetadata[]}) => r.artifacts || [])
          .filter(
            (artifact: ArtifactMetadata) =>
              !artifact.filename?.toLowerCase().endsWith('.zip'),
          ) ?? []

      if (responseAttachments.length > 0 && onOpenAttachments) {
        onOpenAttachments(responseAttachments)
      }
    }
  } catch (error) {
    setError(error)
  } finally {
    setLoading(false)
  }
}
