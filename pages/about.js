import React from 'react';
import Layout from '../components/Layout';

import styles from '../styles/Home.module.css'

export default function About({}) {

  return (<div>
    <h3 className={styles.title}>
      About
    </h3>
  </div>)
}

About.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
