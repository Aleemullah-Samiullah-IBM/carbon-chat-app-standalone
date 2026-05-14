import {render, screen} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import Reasoning from './reasoning'

describe('Reasoning Component', () => {
  it('renders reasoning text when provided', () => {
    render(<Reasoning reasoning='This is a test reasoning.' />)
    const reasoningElement = screen
      .getByText('This is a test reasoning.')
      .closest('span')
    expect(reasoningElement).toBeInTheDocument()
    expect(reasoningElement).toHaveClass('reasoning-content')
  })

  it('does not render anything when reasoning is an empty string', () => {
    const {container} = render(<Reasoning reasoning='' />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render anything when reasoning is undefined', () => {
    const {container} = render(<Reasoning reasoning={undefined as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render anything when reasoning is null', () => {
    const {container} = render(<Reasoning reasoning={null as any} />)
    expect(container.firstChild).toBeNull()
  })
})
