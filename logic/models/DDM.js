//
//
// https://github.com/gadicc/node-yahoo-finance2/blob/f27b9017fd5643932f4067c5d7b2a641f783a7ea/src/modules/quoteSummary-iface.ts
import { queryOptions } from "../info";

class DDM {
    constructor(data, params) { 
        this.price =  params.price;
        this.lastEPS = params.lastEPS;
        this.lastDividend = params.lastDividend
    }

    static getQueryOptions = () => {
        return queryOptions([
            'summaryDetail',
            'defaultKeyStatistics',
            'cashflowStatementHistory',
            'earningsHistory'
      ])
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
