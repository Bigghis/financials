import React, { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import SimpleTable from './SimpleTable';
import {
    getMultiplesData,
    getMarginsData
} from '../logic/models/Info';

import styles from '../styles/Home.module.css'

export default function MultiplesCmp({ data }) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (<div>
        {loading && <div className={styles.spinnerTab}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
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
