import React, { useContext } from 'react';
import Select from './Select';

import styles from '../styles/Home.module.css'

const UNIT_ITEMS = [
  { name: 'K', value: 'k'},
  { name: 'MM', value: 'm'},
  { name: 'B', value: 'b'}
] 

const Settings = ({unit, setUnit}) => {
  return (<div className={styles.containerSettings}>
              <div className={styles.settingsTitle}>
                Settings
              </div>
              <Select 
                label="Unit" 
                name="unit"
                items={UNIT_ITEMS} 
                defaultValue={unit || null}
                onChange={(v) => {
                  setUnit(v)
              }} 
              />
          </div>)
}

export default Settings;
