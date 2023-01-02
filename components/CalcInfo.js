import React, { useEffect, useState, useContext, useRef } from 'react'; 
import { DataContext } from '../context/DataContext';

import ReactTooltip from 'react-tooltip';
import InfoIcon from './InfoIcon';

import texts from '../info/texts.json';

import styles from '../styles/CalcInfo.module.css';
import homeStyles from '../styles/Home.module.css';
import { toPercent } from '../logic/utils';

function getClsColor(value) {
    let _cls = homeStyles.bold;
    if (value) {
        if (value < 1) {
            _cls = `${homeStyles.bold} ${homeStyles.red}`;
        }
        else if (value >= 1 && value < 2) {
            _cls = `${homeStyles.bold} ${homeStyles.yellow}`;
        }
        else if (value >= 2) {
            _cls = `${homeStyles.bold} ${homeStyles.green}`;
        }
    }
    return _cls
}

// const infoIcon = tooltip ? <span data-tip={tooltip}><InfoIcon /></span> : null;

function CalcInfo({ data }) {
    const dataContext = useContext(DataContext);
    const { commonData } = dataContext; 

    const txt = texts.info;

    const trailingPe = commonData && commonData.summaryDetail && commonData.summaryDetail.trailingPE ? (commonData.summaryDetail.trailingPE ).toFixed(2) : null
    const forwardPe = commonData && commonData.summaryDetail && commonData.summaryDetail.forwardPE ? (commonData.summaryDetail.forwardPE).toFixed(2) : null
    const lastDividend = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.lastDividendValue ? (commonData.defaultKeyStatistics.lastDividendValue).toFixed(2) : null 

    const dividendYield = commonData && lastDividend && commonData.price 
    && commonData.price.regularMarketPrice 
    ? toPercent((lastDividend) / commonData.price.regularMarketPrice)
    : null

    const { averages: { averageNetIncomeGrowthValue }} = data

    const netIncomeGrowthPeRatio = (averageNetIncomeGrowthValue * 100) / trailingPe
    const netIncomeGrowthPeFwdRatio = (averageNetIncomeGrowthValue * 100) / forwardPe

    if (data && commonData && commonData.summaryDetail) {
        return (<div>
                    <h4 className={styles.title}>
                        Calculated Info
                    </h4>
                    <div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.growthRatePeRatio.tooltip}><InfoIcon /></span>
                            <span>Ratio (avgNetIncomeGrowthRate) / (P/E): </span>
                            <span className={getClsColor(netIncomeGrowthPeRatio)}>{netIncomeGrowthPeRatio.toFixed(2)}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.growthRatePeRatioFwd.tooltip}><InfoIcon /></span>
                            <span>Ratio (avgNetIncomeGrowthRate) / (P/E fwd): </span>
                            <span className={getClsColor(netIncomeGrowthPeFwdRatio)}>{netIncomeGrowthPeFwdRatio.toFixed(2)}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.dividendYield.tooltip}><InfoIcon /></span>
                            <span>Dividend Yield: </span>
                            <span>{dividendYield}</span>
                        </div>
                    </div>
                    <ReactTooltip effect="solid" className={homeStyles.tooltipCustom} />
                </div>);
    }
    return null
  }
  
  export default CalcInfo
