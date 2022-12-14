// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import yahooFinance from 'yahoo-finance2';
import DCF from '../../logic/models/DCF'

const handler = async (req, res) => {
    if (req.body && req.body.params.stock) {
        const { params } = req.body;
        // cache system data
            let data = null;
            if (global.localStorage) {
                data = global.localStorage.getItem(`DCF_${params.stock}`);
            }
            if (!data) {
                data  = await yahooFinance.quoteSummary(params.stock, { modules: Object.keys(DCF.getQueryOptions())});
                // cache data 
                if (global.localStorage) {
                    global.localStorage.setItem(`DCF_${params.stock}`, JSON.stringify(data));
                }
            } else {
                data = JSON.parse(data);
            }

            const dcf = new DCF(data, {...params});
            const resData = dcf.calculateDCF();
            res.status(200).json(resData);
    } else {
        res.status(500).json({ error: 'failed to load data' });
    }
  }
  
export default handler;
