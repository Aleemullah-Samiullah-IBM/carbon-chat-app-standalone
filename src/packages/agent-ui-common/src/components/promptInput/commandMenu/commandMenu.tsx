import {type RefObject, useEffect, useRef, useState} from 'react'
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
  // onHandleInputFile: (input: string) => void
}

// handle slash commands which come from the backend
// picking a command from the menu will show you the required and optional parameters to pick from
export const CommandMenu = ({
  commands: initialCommands,
  input,
  menuRef,
  onInputChange,
  showCommandOrParameterMenu,
  isNavigating,
  setIsNavigatingMenu,
}: // onHandleInputFile,
CommandMenuProps) => {
  const [commands, setCommands] = useState<TransformedCommand[]>([])
  const [filteredCommands, setFilteredCommands] = useState<
    TransformedCommand[]
  >([])
  const [filteredParameters, setFilteredParameters] = useState<Parameter[]>([])
  const [selectedCommand, setSelectedCommand] =
    useState<TransformedCommand | null>(null)

  const [menuState, setMenuState] = useState({
    showCommandMenu: false,
    showParameterMenu: false,
    showErrorMenu: false,
  })

  const {inputRef} = useInput()
  const prevInputRef = useRef(input)

  // used for accessibility - up and down buttons navigation
  const commandsRefs = useRef<(HTMLDivElement | null)[]>([])
  const parametersRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (menuState.showCommandMenu && isNavigating) {
      // delay focus til after refs are mounted
      requestAnimationFrame(() => {
        commandsRefs.current[0]?.focus()
      })
    }
  }, [filteredCommands, menuState.showCommandMenu, isNavigating])

  useEffect(() => {
    if (menuState.showParameterMenu && isNavigating) {
      // delay focus til after refs are mounted
      requestAnimationFrame(() => {
        parametersRefs.current[0]?.focus()
      })
    }
  }, [filteredParameters, menuState.showParameterMenu, isNavigating])

  useEffect(() => {
    const transformedCommands = transformCommands(initialCommands)
    setCommands(transformedCommands)

    // Update filtered commands when commands are loaded and menu is showing
    if (menuState.showCommandMenu && input.startsWith('/')) {
      setFilteredCommands(transformedCommands)
    }
  }, [initialCommands])

  useEffect(() => {
    const hasSpaceAfterSlash = /^\/\s+$/
    const isCompleteCommand = commands.some(command =>
      input.toLowerCase().includes(command.name.toLowerCase()),
    ) // check if input matches a complete slash command

    if (prevInputRef.current !== input) {
      prevInputRef.current = input

      // show hide menu: if input is empty or only has a space after slash
      if (input.length === 0 || hasSpaceAfterSlash.test(input)) {
        setSelectedCommand(null)
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: false,
          showParameterMenu: false,
        }))

        return
      }

      // show loading message when no commands are available yet
      if (input.startsWith('/') && commands.length === 0) {
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: true,
          showParameterMenu: false,
          showErrorMenu: false,
        }))
        return
      }

      // show command menu: if no complete command matched
      // (for like if user copy+paste a command or something)
      if (input.startsWith('/') && !isCompleteCommand) {
        setSelectedCommand(null)
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: true,
          showParameterMenu: false,
          showErrorMenu: false,
        }))

        filterCommands()

        return
      }

      // show parameter menu: when full command matched and selectedCommand defined
      if (isCompleteCommand && selectedCommand) {
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: false,
          showParameterMenu: true,
        }))

        filterParameters()
        return
      }

      // show command menu: when input starts with '/'
      if (input.startsWith('/') && input.length === 1) {
        setMenuState(prev => ({
          ...prev,
          showCommandMenu: true,
          showParameterMenu: false,
          showErrorMenu: false,
        }))

        setFilteredCommands(commands)
        return
      }

      if (menuState.showCommandMenu) {
        filterCommands()
      }
    }
  }, [input, commands, selectedCommand, menuState])

  const handleSelectCommand = (command: TransformedCommand) => {
    // console.log('handleSelectCommand', command)

    onInputChange(command.name)
    setSelectedCommand(command)
    setFilteredParameters(command.arguments)

    setMenuState(prev => ({
      ...prev,
      showCommandMenu: false,
      showParameterMenu: true,
    }))

    inputRef.current?.focus()
    setIsNavigatingMenu(false)
  }

  const handleSelectParameter = (param: Parameter) => {
    // console.log('handleSelectParameter', selectedCommand, param)

    if (selectedCommand) {
      // need trim() to sanitize input because keyboard navigation can introduce a newline
      let newInput = `${input.trim()} ${param.name}:`
      if (param.type === 'file') {
        newInput += ' '

        // special handle for slash command + file
        // onHandleInputFile(newInput)
      }

      onInputChange(newInput)

      setFilteredParameters(
        filteredParameters.filter(
          command => !command.name.toLowerCase().includes(param.name),
        ),
      )
    }

    inputRef.current?.focus()
    setIsNavigatingMenu(false)
  }

  function transformCommands(commands: Command[]): TransformedCommand[] {
    if (!Array.isArray(commands)) {
      return [] // return empty array if commands are undefined or not an array
    }
    commands.sort((a, b) => a.name.localeCompare(b.name))
    return commands.map(command => {
      return {
        name: `/${command.name}`,
        arguments: command.parameters,
        description: `${command.description}`,
      }
    })
  }

  function filterCommands() {
    // filter command based on user input
    const query = input.split(' ')[0].slice(1).toLowerCase()
    setFilteredCommands(
      commands.filter(command => command.name.toLowerCase().includes(query)),
    )
  }

  function filterParameters() {
    if (selectedCommand) {
      // filter parameters for selectedCommand based on input
      const updatedFilteredParameters = selectedCommand.arguments.filter(
        param => !input.toLowerCase().includes(`${param.name.toLowerCase()}:`),
      )
      setFilteredParameters(updatedFilteredParameters)
    }
  }

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
          {filteredCommands.length === 0 ? (
            <div className='commands-menu-items'>
              <p className='description'>Loading commands...</p>
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                className='commands-menu-items'
                key={command.name}
                aria-label={command.name}
                // ref={el => (commandsRefs.current[index] = el)}
                ref={el => {
                  commandsRefs.current[index] = el
                }}
                onClick={() => handleSelectCommand(command)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectCommand(command)
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    const next = commandsRefs.current[index + 1]
                    if (next) next.focus()
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    const prev = commandsRefs.current[index - 1]
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
                }}
                role='menuitem'
                tabIndex={0}
              >
                {command.name}
                <p className='description'>{command.description}</p>
              </div>
            ))
          )}
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
                commandsRefs.current[index] = el
              }}
              onClick={() => handleSelectParameter(param)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectParameter(param)
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const next = parametersRefs.current[index + 1]
                  if (next) next.focus()
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  const prev = parametersRefs.current[index - 1]
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
              }}
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
}
