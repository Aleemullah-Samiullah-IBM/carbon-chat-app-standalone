import {RefObject, useEffect, useRef, useState} from 'react'
import {InlineLoading} from '@carbon/react'
import {FileMeta} from '../../../types/FileData'
import {useMyContext, useInput} from '../../../contexts/ChatContext'
import {FileProvider} from '../../../interfaces/platform'

type FileMenuProps = {
  currentWord: string
  getNewInput: (input: string) => string
  menuRef: RefObject<HTMLDivElement | null>
  onInputChange: (e: string) => void
  setShowFileMenu: (show: boolean) => void
  showFileMenu: boolean
  isNavigating: boolean
  fileProvider: FileProvider
}

export const FileMenu = ({
  currentWord,
  getNewInput,
  menuRef,
  onInputChange,
  setShowFileMenu,
  showFileMenu,
  isNavigating,
  fileProvider,
}: FileMenuProps) => {
  const {setSelectedFiles} = useMyContext()
  const {inputRef} = useInput()

  const [files, setFiles] = useState<FileMeta[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileMeta[]>(files)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const debounceTimer = useRef<number | null>(null)
  const hasFetchedFiles = useRef(false) // make sure only fetch files x1

  // used for accessibility - up and down buttons navigation
  const filesRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (showFileMenu && isNavigating) {
      filesRefs.current[0]?.focus()
    }
  }, [showFileMenu, isNavigating])

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const message = event.data

      if (message.type === 'fetchFiles-success') {
        setFiles(message.value)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const filterFileMenu = (currentWord: string) => {
    const raw = currentWord.slice(1).replace(/(^['"]|['"]$)/g, '')
    const fileName = raw.toLowerCase()
    const filteredFiles = files.filter(f => {
      return f.path.toLowerCase().includes(fileName)
    })
    return filteredFiles
  }

  useEffect(() => {
    let isMounted = true

    const fetchFiles = async () => {
      if (currentWord.startsWith('@') && !hasFetchedFiles.current) {
        try {
          const files: FileMeta[] = await fileProvider.getFileList()

          if (isMounted) {
            setFiles(files)
            hasFetchedFiles.current = true
          }
        } catch (err) {
          console.error('Failed to fetch files:', err)
        }
      }
    }

    fetchFiles()

    if (currentWord.startsWith('@')) {
      setIsTyping(true)

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = window.setTimeout(() => {
        setIsTyping(false)

        if (files.length === 0 && fileProvider.notifyNoFilesError) {
          fileProvider.notifyNoFilesError(
            'No files found in workspace. Please select a new workspace by going to File > Open Folder.',
          )
        } else {
          setFilteredFiles(filterFileMenu(currentWord))
        }
      }, 1500)
    }

    return () => {
      isMounted = false
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [currentWord, files])

  // Reset hasFetchedFiles when the file menu is closed
  useEffect(() => {
    if (!showFileMenu) {
      hasFetchedFiles.current = false
    }
  }, [showFileMenu])

  async function handleFileMenuSelection(fileMeta: FileMeta) {
    setShowFileMenu(false)
    const [_, ...filepath] = fileMeta.path.split('/')
    const quotedPath = filepath.join('/')
    const formattedFileName = `@'${quotedPath}'`

    const newInput = getNewInput(formattedFileName)
    onInputChange(newInput)

    // save file metadata to make POST /attachments call later
    setSelectedFiles((prevSelectedFiles: FileMeta[]) => {
      const prevFilepaths = prevSelectedFiles.map(f => f.path)
      if (!prevFilepaths.includes(fileMeta.path)) {
        return [...prevSelectedFiles, fileMeta]
      }
      return prevSelectedFiles
    })

    if (fileProvider.saveSelectedFilePath) {
      try {
        await fileProvider.saveSelectedFilePath(fileMeta)
      } catch (err) {
        console.error('Failed to save file path:', err)
      }
    }

    inputRef.current?.focus()
  }

  if (!showFileMenu) {
    return null
  }

  return (
    <div
      className='file-menu'
      ref={menuRef}
    >
      <div className='file-menu-total'>
        {isTyping && <InlineLoading iconDescription='Loading data...' />}
        <span>
          {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}{' '}
          found
        </span>
      </div>

      {filteredFiles.map((file, index) => (
        <div
          className='file-menu-items'
          key={file.path}
          aria-label={file.path}
          ref={el => {
            filesRefs.current[index] = el
          }}
          onClick={() => handleFileMenuSelection(file)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFileMenuSelection(file)
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              const next = filesRefs.current[index + 1]
              if (next) next.focus()
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              const prev = filesRefs.current[index - 1]
              if (prev) prev.focus()
            } else {
              setShowFileMenu(false)
              inputRef.current?.focus()
            }
          }}
          role='menuitem'
          tabIndex={0}
        >
          <div className='file-menu-name'>{file.name}</div>
          <div className='file-menu-path'>{file.path} </div>
        </div>
      ))}
    </div>
  )
}
