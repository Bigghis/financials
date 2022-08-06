import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head'
import Image from 'next/image'
import Tabs from "../components/Tabs"
import InfoStock from '../components/InfoStock'

import styles from '../styles/Home.module.css'

export default function Home({}) {
  //const [shouldFetchInfo, setShouldFetchInfo,] = useState(false);
  // const [info, setInfo] = useState(null);
  const [data, setData] = useState([]);

  const clearCache = async () => {
    return await axios.post('api/clear').then((res) => {
      return res.data
    })
  }

  const clearData = () => {
    setData([])
  }

  return (<React.Fragment>
    <div className={styles.container}>
      <Head>
        <title>Stock Valuation</title>
        <meta name="description" content="Stock Valuation next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3 className={styles.title}>
          Stock Valuation
        </h3>
          <InfoStock dataCallback={(data)=>setData(data)} clearDataCallback={clearData} />
            <Tabs data={data} />     
      </main>
    </div>
                <footer className={styles.footer}>
                <div className={styles.footerRow}>
                 {/*  {global.localStorage && (<button className={styles.formButton} type="button" 
                    onClick={clearCache} >Clear cache</button>)} */}
                    <div className={styles.infoClaudio}
                    >
                      <div className={styles.infoClaudioText}>Powered by a value investor{' '}</div>
                      <div className={styles.logo}>
                        <Image src="/a.jpg" alt="Don" width={38} height={60} />
                      </div>
                    </div>
                </div>
                <div className={styles.footerSubRow}>
                  Data taken from <a target="_blank" rel="noreferrer" href="https://finance.yahoo.com/">Yahoo! Finance</a> and elaborated by Bigghis.
                </div>
                </footer>
                </React.Fragment>
  )
}
