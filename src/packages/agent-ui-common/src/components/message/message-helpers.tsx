import {ChatEvent, PlanEvent} from '../../types'

// loop through and bundle all response_details [] into string as debug logs
export const combineDebugResponses = (response_details: any) => {
  let combinedResponse = response_details
    .map((item: any) => item.debug)
    .join('')

  return combinedResponse
}

export function formatUserCommand(command: string, args: {[key: string]: any}) {
  return `${command} ${Object.entries(args)
    .map(([key, value]) =>
      // check the value is an object with 'filename' property
      // otherwise, for most key-value string pairs
      hasFilename(value) ? `${key}:${value.filename}` : `${key}:${value}`,
    )
    .join(' ')}`
}

export function getEventFlags(event: ChatEvent['event']) {
  const isAgent = event.type === 'agent-plan'
  const isOnlyAgentMessage = event.type === 'agent-message'
  const isSelectionMessage = event.type === 'selection-request'
  const isUserMessage = event.type === 'user-message'
  const isUserCommand = event.type === 'user-command'

  return {
    isAgent,
    isOnlyAgentMessage,
    isSelectionMessage,
    isUser: isUserMessage || isUserCommand,
    isUserMessage,
    isUserCommand,
    isPlanEvent: Boolean(
      isAgent &&
        Array.isArray(event.executed_toolcalls) &&
        Array.isArray(event.planned_toolcalls),
    ),
    isFirstMessage: isAgent && !!event.first_message,
  }
}

export function getModalHeading(idDetailType: string) {
  if (idDetailType === 'reqID') {
    return 'Request ID'
  } else if (idDetailType === 'chatUUID') {
    return 'Chat session ID'
  } else if (idDetailType === 'debug') {
    return 'Debug'
  } else {
    return 'Unknown'
  }
}

export const isPlanPending = (event: PlanEvent) =>
  Array.isArray(event?.planned_toolcalls) && event?.planned_toolcalls.length > 0

export const isPlanCompleted = (event: PlanEvent) =>
  Array.isArray(event?.executed_toolcalls) &&
  event?.executed_toolcalls.length > 0 &&
  Array.isArray(event?.planned_toolcalls) &&
  event?.planned_toolcalls.length === 0

// type guard check if an object has 'filename' prop
export function hasFilename(obj: any): obj is {filename: string} {
  return typeof obj === 'object' && obj !== null && 'filename' in obj
}

// Check if the message contains remote DOM content
export function hasRemoteDomContent(event: any): boolean {
  return (
    !!event?.response_details?.length &&
    !!event?.response_details[0]?.extra_data?.html_resource
  )
}

// Extract remote DOM URL from message
export function getRemoteDomUrl(event: any): string | null {
  if (!event?.response_details?.length) {
    return null
  }

  const remoteDomDetail = event.response_details.find(
    (detail: any) =>
      detail && typeof detail === 'object' && 'remote_dom_url' in detail,
  )

  return remoteDomDetail?.remote_dom_url ?? null
}

// Check if we should use mock mode for remote DOM content
// This is useful for testing when the remote DOM backend is not available
export function shouldUseMockMode(): boolean {
  // In a real implementation, this could check environment variables,
  // feature flags, or other configuration settings

  // For now, we'll return true to always use mock mode
  // This can be changed later when the remote DOM backend is ready
  return true
}
