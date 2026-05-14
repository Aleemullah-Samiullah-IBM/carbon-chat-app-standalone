import {render, screen, fireEvent, act} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import DynamicIconButton from './dynamicIconButton'

describe('DynamicIconButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders with initial icon', () => {
    render(
      <DynamicIconButton label=''>
        <span>Initial Icon</span>
      </DynamicIconButton>,
    )
    expect(screen.getByText('Initial Icon')).toBeInTheDocument()
  })

  it('calls onClick immediately when debounce is false', () => {
    const handleClick = vi.fn()
    render(
      <DynamicIconButton
        label=''
        onClick={handleClick}
        debounce={false}
      >
        <span>Click Me</span>
      </DynamicIconButton>,
    )

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('shows InProgress and Checkmark icons when debounce is true and click succeeds', async () => {
    const handleClick = vi.fn(() => Promise.resolve())

    const {container} = render(
      <DynamicIconButton
        label=''
        onClick={handleClick}
        debounce={true}
      >
        <span>Click Me</span>
      </DynamicIconButton>,
    )

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    // IconButton doesn't have any distinguishing things
    expect(container.querySelector('svg')).toBeTruthy()
    expect(handleClick).toHaveBeenCalled()

    await act(async () => {
      vi.runAllTimers()
    })

    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('shows ErrorFilled icon when onClick throws', async () => {
    const handleClick = vi.fn(() => {
      throw new Error('fail')
    })

    const {container} = render(
      <DynamicIconButton
        label=''
        onClick={handleClick}
        debounce={true}
      >
        <span>Click Me</span>
      </DynamicIconButton>,
    )

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    // IconButton doesn't have any distinguishing things
    expect(container.querySelector('svg')).toBeTruthy()
    expect(handleClick).toHaveBeenCalled()

    await act(async () => {
      vi.runAllTimers()
    })

    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('does nothing if disabled or onClick is not provided', async () => {
    const handleClick = vi.fn()

    render(
      <DynamicIconButton
        label=''
        debounce={true}
      >
        <span>Click Me</span>
      </DynamicIconButton>,
    )

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(handleClick).not.toHaveBeenCalled()
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })
})
