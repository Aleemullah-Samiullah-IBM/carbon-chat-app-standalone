
export interface ErrorItem {
  [key: string]: string
  //{ description: string } can't be specific til we know the data returned...
}

export interface WarningItem {
  [key: string]: string
}

export interface AISuggestion {
  [key: string]: string
}

interface ErrorRemediationResponses {
  errors: ErrorItem[]
  warnings: WarningItem[]
  aiSuggestions: AISuggestion[]
}
