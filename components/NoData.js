import React from 'react'; 
import styles from '../styles/Home.module.css';

function NoData({ text, title }) {

    return (<div className={styles.noData}>
                <h4 className={styles.subtitle}>
                    {title}
                </h4>
                no data
            </div>);
        
  
  }
  
  export default NoData
