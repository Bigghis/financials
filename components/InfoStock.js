import React, { useState, useContext } from 'react';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react';
import { DataContext } from '../context/DataContext';

import styles from '../styles/Home.module.css'

function InfoStock({ dataCallback, clearDataCallback }) {
    const [loading, setLoading] = useState(false);
    const [stockName, setStockName] = useState("");
    const [info, setInfo] = useState(null);

    //initiaData..
    const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext; 

    const shortName = info && info.price ? info.price.shortName : ''; 
    const regularMarketPrice = info && info.price ? info.price.regularMarketPrice : ''; 
    const currencySymbol = info && info.price ? info.price.currencySymbol : ''; 

    const fetcherInfo = async (stock) => { 
        return await axios.post('api/info', { stock }).then((res) => {
            return res.data
        }).catch(
             (error) => {
             setLoading(false)
             return []
            });
    }

    let _clsPegRatio = styles.bold;
    if (commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.pegRatio) {
        const pegRatio = commonData.defaultKeyStatistics.pegRatio;
        if (pegRatio <=1) {
            _clsPegRatio = `${styles.bold} ${styles.green}`;
        } else if (pegRatio > 1 && pegRatio <=2) {
            _clsPegRatio = `${styles.bold} ${styles.yellow}`;
        } else if (pegRatio > 2) {
            _clsPegRatio = `${styles.bold} ${styles.red}`;
        }
    } 

    const beta = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.beta ? (commonData.defaultKeyStatistics.beta).toFixed(2) : null;

    return (<div className={styles.infoStock}>
        <div className={styles.containerflexInfo}> 
            <label htmlFor="first">Stock Symbol</label>
            <input placeholder="e.g.: aapl" type="text" id="stock" name="stock" value={stockName} onChange={(e) => {
                setStockName(e.target.value)
            }}/>
            <button className={styles.formButton} type="button" 
                onClick={async (e) => {
                  setCommonData([])
                  setLoading(true)
                  let data = await fetcherInfo(stockName);
                  setCommonData(data);
                  setInfo(data);
                  setLoading(false)
                  if (dataCallback) {
                    dataCallback(data);
                }}}
                >Get Info</button>
            <button className={styles.formButton} 
                onClick={()=> {
                    setInfo([]);
                    setCommonData([]);
                    setStockName("");
                    if (clearDataCallback) {
                        clearDataCallback();
                    }
                }} 
                type="button" 
            >Clear data</button>
            </div>
        <div className={styles.infoStock}>
            <SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} />
            {info && info.summaryProfile && !loading && (<>
                <div><span>Company Name: </span><span className={styles.bold}>{shortName}</span></div>
                <div><span>Price: </span><span className={styles.bold}>{`${regularMarketPrice}${currencySymbol}`}</span></div>
                <div><span>Sector: </span><span className={styles.bold}>{info.summaryProfile.sector}</span></div>
                <div><span>Industry: </span><span className={styles.bold}>{info.summaryProfile.industry}</span></div>
                <div><span>Beta: </span><span className={styles.bold}>{beta}</span></div>

                <div><span>PEG Ratio: </span><span className={_clsPegRatio}>{commonData.defaultKeyStatistics.pegRatio}</span></div>

               {/* <div>look at https://www.readyratios.com/sec/industry/ for median ratios</div> */} 
            </>)}
        </div>
    </div>)
  }
  
  export default InfoStock
