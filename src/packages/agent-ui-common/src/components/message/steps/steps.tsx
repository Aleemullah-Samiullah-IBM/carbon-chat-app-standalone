import {JSX} from 'react'
import ToolcallList from '../plan/toolcall/toolcallList'
import {PlanItem} from '../../../types'
import {useMyContext} from '../../../contexts/ChatContext'
import './steps.scss'

// shows read only executed steps for a plan
interface StepsProps {
  executed_toolcalls: PlanItem[] | undefined
  planned_toolcalls: PlanItem[] | undefined
}

const Steps = ({
  executed_toolcalls,
  planned_toolcalls,
}: StepsProps): JSX.Element | null => {
  // console.log('Steps', executed_toolcalls, planned_toolcalls)
  const {isDarkTheme} = useMyContext()

  if (!(executed_toolcalls?.length || planned_toolcalls?.length)) {
    return null
  }

  return (
    <div className={`steps ${isDarkTheme ? 'steps-dark' : 'steps-light'}`}>
      <ToolcallList
        executed_toolcalls={executed_toolcalls || []}
        planned_toolcalls={planned_toolcalls || []}
      />
    </div>
  )
}

export default Steps
