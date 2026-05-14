import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import {ErrorProvider, useError} from './ErrorContext'

const TestComponent = () => {
  const {error, setError, clearError} = useError()

  return (
    <div>
      <div data-testid='error-message'>{error}</div>
      <button
        onClick={() =>
          setError({
            response: {
              data: {message: ['Server error occurred']},
              statusText: 'Internal Server Error',
            },
          })
        }
      >
        Trigger Structured Error
      </button>

      <button onClick={() => setError('Simple error string')}>
        Trigger String Error
      </button>

      <button onClick={() => setError({message: 'Fallback error'})}>
        Trigger Fallback Error
      </button>

      <button
        onClick={() =>
          setError({response: {statusText: 'Service Unavailable'}})
        }
      >
        Trigger StatusText Error
      </button>

      <button onClick={() => setError({})}>Trigger Unknown Error</button>

      <button onClick={() => setError({message: '   '})}>
        Trigger Whitespace Error
      </button>

      <button onClick={clearError}>Clear</button>
    </div>
  )
}

describe('ErrorContext', () => {
  beforeEach(() => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>,
    )
  })

  it('sets structured error message from response.data.message[0]', () => {
    fireEvent.click(screen.getByText('Trigger Structured Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'Server error occurred',
    )
  })

  it('sets error when given a simple string', () => {
    fireEvent.click(screen.getByText('Trigger String Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'Simple error string',
    )
  })

  it('uses fallback message from error.message', () => {
    fireEvent.click(screen.getByText('Trigger Fallback Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'Fallback error',
    )
  })

  it('uses statusText when response exists but no message array', () => {
    fireEvent.click(screen.getByText('Trigger StatusText Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'Service Unavailable',
    )
  })

  it('uses default fallback message when error is unrecognized shape', () => {
    fireEvent.click(screen.getByText('Trigger Unknown Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'An unexpected error has occurred. Please try again.',
    )
  })

  it('uses fallback message when error message is only whitespace', () => {
    fireEvent.click(screen.getByText('Trigger Whitespace Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'An unexpected error has occurred. Please try again.',
    )
  })

  it('clears the error message', () => {
    fireEvent.click(screen.getByText('Trigger String Error'))
    expect(screen.getByTestId('error-message').textContent).toBe(
      'Simple error string',
    )

    fireEvent.click(screen.getByText('Clear'))
    expect(screen.getByTestId('error-message').textContent).toBe('')
  })

  it('logs error to console', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fireEvent.click(screen.getByText('Trigger String Error'))
    expect(consoleSpy).toHaveBeenCalledWith(
      'Simple error string',
      'Simple error string',
    )
    consoleSpy.mockRestore()
  })
})
