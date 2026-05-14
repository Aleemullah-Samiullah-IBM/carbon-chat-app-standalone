import {render, screen} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import HeadlessAccordion from './headlessAccordion'

describe('HeadlessAccordion', () => {
  it('renders the AccordionItem inside a <ul>', () => {
    const {container} = render(
      <HeadlessAccordion title='Test Title'>Test Content</HeadlessAccordion>,
    )

    const ul = container.querySelector('ul.headless-accordion-item-container')
    expect(ul).toBeInTheDocument()

    const accordionItem = container.querySelector('.headless-accordion-item')
    expect(accordionItem).toBeInTheDocument()
  })

  it('renders children inside the AccordionItem', () => {
    render(
      <HeadlessAccordion title='Test Title'>
        <div>Accordion Content</div>
      </HeadlessAccordion>,
    )

    expect(screen.getByText('Accordion Content')).toBeInTheDocument()
  })

  it('applies additional className from props', () => {
    const {container} = render(
      <HeadlessAccordion
        title='Test Accordion Title'
        className='test-class'
      >
        Accordion Content
      </HeadlessAccordion>,
    )

    const accordionItem = container.querySelector('.headless-accordion-item')
    expect(screen.getByText('Accordion Content')).toBeInTheDocument()
    expect(accordionItem?.classList.contains('test-class')).toBe(true)
  })
})
