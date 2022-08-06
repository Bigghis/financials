import React from 'react';
import Layout from '../components/Layout';

export default function Settings({}) {

  return (<div>
            SETTINGS
  </div>)
}

Settings.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
