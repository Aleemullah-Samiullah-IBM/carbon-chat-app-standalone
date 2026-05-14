import React from 'react'
import ReadonlyPlan from './readonlyPlan'
import {PlanEvent} from '../../../types'
import {isPlanPending} from '../message-helpers'

interface Props {
  event: PlanEvent
  isPlanEvent: boolean
  isSelectionMessage: boolean
  isLatestMessage: boolean
}

const ReadonlyPlanWrapper: React.FC<Props> = ({
  event,
  isPlanEvent,
  isSelectionMessage,
  isLatestMessage,
}) => {
  const shouldShow =
    isSelectionMessage ||
    (isPlanEvent && isPlanPending(event) && !isLatestMessage)

  if (!shouldShow) return null

  return (
    <ReadonlyPlan
      title={event.plan_title ?? 'Proposed Plan'}
      executed_toolcalls={event.executed_toolcalls ?? []}
      planned_toolcalls={event.planned_toolcalls ?? []}
    />
  )
}

export default ReadonlyPlanWrapper
