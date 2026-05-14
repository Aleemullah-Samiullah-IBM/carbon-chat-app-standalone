import {FETCH_ORGS_ERROR_MESSAGE} from '../constants'
import {getLearnMoreLink} from '../components/links'
import {FrontendContext} from '../interfaces/platform'

interface Porg {
  name: string
  title: string
}

interface FetchOrgsResult {
  porgs: Porg[]
  isPorgError: boolean
}

/**
 * Fetches organizations from the API service
 * @param apiService - The API service instance
 * @param setError - Error context function to set errors
 * @param vscode - VSCode API for extension context
 * @param frontendClient - Client object for learn more links
 * @param accessToken - Access token for authentication
 * @returns Object containing porgs array and error state
 */
export const fetchOrgs = async (
  apiService: any,
  setError?: (error: any) => void,
  vscode?: any,
  frontendClient?: FrontendContext,
  accessToken?: any,
): Promise<FetchOrgsResult> => {
  const result: FetchOrgsResult = {
    porgs: [],
    isPorgError: false,
  }

  try {
    const response = await apiService?.fetchOrgs()

    // Check response and data exist before accessing results
    if (response?.data?.results) {
      const orgs = response.data.results.map(
        (org: {name: any; title: any}) => ({
          name: org.name,
          title: org.title,
        }),
      )

      result.porgs = orgs
      result.isPorgError = orgs.length === 0
    } else {
      console.error('Invalid response from fetchOrgs()', response)
      result.isPorgError = true
    }
  } catch (error) {
    console.error('Error fetching organizations:', error)

    // Set error in the error context if provided
    if (setError) {
      const learnMore = getLearnMoreLink(frontendClient, vscode, accessToken)
      const fetchOrgsError = {
        message: FETCH_ORGS_ERROR_MESSAGE,
      }

      setError({
        ...fetchOrgsError,
        element: learnMore,
      })
    } else {
      result.isPorgError = true
    }
  }

  return result
}
