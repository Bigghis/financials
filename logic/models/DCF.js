import { toDecimal, toPercent, getYear } from '../utils.js';

// https://www.affaridiborsa.com/articoli/172-discounted-cash-flow-cos-e-e-come-calcolare-il-metodo-dei-flussi-di-cassa-attualizzati.html#a_5

// https://finance.yahoo.com/news/discounted-cash-flow-guide-investors-175353290.html
// DCF = (C1 / (1+R)^1) + (C2 / (1+R)^2) + … (Cn / (1+R)^n)

// 
// FLUSSI DI CASSA ATTESI
// FCFF formulas:
// https://www.educba.com/fcff-formula/

// https://studiofazzini.it/ricerche/i-flussi-di-cassa-attesi-il-tempo-e-il-rischio-nel-metodo-dcf/

// TASSO DI SCONTO:
// non uso il WACC e non uso il CAPM!
// in realtà uso il rendimento che voglio da questo investimento!
// 
// https://www.youtube.com/watch?v=-WppjJhv83k

//TERMINAL VALUE:
// https://studiofazzini.it/ricerche/il-terminal-value-valore-finale-nel-metodo-dcf/
// https://github.com/gadicc/node-yahoo-finance2/blob/f27b9017fd5643932f4067c5d7b2a641f783a7ea/src/modules/quoteSummary-iface.ts

// HOW TO EVALUATE A COMPANY WITH a negative FCFF ??
// https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf

const QUERY_OPTIONS = {  // TODO:: remove this part
  price: ['price'],
  summaryDetail: ['summaryDetail'],
  defaultKeyStatistics: ['defaultKeyStatistics'],
  balanceSheetHistory: ['balanceSheetHistory', 'balanceSheetStatements' ],
  incomeStatementHistory: ['incomeStatementHistory', 'incomeStatementHistory'],
  cashflowStatementHistory: ['cashflowStatementHistory', 'cashflowStatements'],
  financialData: ['financialData']
//  earningsHistory: ['earningsHistory', 'history']
};

class DCF {
    constructor(data, params) {
      console.log("INIT DCF FREECASH FLOW  params =", params)
      this.params = params;
      this.data = data;

      this.stock = params.stock; // unused
      this.freeCashFlow = parseInt(params.freeCashFlow);
      this.sharesOutstanding = parseInt(params.sharesOutstanding);
      this.totalDebt = parseInt(params.totalDebt);
      this.futureYears = parseInt(params.futureYears)
  //    this.pastYears = parseInt(past_years);
      this.discountRate = toDecimal(params.discountRate);// tasso di sconto
      this.growthRate = toDecimal(params.growthRate);  //crescita stimata dell'azienda prima del terminal value
      this.longTermGrowthRate = toDecimal(params.longTermGrowthRate);

      this.pastFcffs = [];
      this.futureFcffs = [];
      this.futureDcfs = [];
      this.terminalValue = 0;
    }

    static getQueryOptions = () => {  // TODO:: remove this!
      return QUERY_OPTIONS;
    }

    getDataYear(year, modules) {
      const data = modules.length === 2 ? this.data[modules[0]][modules[1]] : this.data[modules[0]];
      if (data && data.length > 0) {
        for (let i=0; i<data.length; i++) {
          if (getYear(data[i].endDate) === year) {
            return data[i];
          }
        }
        return null;
      }
      return null;
    }
 
/*     getTaxrate(incomeBeforeTax, incomeTaxExpense) {
      // incomeTaxExpense = incomeBeforeTax * taxRate, so
      // taxRate = incomeTaxExpense / incomeBeforeTax;
      const taxRate = incomeTaxExpense / incomeBeforeTax;
      return taxRate;
    } */

/*     getChangesInWorkingCapital(balanceSheetData, year) {
      //all data come from balance sheet
      // changeInWorkingCapital for year = (currentAssets(year) - currentAssets(year-1)) +
      // (inventory(year) - inventory(year-1)) +
      // (currentLiabilites(year) - currentLiabilites(year-1))
      // 
      // we need:
      // totalCurrentAssets
      // inventory
      // totalCurrentLiabilities

      const allYears = this.getYearDataRange(QUERY_OPTIONS.balanceSheetHistory);
      console.log("getChangesInWorkingCapital year=", year)
      if (allYears.indexOf(year -1) === -1) {
        return 0;
      } else {
        const balanceSheetDataPreviousYear = this.getDataYear((year - 1), QUERY_OPTIONS.balanceSheetHistory)
        
        let changeInWorkingCapital = (balanceSheetData.totalCurrentAssets - balanceSheetDataPreviousYear.totalCurrentAssets)
                                      + (balanceSheetData.inventory - balanceSheetDataPreviousYear.inventory)
                                      + (balanceSheetData.totalCurrentLiabilities - balanceSheetDataPreviousYear.totalCurrentLiabilities);
        if (isNaN(changeInWorkingCapital)) {
          changeInWorkingCapital = 0;
        }
        console.log("CHANGEINWORKINGCAPITAL = ", changeInWorkingCapital);
        return changeInWorkingCapital;
      }
    } */

/*     calculateFCFF(year) {
      //UNUSED ...if we use freeCashflow from financialData...
      console.log("-----------------------------------------------------------------------")
      // calculate FCFF (free cash flow to the firms) for the year year

    //  const cashFlowData = this.getDataYear(year, QUERY_OPTIONS.cashflowStatementHistory);
    //  const fcff = cashFlowData.totalCashFromOperatingActivities - cashFlowData.capitalExpenditures;


      // FCFF Formula =  EBIT x (1-tax rate) + Dep & Amort + Changes in Working Capital – Capital Expenditure
      const balanceSheetData = this.getDataYear(year, QUERY_OPTIONS.balanceSheetHistory);
      const incomesData = this.getDataYear(year, QUERY_OPTIONS.incomeStatementHistory);
      const cashFlowData = this.getDataYear(year, QUERY_OPTIONS.cashflowStatementHistory);
      const fcff = (incomesData.ebit * (1 - this.getTaxrate(incomesData.incomeBeforeTax, incomesData.incomeTaxExpense)))
                    + cashFlowData.depreciation
                    + this.getChangesInWorkingCapital(balanceSheetData, year)
                    - cashFlowData.capitalExpenditures;

      
                    console.log("_FCFF = ", fcff);
                    console.log("depreciation = ", cashFlowData.depreciation)
      return parseFloat(fcff);
    } */

    calculateDCF() {
      const actualDCF = this.freeCashFlow / (1 + this.discountRate);
      this.futureFcffs.push(this.freeCashFlow);
      this.futureDcfs.push(actualDCF);

      let tmpFcff = this.freeCashFlow;
      for (let i = 1; i <= this.futureYears; i++) {
        const nextFcff = tmpFcff + (tmpFcff * this.growthRate);
        const nextDcf = nextFcff / Math.pow((1+ this.discountRate ), i+1).toFixed(2);
        this.futureFcffs.push(nextFcff);
        this.futureDcfs.push(nextDcf);
        tmpFcff = nextFcff;
        console.log(`Math.pow((1+ ${this.discountRate} ), ${i +1 }) = `, Math.pow((1+ this.discountRate ), i+1).toFixed(2))
      }

      console.log("FCFFS = ", this.futureFcffs)
      console.log("DCFS = ", this.futureDcfs);
//      console.log("outst:   ", this.sharesOutstanding );
  //    console.log("out+float", this.sharesOutstanding +this.data.defaultKeyStatistics.floatShares   );
//   const pricesData = this.data.price
 //  const shares = pricesData.marketCap / pricesData.regularMarketPrice
 //     console.log("SHARES    = ", shares.toFixed(0))
 //     console.log("OUT SHARE = ", this.sharesOutstanding)
//
//      console.log("MARKET CAP =", pricesData.marketCap)
//      console.log("price= ", pricesData.regularMarketPrice)
      this.calculateTerminalValue();
      const dcfSum = this.futureDcfs.reduce((tmpSum, a) => tmpSum + a, 0);
      const targetEquityValue = this.terminalValue + dcfSum;
      console.log("TOTAL DEBT =",this.totalDebt)
      const targetValue = targetEquityValue - this.totalDebt;
     // const forecastPrice = targetValue / (this.data.defaultKeyStatistics.sharesOutstanding /*+ this.data.defaultKeyStatistics.floatShares */) ;
     const forecastPrice = targetValue / this.sharesOutstanding;
      console.log("targetEquityValue =", targetEquityValue)
      console.log("total debt = ", this.totalDebt);
      console.log("targetValue =", targetValue);
      console.log("this.data.financialData currency = ", this.data.financialData.financialCurrency);
      
      console.log("\nforecastPrice = ", forecastPrice.toFixed(2));
      console.log("actual Price = ", this.data.financialData.currentPrice)
      
      // ((Valore finale-Valore iniziale)/Valore iniziale) x 100
      const safetyMargin = ((forecastPrice - this.data.financialData.currentPrice ) / this.data.financialData.currentPrice ).toFixed(2);
      const safetyMarginPercentage = (safetyMargin * 100).toFixed(2)
      console.log("tasso di sconto = ", toPercent(this.discountRate))
      console.log("\nSafety margin = ", safetyMarginPercentage + "%");

      return [{
        ...this.params, 
        longTermGrowthRate: toPercent(this.longTermGrowthRate),
        growthRate: toPercent(this.growthRate),
        discountRate: toPercent(this.discountRate),
        price: this.data.financialData.currentPrice,
        forecastPrice: forecastPrice.toFixed(2),
        currency: this.data.price.currencySymbol ,
        safetyMargin: safetyMarginPercentage + "%"
      }]
    }

    calculateTerminalValue () {
      const lastFutureFcff = this.futureFcffs[this.futureFcffs.length-1];
      //  console.log("LAST FUTURE FCFF", lastFutureFcff)
      // https://getmoneyrich.com/discounted-cash-flow-dcf/
      // https://www.investopedia.com/terms/t/terminalvalue.asp#:~:text=Terminal%20value%20is%20calculated%20by,company%20after%20the%20forecast%20period.&text=Where%3A,for%20the%20last%20forecast%20period
      // 
      // 
      this.terminalValue = (lastFutureFcff * ( 1+ this.longTermGrowthRate)) / (this.discountRate - this.longTermGrowthRate);

      console.log("terminal VALUE = ", this.terminalValue)

    }
/*
    getPastGrowthRate(beginYear, endYear) {
      const beginFcff = this.calculateFCFF(beginYear);
      const endFcff = this.calculateFCFF(endYear);
      return ( (endFcff - beginFcff) / beginFcff ) * 100;
    }

    getMediumPastFcffGrowthRate() {
      const years = this.getYearDataRange(QUERY_OPTIONS.cashflowStatementHistory).sort((a1,b1) => a1-b1);
      console.log("getMediumPastFcffGrowthRate years", years)
      let sum = 0;
      let i=0;
      let count = 0;
      while(i+1 < years.length){
        sum += this.getPastGrowthRate(years[i], years[i+1]);
        i++;
        count++;
      }
      console.log("sum / count).toFixed(2)", (sum / count).toFixed(2));
      return (sum / count).toFixed(2);
    }
*/
    getYearDataRange(modules) {
      if(modules.length === 2) {
          const data = this.data[modules[0]][modules[1]]
          const years = data.map(elem => parseInt(getYear(elem.endDate)))
          return years
      }
      return ' - '
    }

    showAllYearsDataRange() {
        for (const key in QUERY_OPTIONS) {
          console.log(`data range for ${key} = [ ${this.getYearDataRange(QUERY_OPTIONS[key])} ]`)
        }
    }

    showAlldata() {
      return this.data
    }

    showCashFlowData(year) {
      return this.getDataYear(year, QUERY_OPTIONS.cashflowStatementHistory);
    }

    showIncomeData(year) {
      return this.getDataYear(year, QUERY_OPTIONS.incomeStatementHistory);
    }
}

export default DCF;
