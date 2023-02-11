import { toDecimal, toPercent, getYear } from '../utils.js';
import { queryOptions } from '../info.js';

// https://github.com/gadicc/node-yahoo-finance2/blob/f27b9017fd5643932f4067c5d7b2a641f783a7ea/src/modules/quoteSummary-iface.ts

export const getYearDataRange = (data, modules) => {
  if (modules.length === 2) {
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

export const getGrowthRate = (beginValue, endValue) => {
  // growth rate between two numbers
  const res = ((endValue - beginValue) / beginValue) //* 100;
  return isNaN(res) ? null : res;
}

export const getCOGS = (totalRevenue, grossProfits) => {
  // https://www.wallstreetprep.com/knowledge/cogs-cost-of-goods-sold/
  // Cost of Goods Sold (COGS) = Revenue - Gross profit
  const res = totalRevenue - grossProfits;
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

  const res = parseInt((inventory / cogs) * 365);
  const resString = res.toString();
  return isNaN(res) ? null : resString;
}

export const getBookValue = (totalAssets, totalLiabilities) => {
  // https://www.investopedia.com/articles/investing/110613/market-value-versus-book-value.asp
  const res = parseInt(totalAssets - totalLiabilities);
  return isNaN(res) ? null : res;
}

export const getEffectiveTaxRate = (incomeTaxExpense, incomeBeforeTax) => {
  // https://www.investopedia.com/ask/answers/102714/how-are-effective-tax-rates-calculated-income-statements.asp
  const res = incomeTaxExpense / incomeBeforeTax;
  return isNaN(res) ? null : res;
}

export const getReturnOnCapital = (ebit, taxRate, bookValue) => {
  // see page 8 of
  // https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf
  const res = (ebit * (1 - taxRate)) / bookValue;
  return isNaN(res) ? null : res;
}

export const getReinvestementRate = (growthRate, roc) => {
  // see page 8 of
  // https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf
  // growthRate = 0.05
  // roc = 0.0732
  const res = (growthRate / roc) //* 100;
  return isNaN(res) ? null : res;
}

export const getFreeCashFlowNextYear = (ebit, growthRate, taxRate, reinvestmentRate) => {
  // see page 8 of
  // https://pages.stern.nyu.edu/~adamodar/pdfiles/valn2ed/ch22.pdf
  // growthRate = 0.05
  // roc = 0.0732
  const ebitRes = (ebit * (1 + growthRate) * (1 - taxRate))
  const res = parseInt(ebitRes - (ebitRes * reinvestmentRate))
  return isNaN(res) ? null : res;
}

export const getMultiplesData = (data) => {
  let multiples = {}
  if (data) {
    const s = data.summaryDetail || null;
    const f = data.financialData || null;

    if (data.defaultKeyStatistics) {
      const d = data.defaultKeyStatistics;

      multiples['Trailing P/E'] = s && s.trailingPE ? (s.trailingPE).toFixed(2) : null;
      multiples['Forward P/E'] = d.forwardPE ? (d.forwardPE).toFixed(2) : null;
      multiples['Book Value'] = d.bookValue ? (d.bookValue).toFixed(2) : null;
      multiples['Price To Book PBV'] = d.priceToBook ? (d.priceToBook).toFixed(2) : null;
      multiples["Trailing Eps"] = d.trailingEps || null;
      multiples["Forward Eps"] = d.forwardEps || null;
      multiples["PEG Ratio"] = d.pegRatio || null;
      multiples["Price To Sales"] = s && s.priceToSalesTrailing12Months ? (s.priceToSalesTrailing12Months).toFixed(2) : null;
      multiples['EV To Sales'] = f ? (d.enterpriseValue / f.totalRevenue).toFixed(2) : null;
    }
  }
  return multiples;
}

export const getMarginsData = (data) => {
  let margins = {}
  if (data) {
    const f = data.financialData || null;
    // last year's ebit available
    let ebit = null;
    let tRate = null;
    let cogs = null;
    let researchDevelopment = null;
    if (data.incomeStatementHistory) {
      const element = data.incomeStatementHistory.incomeStatementHistory[0];
      ebit = element.ebit;
      tRate = getEffectiveTaxRate(element.incomeTaxExpense, element.incomeBeforeTax);
      cogs = getCOGS(element.totalRevenue, element.grossProfit);
      researchDevelopment = element.researchDevelopment;
    }

    // last year's ebit available
    margins["Sales (last Total revenues available)"] = f ? f.totalRevenue : null;
    margins["Pre-tax Operating Margin (EBIT / Sales)"] = ebit && f ? toPercent(ebit / f.totalRevenue) : null;
    margins["After-tax Operating Margin (EBIT(1-marginal tax rate) / Sales)"] = ebit && f ? toPercent((ebit * (1 - tRate)) / f.totalRevenue) : null;
    margins["EBITDA / Sales"] = f ? toPercent(f.ebitda / f.totalRevenue) : null;
    margins["COGS / Sales"] = f && cogs ? toPercent(cogs / f.totalRevenue) : null;
    margins["R&D / Sales"] = researchDevelopment && f ? toPercent(researchDevelopment / f.totalRevenue) : null;
  }

  return margins;
}

export const getInitialData = (data) => {
  let _income = [];
  let _returns = [];
  let _balance = [];
  const _averages = {};
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
        _revenueGrowthRate[year] = toPercent(getGrowthRate(_revenues[year - 1], _revenues[year]))
        averageValue += toDecimal(_revenueGrowthRate[year])
        cont++;
      }
    }
    averageValue = toPercent(averageValue / cont)

    // gross profits
    const _grossProfits = {};
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
    // profit margin = operating income / total revenues
    const _operatingMargin = {}
    for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
      const element = data.incomeStatementHistory.incomeStatementHistory[i];
      const year = getYear(element.endDate);
      _grossMargin[year] = toPercent(getGrossMargin(element.totalRevenue, _cogs[year]))
      _operatingMargin[year] = toPercent(element.operatingIncome / element.totalRevenue);
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
    averageTaxRate = toPercent(averageTaxRate / years.length);

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
      _reinvestmentRate[year] = toPercent(getReinvestementRate(toDecimal(_revenueGrowthRate[year]), toDecimal(_roc[year])))
    }

    const _fcf = {}
    let averageFcf = 0;
    for (let i = 0; i < data.incomeStatementHistory.incomeStatementHistory.length; i++) {
      const element = data.incomeStatementHistory.incomeStatementHistory[i];
      const year = getYear(element.endDate);
      // ebit, growthRate, taxRate, reinvestmentRate
      _fcf[year] = getFreeCashFlowNextYear(
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
    const _netIncome = {}
    let averageRoe = 0
    let averageRoa = 0
    // const _issuanceOfStock = {}
    const _dividendsPaid = {}
    for (let i = 0; i < data.cashflowStatementHistory.cashflowStatements.length; i++) {
      const element = data.cashflowStatementHistory.cashflowStatements[i];
      const y = getYear(element.endDate);
      _repurchaseOfStock[y] = element.repurchaseOfStock || null
      // _issuanceOfStock[y] = element.issuanceOfStock || null
      _dividendsPaid[y] = element.dividendsPaid || null

      _roe[y] = toPercent(element.netIncome / _bookValue[y])
      averageRoe += toDecimal(_roe[y])

      _roa[y] = toPercent(element.netIncome / _totalAssets[y])
      averageRoa += toDecimal(_roa[y])

      _netIncome[y] = element.netIncome || null

    }
    averageRoa = toPercent(averageRoa / years.length)
    averageRoe = toPercent(averageRoe / years.length)

    const _netIncomeGrowthRate = {}
    const _netMargins = {}
    let averageNetIncomeGrowthValue = 0;
    let cont1 = 0;
    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      if (i === 0) {
        _netIncomeGrowthRate[year] = null;
      } else {
        _netIncomeGrowthRate[year] = toPercent(getGrowthRate(_netIncome[year - 1], _netIncome[year]))
        averageNetIncomeGrowthValue += toDecimal(_netIncomeGrowthRate[year])
        cont1++;
      }
      _netMargins[year] = toPercent(_netIncome[year] / _revenues[year])
    }
    averageNetIncomeGrowthValue = toPercent(averageNetIncomeGrowthValue / cont1)


    ////////////// compose data /////////////////////
    _income.push({ metricName: 'Total Revenue', ..._revenues });
    _income.push({ metricName: `Revenue Growth Rate (avg: ${averageValue})`, ..._revenueGrowthRate });
    _income.push({ metricName: 'Net Income', ..._netIncome });
    _income.push({ metricName: `Net Income (earnings) Growth Rate (avg: ${averageNetIncomeGrowthValue})`, ..._netIncomeGrowthRate });
    _income.push({ metricName: 'Gross Margin', ..._grossMargin });
    _income.push({ metricName: 'Operating Margin', ..._operatingMargin });
    _income.push({ metricName: 'Net Margin', ..._netMargins });
    _income.push({ metricName: 'Gross Profits', ..._grossProfits });

    _income.push({ metricName: 'EBIT', ..._ebit });
    _income.push({ metricName: 'COGS', ..._cogs });
    _income.push({ metricName: `Tax Rate (avg: ${averageTaxRate})`, ..._taxRate });

    _returns.push({ metricName: `ROE (avg: ${averageRoe})`, ..._roe });
    _returns.push({ metricName: `ROA (avg: ${averageRoa})`, ..._roa });
    _returns.push({ metricName: `Return On Capital (avg: ${averageRoc})`, ..._roc });
    _returns.push({ metricName: 'Reinvestment Rate', ..._reinvestmentRate });
    _returns.push({ metricName: `FCFF (year+1) (avg: ${averageFcf})`, ..._fcf });

    _balance.push({ metricName: 'Inventory', ..._inventory });
    _balance.push({ metricName: 'Age Of Inventory (days)', ..._ageOfInventory });
    _balance.push({ metricName: 'Book Value', ..._bookValue });
    _balance.push({ metricName: 'Common Stocks', ..._commonStock });
    _balance.push({ metricName: 'Retained Earnings', ..._retainedEarnings });
    _balance.push({ metricName: 'Dividends Paid', ..._dividendsPaid });
    _balance.push({ metricName: 'Repurchase Of Stocks', ..._repurchaseOfStock });

    _averages = {
      averageRevenueGrowthrate: toDecimal(averageValue),
      averageNetIncomeGrowthValue: toDecimal(averageNetIncomeGrowthValue)
    }
  }
  return {
    _income,
    _returns,
    _balance,
    _averages
  }
}

/*

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
            }
          }
      }
}

export default Info;
*/
