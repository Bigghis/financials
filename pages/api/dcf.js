// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import yahooFinance from 'yahoo-finance2';
import DCF from '../../logic/models/DCF'

const handler = async (req, res) => {
   // console.log("req b=", req.body)
    if (req.body && req.body.params.stock) {
        const { params } = req.body;
        // cache system data
        console.log("API DCF ====", {...params})
            let data = global.localStorage.getItem(`DCF_${params.stock}`);
         //   console.log("cached DATA=", data)
            if (!data) {
                data  = await yahooFinance.quoteSummary(params.stock, { modules: Object.keys(DCF.getQueryOptions())});
                // cache data 
                global.localStorage.setItem(`DCF_${params.stock}`, JSON.stringify(data));
            } else {
                data = JSON.parse(data);
            }

            const dcf = new DCF(data, {...params});
            const resData = dcf.calculateDCF();
            console.log("RES DATA =   ", resData)
            res.status(200).json(resData);
    } else {
        res.status(500).json({ error: 'failed to load data' });
    }
  }
  
export default handler;
