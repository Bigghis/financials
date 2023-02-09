import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react';
import { DataContext } from '../context/DataContext';

import styles from '../styles/Home.module.css'
import SimpleTable from './SimpleTable';

function InfoStock({ dataCallback, clearDataCallback }) {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(null);

    const stockName = useRef("");
    const btnGet = useRef("");
    //initiaData..
    const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext;

    const shortName = info && info.price ? info.price.shortName : '';
    const regularMarketPrice = info && info.price ? info.price.regularMarketPrice : '';
    const currencySymbol = info && info.price ? info.price.currencySymbol : '';

    useEffect(() => {
        const keypressEnter = (e) => {
            if (e.keyCode === 13) {  // Enter
                btnGet.current.click();
            }
        };
        document.addEventListener("keypress", keypressEnter);

        // clean up
        return () => {
            document.removeEventListener("keypress", keypressEnter);
        };
    }, []);

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

        //console.log("industries data", industriesData)

        setLoading(false)
        if (dataCallback) {
            dataCallback(data);
        }
    }

    let _clsPegRatio = styles.bold;
    if (commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.pegRatio) {
        const pegRatio = commonData.defaultKeyStatistics.pegRatio;
        if (pegRatio < 0) {
            _clsPegRatio = `${styles.bold} ${styles.red}`;
        }
        else if (pegRatio >= 0 && pegRatio <= 1) {
            _clsPegRatio = `${styles.bold} ${styles.green}`;
        } else if (pegRatio > 1 && pegRatio <= 2) {
            _clsPegRatio = `${styles.bold} ${styles.yellow}`;
        } else if (pegRatio > 2) {
            _clsPegRatio = `${styles.bold} ${styles.red}`;
        }
    }

    const beta = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.beta ? (commonData.defaultKeyStatistics.beta).toFixed(2) : null;
    const trailingPe = commonData && commonData.summaryDetail && commonData.summaryDetail.trailingPE ? (commonData.summaryDetail.trailingPE).toFixed(2) : null
    const forwardPe = commonData && commonData.summaryDetail && commonData.summaryDetail.forwardPE ? (commonData.summaryDetail.forwardPE).toFixed(2) : null
    const lastDividend = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.lastDividendValue ? (commonData.defaultKeyStatistics.lastDividendValue).toFixed(2) : ' - '

    const getNameData = () => {
        return {
            'Company Name': <span className={styles.bold}>{shortName}</span>,
            'Sector': info.summaryProfile.sector,
            'Industry': info.summaryProfile.industry,
        }
    }
    const getInfoData = () => {
        return {
            'Price': <span className={styles.bold}>{`${regularMarketPrice}${currencySymbol}`}</span>,
            'Last Dividend': <span className={styles.bold}>{`${lastDividend}${currencySymbol}`}</span>,
            'P/E': <span><span className={styles.bold}>{trailingPe}</span><span className={styles.leftMargin}>forward P/E: </span><span className={styles.bold}>{forwardPe}</span></span>,
            'Beta': <span className={styles.bold}>{beta}</span>,
            'Peg Ratio': <span className={_clsPegRatio}>{commonData.defaultKeyStatistics.pegRatio}</span>
        }
    }

    return (<div className={styles.infoStock}>
        <div className={styles.containerflexInfo}>
            <label htmlFor="first">Stock Symbol</label>
            <input ref={stockName} placeholder="e.g.: aapl" type="text" id="stock" name="stock" />
            <button ref={btnGet} className={styles.formButton} type="button"
                onClick={getData}
            >Get Info</button>
            <button className={styles.formButton}
                onClick={() => {
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
            {info && info.summaryProfile && !loading && (
                <div className={styles.infoStockContainer}>
                <SimpleTable
                className={styles.tableName}
                title="Info Data from Yahoo Finance"
                data={getNameData()}
            />
                <SimpleTable
                className={styles.tablePrices}
               //     title="Values"
                    data={getInfoData()}
                />
                </div>
            )}
        </div>
    </div>)
}

export default InfoStock
