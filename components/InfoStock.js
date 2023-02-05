import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react';
import { DataContext } from '../context/DataContext';
import { IndustriesDataContext } from '../context/IndustriesContext';

import styles from '../styles/Home.module.css'

function InfoStock({ dataCallback, clearDataCallback }) {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(null);

    const stockName = useRef("");
    //initiaData..
    const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext; 
    const industriesContext  = useContext(IndustriesDataContext);
    const { industriesData, setIndustriesData } = industriesContext; 

    const shortName = info && info.price ? info.price.shortName : ''; 
    const regularMarketPrice = info && info.price ? info.price.regularMarketPrice : ''; 
    const currencySymbol = info && info.price ? info.price.currencySymbol : '';

    useEffect(() => {
        const keypressEnter = (e) => {
            if (e.keyCode === 13) {  // Enter
                getData();
            }
        };
        document.addEventListener("keypress", keypressEnter);
    
        // clean up
        return () => {
          document.removeEventListener("keypress", keypressEnter);
        };
      }, []);


    const fetcherIndustriesInfo = async () => { 
        return await axios.get('api/industries', {}).then((res) => {
            return res.data.industries
        }).catch(
             (error) => {
             setLoading(false)
             return []
            });
    }

    const fetcherInfo = async (stock) => { 
        return await axios.post('api/info', { stock }).then((res) => {
            return res.data
        }).catch(
             (error) => {
             setLoading(false)
             return []
            });
    }

    const getData = async () => {
        const v = stockName.current && stockName.current.value ? stockName.current.value : '';
        setCommonData([])
        setLoading(true)
        let data = await fetcherInfo(v);
        setCommonData(data);
        setInfo(data);
        if (industriesData ===null || Object.keys(industriesData).length === 0) {
            const _industriesData = await fetcherIndustriesInfo();
            setIndustriesData(_industriesData)
        }

        setLoading(false)
        if (dataCallback) {
          dataCallback(data);
    }}

    let _clsPegRatio = styles.bold;
    if (commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.pegRatio) {
        const pegRatio = commonData.defaultKeyStatistics.pegRatio;
        if (pegRatio <0) {
            _clsPegRatio = `${styles.bold} ${styles.red}`;
        }
        else if (pegRatio >= 0 && pegRatio <=1) {
            _clsPegRatio = `${styles.bold} ${styles.green}`;
        } else if (pegRatio > 1 && pegRatio <=2) {
            _clsPegRatio = `${styles.bold} ${styles.yellow}`;
        } else if (pegRatio > 2) {
            _clsPegRatio = `${styles.bold} ${styles.red}`;
        }
    } 

    const beta = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.beta ? (commonData.defaultKeyStatistics.beta).toFixed(2) : null;
    const trailingPe = commonData && commonData.summaryDetail && commonData.summaryDetail.trailingPE ? (commonData.summaryDetail.trailingPE ).toFixed(2) : null
    const forwardPe = commonData && commonData.summaryDetail && commonData.summaryDetail.forwardPE ? (commonData.summaryDetail.forwardPE).toFixed(2) : null
    const lastDividend = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.lastDividendValue ? (commonData.defaultKeyStatistics.lastDividendValue).toFixed(2) : ' - ' 

    return (<div className={styles.infoStock}>
        <div className={styles.containerflexInfo}> 
            <label htmlFor="first">Stock Symbol</label>
            <input ref={stockName} placeholder="e.g.: aapl" type="text" id="stock" name="stock" />
            <button className={styles.formButton} type="button" 
                onClick={getData}
                >Get Info</button>
            <button className={styles.formButton} 
                onClick={()=> {
                    setInfo([]);
                    setCommonData([]);
                    stockName.current.value = "";
                    if (clearDataCallback) {
                        clearDataCallback();
                    }
                }} 
                type="button" 
            >Clear Data</button>
            </div>
        <div className={styles.infoStock}>
            <SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} />
            {info && info.summaryProfile && !loading && (<>
                <div><span>Company Name: </span><span className={styles.bold}>{shortName}</span></div>
                <div><span>Sector: </span><span className={styles.bold}>{info.summaryProfile.sector}</span></div>
                <div><span>Industry: </span><span className={styles.bold}>{info.summaryProfile.industry}</span></div>
                <div><span>Price: </span><span className={styles.bold}>{`${regularMarketPrice}${currencySymbol}`}</span></div>
                <div><span>Last Dividend: </span><span className={styles.bold}>{`${lastDividend}${currencySymbol}`}</span></div>

                <div>
                    <span>P/E: </span><span className={styles.bold}>{trailingPe}</span>
                    <span className={styles.leftMargin}>forward P/E: </span><span className={styles.bold}>{forwardPe}</span>
                </div>
                <div><span>Beta: </span><span className={styles.bold}>{beta}</span></div>

                <div><span>PEG Ratio: </span><span className={_clsPegRatio}>{commonData.defaultKeyStatistics.pegRatio}</span></div>

               {/* <div>look at https://www.readyratios.com/sec/industry/ for median ratios</div> */} 
            </>)}
        </div>
    </div>)
  }
  
  export default InfoStock
