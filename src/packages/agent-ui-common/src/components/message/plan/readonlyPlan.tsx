import ToolcallList from './toolcall/toolcallList'
import {PlanItem} from '../../../types'

import './plan.scss'

interface PlanProps {
  title: string
  executed_toolcalls: PlanItem[]
  planned_toolcalls: PlanItem[]
}

const ReadonlyPlan: React.FC<PlanProps> = ({
  title,
  executed_toolcalls,
  planned_toolcalls,
}) => {
  return (
    <div className='plan-container'>
      <div className='plan-header'>
        <span className='plan-title'>{title}</span>
      </div>

      <ToolcallList
        executed_toolcalls={executed_toolcalls}
        planned_toolcalls={planned_toolcalls}
        hideStatus={(executed_toolcalls?.length ?? 0) === 0}
      />
    </div>
  )
}

export default ReadonlyPlan
