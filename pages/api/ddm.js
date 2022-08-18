// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import yahooFinance from 'yahoo-finance2';
import DDM from '../../logic/models/DDM'

const handler = async (req, res) => {
   // console.log("req b=", req.body)
    if (req.body && req.body.params.stock) {
        const { params } = req.body;
        // cache system data
        // console.log("API DCF ====", {...params})
            let data = null;
            if (global.localStorage) {
                data = global.localStorage.getItem(`DDM_${params.stock}`);
            }
         //   console.log("cached DATA=", data)
            if (!data) {
                data  = await yahooFinance.quoteSummary(params.stock, { modules: Object.keys(DDM.getQueryOptions())});
                // cache data 
                if (global.localStorage) {
                    global.localStorage.setItem(`DDM_${params.stock}`, JSON.stringify(data));
                }
            } else {
                data = JSON.parse(data);
            }

            const ddm = new DDM(data, {...params});
            const resData = ddm.calculateDDM();
            console.log("RES DATA =   ", resData)
            res.status(200).json(resData);
    } else {
        res.status(500).json({ error: 'failed to load data' });
    }
  }
  
export default handler;
