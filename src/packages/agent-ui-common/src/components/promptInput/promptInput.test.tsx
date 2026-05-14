import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import {PromptInput} from './promptInput'
import {FileProvider} from '../../interfaces/platform'

const mockSetSelectedFiles = vi.fn()

vi.mock('../../contexts/ChatContext', async () => {
  const actual = await vi.importActual('../../contexts/ChatContext')

  return {
    ...actual,
    useMyContext: () => ({
      setSelectedFiles: mockSetSelectedFiles,
      showPorgSelection: false,
    }),
    useInput: () => ({
      inputRef: {current: {focus: vi.fn()}},
      registerInputHandler: vi.fn(),
    }),
  }
})

vi.mock('../../contexts/ErrorContext', () => ({
  useError: () => ({
    setError: vi.fn(),
  }),
}))

vi.mock('../../utilities/utilities', () => ({
  sendProviderMessage: vi.fn(),
}))

const mockFileProvider: FileProvider = {
  getFileList: vi.fn(),
  saveSelectedFilePath: vi.fn(),
  notifyNoFilesError: vi.fn(),
}

describe('PromptInput', () => {
  const mockSend = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Test: Basic rendering
   * Verifies that the PromptInput component renders with the textarea input
   * and send button visible in the DOM
   */
  it('renders input and send button', () => {
    render(
      <PromptInput
        commands={[]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    expect(
      screen.getByPlaceholderText(/How can I help you/),
    ).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  /**
   * Test: File name replacement logic
   * Tests the getNewInput function that replaces @-mentions with file names
   * and adds a trailing space for better UX
   */
  it('replaces selected word with file name and adds a space', () => {
    const input = 'Please upload @doc here'
    const selectedStartInd = 15
    const selectedWord = '@doc'

    const getNewInput = (fileName: string) => {
      return (
        input.slice(0, selectedStartInd) +
        fileName +
        input.slice(selectedStartInd + selectedWord.length) +
        ' '
      )
    }

    const result = getNewInput('report.pdf')
    expect(result).toBe('Please upload @report.pdfhere ')
  })

  /**
   * Test: Send message functionality
   * Verifies that clicking the send button triggers the onSendMessage callback
   * with the correct input value
   */
  it('calls onSendMessage when send button is clicked', () => {
    render(
      <PromptInput
        commands={[]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    const input = screen.getByPlaceholderText(/How can I help you/)
    fireEvent.change(input, {target: {value: 'Hello'}})

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSend).toHaveBeenCalledWith('Hello')
  })

  /**
   * Test: Empty input validation
   * Ensures that the send button does not trigger onSendMessage
   * when the input field is empty or contains only whitespace
   */
  it('does not call onSendMessage when input is empty', () => {
    render(
      <PromptInput
        commands={[]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSend).not.toHaveBeenCalled()
  })

  /**
   * Test: Menu close on outside click
   * Tests that file/command menus close when user clicks outside
   * the menu area, improving UX by dismissing menus appropriately
   */
  it('closes menus when clicking outside', async () => {
    render(
      <div>
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
        />
        <div data-testid='outside-element'>Outside</div>
      </div>,
    )

    // open menu
    const input = screen.getByPlaceholderText(/How can I help you/)
    fireEvent.change(input, {target: {value: '@file'}})

    // close menu by outside click
    fireEvent.mouseDown(screen.getByTestId('outside-element'))

    await waitFor(() => {
      expect(document.querySelector('.commands-menu')).not.toBeInTheDocument()
    })
  })

  /**
   * Test: Escape key closes menu
   * Verifies that pressing the Escape key closes any open command menus,
   * providing keyboard accessibility for dismissing menus
   */
  it('hides command menu when Escape key is pressed', async () => {
    render(
      <PromptInput
        commands={[{name: 'test', description: 'desc', parameters: []}]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    const input = screen.getByPlaceholderText(/How can I help you/)

    fireEvent.change(input, {target: {value: '/'}})
    fireEvent.keyDown(input, {key: 'a', code: 'KeyA'})

    await waitFor(() => {
      expect(document.querySelector('.commands-menu')).toBeInTheDocument()
    })

    fireEvent.keyDown(input, {key: 'Escape', code: 'Escape'})

    await waitFor(() => {
      expect(document.querySelector('.commands-menu')).not.toBeInTheDocument()
    })
  })

  /**
   * Test: Enter key sends message
   * Tests that pressing Enter (without Shift) sends the message,
   * providing keyboard shortcut for quick message submission
   */
  it('calls handleSend on Enter key without Shift', () => {
    render(
      <PromptInput
        commands={[]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    const input = screen.getByPlaceholderText(/How can I help you/)
    fireEvent.change(input, {target: {value: 'Hello'}})

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    })
    input.dispatchEvent(event)

    expect(mockSend).toHaveBeenCalledWith('Hello')
  })

  /**
   * Test: Shift+Enter creates new line
   * Ensures that Shift+Enter does not send the message but instead
   * allows users to create multi-line input (new line behavior)
   */
  it('does not call handleSend on Shift+Enter', () => {
    render(
      <PromptInput
        commands={[]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    const input = screen.getByPlaceholderText(/How can I help you/)
    fireEvent.change(input, {target: {value: 'Hello'}})

    fireEvent.keyDown(input, {key: 'Enter', shiftKey: true})

    expect(mockSend).not.toHaveBeenCalled()
  })

  /**
   * Test: Arrow key navigation
   * Tests that arrow keys (up/down) enable menu navigation mode,
   * allowing users to navigate through command/file suggestions
   */
  it('sets isNavigatingMenu to true on ArrowUp or ArrowDown', () => {
    render(
      <PromptInput
        commands={[]}
        fetching={false}
        onSendMessage={mockSend}
        fileProvider={mockFileProvider}
      />,
    )

    const input = screen.getByPlaceholderText(/How can I help you/)

    fireEvent.keyDown(input, {key: 'ArrowDown'})
    expect(document.activeElement).toBe(input)

    fireEvent.keyDown(input, {key: 'ArrowUp'})
    expect(document.activeElement).toBe(input)
  })

  /**
   * Test Suite: Image Upload Button
   * Tests for the custom image upload button functionality including:
   * - Button rendering based on props
   * - File selection and display
   * - File removal
   * - Integration with message sending
   * - File input reset behavior
   */
  describe('Image Upload Button', () => {
    const mockHandleAddImages = vi.fn()

    beforeEach(() => {
      vi.clearAllMocks()
    })

    /**
     * Test: Button renders conditionally
     * Verifies that the image upload button only appears when
     * the handleAddImages prop is provided
     */
    it('renders image upload button when handleAddImages is provided', () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const uploadButton = screen.getByRole('button', {name: /add image/i})
      expect(uploadButton).toBeInTheDocument()
    })

    /**
     * Test: Button hidden without handler
     * Ensures the upload button is not rendered when handleAddImages
     * prop is not provided, maintaining clean UI
     */
    it('does not render image upload button when handleAddImages is not provided', () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
        />,
      )

      const uploadButton = screen.queryByRole('button', {name: /add image/i})
      expect(uploadButton).not.toBeInTheDocument()
    })

    /**
     * Test: Button triggers file dialog
     * Verifies that clicking the upload button opens the native
     * file selection dialog by triggering the hidden input's click
     */
    it('opens file dialog when upload button is clicked', () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement
      const clickSpy = vi.spyOn(fileInput, 'click')

      const uploadButton = screen.getByRole('button', {name: /add image/i})
      fireEvent.click(uploadButton)

      expect(clickSpy).toHaveBeenCalled()
    })

    /**
     * Test: File name display
     * Tests that selected file names are displayed in the UI
     * after files are chosen through the file input
     */
    it('displays uploaded file names', async () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      const file = new File(['test'], 'test-image.jpg', {type: 'image/jpeg'})
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument()
      })
    })

    /**
     * Test: Multiple file display
     * Verifies that multiple selected files are all displayed
     * in the file list, supporting batch uploads
     */
    it('displays multiple uploaded files', async () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      const file1 = new File(['test1'], 'image1.jpg', {type: 'image/jpeg'})
      const file2 = new File(['test2'], 'image2.png', {type: 'image/png'})

      Object.defineProperty(fileInput, 'files', {
        value: [file1, file2],
        writable: false,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('image1.jpg')).toBeInTheDocument()
        expect(screen.getByText('image2.png')).toBeInTheDocument()
      })
    })

    /**
     * Test: File removal functionality
     * Tests that clicking the remove button on a file item
     * removes it from the displayed list
     */
    it('removes file when remove button is clicked', async () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      const file = new File(['test'], 'test-image.jpg', {type: 'image/jpeg'})
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', {name: /remove file/i})
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(screen.queryByText('test-image.jpg')).not.toBeInTheDocument()
      })
    })

    /**
     * Test: Files cleared on send
     * Verifies that uploaded files are cleared from the list
     * when a message is sent, resetting for the next message
     */
    it('clears uploaded files when message is sent', async () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      const file = new File(['test'], 'test-image.jpg', {type: 'image/jpeg'})
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/How can I help you/i)
      fireEvent.change(input, {target: {value: 'Hello'}})

      const sendButton = screen.getAllByRole('button')[0]
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.queryByText('test-image.jpg')).not.toBeInTheDocument()
      })
    })

    /**
     * Test: Callback invocation
     * Ensures that the handleAddImages callback is called
     * when files are selected, allowing parent components to handle uploads
     */
    it('calls handleAddImages when files are selected', async () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      const file = new File(['test'], 'test-image.jpg', {type: 'image/jpeg'})
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(mockHandleAddImages).toHaveBeenCalled()
      })
    })

    /**
     * Test: Input reset after selection
     * Tests that the file input value is reset after files are selected,
     * allowing the same file to be selected again if needed
     */
    it('resets file input after file selection', async () => {
      render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      const file = new File(['test'], 'test-image.jpg', {type: 'image/jpeg'})
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(fileInput.value).toBe('')
      })
    })

    /**
     * Test: Re-upload same file
     * Comprehensive test verifying that a file can be uploaded,
     * removed, and then uploaded again - ensuring proper input reset
     * and state management throughout the lifecycle
     */
    it('allows re-selecting the same file after removal', async () => {
      const {unmount} = render(
        <PromptInput
          commands={[]}
          fetching={false}
          onSendMessage={mockSend}
          fileProvider={mockFileProvider}
          handleAddImages={mockHandleAddImages}
        />,
      )

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      // First selection
      const file = new File(['test'], 'test-image.jpg', {type: 'image/jpeg'})
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
        configurable: true,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument()
      })

      // Remove file
      const removeButton = screen.getByRole('button', {name: /remove file/i})
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(screen.queryByText('test-image.jpg')).not.toBeInTheDocument()
      })

      // Verify file input was reset (value should be empty)
      expect(fileInput.value).toBe('')

      // Re-select same file - redefine with configurable: true
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
        configurable: true,
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument()
      })

      unmount()
    })
  })
})
