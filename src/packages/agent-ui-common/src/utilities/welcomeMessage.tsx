import {
  ArtTools_01,
  WindowsHosting,
  DevAndTest,
  DesignResearch,
  GrowthMindset,
  Resourceful,
} from '@carbon/pictograms-react'
import {ChatEvent} from '../types/Message'
import {POrgName} from '../types/POrgName'
import {getCurrentTime} from './helpers'
import {documentationLink} from '../components/documentationLink'
import {ComponentType} from 'react'
import i18n from '../i18n'

/**
 * Creates a welcome message for the chat
 * @param porg Optional provider organization name
 * @param headers Optional headers
 * @param accessToken Access token for authentication
 * @param frontendClientType The client type (e.g., vscode)
 * @param vscode  The vscode API object if in VS Code environment
 * @returns A ChatEvent object with the welcome message
 */

export const createWelcomeMessage = (
  porg: POrgName,
  headers?: Map<string, any>,
  accessToken?: string,
  frontendClientType?: any,
  vscode?: any,
): ChatEvent => {
  // Handle both interface and individual parameters for backward compatibility
  const greeting = i18n.t('welcomeMessage.apiAgentGreeting', {porg})
  const exploreCommands = i18n.t('welcomeMessage.exploreCommands')

  return {
    event: {
      type: 'agent-plan',
      agent_message: `${greeting}\n${exploreCommands}`,

      response_details: [
        {
          output: (
            <>
              {i18n.t('welcomeMessage.limitations')}{' '}
              {documentationLink(accessToken, frontendClientType, vscode)}
            </>
          ),
        },
      ],
      suggested_actions: [],
      first_message: true,
      first_actions: [
        {icon: ArtTools_01, message: i18n.t('welcomeMessage.createApi')},
        {icon: WindowsHosting, message: i18n.t('welcomeMessage.publishApi')},
        {icon: DevAndTest, message: i18n.t('welcomeMessage.queryAnalytics')},
        {icon: DesignResearch, message: i18n.t('welcomeMessage.searchApis')},
      ],
      reasoning: null, // Required by PlanEvent interface
    },
    timestamp: getCurrentTime(),
    headers: headers,
  }
}

export const createBasicWelcomeMessage = (options?: {
  headers?: Map<string, any>
  customMessage?: string
  firstActions?: {icon: ComponentType<any>; message: string}[]
}): ChatEvent => {
  const {headers, customMessage, firstActions} = options || {}

  return {
    event: {
      type: 'agent-plan',
      agent_message:
        customMessage || i18n.t('welcomeMessage.sampleAgentGreeting'),

      suggested_actions: [],
      first_message: true,
      first_actions: firstActions || [
        {icon: Resourceful, message: i18n.t('welcomeMessage.useSampleTools')},
        {
          icon: GrowthMindset,
          message: i18n.t('welcomeMessage.experimentCapabilities'),
        },
      ],
      reasoning: null,
    },
    timestamp: getCurrentTime(),
    headers: headers,
  }
}
