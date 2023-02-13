import React, { useContext, useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import ReactTooltip from 'react-tooltip';
import { DataContext } from '../context/DataContext';
import { IndustriesDataContext } from '../context/IndustriesContext';
import { getIndustryName } from '../logic/models/IndustryDataset';

import styles from '../styles/Home.module.css'

import texts from '../info/texts.json';
import SimpleTable from './SimpleTable';
import { formatCurrency, formatNumber, toPercent } from '../logic/utils';

const curSymbol = '$';

export default function Industry({ title, data }) {
    const [loading, setLoading] = useState(true);
    const txt = texts.qualitative;

    useEffect(() => {
        setLoading(false);
    }, []);
    //initiaData..
    const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext;
    const industriesContext = useContext(IndustriesDataContext);
    const { industriesData } = industriesContext;

    let infos = {}
    let infos2 = {}
    let margins = {}
    let capex = {}
    let returns = {}
    let multiples = {}
    if (industriesData && commonData && commonData.price && commonData.price.shortName) {
        let matches = { ...getIndustryName(commonData.price.shortName) };
        if (matches) {
            infos = {
                "Company Name": <span className={styles.bold}>{matches["Company Name"]}</span>,
                "Exchange:Ticker": matches["Exchange:Ticker"],
                "Industry Group": matches["Industry Group"],
                "Primary Sector": matches["Primary Sector"]
            }
            infos2 = {
                "Country": matches["Country"],
                "SIC Code": matches["SIC Code"],
                "Broad Group": matches["Broad Group"],
                "Sub Group": matches["Sub Group"]
            }
        }

        const industry = industriesData[matches["Industry Group"]]
        console.log("match name =", industry);
        if (industry) {
            margins = {
                'Gross Margin': <span className={styles.bold}>{toPercent(industry['Gross Margin'])}</span>,
                'Net Margin': toPercent(industry['Net Margin']),
                'Pre-tax, Pre-stock compensation Operating Margin': toPercent(industry['Pre-tax, Pre-stock compensation Operating Margin']),
                'Pre-tax Unadjusted Operating Margin': toPercent(industry['Pre-tax Unadjusted Operating Margin']),
                'After-tax Unadjusted Operating Margin': toPercent(industry['After-tax Unadjusted Operating Margin']),
                'Pre-tax Lease adjusted Margin': toPercent(industry['Pre-tax Lease adjusted Margin']),
                'After-tax Lease Adjusted Margin': toPercent(industry['After-tax Lease Adjusted Margin']),
                'Pre-tax Lease & R&D adj Margin': toPercent(industry['Pre-tax Lease & R&D adj Margin']),
                'After-tax Lease & R&D adj Margin': toPercent(industry['After-tax Lease & R&D adj Margin']),
                'EBITDA/Sales': toPercent(industry['EBITDA/Sales']),
                'EBITDASG&A/Sales': toPercent(industry['EBITDASG&A/Sales']),
                'EBITDAR&D/Sales': toPercent(industry['EBITDAR&D/Sales']),
                'COGS/Sales': toPercent(industry['COGS/Sales']),
                'R&D/Sales': toPercent(industry['R&D/Sales']),
                'SG&A/ Sales': toPercent(industry['SG&A/ Sales']),
                'Stock-Based Compensation/Sales': toPercent(industry['Stock-Based Compensation/Sales']),
                'Lease Expense/Sales': toPercent(industry['Lease Expense/Sales'])
            }
    
            capex = {
                'Capital Expenditures (US $ millions)': formatCurrency(industry['Capital Expenditures (US $ millions)']),
                'Depreciation & Amort ((US $ millions)': formatCurrency(industry['Depreciation & Amort ((US $ millions)']),
                'Cap Ex/Deprecn': toPercent(industry['Cap Ex/Deprecn']),
                'Acquisitions (US $ millions)': formatCurrency(industry['Acquisitions (US $ millions)']),
                'Net R&D (US $ millions)': formatCurrency(industry['Net R&D (US $ millions)']),
                'Net Cap Ex/Sales': toPercent(industry['Net Cap Ex/Sales']),
                'Net Cap Ex/ EBIT (1-t)': toPercent(industry['Net Cap Ex/ EBIT (1-t)']),
                'Sales/ Invested Capital': formatNumber(industry['Sales/ Invested Capital'])
            }
    
            returns = {
                'ROE': toPercent(industry['ROE']),
                'ROIC': toPercent(industry['ROIC']),
                'PBV': formatNumber(industry['PBV']),
                'EV/ Invested Capital': formatNumber(industry['EV/ Invested Capital'])
            }
    
            multiples = {
                'Current PE': formatNumber(industry['Current PE']),
                'Trailing PE': formatNumber(industry['Trailing PE']),
                'Forward PE': formatNumber(industry['Forward PE']),
                'PEG Ratio': formatNumber(industry['PEG Ratio']),
                'Price/Sales': formatNumber(industry['Price/Sales']),
                'EV/Sales': formatNumber(industry['EV/Sales']),
                'Pre-tax Operating Margin': toPercent(industry['Pre-tax Operating Margin']),
                'Acc Rec/ Sales': toPercent(industry['Acc Rec/ Sales']),
                'Inventory/Sales': toPercent(industry['Inventory/Sales']),
                'Acc Pay/ Sales': toPercent(industry['Acc Pay/ Sales']),
                'Non-cash WC/ Sales': toPercent(industry['Non-cash WC/ Sales']),
                '% of Money Losing firms (Trailing)': toPercent(industry['% of Money Losing firms (Trailing)']),
                'Aggregate Mkt Cap/ Net Income (all firms)': formatNumber(industry['Aggregate Mkt Cap/ Net Income (all firms)']),
                'Aggregate Mkt Cap/ Trailing Net Income (only money making firms)': formatNumber(industry['Aggregate Mkt Cap/ Trailing Net Income (only money making firms)']),
                'Expected growth - next 5 years': toPercent(industry['Expected growth - next 5 years'])
            }

        }

        /*const m = _multiples.map(m => {
            return `'${m}':  toPercent(industry['${m}'])`
        })
        console.log(m)
        */
        //  setLoading(false)
    }
    return (<div>
        {loading && <div className={styles.spinnerTab}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
        <h4 className={styles.subtitle}>
            {title}
        </h4>
        <div className={styles.infoStockContainer}>
            <SimpleTable
                title="Info"
                data={infos}
            />
            <SimpleTable
                title="Info"
                data={infos2}
            />
        </div>
        <div className={styles.infoStockContainer}>
            <SimpleTable
                zebra
                hoverable
                title="Multiples"
                data={multiples}
            />
            <SimpleTable
                zebra
                hoverable
                title="Margins"
                data={margins}
            />
        </div>
        <div className={styles.infoStockContainer}>
            <SimpleTable
                zebra
                hoverable
                title="Returns"
                data={returns}
            />
            <SimpleTable
                zebra
                hoverable
                title="Capex"
                data={capex}
            />
        </div>
        <ReactTooltip effect="solid" className={styles.tooltipCustom} />
    </div>)
}
