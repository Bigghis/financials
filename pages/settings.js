import React, { useContext } from 'react';
import Layout from '../components/Layout';
import Select from '../components/Select';
import { SettingsContext } from '../context/SettingsContext';

import styles from '../styles/Home.module.css'

const UNIT_ITEMS = [
  { name: 'K', value: 'k'},
  { name: 'MM', value: 'm'},
  { name: 'B', value: 'b'}
] 

export default function Settings({}) {
  const settingsContext = useContext(SettingsContext);

  const { unit, setUnit} = settingsContext;

  return (<div>
          <h3 className={styles.title}>
            Settings
          </h3>
          <div className={styles.containerTabFlex}>
              <Select 
                label="Unit" 
                name="unit" 
                items={UNIT_ITEMS} 
                defaultValue={unit || null}
                onChange={(v) => {
                  setUnit(v)
              }} 
              />
          </div>
  </div>)
}

Settings.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
