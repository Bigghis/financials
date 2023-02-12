import React, { useContext, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import Table from './Table';
import NoData from './NoData';
import TableButtons from './TableButtons';
import {
    showAllYearsDataRange,
    getInitialData
} from '../logic/models/Info';

import styles from '../styles/Home.module.css'
import tableStyles from '../styles/Table.module.css';

export default function InfoCmp({ data, infoData, dataCallback }) {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(getInitialData(data));

    const getColumns = () => {
        let cols = [];
        if (data) {
            const years = [...new Set(showAllYearsDataRange(data).incomeStatementHistory)];
            let _cols = [];
            if (years && years.length > 0) {
                _cols = years.map(year => {
                    const yearString = year.toString();
                    return {
                        Header: yearString,
                        className: tableStyles.infoCol,
                        //  width: 140,
                        accessor: yearString
                    };
                });

                _cols = _cols.reverse();
            }

            cols = [{
                Header: '',
                accessor: 'metricName',
                className: tableStyles.sticky,
                headerClassName: tableStyles.sticky,
                Cell: (props) => <b>{props.value}</b>
            },
            ..._cols];
        }
        return cols;
    }

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {

        setInfo(info =>
            info.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...info[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    const _renderData = () => {
        if (info && Object.keys(info).length > 0) {
            return (<div className={styles.containerTabFlexUl}>
                <TableButtons dataType={"INFO"} data={[...info._income, ...info._returns, ...info._balance]} />
                <Table
                    title="Income"
                    tableType="INFO"
                    className={tableStyles.infoTable}
                    data={info._income}
                    columns={getColumns()}
                    updateMyData={updateMyData}
                />
                <Table
                    title="Returns"
                    tableType="INFO"
                    className={tableStyles.infoTable}
                    data={info._returns}
                    columns={getColumns()}
                    updateMyData={updateMyData}
                />
                <Table
                    title="from Balance Sheet"
                    tableType="INFO"
                    className={tableStyles.infoTable}
                    data={info._balance}
                    columns={getColumns()}
                    updateMyData={updateMyData}
                />
            </div>);
        }
        return (<NoData />);
    }
    return (<div>
        {loading && <div className={styles.spinner}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
        <h4 className={styles.subtitle}>
            Info
        </h4>
        {_renderData()}
    </div>)
}
