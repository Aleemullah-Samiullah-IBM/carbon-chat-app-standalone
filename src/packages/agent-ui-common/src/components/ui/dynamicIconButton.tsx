import {IconButton} from '@carbon/react'
import {Checkmark, ErrorFilled, InProgress} from '@carbon/react/icons'
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import './dynamicIconButton.scss'

type DynamicIconButtonProps = ComponentPropsWithoutRef<typeof IconButton> & {
  debounce?: boolean
}

const DynamicIconButton = forwardRef((props: DynamicIconButtonProps, ref) => {
  const {debounce, ...iconButtonProps} = props
  const [activeIcon, setActiveIcon] = useState(props.children)
  const [disabled, setDisabled] = useState(false)
  const buttonRef = useRef<HTMLElement | null>(null)

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (disabled || !props.onClick) {
      return
    }

    if (buttonRef.current) {
      buttonRef.current.blur()
    }

    if (debounce) {
      setActiveIcon(<InProgress />)
      setDisabled(true)

      try {
        props.onClick(e)
        setActiveIcon(<Checkmark />)
      } catch {
        setActiveIcon(<ErrorFilled />)
      } finally {
        setTimeout(() => {
          setActiveIcon(props.children)
          setDisabled(false)
        }, 2000)
      }
    } else {
      props.onClick(e)
    }
  }

  // Needed when icon is dynamic / toggled (ie. visible, invisible)
  useEffect(() => {
    setActiveIcon(props.children)
  }, [props.children])

  return (
    <span className='dynamic-icon-btn'>
      <IconButton
        {...iconButtonProps}
        onClick={handleClick}
        ref={ref || buttonRef}
        enterDelayMs={disabled ? 2000 : iconButtonProps.enterDelayMs}
      >
        {activeIcon}
      </IconButton>
    </span>
  )
})

export default DynamicIconButton
