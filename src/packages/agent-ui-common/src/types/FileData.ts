export interface FileMeta {
  name: string
  path: string
  content?: Uint8Array
  uploadedViaButton?: boolean
}

export interface ArtifactMetadata {
  artifact_id: string
  filename: string
  data_hash: string
  data_size: number
  source: string
  created_at: string
  description: string
  label: string
}
