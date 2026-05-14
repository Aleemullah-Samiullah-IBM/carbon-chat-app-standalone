import {JSX} from 'react'
import {Button} from '@carbon/react'
import ToolcallList from './toolcall/toolcallList'
import {useMyContext} from '../../../contexts/ChatContext'
// import {ChatInstance} from '@carbon/ai-chat'

import './plan.scss'

interface PlanProps {
  nonEditable?: boolean
  plan?: any
  instance?: any | undefined //ChatInstance | undefined
  onSpecialSave?: (
    type: string,
    data: any,
    instance?: any | undefined, // ChatInstance | undefined,
  ) => Promise<void> | void
  title?: string
  onSave?: () => void
  setIsEditPage?: (e: boolean) => void
  isApprovalSubmitting?: boolean
}

/* 
  This Message response type generates a list of {tool, arguments}
  that the user can approve or make changes to
*/

const Plan = ({
  title = 'Plan',
  nonEditable = false,
  plan: planProp,
  instance,
  onSpecialSave,
  onSave,
  setIsEditPage = () => {},
  isApprovalSubmitting: isApprovalSubmittingProp,
}: PlanProps): JSX.Element | null => {
  const contextValues = useMyContext()

  // Use the plan from props instead of context to avoid the context error
  // if used my carbon-chat-app, otherwise use from context Values
  const plan = planProp !== undefined ? planProp : contextValues.plan

  // Use isApprovalSubmitting from props if provided, otherwise fall back to context
  const isApprovalSubmitting =
    isApprovalSubmittingProp !== undefined
      ? isApprovalSubmittingProp
      : contextValues.isApprovalSubmitting

  const handleSaveLocal = () => {
    if (onSpecialSave) {
      onSpecialSave('plan', plan, instance)
    } else if (onSave) {
      onSave()
    }
  }

  if (
    !plan ||
    !(plan.executed_toolcalls?.length || plan.planned_toolcalls?.length)
  ) {
    return null
  }

  return (
    <div className='plan-container'>
      <div className='plan-header'>
        <span className='plan-title'>{title}</span>
      </div>

      <ToolcallList
        executed_toolcalls={plan.executed_toolcalls || []}
        planned_toolcalls={plan.planned_toolcalls || []}
        disabled={isApprovalSubmitting || nonEditable}
        hideStatus={(plan?.executed_toolcalls?.length ?? 0) === 0}
      />

      {(plan?.planned_toolcalls?.length ?? 0) > 0 && (
        <div className='plan-actions'>
          <Button
            kind='secondary'
            disabled={isApprovalSubmitting || nonEditable}
            onClick={() => setIsEditPage(true)}
          >
            <span className='plan-action-button-content'>Edit</span>
          </Button>

          <Button
            kind='primary'
            disabled={isApprovalSubmitting || nonEditable}
            onClick={handleSaveLocal}
          >
            <span className='plan-action-button-content'>
              {plan?.executed_toolcalls?.length === 0 ? 'Start' : 'Continue'}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Plan
