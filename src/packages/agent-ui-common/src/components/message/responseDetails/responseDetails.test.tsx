import {render, screen} from '@testing-library/react'
import ResponseDetails from './responseDetails'
import SelectionTable from '../selectionTable/selectionTable'
import {vi} from 'vitest'

vi.mock('../selectionTable/selectionTable', () => ({
  default: vi.fn(() => <div data-testid='selection-table'>Mocked Table</div>),
}))

describe('ResponseDetails', () => {
  const mockOnSave = vi.fn()

  const mockDetails = [
    {
      step_id: 'step1',
      table: {
        title: 'Test Table',
        columns: ['Col1', 'Col2'],
        rows: [
          ['A1', 'A2'],
          ['B1', 'B2'],
        ],
      },
    },
    {
      step_id: 'step2',
      table: null,
    },
  ]

  it('renders SelectionTable for each detail with a table', () => {
    render(
      <ResponseDetails
        details={mockDetails}
        isLatestMessage={true}
        onSaveSelection={mockOnSave}
        eventType='selection-request'
      />,
    )

    const tables = screen.getAllByTestId('selection-table')
    expect(tables).toHaveLength(1)
  })

  // it('passes correct props to SelectionTable', () => {
  //   render(
  //     <ResponseDetails
  //       details={mockDetails}
  //       isLatestMessage={false}
  //       onSaveSelection={mockOnSave}
  //       eventType='info'
  //     />,
  //   )

  //   expect(SelectionTable).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       selectionType: 'none',
  //       title: 'Test Table',
  //       origHeaders: ['Col1', 'Col2'],
  //       origRows: [
  //         ['A1', 'A2'],
  //         ['B1', 'B2'],
  //       ],
  //       nonEditable: true,
  //       onSave: mockOnSave,
  //     }),
  //     expect.anything(),
  //   )
  // })

  it('renders nothing if details is empty', () => {
    const {container} = render(
      <ResponseDetails
        details={[]}
        isLatestMessage={true}
        onSaveSelection={mockOnSave}
        eventType='selection-request'
      />,
    )

    expect(container.firstChild).toBeEmptyDOMElement()
  })
})
