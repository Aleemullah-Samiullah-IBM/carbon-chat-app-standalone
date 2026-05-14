import {useMyContext} from '../../../contexts/ChatContext'
import cx from 'classnames'
import {
  useState,
  useEffect,
  useReducer,
  useRef,
  ChangeEvent,
  useLayoutEffect,
} from 'react'
import {
  Button,
  Form,
  FormGroup,
  IconButton,
  InlineNotification,
  TextInput,
  // ContentSwitcher,
  // IconSwitch,
  TextArea,
  Theme,
} from '@carbon/react'
import {
  CloseLarge,
  SubtractAlt /*RequestQuote, Code*/,
} from '@carbon/react/icons'

import {InformationItem, PlanItem} from '../../../types'
import {set} from 'lodash/fp'
import _ from 'lodash'
import yaml from 'js-yaml'

import './editPlanPage.scss'

type EditPlanPageProps = {
  isDarkTheme: boolean
  setIsEditPage: (isEditPage: boolean) => void
  frontendClientType?: string
}

interface State {
  toolcalls: PlanItem[]
}

type Action =
  | {type: 'SET_TOOLCALLS'; payload: PlanItem[]}
  | {
      type: 'CHANGE_TEXTAREA_INPUT'
      payload: {index: number; arg: Record<string, any>}
    }
  | {
      type: 'CHANGE_ARG_INPUT'
      payload: {index: number; field: string; value: string}
    }
  | {type: 'SELECT_ALL_CHECKBOXES'}
  | {type: 'SET_OVERRIDE_FLAG'}
  | {
      type: 'DELETE_PLAN'
      payload: {rowIndex: number}
    }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TOOLCALLS':
      return {
        ...state,
        toolcalls: action.payload,
      }

    case 'CHANGE_TEXTAREA_INPUT': {
      const {index, arg} = action.payload
      return {
        ...state,
        toolcalls: state.toolcalls?.map((request, i) => {
          if (i === index) {
            return {...request, arguments: arg}
          }
          return request
        }),
      }
    }

    case 'CHANGE_ARG_INPUT': {
      const {index: argIndex, field: argField, value: argValue} = action.payload
      const lodashPath = argField.replace(/^\/+/, '').replace(/\//g, '.')
      const formattedValue = argValue === 'null' ? null : argValue
      return {
        ...state,
        toolcalls: state.toolcalls?.map((request, i) =>
          i === argIndex
            ? {
                ...request,
                arguments: {
                  ...request.arguments,
                  ...set(lodashPath, formattedValue, request.arguments),
                },
              }
            : request,
        ),
      }
    }

    case 'DELETE_PLAN': {
      const {rowIndex} = action.payload
      return {
        ...state,
        toolcalls: [
          ...state.toolcalls.slice(0, rowIndex),
          ...state.toolcalls.slice(rowIndex + 1),
        ],
      }
    }

    default:
      throw new Error('Unhandled toolcalls action type')
  }
}

const EditPlanPage = (props: EditPlanPageProps) => {
  const initialState: State = {
    toolcalls: [],
  }

  const [{toolcalls}, dispatch] = useReducer(reducer, initialState)
  const originalExecutedRef = useRef<PlanItem[]>([])
  const originalPlannedRef = useRef<PlanItem[]>([])
  const [disableDelete, setDisableDelete] = useState<boolean>(false)
  const [cursor, setCursor] = useState<number | null>(null)
  const ref = useRef<HTMLTextAreaElement | null>(null)
  const [formMode, setFormMode] = useState(true)
  const {plan, setPlan} = useMyContext()
  const codeViewEnabled = false

  useEffect(() => {
    console.log('toolcall useeffect', plan, JSON.stringify(plan, null, 2))

    if (plan?.planned_toolcalls) {
      dispatch({type: 'SET_TOOLCALLS', payload: plan.planned_toolcalls})

      // store original toolcall values
      originalExecutedRef.current = plan.executed_toolcalls || []
      originalPlannedRef.current = plan.planned_toolcalls || []
    }
  }, [])

  useEffect(() => {
    console.log(
      'toolcall changed',
      JSON.stringify(toolcalls),
      originalPlannedRef.current,
    )

    if (toolcalls) {
      setDisableDelete(toolcalls.length <= 1)
    }

    // Update state with the new values
    setPlan({
      executed_toolcalls: originalExecutedRef.current,
      planned_toolcalls: toolcalls,
    })
  }, [toolcalls])

  useLayoutEffect(() => {
    const input = ref.current
    if (input) input.setSelectionRange(cursor, cursor)
  }, [ref.current?.value])

  const handleArgsInputChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    console.log('handleArgsInputChange', index, field, value)
    dispatch({type: 'CHANGE_ARG_INPUT', payload: {index, field, value}})
  }

  const handleTextAreaChange = (index: number, value: any) => {
    // setTextAreaValue(value)
    const arg: any = yaml.load(value)
    console.log('handleTextAreaChange', arg)
    dispatch({type: 'CHANGE_TEXTAREA_INPUT', payload: {index, arg}})
  }

  const handleCancelEditPlan = () => {
    // reset requests
    console.log('Cancel plan ', JSON.stringify(originalPlannedRef.current))
    dispatch({type: 'SET_TOOLCALLS', payload: originalPlannedRef.current})
    setPlan({
      executed_toolcalls: originalExecutedRef.current,
      planned_toolcalls: originalPlannedRef.current,
    })
    // close modal
    props.setIsEditPage(false)
  }

  const handleSave = () => {
    console.log('handleSave ', JSON.stringify(plan?.planned_toolcalls))
    if (plan?.planned_toolcalls) {
      dispatch({type: 'SET_TOOLCALLS', payload: plan.planned_toolcalls})

      // store new toolcall values
      originalExecutedRef.current = plan.executed_toolcalls || []
      originalPlannedRef.current = plan.planned_toolcalls || []
    }

    // close modal
    props.setIsEditPage(false)
  }

  const deletePlanItem = (index: number) => {
    console.log('deletePlanItem', index)
    dispatch({type: 'DELETE_PLAN', payload: {rowIndex: index}})
  }

  const editPlanClass = cx({
    'edit-plan-settings-container bx--grid': true,
    // 'modal-dark-mode': props.isDarkTheme,
  })

  const disableSaveButton = () => {
    let formInvalid = false
    let formChanged = false
    const plannedToolcalls = plan?.planned_toolcalls || []
    for (let toolcall of plannedToolcalls) {
      const informationItems = toolcall?.information_items || []
      const originalToolCall = originalPlannedRef.current?.find(
        oToolCall => oToolCall.name === toolcall.name,
      )
      for (let item of informationItems) {
        const lodashPath = item.input_field
          .replace(/^\/+/, '')
          .replace(/\//g, '.')
        const value = _.get(toolcall.arguments, lodashPath, '')
        const originalValue = _.get(originalToolCall?.arguments, lodashPath, '')
        if (item.required === true && value === '') {
          formInvalid = true
        } else if (value !== originalValue) {
          formChanged = true
        }
      }
    }
    return formInvalid || !formChanged
  }

  const getLineHeightForTextarea = (src: string) => {
    const maxHeight = 30
    const lines = src.split('\n').length
    return lines < maxHeight ? lines : maxHeight
  }

  const darkThemeToken = props.frontendClientType === 'vscode' ? 'g90' : 'g100'

  return (
    <Theme theme={props.isDarkTheme ? darkThemeToken : 'g10'}>
      <div className={editPlanClass}>
        <div className='modal-overlay'></div>
        <div className='edit-plan-settings-inner'>
          <div className='edit-plan-settings-header'>
            <h4>Edit plan</h4>
            {codeViewEnabled && (
              <div className='contentSwitcherDiv'>
                {/* <ContentSwitcher
                  size='sm'
                  className='contentSwitcher'
                  selectedIndex={0}
                  onChange={() => {
                    setFormMode(!formMode)
                  }}
                >
                  <IconSwitch
                    name='form'
                    text='form'
                    align='bottom'
                  >
                    <RequestQuote />
                  </IconSwitch>
                  <IconSwitch
                    name='source'
                    text='source'
                    align='bottom'
                  >
                    <Code />
                  </IconSwitch>
                </ContentSwitcher> */}
              </div>
            )}
            <IconButton
              onClick={handleCancelEditPlan}
              label='Close'
              align='bottom'
            >
              <CloseLarge />
            </IconButton>
          </div>
          <InlineNotification
            className='warning-notification'
            aria-label='closes notification'
            kind='warning'
            statusIconDescription='notification'
            subtitle={
              "It's recommended to use the chat to update the plan. Changing some defaults might cause an error."
            }
            title='Warning'
            hideCloseButton
            lowContrast={true}
          />
          <div className='edit-plan-settings-body'>
            {plan?.planned_toolcalls?.length === 0 && 'No Plan'}

            <div className='rowParent'>
              {plan?.planned_toolcalls?.map(
                (toolcall: PlanItem, index: number) => (
                  <>
                    {formMode ? (
                      <div className='rowDiv'>
                        <div className='deleteColumn'>
                          <IconButton
                            kind='tertiary'
                            size='sm'
                            label={'Delete'}
                            className='deleteIcon'
                            disabled={disableDelete}
                          >
                            <SubtractAlt
                              fill='#FF8389'
                              aria-label='Delete item'
                              onClick={e => {
                                e.stopPropagation()
                                deletePlanItem(index)
                              }}
                            />
                          </IconButton>
                        </div>
                        <div className='fieldColumn'>
                          <Form>
                            <FormGroup
                              legendText={index + 1 + '. ' + toolcall.name}
                              messageText={`${index}`}
                            >
                              <div className='formBackground'>
                                {toolcall?.information_items?.map(
                                  (item, argIndex) => {
                                    // convert to lodash format (foo.bar)
                                    const lodashPath = item.input_field
                                      .replace(/^\/+/, '')
                                      .replace(/\//g, '.')

                                    const value = _.get(
                                      toolcall.arguments,
                                      lodashPath,
                                      '',
                                    )

                                    let displayValue

                                    if (value === null || value === undefined) {
                                      displayValue = ''
                                    } else if (
                                      typeof value === 'string' ||
                                      typeof value === 'number'
                                    ) {
                                      displayValue = value
                                    } else {
                                      displayValue = String(value)
                                    }

                                    function createItemLabel(
                                      item: InformationItem,
                                    ) {
                                      let path = item.label
                                      if (_.endsWith(path, '/')) {
                                        path = _.trimEnd(path, '/')
                                      } // Split the path by '/' and return the last element

                                      const parts = _.split(path, '/')
                                      let label = _.last(parts)

                                      return `${label} ${
                                        item.required ? '' : '(optional)'
                                      }`
                                    }

                                    return (
                                      <TextInput
                                        ref={ref}
                                        key={index + '_' + argIndex}
                                        id={item.label}
                                        labelText={createItemLabel(item)}
                                        value={displayValue}
                                        size='sm'
                                        onChange={(
                                          e: ChangeEvent<HTMLInputElement>,
                                        ) => {
                                          setCursor(e.target.selectionStart)
                                          handleArgsInputChange(
                                            index,
                                            item.input_field,
                                            e.target.value,
                                          )
                                        }}
                                      />
                                    )
                                  },
                                )}
                              </div>
                            </FormGroup>
                            <hr />
                          </Form>
                        </div>
                      </div>
                    ) : (
                      <div className='rowDiv'>
                        <TextArea
                          ref={ref}
                          className='textAreaClass'
                          labelText={index + 1 + '. ' + toolcall.name}
                          value={yaml.dump(toolcall.arguments)}
                          rows={getLineHeightForTextarea(
                            yaml.dump(toolcall.arguments),
                          )}
                          onChange={e => {
                            e.preventDefault()
                            setCursor(e.target.selectionEnd)
                            handleTextAreaChange(index, e.target.value)
                          }}
                        />
                      </div>
                    )}
                  </>
                ),
              )}
            </div>
          </div>

          <div className='edit-plan-settings-actions'>
            <Button
              kind='secondary'
              onClick={handleCancelEditPlan}
            >
              Cancel
            </Button>
            <Button
              kind='primary'
              type='submit'
              onClick={handleSave}
              disabled={disableSaveButton()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Theme>
  )
}

export default EditPlanPage
