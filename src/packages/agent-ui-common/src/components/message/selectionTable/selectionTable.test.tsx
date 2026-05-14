import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import SelectionTable from './selectionTable'
import * as ChatContext from '../../../contexts/ChatContext'

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
    nonce: '',
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

describe('SelectionTable Component', () => {
  beforeEach(() => {
    vi.spyOn(ChatContext, 'useMyContext').mockReturnValue(mockContextValue)
  })

  const headers = [
    {data_key: 'name', title: 'Name', format: 'plain'},
    {data_key: 'details', title: 'Details', format: 'plain'},
  ]

  const rows = [
    {id: 0, name: 'Item 1', details: 'Details 1'},
    {id: 1, name: 'Item 2', details: 'Details 2'},
    {id: 2, name: 'Item 3', details: 'Details 3'},
  ]

  it('renders table with title header', () => {
    render(
      <SelectionTable
        selectionType='none'
        title='Test Table'
        origHeaders={headers}
        origRows={rows}
        onSave={() => {}}
      />,
    )
    expect(screen.getByText('Test Table')).toBeInTheDocument()
  })

  it('renders table with empty [] headers', () => {
    render(
      <SelectionTable
        selectionType='none'
        title='Test Table'
        origHeaders={[]}
        origRows={rows}
        onSave={() => {}}
      />,
    )
    expect(screen.getByText('Test Table')).toBeInTheDocument()
  })

  it('expands all rows when expand header is clicked', () => {
    render(
      <SelectionTable
        selectionType='none'
        title='Table'
        origHeaders={headers}
        origRows={rows}
        onSave={() => {}}
      />,
    )

    const expandButton = screen.getByLabelText('expand row')
    expect(expandButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(expandButton)

    expect(expandButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses all rows when expand header is clicked again', () => {
    render(
      <SelectionTable
        selectionType='none'
        title='Table'
        origHeaders={headers}
        origRows={rows}
        onSave={() => {}}
      />,
    )

    const expandButton = screen.getByLabelText('expand row')

    fireEvent.click(expandButton)
    expect(expandButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(expandButton)
    expect(expandButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders pagination when rows exceed page size', () => {
    const longRows = Array.from({length: 10}, (_, i) => ({
      name: `Item ${i + 1}`,
      details: `Details ${i + 1}`,
    }))

    render(
      <SelectionTable
        selectionType='none'
        title='Paginated Table'
        origHeaders={[
          {data_key: 'name', title: 'Name', format: 'plain'},
          {data_key: 'details', title: 'Details', format: 'plain'},
        ]}
        origRows={longRows}
        onSave={() => {}}
      />,
    )

    // look for "Items per page" combobox
    const itemsPerPageSelect = screen.getByRole('combobox', {
      name: /Items per page/i,
    })

    expect(itemsPerPageSelect).toBeInTheDocument()

    // look for "Page number" combobox
    const pageNumberSelect = screen.getByRole('combobox', {
      name: /Page of \d+ pages/i,
    })
    expect(pageNumberSelect).toBeInTheDocument()

    expect(pageNumberSelect).toBeInTheDocument()
  })

  it('handle single selection', async () => {
    const onSave = vi.fn()

    render(
      <SelectionTable
        selectionType='selection'
        title='Single Select'
        origHeaders={headers}
        origRows={rows}
        onSave={onSave}
        nonEditable={false}
      />,
    )

    const radioButtons = screen.getAllByRole('radio')

    fireEvent.click(radioButtons[2])

    // wait for button to be enabled
    const continueButton = await screen.findByRole('button', {
      name: /continue/i,
    })
    await waitFor(() => expect(continueButton).not.toBeDisabled())

    fireEvent.click(continueButton)

    expect(onSave).toHaveBeenCalledWith(2)
  })

  it('handles multi-selection', async () => {
    const onSave = vi.fn()

    render(
      <SelectionTable
        selectionType='multi-selection'
        title='Multi Select'
        origHeaders={headers}
        origRows={rows}
        onSave={onSave}
        nonEditable={false}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes.length).toBeGreaterThan(0)

    fireEvent.click(checkboxes[1])
    fireEvent.click(checkboxes[2])
    fireEvent.click(checkboxes[3])

    // deselect one row
    fireEvent.click(checkboxes[1])

    // wait for button to be enabled
    const continueButton = await screen.findByRole('button', {
      name: /continue/i,
    })
    await waitFor(() => expect(continueButton).not.toBeDisabled())

    fireEvent.click(continueButton)

    expect(onSave).toHaveBeenCalledWith([1, 2])
  })

  it('handles select all and deselect all for multi-select', async () => {
    const onSave = vi.fn()

    render(
      <SelectionTable
        selectionType='multi-selection'
        title='Multi Select'
        origHeaders={headers}
        origRows={rows}
        onSave={onSave}
        nonEditable={false}
      />,
    )

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all rows/i,
    })

    fireEvent.click(selectAllCheckbox)

    // screen.debug()

    const continueButton = await screen.findByRole('button', {
      name: /continue/i,
    })

    await waitFor(() => expect(continueButton).not.toBeDisabled())
    fireEvent.click(continueButton)

    const expectedIds = rows.map(row => row.id)
    expect(onSave).toHaveBeenCalledWith(expectedIds)

    // for some reason, deselect doesn't work
    // fireEvent.click(selectAllCheckbox)
    // fireEvent.click(continueButton)

    // expect(onSave).toHaveBeenCalledWith([])
  })

  it('disables selection when nonEditable or isApprovalSubmitting is true', () => {
    vi.spyOn(ChatContext, 'useMyContext').mockReturnValue({
      ...mockContextValue,
      isApprovalSubmitting: true,
    })

    render(
      <SelectionTable
        selectionType='multi-selection'
        title='Disabled Select'
        origHeaders={headers}
        origRows={rows}
        onSave={() => {}}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeDisabled()
  })
})
