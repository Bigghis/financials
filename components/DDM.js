import React, { useState } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import Input from './Input';
import Select from './Select';
import styles from '../styles/Home.module.css'

import texts from '../info/texts.json';

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

    const txt = texts.ddm;

    return (<div>
                <h4 className={styles.subtitle}>
                    {title}
                </h4>
                <div className={styles.containerTabFlex}>
                    <Input label={txt.dividend.label} tooltip={txt.dividend.tooltip} name="lastDividend" initialValue={params.lastDividend} onChange={(v)=> setParam("lastDividend", v)}/>
                    <Input label={txt.eps.label} tooltip={txt.eps.tooltip} name="lastEPS" initialValue={params.lastEPS} onChange={(v)=> setParam("lastEPS", v)}/>
                </div>                
                <div className={styles.containerTabFlex}>
                        <Select name="epsGrowth0" label={txt.epsGrowth1.label} tooltip={txt.epsGrowth1.tooltip} min={0} max={50} percentage defaultValue={10} onChange={(v)=> setParam("epsGrowth0", v)} />
                        <Select name="epsGrowth1" label={txt.epsGrowth2.label} tooltip={txt.epsGrowth2.tooltip} min={0} max={30} percentage defaultValue={10} onChange={(v)=> setParam("epsGrowth1", v)} />
                        <Select name="epsGrowth2" label={txt.epsGrowth3.label} tooltip={txt.epsGrowth3.tooltip} min={0} max={10} percentage defaultValue={10} onChange={(v)=> setParam("epsGrowth2", v)} />
                        <Select name="discountRate" label={txt.discountRate.label} tooltip={txt.discountRate.tooltip} min={0} max={30} percentage defaultValue={params.discountRate} onChange={(v)=> setParam("discountRate", v)} />
                </div>
                <div className={styles.containerTabFlex}>
                        <Select name="terminalPE" label={txt.tpe.label} tooltip={txt.tpe.tooltip} min={0} max={10} defaultValue={10} onChange={(v)=> setParam("terminalPE", v)} />
                        <Select name="payout0" label={txt.payout1.label} tooltip={txt.payout1.tooltip} min={0} max={60} percentage defaultValue={45} onChange={(v)=> setParam("payout0", v)} />
                        <Select name="payout1" label={txt.payout2.label} tooltip={txt.payout2.tooltip} min={0} max={100} percentage defaultValue={85} onChange={(v)=> setParam("payout1", v)} />
                        <Select name="companyFailure" label={txt.failure.label} tooltip={txt.failure.tooltip} min={0} max={50} percentage defaultValue={params.discountRate} onChange={(v)=> setParam("companyFailure", v)} />
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
                <ReactTooltip effect="solid" className={styles.tooltipCustom}  />
            </div>)
  }
  
  export default DDM;
