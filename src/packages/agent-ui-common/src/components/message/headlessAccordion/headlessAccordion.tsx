import {AccordionItem} from '@carbon/react'
import './headlessAccordion.scss'

interface HeadlessAccordionProps
  extends React.ComponentProps<typeof AccordionItem> {}

const HeadlessAccordion = (props: HeadlessAccordionProps) => {
  return (
    <ul className='headless-accordion-item-container'>
      <AccordionItem
        {...props}
        className={`headless-accordion-item ${props.className}`}
      >
        {props.children}
      </AccordionItem>
    </ul>
  )
}

export default HeadlessAccordion
