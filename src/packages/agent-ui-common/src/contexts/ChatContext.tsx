import React, {
  createContext,
  RefObject,
  useMemo,
  useRef,
  useState,
  useContext,
  ReactNode,
} from 'react'

import {Plan} from '../types'
import {FileMeta} from '../types/FileData'

export interface InputContextType {
  setPromptValue: (value: string) => void
  registerInputHandler: (fn: (value: string) => void) => void
  inputRef: RefObject<HTMLTextAreaElement | null>
}

// Safe default value
export const InputContext = createContext<InputContextType>({
  setPromptValue: () => {},
  registerInputHandler: () => {},
  inputRef: {current: null} as React.RefObject<HTMLTextAreaElement | null>,
})

interface InputProviderProps {
  children: ReactNode
}

export const InputProvider = ({children}: InputProviderProps) => {
  const [inputHandler, setInputHandler] = useState<(value: string) => void>(
    () => () => {},
  )
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const value = useMemo(
    () => ({
      setPromptValue: (value: string) => {
        inputHandler(value)
      },
      registerInputHandler: (fn: (value: string) => void) => {
        setInputHandler(() => fn)
      },
      inputRef,
    }),
    [inputHandler],
  )

  return <InputContext.Provider value={value}>{children}</InputContext.Provider>
}

export const useInput = () => {
  const context = useContext(InputContext)
  if (!context) {
    throw new Error('useInput must be used within an InputProvider')
  }
  return context
}

interface AuthState {
  API_URL: string
  OVERRIDE_TOKEN: string
  'X-ibm-user': string
  'X-ibm-org': string
  nonce: string
}

// global chat session variables are stored here for easy
// access across all children components
export interface ChatContextType {
  // there is only one active plan at a time, so keep that here
  plan: Plan | null
  setPlan: (plan: Plan) => void

  // trigger new chat
  startNewChat: boolean
  setStartNewChat: (id: boolean) => void

  // submitting approval flag - used for disabling most recent toolcall actions
  isApprovalSubmitting: boolean
  setIsApprovalSubmitting: (id: boolean) => void

  apicToken: string
  setApicToken: (id: string) => void

  apicTokenExpirationDate: string
  setApicTokenExpirationDate: (id: string) => void

  isLoggedIn: boolean
  setIsLoggedIn: (id: boolean) => void

  hostUrl: string
  setHostUrl: (id: string) => void

  // show pick porg selector message
  showPorgSelection: boolean
  setShowPorgSelection: (id: boolean) => void

  // show pick project selector message
  showProjectSelection: boolean
  setShowProjectSelection: (id: boolean) => void

  auth: AuthState
  setAuth: (id: AuthState) => void

  nonce: string
  setNonce: (id: string) => void

  checkLogin: () => boolean

  selectedFiles: FileMeta[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileMeta[]>>

  isDarkTheme: boolean
  setIsDarkTheme: (value: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider = ({children}: ChatProviderProps) => {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [startNewChat, setStartNewChat] = useState<boolean>(false)
  const [isApprovalSubmitting, setIsApprovalSubmitting] =
    useState<boolean>(false)

  const [showPorgSelection, setShowPorgSelection] = useState<boolean>(false)
  const [showProjectSelection, setShowProjectSelection] =
    useState<boolean>(false)

  const [apicToken, setApicToken] = useState<string>('')
  const [apicTokenExpirationDate, setApicTokenExpirationDate] =
    useState<string>('')

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(checkLogin())
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true)

  const [hostUrl, setHostUrl] = useState<string>('')
  const [auth, setAuth] = useState<AuthState>({
    API_URL: '',
    OVERRIDE_TOKEN: '',
    'X-ibm-user': '',
    'X-ibm-org': '',
    nonce: '',
  })
  const [nonce, setNonce] = useState<string>('')

  function checkLogin(): boolean {
    // console.log('checkLogin()', apicTokenExpirationDate)

    if (apicTokenExpirationDate === 'indefinite') {
      return true
    }

    let loggedInState = false
    const tokenExpiration: Date = new Date(apicTokenExpirationDate)
    const currentDate: Date = new Date()

    if (
      tokenExpiration !== null &&
      tokenExpiration !== undefined &&
      tokenExpiration > currentDate
    ) {
      loggedInState = true
    }

    return loggedInState
  }

  const [selectedFiles, setSelectedFiles] = useState<FileMeta[]>([])

  // only recalculate when value in array has changed
  const contextValue = useMemo(
    () => ({
      plan,
      setPlan,
      startNewChat,
      setStartNewChat,
      isApprovalSubmitting,
      setIsApprovalSubmitting,
      apicToken,
      setApicToken,
      apicTokenExpirationDate,
      setApicTokenExpirationDate,
      isLoggedIn,
      setIsLoggedIn,
      hostUrl,
      setHostUrl,
      auth,
      setAuth,
      nonce,
      setNonce,
      showPorgSelection,
      setShowPorgSelection,
      showProjectSelection,
      setShowProjectSelection,
      checkLogin,
      selectedFiles,
      setSelectedFiles,
      isDarkTheme,
      setIsDarkTheme,
    }),
    [
      plan,
      startNewChat,
      isApprovalSubmitting,
      apicToken,
      apicTokenExpirationDate,
      isLoggedIn,
      hostUrl,
      auth,
      nonce,
      showPorgSelection,
      showProjectSelection,
      selectedFiles,
      isDarkTheme,
    ],
  )

  return (
    <ChatContext.Provider value={contextValue}>
      <InputProvider>{children}</InputProvider>
    </ChatContext.Provider>
  )
}

export const useMyContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useMyContext must be used within a ChatProvider')
  }
  return context
}
