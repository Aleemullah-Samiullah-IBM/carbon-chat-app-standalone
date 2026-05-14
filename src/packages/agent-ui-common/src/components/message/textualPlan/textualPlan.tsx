import {ListChecked} from '@carbon/icons-react'
import {useMyContext} from '../../../contexts/ChatContext'
// import {Block} from '../../block/block'
// import {generatePlanMarkdown} from '../../../utilities/planToMarkdown'
import ProgressTimeline from '../progressTimeline/progressTimeline'
import {PlanEvent} from '../../../types'

import './textualPlan.scss'

interface TextualPlanProps {
  title?: string
  event?: PlanEvent
}

/* 
  This component renders plan as read-only markdown text with filled and
  empty checkboxes to represent executed and planned actions.
  This simplified version of Plan forces user to communicate via chat
  rather than the interactive Plan component.
*/

const TextualPlan = ({
  title = 'Plan',
  event,
}: TextualPlanProps): JSX.Element | null => {
  const contextValues = useMyContext()

  const plan = event !== undefined ? event : contextValues.plan

  if (
    !plan ||
    !(plan.executed_toolcalls?.length || plan.planned_toolcalls?.length)
  ) {
    return null
  }

  // convert plan info to textual markdown format
  // const markdownContent = generatePlanMarkdown(
  //   plan.executed_toolcalls ?? [],
  //   plan.planned_toolcalls ?? [],
  //   isLatestMessage,
  // )

  return (
    <div className='textual-plan-container'>
      <div className='textual-plan-header'>
        <h4 className='textual-plan-title'>
          <ListChecked size={24} /> Plan: {title}
        </h4>
      </div>

      {/* Old markdown version */}
      {/* <div className='textual-plan-markdown-content'>
        <Block blockInfo={markdownContent} />
      </div> */}

      {/* New progress timeline version */}
      <div className='textual-plan-content'>
        <ProgressTimeline
          executed_toolcalls={plan.executed_toolcalls ?? []}
          planned_toolcalls={plan.planned_toolcalls ?? []}
        />
      </div>
    </div>
  )
}

export default TextualPlan
