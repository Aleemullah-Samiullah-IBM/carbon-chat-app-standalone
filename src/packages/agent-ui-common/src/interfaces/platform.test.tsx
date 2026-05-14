import {describe, it, expect, vi} from 'vitest'
import {PlatformAPI} from './platform'

describe('PlatformAPI', () => {
  it('should call logout if defined', async () => {
    const mockLogout = vi.fn().mockResolvedValue(undefined)

    const platformAPI: PlatformAPI = {
      logout: mockLogout,
    }

    await platformAPI.logout?.()

    expect(mockLogout).toHaveBeenCalled()
  })

  it('should not throw if logout is undefined', async () => {
    const platformAPI: PlatformAPI = {}

    let error: unknown = null
    try {
      await platformAPI.logout?.()
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
  })
})
