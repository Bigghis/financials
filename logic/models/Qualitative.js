import { toDecimal, toPercent, getYear } from '../utils.js';
// import { showAllYearsDataRange } from './Info.js';
// import { queryOptions } from '../info.js';

export const getCapitalAllocation = (data) => {
// for (let i = 0; i < data.balanceSheetHistory.balanceSheetStatements.length; i++) {

    // let lastYearCount = 0;
   // let initialYearCount = data.balanceSheetHistory.balanceSheetStatements.length -1;
   if (data.balanceSheetHistory && data.balanceSheetHistory.balanceSheetStatements &&
    data.incomeStatementHistory && data.incomeStatementHistory.incomeStatementHistory) {
        const len = data.balanceSheetHistory.balanceSheetStatements.length;
    
        const retainedEarnings = data.balanceSheetHistory.balanceSheetStatements[0].retainedEarnings -
        data.balanceSheetHistory.balanceSheetStatements[len -1].retainedEarnings;
    
        const netIncome = data.incomeStatementHistory.incomeStatementHistory[0].netIncome -
        data.incomeStatementHistory.incomeStatementHistory[len -1].netIncome ;
    
        // rendimeento degli utili non distribuiti
        return toPercent(netIncome / retainedEarnings);
    }
    return null;
}
