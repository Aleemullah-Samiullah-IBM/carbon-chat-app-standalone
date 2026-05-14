import {ErrorEmptyState} from '@carbon/ibm-products'
import {unstable__ChatButton as ChatButton} from '@carbon/react'
import './apimDisconnectedEmptyState.scss'

interface APIMDisconnectedEmptyStateProps {
  reconnectAPIManager: (event: any) => void
}

const APIMDisconnectedEmptyState: React.FC<APIMDisconnectedEmptyStateProps> = ({
  reconnectAPIManager,
}) => {
  return (
    <div id='apim-disconnect-empty-state-container'>
      <ErrorEmptyState
        title='Connection error'
        subtitle={
          <div>
            <p>
              Make sure you’re logged in to a provider organization. You need a
              valid connection to continue with the API Agent.
            </p>
            <ChatButton
              onClick={reconnectAPIManager}
              kind='tertiary'
            >
              Reconnect
            </ChatButton>
          </div>
        }
      ></ErrorEmptyState>
    </div>
  )
}
export default APIMDisconnectedEmptyState
