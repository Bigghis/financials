import React, { useState } from "react"
import DCF from './DCF';
import DDM from './DDM';

import styles from '../styles/Tabs.module.css'

const TabHead = ({ children }) => {
    return (<div className={styles.tabHead}>{children}</div>)
}

const TabContainer = ({ children })  => {
    return (<div className={styles.tabContainer}>{children}</div>)
}

const TabBody = ({ children })  => {
    return (<div className={styles.tabBody}>{children}</div>)
}

const Tab = ({ children, selected, onClick }) => {
    const _className = selected ? styles.tabSelected : styles.tab;
    return (<div className={_className} onClick={onClick}>{children}</div>)
}


const Tabs = ({ data }) => {
    const [ tab, setTab ] = useState(1);

    const getModule = () => {
      const hasData = Object.keys(data).length > 0;
      console.log("DATAAAAAA=", data)
      if (tab === 1) {
        return hasData ? <DCF data={data} /> : 'NO DATA'
      }
      if (tab === 2) {
        return hasData ? <DDM data={data} /> : 'NO DATA'
      }
    }

    return (
      <TabContainer>
        <TabHead>
          <Tab selected={tab === 1 } onClick={() => setTab(1)}>
              DCF
          </Tab>
          <Tab selected={tab === 2 } onClick={() => setTab(2)}>
              DDM
          </Tab>
        </TabHead>
        <TabBody>
          {getModule()}
        </TabBody>
      </TabContainer>
    )
}
export default Tabs 
