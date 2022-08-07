import React from 'react';
import { ExportToCsv } from 'export-to-csv';
import styles from '../styles/Home.module.css';

const csvOptions = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true
  };



function TableButtons({ dataType, data, clearCallback}) {

    const exportData = () => {
        const _dataType = dataType || 'generatedz';
        csvOptions.filename = _dataType.toLowerCase();
        csvOptions.title = _dataType;
        const csvExporter = new ExportToCsv(csvOptions);
        csvExporter.generateCsv(data);
    }

    return (<div className={styles.tableButtons}>
        {data.length >0 && (<button className={styles.tableButton} type="button" onClick={exportData}>
                export data
        </button>)}
        {(data.length > 0 && clearCallback) && (<button className={styles.tableButton} type="button" onClick={clearCallback}>
                    clear results
            </button>)}
    </div>)
        
  }
  
  export default TableButtons
