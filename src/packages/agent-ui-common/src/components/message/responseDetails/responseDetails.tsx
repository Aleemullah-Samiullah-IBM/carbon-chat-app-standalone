import SelectionTable from '../selectionTable/selectionTable'

interface ResponseDetailsProps {
  details?: any[]
  isLatestMessage: boolean
  onSaveSelection: (data: any) => void
  eventType: string
}

const ResponseDetails: React.FC<ResponseDetailsProps> = ({
  details = [],
  isLatestMessage,
  onSaveSelection,
  eventType,
}) => {
  return (
    <div className='response-details'>
      {details.map(({step_id, table, output}) => {
        // Render a selection-table if available, no more showing normal tables
        if (table && eventType === 'selection-request') {
          return (
            <div
              className='response-details-block'
              key={step_id}
            >
              <SelectionTable
                selectionType='selection'
                title={table.title}
                origHeaders={table.columns}
                origRows={table.rows}
                nonEditable={!isLatestMessage}
                onSave={onSaveSelection}
              />
            </div>
          )
        }
        // Render text output if available
        // if (output) {
        //   return <p key={step_id}>{output}</p>
        // }
        // Return null if neither table nor output is available
        return null
      })}
    </div>
  )
}

export default ResponseDetails
