
import axios from 'axios';

// https://pages.stern.nyu.edu/~adamodar/pc/datasets/
// We get some data from Damodaran's xls relative to 
// the stock sectors.

export const getData = async () => {

    const fetcher = async () => {
        return await axios.get('api/industries', {  }).then((res) => {
          return res.data
      })
    }

  await fetcher();

}