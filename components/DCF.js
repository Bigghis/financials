import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react';
import ReactTooltip from 'react-tooltip';
import Input from './Input';
import Select from './Select';
import DCFTable from './DCFTable';

import styles from '../styles/Home.module.css'

import texts from '../info/texts.json';

function DCF({ data, title }) {
    const { price, financialData, defaultKeyStatistics } = data;

    const [loading, setLoading] = useState(true);
    const [dcfData, setDcfData] = useState([]);
    const [params, setParams] = useState({
        stock: price && price.symbol || 'NO_NAME!',
        freeCashFlow: financialData && financialData.freeCashflow || '',
        totalDebt: financialData && financialData.totalDebt || '',
        sharesOutstanding: defaultKeyStatistics && defaultKeyStatistics.sharesOutstanding || '',
        futureYears: 5,
        discountRate: 10,
        growthRate: 15,
        longTermGrowthRate: 2
    });

    useEffect(() => {
        setLoading(false);
    }, []);

    const fetcherDCF = async () => {
        return await axios.post('api/dcf', { params }).then((res) => {
            return res.data
        })
    }

    const setParam = (paramName, value) => {
        const _params = { ...params };
        _params[paramName] = value;
        setParams(_params);
    }

    const txt = texts.dcf;

    return (<div>
        {loading && <div className={styles.spinnerTab}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
        <h4 className={styles.subtitle}>
            {title}
        </h4>
        <div className={styles.containerTabFlex}>
            <Input label={txt.cashFlow.label} tooltip={txt.cashFlow.tooltip} name="free_cash_flow" initialValue={params.freeCashFlow} onChange={(v) => {
                setParam("freeCashFlow", v);
            }} />
            <Input label={txt.totalDebt.label} tooltip={txt.totalDebt.tooltip} name="total_debt" initialValue={params.totalDebt} onChange={(v) => setParam("totalDebt", v)} />
            <Input label={txt.sharesOutstanding.label} tooltip={txt.sharesOutstanding.tooltip} name="shares_outstanding" initialValue={params.sharesOutstanding} onChange={(v) => setParam("sharesOutstanding", v)} />
        </div>
        <div className={styles.containerTabFlex}>
            <Select nam="future years" label={txt.futureYears.label} tooltip={txt.futureYears.tooltip} min={1} max={15} defaultValue={params.futureYears} onChange={(v) => setParam("futureYears", v)} />
            <Select name="discountRate" label={txt.discountRate.label} tooltip={txt.discountRate.tooltip} min={0} max={30} percentage defaultValue={params.discountRate} onChange={(v) => setParam("discountRate", v)} />
            <Select name="growth_rate" label={txt.growthRate.label} tooltip={txt.growthRate.tooltip} min={0} max={100} percentage defaultValue={params.growthRate} onChange={(v) => setParam("growthRate", v)} />
            <Select name="long_term_growth_rate" label={txt.tv.label} tooltip={txt.tv.tooltip} min={0} max={6} percentage defaultValue={params.longTermGrowthRate} onChange={(v) => setParam("longTermGrowthRate", v)} />
        </div>
        <div className={styles.containerTabFlex}>
            <button className={styles.formButton} type="button" onClick={async (e) => {
                setLoading(true)
                const resData = await fetcherDCF(e.target.form);
                setDcfData([...dcfData, ...resData])
                // window.scroll(0, document.querySelector(`.${styles.container}`).scrollHeight);
                setLoading(false)
            }}>
                calculate DCF
            </button>
        </div>
        <ReactTooltip effect="solid" className={styles.tooltipCustom} />
        <DCFTable data={dcfData} clearCallback={() => setDcfData([])} />
    </div>)
}

export default DCF;
