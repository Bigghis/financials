import React, { useMemo } from 'react'
import Table from './Table'
import styles from '../styles/Table.module.css';

const DCFTable = ({data, clearCallback}) => {

    const columns = React.useMemo(
        () => [
          {
            Header: 'Stock',
            accessor: 'stock',
            className: styles.sticky,
            headerClassName: styles.sticky
          },
          {
            Header: 'Free Cash Flow',
            accessor: 'freeCashFlow'
          },
          {
            Header: 'Total Debt',
            accessor: 'totalDebt'
          },
          {
            Header: 'Shares Outstanding',
            accessor: 'sharesOutstanding'
          },
          {
            Header: 'Future Years',
            accessor: 'futureYears',
            Cell: props => `${props.value}`
          },
          {
            Header: 'Discount Rate',
            accessor: 'discountRate'
          },
          {
            Header: 'Growth Rate',
            accessor: 'growthRate'
          },
          {
            Header: 'TV Growth Rate',
            accessor: 'longTermGrowthRate'
          },
          {
            Header: 'Price',
            accessor: 'price',
            Cell: props => `${props.value}${props.row.original.currency}`
          },
          {
            Header: 'Forecast Price',
            accessor: 'forecastPrice',
            Cell: props => `${props.value}${props.row.original.currency}`
          },
          {
            Header: 'Safety Margin',
            accessor: 'safetyMargin',
            style: {
              textAlign: 'center'
              
            },
            Cell: props => { 
              const _v = parseInt(props.value);
              let color = '#e74c3c';
              if (_v > 30  && _v < 45) {
                color ='#f0ad4e';
              } 
              if (_v >= 45) {
                color ='#28cd53';
              }
              return (<div style={{ color}}>
                  {props.value}
              </div>)
               }
          },
/*   
        {
            Header: 'Future years',
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
          */
        ],
        []
      )
    return (<Table tableType="DCF" columns={columns} data={data || []} useTableButtons clearCallback={clearCallback} />)
}

export default DCFTable;