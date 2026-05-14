import {Command} from '@agent-ui/common/types'
import {ChatInstance} from '@carbon/ai-chat'
import {Home, Add, Asleep, Light, SidePanelOpen, SidePanelClose} from '@carbon/icons-react'
import {Button} from '@carbon/react'
// import {WriteableElementExample} from './WriteableElementExample'

export const getRenderWriteableElements = (
  chatInstance: ChatInstance,
  commands: Command[],
  onReturnToLanding?: () => void,
  onCreateNewChat?: () => void,
  isDarkTheme?: boolean,
  onToggleTheme?: () => void,
  viewMode?: 'fullscreen' | 'sidebar',
  onToggleViewMode?: () => void,
) => {
  console.log('getRenderWriteableElements called with commands:', commands)

  // Store commands in a ref-like way so we can access them in event handlers
  let currentFilter = ''

  return {
    headerBottomElement: onReturnToLanding ? (
      <div className='header-navigation-buttons'>
        <Button
          kind='ghost'
          size='sm'
          renderIcon={Home}
          iconDescription='Back to chats'
          hasIconOnly
          onClick={() => onReturnToLanding?.()}
          tooltipPosition='bottom'
        />
        {onCreateNewChat && (
          <Button
            kind='ghost'
            size='sm'
            renderIcon={Add}
            iconDescription='New chat'
            hasIconOnly
            onClick={() => onCreateNewChat?.()}
            tooltipPosition='bottom'
          />
        )}
        {onToggleViewMode && (
          <Button
            kind='ghost'
            size='sm'
            renderIcon={viewMode === 'fullscreen' ? SidePanelOpen : SidePanelClose}
            iconDescription={viewMode === 'fullscreen' ? 'Sidebar mode' : 'Fullscreen mode'}
            hasIconOnly
            onClick={() => onToggleViewMode?.()}
            tooltipPosition='bottom'
          />
        )}
        {onToggleTheme && (
          <Button
            kind='ghost'
            size='sm'
            renderIcon={isDarkTheme ? Light : Asleep}
            iconDescription={isDarkTheme ? 'Light mode' : 'Dark mode'}
            hasIconOnly
            onClick={() => onToggleTheme?.()}
            tooltipPosition='bottom'
          />
        )}
      </div>
    ) : null,

    welcomeNodeBeforeElement: null,
    homeScreenHeaderBottomElement: null,
    homeScreenAfterStartersElement: null,
    beforeInputElement: (
      <>
        <div className='disclaimer'>
          <p>Accuracy of generated answers may vary.</p>
          <p>Please double check responses.</p>
        </div>

        <div
          className='actions-menu'
          style={{display: 'none'}}
          // ref={menuRef}
        >
          {commands.map((action, index) => (
            <div
              className='actions-menu-items'
              key={index}
              onClick={() => {
                console.log(action.description)

                const messageInput = chatInstance.elements?.getMessageInput()

                if (messageInput) {
                  const textarea =
                    messageInput.getHTMLElement() as HTMLTextAreaElement

                  messageInput.setValue(`/${action.name}`)

                  textarea.focus()
                }

                //   // Set the value and trigger input event to update React state
                // const messageInput = chatInstance.elements.getMessageInput()
                // const textarea = messageInput.getHTMLElement() as HTMLTextAreaElement

                // // Set the value
                // textarea.value = `/${action.name}`

                // // Trigger input event to notify React of the change
                // const inputEvent = new Event('input', { bubbles: true })
                // textarea.dispatchEvent(inputEvent)

                // // Focus the textarea
                // textarea.focus()

                // todo how do i pass this action.description into the prompt input and auto send?

                const div = document.querySelector(
                  '.actions-menu',
                ) as HTMLElement

                if (div) {
                  div.style.display = 'none'
                }
              }}
            >
              {action.name}

              <p className='description'>{action.description}</p>
            </div>
          ))}
        </div>
      </>
    ),
    aiTooltipAfterDescriptionElement: null,
  }
}

export const feedbackOptions = {
  is_on: true,
  id: '1',
  show_positive_details: false,
  show_negative_details: true,
  show_prompt: true,
}

// Made with Bob
