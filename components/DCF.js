import React, { useState } from 'react';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react';
import Input from './Input';
import Select from './Select';
import DCFTable from './DCFTable';

import styles from '../styles/Home.module.css'


function DCF({ data, title }) {
    const { price, financialData, defaultKeyStatistics } = data;

    const [loading, setLoading] = useState(false);
    const [dcfData, setDcfData] = useState([]);
    const [ params, setParams ] = useState({
        stock: price && price.symbol || 'NO_NAME!',
        freeCashFlow: financialData && financialData.freeCashflow || '',
        totalDebt: financialData && financialData.totalDebt || '',
        sharesOutstanding: defaultKeyStatistics && defaultKeyStatistics.sharesOutstanding || '',
        futureYears: 5,
        discountRate: 10,
        growthRate: 15,
        longTermGrowthRate: 2
    });

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

    return (<div>
                {loading && <div className={styles.spinner}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
                <h4 className={styles.subtitle}>
                    {title}
                </h4>
                    <div className={styles.containerTabFlex}>
                            <Input label="Free Cash Flow" name="free_cash_flow" initialValue={params.freeCashFlow} onChange={(v)=> {
                                setParam("freeCashFlow", v);
                            }} />
                            <Input label="Total Debt" name="total_debt" initialValue={params.totalDebt} onChange={(v)=> setParam("totalDebt", v)}/>
                            <Input label="Shares Outstanding" name="shares_outstanding" initialValue={params.sharesOutstanding} onChange={(v)=> setParam("sharesOutstanding", v)}/>
                    </div>
                    <div className={styles.containerTabFlex}>
                        <Select name="future_years" min={1} max={15} defaultValue={params.futureYears} label="Future years" onChange={(v)=> setParam("futureYears", v)} />
                        <Select name="discount_rate" min={0} max={30} label="Discount rate (expected profit)" percentage defaultValue={params.discountRate} onChange={(v)=> setParam("discountRate", v)} />
                        <Select name="growth_rate" min={0} max={100} label="Company growth rate" percentage defaultValue={params.growthRate} onChange={(v)=> setParam("growthRate", v)} />
                        <Select name="long_term_growth_rate" min={0} max={6} label="Long term growth rate (TV)" tooltip="Long term growth rate (Terminal Value)" percentage defaultValue={params.longTermGrowthRate} onChange={(v)=> setParam("longTermGrowthRate", v)} />    
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
                <DCFTable data={dcfData} clearCallback={() => setDcfData([])} />
    </div>)
}
  
export default DCF;
