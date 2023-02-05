import React, { useContext, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import ReactTooltip from 'react-tooltip';
import { DataContext } from '../context/DataContext';
import Table from './Table';

import { getCapitalAllocation } from '../logic/models/Qualitative'; 

import NoData from './NoData';
import InfoIcon from './InfoIcon';

import homeStyles from '../styles/Home.module.css'
import styles from '../styles/CalcInfo.module.css';
import tableStyles from '../styles/Table.module.css';

import texts from '../info/texts.json';

export default function Qualitative({ title, data }) {
    const [loading, setLoading] = useState(false);
    const txt = texts.qualitative;

    //initiaData..
    const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext;
//CapitalAllocation(commonData)
console.log("commonData=", commonData)
    return (<div>
                {loading && <div className={homeStyles.spinner}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
                <h4 className={homeStyles.subtitle}>
                    {title}
                </h4>
                <div>
                    <div className={tableStyles.tableTopContainer}>
                        <div className={tableStyles.tableTitle}>Management</div>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.iconTooltip} data-tip={txt.capitalAllocation.tooltip}><InfoIcon /></span>
                        <span>Capital Allocation: </span>
                        <span className={homeStyles.bold}>{getCapitalAllocation(commonData)}</span>
                    </div>
                </div>
                <ReactTooltip effect="solid" className={homeStyles.tooltipCustom}  />
            </div>)


}
