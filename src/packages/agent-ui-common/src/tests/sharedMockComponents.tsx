// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import React from 'react'
import {vi} from 'vitest'

/**
 * Shared mock components for testing
 * This file consolidates common component mocks to reduce duplication
 */

// ============================================================================
// Carbon React Component Mocks
// ============================================================================

export const mockCarbonComponents = () => {
  vi.mock('@carbon/react', () => ({
    InlineNotification: ({title, subtitle, onClose}: any) => (
      <div data-testid='inline-notification'>
        <div>{title}</div>
        <div>{subtitle}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ),
    Modal: ({children, open, onRequestClose, modalHeading}: any) =>
      open ? (
        <div data-testid='modal'>
          <div>{modalHeading}</div>
          {children}
          <button onClick={onRequestClose}>Close Modal</button>
        </div>
      ) : null,
    Button: ({children, onClick, renderIcon, ...props}: any) => (
      <button
        onClick={onClick}
        {...props}
      >
        {children}
        {renderIcon && <span data-testid='button-icon' />}
      </button>
    ),
    AccordionItem: ({
      children,
      title,
      disabled,
      className,
    }: {
      children: React.ReactNode
      title: React.ReactNode
      disabled?: boolean
      className?: string
    }) => (
      <div
        data-testid='accordion-item'
        data-disabled={disabled}
        data-classname={className}
      >
        <div data-testid='accordion-title'>{title}</div>
        <div data-testid='accordion-content'>{children}</div>
      </div>
    ),
  }))
}

// ============================================================================
// Carbon Icons Mocks
// ============================================================================

export const mockCarbonIcons = () => {
  vi.mock('@carbon/react/icons', () => ({
    CheckmarkOutline: ({className}: {className?: string}) => (
      <svg
        data-testid='checkmark-outline'
        className={className}
      />
    ),
    CheckmarkOutlineWarning: ({className}: {className?: string}) => (
      <svg
        data-testid='checkmark-outline-warning'
        className={className}
      />
    ),
    CircleDash: ({className}: {className?: string}) => (
      <svg
        data-testid='circle-dash'
        className={className}
      />
    ),
    ErrorFilled: ({className}: {className?: string}) => (
      <svg
        data-testid='error-filled'
        className={className}
      />
    ),
  }))
}

// ============================================================================
// Carbon IBM Products Mocks
// ============================================================================

export const mockCarbonIBMProducts = () => {
  vi.mock('@carbon/ibm-products', () => ({
    NoDataEmptyState: ({title, subtitle}: any) => (
      <div data-testid='no-data-empty-state'>
        <h3>{title}</h3>
        <div>{subtitle}</div>
      </div>
    ),
  }))
}

// ============================================================================
// Common Component Mocks
// ============================================================================

export const mockCommonComponents = () => {
  // Mock Message component
  vi.mock('@agent-ui/common/src/components/message/message', () => ({
    Message: ({msg, setIsEditPage, onSaveSelection}: any) => (
      <div data-testid='message'>
        {msg.event?.type || 'message'}
        {msg.event?.type === 'agent-plan' && setIsEditPage && (
          <button
            data-testid='trigger-edit-plan'
            onClick={() => setIsEditPage(true)}
          >
            Edit Plan
          </button>
        )}
        {msg.event?.type === 'selection-request' && onSaveSelection && (
          <button
            data-testid='trigger-selection'
            onClick={() => onSaveSelection(0)}
          >
            Make Selection
          </button>
        )}
      </div>
    ),
  }))

  // Mock RemoteDomRenderer
  vi.mock('@agent-ui/common/src/components/RemoteDomRenderer', () => ({
    RemoteDomRenderer: () => <div data-testid='remote-dom-renderer' />,
  }))

  // Mock LoadingMessage
  vi.mock(
    '@agent-ui/common/src/components/message/loadingMessage/loadingMessage',
    () => ({
      LoadingMessage: () => <div data-testid='loading-message'>Loading...</div>,
    }),
  )

  // Mock PromptInput
  vi.mock('@agent-ui/common/src/components/promptInput/promptInput', () => ({
    PromptInput: ({onSendMessage, onInputChange, value}: any) => (
      <div data-testid='prompt-input'>
        <input
          data-testid='prompt-input-field'
          value={value}
          onChange={e => onInputChange(e.target.value)}
        />
        <button
          data-testid='send-button'
          onClick={() => onSendMessage(value)}
        >
          Send
        </button>
      </div>
    ),
  }))

  // Mock Toolbar
  vi.mock('@agent-ui/common/src/components/toolbar/toolbar', () => ({
    default: ({onClickCallback}: any) => (
      <div data-testid='toolbar'>
        <button
          data-testid='new-chat-button'
          onClick={() => onClickCallback('newchat')}
        >
          New Chat
        </button>
        <button
          data-testid='switch-org-button'
          onClick={() => onClickCallback('switchorg')}
        >
          Switch Org
        </button>
        <button
          data-testid='sample-prompts-button'
          onClick={() => onClickCallback('samplePrompts')}
        >
          Sample Prompts
        </button>
      </div>
    ),
  }))

  // Mock SamplePromptsModal
  vi.mock(
    '@agent-ui/common/src/components/samplePrompts/samplePrompts',
    () => ({
      SamplePromptsModal: () => (
        <div data-testid='sample-prompts-modal'>Sample Prompts</div>
      ),
    }),
  )

  // Mock PorgPickerModal
  vi.mock('@agent-ui/common/src/components/porgPicker/porgPickerModal', () => ({
    default: ({open, onClose, onPorgSelectedCallback}: any) =>
      open ? (
        <div data-testid='porg-picker-modal'>
          <button onClick={onClose}>Close Porg Picker</button>
          <button
            data-testid='modal-select-porg'
            onClick={() => onPorgSelectedCallback?.('modal-porg')}
          >
            Select Porg from Modal
          </button>
          <button
            data-testid='modal-select-porg-with-instance'
            onClick={() =>
              onPorgSelectedCallback?.('modal-porg', {
                url: 'https://modal-instance.com',
                access_token: 'modal-token',
                name: 'Modal Instance',
              })
            }
          >
            Select Porg with Instance from Modal
          </button>
        </div>
      ) : null,
  }))

  // Mock PorgPicker
  vi.mock('@agent-ui/common/src/components/porgPicker/porgPicker', () => ({
    default: ({onPorgSelectedCallback}: any) => (
      <div data-testid='porg-picker'>
        <button onClick={() => onPorgSelectedCallback('test-porg')}>
          Select Porg
        </button>
        <button
          data-testid='select-porg-with-new-instance'
          onClick={() =>
            onPorgSelectedCallback('test-porg', {
              url: 'https://new-instance.com',
              access_token: 'new-token',
              name: 'New Instance',
            })
          }
        >
          Select Porg With New Instance
        </button>
      </div>
    ),
  }))

  // Mock APIM Instance Selector
  vi.mock('@agent-ui/common/src/components/apimInstanceSelector', () => ({
    default: ({onInstanceSelect}: any) => (
      <div data-testid='apim-instance-selector'>
        <button
          onClick={() =>
            onInstanceSelect({
              url: 'https://test.com',
              access_token: 'test-token',
              name: 'Test Instance',
            })
          }
        >
          Select Instance
        </button>
      </div>
    ),
  }))

  // Mock APIM Empty State
  vi.mock('@agent-ui/common/src/components/apimEmptyState', () => ({
    default: ({goToAPIManager}: any) => (
      <div data-testid='apim-empty-state'>
        <button onClick={goToAPIManager}>Go to API Manager</button>
      </div>
    ),
  }))

  // Mock APIM Disconnected Empty State
  vi.mock(
    '@agent-ui/common/src/components/apimDisconnectedEmptyState/apimDisconnectedEmptyState',
    () => ({
      default: ({reconnectAPIManager}: any) => (
        <div data-testid='apim-disconnected-empty-state'>
          <button onClick={reconnectAPIManager}>Reconnect</button>
        </div>
      ),
    }),
  )

  // Mock Icons
  vi.mock('@agent-ui/common/src/components/icons/icons', () => ({
    default: () => <div data-testid='watson-icon'>Icon</div>,
  }))

  // Mock Edit Plan Page
  vi.mock('@agent-ui/common/src/components/message/plan/editPlanPage', () => ({
    default: ({setIsEditPage}: any) => (
      <div data-testid='edit-plan-page'>
        <button onClick={() => setIsEditPage(false)}>Close Edit Plan</button>
      </div>
    ),
  }))

  // Mock Selection Table
  vi.mock(
    '@agent-ui/common/src/components/message/selectionTable/selectionTable',
    () => ({
      default: ({onSave}: any) => (
        <div data-testid='selection-table'>
          <button onClick={() => onSave(0)}>Select Project</button>
        </div>
      ),
    }),
  )

  // Mock Block component
  vi.mock('@agent-ui/common/src/components/block/block', () => ({
    Block: ({blockInfo}: {blockInfo: string}) => (
      <div data-testid='block'>{blockInfo}</div>
    ),
  }))
}

// ============================================================================
// Utility Mocks
// ============================================================================

export const mockUtilities = () => {
  vi.mock('@agent-ui/common/src/utilities/helpers', () => ({
    cleanInput: vi.fn(input => input),
    getCurrentTime: vi.fn(() => '12:00 PM'),
    transformChatMessagesData: vi.fn(events => events),
    isAgentResponse: vi.fn(() => true),
    shouldResetToolcalls: vi.fn(() => false),
    shouldUpdatePlan: vi.fn(() => false),
    processFormattedSession: vi.fn(),
    updateContext: vi.fn((context, key, value) => ({...context, [key]: value})),
    parseToolcallArguments: vi.fn((args: any) => args),
  }))

  vi.mock('@agent-ui/common/src/utilities/welcomeMessage', () => ({
    createWelcomeMessage: vi.fn(() => ({
      event: {type: 'agent-plan', first_message: true},
      timestamp: '12:00 PM',
    })),
  }))

  vi.mock('js-yaml', () => ({
    default: {
      dump: vi.fn((obj: any) => JSON.stringify(obj, null, 2)),
    },
  }))
}

// ============================================================================
// All-in-one setup function
// ============================================================================

export const setupAllMocks = () => {
  mockCarbonComponents()
  mockCarbonIcons()
  mockCarbonIBMProducts()
  mockCommonComponents()
  mockUtilities()
}
