import {render, screen} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import '@testing-library/jest-dom'

vi.mock('../../../contexts/ChatContext', () => ({
  useMyContext: () => ({
    isDarkTheme: false,
  }),
}))

const TestIcon = ({fill}: {fill: string}) => (
  <svg
    data-testid='icon'
    fill={fill}
  />
)

const setupComponent = async (propsOverride = {}) => {
  const {default: FirstActions} = await import('./firstActions')
  const defaultProps = {
    firstActionList: [
      {icon: TestIcon, message: 'Action One'},
      {icon: TestIcon, message: 'Action Two'},
      {icon: TestIcon, message: 'Action Three'},
    ],
    ...propsOverride,
  }

  render(<FirstActions {...defaultProps} />)
}

describe('FirstActions Component', () => {
  it('renders all action items', async () => {
    await setupComponent()

    expect(screen.getByText('Action One')).toBeInTheDocument()
    expect(screen.getByText('Action Two')).toBeInTheDocument()
    expect(screen.getByText('Action Three')).toBeInTheDocument()

    const icons = screen.getAllByTestId('icon')
    expect(icons).toHaveLength(3)
  })

  it('renders black fill for icons when isDarkTheme = false', async () => {
    await setupComponent()

    const icons = screen.getAllByTestId('icon')
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('fill', '#000000')
    })
  })

  it('renders white fill for icons when isDarkTheme = true', async () => {
    vi.resetModules() // clear module cache for new mock to take effect

    vi.doMock('../../../contexts/ChatContext', () => ({
      useMyContext: () => ({
        isDarkTheme: true,
      }),
    }))

    await setupComponent()

    const icons = screen.getAllByTestId('icon')
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('fill', '#ffffff')
    })
  })
})
