import {
  type RefObject,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react'
import {Tag} from '@carbon/react'
import {useInput} from '../../../contexts/ChatContext'
import type {
  Command,
  Parameter,
  TransformedCommand,
} from '../../../types/Command'

type CommandMenuProps = {
  commands: Command[]
  input: string
  menuRef: RefObject<HTMLDivElement | null>
  onInputChange: (e: string) => void
  showCommandOrParameterMenu: boolean
  isNavigating: boolean
  setIsNavigatingMenu: (e: boolean) => void
}

// Memoized component to prevent unnecessary re-renders
export const CommandMenu = memo(
  ({
    commands: initialCommands,
    input,
    menuRef,
    onInputChange,
    showCommandOrParameterMenu,
    isNavigating,
    setIsNavigatingMenu,
  }: CommandMenuProps) => {
    const [selectedCommand, setSelectedCommand] =
      useState<TransformedCommand | null>(null)
    const [menuState, setMenuState] = useState({
      showCommandMenu: false,
      showParameterMenu: false,
      showErrorMenu: false,
    })

    const {inputRef} = useInput()
    const prevInputRef = useRef(input)

    // Refs for accessibility navigation
    const commandsRefs = useRef<(HTMLDivElement | null)[]>([])
    const parametersRefs = useRef<(HTMLDivElement | null)[]>([])

    // OPTIMIZATION: Memoize transformed commands to avoid re-sorting on every render
    const commands = useMemo(() => {
      if (!Array.isArray(initialCommands)) {
        return []
      }
      // Sort once and memoize
      const sorted = [...initialCommands].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
      return sorted.map(command => ({
        name: `/${command.name}`,
        arguments: command.parameters,
        description: `${command.description}`,
      }))
    }, [initialCommands])

    // OPTIMIZATION: Memoize filtered commands based on input
    const filteredCommands = useMemo(() => {
      if (!input.startsWith('/')) return []
      const query = input.split(' ')[0].slice(1).toLowerCase()
      return commands.filter(command =>
        command.name.toLowerCase().includes(query),
      )
    }, [input, commands])

    // OPTIMIZATION: Memoize filtered parameters
    const filteredParameters = useMemo(() => {
      if (!selectedCommand) return []
      return selectedCommand.arguments.filter(
        param => !input.toLowerCase().includes(`${param.name.toLowerCase()}:`),
      )
    }, [input, selectedCommand])

    // OPTIMIZATION: Check if input matches a complete command (memoized)
    const isCompleteCommand = useMemo(() => {
      return commands.some(command =>
        input.toLowerCase().includes(command.name.toLowerCase()),
      )
    }, [input, commands])

    // OPTIMIZATION: Split useEffect into focused effects

    // Effect 1: Handle command menu focus for accessibility
    useEffect(() => {
      if (menuState.showCommandMenu && isNavigating) {
        requestAnimationFrame(() => {
          commandsRefs.current[0]?.focus()
        })
      }
    }, [menuState.showCommandMenu, isNavigating])

    // Effect 2: Handle parameter menu focus for accessibility
    useEffect(() => {
      if (menuState.showParameterMenu && isNavigating) {
        requestAnimationFrame(() => {
          parametersRefs.current[0]?.focus()
        })
      }
    }, [menuState.showParameterMenu, isNavigating])

    // Effect 3: Main menu state logic (optimized)
    useEffect(() => {
      // Only process if input actually changed
      if (prevInputRef.current === input) return
      prevInputRef.current = input

      const hasSpaceAfterSlash = /^\/\s+$/

      // Early returns for simple cases
      if (input.length === 0 || hasSpaceAfterSlash.test(input)) {
        setSelectedCommand(null)
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: false,
          showParameterMenu: false,
        }))
        return
      }

      // Show error when no commands available
      if (input.startsWith('/') && commands.length === 0) {
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: false,
          showParameterMenu: false,
          showErrorMenu: true,
        }))
        return
      }

      // Show command menu when typing slash command
      if (input.startsWith('/') && !isCompleteCommand) {
        setSelectedCommand(null)
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: true,
          showParameterMenu: false,
          showErrorMenu: false,
        }))
        return
      }

      // Show parameter menu when command is complete
      if (isCompleteCommand && selectedCommand) {
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: false,
          showParameterMenu: true,
        }))
        return
      }

      // Show command menu for single slash
      if (input.startsWith('/') && input.length === 1) {
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: true,
          showParameterMenu: false,
          showErrorMenu: false,
        }))
      }
    }, [input, commands.length, isCompleteCommand, selectedCommand])

    // OPTIMIZATION: Use useCallback for event handlers
    const handleSelectCommand = useCallback(
      (command: TransformedCommand) => {
        onInputChange(command.name)
        setSelectedCommand(command)

        setMenuState(prev => ({
          ...prev,
          showCommandMenu: false,
          showParameterMenu: true,
        }))

        inputRef.current?.focus()
        setIsNavigatingMenu(false)
      },
      [onInputChange, inputRef, setIsNavigatingMenu],
    )

    const handleSelectParameter = useCallback(
      (param: Parameter) => {
        if (selectedCommand) {
          let newInput = `${input.trim()} ${param.name}:`
          if (param.type === 'file') {
            newInput += ' '
          }
          onInputChange(newInput)
        }

        inputRef.current?.focus()
        setIsNavigatingMenu(false)
      },
      [input, selectedCommand, onInputChange, inputRef, setIsNavigatingMenu],
    )

    // OPTIMIZATION: Memoize keyboard handler
    const createKeyDownHandler = useCallback(
      (type: 'command' | 'parameter', index: number, onSelect: () => void) => {
        return (e: React.KeyboardEvent) => {
          const refs = type === 'command' ? commandsRefs : parametersRefs

          if (e.key === 'Enter' || e.key === ' ') {
            onSelect()
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            const next = refs.current[index + 1]
            if (next) next.focus()
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prev = refs.current[index - 1]
            if (prev) prev.focus()
          } else if (e.key === 'Escape') {
            setMenuState(prev => ({
              ...prev,
              showCommandMenu: false,
              showParameterMenu: false,
              showErrorMenu: false,
            }))
            inputRef.current?.focus()
          }
        }
      },
      [inputRef],
    )

    if (!showCommandOrParameterMenu) {
      return null
    }

    return (
      <>
        {menuState.showErrorMenu && (
          <div
            className='commands-menu'
            ref={menuRef}
          >
            <div className='commands-menu-items'>
              <p className='description'>
                Commands are not available. Please wait or try again later.
              </p>
            </div>
          </div>
        )}

        {menuState.showCommandMenu && (
          <div
            className='commands-menu'
            ref={menuRef}
          >
            {filteredCommands.map((command, index) => (
              <div
                className='commands-menu-items'
                key={command.name}
                aria-label={command.name}
                ref={el => {
                  commandsRefs.current[index] = el
                }}
                onClick={() => handleSelectCommand(command)}
                onKeyDown={createKeyDownHandler('command', index, () =>
                  handleSelectCommand(command),
                )}
                role='menuitem'
                tabIndex={0}
              >
                {command.name}
                <p className='description'>{command.description}</p>
              </div>
            ))}
          </div>
        )}

        {menuState.showParameterMenu && (
          <div
            className='parameter-menu'
            ref={menuRef}
          >
            {filteredParameters.map((param, index) => (
              <div
                className='parameter-menu-items'
                key={param.name}
                aria-label={param.name}
                ref={el => {
                  parametersRefs.current[index] = el
                }}
                onClick={() => handleSelectParameter(param)}
                onKeyDown={createKeyDownHandler('parameter', index, () =>
                  handleSelectParameter(param),
                )}
                role='menuitem'
                tabIndex={0}
              >
                {param.required ? (
                  <Tag
                    size='sm'
                    type='blue'
                  >
                    Required
                  </Tag>
                ) : (
                  <Tag
                    size='sm'
                    type='gray'
                  >
                    Optional
                  </Tag>
                )}
                {param.name}:
              </div>
            ))}
          </div>
        )}
      </>
    )
  },
)

CommandMenu.displayName = 'CommandMenu'
