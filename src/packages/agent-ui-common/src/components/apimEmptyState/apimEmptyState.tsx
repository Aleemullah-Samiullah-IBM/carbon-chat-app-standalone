import {NoDataEmptyState} from '@carbon/ibm-products'
import {Button} from '@carbon/react'
import {ArrowRight} from '@carbon/react/icons'
import './apimEmptyState.scss'

interface APIMEmptyStateProps {
  goToAPIManager: (event: any) => void
}

const APIMEmptyState: React.FC<APIMEmptyStateProps> = ({goToAPIManager}) => {
  return (
    <div id='apim-empty-state-container'>
      <NoDataEmptyState
        title='No API Manager configured yet'
        subtitle={
          <div>
            <p>
              Go to IBM API Studio Settings {'>'} API Managers to configure APIM
              instance and access API Agent.
            </p>
            <Button
              renderIcon={() => <ArrowRight />}
              onClick={goToAPIManager}
            >
              Configure API Managers
            </Button>
          </div>
        }
      ></NoDataEmptyState>
    </div>
  )
}
export default APIMEmptyState
