//  need to create a new corresponding obj for each event returned from backend
import {ArtifactMetadata} from './FileData'
import {PlanItem} from './Plan'

export interface ChatEvent {
  event:
    | UserEvent
    | PlanEvent
    | AgentMessageEvent
    | SelectionRequestEvent
    | UserCommandEvent
  timestamp: string
  headers: Map<string, any> | undefined
}

export interface UserEvent {
  type: 'user-message'
  message: string
  hints?: string[]
}

export interface BaseEvent {
  agent_message: string
  response_details?: any[]
  files?: Array<any>
  executed_toolcalls?: PlanItem[]
  planned_toolcalls?: PlanItem[]
  plan_title?: string
  reasoning: string | null
  //UI Only
  first_message?: boolean
  first_actions?: Array<{icon: any; message: string}>
}

export interface PlanEvent extends BaseEvent {
  type: 'agent-plan'
  suggested_actions?: string[]
}

export interface SelectionRequestEvent extends BaseEvent {
  type: 'selection-request'
}

export interface AgentMessageEvent {
  type: 'agent-message'
  agent_message: string
}

export interface UserCommandEvent {
  type: 'user-command'
  command: string
  args: {
    [key: string]: any
  }
}

export interface ResponseType {
  [key: string]: string | number | string[] | ArtifactMetadata | undefined
}

export type NullableResponseType = ResponseType | null
