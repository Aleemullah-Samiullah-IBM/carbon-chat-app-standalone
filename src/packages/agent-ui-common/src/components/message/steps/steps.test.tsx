import {render, screen} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import Steps from './steps'
import * as ChatContext from '../../../contexts/ChatContext'

vi.mock('../plan/toolcall/toolcallList', () => ({
  default: ({executed_toolcalls, planned_toolcalls}: any) => (
    <div data-testid='toolcall-list'>
      Executed: {executed_toolcalls.length}, Planned: {planned_toolcalls.length}
    </div>
  ),
}))

const mockContextValue = {
  plan: null,
  setPlan: vi.fn(),
  startNewChat: false,
  setStartNewChat: vi.fn(),
  isApprovalSubmitting: false,
  setIsApprovalSubmitting: vi.fn(),
  apicToken: '',
  setApicToken: vi.fn(),
  apicTokenExpirationDate: '',
  setApicTokenExpirationDate: vi.fn(),
  isLoggedIn: true,
  setIsLoggedIn: vi.fn(),
  hostUrl: '',
  setHostUrl: vi.fn(),
  showPorgSelection: false,
  setShowPorgSelection: vi.fn(),
  showProjectSelection: false,
  setShowProjectSelection: vi.fn(),
  auth: {
    API_URL: '',
    OVERRIDE_TOKEN: '',
    'X-ibm-user': '',
    'X-ibm-org': '',
    'nonce': '',
  },
  setAuth: vi.fn(),
  nonce: '123',
  setNonce: vi.fn(),
  checkLogin: () => true,
  selectedFiles: [],
  setSelectedFiles: vi.fn(),
  isDarkTheme: false,
  setIsDarkTheme: vi.fn(),
}

describe('Steps Component', () => {
  beforeEach(() => {
    vi.spyOn(ChatContext, 'useMyContext').mockReturnValue(mockContextValue)
  })

  it('renders nothing when no toolcalls are provided', () => {
    const {container} = render(
      <Steps
        executed_toolcalls={undefined}
        planned_toolcalls={undefined}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders ToolcallList when executed_toolcalls are provided', () => {
    const executed = [{id: '1'}] as any
    render(
      <Steps
        executed_toolcalls={executed}
        planned_toolcalls={undefined}
      />,
    )
    expect(screen.getByTestId('toolcall-list')).toHaveTextContent('Executed: 1')
  })

  it('renders ToolcallList when planned_toolcalls are provided', () => {
    const planned = [{id: '2'}] as any
    render(
      <Steps
        executed_toolcalls={undefined}
        planned_toolcalls={planned}
      />,
    )
    expect(screen.getByTestId('toolcall-list')).toHaveTextContent('Planned: 1')
  })

  it('applies dark theme class when isDarkTheme is true', () => {
    vi.spyOn(ChatContext, 'useMyContext').mockReturnValue({
      ...mockContextValue,
      isDarkTheme: true,
    })
    const executed = [{id: '1'}] as any
    const {container} = render(
      <Steps
        executed_toolcalls={executed}
        planned_toolcalls={[]}
      />,
    )
    expect(container.firstChild).toHaveClass('steps-dark')
  })

  it('applies light theme class when isDarkTheme is false', () => {
    const executed = [{id: '1'}] as any
    const {container} = render(
      <Steps
        executed_toolcalls={executed}
        planned_toolcalls={[]}
      />,
    )
    expect(container.firstChild).toHaveClass('steps-light')
  })
})
