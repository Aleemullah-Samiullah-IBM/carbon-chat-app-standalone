import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {UpdateHeadersModal} from './updateHeaders'
import * as customHeadersStorage from '../../utilities/customHeadersStorage'
import '@testing-library/jest-dom'
import {APIProvider} from '../../contexts/APIContext'

// Mock the customHeadersStorage module
vi.mock('../../utilities/customHeadersStorage', () => ({
  getCustomHeaders: vi.fn(),
  saveCustomHeaders: vi.fn(),
  customHeadersToObject: vi.fn(),
  getCustomHostUrl: vi.fn(() => null),
  saveCustomHostUrl: vi.fn(),
}))

// Helper to wrap components with APIProvider
const renderWithProvider = (component: React.ReactElement) => {
  const result = render(<APIProvider>{component}</APIProvider>)
  return {
    ...result,
    rerender: (newComponent: React.ReactElement) =>
      result.rerender(<APIProvider>{newComponent}</APIProvider>),
  }
}

describe('UpdateHeadersModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock implementation
    vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue([])
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    global.localStorage = localStorageMock as any
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Rendering', () => {
    it('renders the component with all sections', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      expect(
        screen.getByText(/Create, modify, or remove custom HTTP headers/),
      ).toBeInTheDocument()
      expect(screen.getByText('Security Note')).toBeInTheDocument()
      expect(
        screen.getByText('IBM Headers (Optional Overrides)'),
      ).toBeInTheDocument()
      expect(screen.getByText('Additional Custom Headers')).toBeInTheDocument()
    })

    it('renders all predefined IBM headers', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument()
      expect(screen.getByDisplayValue('X-ibm-user')).toBeInTheDocument()
      expect(screen.getByDisplayValue('X-ibm-org')).toBeInTheDocument()
      expect(
        screen.getByDisplayValue('X-ibm-agent-frontend-context'),
      ).toBeInTheDocument()
      expect(
        screen.getByDisplayValue('X-ibm-agent-auth-context'),
      ).toBeInTheDocument()
    })

    it('shows empty state message when no custom headers exist', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      expect(
        screen.getByText('There are no custom headers set'),
      ).toBeInTheDocument()
    })

    it('renders Cancel and Save changes buttons', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument()
      expect(
        screen.getByRole('button', {name: /Save changes/i}),
      ).toBeInTheDocument()
    })
  })

  describe('Loading headers from storage', () => {
    it('loads predefined headers from storage', () => {
      const mockHeaders = [
        {id: '1', key: 'Authorization', value: 'Bearer custom-token'},
        {id: '2', key: 'X-ibm-user', value: 'test-user'},
        {id: '3', key: 'X-ibm-org', value: 'test-org'},
      ]
      vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue(
        mockHeaders,
      )

      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      const authInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-Authorization',
      }) as HTMLInputElement
      const userInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-X-ibm-user',
      }) as HTMLInputElement
      const orgInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-X-ibm-org',
      }) as HTMLInputElement

      expect(authInput.value).toBe('Bearer custom-token')
      expect(userInput.value).toBe('test-user')
      expect(orgInput.value).toBe('test-org')
    })

    it('loads custom headers from storage', () => {
      const mockHeaders = [
        {id: '1', key: 'X-ibm-custom-header', value: 'dragon'},
      ]
      vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue(
        mockHeaders,
      )

      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      expect(
        screen.queryByText('There are no custom headers set'),
      ).not.toBeInTheDocument()
      expect(
        screen.getByDisplayValue('X-ibm-custom-header'),
      ).toBeInTheDocument()
      expect(screen.getByDisplayValue('dragon')).toBeInTheDocument()
    })

    it('separates predefined and custom headers correctly', () => {
      const mockHeaders = [
        {id: '1', key: 'Authorization', value: 'Bearer test-token'},
        {id: '2', key: 'X-ibm-user', value: 'test-user'},
        {id: '3', key: 'X-ibm-custom', value: 'custom-value'},
      ]
      vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue(
        mockHeaders,
      )

      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      // Predefined headers should be in the predefined section
      const authInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-Authorization',
      }) as HTMLInputElement
      expect(authInput.value).toBe('Bearer test-token')

      const userInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-X-ibm-user',
      }) as HTMLInputElement
      expect(userInput.value).toBe('test-user')

      // Custom header should be in the custom section
      expect(screen.getByDisplayValue('X-ibm-custom')).toBeInTheDocument()
    })
  })

  describe('Adding custom headers', () => {
    it('adds a new header row when Add header button is clicked', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      expect(
        screen.queryByText('There are no custom headers set'),
      ).not.toBeInTheDocument()
      expect(screen.getByText('Custom request header 1')).toBeInTheDocument()
    })

    it('enables Save button after adding a header', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const saveButton = screen.getByRole('button', {
        name: /Save changes/i,
      }) as HTMLButtonElement
      expect(saveButton.disabled).toBe(true)

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      expect(saveButton.disabled).toBe(false)
    })
  })

  describe('Editing custom headers', () => {
    it('updates header key when typing', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText(
        'e.g., X-ibm-custom-header',
      ) as HTMLInputElement
      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})

      expect(keyInput.value).toBe('X-ibm-test')
    })

    it('updates header value when typing', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const valueInput = screen.getByPlaceholderText(
        'e.g., custom-value',
      ) as HTMLInputElement
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      expect(valueInput.value).toBe('test-value')
    })
  })

  describe('Deleting custom headers', () => {
    it('removes header when delete button is clicked', () => {
      const mockHeaders = [
        {id: '1', key: 'X-ibm-custom', value: 'custom-value'},
      ]
      vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue(
        mockHeaders,
      )

      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      expect(screen.getByDisplayValue('X-ibm-custom')).toBeInTheDocument()

      const deleteButton = screen.getByRole('button', {
        name: /Delete header/i,
      })
      fireEvent.click(deleteButton)

      expect(screen.queryByDisplayValue('X-ibm-custom')).not.toBeInTheDocument()
      expect(
        screen.getByText('There are no custom headers set'),
      ).toBeInTheDocument()
    })
  })

  describe('Predefined headers', () => {
    it('updates predefined header value', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      const userInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-X-ibm-user',
      }) as HTMLInputElement

      fireEvent.change(userInput, {target: {value: 'new-user'}})

      expect(userInput.value).toBe('new-user')
    })

    it('clears predefined header when clear button is clicked', () => {
      const mockHeaders = [{id: '1', key: 'X-ibm-user', value: 'test-user'}]
      vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue(
        mockHeaders,
      )

      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      const userInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-X-ibm-user',
      }) as HTMLInputElement
      expect(userInput.value).toBe('test-user')

      const clearButtons = screen.getAllByRole('button', {
        name: /Clear this header/i,
      })
      // Find the enabled clear button for X-ibm-user
      const enabledClearButton = clearButtons.find(
        btn => !(btn as HTMLButtonElement).disabled,
      )
      fireEvent.click(enabledClearButton!)

      expect(userInput.value).toBe('')
    })

    it('disables clear button when predefined header is empty', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      const clearButtons = screen.getAllByRole('button', {
        name: /Clear this header/i,
      })

      // All clear buttons should be disabled initially
      clearButtons.forEach(btn => {
        expect(btn).toBeDisabled()
      })
    })
  })

  describe('Validation', () => {
    it('shows error when header has key but no value', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(
        screen.getByText(
          /All header rows must have both key and value filled in/,
        ),
      ).toBeInTheDocument()
      expect(customHeadersStorage.saveCustomHeaders).not.toHaveBeenCalled()
    })

    it('shows error when header has value but no key', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const valueInput = screen.getByPlaceholderText('e.g., custom-value')
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(
        screen.getByText(
          /All header rows must have both key and value filled in/,
        ),
      ).toBeInTheDocument()
      expect(customHeadersStorage.saveCustomHeaders).not.toHaveBeenCalled()
    })

    it('shows error when custom header key does not start with X-ibm-', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'Custom-Header'}})
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(
        screen.getByText(/All custom header keys must start with "x-ibm-"/),
      ).toBeInTheDocument()
      expect(customHeadersStorage.saveCustomHeaders).not.toHaveBeenCalled()
    })

    it('accepts custom header key with X-ibm- prefix (case-insensitive)', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'x-IBM-test'}})
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(
        screen.queryByText(/All custom header keys must start with "x-ibm-"/),
      ).not.toBeInTheDocument()
      expect(customHeadersStorage.saveCustomHeaders).toHaveBeenCalled()
    })
  })

  describe('Saving headers', () => {
    it('saves valid custom headers', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(customHeadersStorage.saveCustomHeaders).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'X-ibm-test',
            value: 'test-value',
          }),
        ]),
      )
    })

    it('saves predefined headers with custom headers', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
          showHostUrl={true}
        />,
      )

      // Set predefined header
      const userInput = screen.getByLabelText('Value', {
        selector: '#predefined-val-X-ibm-user',
      })
      fireEvent.change(userInput, {target: {value: 'test-user'}})

      // Add custom header
      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'X-ibm-custom'}})
      fireEvent.change(valueInput, {target: {value: 'custom-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(customHeadersStorage.saveCustomHeaders).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'X-ibm-user',
            value: 'test-user',
          }),
          expect.objectContaining({
            key: 'X-ibm-custom',
            value: 'custom-value',
          }),
        ]),
      )
    })

    it('filters out empty custom headers before saving', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      // Add two headers, but only fill one
      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)
      fireEvent.click(addButton)

      const keyInputs = screen.getAllByPlaceholderText(
        'e.g., X-ibm-custom-header',
      )
      const valueInputs = screen.getAllByPlaceholderText('e.g., custom-value')

      // Only fill the first header
      fireEvent.change(keyInputs[0], {target: {value: 'X-ibm-test'}})
      fireEvent.change(valueInputs[0], {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(customHeadersStorage.saveCustomHeaders).toHaveBeenCalledWith([
        expect.objectContaining({
          key: 'X-ibm-test',
          value: 'test-value',
        }),
      ])
    })

    it('shows success message after saving', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(
        screen.getByText(/1 header has been saved successfully/),
      ).toBeInTheDocument()
    })

    it('shows correct plural message for multiple headers', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      // Add two headers
      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)
      fireEvent.click(addButton)

      const keyInputs = screen.getAllByPlaceholderText(
        'e.g., X-ibm-custom-header',
      )
      const valueInputs = screen.getAllByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInputs[0], {target: {value: 'X-ibm-test1'}})
      fireEvent.change(valueInputs[0], {target: {value: 'value1'}})
      fireEvent.change(keyInputs[1], {target: {value: 'X-ibm-test2'}})
      fireEvent.change(valueInputs[1], {target: {value: 'value2'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      // Check for the notification title and that 2 headers were saved
      expect(screen.getByText('Headers Saved')).toBeInTheDocument()
      expect(customHeadersStorage.saveCustomHeaders).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({key: 'X-ibm-test1', value: 'value1'}),
          expect.objectContaining({key: 'X-ibm-test2', value: 'value2'}),
        ]),
      )
    })

    it('shows info message when no headers are saved', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const saveButton = screen.getByRole('button', {name: /Save changes/i})

      // Add a header to enable the save button
      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      // Click save without filling in the header
      fireEvent.click(saveButton)

      expect(screen.getByText(/No headers were saved/)).toBeInTheDocument()
    })

    it('auto-closes modal after 3 seconds on successful save', async () => {
      vi.useFakeTimers()

      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(mockOnClose).not.toHaveBeenCalled()

      vi.advanceTimersByTime(3000)

      expect(mockOnClose).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('disables Save button after successful save', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      const valueInput = screen.getByPlaceholderText('e.g., custom-value')

      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})
      fireEvent.change(valueInput, {target: {value: 'test-value'}})

      const saveButton = screen.getByRole('button', {
        name: /Save changes/i,
      }) as HTMLButtonElement
      expect(saveButton.disabled).toBe(false)

      fireEvent.click(saveButton)

      expect(saveButton.disabled).toBe(true)
    })
  })

  describe('Cancel functionality', () => {
    it('calls onClose when Cancel button is clicked', () => {
      renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      const cancelButton = screen.getByRole('button', {name: /Cancel/i})
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Modal state management', () => {
    it('reloads headers when modal is opened', () => {
      const mockHeaders = [{id: '1', key: 'X-ibm-user', value: 'test-user'}]
      vi.mocked(customHeadersStorage.getCustomHeaders).mockReturnValue(
        mockHeaders,
      )

      const {rerender} = renderWithProvider(
        <UpdateHeadersModal
          isOpen={false}
          onClose={mockOnClose}
        />,
      )

      expect(customHeadersStorage.getCustomHeaders).not.toHaveBeenCalled()

      rerender(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      expect(customHeadersStorage.getCustomHeaders).toHaveBeenCalled()
    })

    it('clears validation errors when modal is reopened', () => {
      const {rerender} = renderWithProvider(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      // Trigger validation error
      const addButton = screen.getByRole('button', {name: /Add header/i})
      fireEvent.click(addButton)

      const keyInput = screen.getByPlaceholderText('e.g., X-ibm-custom-header')
      fireEvent.change(keyInput, {target: {value: 'X-ibm-test'}})

      const saveButton = screen.getByRole('button', {name: /Save changes/i})
      fireEvent.click(saveButton)

      expect(screen.getByText(/Validation Error/)).toBeInTheDocument()

      // Close and reopen modal
      rerender(
        <UpdateHeadersModal
          isOpen={false}
          onClose={mockOnClose}
        />,
      )
      rerender(
        <UpdateHeadersModal
          isOpen={true}
          onClose={mockOnClose}
        />,
      )

      expect(screen.queryByText(/Validation Error/)).not.toBeInTheDocument()
    })
  })
})

// Made with Bob
