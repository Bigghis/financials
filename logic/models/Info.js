import { toDecimal, toPercent, getYear } from '../utils.js';
import { queryOptions } from '../info.js';

// https://github.com/gadicc/node-yahoo-finance2/blob/f27b9017fd5643932f4067c5d7b2a641f783a7ea/src/modules/quoteSummary-iface.ts

export const getYearDataRange = (data, modules) => {
  if(modules.length === 2) {
      if (modules[0] in data && modules[1] in data[modules[0]]) {
        const _data = data[modules[0]][modules[1]]
        const years = _data.map(elem => parseInt(getYear(elem.endDate)))
        return years
      }
    }
  return null;
}

export const showAllYearsDataRange = (data) => {
    const res = {};
    const _queryOptions = queryOptions()
    for (const key in _queryOptions) {
      res[key] = getYearDataRange(data, _queryOptions[key]);
    }
    return res;
}

export const getGrowthRate = (beginValue,  endValue) => {
  // growth rate between two numbers
  const res =  ( (endValue - beginValue) / beginValue ) //* 100;
  return isNaN(res) ? null : res;
}

export const getCOGS = (totalRevenue,  grossProfits) => {
      // https://www.wallstreetprep.com/knowledge/cogs-cost-of-goods-sold/
      // Cost of Goods Sold (COGS) = Revenue - Gross profit
      const res =  totalRevenue - grossProfits;
      return isNaN(res) ? null : res;
}

export const getGrossMargin = (totalRevenue, cogs) => {
  // https://www.wallstreetprep.com/knowledge/cogs-cost-of-goods-sold/
  // Gross Margin = (Revenue – COGS) / Revenue
  const res = (totalRevenue - cogs) / totalRevenue;
  return isNaN(res) ? null : res;
}

export const getAverageAgeOfInventory = (inventory, cogs) => {
  // https://www.investopedia.com/terms/a/average-age-of-inventory.asp
  // ( inventory at present / cogs ) * 365 days
  // medium values of sectors:
  // https://www.readyratios.com/sec/ratio/inventory-turnover/

  const res =  parseInt( (inventory / cogs) * 365 );
  const resString = res.toString();
  return isNaN(res) ? null : resString;
}

export const getBookValue = (totalAssets, totalLiabilities) => {
  // https://www.investopedia.com/articles/investing/110613/market-value-versus-book-value.asp
  const res =  parseInt( totalAssets - totalLiabilities );
  return isNaN(res) ? null : res;
}

export const getEffectiveTaxRate = (incomeTaxExpense, incomeBeforeTax) => {
  // https://www.investopedia.com/ask/answers/102714/how-are-effective-tax-rates-calculated-income-statements.asp
  const res =  incomeTaxExpense / incomeBeforeTax;
  return isNaN(res) ? null : res;
}

export const getReturnOnCapital = (ebit, taxRate, bookValue) => {
  // see page 8 of
  // https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf
  const res =  (ebit * (1 - taxRate)) / bookValue;
  return isNaN(res) ? null : res;
}

export const getReinvestementRate = (growthRate, roc) => {
  // see page 8 of
  // https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf
  // growthRate = 0.05
  // roc = 0.0732
  const res =  (growthRate / roc) //* 100;
  return isNaN(res) ? null : res;
}

export const getFreeCashFlowNextYear = (ebit, growthRate, taxRate, reinvestmentRate) => {
  // see page 8 of
  // https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf
  // growthRate = 0.05
  // roc = 0.0732
  const ebitRes = (ebit * (1 + growthRate) * (1 - taxRate) )
  const res = parseInt(ebitRes - (ebitRes * reinvestmentRate))
  return isNaN(res) ? null : res;
}

class Info {
    constructor(data) { 
        this.data = data;


        this.cogs = this.getCOGS()
    }

    static getQueryOptions = () => {
      return queryOptions();
    }

    getCOGS() {
      // https://www.wallstreetprep.com/knowledge/cogs-cost-of-goods-sold/
      // Cost of Goods Sold (COGS) = Revenue - Gross profit
      return this.data.financialData.totalRevenue - this.data.financialData.grossProfits
    }

    getGrossMargin() {
      // https://www.wallstreetprep.com/knowledge/cogs-cost-of-goods-sold/
      // Gross Margin = (Revenue – COGS) / Revenue
      return (this.data.financialData.totalRevenue - this.cogs) / this.data.financialData.totalRevenue;
    }

    getAverageAgeOfInventory() {
      // https://www.investopedia.com/terms/a/average-age-of-inventory.asp
      // ( inventory at present / cogs ) * 365 days
      // medium values of sectors:
      // https://www.readyratios.com/sec/ratio/inventory-turnover/

      //last invbentory = 
      const lastInventory = this.data.balanceSheetHistory.balanceSheetStatements[0].inventory;
      return parseInt( (lastInventory / this.cogs) * 365 )
    }


    getPastGrowthRate(beginYear, endYear) {
        const beginFcff = this.calculateFCFF(beginYear);
        const endFcff = this.calculateFCFF(endYear);
        return ( (endFcff - beginFcff) / beginFcff ) * 100;
      }
  
      getMediumPastFcffGrowthRate() {
        const years = this.getYearDataRange(queryOptions().cashflowStatementHistory).sort((a1,b1) => a1-b1);
        let sum = 0;
        let i=0;
        let count = 0;
        while(i+1 < years.length){
          sum += this.getPastGrowthRate(years[i], years[i+1]);
          i++;
          count++;
        }
        return (sum / count).toFixed(2);
      }
  
      getYearDataRange(modules) {
        if(modules.length === 2) {
            const data = this.data[modules[0]][modules[1]]
            const years = data.map(elem => parseInt(getYear(elem.endDate)))
            return years
        }
        return ' - '
      }
  
      showAllYearsDataRange() {
          const res = {};
          const _queryOptions = queryOptions()
          for (const key in _queryOptions) {
            res[key] = this.getYearDataRange(_queryOptions[key]);
          }
          return res;
      }
  
      showAlldata() {
        return this.data
      }

      calculate () {
          return {
            availableYears: this.showAllYearsDataRange(),
            balance: {
              lastInventory: this.data.balanceSheetHistory.balanceSheetStatements[0].inventory
            },
            financials: {
              revenue: this.data.financialData.totalRevenue,
              grossProfits: this.data.financialData.grossProfits
            },
           /* metrics: {
              revenue: this.data.financialData.totalRevenue,
              cogs: this.cogs,
              grossMargin: this.getGrossMargin(), //percent
              averageAgeOfInventory: this.getAverageAgeOfInventory()
            }*/
          }
      }
}

export default Info;
