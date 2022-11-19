import React, { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import Table from './Table';
import { getYear, toDecimal, toPercent } from '../logic/utils';
import  { 
    showAllYearsDataRange, 
    getYearDataRange, 
    getFreeCashFlowNextYear, 
    getGrowthRate, 
    getReinvestementRate, 
    getCOGS, 
    getAverageAgeOfInventory, 
    getGrossMargin, 
    getBookValue, 
    getEffectiveTaxRate, 
    getReturnOnCapital 
} from '../logic/models/Info';

import styles from '../styles/Home.module.css'
import tableStyles from '../styles/Table.module.css';
import NoData from './NoData';


export default function InfoCmp({ data, infoData, dataCallback }) {
   // const { price, financialData, defaultKeyStatistics, incomeStatementHistory, cashflowStatementHistory} = data;

/*     const dataContext = useContext(DataContext);
    const { commonData, setCommonData } = dataContext; */

    const getInitialData = (data) => {
        let _data = [];
        // create rows
    
    
        // use years as reference
        let years = getYearDataRange(data, ['incomeStatementHistory', 'incomeStatementHistory']);
        if (years && years.length > 0) {
            years = years.reverse();
        }
    
        if (data && years) {
            const _revenues = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                _revenues[getYear(element.endDate)] = element.totalRevenue        
            }
            
        
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
    
            
    
            // gross profits
            const _grossProfits =  {};
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                _grossProfits[getYear(element.endDate)] = element.grossProfit        
            }
            

            const _ebit = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _ebit[year] = element.ebit; 
            }
        
            //COGS 
            const _cogs = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                _cogs[getYear(element.endDate)] = getCOGS(element.totalRevenue, element.grossProfit)        
            }
        
            //gross margin
            const _grossMargin = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _grossMargin[year] = toPercent(getGrossMargin(element.totalRevenue, _cogs[year]))  
            }
        
            // getAverageAgeOfInventory [days]
            const _ageOfInventory = {}
            const _bookValue = {}
            const _inventory = {}
            const _retainedEarnings = {}
            const _commonStock = {}
            const _totalAssets = {} //used in roa formula
            for (let i = 0; i < data.balanceSheetHistory.balanceSheetStatements.length; i++) {
                const element = data.balanceSheetHistory.balanceSheetStatements[i];
                const year = getYear(element.endDate);
                _ageOfInventory[year] = getAverageAgeOfInventory(element.inventory, _cogs[year]);
                _totalAssets[year] = element.totalAssets;
                _bookValue[year] = getBookValue(element.totalAssets, element.totalLiab);  
                _inventory[year] = element.inventory;
                _commonStock[year] = element.commonStock || null;
                _retainedEarnings[year] = element.retainedEarnings || null;
            }

    
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
    
            const _roc = {}
            let averageRoc = 0
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                const _numRoc = getReturnOnCapital(_ebit[year], toDecimal(_taxRate[year]), _bookValue[year])
                _roc[year] = toPercent(_numRoc)
                averageRoc += _numRoc
            }
            averageRoc = toPercent(averageRoc / years.length)


            const _reinvestmentRate = {}
            for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
                const element = data.incomeStatementHistory.incomeStatementHistory[i];
                const year = getYear(element.endDate);
                _reinvestmentRate[year] = toPercent( getReinvestementRate(toDecimal(_revenueGrowthRate[year]), toDecimal(_roc[year])) )
            }
    
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
            
            const _repurchaseOfStock = {}
            const _roe = {}
            const _roa = {}
            let averageRoe = 0
            let averageRoa = 0
            // const _issuanceOfStock = {}
            const _dividendsPaid = {}
            for (let i = 0; i < data.cashflowStatementHistory.cashflowStatements.length; i++) {
                const element = data.cashflowStatementHistory.cashflowStatements[i];
                const y = getYear(element.endDate);
                _repurchaseOfStock[y] = element.repurchaseOfStock  || null    
                // _issuanceOfStock[y] = element.issuanceOfStock || null
                _dividendsPaid[y] = element.dividendsPaid || null

                _roe[y] = toPercent(element.netIncome / _bookValue[y])
                averageRoe += toDecimal(_roe[y])

                _roa[y] = toPercent(element.netIncome / _totalAssets[y])
                averageRoa += toDecimal(_roa[y])
            }
            averageRoa = toPercent(averageRoa / years.length)
            averageRoe = toPercent(averageRoe / years.length)


            ////////////// compose data /////////////////////

            _data.push({  metricName: 'Total Revenue', ..._revenues });
            _data.push({  metricName: `Revenue Growth Rate (average: ${averageValue})`, ..._revenueGrowthRate });

            _data.push({  metricName: 'Gross Margin', ..._grossMargin });
            _data.push({  metricName: 'Gross Profits', ..._grossProfits });

            _data.push({ metricName: `ROE (average: ${averageRoe})`, ..._roe });
            _data.push({ metricName: `ROA (average: ${averageRoa})`, ..._roa });
            _data.push({  metricName: `Return On Capital (average: ${averageRoc})`, ..._roc });
            _data.push({  metricName: 'Reinvestment Rate', ..._reinvestmentRate });
            _data.push({  metricName: `FCFF (year+1) (average: ${averageFcf})`, ..._fcf });


            _data.push({  metricName: 'Inventory', ..._inventory });
            _data.push({  metricName: 'Age Of Inventory (days)', ..._ageOfInventory });
            _data.push({  metricName: 'Book Value', ..._bookValue });

            _data.push({  metricName: 'EBIT', ..._ebit });
            _data.push({  metricName: 'COGS', ..._cogs });

            _data.push({  metricName: `Tax Rate (average: ${averageTaxRate})`, ..._taxRate });
            _data.push({ metricName: 'Common Stocks', ..._commonStock });
            _data.push({ metricName: 'Retained Earnings', ..._retainedEarnings });
            _data.push({ metricName: 'Dividends Paid', ..._dividendsPaid });
            _data.push({ metricName: 'Repurchase Of Stocks', ..._repurchaseOfStock });

            
        }
        return _data
    }
    
/*     const getData = (data) => {
        let _data = [];
            //TODO:: implementare!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            return null
    } */


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
            const years = [...new Set(showAllYearsDataRange(data).incomeStatementHistory)];
            let _cols = [];
            if (years && years.length > 0) {
                _cols = years.map(year => {
                const yearString = year.toString();
                return {        
                        Header: yearString,
                        className: tableStyles.infoCol,            
                    //  width: 140,
                        accessor: yearString
                    };
                });

                _cols = _cols.reverse();
            }
            
            cols = [{ 
                Header: '', 
                accessor: 'metricName', 
                        className: tableStyles.sticky,
                        headerClassName: tableStyles.sticky,
                        Cell: (props) => <b>{props.value}</b>
                    },
                    ..._cols];
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

  const _renderData = () =>  {
    if (info && info.length > 0) {
        return (<div className={styles.containerTabFlexUl}>
                    <Table 
                        tableType="INFO"
                        className={tableStyles.infoTable}
                        data={info} 
                        columns={getColumns()} 
                        updateMyData={updateMyData} 
                        useTableButtons
                    />
                </div>);
    } 
    return (<NoData />);
  }
    return (<div>
                {loading && <div className={styles.spinner}><SpinnerDotted size={30} thickness={180} speed={180} color="#0070f3" secondaryColor="#fff" enabled={loading} /></div>}
                <h4 className={styles.subtitle}>
                    Info
                </h4> 
                {_renderData()}
            </div>)
}
