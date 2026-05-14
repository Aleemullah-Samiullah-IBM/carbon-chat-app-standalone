import {RefObject} from 'react'
import WatsonIcon from '../../icons/icons'
import {Block} from '../../block/block'
import './streamingMessage.scss'

export type StreamingChunk = {
  type: 'status-update' | 'thought-update' | 'partial-output' | string
  text: string
}

/* display active streaming content until the final 'agent-event' message
arrives and the final message is added to the messages array */
export const StreamingMessage = ({
  streamingContent,
  streamingComplete,
  isDarkTheme,
  tailRef,
}: {
  streamingContent: StreamingChunk[]
  streamingComplete: boolean
  isDarkTheme: boolean
  tailRef?: RefObject<HTMLDivElement | null>
}) => {
  const lastStatusIdx = (() => {
    for (let i = streamingContent.length - 1; i >= 0; i--) {
      if (streamingContent[i].type === 'status-update') return i
    }
    return -1
  })()

  // Consecutively display status-update and partial-output chunks
  // for the latter, render them as markdown blocks
  const renderContent = () => {
    const elements: JSX.Element[] = []
    let partialOutputBuffer = ''
    let bufferStartIndex = -1

    streamingContent.forEach((chunk, index) => {
      if (chunk.type === 'partial-output') {
        // accumulate partial-output chunks until a non-partial-output chunk is encountered
        if (bufferStartIndex === -1) {
          bufferStartIndex = index
        }
        partialOutputBuffer += chunk.text
      } else {
        // flush out any accumulated partial-output as a markdown Block
        if (partialOutputBuffer) {
          elements.push(
            <Block
              key={`block-${bufferStartIndex}`}
              blockInfo={partialOutputBuffer}
            />,
          )
          partialOutputBuffer = ''
          bufferStartIndex = -1
        }

        // render status-update
        if (chunk.type === 'status-update') {
          elements.push(
            <strong
              key={index}
              className='status-update'
            >
              {chunk.text}

              {/* show fading dots animation */}
              {!streamingComplete && index === lastStatusIdx && (
                <span
                  className='dots-fade'
                  aria-hidden='true'
                >
                  <span className='dot'>.</span>
                  <span className='dot'>.</span>
                  <span className='dot'>.</span>
                </span>
              )}
            </strong>,
          )
        }
      }
    })

    // flush any remaining partial-output
    if (partialOutputBuffer) {
      elements.push(
        <Block
          key={`block-${bufferStartIndex}`}
          blockInfo={partialOutputBuffer}
        />,
      )
    }

    return elements
  }

  return (
    <div className='message bot'>
      <header className='sender-type'>
        <WatsonIcon fill={isDarkTheme ? '#ffffff' : '#000000'} />
        <span className='bot-header'>
          watsonx {new Date().toLocaleTimeString()}
        </span>
      </header>

      <div className='chat-bubble'>
        <div className='streaming-content'>
          <div
            className={`streaming-text ${streamingComplete ? 'complete' : ''}`}
          >
            {renderContent()}

            <div
              ref={tailRef}
              style={{height: 1, width: 1}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
