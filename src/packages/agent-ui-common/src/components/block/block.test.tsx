import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Block} from './block'

describe('Block', () => {
  it('renders nothing when blockInfo is empty', () => {
    const {container} = render(<Block blockInfo='' />)
    const blockContainer = container.querySelector('.block-container')
    expect(blockContainer?.innerHTML.trim()).toBe('')
  })

  it('renders markdown content when blockInfo is provided', () => {
    const markdownText = '# Hello World\n\nThis is **bold** text.'
    render(<Block blockInfo={markdownText} />)

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(
      'Hello World',
    )

    expect(
      screen.getByText(
        (_, element) => element?.textContent === 'This is bold text.',
      ),
    ).toBeInTheDocument()
  })

  it('renders raw HTML if included in markdown', () => {
    const htmlMarkdown = 'This is <span style="color:red">red</span> text.'
    render(<Block blockInfo={htmlMarkdown} />)

    const span = screen.getByText('red')
    expect(span).toBeInTheDocument()
    expect(span).toHaveStyle('color: rgb(255, 0, 0);')
  })
})
