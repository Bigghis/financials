import yahooFinance from 'yahoo-finance2';

export const getInfo = async (stock) => {
    return await yahooFinance.quoteSummary(stock, { modules: ['defaultKeyStatistics', 'summaryDetail', 'financialData'] });
}
