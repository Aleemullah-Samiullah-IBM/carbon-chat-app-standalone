import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import '@testing-library/jest-dom'

const mockSetPromptValue = vi.fn()
const mockFocus = vi.fn()
const mockInputRef = {current: {focus: mockFocus}}

vi.mock('../../../contexts/ChatContext', () => ({
  useInput: () => ({
    setPromptValue: mockSetPromptValue,
    inputRef: mockInputRef,
  }),
}))

let NextActions: React.FC<any>
beforeEach(async () => {
  const component = await import('./nextActions')
  NextActions = component.default
  mockSetPromptValue.mockClear()
  mockFocus.mockClear()
})

describe('NextActions component', () => {
  it('renders all action buttons', async () => {
    render(
      <NextActions
        nextActionList={['Action 1', 'Action 2', 'Action 3']}
        nonEditable={false}
      />,
    )

    expect(screen.getByText('Action 1')).toBeInTheDocument()
    expect(screen.getByText('Action 2')).toBeInTheDocument()
    expect(screen.getByText('Action 3')).toBeInTheDocument()
  })

  it('calls setPromptValue() on button click', async () => {
    render(
      <NextActions
        nextActionList={['Click action to fill prompt']}
        nonEditable={false}
      />,
    )

    const button = screen.getByText('Click action to fill prompt')
    fireEvent.click(button)

    expect(mockSetPromptValue).toHaveBeenCalledWith(
      'Click action to fill prompt',
    )
    expect(mockFocus).toHaveBeenCalled()
  })

  it('disables buttons when nonEditable = true', async () => {
    render(
      <NextActions
        nextActionList={['Disabled action']}
        nonEditable={true}
      />,
    )

    const button = screen.getByText('Disabled action')
    expect(button).toBeDisabled()
  })

  it('focuses input on mount', () => {
    render(
      <NextActions
        nextActionList={['Focus action']}
        nonEditable={false}
      />,
    )

    expect(mockFocus).toHaveBeenCalled()
  })
})
