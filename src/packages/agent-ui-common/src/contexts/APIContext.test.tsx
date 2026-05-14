import {useEffect} from 'react'
import {describe, it, expect, vi} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import {useAPI, APIProvider} from './APIContext'

vi.mock('../services/apiservice', () => {
  return {
    default: vi.fn().mockImplementation((hostUrl, token, user, porg) => ({
      hostUrl,
      token,
      user,
      PORG: porg,
    })),
  }
})

describe('APIContext', () => {
  it('throws an error if useAPI is used outside provider', () => {
    const TestComponent = () => {
      useAPI() // should throw
      return <div>Should not render</div>
    }

    expect(() => render(<TestComponent />)).toThrow(
      'useAPI must be used within an APIProvider',
    )
  })

  it('provides apiService and porg values correctly', async () => {
    const TestComponent = () => {
      const {porg, setPorg} = useAPI()

      return (
        <>
          <div>Porg: {String(porg)}</div>
          <button onClick={() => setPorg('org123')}>Pick Porg</button>
        </>
      )
    }

    render(
      <APIProvider>
        <TestComponent />
      </APIProvider>,
    )

    expect(screen.getByText('Porg:')).toBeInTheDocument()

    screen.getByText('Pick Porg').click()

    await waitFor(() => {
      expect(screen.getByText('Porg: org123')).toBeInTheDocument()
    })
  })

  it('configureService creates a new ApiService instance', async () => {
    const TestComponent = () => {
      const {configureService, apiService} = useAPI()

      useEffect(() => {
        configureService(
          'https://test-api-connect',
          'test-token',
          'test-user',
          'test-porg',
          {client: 'vscode'},
          {}
        )
      }, [])

      return (
        <div data-testid='output'>
          {apiService
            ? `Service details: ${apiService.PORG}`
            : 'No service yet'}
        </div>
      )
    }

    render(
      <APIProvider>
        <TestComponent />
      </APIProvider>,
    )

    // TestComponent gets rendered twice. Need to wait for second time
    await waitFor(() => {
      expect(screen.getByTestId('output')).toHaveTextContent(
        'Service details: test-porg',
      )
    })
  })
})
