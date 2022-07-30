import React from 'react';
import styles from '../styles/Home.module.css';

function Select({min, max, name, label, percentage, defaultValue, onChange}) {

    const options = [];
    for (let i = min; i <= max; i++) {
        const elem = percentage ? `${i}%` : i;
        options.push(<option key={`${name}-${i}`} value={i}>{elem}</option>)
    }

    // title


    return (<div className={styles.inputContainer}>
                <label title={label} htmlFor={name}>{label}</label>
                <select 
                    id={name} 
                    name={name} 
                    defaultValue={defaultValue}
                    onChange={(e) => {
                        if(onChange) {
                            onChange(e.target.value);
                        }
                    }}
                    >
                    {options}
                </select>
            </div>);
        
  
  }
  
  export default Select
