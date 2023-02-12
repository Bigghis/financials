import React, { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import Table from './Table';
import {
    getMultiplesData,
    getMarginsData
} from '../logic/models/Info';

import styles from '../styles/Home.module.css'
import tableStyles from '../styles/Table.module.css';
import NoData from './NoData';
import TableButtons from './TableButtons';
import SimpleTable from './SimpleTable';

export default function MultiplesCmp({ data }) {
    const [loading, setLoading] = useState(false);

    return (<div>
        {loading && <div className={styles.spinner}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
        <h4 className={styles.subtitle}>
            Multiples
        </h4>
        <div className={styles.infoStockContainer}>
            <SimpleTable
                title="Multiples"
                zebra
                data={getMarginsData(data)}
            />
            <SimpleTable
                zebra
                title="Margins"
                data={getMultiplesData(data)}
            />
        </div>
    </div>)
}
