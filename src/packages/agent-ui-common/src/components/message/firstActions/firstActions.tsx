import {useMyContext} from '../../../contexts/ChatContext'

import './firstActions.scss'

interface FirstActionProps {
  firstActionList: Array<{icon: any; message: string}>
}

const FirstActions: React.FC<FirstActionProps> = ({firstActionList}) => {
  const {isDarkTheme} = useMyContext()

  return (
    <div className='first-actions-container'>
      {firstActionList?.map(action => {
        const Icon = action.icon
        return (
          <div
            className='first-actions-pair'
            key={action.message}
          >
            <Icon fill={isDarkTheme ? '#ffffff' : '#000000'} />
            <div>{action.message} </div>
          </div>
        )
      })}
    </div>
  )
}
export default FirstActions
