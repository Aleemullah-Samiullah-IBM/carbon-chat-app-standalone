import yaml from 'js-yaml'
import {PlanItem} from '../types'
import {parseToolcallArguments} from './helpers'

/**
 * generate markdown representation of plan with executed + planned toolcalls
 * @param executed_toolcalls [] of executed toolcalls
 * @param planned_toolcalls [] of planned toolcalls
 * @returns Markdown string with checked/ unchecked items
 */
export const generatePlanMarkdown = (
  executed_toolcalls: PlanItem[],
  planned_toolcalls: PlanItem[],
  isLatestMessage: boolean,
): string => {
  const lines: string[] = []

  // helper function to format step name
  const formatStepName = (toolcall: PlanItem): string => {
    try {
      // use operation_id if it exists
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

  // process executed toolcalls (checked)
  if (executed_toolcalls && executed_toolcalls.length > 0) {
    executed_toolcalls.forEach((toolcall, index) => {
      const stepNumber = index + 1
      const stepName = toolcall.title || formatStepName(toolcall)

      // add step with checkbox
      lines.push(`- [x] Step ${stepNumber}: ${stepName}`)

      // add args as indented YAML code block
      const parsedArgs = parseToolcallArguments(toolcall.arguments)
      const yamlArgs = yaml.dump(parsedArgs, {
        indent: 2,
        noRefs: true,
        sortKeys: false,
      })

      // wrap in yaml code blocks to get proper formatting
      if (yamlArgs.trim()) {
        lines.push('     ```yaml')
        yamlArgs
          .split('\n')
          .filter(line => line.trim())
          .forEach(line => {
            lines.push(`     ${line}`)
          })
        lines.push('     ```')
      }

      // add status/ output if available
      // if (toolcall.summarized_output) {
      //   lines.push(`     **Output:** ${toolcall.summarized_output}`)
      // } else if (toolcall.status) {
      //   lines.push(`     **Status:** ${toolcall.status}`)
      // }

      lines.push('')
    })
  }

  // process planned toolcalls (unchecked)
  if (planned_toolcalls && planned_toolcalls.length > 0) {
    const executedCount = executed_toolcalls?.length || 0

    planned_toolcalls.forEach((toolcall, index) => {
      const stepNumber = executedCount + index + 1
      const stepName = toolcall.title || formatStepName(toolcall)

      // add step with checkbox
      if (isLatestMessage) {
        lines.push(`- [ ] Step ${stepNumber}: ${stepName}`)
      } else {
        lines.push(`- [x] Step ${stepNumber}: ${stepName}`)
      }

      // add args as indented YAML code block
      const parsedArgs = parseToolcallArguments(toolcall.arguments)
      const yamlArgs = yaml.dump(parsedArgs, {
        indent: 2,
        noRefs: true,
        sortKeys: false,
      })

      // wrap in yaml code blocks to get proper formatting
      if (yamlArgs.trim()) {
        lines.push('     ```yaml')
        yamlArgs
          .split('\n')
          .filter(line => line.trim())
          .forEach(line => {
            lines.push(`     ${line}`)
          })
        lines.push('     ```')
      }

      lines.push('')
    })
  }

  return lines.join('\n')
}
