import ReactDOM from 'react-dom/client'
import {APIProvider} from '@agent-ui/common/contexts/APIContext'
import {ChatProvider} from '@agent-ui/common/contexts/ChatContext'
import {ErrorProvider} from '@agent-ui/common/contexts/ErrorContext'
import {App} from './App'

import './index.css'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ErrorProvider>
      <ChatProvider>
        <APIProvider>
          <App />
        </APIProvider>
      </ChatProvider>
    </ErrorProvider>,
  )
} else {
  console.error("Root element 'app' not found!")
}
