import {createContext, useContext, useMemo, useState, ReactNode} from 'react'
import ApiService from '../services/apiservice'
import {AuthContext, FrontendContext} from '../interfaces/platform'
import {getCustomHostUrl} from '../utilities/customHeadersStorage'

type PorgType = string | number | undefined

// Singleton of ApiService that gets initialized with dynamic hostUrl
// and token passed in by the user
interface APIContextType {
  apiService: ApiService | null
  setApiService: (id: ApiService) => void
  configureService: (
    hostUrl: string,
    apiBasePath: string,
    token: string,
    user: string,
    porg: string,
    frontendContext: FrontendContext | undefined,
    authContext: AuthContext,
    programmaticHeaders?: Record<string, string>,
  ) => void
  porg: PorgType
  setPorg: (id: string | number | undefined) => void
  hidePorg: boolean
  setHidePorg: (id: boolean) => void
  isPorgError: boolean
  setIsPorgError: (error: boolean) => void
}

const APIContext = createContext<APIContextType | undefined>(undefined)

interface APIProviderProps {
  children: ReactNode
}

export const APIProvider = ({children}: APIProviderProps) => {
  const [apiService, setApiService] = useState<ApiService | null>(null)
  const [porg, setPorg] = useState<string | number | undefined>('')
  const [hidePorg, setHidePorg] = useState<boolean>(false)
  const [isPorgError, setIsPorgError] = useState<boolean>(false)

  const configureService = (
    hostUrl: string,
    apiBasePath: string,
    token: string,
    user: string,
    porg: string,
    frontendContext: FrontendContext | undefined,
    authContext: AuthContext,
    programmaticHeaders?: Record<string, string>,
  ) => {
    // check if there's a custom host URL stored in localStorage
    const customHostUrl = getCustomHostUrl()
    const effectiveHostUrl = customHostUrl || hostUrl

    // console.log(
    //   'configureService',
    //   'original hostUrl:', hostUrl,
    //   'custom hostUrl:', customHostUrl,
    //   'effective hostUrl:', effectiveHostUrl,
    //   apiBasePath,
    //   token,
    //   user,
    //   porg,
    //   JSON.stringify(frontendContext),
    //   'programmaticHeaders:', programmaticHeaders,
    // )

    const service = new ApiService(
      effectiveHostUrl,
      apiBasePath,
      token,
      user,
      porg,
      frontendContext,
      authContext,
      programmaticHeaders,
    )
    setApiService(service)
  }

  // Only recalculate when value in the array has changed
  const contextValue = useMemo(
    () => ({
      apiService,
      setApiService,
      configureService,
      porg,
      setPorg,
      hidePorg,
      setHidePorg,
      isPorgError,
      setIsPorgError,
    }),
    [apiService, porg, hidePorg, isPorgError],
  )

  return (
    <APIContext.Provider value={contextValue}>{children}</APIContext.Provider>
  )
}

export const useAPI = (): APIContextType => {
  const context = useContext(APIContext)
  if (!context) {
    throw new Error('useAPI must be used within an APIProvider')
  }
  return context
}
