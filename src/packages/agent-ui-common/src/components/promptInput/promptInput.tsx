import React, {JSX, useEffect, useRef, useState} from 'react'
import {Button, FeatureFlags, FileUploader, TextArea} from '@carbon/react'
import {Send, SendFilled, Image, Close} from '@carbon/icons-react'
import {Command} from '../../types/Command'
import {useMyContext, useInput} from '../../contexts/ChatContext'
import {FileMenu} from './fileMenu/fileMenu'
import {CommandMenu} from './commandMenu/commandMenu'
import {FileProvider} from '../../interfaces/platform'

import './promptInput.scss'

interface PromptInputProps {
  commands: Command[]
  fetching: boolean
  onSendMessage: (message: string) => void
  fileProvider: FileProvider
  fileInputRef?: any // Use any type to avoid TypeScript errors
  onInputChange?: (value: string) => void // Callback for input change
  value?: string // Controlled input value
  handleAddImages?: any
  isUploadingFiles?: boolean // Track if files are being uploaded
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
  const {setSelectedFiles, showPorgSelection} = useMyContext()
  const [input, setInput] = useState<string>(value ?? '')
  const [currentWord, setCurrentWord] = useState<string>('')
  const [showFileMenu, setShowFileMenu] = useState<boolean>(false)
  const [showCommandMenu, setShowCommandMenu] = useState<boolean>(false)
  const [selectedStartInd, setSelectedStartInd] = useState<number>(0)
  const [selectedWord, setSelectedWord] = useState<string>('')

  // Flag to prevent opening file explorer multiple times
  const [atTyped, setAtTyped] = useState<boolean>(false)

  const sendRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const {registerInputHandler, inputRef} = useInput()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // since Carbon FileUploader doesn't allow for ref,
  // need to manually trigger a component refresh
  const [fileUploaderKey, setFileUploaderKey] = useState<number>(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const setRefs = (el: HTMLTextAreaElement) => {
    inputRef.current = el // keep original ref
    textareaRef.current = el // add new ref for ResizeObserver
  }

  // used for accessibility - up and down buttons navigation
  const [isNavigatingMenu, setIsNavigatingMenu] = useState<boolean>(false)

  // Update internal input when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInput(value)

      // update command menu visibility when value prop changes
      if (value.startsWith('/')) {
        setShowCommandMenu(true)
      } else {
        setShowCommandMenu(false)
      }
    }
  }, [value])

  useEffect(() => {
    inputRef.current?.focus()
    registerInputHandler(setInput)
  }, [])

  useEffect(() => {
    if (!textareaRef.current) return

    const observer = new ResizeObserver(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        const placeholderHeight = textareaRef.current.scrollHeight
        textareaRef.current.style.height = `${placeholderHeight}px`
      }
    })

    observer.observe(textareaRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // refocus the inputRef when API call completed
    if (!fetching) {
      inputRef.current?.focus()
    }
  }, [fetching])

  useEffect(() => {
    // if user clicks outside menu
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
  }, [menuRef])

  const getSelectedWord = (str: any, selStart: number, selEnd: number) => {
    const previousSpaceIndex = str.lastIndexOf(' ', selStart - 1)
    const nextSpaceIndex = str.indexOf(' ', selEnd)
    const begin = previousSpaceIndex < 0 ? 0 : previousSpaceIndex + 1
    const end = nextSpaceIndex < 0 ? str.length : nextSpaceIndex
    const sub = str.substring(begin, end)
    setSelectedStartInd(begin)
    setSelectedWord(sub)

    return sub
  }

  const onInputChangeLocal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    const value = e.target.value

    if (value.length === 0) {
      // reset to placeholder height or a fixed min height
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px` // placeholder height
      setSelectedFiles([])
    } else {
      textarea.style.height = textareaRef.current?.style.height ?? 'auto' // reset
      textarea.style.height = `${textarea.scrollHeight}px` // grow
    }

    setInput(value)

    // Call parent's onInputChange if provided
    if (onInputChange) {
      onInputChange(value)
    }

    let selectionStart = e.target.selectionStart
    let selectionEnd = e.target.selectionEnd
    let currWord = getSelectedWord(
      value,
      selectionStart ?? -1,
      selectionEnd ?? -1,
    )

    setCurrentWord(currWord)

    // Check if the user just typed '@'
    const lastChar = value.charAt(selectionStart - 1)

    // Only handle '@' character if fileInputRef is not provided (to avoid double handling)
    if (!fileInputRef && lastChar === '@' && !atTyped) {
      setAtTyped(true)

      // Show the file menu for the built-in file selector
      if (currWord.startsWith('@')) {
        setShowFileMenu(true)
      }
    } else if (lastChar !== '@') {
      // Reset the flag when not typing '@'
      setAtTyped(false)
    }

    if (!currWord.startsWith('@')) {
      setShowFileMenu(false)
    }

    // handle command menu visibility based on input starting with '/'
    if (value.startsWith('/')) {
      setShowCommandMenu(true)
    } else {
      setShowCommandMenu(false)
    }
  }

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setShowFileMenu(false)
      setShowCommandMenu(false)
      setIsNavigatingMenu(false)
    }

    onKeyDown(e)
  }

  // const onHandleInputFile = (newInput: string) => {
  //   console.log('onHandleInputFile', newInput)
  // }

  const getNewInput = (fileName: string) => {
    return (
      input.slice(0, selectedStartInd) +
      fileName +
      input.slice(selectedStartInd + selectedWord.length) +
      ' '
    )
  }

  const handleFileMenuInputChange = (newInput: string) => {
    setInput(newInput)
    // Also call parent's onInputChange if provided
    if (onInputChange) {
      onInputChange(newInput)
    }
    // Reset currentWord and selectedWord to prevent stale state
    setCurrentWord('')
    setSelectedWord('')
  }

  const notifyFilesChanged = (files: File[]) => {
    if (handleAddImages) {
      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))

      const fileInput = document.getElementById(
        'image-upload-input',
      ) as HTMLInputElement

      if (fileInput) {
        // Use configurable: true so it can be redefined on subsequent calls
        Object.defineProperty(fileInput, 'files', {
          value: dataTransfer.files,
          writable: false,
          configurable: true,
        })

        const syntheticEvent = {
          target: fileInput,
          currentTarget: fileInput,
        } as React.ChangeEvent<HTMLInputElement>

        handleAddImages(syntheticEvent)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      // Use functional update to always work from latest state
      setUploadedFiles(prev => {
        const newFiles = [...prev, ...fileArray]
        notifyFilesChanged(newFiles)
        return newFiles
      })

      // Reset the input value so the same file can be selected again
      e.target.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    // Use functional update to always work from latest state
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index)
      notifyFilesChanged(newFiles)
      return newFiles
    })

    // Reset the file input
    const fileInput = document.getElementById(
      'image-upload-input',
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSend = () => {
    // Don't send if files are still uploading
    if (isUploadingFiles) {
      console.log('Files are still uploading, please wait...')
      return
    }

    if (input.trim() !== '') {
      onSendMessage(input)
      setInput('')
      sendRef.current?.blur()

      // clear the FileUploader by forcing a remount with a new key
      setFileUploaderKey(prev => prev + 1)
      setUploadedFiles([])
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setIsNavigatingMenu(false)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setIsNavigatingMenu(true)
    }
  }

  return (
    <div className='prompt-input-container'>
      <TextArea
        id='prompt-input'
        labelText=''
        placeholder={`How can I help you?\n\n💡 Pro Tip: The more specific you are, the better I can help!\nUse @ to add files, use / to list commands`}
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
            input.trim() === '' || isUploadingFiles
              ? 'sendButton sendButton-disabled'
              : 'sendButton'
          }
          onClick={
            input.trim() !== '' && !isUploadingFiles
              ? () => handleSend()
              : undefined
          }
          iconDescription={isUploadingFiles ? 'Uploading files...' : 'Send'}
          disabled={isUploadingFiles}
          ref={sendRef}
        >
          {input.trim() === '' || isUploadingFiles ? (
            <Send size='24' />
          ) : (
            <SendFilled size='24' />
          )}
        </Button>

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
              iconDescription='Add image'
              onClick={() =>
                document.getElementById('image-upload-input')?.click()
              }
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
                iconDescription='Remove file'
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
        <CommandMenu
          commands={commands}
          input={input}
          menuRef={menuRef}
          onInputChange={setInput}
          showCommandOrParameterMenu={showCommandMenu}
          isNavigating={isNavigatingMenu}
          setIsNavigatingMenu={setIsNavigatingMenu}
          // onHandleInputFile={onHandleInputFile}
        />

        {/* Only show FileMenu if fileInputRef is not provided */}
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
