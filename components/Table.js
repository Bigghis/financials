import { useContext } from 'react'
import React from 'react';
import { useTable } from 'react-table'
import { SettingsContext } from '../context/SettingsContext';

import styles from '../styles/Table.module.css'
import TableButtons from './TableButtons';

const COLORS = ['red', 'limegreen', 'green'];
const LOCALE = 'it-IT';

const formatValue = (value, divide) => {
  const _value = parseFloat(value / divide);
  const retValue = new Intl.NumberFormat(LOCALE).format(parseFloat(_value).toFixed(2));
  if (_value < 0) {
    return (<div style={{ color: '#e74c3c' }}>{`(${Math.abs(_value).toFixed(2)})`}</div>)
  } 
  return retValue;
};

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
    if (typeof initialValue === 'string') {
      return initialValue
    }
    if (typeof initialValue === 'object' && initialValue !== null) {
      return (<div
      className={styles.cellIndustryCompare}
      title={`industry value: ${initialValue.industryValue}`}
        style={{
          color: `${COLORS[initialValue.scale]}`,
          fontWeight: 'bold'
        }}
      >{initialValue.value}</div>)
    }
    let retValue = initialValue
    if (unit === 'k') {
      retValue = formatValue(initialValue, 1000);
    }
    if (unit === 'm') {
      retValue = formatValue(initialValue, 1000000);
    }
    if (unit === 'b') {
      retValue = formatValue(initialValue, 1000000000);
    }
    if (retValue < 0) {
      return (<div style={{ color: '#e74c3c' }}>{`(${Math.abs(retValue)})`}</div>)
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

const Table = ({ columns, data, updateMyData, className, useTableButtons, clearCallback, tableType, title }) => {
  const {
    getTableProps,
    getTableBodyProps,
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

  const renderTop = () => {
    if (title || useTableButtons) {
      return (<div className={title ? styles.tableTopContainer : styles.tableTopContainerOnly}>
        {title && <div className={styles.tableTitle}>{title}</div>}
        {useTableButtons && <TableButtons dataType={tableType} data={data} clearCallback={clearCallback} />}
      </div>)
    }
    return null;
  }

  // Render the UI for your table
  return (<>
    {renderTop()}
    <div className={styles.tableContainer}>
      <table {...getTableProps()} className={_className.join(" ")} >
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={`${tableType}_${i}_header_group`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                const e = column.render('Header')
                return (<th {...column.getHeaderProps()} key={`${tableType}_header_${i}_${index}`} className={column.className}>{column.render('Header')}</th>)
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr key={`${tableType}_${i}_row`} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return <td key={`${tableType}_${i}_cell_${index}`} {...cell.getCellProps()} className={cell.column.className}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </>
  )
}

export default Table
