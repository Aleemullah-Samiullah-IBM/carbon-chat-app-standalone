import React, {useState} from 'react'
import {
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  unstable__ChatButton as ChatButton,
} from '@carbon/react'

import {Copy} from '@carbon/react/icons'

import {useMyContext} from '../../../contexts/ChatContext'

import {Block} from '../../block/block'
import DynamicIconButton from '../../ui/dynamicIconButton'

import './selectionTable.scss'

interface SelectionTableProps {
  selectionType: 'none' | 'selection' | 'multi-selection'
  title?: string
  origHeaders: any[]
  origRows: any[]
  preSelectedRows?: number[]
  nonEditable?: boolean
  onSave: (index: number | number[]) => void
}

// displays a plain table, a single-selection table, or a multi-selection table
// for the selection action, it will either send back the index of the single selection (number)
// or an array of selections (number[])
const SelectionTable: React.FC<SelectionTableProps> = ({
  selectionType,
  title = '',
  origHeaders = [],
  origRows = [],
  preSelectedRows = [],
  nonEditable = true,
  onSave,
}) => {
  const {isApprovalSubmitting} = useMyContext()

  // pagination
  const [offset, setOffset] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [pageSizes] = useState([5, 10, 15, 20, 25])
  const [currentPage, setCurrentPage] = useState(
    Math.floor(offset / pageSize) + 1 || 1,
  )

  // for selection
  const [selectedRows, setSelectedRows] = useState<any[]>(preSelectedRows)

  // for detail expand
  const [expandedRowIds, setExpandedRowIds] = useState(new Set())
  const [allRowsExpanded, setAllRowsExpanded] = useState(false)

  // transform passed-in headers and rows into consumable format for Carbon DataTable

  // headers is *always* 1 column, it uses the table title (not the first column of the table)
  const headers =
    origHeaders.length > 0
      ? [
          {
            key: origHeaders[0].data_key,
            header: origHeaders[0].title,
          },
        ]
      : []
  const allHeaderKeysExceptFirst = origHeaders.map(row => row.data_key).slice(1)

  const rows = origRows.map((item, index) => ({
    id: String(index),
    ...item,
  }))

  // interactive table helpers

  // for single selection
  const handleRowSingleSelection = (rowId: string) => {
    setSelectedRows([rowId])
  }

  // for multi selection
  const handleRowSelection = (rowId: string, isSelected: boolean) => {
    setSelectedRows(prevSelectedRows =>
      isSelected
        ? [...prevSelectedRows, rowId]
        : prevSelectedRows.filter(id => id !== rowId),
    )
  }

  // for multi selection - all
  const handleAllRowSelection = (isSelected: boolean) => {
    setSelectedRows(isSelected ? rows.map(row => row.id) : [])
  }

  const isAllRowsSelected = () => {
    const selectedCount = rows.filter(row =>
      selectedRows.includes(row.id),
    ).length

    if (selectedCount === 0) return false
    if (selectedCount === rows.length) return true
    return 'indeterminate'
  }

  // for expand - all
  const toggleAllRowsExpansion = () => {
    if (allRowsExpanded) {
      setExpandedRowIds(new Set())
      setAllRowsExpanded(false)
    } else {
      const expandedIds = new Set(rows.map(row => row.id))
      setExpandedRowIds(expandedIds)
      setAllRowsExpanded(true)
    }
  }

  // for example - single
  const handleRowToggle = (rowId: string) => {
    setExpandedRowIds(prev => {
      const expanded = new Set(prev)
      if (expanded.has(rowId)) {
        expanded.delete(rowId)
      } else {
        expanded.add(rowId)
      }
      return expanded
    })
  }

  const handleContinue = () => {
    // return the selected index (number) or indices (number[])
    const indicesArr = selectedRows.map(id =>
      rows.findIndex(obj => obj.id === id),
    )

    if (indicesArr.length === 1) {
      onSave(indicesArr[0])
    } else {
      onSave(indicesArr)
    }
  }

  const handleNone = () => {
    onSave(-1)
  }

  // in twisty details, key should fetch the readable label from origHeaders
  const getLabel = (key: string) => {
    const row = origHeaders.find(item => item.data_key === key)
    return row ? row.title : key
  }

  const getCellFormatType = (key: string): 'markdown' | 'plain' | 'secret' => {
    return origHeaders.find(item => item.data_key === key)?.format
  }

  const constructValue = (k: string, v: any) => {
    const value = typeof v === 'string' ? v : JSON.stringify(v, null, 2)
    const secretType = getCellFormatType(k)

    switch (secretType) {
      case 'secret':
        return <SecretPassword value={value} />
      case 'markdown':
        return <Block blockInfo={value} />
      case 'plain':
        return value
      default:
        return value
    }
  }

  return (
    <div className='table-selection'>
      {/*
        Note: Carbon React DataTable v1.87.0 shows a prop-types warning that children
        should be a ReactNode, but DataTable actually expects a render function (which
        we're correctly providing). This appears to be a prop-types definition issue in
        the library. The component functions correctly despite the warning.
      */}
      <DataTable
        rows={rows}
        headers={headers}
        {...(selectionType === 'selection' ? {radio: true} : {})}
      >
        {({
          rows,
          headers,
          getExpandHeaderProps,
          getRowProps,
          getSelectionProps,
          getTableProps,
          getTableContainerProps,
        }) => {
          return (
            <>
              <TableContainer
                title=''
                description=''
                {...getTableContainerProps()}
              >
                <Table
                  {...getTableProps()}
                  aria-label='selection table'
                >
                  <TableHead>
                    <TableRow>
                      <TableExpandHeader
                        enableToggle
                        {...getExpandHeaderProps()}
                        isExpanded={rows.every(row => row.isExpanded === true)}
                        onClick={toggleAllRowsExpansion}
                        aria-label='expand row'
                      />

                      {selectionType === 'selection' && <th scope='col' />}

                      {selectionType === 'multi-selection' && (
                        <TableSelectAll
                          {...getSelectionProps()}
                          indeterminate={
                            isAllRowsSelected() === 'indeterminate'
                          }
                          checked={isAllRowsSelected() === true}
                          disabled={isApprovalSubmitting || nonEditable}
                          onSelect={() => {
                            handleAllRowSelection(
                              !rows.some(row => selectedRows.includes(row.id)),
                            )
                          }}
                        />
                      )}

                      {/* using table title, rather than column name */}
                      <TableHeader>{title}</TableHeader>
                    </TableRow>
                  </TableHead>

                  <TableBody className='table-body'>
                    {rows
                      .slice(offset, offset + pageSize) // filter rows for client-side pagination
                      .map((row, index) => {
                        const {key, ...rowProps} = getRowProps({row})
                        return (
                          <React.Fragment key={row.id}>
                            <TableExpandRow
                              {...rowProps}
                              isExpanded={expandedRowIds.has(row.id)}
                              onExpand={() => handleRowToggle(row.id)}
                            >
                              {selectionType === 'selection' && (
                                <TableSelectRow
                                  {...getSelectionProps({
                                    row: row,
                                    disabled: isApprovalSubmitting || nonEditable,
                                    onChange: () => {
                                      handleRowSingleSelection(row.id)
                                    },
                                  })}
                                  checked={selectedRows.includes(row.id)}
                                />
                              )}

                              {selectionType === 'multi-selection' && (
                                <TableSelectRow
                                  {...getSelectionProps({
                                    row,
                                  })}
                                  disabled={isApprovalSubmitting || nonEditable}
                                  checked={selectedRows.includes(row.id)}
                                  onSelect={() => {
                                    handleRowSelection(
                                      row.id,
                                      !selectedRows.includes(row.id),
                                    )
                                  }}
                                />
                              )}

                              {row.cells.map(cell => (
                                <TableCell key={cell.id}>{cell.value}</TableCell>
                              ))}
                            </TableExpandRow>

                            <TableExpandedRow
                              colSpan={
                                headers.length + (selectionType === 'none' ? 1 : 2)
                              }
                              className='expanded-row'
                            >
                              {origRows[index + offset] ? (
                                <ul>
                                  {Object.entries(origRows[index + offset])
                                    // filter out keys *not* in origHeaders and the first one (which is the row header)
                                    .filter(([key]) =>
                                      allHeaderKeysExceptFirst.includes(key),
                                    )
                                    .map(([key, value]) => (
                                      <li
                                        key={key}
                                        className='detail-item'
                                      >
                                        <strong className='key'>
                                          {getLabel(key)}
                                        </strong>

                                        {constructValue(key, value)}
                                      </li>
                                    ))}
                                </ul>
                              ) : (
                                <div>No details available for this item.</div>
                              )}
                            </TableExpandedRow>
                          </React.Fragment>
                        )
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )
        }}
      </DataTable>

      {(origRows.length || 0) > 5 && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          pageSizes={pageSizes}
          totalItems={origRows.length || 0}
          onChange={({page, pageSize}) => {
            setCurrentPage(page)
            setPageSize(pageSize)
            setOffset((page - 1) * pageSize)
          }}
        />
      )}
      

      {/* should only be enabled if user has something selected in selection or multi-selection mode */}
      {selectionType !== 'none' && (
        <div className='action-buttons'>
          <ChatButton
            isQuickAction
            disabled={isApprovalSubmitting || nonEditable}
            onClick={handleNone}
          >
            Select none
          </ChatButton>

          <ChatButton
            isQuickAction
            disabled={
              selectedRows.length === 0 || isApprovalSubmitting || nonEditable
            }
            onClick={handleContinue}
          >
            Continue
          </ChatButton>
        </div>
      )}
    </div>
  )
}

// Consider giving this component its own file in the future
interface SecretPasswordProps {
  value: string
}
const SecretPassword = (props: SecretPasswordProps) => {
  // const [visible, setVisible] = useState(false)
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const visible = false

  return (
    <div className='secret-wrapper'>
      <span className='secret-text'>
        <text
          className={visible ? 'secret-text-visible' : 'secret-text-hidden'}
        >
          {visible
            ? props.value
            : Array(Math.min(18, props.value.length)).fill('*')}
        </text>
      </span>
      <div className='secret-actions'>
        <DynamicIconButton
          label='Copy'
          onClick={() => handleCopyToClipboard(props.value)}
          size='sm'
          align='bottom'
          enterDelayMs={250}
          leaveDelayMs={0}
          debounce
        >
          <Copy />
        </DynamicIconButton>

        {/* <DynamicIconButton
          label='Visibility'
          onClick={() => setVisible(prev => !prev)}
          size='sm'
          align='bottom'
          enterDelayMs={250}
          leaveDelayMs={0}
        >
          {!visible ? <View /> : <ViewOff />}
        </DynamicIconButton> */}
      </div>
    </div>
  )
}

export default SelectionTable
