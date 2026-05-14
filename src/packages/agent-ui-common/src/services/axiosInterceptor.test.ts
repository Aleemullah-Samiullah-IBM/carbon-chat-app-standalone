import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {InterceptorState} from './interceptorState'
import {expect, vi, describe, it, beforeEach, afterEach} from 'vitest'

// ensure axios.interceptors() registered
import './axiosInterceptor'

describe('axios interceptors', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(axios)

    vi.spyOn(InterceptorState, 'triggerError')
    vi.spyOn(InterceptorState, 'triggerLogout')

    vi.useFakeTimers()
  })

  afterEach(() => {
    mock.restore()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should handle successful responses normally', async () => {
    const mockData = {success: true}
    mock.onGet('/meow-test').reply(200, mockData)

    const response = await axios.get('/meow-test')
    expect(response.data).toEqual(mockData)
    expect(InterceptorState.triggerError).not.toHaveBeenCalled()
    expect(InterceptorState.triggerLogout).not.toHaveBeenCalled()
  })

  it('should handle non-401 errors without triggering logout', async () => {
    mock.onGet('/meow-test').reply(500)

    await expect(axios.get('/meow-test')).rejects.toThrow()
    expect(InterceptorState.triggerError).not.toHaveBeenCalled()
    expect(InterceptorState.triggerLogout).not.toHaveBeenCalled()
  })

  it('should trigger error and logout on 401 unauthorized when token has expiration', async () => {
    const originalExpiration = InterceptorState.apicTokenExpirationDate
    InterceptorState.setApicTokenExpirationDate('2022-04-21')

    mock.onGet('/meow-test').reply(401)

    try {
      await axios.get('/meow-test')
      // does not reach here
      expect(true).toBe(false)
    } catch (error) {
      expect(InterceptorState.triggerError).toHaveBeenCalledWith(
        'Session expired. Logging you out...',
      )

      vi.runAllTimers()

      expect(InterceptorState.triggerLogout).toHaveBeenCalled()
    }

    // Restore original expiration
    InterceptorState.setApicTokenExpirationDate(originalExpiration)
  })

  it('should not trigger logout on 401 when token expiration is indefinite', async () => {
    InterceptorState.setApicTokenExpirationDate('indefinite')

    mock.onGet('/meow-test').reply(401)

    try {
      await axios.get('/meow-test')
      // does not reach here
      expect(true).toBe(false)
    } catch (error) {
      expect(InterceptorState.triggerError).not.toHaveBeenCalled()
      expect(InterceptorState.triggerLogout).not.toHaveBeenCalled()
    }
  })

  it('should handle unknown errors gracefully', async () => {
    mock.onGet('/meow-test').networkError()

    await expect(axios.get('/meow-test')).rejects.toThrow()
    expect(InterceptorState.triggerError).not.toHaveBeenCalled()
    expect(InterceptorState.triggerLogout).not.toHaveBeenCalled()
  })

  it('should convert non-Error objects to Error instances', async () => {
    mock.onGet('/meow-test').reply(() => {
      throw new Error('Unknown error occurred')
    })

    try {
      await axios.get('/meow-test')
      // does not reach here
      expect(true).toBe(false)
    } catch (error: any) {
      // verify error converted to Error instance
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Unknown error occurred')
    }
  })

  it('should properly set error functions', () => {
    const mockSetError = vi.fn()
    InterceptorState.setSetError(mockSetError)

    InterceptorState.triggerError('Test error')
    expect(mockSetError).toHaveBeenCalledWith('Test error')
  })

  it('should properly set provider message functions', () => {
    const mockSendProviderMessage = vi.fn()
    InterceptorState.setSendProviderMessage(mockSendProviderMessage)

    InterceptorState.triggerLogout()
    expect(mockSendProviderMessage).toHaveBeenCalledWith('logout', '')
  })
})
