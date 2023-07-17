import React, { useState } from "react"
import InfoCmp from "./Info";
import Qualitative from "./Qualitative";
import Industry from "./Industry";
import DCF from './DCF';
import DDM from './DDM';
import NoData from "./NoData";

import styles from '../styles/Tabs.module.css'
import MultiplesCmp from "./Multiples";


const TabHead = ({ children }) => {
  return (<div className={styles.tabHead}>{children}</div>)
}

const TabContainer = ({ children }) => {
  return (<div className={styles.tabContainer}>{children}</div>)
}

const TabBody = ({ children }) => {
  return (<div className={styles.tabBody}>{children}</div>)
}

const Tab = ({ children, selected, onClick }) => {
  const _className = selected ? styles.tabSelected : styles.tab;
  return (<div className={_className} onClick={onClick}>{children}</div>)
}


const Tabs = ({ data }) => {
  const [tab, setTab] = useState(0);

  const getTitle = () => {
    switch (tab) {
      default:
        return 'Info'
      case 1:
        return 'Industry (from Aswath Damodaran\'s Dataset)'
      case 2:
        return 'Qualitative Analysis'
      case 3:
        return 'Discounted Cash Flow method'
      case 4:
        return 'Dividend Discount Model method (three stages)'
      case 5:
        return 'Multiples'
    }
  }

  const getModule = () => {
    const title = getTitle();
    const hasData = Object.keys(data).length > 0;
    if (!hasData) {
      return <NoData title={title} />
    }
    switch (tab) {
      default:
        return <InfoCmp title={title} data={data} />
      case 1:
        return <Industry title={title} data={data} />
      case 2:
        return <Qualitative title={title} data={data} />
      case 3:
        return <DCF title={title} data={data} />
      case 4:
        return <DDM title={title} data={data} />
      case 5:
        return <MultiplesCmp title={title} data={data} />
    }
  }
  return (
    <TabContainer>
      <TabHead>
        <Tab selected={tab === 0} onClick={() => setTab(0)}>
          INFO
        </Tab>
        <Tab selected={tab === 1} onClick={() => setTab(1)}>
          INDUSTRY
        </Tab>
        <Tab selected={tab === 2} onClick={() => setTab(2)}>
          QUALITATIVE
        </Tab>
        <Tab selected={tab === 3} onClick={() => setTab(3)}>
          DCF
        </Tab>
        <Tab selected={tab === 4} onClick={() => setTab(4)}>
          DDM
        </Tab>
        <Tab selected={tab === 5} onClick={() => setTab(5)}>
          MULTIPLES
        </Tab>
      </TabHead>
      <TabBody>
        {getModule()}
      </TabBody>
    </TabContainer>
  )
}
export default Tabs 
