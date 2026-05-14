import type {ResponseType} from 'axios'

import {ParsedCommandArgs, PlanItem} from '../types'
import {ArtifactMetadata} from '../types/FileData'
import {get, post} from './http/http'
import {createSSEConnection} from './http/sseClient'
import {AuthContext, FrontendContext} from '../interfaces/platform'
import {
  getCustomHeaders,
  customHeadersToObject,
} from '../utilities/customHeadersStorage'

const octet_response_type: ResponseType = 'arraybuffer'

// This class should *not* be used directly but rather
// via the APIContext since it has to be instantiated
// with an API Manager url and token. To use:
//
// import {useAPI} from '../contexts/APIContext'
// const {apiService, configureService} = useAPI()
// const chatHistory = await apiService?.getAllChats()
//
export default class ApiService {
  BASE_URL: string // for APIC commands - not in use atm
  API_URL: string // for agent backend
  TOKEN: string
  USER: string
  PORG: string | number | undefined
  FRONTEND_CONTEXT: FrontendContext | undefined
  AUTH_CONTEXT: AuthContext
  private cachedCustomHeaders: Record<string, string> | null = null
  private programmaticHeaders: Record<string, string> = {}

  constructor(
    hostUrl: string,
    apiBasePath: string,
    token: string,
    user: string,
    org: string,
    frontendContext: FrontendContext | undefined,
    authContext: AuthContext,
    programmaticHeaders?: Record<string, string>,
  ) {
    this.BASE_URL = hostUrl
    this.API_URL = hostUrl + normalizePath(apiBasePath)
    this.TOKEN = token
    this.USER = user
    this.PORG = org
    this.FRONTEND_CONTEXT = frontendContext
    this.AUTH_CONTEXT = authContext
    this.programmaticHeaders = programmaticHeaders || {}

    // init custom headers cache
    this.loadCustomHeaders()

    // console.log('constructor', user, org, token)
  }

  setPorg(newPorg: string | number | undefined) {
    this.PORG = newPorg
  }

  /**
   * Load custom headers from localStorage and cache them
   * @private
   */
  private loadCustomHeaders(): void {
    this.cachedCustomHeaders = customHeadersToObject(getCustomHeaders())
  }

  /**
   * Get cached custom headers, loading them if not already cached
   * @private
   */
  private getCustomHeadersCached(): Record<string, string> {
    if (this.cachedCustomHeaders === null) {
      this.loadCustomHeaders()
    }
    return this.cachedCustomHeaders!
  }

  /**
   * Refresh the custom headers cache from localStorage
   * Call this method after headers are updated in the UI
   * @public
   */
  public refreshCustomHeaders(): void {
    this.loadCustomHeaders()
  }

  getDefaultHeaders(context?: FrontendContext, authContext?: AuthContext) {
    // get custom headers from cache instead of localStorage on every call
    const customHeaders = this.getCustomHeadersCached()

    return {
      headers: {
        // allow custom Authorization header to override default token
        Authorization: customHeaders['Authorization'] ?? `Bearer ${this.TOKEN}`,
        'Content-Type': 'application/json',
        // allow custom headers to override default values if provided
        'X-ibm-user': customHeaders['X-ibm-user'] ?? this.USER,
        'X-ibm-org': customHeaders['X-ibm-org'] ?? this.PORG,

        'X-ibm-agent-frontend-client':
          context?.client ?? this.FRONTEND_CONTEXT?.client,
        'X-ibm-agent-frontend-version':
          context?.version ?? this.FRONTEND_CONTEXT?.version,
        'X-ibm-agent-frontend-context':
          customHeaders['X-ibm-agent-frontend-context'] ??
          context?.context ??
          this.FRONTEND_CONTEXT?.context,
        'X-ibm-agent-auth-context':
          customHeaders['X-ibm-agent-auth-context'] ??
          authContext?.auth_values ??
          this.AUTH_CONTEXT?.auth_values,
        // merge programmatic headers (set at construction time)
        ...this.programmaticHeaders,
        // merge remaining custom headers (UI-configured, highest priority)
        ...customHeaders,
      },
    }
  }

  getOctetHeaders(
    filename: string,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    // get custom headers from cache instead of localStorage on every call
    const customHeaders = this.getCustomHeadersCached()

    return {
      headers: {
        // allow custom Authorization header to override default token
        Authorization: customHeaders['Authorization'] ?? `Bearer ${this.TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        // Allow custom headers to override default values if provided
        'X-ibm-user': customHeaders['X-ibm-user'] ?? this.USER,
        'X-ibm-org': customHeaders['X-ibm-org'] ?? this.PORG,

        // add frontend context to header - allow custom headers to override
        'X-ibm-agent-frontend-client':
          customHeaders['X-ibm-agent-frontend-client'] ??
          context?.client ??
          this.FRONTEND_CONTEXT?.client,
        'X-ibm-agent-frontend-version':
          customHeaders['X-ibm-agent-frontend-version'] ??
          context?.version ??
          this.FRONTEND_CONTEXT?.version,
        'X-ibm-agent-frontend-context':
          customHeaders['X-ibm-agent-frontend-context'] ??
          context?.context ??
          this.FRONTEND_CONTEXT?.context,
        // add auth context to header - allow custom headers to override
        'X-ibm-agent-auth-context':
          customHeaders['X-ibm-agent-auth-context'] ??
          authContext?.auth_values ??
          this.AUTH_CONTEXT?.auth_values,
        // merge programmatic headers (set at construction time)
        ...this.programmaticHeaders,
        // merge remaining custom headers (UI-configured, highest priority)
        ...customHeaders,
      },
    }
  }

  getAttachmentsHeader(context?: FrontendContext, authContext?: AuthContext) {
    // get custom headers from cache instead of localStorage on every call
    const customHeaders = this.getCustomHeadersCached()

    return {
      headers: {
        accept: 'application/octet-stream',
        // allow custom Authorization header to override default token
        Authorization: customHeaders['Authorization'] ?? `Bearer ${this.TOKEN}`,
        // Allow custom headers to override default values if provided
        'X-ibm-user': customHeaders['X-ibm-user'] ?? this.USER,
        'X-ibm-org': customHeaders['X-ibm-org'] ?? this.PORG,

        // add frontend context to header - allow custom headers to override
        'X-ibm-agent-frontend-client':
          customHeaders['X-ibm-agent-frontend-client'] ??
          context?.client ??
          this.FRONTEND_CONTEXT?.client,
        'X-ibm-agent-frontend-version':
          customHeaders['X-ibm-agent-frontend-version'] ??
          context?.version ??
          this.FRONTEND_CONTEXT?.version,
        'X-ibm-agent-frontend-context':
          customHeaders['X-ibm-agent-frontend-context'] ??
          context?.context ??
          this.FRONTEND_CONTEXT?.context,
        // add auth context to header - allow custom headers to override
        'X-ibm-agent-auth-context':
          customHeaders['X-ibm-agent-auth-context'] ??
          authContext?.auth_values ??
          this.AUTH_CONTEXT?.auth_values,
        // merge programmatic headers (set at construction time)
        ...this.programmaticHeaders,
        // merge remaining custom headers (UI-configured, highest priority)
        ...customHeaders,
      },
      params: {},
      responseType: octet_response_type,
    }
  }

  public async getAllChats(
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      const {data: response, headers} = await get(
        this.API_URL + '/v1/chats',
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'getAllChats response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('getAllChats error: ', error)
      throw error
    }
  }

  public async createNewChat(
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats',
        {type: 'user-message', message: ''},
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'createNewChat response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('createNewChat error: ', error)
      throw error
    }
  }

  public async getChat(
    chat_session_uuid: string,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      const {data: response, headers} = await get(
        this.API_URL + '/v1/chats/' + chat_session_uuid,
        this.getDefaultHeaders(context, authContext),
      )

      // console.debug('getChat response body: ', response, ', headers: ', headers)
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('getChat error: ', error)
      throw error
    }
  }

  public async postChat(
    chat_session_uuid: string,
    message: string,
    attachments: ArtifactMetadata[],
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      console.debug('postChat request message: ', message)

      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats/' + chat_session_uuid,
        {type: 'user-message', message: message, artifacts: attachments},
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'postChat response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('postChat error: ', error)
      throw error
    }
  }

  public async postPlan(
    chat_session_uuid: string,
    toolcalls: PlanItem[] | null | undefined,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      console.debug('postPlan request: ', {
        chat_session_uuid: chat_session_uuid,
        toolcalls: toolcalls,
      })

      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats/' + chat_session_uuid,
        {type: 'user-plan', toolcalls: toolcalls},
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'postPlan response body: ',
        response,
        ', headers: ',
        headers,
      )

      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('postPlan error: ', error)
      throw error
    }
  }

  // submit selection index from carousel
  public async postSelection(
    chat_session_uuid: string,
    selectedIndex: number | number[],
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      console.debug('postSelection request: ', {
        chat_session_uuid: chat_session_uuid,
        selected: selectedIndex,
      })
      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats/' + chat_session_uuid,
        {type: 'selection-response', selected: selectedIndex},
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'postSelection response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('postSelection error: ', error)
      throw error
    }
  }

  // prompt input key-value pairs
  public async postUserCommand(
    chat_session_uuid: string,
    tool: string,
    args: ParsedCommandArgs,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      console.debug('postUserCommand request: ', {
        chat_session_uuid: chat_session_uuid,
        command: tool,
        args: args,
      })

      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats/' + chat_session_uuid,
        {
          type: 'user-command',
          command: tool,
          args: args,
        },
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'postUserCommand response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('postUserCommand error: ', error)
      throw error
    }
  }

  public async getCommands(
    chat_session_uuid: string,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      const {data: response, headers} = await get(
        this.API_URL + '/v1/chats/' + chat_session_uuid + '/commands',
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'getCommands response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('getCommands error: ', error)
      throw error
    }
  }

  public async getAttachments(
    chat_session_uuid: string,
    attach_id: string,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      const OPTIONS_GET_ATTACHMENT = this.getAttachmentsHeader(
        context,
        authContext,
      )

      OPTIONS_GET_ATTACHMENT.params = {
        artifact_id: attach_id,
      }

      const {data: response, headers} = await get(
        this.API_URL + '/v1/chats/' + chat_session_uuid + '/attachments',
        OPTIONS_GET_ATTACHMENT,
      )

      console.debug(
        'getAttachments response type: ',
        typeof response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('getAttachments error: ', error)
      throw error
    }
  }

  public async postAttachment(
    chat_session_uuid: string,
    attachment_data: Uint8Array,
    attachment_filename: string,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      console.log('postAttachment request')
      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats/' + chat_session_uuid + '/attachments',
        attachment_data,
        this.getOctetHeaders(attachment_filename, context, authContext),
      )

      console.debug(
        'postAttachment response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('postAttachment error: ', error)
      throw error
    }
  }

  public async fetchOrgs() {
    try {
      const {data: response, headers} = await get(this.API_URL + '/orgs', {
        headers: {
          Authorization: 'Bearer ' + this.TOKEN,
        },
      })
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('fetchOrgs error: ', error)
      throw error
    }
  }
  // Post message to /message endpoint
  public async postMessage(
    message: string,
    chat_session_uuid: string,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    try {
      console.debug('postMessage request: ', message)

      const {data: response, headers} = await post(
        this.API_URL + '/v1/chats/' + chat_session_uuid + '/messages',
        {type: 'user-message', message, artifacts: []},
        this.getDefaultHeaders(context, authContext),
      )

      console.debug(
        'postMessage response body: ',
        response,
        ', headers: ',
        headers,
      )
      return {
        data: response,
        headers: new Map(Object.entries(headers)),
      }
    } catch (error) {
      console.error('postMessage error: ', error)
      throw error
    }
  }

  /**
   * Creates a streaming connection for real-time updates.
   * If the SSE fails, do the 'application/json' for standard postChat()
   * The server will respond with SSE if supported, or JSON if not.
   * @param chat_session_uuid The chat session UUID
   * @param message The message to send
   * @param attachments The attachments to send
   * @param onMessageCallback
   * @param onErrorCallback
   * @param onOpenCallback
   * @param context Frontend context
   * @param authContext Authentication context
   * @returns Object with close() to terminate the connection
   */
  public streamChat(
    chat_session_uuid: string,
    message: string,
    attachments: ArtifactMetadata[],
    onMessageCallback: (data: any) => void,
    onErrorCallback: (error: any) => void,
    onOpenCallback?: () => void,
    onCloseCallback?: () => void,
    context?: FrontendContext,
    authContext?: AuthContext,
  ) {
    console.debug('streamChat request message: ', message)

    const url = `${this.API_URL}/v1/chats/${chat_session_uuid}`

    // Include both content types: SSE preferred, JSON as fallback for backward compatibility
    const postOptions = this.getDefaultHeaders(context, authContext)
    postOptions.headers = {
      ...postOptions.headers,
      Accept: 'text/event-stream, application/json',
    } as any

    // create SSE connection using POST request
    const {close} = createSSEConnection(
      url,
      {
        ...postOptions,
        method: 'POST',
        body: JSON.stringify({
          type: 'user-message',
          message: message,
          artifacts: attachments,
        }),
      },
      onMessageCallback,
      onErrorCallback,
      onOpenCallback,
      onCloseCallback,
    )

    return {close}
  }
}

// remove trailing slashes, ensure a single leading '/'
// allow api prefix to be added like https://host_url/api-agent/api-assistant
function normalizePath(path?: string): string {
  if (!path) return ''
  const cleaned = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return cleaned ? `/${cleaned}` : ''
}
