import React, { useState } from 'react'; 
import styles from '../styles/Home.module.css';

function TableButtons({ data, clearCallback}) {

   // const [value, setValue] = useState(initialValue || '');

    return (<div className={styles.tableButtons}>
        {data.length >0 && (<button className={styles.tableButton} type="button" onClick={(e) => {
            console.log("export dat!") }}>
                export data
        </button>)}
        {(data.length > 0 && clearCallback) && (<button className={styles.tableButton} type="button" onClick={clearCallback}>
                    clear results
            </button>)}
    </div>)
        
  }
  
  export default TableButtons
