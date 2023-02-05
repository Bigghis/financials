import React, { useState } from "react"
import InfoCmp from "./Info";
import Qualitative from "./Qualitative";
import DCF from './DCF';
import DDM from './DDM';
import NoData from "./NoData";

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
    const [ tab, setTab ] = useState(0);

    const getTitle = () => {
      if (tab === 0) {
        return 'Info'
      }
      if (tab === 1) {
        return 'Qualitative Analysis'
      }
      if (tab === 2) {
        return 'Discounted Cash Flow method'
      }
      if (tab === 3) {
        return 'Dividend Discount Model method (three stages)'
      }
    }

    const getModule = () => {
      const title = getTitle();
      const hasData = Object.keys(data).length > 0;
      if (tab === 0) {
       return hasData ? <InfoCmp title={title} data={data} /> : <NoData title={title}  />
      }
      if (tab === 1) {
        return hasData ? <Qualitative title={title} data={data} /> : <NoData title={title}  />
      }
      if (tab === 2) {
        return hasData ? <DCF  title={title} data={data} /> : <NoData title={title}  />
      }
      if (tab === 3) {
        return hasData ? <DDM  title={title} data={data} /> : <NoData title={title}  />
      }
    }

    return (
      <TabContainer>
        <TabHead>
        <Tab selected={tab === 0 } onClick={() => setTab(0)}>
              INFO
          </Tab>
          <Tab selected={tab === 1 } onClick={() => setTab(1)}>
              QUALITATIVE ANALYSIS
          </Tab>
          <Tab selected={tab === 2 } onClick={() => setTab(2)}>
              DCF
          </Tab>
          <Tab selected={tab === 3 } onClick={() => setTab(3)}>
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
