import {
  AuthContext,
  FrontendContext,
} from '@agent-ui/common/interfaces/platform'

export function getAuthContext(): AuthContext {
  return {}
}

export function getFrontendContext(): FrontendContext {
  return {
    client: 'vscode',
  }
}
