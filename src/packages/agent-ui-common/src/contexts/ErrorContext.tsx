import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'

const ErrorContext = createContext<any>(null)

export const useError = () => useContext(ErrorContext)

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string[]
    }
    statusText?: string
  }
  message?: string
  element?: ReactNode
}

interface ErrorProviderProps {
  children: ReactNode
}

export const ErrorProvider = ({children}: ErrorProviderProps) => {
  const [errorState, setErrorState] = useState<string | object | null>(null)

  // displays at bottom of Chat (see conversationPane.tsx)
  const setError = (error: ApiErrorResponse) => {
    let errorMessage

    if (error?.response?.data?.message?.[0]) {
      errorMessage = error.response.data.message[0]
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error.response) {
      errorMessage = `${error.response.statusText}`
    } else if (error.message) {
      if (error.element) {
        errorMessage = error
      } else {
        errorMessage = `${error.message}`
      }
    } else {
      errorMessage = 'An unexpected error has occurred. Please try again.'
    }

    // ensure errorMessage is *never* null or empty
    if (
      !errorMessage ||
      (typeof errorMessage === 'string' && errorMessage.trim() === '')
    ) {
      errorMessage = 'An unexpected error has occurred. Please try again.'
    }

    console.error(errorMessage, error)
    setErrorState(errorMessage)
  }

  const clearError = () => {
    setErrorState(null)
  }

  const contextValue = useMemo(
    () => ({
      error: errorState,
      setError,
      clearError,
    }),
    [errorState, setError, clearError],
  )

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  )
}
