// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const handler = async (req, res) => {
  if (global.localStorage) { 
    // cache system data
    global.localStorage.clear();
    res.status(200).json({data: 'OK cleared'});
  } else {
      res.status(200).json({data: 'OK'});
  }
}

export default handler;
