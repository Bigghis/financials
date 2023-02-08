import React from 'react';
import NoData from './NoData';
import styles from '../styles/SimpleTable.module.css'

function SimpleTable({ title, data }) {

    const tableHeader = title ? <th colSpan={2}>{title}</th> : null;

    const keys = Object.keys(data);
    if (keys.length === 0) 
    {
        return (<NoData />)
    }
    const randKeyPart = Math.random()
    const trows = keys.map((key, index) => (<tr key={`simpleTable_tr_${randKeyPart}_${index}`}><td>{key}</td><td>{data[key]}</td></tr>));
    return (<table className={styles.simpleTable}>
        {tableHeader}
         {trows}
    </table>);
}

export default SimpleTable
