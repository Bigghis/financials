//
//
// https://github.com/gadicc/node-yahoo-finance2/blob/f27b9017fd5643932f4067c5d7b2a641f783a7ea/src/modules/quoteSummary-iface.ts

const QUERY_OPTIONS = {  /// TODO:: remove this!
    // price: ['price'],
    summaryDetail: ['summaryDetail'],
    defaultKeyStatistics: ['defaultKeyStatistics'],
    // balanceSheetHistory: ['balanceSheetHistory', 'balanceSheetStatements' ],
    // incomeStatementHistory: ['incomeStatementHistory', 'incomeStatementHistory'],
    cashflowStatementHistory: ['cashflowStatementHistory', 'cashflowStatements'],
    // financialData: ['financialData']
    earningsHistory: ['earningsHistory', 'history']
  };
class DDM {
    constructor(data, params) { 
        this.price =  params.price;
        this.lastEPS = params.lastEPS;
        this.lastDividend = params.lastDividend
    }

    static getQueryOptions = () => {  // Remove this!
        return QUERY_OPTIONS;
    }

    calculateDDM() {
        return {
            pe: this.price / this.lastEPS,
           // dividendYieldFwd: this.lastDividend / this.price, //dividendo anno prossismo / this.price
            dividendYield: this.lastDividend / this.price
        }
    }

}

export default DDM;
