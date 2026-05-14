import {render, screen, fireEvent} from '@testing-library/react'
import OptionsModal from './optionsModal'
import {vi} from 'vitest'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

const defaultProps = {
  chatUUID: 'chatuuid-123',
  reqId: 'reqid-456',
  debugResponse: 'debug-info',
  expandDetails: true,
  setExpandDetails: vi.fn(),
}

describe('OptionsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders chatUUID and copies it', () => {
    render(
      <OptionsModal
        {...defaultProps}
        idDetailType='chatUUID'
      />,
    )

    expect(screen.getByText('chatuuid-123')).toBeInTheDocument()

    const copyButton = screen.getByRole('button', {
      name: /copy chat session id/i,
    })
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('chatuuid-123')
  })

  it('renders reqId and copies it', () => {
    render(
      <OptionsModal
        {...defaultProps}
        idDetailType='reqID'
      />,
    )

    expect(screen.getByText('reqid-456')).toBeInTheDocument()

    const copyButton = screen.getByRole('button', {name: /copy request id/i})
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('reqid-456')
  })

  it('renders debugResponse and copies it', () => {
    render(
      <OptionsModal
        {...defaultProps}
        idDetailType='debug'
      />,
    )

    expect(screen.getByText('debug-info')).toBeInTheDocument()

    const copyButton = screen.getByRole('button', {name: /copy debug logs/i})
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('debug-info')
  })

  it('renders "undefined" when reqId is empty', () => {
    render(
      <OptionsModal
        {...defaultProps}
        idDetailType='reqID'
        reqId=''
      />,
    )

    expect(screen.getByText('undefined')).toBeInTheDocument()
  })

  it('calls setExpandDetails(false) on modal close', () => {
    render(
      <OptionsModal
        {...defaultProps}
        idDetailType='chatUUID'
      />,
    )

    // Simulate modal close
    fireEvent.keyDown(document, {key: 'Escape', code: 'Escape'})

    expect(defaultProps.setExpandDetails).toHaveBeenCalledWith(false)
  })
})
