import axios from '../axiosInterceptor'

export function isElectron() {
  return typeof window !== 'undefined' && !!(window as any).studioIPC
}

export async function apiFetch(url: string, options: any = {}): Promise<any> {
  console.log('isElectron', isElectron())
  if (isElectron()) {
    const response = await (window as any).studioIPC.axiosFetch(url, options)
    if (response.error) {
      // Check if this is a 401 error
      if (response.status === 401) {
        // Emit an event for 401 errors in Electron
        const unauthorizedEvent = new CustomEvent('api-unauthorized', {
          detail: {error: response.error},
          bubbles: true,
          cancelable: true,
        })
        document.dispatchEvent(unauthorizedEvent)
      }
      throw new Error(response.error)
    }
    return response
  } else {
    return await axios({url, ...options})
  }
}
