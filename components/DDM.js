import React, { useState } from 'react';
import axios from 'axios';
import Input from './Input';

import styles from '../styles/Home.module.css'

function DDM({ data, dataCallback }) {
    const [info, setInfo] = useState(null);

    const { price, financialData } = data;
    console.log("data DDM=", data)


    return (<div>
                <h4 className={styles.subtitle}>
                    Dividend Discount Model method
                </h4>
                <div className={styles.containerTabFlex}>
                        <Input label="Free Cash Flow" name="free_cash_flow" initialValue={financialData && financialData.freeCashflow}/>

                </div>
    </div>)

   /* const fetcherInfo = async (stock) => { 
        return await axios.post('api/info', { stock }).then((res) => {
            return res.data
        })
    }

    return (<div className={styles.infoStock}>
        <div className={styles.containerflexInfo}> 
            <label htmlFor="first">stock symbol:</label>
            <input type="text" id="stock" name="stock" />
            <button className={styles.formButton} type="button" 
                onClick={async (e) => {
                  const data = await fetcherInfo(e.target.form.stock.value);
                  setInfo(data);
                  if (dataCallback) {
                    dataCallback(data);
                }}}
                >get Info</button>
        </div>
        {info && (<div className={styles.infoStock}>
            <div><span>Name: </span><span>{info.price.shortName}</span></div>
            <div><span>Price: </span><span>{`${info.price.regularMarketPrice}${info.price.currencySymbol}`}</span></div>
        </div>)}
    </div>)
    */
  }
  

  export default DDM;
