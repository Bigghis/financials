import React, { useMemo } from 'react'
import Table from './Table'

const InfoTable = ({columns, data}) => {

  /*
    const columns = React.useMemo(
        () => [
          {
            Header: '',
            accessor: 'stock'
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
            accessor: 'futureYears'
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
                  {`${props.value}%`}
              </div>)
               }
          },
        ],
        []
      )
      */

    return (<Table tableType="Info" columns={columns} data={data || []} />)
}

export default InfoTable;