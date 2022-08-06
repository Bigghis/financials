import React from 'react'
import { useTable } from 'react-table'

import styles from '../styles/Table.module.css'

/* const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
` */

// https://codesandbox.io/s/nvndu?file=/src/App.js:1517-1530
export const EditableCell = ({
  value: initialValue,
  row, // : { index },
  column, //: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  if (initialValue !== undefined) {
    return initialValue
  }
 
  else {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(row.index, column.id, value)
    }
  
    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return <input className={styles.cellEdit} value={value} onChange={onChange} onBlur={onBlur} />

  }
}

const defaultColumn = {
  Cell: EditableCell
}

const Table = ({ columns, data, updateMyData }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    tableType,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn,
    updateMyData
  })

  // Render the UI for your table
  return (<table {...getTableProps()} className={styles.reactTable}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr key={`${tableType}_${i}_header_group`} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => (
              <th {...column.getHeaderProps()} key={`${tableType}_header_${i}_${index}`} >{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr key={`${tableType}_${i}_row`} {...row.getRowProps()}>
              {row.cells.map((cell, index) => {
                return <td  key={`${tableType}_${i}_cell_${index}`} {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>)
}

/* function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(20), [])

  return (
   
      <Table columns={columns} data={data} />
 
  )
} */

export default Table
