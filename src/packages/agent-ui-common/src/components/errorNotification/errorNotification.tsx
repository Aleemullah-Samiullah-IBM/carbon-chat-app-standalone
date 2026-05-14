import {ActionableNotification, InlineNotification} from '@carbon/react'
import {FrontendContext} from '../../interfaces/platform'
import {ReactNode} from 'react'

interface ErrorNotificationProps {
  isError: boolean
  setIsError: (value: boolean) => void
  errorMessage: string
  frontendClient?: FrontendContext
  title?: string
  vscode?: any
  children?: ReactNode
}

/**
 * Reusable error notification component
 * @param isError - Boolean to control if the error is shown
 * @param setIsError - Function to update the error state
 * @param errorMessage - Message to display in the notification
 * @param title - Title of the notification (defaults to 'No provider organizations')
 * @param frontendClient - The frontend client object to determine client type and show different component (e.g., vscode)
 * @param children - Optional child elements to render inside the notification
 * @returns InlineNotification component
 */
export const ErrorNotification = ({
  isError,
  setIsError,
  errorMessage,
  frontendClient,
  title = 'No provider organizations',
  vscode,
  children,
}: ErrorNotificationProps) => {
  if (!isError) return null

  async function logout() {
    vscode.postMessage({
      type: 'logout',
      value: '',
    })
  }

  const client = frontendClient?.client

  // use ActionableNotification to show interactive `Log out` button for vscode
  if (client === 'vscode') {
    return (
      <ActionableNotification
        actionButtonLabel='Logout'
        aria-label='close notification'
        hideCloseButton // do not allow user to close this notification
        kind='error'
        onActionButtonClick={() => {
          logout()
        }}
        statusIconDescription='notification'
        subtitle={errorMessage}
        title={title}
      >
        {children as any}
      </ActionableNotification>
    )
  }

  return (
    <InlineNotification
      aria-label='closes notification'
      kind='error'
      onClose={() => setIsError(false)}
      onCloseButtonClick={() => setIsError(false)}
      statusIconDescription='notification'
      subtitle={errorMessage}
      title={title}
    >
      {children as any}
    </InlineNotification>
  )
}
