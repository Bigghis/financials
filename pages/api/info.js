// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import yahooFinance from 'yahoo-finance2';

const handler = async (req, res) => {
  console.log(req.body)
  const { stock } = req.body;
  if (stock) { 
    // cache system data
    let data = null;
    if (global.localStorage) {
      data = global.localStorage.getItem(`INFO_${stock}`);
    }
    console.log("cached DATA=", data)
    if (!data) {
        data = await yahooFinance.quoteSummary(stock, { modules: ['defaultKeyStatistics', 'price', 'financialData']});
        // cache data 
        if (global.localStorage) {
          global.localStorage.setItem(`INFO_${stock}`, JSON.stringify(data));
        }
    } else {
      data = JSON.parse(data);
    }
    res.status(200).json(data);

  } else {
      res.status(500).json({ error: 'failed to load data' });
  }
}

export default handler;
