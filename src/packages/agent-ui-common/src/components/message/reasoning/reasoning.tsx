import {JSX} from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import './reasoning.scss'

interface ReasoningProps {
  reasoning: string
}

const Reasoning = ({reasoning}: ReasoningProps): JSX.Element | null => {
  if (!reasoning) {
    return null
  }

  let markdown = (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className='markdown'
    >
      {reasoning}
    </Markdown>
  )

  return (
    <div className='reasoning-block'>
      <span className='reasoning-content'>{markdown}</span>
    </div>
  )
}

export default Reasoning
