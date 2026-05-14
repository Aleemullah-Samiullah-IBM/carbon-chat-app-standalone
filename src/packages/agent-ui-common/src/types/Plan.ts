export interface Plan {
  executed_toolcalls: PlanItem[] | null | undefined
  planned_toolcalls: PlanItem[] | null | undefined
}

export interface PlanItem {
  name: string
  infoNeeded?: boolean
  arguments: Record<string, any>
  information_items?: InformationItem[] | null | undefined
  title: string
  description: string
  status: 'success' | 'warning' | 'failure'
  summarized_output?: string
  validation_data?: any
}

export interface InformationItem {
  type: string
  input_field: string
  label: string
  required: boolean
}
