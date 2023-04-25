import React, { useContext } from 'react';
import { ExportToCsv } from 'export-to-csv';
import { DataContext } from '../context/DataContext';
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
    const dataContext = useContext(DataContext);
    const { commonData } = dataContext; 
    const exportData = () => {
        const _dataType = dataType ? `${commonData.price.symbol}_${dataType}` : 'generated';
        csvOptions.filename = _dataType.toLowerCase();
        csvOptions.title = _dataType;
        const csvExporter = new ExportToCsv(csvOptions);
        const _data = data.map(d => {
            const _d = {...d};
            Object.keys(_d).forEach(key => {
                if (typeof _d[key] === 'object' && _d[key] !== null) {
                    _d[key] = _d[key].industryValue || '';
                } 
            })
            return _d;
        });
        csvExporter.generateCsv(_data);
    }

    return (<div className={styles.tableButtons}>
        {data.length >0 && (<button title="Export to CSV"  className={styles.tableButton} type="button" onClick={exportData}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z"/></svg>
        </button>)}
        {(data.length > 0 && clearCallback) && (<button title="Clear results" className={styles.tableButton} type="button" onClick={clearCallback}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
            </button>)}
    </div>)
  }
  
  export default TableButtons
