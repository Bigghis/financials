import yahooFinance from 'yahoo-finance2';
import Info, { QUERY_OPTIONS } from '../../logic/models/Info';

const handler = async (req, res) => {
  const { stock } = req.body;
  if (stock) { 
    let data = null;
    if (global.localStorage) {
      data = global.localStorage.getItem(`INFO_${stock}`);
    }
    if (!data) {
        data = await yahooFinance.quoteSummary(stock, { modules: Object.keys(QUERY_OPTIONS)});
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
