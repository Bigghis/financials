import React, { useState } from 'react';
import axios from 'axios';
import Input from './Input';
import Select from './Select';
import styles from '../styles/Home.module.css'

function DDM({ data, title }) {
    const { defaultKeyStatistics, earningsHistory, financialData, price } = data;
    
    const [loading, setLoading] = useState(false);
    const [ params, setParams ] = useState({
        lastDividend: defaultKeyStatistics && defaultKeyStatistics.lastDividendValue || 0,
        lastEPS: earningsHistory && earningsHistory.history[0].epsActual || 0, // last year...
        price: financialData && financialData.currentPrice || 0,
        stock: price && price.symbol || 'NO_NAME!',

        discountRate: 10,
        growthRate: 15,
        longTermGrowthRate: 2
    });  
    
    const setParam = (paramName, value) => {
        const _params = { ...params };
        _params[paramName] = value;
        setParams(_params);
    }

    const fetcherDDM = async () => {
        return await axios.post('api/ddm', { params }).then((res) => {
          return res.data
      })
    }

    return (<div>
                <h4 className={styles.subtitle}>
                    {title}
                </h4>
                <div className={styles.containerTabFlex}>
                    <Input label="Last dividend" name="lastDividend" initialValue={params.lastDividend} onChange={(v)=> setParam("lastDividend", v)}/>
                    <Input label="Last EPS" name="lastEPS" initialValue={params.lastEPS} onChange={(v)=> setParam("lastEPS", v)}/>
                </div>                
                <div className={styles.containerTabFlex}>
                        <Select name="epsGrowth0" min={0} max={50} subtitle="first stage" label="EPS growth 1-5 years" percentage defaultValue={10} onChange={(v)=> setParam("epsGrowth0", v)} />
                        <Select name="epsGrowth1" min={0} max={30} subtitle="second stage" label="EPS growth 5-10 years" percentage defaultValue={10} onChange={(v)=> setParam("epsGrowth1", v)} />
                        <Select name="epsGrowth2" min={0} max={10} subtitle="tirth stage" label="EPS growth 10-20 years" percentage defaultValue={10} onChange={(v)=> setParam("epsGrowth2", v)} />
                        <Select name="discountRate" min={0} max={30} label="Discount rate (expected profit)" percentage defaultValue={params.discountRate} onChange={(v)=> setParam("discountRate", v)} />
                </div>
                <div className={styles.containerTabFlex}>
                        <Select name="terminalPE" min={0} max={10} label="Terminal PE" defaultValue={10} onChange={(v)=> setParam("terminalPE", v)} />
                        <Select name="payout0" min={0} max={60} label="Payout year 10" percentage defaultValue={45} onChange={(v)=> setParam("payout0", v)} />
                        <Select name="payout1" min={0} max={100} label="Payout year 20" percentage defaultValue={85} onChange={(v)=> setParam("payout1", v)} />
                        <Select name="companyFailure" min={0} max={50} label="Probability of company failure" percentage defaultValue={params.discountRate} onChange={(v)=> setParam("companyFailure", v)} />
                </div>
                <div className={styles.containerTabFlex}>
                        <button className={styles.formButton} type="button" onClick={async (e) => {
                            setLoading(true)
                            const resData = await fetcherDDM();

                            console.log('resData=', resData)
                           // setDcfData([...dcfData, ...resData])
                           // window.scroll(0, document.querySelector(`.${styles.container}`).scrollHeight);
                            setLoading(false)
                        }}>
                            calculate DDM
                        </button>
                    </div>
    </div>)
  }
  
  export default DDM;
