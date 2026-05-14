/**
 * define a contract for platform-specific functionality that can be injected
 * into shared components or services.
 *
 * This interface enables decoupling of environment-dependent logic (e.g., logout behavior)
 * from UI components, allowing the same codebase to run across multiple platforms
 * such as VS Code extensions and web applications.
 */

import {FileMeta} from '../types/FileData'

// this will be used to build the frontend platform context
// to provide the context of the UI to the agent and tools
// to use, either pass in one-time via configureService()
//
// const {apiService, configureService, porg, setPorg} = useAPI()
// or call it for each API call (useful for web-app for custom, native experience)
//
// const context = getFrontendContext()
// then pass in via apiService call
export interface FrontendContext {
  client: 'vscode' | 'apim' | 'apistudio-desktop' | 'apistudio-embedded'
  version?: string
  context?: string // optional, maybe use something like window.location.pathname or something underlying environment has
}

export interface AuthContext {
  auth_type?: string
  auth_values?: string
}

export interface PlatformAPI {
  logout?: () => Promise<void>
}

export interface FileProvider {
  getFileList: () => Promise<FileMeta[]>
  saveSelectedFilePath?: (file: FileMeta) => Promise<void>
  notifyNoFilesError?: (message: string) => void
  // getFileContent: (file: FileMeta) => Promise<FileMeta>
}
