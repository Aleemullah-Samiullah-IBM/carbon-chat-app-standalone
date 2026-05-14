import axios from 'axios'
import {InterceptorState} from './interceptorState'

// register single, shared interceptor, otherwise in vscode-plugin
// it was calling a *separate* axios instance

// specifically used after REST call to
// catch a 401: unauthorized --> redirect to logout

axios.interceptors.response.use(
  res => res,
  async error => {
    const errorToReject =
      error instanceof Error ? error : new Error('Unknown error occurred')

    const expiration = InterceptorState.apicTokenExpirationDate

    if (
      expiration !== 'indefinite' &&
      error.response &&
      error.response.status === 401
    ) {
      console.log('❌ Unauthorized. Logging out...', error)

      InterceptorState.triggerError('Session expired. Logging you out...')

      setTimeout(() => {
        InterceptorState.triggerLogout()
      }, 1000)
    }

    return Promise.reject(errorToReject)
  },
)

export default axios
