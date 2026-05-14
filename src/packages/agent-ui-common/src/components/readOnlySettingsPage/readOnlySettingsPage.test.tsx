import {render, screen, fireEvent} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import ReadOnlySettingsPage from './readOnlySettingsPage'
import '@testing-library/jest-dom'

vi.mock('../../contexts/ChatContext', () => ({
  useMyContext: () => ({
    hostUrl: 'https://mock-api-connect.com',
    auth: {'X-ibm-org': 'mock-org'},
    apicTokenExpirationDate: 'indefinite',
  }),
}))

vi.mock('../../contexts/APIContext', () => ({
  useAPI: () => ({
    porg: '',
  }),
}))

afterEach(() => {
  vi.resetModules() // clear previous mocks
})

describe('ReadOnlySettingsPage', () => {
  const mockSetOpen = vi.fn()

  // it('uses auth["X-ibm-org"] when porg is falsy and token is indefinite', async () => {
  //   vi.doMock('../../contexts/ChatContext', () => ({
  //     useMyContext: () => ({
  //       hostUrl: 'https://mock-api-connect.com',
  //       auth: {'X-ibm-org': 'mock-org'},
  //       apicTokenExpirationDate: 'indefinite',
  //     }),
  //   }))

  //   vi.doMock('../../contexts/APIContext', () => ({
  //     useAPI: () => ({
  //       porg: '',
  //     }),
  //   }))

  //   const {default: Component} = await import('./readOnlySettingsPage')
  //   render(
  //     <Component
  //       isDarkTheme={false}
  //       setOpenReadOnlySettingsPage={() => {}}
  //     />,
  //   )

  //   expect(screen.getByText('Connection details')).toBeInTheDocument()
  //   expect(screen.getByLabelText('Host Url')).toHaveValue(
  //     'https://mock-api-connect.com',
  //   )
  //   const input = screen.getByLabelText('Provider organization')
  //   expect(input).toBeInTheDocument()
  //   expect(input).toHaveValue('mock-org')
  //   expect(input).toHaveAttribute('readonly')
  // })

  // it('uses "null" when porg and auth["X-ibm-org"] are falsy and token is not indefinite', async () => {
  //   vi.doMock('../../contexts/ChatContext', () => ({
  //     useMyContext: () => ({
  //       hostUrl: 'https://mock-api-connect.com',
  //       auth: {},
  //       apicTokenExpirationDate: '2035-12-31',
  //     }),
  //   }))

  //   vi.doMock('../../contexts/APIContext', () => ({
  //     useAPI: () => ({
  //       porg: '',
  //     }),
  //   }))

  //   const {default: Component} = await import('./readOnlySettingsPage')
  //   render(
  //     <Component
  //       isDarkTheme={false}
  //       setOpenReadOnlySettingsPage={() => {}}
  //     />,
  //   )

  //   expect(screen.getByText('Connection details')).toBeInTheDocument()
  //   expect(screen.getByLabelText('Host Url')).toHaveValue(
  //     'https://mock-api-connect.com',
  //   )
  //   const input = screen.getByLabelText('Provider organization')
  //   expect(input).toBeInTheDocument()
  //   expect(input).toHaveValue('null')
  //   expect(input).toHaveAttribute('readonly')
  // })

  it('applies dark mode class when isDarkTheme is true', () => {
    const {container} = render(
      <ReadOnlySettingsPage
        isDarkTheme={true}
        setOpenReadOnlySettingsPage={mockSetOpen}
      />,
    )

    expect(container.firstChild).toHaveClass('modal-dark-mode')
  })

  it('calls setOpenReadOnlySettingsPage(false) when close button is clicked', () => {
    render(
      <ReadOnlySettingsPage
        isDarkTheme={false}
        setOpenReadOnlySettingsPage={mockSetOpen}
      />,
    )

    const closeButton = screen.getByRole('button', {name: /close/i})
    fireEvent.click(closeButton)

    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })
})
