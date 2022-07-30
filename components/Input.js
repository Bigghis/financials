import React, { useState } from 'react'; 
import styles from '../styles/Home.module.css';

function Input({ name, label, initialValue, onChange}) {

    const [value, setValue] = useState(initialValue || '');

    return (<div className={styles.inputContainer}>
                <label htmlFor={name}>{label}</label>
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
