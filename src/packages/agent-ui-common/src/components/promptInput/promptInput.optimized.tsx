import React, {
  JSX,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react'
import {Button, TextArea} from '@carbon/react'
import {Send, SendFilled, Image, Close} from '@carbon/icons-react'
import {useTranslation} from 'react-i18next'
import {Command} from '../../types/Command'
import {useMyContext, useInput} from '../../contexts/ChatContext'
import {FileMenu} from './fileMenu/fileMenu.optimized'
import {CommandMenu} from './commandMenu/commandMenu.optimized'
import {FileProvider} from '../../interfaces/platform'

import './promptInput.scss'

interface PromptInputProps {
  commands: Command[]
  fetching: boolean
  onSendMessage: (message: string) => void
  fileProvider: FileProvider
  fileInputRef?: any
  onInputChange?: (value: string) => void
  value?: string
  handleAddImages?: any
  isUploadingFiles?: boolean
}

export const PromptInput = ({
  commands,
  fetching,
  onSendMessage,
  fileProvider,
  fileInputRef,
  onInputChange,
  value,
  handleAddImages,
  isUploadingFiles = false,
}: PromptInputProps): JSX.Element => {
  const {t} = useTranslation()
  const {setSelectedFiles, selectedFiles, showPorgSelection} = useMyContext()
  const [input, setInput] = useState<string>(value ?? '')
  const [currentWord, setCurrentWord] = useState<string>('')
  const [showFileMenu, setShowFileMenu] = useState<boolean>(false)
  const [showCommandMenu, setShowCommandMenu] = useState<boolean>(false)
  const [selectedStartInd, setSelectedStartInd] = useState<number>(0)
  const [selectedWord, setSelectedWord] = useState<string>('')
  const [atTyped, setAtTyped] = useState<boolean>(false)
  const [isNavigatingMenu, setIsNavigatingMenu] = useState<boolean>(false)
  const [atCursorPosition, setAtCursorPosition] = useState<number>(0)

  const sendRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const {registerInputHandler, inputRef} = useInput()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [fileUploaderKey, setFileUploaderKey] = useState<number>(0)

  // Get uploaded files from context instead of local state
  const uploadedFiles = useMemo(
    () => selectedFiles.filter(f => f.uploadedViaButton),
    [selectedFiles],
  )

  const setRefs = useCallback(
    (el: HTMLTextAreaElement) => {
      inputRef.current = el
      textareaRef.current = el
    },
    [inputRef],
  )

  // Update internal input when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== input) {
      setInput(value)
    }
  }, [value])

  useEffect(() => {
    inputRef.current?.focus()
    registerInputHandler(setInput)
  }, [registerInputHandler, inputRef])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const observer = new ResizeObserver(() => {
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    })

    observer.observe(textarea)

    return () => {
      observer.disconnect()
    }
  }, [])

  // refocus the inputRef when API call completed
  useEffect(() => {
    if (!fetching) {
      inputRef.current?.focus()
    }
  }, [fetching, inputRef])

  // if user clicks outside menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const menu = menuRef.current
      if (menu && !menu.contains(e.target as Node)) {
        setShowFileMenu(false)
        setShowCommandMenu(false)
        setIsNavigatingMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const getSelectedWord = useCallback(
    (str: string, selStart: number, selEnd: number) => {
      const previousSpaceIndex = str.lastIndexOf(' ', selStart - 1)
      const nextSpaceIndex = str.indexOf(' ', selEnd)
      const begin = previousSpaceIndex < 0 ? 0 : previousSpaceIndex + 1
      const end = nextSpaceIndex < 0 ? str.length : nextSpaceIndex
      const sub = str.substring(begin, end)

      setSelectedStartInd(begin)
      setSelectedWord(sub)
      return sub
    },
    [],
  )

  const onInputChangeLocal = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target
      const newValue = e.target.value

      // Handle textarea height
      if (newValue.length === 0) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
        setSelectedFiles([])
      } else {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }

      setInput(newValue)

      // PERFORMANCE OPTIMIZATION: Don't call parent's onInputChange during typing
      // The parent only needs to know the value when the message is sent
      // This prevents unnecessary re-renders of the entire ChatPane component tree
      // If you need the parent to track input for other reasons, consider debouncing
      // or only calling onInputChange on specific events (blur, submit, etc.)

      // Commented out to prevent re-renders on every keystroke:
      // if (onInputChange) {
      //   onInputChange(newValue)
      // }

      const selectionStart = e.target.selectionStart ?? -1
      const selectionEnd = e.target.selectionEnd ?? -1
      const currWord = getSelectedWord(newValue, selectionStart, selectionEnd)

      setCurrentWord(currWord)

      // Check if the user just typed '@'
      const lastChar = newValue.charAt(selectionStart - 1)

      // Handle '@' character
      if (lastChar === '@' && !atTyped) {
        setAtTyped(true)

        if (handleAddImages) {
          // Web mode: @ opens file picker for any file type
          // Store cursor position before removing @ (position where @ was typed)
          setAtCursorPosition(selectionStart - 1)

          // Remove the @ character
          const newValueWithoutAt =
            newValue.slice(0, selectionStart - 1) +
            newValue.slice(selectionStart)
          setInput(newValueWithoutAt)

          // Trigger file picker (accepts all file types)
          setTimeout(() => {
            document.getElementById('at-file-input')?.click()
          }, 0)
        } else {
          // VSCode mode: @ shows FileMenu (workspace file browser)
          if (currWord.startsWith('@')) {
            setShowFileMenu(true)
          }
        }
      } else if (lastChar !== '@') {
        // Reset the flag when not typing '@'
        setAtTyped(false)
      }

      if (!currWord.startsWith('@')) {
        setShowFileMenu(false)
      }

      // handle command menu visibility based on input starting with '/'
      if (newValue.startsWith('/')) {
        setShowCommandMenu(true)
      } else {
        setShowCommandMenu(false)
      }

      // handle command menu visibility based on input starting with '/'
      if (newValue.startsWith('/')) {
        setShowCommandMenu(true)
      } else {
        setShowCommandMenu(false)
      }
    },
    [getSelectedWord, fileInputRef, atTyped, setSelectedFiles, handleAddImages],
  )

  const getNewInput = useCallback(
    (fileName: string) => {
      return (
        input.slice(0, selectedStartInd) +
        fileName +
        input.slice(selectedStartInd + selectedWord.length) +
        ' '
      )
    },
    [input, selectedStartInd, selectedWord],
  )

  const handleFileMenuInputChange = useCallback((newInput: string) => {
    setInput(newInput)
    // PERFORMANCE: Don't notify parent during file menu interactions
    // if (onInputChange) {
    //   onInputChange(newInput)
    // }
    setCurrentWord('')
    setSelectedWord('')
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && handleAddImages) {
        // Directly call handleAddImages with the event
        handleAddImages(e)
        // reset the input value so the same file can be selected again
        e.target.value = ''
      }
    },
    [handleAddImages],
  )

  const handleAtFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && handleAddImages) {
        // Web mode only: Read file contents for REST API upload
        const fileArray = Array.from(files)

        // Insert file names into the input text as @'filename' at the stored cursor position
        const fileNames = fileArray.map(file => `@'${file.name}'`).join(' ')
        setInput(prev => {
          // Insert at the stored cursor position where @ was typed
          const before = prev.slice(0, atCursorPosition)
          const after = prev.slice(atCursorPosition)
          return before + fileNames + ' ' + after
        })

        // Read file contents and save to context
        fileArray.forEach(file => {
          const reader = new FileReader()
          reader.onload = event => {
            if (event.target?.result) {
              const content = event.target.result as ArrayBuffer
              const contentArray = new Uint8Array(content)

              const fileMeta = {
                name: file.name,
                path: file.name,
                content: contentArray, // Store Uint8Array for upload
                uploadedViaButton: false, // Mark as @ attachment, not button
              }

              // Add to context
              setSelectedFiles(prev => [...prev, fileMeta])
            }
          }

          reader.onerror = () => {
            console.error(`Error reading file: ${file.name}`)
          }

          reader.readAsArrayBuffer(file)
        })

        // Reset the input value so the same file can be selected again
        e.target.value = ''
      }

      // Reset atTyped flag to allow typing @ again
      setAtTyped(false)
    },
    [setSelectedFiles, handleAddImages, atCursorPosition],
  )

  const handleRemoveFile = useCallback(
    (index: number) => {
      // Remove the file from selectedFiles context
      setSelectedFiles(prev => {
        const buttonFiles = prev.filter(f => f.uploadedViaButton)
        const otherFiles = prev.filter(f => !f.uploadedViaButton)
        const updatedButtonFiles = buttonFiles.filter((_, i) => i !== index)
        return [...otherFiles, ...updatedButtonFiles]
      })

      // Reset the file input and increment key to force remount
      setFileUploaderKey(prev => prev + 1)
    },
    [setSelectedFiles],
  )

  const handleSend = useCallback(() => {
    if (isUploadingFiles) {
      console.log('Files are still uploading, please wait...')
      return
    }

    if (input.trim() !== '') {
      onSendMessage(input)
      setInput('')
      sendRef.current?.blur()
      setFileUploaderKey(prev => prev + 1)
      // Clear button-uploaded files from context
      setSelectedFiles(prev => prev.filter(f => !f.uploadedViaButton))
    }
  }, [input, isUploadingFiles, onSendMessage, setSelectedFiles])

  const onHandleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        setShowFileMenu(false)
        setShowCommandMenu(false)
        setIsNavigatingMenu(false)
      }

      // Handle Enter key for sending
      setIsNavigatingMenu(false)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setIsNavigatingMenu(true)
      }
    },
    [handleSend],
  )

  // OPTIMIZATION: Memoize button click handler
  const handleImageUploadClick = useCallback(() => {
    document.getElementById('image-upload-input')?.click()
  }, [])

  // OPTIMIZATION: Memoize send button disabled state
  const isSendDisabled = useMemo(() => {
    return input.trim() === '' || isUploadingFiles
  }, [input, isUploadingFiles])

  return (
    <div className='prompt-input-container'>
      <TextArea
        id='prompt-input'
        labelText=''
        placeholder={t('promptInput.placeholder')}
        disabled={fetching || showPorgSelection}
        value={input}
        onChange={onInputChangeLocal}
        onKeyDown={onHandleKeyDown}
        ref={setRefs}
      />

      <div className='prompt-actions'>
        <Button
          hasIconOnly
          kind='ghost'
          className={
            isSendDisabled ? 'sendButton sendButton-disabled' : 'sendButton'
          }
          onClick={isSendDisabled ? undefined : handleSend}
          iconDescription={
            isUploadingFiles
              ? t('promptInput.uploadingFiles')
              : t('promptInput.send')
          }
          disabled={isUploadingFiles}
          ref={sendRef}
        >
          {isSendDisabled ? <Send size='24' /> : <SendFilled size='24' />}
        </Button>

        {/* Hidden file input for @ symbol - accepts all file types (web mode only) */}
        {handleAddImages && (
          <input
            type='file'
            accept='*'
            multiple
            onChange={handleAtFileChange}
            style={{display: 'none'}}
            id='at-file-input'
          />
        )}

        {handleAddImages && (
          <div className='file-uploader-icon-wrapper'>
            <input
              key={fileUploaderKey}
              type='file'
              accept='.jpg,.png'
              multiple
              onChange={handleFileChange}
              style={{display: 'none'}}
              id='image-upload-input'
            />
            <Button
              kind='primary'
              size='sm'
              hasIconOnly
              iconDescription={t('promptInput.addImage')}
              onClick={handleImageUploadClick}
              className='file-upload-button'
            >
              <Image size={20} />
            </Button>
          </div>
        )}
      </div>

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className='uploaded-files-list'>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className='uploaded-file-item'
            >
              <span className='file-name'>{file.name}</span>
              <Button
                kind='ghost'
                size='sm'
                hasIconOnly
                iconDescription={t('promptInput.removeFile')}
                onClick={() => handleRemoveFile(index)}
                className='remove-file-button'
              >
                <Close size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className='prompt-menus'>
        {commands.length > 0 && (
          <CommandMenu
            commands={commands}
            input={input}
            menuRef={menuRef}
            onInputChange={setInput}
            showCommandOrParameterMenu={showCommandMenu}
            isNavigating={isNavigatingMenu}
            setIsNavigatingMenu={setIsNavigatingMenu}
          />
        )}

        {!fileInputRef && (
          <FileMenu
            currentWord={currentWord}
            getNewInput={getNewInput}
            menuRef={menuRef}
            onInputChange={handleFileMenuInputChange}
            setShowFileMenu={setShowFileMenu}
            showFileMenu={showFileMenu}
            isNavigating={isNavigatingMenu}
            fileProvider={fileProvider}
          />
        )}
      </div>
    </div>
  )
}

// Made with Bob
