import './readOnlySettingsPage.scss'
import {useMyContext} from '../../contexts/ChatContext'
import {useAPI} from '../../contexts/APIContext'
import {FormGroup, IconButton, TextInput} from '@carbon/react'
import cx from 'classnames'
import {CloseLarge} from '@carbon/react/icons'

type ReadOnlySettingsPageProps = {
  isDarkTheme: boolean
  setOpenReadOnlySettingsPage: (openReadOnlySettingsPage: boolean) => void
}

const ReadOnlySettingsPage = (props: ReadOnlySettingsPageProps) => {
  const {hostUrl, auth, apicTokenExpirationDate} = useMyContext()
  const {porg} = useAPI()

  const readOnlySettingsClass = cx({
    'read-only-settings-container': true,
    'modal-dark-mode': props.isDarkTheme,
  })

  return (
    <div className={readOnlySettingsClass}>
      <div className='modal-overlay'></div>
      <div className='read-only-settings-inner'>
        <div className='read-only-settings-header'>
          <h4>Connection details</h4>
          <IconButton
            onClick={() => props.setOpenReadOnlySettingsPage(false)}
            label='Close'
            align='bottom'
          >
            <CloseLarge />
          </IconButton>
        </div>
        <p>API Connect</p>
        <br />
        <FormGroup
          legendText=''
          className='read-only-settings-container-group'
        >
          <TextInput
            id='readOnlySettings-hostUrl'
            labelText='Host Url'
            value={hostUrl}
            readOnly
            className='read-only-settings-container-text-input'
          />
          <TextInput
            id='readOnlySettings-hostUrl'
            labelText='Provider organization'
            value={
              porg ||
              (apicTokenExpirationDate === 'indefinite' &&
                auth?.['X-ibm-org']) ||
              'null'
            }
            readOnly
            className='read-only-settings-container-text-input'
          />
        </FormGroup>
      </div>
    </div>
  )
}

export default ReadOnlySettingsPage
