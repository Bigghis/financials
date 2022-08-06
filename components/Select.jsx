import React from 'react';
import styles from '../styles/Home.module.css';

function Select({min, max, name, label, tooltip, percentage, defaultValue, onChange, items}) {

    const options = [];
    if (items) {
        for (let i = 0; i < items.length; i++) {
            const elem = items[i];
            options.push(<option key={`${elem.name}-${i}`} value={elem.value}>{elem.name}</option>)
        }
    } else {
        for (let i = min; i <= max; i++) {
            const elem = percentage ? `${i}%` : i;
            options.push(<option key={`${name}-${i}`} value={i}>{elem}</option>)
        }
    }

    // title


    return (<div className={styles.inputContainer}>
                <label title={tooltip || label} htmlFor={name}>{label}</label>
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
