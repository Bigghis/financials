import React, { useState } from 'react'; 
import InfoIcon from './InfoIcon';

import styles from '../styles/Home.module.css';

function Input({ name, label, tooltip, initialValue, onChange}) {

    const [value, setValue] = useState(initialValue || '');
    const infoIcon = tooltip ? <span data-tip={tooltip}><InfoIcon /></span> : null;

    return (<div className={styles.inputContainer}>
                <label htmlFor={name}><span>{label}</span>{infoIcon}</label>
                <input type="text" 
                    id={name} 
                    name={name} 
                    onChange={(e)=> {
                        setValue(e.target.value)
                        if (onChange) {
                            onChange(e.target.value)
                        }
                    }} 
                    value={value} 
                />
            </div>);
        
  
  }
  
  export default Input
