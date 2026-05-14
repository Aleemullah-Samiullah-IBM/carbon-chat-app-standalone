import {render, screen, fireEvent, within} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {PlatformAPI} from '../../interfaces/platform'
import '@testing-library/jest-dom'

vi.mock('../../utilities/utilities', () => ({
  sendProviderMessage: vi.fn(),
}))

afterEach(() => {
  vi.resetModules()
})

const mockPlatformAPI: PlatformAPI = {
  logout: vi.fn(),
}

const setupMocks = (contextOverrides = {}, apiOverrides = {}) => {
  vi.doMock('../../contexts/ChatContext', () => ({
    useMyContext: () => ({
      auth: {'X-ibm-org': 'mock-org'},
      apicTokenExpirationDate: 'indefinite',
      ...contextOverrides,
    }),
  }))

  vi.doMock('../../contexts/APIContext', () => ({
    useAPI: () => ({
      porg: '',
      ...apiOverrides,
    }),
  }))
}

describe('Toolbar Component', () => {
  it('renders header and buttons', async () => {
    setupMocks()
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={false}
        onClickCallback={vi.fn()}
        platformAPI={mockPlatformAPI}
      />,
    )

    // HeaderName with prefix='IBM' creates "IBM ARIA Agent" as a single text
    expect(screen.getByText('ARIA Agent')).toBeInTheDocument()

    expect(screen.getByRole('button', {name: /mock-org/i})).toBeInTheDocument()
  })

  it('applies dark theme when isDarkTheme = true', async () => {
    setupMocks()
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={true}
        onClickCallback={vi.fn()}
        platformAPI={mockPlatformAPI}
      />,
    )

    // open the OverflowMenu
    const buttons = screen.getAllByRole('button')
    const menuTrigger = buttons.find(btn =>
      btn.className.includes('cds--overflow-menu'),
    )
    fireEvent.click(menuTrigger!)

    const themeWrapper = document.querySelector('.menu-items')
    expect(themeWrapper).toBeInTheDocument()

    // wait for menu to render - to see the DOM to debug
    // await screen.findByLabelText('sample prompts')
    // screen.debug()

    // check for dark theme class
    expect(themeWrapper).toHaveClass('cds--g90')
  })

  it('displays porg if defined', async () => {
    setupMocks({}, {porg: 'porg-org'})
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={false}
        onClickCallback={vi.fn()}
        platformAPI={mockPlatformAPI}
      />,
    )

    expect(screen.getByText('porg-org')).toBeInTheDocument()
  })

  it('displays "null" if porg and auth are falsy', async () => {
    setupMocks({auth: {}, apicTokenExpirationDate: '2025-12-31'}, {porg: ''})
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={false}
        onClickCallback={vi.fn()}
        platformAPI={mockPlatformAPI}
      />,
    )

    expect(
      screen.queryByRole('button', {name: /mock-org/i}),
    ).not.toBeInTheDocument()
  })

  it('calls onClickCallback with "newchat" when New chat is clicked', async () => {
    setupMocks()
    const mockCallback = vi.fn()
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={false}
        onClickCallback={mockCallback}
        platformAPI={mockPlatformAPI}
      />,
    )

    const buttons = screen.getAllByRole('button')
    const menuTrigger = buttons.find(btn =>
      btn.className.includes('cds--overflow-menu'),
    )
    fireEvent.click(menuTrigger!)

    const newChatItem = await within(document.body).findByLabelText('new chat')
    fireEvent.click(newChatItem)

    expect(mockCallback).toHaveBeenCalledWith('newchat')
  })

  it('calls onClickCallback with "samplePrompts" when Sample prompts is clicked', async () => {
    setupMocks()
    const mockCallback = vi.fn()
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={false}
        onClickCallback={mockCallback}
        platformAPI={mockPlatformAPI}
      />,
    )

    const buttons = screen.getAllByRole('button')
    const menuTrigger = buttons.find(btn =>
      btn.className.includes('cds--overflow-menu'),
    )
    fireEvent.click(menuTrigger!)

    const samplePromptsItem = await within(document.body).findByLabelText(
      'sample prompts',
    )
    fireEvent.click(samplePromptsItem)

    expect(mockCallback).toHaveBeenCalledWith('samplePrompts')
  })

  it('calls onClickCallback with "readOnlySettings" when settings button is clicked', async () => {
    setupMocks()
    const mockCallback = vi.fn()
    const {default: Component} = await import('./toolbar')
    render(
      <Component
        isDarkTheme={false}
        onClickCallback={mockCallback}
        platformAPI={mockPlatformAPI}
      />,
    )

    const orgButton = screen.getByRole('button', {name: /mock-org/i})
    fireEvent.click(orgButton)

    expect(mockCallback).toHaveBeenCalledWith('readOnlySettings')
  })

  it('calls platformAPI.logout on logout', async () => {
    setupMocks()
    const {default: Component} = await import('./toolbar')

    render(
      <Component
        isDarkTheme={false}
        onClickCallback={vi.fn()}
        platformAPI={mockPlatformAPI}
      />,
    )

    const buttons = screen.getAllByRole('button')
    const menuTrigger = buttons.find(btn =>
      btn.className.includes('cds--overflow-menu'),
    )
    fireEvent.click(menuTrigger!)

    const logoutItem = await within(document.body).findByLabelText('logout')
    fireEvent.click(logoutItem)

    expect(mockPlatformAPI.logout).toHaveBeenCalled()
  })
})
