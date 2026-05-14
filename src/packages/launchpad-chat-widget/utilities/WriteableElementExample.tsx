import {Command} from '@agent-ui/common/types'

interface WriteableElementExampleProps {
  location: string
  commands: Command[]
}

export const WriteableElementExample = ({
  location,
  commands,
}: WriteableElementExampleProps) => {
  return (
    <div className='writeable-element-external'>
      <p>
        Location: {location}. This is a writeable element with external styles.
        You can inject any custom content here. You are not constrained by any
        height.
      </p>
      <p>Some content from parent state: {JSON.stringify(commands)}</p>
    </div>
  )
}
