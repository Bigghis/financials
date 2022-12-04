import React from 'react';
import styles from '../styles/Home.module.css';
import InfoIcon from './InfoIcon';

function Select({min, max, name, label, tooltip, percentage, subtitle, defaultValue, onChange, items}) {
    const infoIcon = tooltip ? <span data-tip={tooltip}><InfoIcon /></span> : null;
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

    let _clsName = subtitle ? styles.inputContainerWithSubtitle : styles.inputContainer;

    return (<div className={_clsName}>
                <label htmlFor={name}><span>{label}</span>{infoIcon}</label>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
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
