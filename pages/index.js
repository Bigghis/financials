import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import Tabs from "../components/Tabs"
import InfoStock from '../components/InfoStock'
import { DataContext } from '../context/DataContext';

export default function Home({}) {
  const [data, setData] = useState([]);

  const dataContext = useContext(DataContext);
  const { commonData, setCommonData } = dataContext; 

  const clearData = () => {
    setData([])
    setCommonData([])
  }

  const setDataCallback = (data) => {
    setCommonData(data)
    setData(data)
  }

  return (<div>
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
