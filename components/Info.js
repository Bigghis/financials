import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react';
import Input from './Input';
import Select from './Select';
import { getYear, toDecimal, toPercent } from '../logic/utils';
import Info, { showAllYearsDataRange, getYearDataRange, getFreeCashFlowNextYear, getGrowthRate, getReinvestementRate, getCOGS, getAverageAgeOfInventory, getGrossMargin, getBookValue, getEffectiveTaxRate, getReturnOnCapital } from '../logic/models/Info';
import Table from './Table';
// import { DataContext } from '../context/DataContext';

import styles from '../styles/Home.module.css'


export default function InfoCmp({ data, infoData, dataCallback }) {
    const { price, financialData, defaultKeyStatistics, incomeStatementHistory, cashflowStatementHistory} = data;

/*     const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext; */

    const getInitialData = (data) => {
        let _data = [];
        // create rows
        console.log("GET DATA=", data);
    
    
        // use years as reference
        const years = getYearDataRange(data, ['incomeStatementHistory', 'incomeStatementHistory']).reverse();
    
        if (data) {
            const _revenues = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                _revenues[getYear(element.endDate)] = element.totalRevenue        
            }
            _data.push({  metricName: 'Total Revenue', ..._revenues });
        
            const _revenueGrowthRate = {}
            let averageValue = 0;
            let cont = 0;
            for (let i = 0; i < years.length; i++) {
                const year = years[i];
                if (i === 0) {
                    _revenueGrowthRate[year] = null;
                } else {
                    _revenueGrowthRate[year] = toPercent(getGrowthRate(_revenues[year-1], _revenues[year]))
                    averageValue += toDecimal(_revenueGrowthRate[year])
                    cont ++;
                }
            }
            averageValue = toPercent(averageValue / cont)
          //  _revenueGrowthRate.length = 
            // get median value 
    
            
            _data.push({  metricName: `Revenue Growth Rate (average: ${averageValue})`, ..._revenueGrowthRate });
    
            // gross profits
            const _grossProfits =  {};
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                _grossProfits[getYear(element.endDate)] = element.grossProfit        
            }
            _data.push({  metricName: 'Gross Profits', ..._grossProfits });
        
            // inventory
            const _inventory = {}
            for (let i = 0; i < data.balanceSheetHistory.balanceSheetStatements.length; i++) {
                const element = data.balanceSheetHistory.balanceSheetStatements[i];
                const year = getYear(element.endDate);
                _inventory[year] = element.inventory;
            }
            _data.push({  metricName: 'Inventory', ..._inventory });
    
            const _ebit = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _ebit[year] = element.ebit; 
            }
            _data.push({  metricName: 'EBIT', ..._ebit });
        
            //COGS 
            const _cogs = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                _cogs[getYear(element.endDate)] = getCOGS(element.totalRevenue, element.grossProfit)        
            }
            _data.push({  metricName: 'COGS', ..._cogs });
        
            //gross margin
            const _grossMargin = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _grossMargin[year] = toPercent(getGrossMargin(element.totalRevenue, _cogs[year]))  
            }
            _data.push({  metricName: 'Gross Margin', ..._grossMargin });
        
            // getAverageAgeOfInventory [days]
            const _ageOfInventory = {}
            for (let i = 0; i < data.balanceSheetHistory.balanceSheetStatements.length; i++) {
                const element = data.balanceSheetHistory.balanceSheetStatements[i];
                const year = getYear(element.endDate);
                _ageOfInventory[year] = getAverageAgeOfInventory(element.inventory, _cogs[year])  
            }
            _data.push({  metricName: 'Age Of Inventory (days)', ..._ageOfInventory });
    
            const _bookValue = {}
            for (let i = 0; i < data.balanceSheetHistory.balanceSheetStatements.length; i++) {
                const element = data.balanceSheetHistory.balanceSheetStatements[i];
                const year = getYear(element.endDate);
                _bookValue[year] = getBookValue(element.totalAssets, element.totalLiab)  
            }
            _data.push({  metricName: 'Book Value', ..._bookValue });
    
            const _taxRate = {}
            let averageTaxRate = 0;
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                const tRate = getEffectiveTaxRate(element.incomeTaxExpense, element.incomeBeforeTax);
                _taxRate[year] = toPercent(tRate)  
                averageTaxRate += tRate;
            }
            averageTaxRate = toPercent(averageTaxRate/years.length);
            _data.push({  metricName: `Tax Rate (average: ${averageTaxRate})`, ..._taxRate });
    
            const _roc = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _roc[year] = toPercent(getReturnOnCapital(_ebit[year], toDecimal(_taxRate[year]), _bookValue[year]))
            }
            _data.push({  metricName: 'Return On Capital', ..._roc });
    
            const _reinvestmentRate = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _reinvestmentRate[year] = toPercent( getReinvestementRate(toDecimal(_revenueGrowthRate[year]), toDecimal(_roc[year])) )
            }
            _data.push({  metricName: 'Reinvestment rate', ..._reinvestmentRate });
    
            const _fcf = {}
            let averageFcf = 0;
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                // ebit, growthRate, taxRate, reinvestmentRate
                _fcf[year] =  getFreeCashFlowNextYear(
                    toDecimal(_ebit[year]), 
                    toDecimal(_revenueGrowthRate[year]), 
                    toDecimal(_taxRate[year]), 
                    toDecimal(_reinvestmentRate[year])
                );
                averageFcf += _fcf[year];
            }
           // averageFcf = isNaN(parseInt(averageFcf / years.length)) ?  null : parseInt(averageFcf / years.length);
            averageFcf = parseInt(averageFcf / years.length)
            _data.push({  metricName: `FCFF (year+1) (average: ${averageFcf})`, ..._fcf });
        }
        return _data
    }
    
    const getData = (data) => {
        let _data = [];
            //TODO:: implementare!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            return null
    }


    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(getInitialData(data));

   /*       useEffect(() => {
        setInfo(getData(data));
        // const _info = new Info(data); // , {...params});
        // setInfo(_info.calculate());
      }, []);       */


    const getColumns = () => {
        let cols = [];
        if (data) {
            const years = showAllYearsDataRange(data).incomeStatementHistory;
            
            let _cols = years.map(year => {
                const yearString = year.toString();
                return {        
                    Header: yearString,
                    accessor: yearString                 
                  };
            });

            _cols = _cols.reverse();
        
            cols = [{ Header: '', accessor: 'metricName', Cell: (props) => <b>{props.value}</b> }, ..._cols];
        }
        return cols;
    }

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {

  //  const _info = [...info]
  //  _info[rowIndex][columnId] = value;

   
   setInfo(info =>
      info.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...info[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }


    return (<div>
                {loading && <div className={styles.spinner}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
                <h4 className={styles.subtitle}>
                    Info
                </h4> 
               

                {info && (<div className={styles.containerTabFlexUl}>
                    <div>Last metrics:</div>

{/*                     <div className={styles.containerTabFlex}>
                        needed inputs: 
                        <Input label="Revenue" name="revenue" initialValue={info.financials.revenue} onChange={()=> {}} />
                        <Input label="Last Inventory" name="last_inventory" initialValue={info.balance.lastInventory} onChange={()=> {}} />
                        <Input label="Gross Profits" name="gross_profits" initialValue={info.financials.grossProfits} onChange={()=> {}} />
                </div> */ }
                    <button className={styles.formButton} type="button" onClick={async (e) => {
                            setLoading(true)
                          //  const resData = await fetcherDCF(e.target.form);
                            setInfo(getData(info));
                            setLoading(false)
                        }}>
                            get Metrics
                        </button> 
                        <Table 
                            className={styles.infoTable}
                            data={info} 
                            columns={getColumns()} 
                            updateMyData={updateMyData} 
                        />
                        
                   {/*  <div className={styles.containerTabFlex}>
                        metrics: 
                            COGS = {}
                    </div> 

                    <div><ul>
                        <li><span>Last Free Cash Flow {"  ="}</span><span className={styles.bold}>({formatArrayString(info.availableYears.incomeStatementHistory)})</span></li>
                        <li><span>Median Free Cash Flow {"  ="}</span><span className={styles.bold}>({formatArrayString(info.availableYears.cashflowStatementHistory)})</span></li>
                    </ul></div> */}
                </div>)}

    </div>)
}
