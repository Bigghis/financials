import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
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

  return (<div>
            <h3 className={styles.title}>
              Stock Valuation
            </h3>
            <InfoStock dataCallback={(data)=>setData(data)} clearDataCallback={clearData} />
            <Tabs data={data} /> 
  </div>)
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
