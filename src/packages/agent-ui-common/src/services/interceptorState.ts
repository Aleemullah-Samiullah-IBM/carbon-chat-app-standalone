// set default
let apicTokenExpirationDate = 'indefinite'
let setError: ((msg: string) => void) | null = null
let sendProviderMessage: ((type: string, payload: any) => void) | null = null

// A shared state component following singleton object pattern.
// This object exposes setter methods that allow React components to inject current values,
// and the Axios interceptor reads from this singleton at runtime.

// its primarily used to set error messages and logout functionality for when
// the access token expires
export const InterceptorState = {
  get apicTokenExpirationDate() {
    return apicTokenExpirationDate
  },
  setApicTokenExpirationDate(value: string) {
    apicTokenExpirationDate = value
  },

  setSetError(fn: typeof setError) {
    setError = fn
  },

  setSendProviderMessage(fn: typeof sendProviderMessage) {
    sendProviderMessage = fn
  },

  triggerError(message: string) {
    if (setError) setError(message)
  },

  triggerLogout() {
    if (sendProviderMessage) sendProviderMessage('logout', '')
  },
}
