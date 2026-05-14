import {render, screen} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import {LoadingMessage} from './loadingMessage'

vi.mock('../../../utilities/helpers', () => ({
  getCurrentTime: () => '12:34 PM',
}))

describe('LoadingMessage', () => {
  it('renders the watsonx icon SVG', () => {
    const {container} = render(<LoadingMessage isDarkTheme={true} />)
    const svg = container.querySelector('svg#watsonx')
    expect(svg).toBeInTheDocument()
  })

  it('renders the agent message header with correct text and time', () => {
    render(<LoadingMessage isDarkTheme={false} />)
    const header = screen.getByText(/watsonx\s+12:34 PM/)
    expect(header).toBeInTheDocument()
  })

  it('renders the loading spinner with a message', () => {
    render(<LoadingMessage isDarkTheme={false} />)
    const loadingSpinner = document.querySelector('.cds--loading')
    expect(loadingSpinner).toBeInTheDocument()

    const messageElement = screen.getByText(
      /Running...|One moment...|Please wait...|Loading up...|Getting things ready...|Loading...|Fetching...|Retrieving.../i,
    )
    expect(messageElement).toBeInTheDocument()
  })
})
