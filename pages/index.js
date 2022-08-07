import React, { useState, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Tabs from "../components/Tabs"
import InfoStock from '../components/InfoStock'
import styles from '../styles/Home.module.css'
import { DataContext } from '../context/DataContext';

export default function Home({}) {
  //const [shouldFetchInfo, setShouldFetchInfo,] = useState(false);
  // const [info, setInfo] = useState(null);
  const [data, setData] = useState([]);

  const dataContext = useContext(DataContext);
  const { commonData, setCommonData } = dataContext; 

/*   const clearCache = async () => {
    return await axios.post('api/clear').then((res) => {
      return res.data
    })
  } */

  const clearData = () => {
    setData([])
    setCommonData([])
  }

  const setDataCallback = (data) => {
    setCommonData(data)
    setData(data)
  }

  return (<div>
            <h3 className={styles.title}>
              Stock Valuation
            </h3>
            <InfoStock dataCallback={(data)=>setDataCallback(data)} clearDataCallback={clearData} />
            <Tabs data={commonData || []} /> 
  </div>)
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
