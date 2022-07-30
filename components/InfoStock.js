import React, { useState } from 'react';
import styles from '../styles/Home.module.css'
import axios from 'axios';

function InfoStock({ dataCallback, clearDataCallback }) {
    const [stockName, setStockName] = useState("");
    const [info, setInfo] = useState(null);

    const shortName = info && info.price ? info.price.shortName : ''; 
    const regularMarketPrice = info && info.price ? info.price.regularMarketPrice : ''; 
    const currencySymbol = info && info.price ? info.price.currencySymbol : ''; 

    const fetcherInfo = async (stock) => { 
        return await axios.post('api/info', { stock }).then((res) => {
            return res.data
        })
    }

    return (<div className={styles.infoStock}>
        <div className={styles.containerflexInfo}> 
            <label htmlFor="first">Stock Symbol</label>
            <input type="text" id="stock" name="stock" value={stockName} onChange={(e) => {
                console.log("value=", e.target.value)
                setStockName(e.target.value)
            }}/>
            <button className={styles.formButton} type="button" 
                onClick={async (e) => {
                  const data = await fetcherInfo(stockName);
                  setInfo(data);
                  if (dataCallback) {
                    dataCallback(data);
                }}}
                >get Info</button>
            <button className={styles.formButton} 
                onClick={()=> {
                    setInfo([]);
                    setStockName("");
                    if (clearDataCallback) {
                        clearDataCallback();
                    }
                }} 
                type="button" 
            >Clear data</button>
            </div>
        {info && (<div className={styles.infoStock}>
            <div><span>Company Name: </span><span className={styles.bold}>{shortName}</span></div> 
            <div><span>Price: </span><span className={styles.bold}>{`${regularMarketPrice}${currencySymbol}`}</span></div>
        </div>)}
    </div>)
  }
  

  export default InfoStock
