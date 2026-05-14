import {TFunction} from 'i18next'

export type AgentType = 'APIC' | 'AICS' | 'Solis'

export interface PredefinedHeader {
  key: string
  description: string
  type: 'text' | 'json'
  placeholder?: string
}

export interface AgentOption {
  value: AgentType
  label: string
  enabled: boolean
}

// Function to generate predefined IBM headers for APIC with i18n
export const getPredefinedApicHeaders = (
  t: TFunction,
): PredefinedHeader[] => [
  {
    key: 'Authorization',
    description: t('updateHeaders.authorizationDescription'),
    type: 'text',
    placeholder: t('updateHeaders.authorizationPlaceholder'),
  },
  {
    key: 'X-ibm-user',
    description: t('updateHeaders.userIdDescription'),
    type: 'text',
  },
  {
    key: 'X-ibm-org',
    description: t('updateHeaders.orgIdDescription'),
    type: 'text',
  },
  {
    key: 'X-ibm-agent-frontend-context',
    description: t('updateHeaders.frontendContextDescription'),
    type: 'json',
  },
  {
    key: 'X-ibm-agent-auth-context',
    description: t('updateHeaders.authContextDescription'),
    type: 'json',
  },
]

// Function to generate predefined headers for AICS with i18n
export const getPredefinedAicsHeaders = (
  t: TFunction,
): PredefinedHeader[] => [
  {
    key: 'Authorization',
    description: t('updateHeaders.authorizationDescription'),
    type: 'text',
    placeholder: t('updateHeaders.authorizationPlaceholder'),
  },
  {
    key: 'X-ibm-user',
    description: t('updateHeaders.userIdDescription'),
    type: 'text',
  },
  {
    key: 'X-ibm-org',
    description: t('updateHeaders.orgIdDescription'),
    type: 'text',
  },
]

// Function to generate predefined headers for Solis with i18n
export const getPredefinedSolisHeaders = (
  t: TFunction,
): PredefinedHeader[] => [
  {
    key: 'Authorization',
    description: t('updateHeaders.authorizationDescription'),
    type: 'text',
    placeholder: t('updateHeaders.authorizationPlaceholder'),
  },
  {
    key: 'X-ibm-user',
    description: t('updateHeaders.userIdDescription'),
    type: 'text',
  },
]

// Function to get agent headers map with i18n
export const getAgentHeadersMap = (
  t: TFunction,
): Record<AgentType, PredefinedHeader[]> => ({
  APIC: getPredefinedApicHeaders(t),
  AICS: getPredefinedAicsHeaders(t),
  Solis: getPredefinedSolisHeaders(t),
})

// agent type options for dropdown
export const AGENT_OPTIONS: AgentOption[] = [
  {value: 'APIC', label: 'API Connect', enabled: true},
  {value: 'AICS', label: 'AICS', enabled: true},
  {value: 'Solis', label: 'Solis', enabled: false},
]
