import yahooFinance from 'yahoo-finance2';
const QUERY_OPTIONS = {
    price: ['price'],
    summaryProfile: ['summaryProfile'],
    summaryDetail: ['summaryDetail'],
    defaultKeyStatistics: ['defaultKeyStatistics'],
    balanceSheetHistory: ['balanceSheetHistory', 'balanceSheetStatements' ],
    incomeStatementHistory: ['incomeStatementHistory', 'incomeStatementHistory'],
    cashflowStatementHistory: ['cashflowStatementHistory', 'cashflowStatements'],
    financialData: ['financialData'],
    earningsHistory: ['earningsHistory', 'history']
};

export const getInfo = async (stock) => {
    return await yahooFinance.quoteSummary(stock, { modules: ['defaultKeyStatistics', 'summaryDetail', 'financialData'] });
}

export const queryOptions = (filterCategories) => {
    if (filterCategories) {
      const filteredOptions = filterCategories.reduce((QUERY_OPTIONS, key) => ({ ...QUERY_OPTIONS, [key]: QUERY_OPTIONS[key] }), {});
      console.log('filtered = ', filteredOptions)
      return filteredOptions
    }
    return QUERY_OPTIONS;
  }