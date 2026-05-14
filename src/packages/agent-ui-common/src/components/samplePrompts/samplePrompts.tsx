import {CopyButton, Tile} from '@carbon/react'

import './samplePrompts.scss'

interface SamplePromptsModalProps {
  prompts: string[]
}

export const SamplePromptsModal: React.FC<SamplePromptsModalProps> = ({
  prompts,
}) => {
  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
  }

  return (
    <div className='sample-prompts-container'>
      <div className='prompt-list'>
        {prompts.map((prompt: string) => (
          <Tile
            className='prompts-list-item'
            key={`prompt_${prompt}`}
          >
            <div className='prompt-content'>
              <div className='prompt-title'>{prompt}</div>
            </div>
            <div className='prompt-copy-button'>
              <CopyButton
                align='left'
                onClick={() => copyPrompt(prompt)}
              />
            </div>
          </Tile>
        ))}
      </div>
    </div>
  )
}
