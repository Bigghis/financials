import React, { useMemo } from 'react'
import Table from './Table'

const DCFTable = ({data}) => {

    const columns = React.useMemo(
        () => [
          {
            Header: 'Stock',
            accessor: 'stock',
      

          },
          {
            Header: 'Free Cash Flow',
            accessor: 'freeCashFlow',
          },
          {
            Header: 'Total Debt',
            accessor: 'totalDebt',
          },
          {
            Header: 'Shares Outstanding',
            accessor: 'sharesOutstanding',
          },
          {
            Header: 'Future Years',
            accessor: 'futureYears',
          },
          {
            Header: 'Discount Rate',
            accessor: 'discountRate',
            Cell: props => `${props.value}%`
          },
          {
            Header: 'Growth Rate',
            accessor: 'growthRate',
            Cell: props => `${props.value}%`
          },
          {
            Header: 'TV Growth Rate',
            accessor: 'longTermGrowthRate',
            Cell: props => `${props.value}%`
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
              textAlign: 'center',
              
            },
            Cell: props => { 
              const _v = parseInt(props.value);
              let color = 'red';
              if (_v > 30  && _v < 45) {
                color ='yellow';
              } 
              if (_v >= 45) {
                color ='green';
              }
              return (<div style={{ color}}>
                  {`${props.value}%`}
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
    return (<Table columns={columns} data={data || []} />)
}

export default DCFTable;