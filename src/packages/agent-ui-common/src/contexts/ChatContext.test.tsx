import {useEffect} from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {ChatProvider, useMyContext, useInput} from './ChatContext'
import {Plan} from '../types'

const TestComponent = () => {
  const {
    setPlan,
    plan,
    setStartNewChat,
    startNewChat,
    setIsLoggedIn,
    setApicTokenExpirationDate,
    isLoggedIn,
    setSelectedFiles,
    selectedFiles,
    setIsDarkTheme,
    isDarkTheme,
    checkLogin,
  } = useMyContext()

  const {registerInputHandler, setPromptValue, inputRef} = useInput()

  useEffect(() => {
    setPlan({
      executed_toolcalls: [],
      planned_toolcalls: [
        {
          name: 'Tool Name',
          arguments: {},
          title: 'Test Title',
          description: 'Test Description',
          status: 'success',
        },
      ],
    } as Plan)
    setStartNewChat(true)
    setIsLoggedIn(true)
    setSelectedFiles([
      {name: 'test-file1.txt', size: 123},
      {name: 'test-file2.txt', size: 456},
      {name: 'test-file3.txt', size: 789},
    ] as any)
    setIsDarkTheme(false)
    setApicTokenExpirationDate('indefinite')

    registerInputHandler(val => {
      if (inputRef.current) {
        inputRef.current.value = val
      }
    })

    setTimeout(() => {
      setPromptValue('Test Input')
    }, 0)
  }, [])

  return (
    <div>
      <div data-testid='plan'>{plan?.planned_toolcalls?.[0]?.name}</div>
      <div data-testid='startNewChat'>{startNewChat.toString()}</div>
      <div data-testid='isLoggedIn'>{isLoggedIn.toString()}</div>
      <div data-testid='selectedFiles'>{selectedFiles.length}</div>
      <div data-testid='isDarkTheme'>{isDarkTheme.toString()}</div>
      <div data-testid='checkLogin'>{checkLogin().toString()}</div>
    </div>
  )
}

describe('ChatProvider + InputProvider', () => {
  it('provides and updates context values correctly', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('plan')).toHaveTextContent('Tool Name')
      expect(screen.getByTestId('startNewChat')).toHaveTextContent('true')
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true')
      expect(screen.getByTestId('selectedFiles')).toHaveTextContent('3')
      expect(screen.getByTestId('isDarkTheme')).toHaveTextContent('false')
      expect(screen.getByTestId('checkLogin')).toHaveTextContent('true')
    })
  })

  it('checkLogin() returns true for future expiration', async () => {
    const future = new Date(Date.now() + 3600000).toISOString()

    const FutureTest = () => {
      const {setApicTokenExpirationDate, checkLogin} = useMyContext()
      useEffect(() => {
        setApicTokenExpirationDate(future)
      }, [])
      return <div data-testid='checkLogin'>{checkLogin().toString()}</div>
    }

    render(
      <ChatProvider>
        <FutureTest />
      </ChatProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('checkLogin')).toHaveTextContent('true')
    })
  })

  it('checkLogin() returns false for past expiration', async () => {
    const past = new Date(Date.now() - 3600000).toISOString()

    const PastTest = () => {
      const {setApicTokenExpirationDate, checkLogin} = useMyContext()
      useEffect(() => {
        setApicTokenExpirationDate(past)
      }, [])
      return <div data-testid='checkLogin'>{checkLogin().toString()}</div>
    }

    render(
      <ChatProvider>
        <PastTest />
      </ChatProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('checkLogin')).toHaveTextContent('false')
    })
  })
})
