import {Accordion} from '@carbon/react'
import {PlanItem} from '../../../../types'
import Toolcall from './toolcall'

interface ToolcallListProps {
  executed_toolcalls: PlanItem[]
  planned_toolcalls: PlanItem[]
  hideStatus?: boolean
  disabled?: boolean
}
const ToolcallList = ({
  executed_toolcalls,
  planned_toolcalls,
  hideStatus = false,
  disabled = false,
}: ToolcallListProps) => {
  return (
    <Accordion
      align='start'
      size='sm'
      disabled={disabled}
    >
      {executed_toolcalls?.map((toolcall: PlanItem, index: number) => {
        return (
          <Toolcall
            key={`executed-${toolcall.name}-${index}`}
            toolcall={toolcall}
            stepNumber={index + 1}
            hideStatus={hideStatus}
          />
        )
      })}
      {planned_toolcalls?.map((toolcall: PlanItem, index: number) => {
        return (
          <Toolcall
            key={`planned-${toolcall.name}-${index}`}
            toolcall={toolcall}
            stepNumber={(executed_toolcalls?.length || 0) + index + 1}
            hideStatus={hideStatus}
          />
        )
      })}
    </Accordion>
  )
}

export default ToolcallList
