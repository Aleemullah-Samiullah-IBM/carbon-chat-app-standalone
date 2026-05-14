import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiService from './apiservice'
import {ArtifactMetadata} from '../types/FileData'
import {AuthContext, FrontendContext} from '../interfaces/platform'
import {expect} from 'vitest'

const mock = new MockAdapter(axios)

const hostUrl = 'https://example.com'
const apiBasePath = '/api-assistant'
const token = 'test-token'
const user = 'test-user'
const org = 'test-org'
const frontendClient: FrontendContext = {
  client: 'vscode',
}
const authContext: AuthContext = {}

let apiService: ApiService

beforeEach(() => {
  apiService = new ApiService(
    hostUrl,
    apiBasePath,
    token,
    user,
    org,
    frontendClient,
    authContext,
  )
  mock.reset()
})

describe('ApiService', () => {
  it('should fetch all chats', async () => {
    const mockResponse = [{id: 'chat1'}]
    mock.onGet(`${hostUrl}/api-assistant/v1/chats`).reply(200, mockResponse, {
      'x-custom-header': 'value',
    })

    const result = await apiService.getAllChats()
    expect(result.data).toEqual(mockResponse)
    expect(result.headers.get('x-custom-header')).toBe('value')
  })

  it('should create a new chat', async () => {
    const mockResponse = {id: 'new-chat'}
    mock.onPost(`${hostUrl}/api-assistant/v1/chats`).reply(201, mockResponse)

    const result = await apiService.createNewChat()
    expect(result.data).toEqual(mockResponse)
  })

  it('should get a specific chat', async () => {
    const chatId = 'chat123'
    const mockResponse = {id: chatId}
    mock
      .onGet(`${hostUrl}/api-assistant/v1/chats/${chatId}`)
      .reply(200, mockResponse)

    const result = await apiService.getChat(chatId)
    expect(result.data).toEqual(mockResponse)
  })

  it('should post a chat message with attachments', async () => {
    const chatId = 'chat123'
    const message = 'Hello'
    const attachments: ArtifactMetadata[] = []

    const mockResponse = {success: true}
    mock
      .onPost(`${hostUrl}/api-assistant/v1/chats/${chatId}`)
      .reply(200, mockResponse)

    const result = await apiService.postChat(chatId, message, attachments)
    expect(result.data).toEqual(mockResponse)
  })

  it('should handle errors gracefully', async () => {
    mock.onGet(`${hostUrl}/api-assistant/v1/chats`).reply(500)

    await expect(apiService.getAllChats()).rejects.toThrow()
  })
})
