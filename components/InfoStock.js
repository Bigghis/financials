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

    return (<div className={styles.infoStock}>
        <div className={styles.containerflexInfo}> 
            <label htmlFor="first">Stock Symbol</label>
            <input placeholder="e.g.: aapl" type="text" id="stock" name="stock" value={stockName} onChange={(e) => {
                setStockName(e.target.value)
            }}/>
            <button className={styles.formButton} type="button" 
                onClick={async (e) => {
                  setLoading(true)
                  let data = await fetcherInfo(stockName);
                  setCommonData(data);
                 /*  if (commonData && Object.keys(commonData).length > 0) {
                    data = commonData;
                  } else { 
                     data = await fetcherInfo(stockName);
                     setCommonData(data)
                  } */
                  setInfo(data);
                  setLoading(false)
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
        <div className={styles.infoStock}>
            <SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} />
            {info && info.summaryProfile && !loading && (<React.Fragment>
                <div><span>Company Name: </span><span className={styles.bold}>{shortName}</span></div>
                <div><span>Price: </span><span className={styles.bold}>{`${regularMarketPrice}${currencySymbol}`}</span></div>
                <div><span>Sector: </span><span className={styles.bold}>{info.summaryProfile.sector}</span></div>
                <div><span>Industry: </span><span className={styles.bold}>{info.summaryProfile.industry}</span></div>
               {/* <div>look at https://www.readyratios.com/ for median ratios</div> */} 
            </React.Fragment>)}
        </div>
    </div>)
  }
  
  export default InfoStock
