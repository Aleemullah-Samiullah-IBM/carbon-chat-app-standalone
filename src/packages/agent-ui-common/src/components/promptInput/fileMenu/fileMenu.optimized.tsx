import {
  RefObject,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react'
import {InlineLoading} from '@carbon/react'
import {FileMeta} from '../../../types/FileData'
import {useMyContext, useInput} from '../../../contexts/ChatContext'
import {FileProvider} from '../../../interfaces/platform'
import {useDebounce} from '../../../hooks/useDebounce'

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

export const FileMenu = memo(
  ({
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
    const hasFetchedFiles = useRef(false) // make sure only fetch files x1

    // used for accessibility - up and down buttons navigation
    const filesRefs = useRef<(HTMLDivElement | null)[]>([])

    const debouncedCurrentWord = useDebounce(currentWord, 300)
    const [isTyping, setIsTyping] = useState(false)

    const filteredFiles = useMemo(() => {
      if (!debouncedCurrentWord.startsWith('@')) return []

      const raw = debouncedCurrentWord.slice(1).replace(/(^['"]|['"]$)/g, '')
      const fileName = raw.toLowerCase()

      return files.filter(f => f.path.toLowerCase().includes(fileName))
    }, [debouncedCurrentWord, files])

    // Effect: Handle accessibility focus
    useEffect(() => {
      if (showFileMenu && isNavigating && filesRefs.current[0]) {
        filesRefs.current[0].focus()
      }
    }, [showFileMenu, isNavigating])

    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
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

    useEffect(() => {
      let isMounted = true

      const fetchFiles = async () => {
        if (currentWord.startsWith('@') && !hasFetchedFiles.current) {
          try {
            const fetchedFiles: FileMeta[] = await fileProvider.getFileList()

            if (isMounted) {
              setFiles(fetchedFiles)
              hasFetchedFiles.current = true
            }
          } catch (err) {
            console.error('Failed to fetch files:', err)
          }
        }
      }

      fetchFiles()

      return () => {
        isMounted = false
      }
    }, [currentWord, fileProvider])

    useEffect(() => {
      if (currentWord.startsWith('@')) {
        setIsTyping(true)

        // Wait for debounce to complete
        const timer = setTimeout(() => {
          setIsTyping(false)

          if (files.length === 0 && fileProvider.notifyNoFilesError) {
            fileProvider.notifyNoFilesError(
              'No files found in workspace. Please select a new workspace by going to File > Open Folder.',
            )
          }
        }, 350) // Slightly longer than debounce to ensure it completes

        return () => clearTimeout(timer)
      } else {
        setIsTyping(false)
      }
    }, [currentWord, files.length, fileProvider])

    useEffect(() => {
      if (!showFileMenu) {
        hasFetchedFiles.current = false
      }
    }, [showFileMenu])

    const handleFileMenuSelection = useCallback(
      async (fileMeta: FileMeta) => {
        setShowFileMenu(false)

        const [_, ...filepath] = fileMeta.path.split('/')
        const quotedPath = filepath.join('/')
        const formattedFileName = `@'${quotedPath}'`

        const newInput = getNewInput(formattedFileName)
        onInputChange(newInput)

        // Save file metadata
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
      },
      [
        getNewInput,
        onInputChange,
        setSelectedFiles,
        fileProvider,
        inputRef,
        setShowFileMenu,
      ],
    )

    const keyDownHandler = useCallback(
      (file: FileMeta, index: number) => {
        return (e: React.KeyboardEvent) => {
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
        }
      },
      [handleFileMenuSelection, setShowFileMenu, inputRef],
    )

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
            {filteredFiles.length}{' '}
            {filteredFiles.length === 1 ? 'file' : 'files'} found
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
            onKeyDown={keyDownHandler(file, index)}
            role='menuitem'
            tabIndex={0}
          >
            <div className='file-menu-name'>{file.name}</div>
            <div className='file-menu-path'>{file.path}</div>
          </div>
        ))}
      </div>
    )
  },
)

FileMenu.displayName = 'FileMenu'
