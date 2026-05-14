// @ts-nocheck

import React, {useState} from 'react'
import {Block} from '../block/block'
import Plan from './plan/plan'
import TextualPlan from './textualPlan/textualPlan'
import ReadonlyPlanWrapper from './plan/readonlyPlanWrapper'
import HeadlessAccordion from './headlessAccordion/headlessAccordion'
import NextActions from './nextActions/nextActions'
import FirstActions from './firstActions/firstActions'
import ResponseDetails from './responseDetails/responseDetails'
import DownloadAttachments from './downloadAttachments/downloadAttachments'
import Steps from './steps/steps'
import OptionsModal from './optionsModal/optionsModal'
import MessageHeader from './messageHeader/messageHeader'
import Reasoning from './reasoning/reasoning'

import {ChatEvent, PlanEvent} from '../../types'
import {ArtifactMetadata} from '../../types/FileData'
import {FrontendContext} from '../../interfaces/platform'

import {
  combineDebugResponses,
  formatUserCommand,
  getEventFlags,
  isPlanCompleted,
  isPlanPending,
  hasRemoteDomContent,
  getRemoteDomUrl,
} from './message-helpers'

import './message.scss'

interface MessageProps {
  msg: ChatEvent
  isLatestMessage: boolean | undefined
  chatUUID: string
  onSave: () => void
  onSaveSelection: (index: number | number[]) => void
  setIsEditPage: (e: boolean) => void
  isDarkTheme: boolean
  frontendClient?: FrontendContext
  // Add RemoteDomRenderer component as a prop
  RemoteDomRenderer?: React.ComponentType<any>
  // flag to use textual markdown plan instead of interactive Plan component
  useTextualPlan?: boolean
}

export const Message: React.FC<MessageProps> = ({
  msg,
  isLatestMessage,
  chatUUID,
  onSave,
  onSaveSelection,
  setIsEditPage,
  isDarkTheme,
  frontendClient,
  RemoteDomRenderer,
  useTextualPlan = true,
}) => {
  const {event, headers} = msg
  const [expandSteps, setExpandSteps] = useState<boolean>(false)
  const [expandReasoning, setExpandReasoning] = useState<boolean>(false)
  const [expandDetails, setExpandDetails] = useState<boolean>(false) // show chat session id/ request id
  const [idDetailType, setIdDetailType] = useState<
    'chatUUID' | 'reqID' | 'debug'
  >('reqID')

  let reqId = ''
  if (headers !== undefined) {
    reqId = headers.get('x-request-id')
  }

  const {
    isAgent,
    isOnlyAgentMessage,
    isSelectionMessage,
    isUser,
    isUserMessage,
    isUserCommand,
    isPlanEvent,
    isFirstMessage,
  } = getEventFlags(event)

  let attachments: ArtifactMetadata[] = []
  let suggested_actions: Array<string> = []
  let first_actions: Array<{icon: any; message: string}> = []
  let debugResponse: string = ''

  if (isAgent || isOnlyAgentMessage) {
    suggested_actions = event.suggested_actions ?? []
    if (isFirstMessage) {
      first_actions = event.first_actions ?? []
    }

    attachments =
      event.response_details?.flatMap(
        (r: {artifacts?: ArtifactMetadata[]}) => r.artifacts || [],
      ) ?? []

    if (isAgent) {
      debugResponse =
        event.response_details?.length > 0 &&
        combineDebugResponses(event.response_details)
    }

    if (isOnlyAgentMessage && event.system_response) {
      debugResponse = event.system_response
    }
  }

  const showReasoning = (event: PlanEvent) => {
    return isPlanEvent && event.reasoning //&& !isPlanCompleted(event)
  }

  const showReadonlySteps = (event: PlanEvent) => {
    return isPlanEvent && isPlanCompleted(event)
  }

  // Render a placeholder if RemoteDomRenderer is not provided
  const renderRemoteDomContent = () => {
    if (!RemoteDomRenderer) {
      return (
        <div
          style={{
            height: '400px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e0e0e0',
            padding: '16px',
            borderRadius: '4px',
            backgroundColor: isDarkTheme ? '#1e1e1e' : '#ffffff',
            color: isDarkTheme ? '#ffffff' : '#333333',
          }}
        >
          RemoteDomRenderer component not provided
        </div>
      )
    }

    return (
      <RemoteDomRenderer
        url={getRemoteDomUrl(event) ?? ''}
        height='400px'
        width='100%'
        isDarkTheme={isDarkTheme}
        details={event.response_details}
      />
    )
  }

  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      {/*
        !isToolcallApprovalEvent allows the toolcall to *look*
        like its part of the message above it, even though its
        a separate item in messages array
      */}
      {isUser && <p className='sender-type'>You {msg.timestamp}</p>}

      {!isUser && (
        <MessageHeader
          timestamp={msg.timestamp}
          isDarkTheme={isDarkTheme}
          showSteps={showReadonlySteps(msg.event)}
          showReasoning={showReasoning(msg.event)}
          expandSteps={expandSteps}
          setExpandSteps={setExpandSteps}
          expandReasoning={expandReasoning}
          setExpandReasoning={setExpandReasoning}
          debugResponse={debugResponse}
          setExpandDetails={setExpandDetails}
          setIdDetailType={setIdDetailType}
        />
      )}

      {showReadonlySteps(msg.event) && (
        <HeadlessAccordion open={expandSteps}>
          <Steps
            executed_toolcalls={event.executed_toolcalls}
            planned_toolcalls={event.planned_toolcalls}
          />
        </HeadlessAccordion>
      )}

      {showReasoning(msg.event) && (
        <HeadlessAccordion
          className='reasoning-container'
          open={expandReasoning}
        >
          <Reasoning reasoning={event.reasoning} />
        </HeadlessAccordion>
      )}

      <div className='chat-bubble'>
        {(isAgent || isOnlyAgentMessage || isSelectionMessage) && (
          <Block blockInfo={event.agent_message} />
        )}

        {isUserMessage && event.message}

        {isUserCommand &&
          event.command &&
          formatUserCommand(event.command, event.args)}

        {isAgent && isFirstMessage && first_actions.length > 0 && (
          <FirstActions firstActionList={first_actions} />
        )}

        {(isAgent || isSelectionMessage) && (
          <>
            <ResponseDetails
              details={event.response_details}
              isLatestMessage={isLatestMessage}
              onSaveSelection={onSaveSelection}
              eventType={event.type}
            />

            {/* Render remote DOM content if available */}
            {hasRemoteDomContent(event) && (
              <div className='remote-dom-container'>
                {renderRemoteDomContent()}
              </div>
            )}
          </>
        )}

        {/* show disabled former plans */}
        {!useTextualPlan && (
          <ReadonlyPlanWrapper
            event={event}
            isPlanEvent={isPlanEvent}
            isSelectionMessage={isSelectionMessage}
            isLatestMessage={isLatestMessage}
          />
        )}

        {/* show textual plan if enabled + there are planned_toolcalls > 0 */}
        {useTextualPlan && isPlanEvent && isPlanPending(event) && (
          <TextualPlan
            title={event.plan_title ?? 'Proposed Plan'}
            event={event}
          />
        )}

        {/* single active plan */}
        {!useTextualPlan && isLatestMessage && (
          <Plan
            title={event.plan_title ?? 'Proposed Plan'}
            nonEditable={!isLatestMessage}
            onSave={onSave}
            setIsEditPage={setIsEditPage}
          />
        )}

        {/* download attachments */}
        {(isAgent || isSelectionMessage) && (
          <DownloadAttachments
            chatUUID={chatUUID}
            attachments={attachments}
            frontendClient={frontendClient}
          />
        )}

        {/* suggested next actions */}
        {(isAgent || isOnlyAgentMessage) &&
          !isFirstMessage &&
          suggested_actions?.length > 0 && (
            <NextActions
              nextActionList={suggested_actions}
              nonEditable={!isLatestMessage}
            />
          )}
      </div>

      <OptionsModal
        chatUUID={chatUUID}
        reqId={reqId}
        debugResponse={debugResponse}
        idDetailType={idDetailType}
        expandDetails={expandDetails}
        setExpandDetails={setExpandDetails}
      />
    </div>
  )
}
