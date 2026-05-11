import {unstable__AiSkeletonText as AiSkeletonText} from '@carbon/react'
import {ChatInstance, RenderUserDefinedState} from '@carbon/ai-chat'

import Plan from '@agent-ui/common/components/message/plan/plan'
import {Block} from '@agent-ui/common/components/block/block'
import DownloadAttachments from '@agent-ui/common/components/message/downloadAttachments/downloadAttachments'
import FirstActions from '@agent-ui/common/components/message/firstActions/firstActions'
import NextActions from '@agent-ui/common/components/message/nextActions/nextActions'
import {PlanEvent} from '@agent-ui/common/types'
import {ArtifactMetadata} from '@agent-ui/common/types/FileData'
import ApiService from '@agent-ui/common/services/apiservice'
/**
 * Handler for user_defined response types. You can just have a switch statement here and return the right component
 * depending on which component should be rendered.
 */
export function renderUserDefinedResponse(
  state: RenderUserDefinedState,
  instance: ChatInstance,
  handleMode?: (
    type: string,
    data: any,
    instance?: ChatInstance,
  ) => void | Promise<void>,
  lastMessageId?: string,
  isApprovalSubmitting?: boolean,
  apiService?: ApiService | null,
) {
  const {fullMessage, messageItem} = state

  // console.log('renderUserDefinedResponse', state, fullMessage, lastMessageId)

  if (messageItem) {
    switch (messageItem.user_defined?.type) {
      // we can prob leverage the carbon ai component's code blocks but still need to add our own carbon tooltip

      case 'attachments':
        const attachments = messageItem.user_defined?.attachments
        return (
          <DownloadAttachments
            chatUUID={messageItem.user_defined?.chatUUID as string}
            attachments={attachments as ArtifactMetadata[]}
            apiService={apiService}
          />
        )

      case 'block':
        const block = messageItem.user_defined?.block_data
        return (
          <>
            {(block as any[])?.map((details, index) => (
              <div
                className='response-details-block'
                key={index}
              >
                {details.block && <Block blockInfo={details.block} />}
              </div>
            ))}
          </>
        )

      case 'meow':
        return <span>Hello cat</span>

      case 'plan':
        return (
          <Plan
            nonEditable={fullMessage?.id !== lastMessageId}
            plan={messageItem.user_defined?.plan_data as PlanEvent}
            instance={instance}
            onSpecialSave={handleMode}
            isApprovalSubmitting={isApprovalSubmitting}
          />
        )

      case 'suggested_actions':
        return (
          <NextActions
            nextActionList={
              messageItem.user_defined?.suggested_actions_data as string[]
            }
            nonEditable={fullMessage?.id !== lastMessageId}
          />
        )

      case 'welcome':
        return (
          <FirstActions
            firstActionList={
              messageItem.user_defined?.welcome_data as Array<{
                icon: any
                message: string
              }>
            }
          />
        )

      default:
        return undefined
    }
  }

  return <AiSkeletonText width={`120px`} />
}

export default renderUserDefinedResponse
