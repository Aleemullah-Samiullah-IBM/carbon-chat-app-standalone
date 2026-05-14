import React from 'react'
import {PlanItem} from '../../../types'
import {parseToolcallArguments} from '../../../utilities/helpers'
import yaml from 'js-yaml'
import './progressTimeline.scss'

interface ProgressTimelineProps {
  executed_toolcalls: PlanItem[]
  planned_toolcalls: PlanItem[]
}

// Show vertical connected list of steps where:
// Empty circles = pending / future steps
// Filled circles = completed steps
const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  executed_toolcalls,
  planned_toolcalls,
}) => {
  const formatStepName = (toolcall: PlanItem): string => {
    try {
      const operationId = toolcall.arguments?.operation?.operation_id
      if (operationId) {
        const stepName = operationId.split('_').join(' ')
        return stepName.charAt(0).toUpperCase() + stepName.slice(1)
      }

      const [toolName, operation] = toolcall.name.split('<op_separator>')
      if (operation) {
        const stepName = operation.split('_').join(' ')
        return stepName.charAt(0).toUpperCase() + stepName.slice(1)
      }

      return toolcall.name
    } catch (error) {
      return toolcall.name
    }
  }

  const allSteps = [
    ...executed_toolcalls.map(toolcall => ({
      ...toolcall,
      completed: true,
    })),
    ...planned_toolcalls.map(toolcall => ({
      ...toolcall,
      completed: false,
    })),
  ]

  return (
    <div className='progress-timeline'>
      {allSteps.map((step, index) => {
        const stepName = step.title || formatStepName(step)
        const parsedArgs = parseToolcallArguments(step.arguments)
        const yamlArgs = yaml.dump(parsedArgs, {
          indent: 2,
          noRefs: true,
          sortKeys: false,
        })
        const isLast = index === allSteps.length - 1

        return (
          <div
            key={index}
            className='progress-step'
          >
            <div className='step-indicator'>
              <div
                className={`step-circle ${step.completed ? 'completed' : 'pending'}`}
              ></div>

              {!isLast && <div className='step-line' />}
            </div>

            <div className='step-content'>
              <div className='step-header'>
                <span className='step-name'>{stepName}</span>
              </div>

              {yamlArgs.trim() && (
                <div className='step-args'>
                  <pre>
                    <code>{yamlArgs}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressTimeline
