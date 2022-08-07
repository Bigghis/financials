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
        {data.length >0 && (<button title="Export to CSV"  className={styles.tableButton} type="button" onClick={exportData}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path fill="#fff" d="M192 312C192 298.8 202.8 288 216 288H384V160H256c-17.67 0-32-14.33-32-32L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48v-128H216C202.8 336 192 325.3 192 312zM256 0v128h128L256 0zM568.1 295l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 288H384v48h110.1l-39.03 39.03C450.3 379.7 448 385.8 448 392s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 319.6 578.3 304.4 568.1 295z"/></svg>
        </button>)}
        {(data.length > 0 && clearCallback) && (<button title="Clear results" className={styles.tableButton} type="button" onClick={clearCallback}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
            </button>)}
    </div>)
        
  }
  
  export default TableButtons
