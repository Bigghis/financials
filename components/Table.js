import {useContext} from 'react'
import React from 'react';
import { useTable } from 'react-table'
import { SettingsContext } from '../context/SettingsContext';

import styles from '../styles/Table.module.css'

// https://codesandbox.io/s/nvndu?file=/src/App.js:1517-1530
export const EditableCell = ({
  value: initialValue,
  row, // : { index },
  column, //: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {

  const [value, setValue] = React.useState(initialValue);

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const settingsContext = useContext(SettingsContext);
  const { unit } = settingsContext;

  if (initialValue !== undefined) {
    if (typeof initialValue === 'string' ) {
      return initialValue
    }
    let retValue = initialValue
    if (unit === 'k') {
      retValue = parseFloat((initialValue / 1000).toFixed(2))
    }
    if (unit === 'm') {
      retValue = parseFloat((initialValue / 1000000).toFixed(2));
    }
    if (unit === 'b') {
      retValue = parseFloat((initialValue / 1000000000).toFixed(2));
    } 
    if (retValue < 0) {
      return (<div style={{color: '#e74c3c'}}>{`(${Math.abs(retValue)})`}</div>)
    }
    return retValue;
  }
 
  else {
    // We need to keep and update the state of the cell normally
    
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(row.index, column.id, value)
    }
  

  
    return <input className={styles.cellEdit} value={value} onChange={onChange} onBlur={onBlur} />

  }
}

const defaultColumn = {
  Cell: EditableCell
}

const Table = ({ columns, data, updateMyData, className}) => {
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
    updateMyData,
    className
  })

  let _className = [styles.reactTable];
  if (className) {
    _className.push(className)
  }

 /* // console.log("COLS COLS=", columns)
 const renderValue = (value) => {
  if (typeof value === 'string' ) {
      return value
  }
  if (unit === 'k') {
    return value / 1000
  }
  return value;
 }
 */

  // Render the UI for your table
  return (<div className={styles.tableContainer}>
            <table {...getTableProps()} className={_className.join(" ")} style={{width: '100%'}}>
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
              </table>
          </div>)
}

export default Table
