import {ArtifactMetadata} from './FileData'

export type Command = {
  name: string
  description: string
  parameters: Parameter[]
}

// this is what the UI uses to display command list
export type TransformedCommand = {
  name: string
  description: string
  arguments: Parameter[]
}

export type Parameter = {
  name: string
  description: string
  required: boolean
  type: string
}

export type ParsedCommandArgValue = string | ArtifactMetadata | undefined | null

export type ParsedCommandArgs = {
  [key: string]: ParsedCommandArgValue
}
