import {useEffect} from 'react'
import {unstable__ChatButton as NextActionButton} from '@carbon/react'
import {TextNewLine} from '@carbon/react/icons'
import {useInput} from '../../../contexts/ChatContext'
import './nextActions.scss'

interface NextActionProps {
  nextActionList: Array<string>
  nonEditable: boolean
}

const NextActions: React.FC<NextActionProps> = ({
  nextActionList,
  nonEditable = false,
}) => {
  const {inputRef, setPromptValue} = useInput()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const clickAction = (action: string) => {
    setPromptValue(action)
    inputRef.current?.focus()
  }

  let actionButtons = nextActionList.map(action => (
    <NextActionButton
      onClick={() => clickAction(action)}
      kind='tertiary'
      size='sm'
      disabled={nonEditable}
      key={action}
    >
      <TextNewLine />
      {' ' + action}
    </NextActionButton>
  ))

  return <div className='next-action-container'>{actionButtons}</div>
}
export default NextActions
