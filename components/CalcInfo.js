import React, { useEffect, useState, useContext, useRef } from 'react'; 
import { DataContext } from '../context/DataContext';

import ReactTooltip from 'react-tooltip';
import Select from './Select';
import InfoIcon from './InfoIcon';

import texts from '../info/texts.json';

import styles from '../styles/CalcInfo.module.css';
import homeStyles from '../styles/Home.module.css';
import { toDecimal, toPercent } from '../logic/utils';

const STR_NULL_VALUE = ' - ';

const RANGES = [1,2];
const RANGES_WITH_DIVIDENDS = [1.5, 2];


function getClsColor(value, ranges) {
    let _cls = homeStyles.bold;
    if (value) {
        if (value < ranges[0]) {
            _cls = `${homeStyles.bold} ${homeStyles.red}`;
        }
        else if (value >= ranges[0] && value < ranges[1]) {
            _cls = `${homeStyles.bold} ${homeStyles.yellow}`;
        }
        else if (value >= ranges[1]) {
            _cls = `${homeStyles.bold} ${homeStyles.green}`;
        }
    }
    return _cls
}

function CalcInfo({ data }) {
    const { averages: { averageNetIncomeGrowthValue }} = data

    const dataContext = useContext(DataContext);
    const { commonData } = dataContext; 

    const [growthRate, setGrowthRate ] = useState(averageNetIncomeGrowthValue * 100 || 0);
    const txt = texts.info;

    const trailingPe = commonData && commonData.summaryDetail && commonData.summaryDetail.trailingPE ? (commonData.summaryDetail.trailingPE ).toFixed(2) : null
    const forwardPe = commonData && commonData.summaryDetail && commonData.summaryDetail.forwardPE ? (commonData.summaryDetail.forwardPE).toFixed(2) : null
    const lastDividend = commonData && commonData.defaultKeyStatistics && commonData.defaultKeyStatistics.lastDividendValue ? (commonData.defaultKeyStatistics.lastDividendValue).toFixed(2) : null 

    const dividendYield = commonData && lastDividend && commonData.price 
    && commonData.price.regularMarketPrice 
    ? toPercent((lastDividend / commonData.price.regularMarketPrice), 2)
    : null


    
    
    const adjGrowthRate = growthRate / 100;
    
    const netIncomeGrowthPeRatio = (adjGrowthRate * 100) / trailingPe
    const netIncomeGrowthPeFwdRatio = (adjGrowthRate * 100) / forwardPe

    const netIncomeGrowthPeRatioWithDividends = dividendYield 
    ? ((adjGrowthRate + toDecimal(dividendYield)) / trailingPe) * 100
    : null

    const netIncomeGrowthPeFwddRatioWithDividends = dividendYield 
    ? ((adjGrowthRate + toDecimal(dividendYield)) / forwardPe) * 100
    : null


    
    if (data && commonData && commonData.summaryDetail) {
        return (<div>
                    <h4 className={styles.title}>
                        Calculated Info
                    </h4>
                    <div>
                        <div className={styles.row}>
                            <Select name="growthRate" label={txt.growthRate.label} min={-50} max={100} percentage defaultValue={growthRate} onChange={(v)=> setGrowthRate(v)} />
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.dividendYield.tooltip}><InfoIcon /></span>
                            <span>Dividend Yield: </span>
                            <span className={homeStyles.bold}>{dividendYield || STR_NULL_VALUE}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.growthRatePeRatio.tooltip}><InfoIcon /></span>
                            <span>Ratio (avgNetIncomeGrowthRate) / (P/E): </span>
                            <span className={getClsColor(netIncomeGrowthPeRatio, RANGES)}>{netIncomeGrowthPeRatio.toFixed(2)}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.growthRatePeRatioFwd.tooltip}><InfoIcon /></span>
                            <span>Ratio (avgNetIncomeGrowthRate) / (P/E fwd): </span>
                            <span className={getClsColor(netIncomeGrowthPeFwdRatio, RANGES)}>{netIncomeGrowthPeFwdRatio.toFixed(2)}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.growthRatePeRatioDividend.tooltip}><InfoIcon /></span>
                            <span>Ratio (avgNetIncomeGrowthRate + dividendYield) / (P/E fwd): </span>
                            <span className={getClsColor(netIncomeGrowthPeRatioWithDividends, RANGES_WITH_DIVIDENDS)}>
                                {netIncomeGrowthPeRatioWithDividends ? netIncomeGrowthPeRatioWithDividends.toFixed(2) : STR_NULL_VALUE}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.iconTooltip} data-tip={txt.growthRatePeFwdRatioDividend.tooltip}><InfoIcon /></span>
                            <span>Ratio (avgNetIncomeGrowthRate + dividendYield) / (P/E fwd): </span>
                            <span className={getClsColor(netIncomeGrowthPeFwddRatioWithDividends, RANGES_WITH_DIVIDENDS)}>
                                {netIncomeGrowthPeFwddRatioWithDividends ? netIncomeGrowthPeFwddRatioWithDividends.toFixed(2) : STR_NULL_VALUE}
                            </span>
                        </div>
                    </div>
                    <ReactTooltip effect="solid" className={homeStyles.tooltipCustom} />
                </div>);
    }
    return null
  }
  
  export default CalcInfo
