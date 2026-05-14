import {render, screen, fireEvent, within} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {describe, it, expect, vi} from 'vitest'
import MessageHeader from './messageHeader'

describe('MessageHeader component', () => {
  const defaultProps = {
    timestamp: '6:14 PM',
    isDarkTheme: false,
    showSteps: true,
    showReasoning: false,
    expandSteps: false,
    setExpandSteps: vi.fn(),
    expandReasoning: false,
    setExpandReasoning: vi.fn(),
    debugResponse: '',
    setExpandDetails: vi.fn(),
    setIdDetailType: vi.fn(),
  }

  it('renders timestamp and isDarkTheme = false', () => {
    render(<MessageHeader {...defaultProps} />)

    // screen.debug()
    expect(screen.getByText(/watsonx 6:14 PM/)).toBeInTheDocument()

    const button = document.querySelector('button.show-steps-toggle')
    const svg = button?.querySelector('svg')
    expect(svg).toHaveClass('isLight')
  })

  it('renders isDarkTheme = true correctly', () => {
    const propsWithDebug = {
      ...defaultProps,
      isDarkTheme: true,
    }

    render(<MessageHeader {...propsWithDebug} />)

    // screen.debug()
    expect(screen.getByText(/watsonx 6:14 PM/)).toBeInTheDocument()

    const button = document.querySelector('button.show-steps-toggle')
    const svg = button?.querySelector('svg')
    expect(svg).toHaveClass('isDark')
  })

  it('renders "Show steps" button inline and toggles expandSteps', () => {
    render(<MessageHeader {...defaultProps} />)

    const button = screen.getByRole('button', {name: /Show steps/i})

    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(defaultProps.setExpandSteps).toHaveBeenCalled()
  })

  it('renders "Hide steps" when expandSteps = true', () => {
    render(
      <MessageHeader
        {...defaultProps}
        expandSteps={true}
      />,
    )
    expect(screen.getByText(/Hide steps/)).toBeInTheDocument()
  })

  it('renders "Show scratchpad" button inline and toggles expandReasoning', () => {
    render(
      <MessageHeader
        {...defaultProps}
        showSteps={false}
        showReasoning={true}
      />,
    )

    const button = screen.getByRole('button', {name: /Show scratchpad/i})

    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(defaultProps.setExpandReasoning).toHaveBeenCalled()
  })

  it('renders "Hide scratchpad" when expandReasoning = true', () => {
    render(
      <MessageHeader
        {...defaultProps}
        showSteps={false}
        showReasoning={true}
        expandReasoning={true}
      />,
    )
    expect(screen.getByText(/Hide scratchpad/)).toBeInTheDocument()
  })

  it('calls setExpandDetails and setIdDetailType when "Chat session ID" is clicked from menu', async () => {
    render(<MessageHeader {...defaultProps} />)

    const optionsButton = screen.getByRole('button', {name: /options/i})
    await userEvent.click(optionsButton)

    // query whole DOM to find the menu item to click
    const chatSessionItem = await within(document.body).findByText(
      'Chat session ID',
    )
    await userEvent.click(chatSessionItem)

    expect(defaultProps.setExpandDetails).toHaveBeenCalledWith(true)
    expect(defaultProps.setIdDetailType).toHaveBeenCalledWith('chatUUID')
  })

  it('calls setExpandDetails and setIdDetailType when "Request ID" is clicked from menu', async () => {
    render(<MessageHeader {...defaultProps} />)

    const optionsButton = screen.getByRole('button', {name: /options/i})
    await userEvent.click(optionsButton)

    // query whole DOM to find the menu item to click
    const chatSessionItem = await within(document.body).findByText('Request ID')
    await userEvent.click(chatSessionItem)

    expect(defaultProps.setExpandDetails).toHaveBeenCalledWith(true)
    expect(defaultProps.setIdDetailType).toHaveBeenCalledWith('reqID')
  })

  it('renders 3 menu items only when debugResponse is truthy', async () => {
    const propsWithDebug = {
      ...defaultProps,
      debugResponse: 'some debug info',
    }

    render(<MessageHeader {...propsWithDebug} />)

    const optionsButton = screen.getByRole('button', {name: /options/i})
    await userEvent.click(optionsButton)

    const debugItem = await within(document.body).findByText('Debug')
    expect(debugItem).toBeInTheDocument()

    const labels = ['Debug', 'Chat session ID', 'Request ID']
    for (const label of labels) {
      const item = await within(document.body).findByText(label)
      expect(item).toBeInTheDocument()
    }
  })

  it('calls setExpandDetails and setIdDetailType when "Debug" is clicked from menu', async () => {
    const propsWithDebug = {
      ...defaultProps,
      debugResponse: 'some debug info',
    }

    render(<MessageHeader {...propsWithDebug} />)

    const optionsButton = screen.getByRole('button', {name: /options/i})
    await userEvent.click(optionsButton)

    // query whole DOM to find the menu item to click
    const chatSessionItem = await within(document.body).findByText('Debug')
    await userEvent.click(chatSessionItem)

    expect(defaultProps.setExpandDetails).toHaveBeenCalledWith(true)
    expect(defaultProps.setIdDetailType).toHaveBeenCalledWith('debug')
  })

  it('does not render "Debug" menu item when debugResponse is empty', async () => {
    render(<MessageHeader {...defaultProps} />)

    const optionsButton = screen.getByRole('button', {name: /options/i})
    await userEvent.click(optionsButton)

    const labels = ['Chat session ID', 'Request ID']
    for (const label of labels) {
      const item = await within(document.body).findByText(label)
      expect(item).toBeInTheDocument()
    }

    const debugItem = within(document.body).queryByText('Debug')
    expect(debugItem).not.toBeInTheDocument()
  })
})
