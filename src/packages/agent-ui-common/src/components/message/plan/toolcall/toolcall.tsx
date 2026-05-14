import {AccordionItem} from '@carbon/react'
import './toolcall.scss'
import {
  CheckmarkOutline,
  CheckmarkOutlineWarning,
  CircleDash,
  ErrorFilled,
} from '@carbon/react/icons'
import yaml from 'js-yaml'
import {parseToolcallArguments} from '../../../../utilities/helpers'
import {PlanItem} from '../../../../types'
import {Block} from '../../../block/block'
import classNames from 'classnames'

interface ToolcallProps {
  toolcall: PlanItem
  stepNumber: number
  disabled?: boolean
  hideStatus?: boolean
}

const Toolcall = ({
  toolcall,
  stepNumber,
  disabled = false,
  hideStatus = false,
}: ToolcallProps) => {
  const messageClass = classNames({
    'toolcall-error-message': toolcall.status === 'failure',
    'toolcall-warning-message': toolcall.status === 'warning',
    'toolcall-success-message': toolcall.status === 'success',
    'toolcall-message': !['failure', 'warning', 'success'].includes(
      toolcall.status,
    ),
  })

  const renderStatusIcon = () => {
    switch (toolcall.status) {
      case 'success':
        return <CheckmarkOutline className='status-svg svg-checkmark' />
      case 'failure':
        return <ErrorFilled className='status-svg svg-error' />
      case 'warning':
        return <CheckmarkOutlineWarning className='status-svg svg-warning' />
      default:
        return <CircleDash className='status-svg svg-not-started' />
    }
  }

  const renderStatusMessage = () => {
    // Assume every toolcall w/o summarized_output is a planned toolcall
    const message = toolcall.status
      ? toolcall.summarized_output ?? toolcall.status
      : 'Not Started'

    return toolcall.summarized_output ? (
      <span className={messageClass}>
        <Block blockInfo={message} />
      </span>
    ) : (
      <span className={messageClass}>{message}</span>
    )
  }

  // example `APIConnectTask: Copy draft api to project`
  // note for some reason fyre and saas give different slash command responses
  // need to guard against unexpected/ undefined fields that can cause ui to crash
  const formatStepName = (toolcall: PlanItem) => {
    try {
      // try operation_id if it exists
      const operationId = toolcall.arguments?.operation?.operation_id
      if (operationId) {
        const stepName = operationId.split('_').join(' ')
        const formattedStepName =
          stepName.charAt(0).toUpperCase() + stepName.slice(1)

        return `${toolcall.name}: ${formattedStepName}`
      }

      // parse toolcall.name like "APIConnectTask<op_separator>list_draft_apis"
      const [toolName, operation] = toolcall.name.split('<op_separator>')
      if (operation) {
        const stepName = operation.split('_').join(' ')
        const formattedStepName =
          stepName.charAt(0).toUpperCase() + stepName.slice(1)

        return `${toolName}: ${formattedStepName}`
      }

      return toolcall.name
    } catch (error) {
      console.log('formatStepName: encountered unexpected error')
      return toolcall.name
    }
  }

  const header = (
    <div className='toolcall-header'>
      <div className='toolcall-header-left'>Step {stepNumber}</div>
      <div className='toolcall-header-right'>
        <span className='toolcall-title'>
          {toolcall.title || formatStepName(toolcall)}
        </span>

        {!hideStatus && (
          <span className='toolcall-status-container'>
            <span className='status-svg-wrapper'>{renderStatusIcon()}</span>
            {renderStatusMessage()}
          </span>
        )}
      </div>
    </div>
  )
  return (
    <AccordionItem
      className='toolcall'
      disabled={disabled}
      title={header}
    >
      <pre className='toolcall-arguments'>
        {yaml.dump(parseToolcallArguments(toolcall.arguments))}
      </pre>
    </AccordionItem>
  )
}

export default Toolcall
