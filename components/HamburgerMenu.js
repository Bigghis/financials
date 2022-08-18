import React, { useContext, useState } from "react"
import Link from 'next/link'
import styles from '../styles/Menu.module.css'
import Settings from "./Settings"
import { SettingsContext } from '../context/SettingsContext';

const HamburgerIcon = ({ onClick }) => (<div onClick={onClick} className={styles.menuIcon}><svg className="w-8 h-8 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"></path></svg></div>)

export const Links = ({ setUnit, unit }) => {


    return (<>
                {/* <Link href="/"><a className='font-bold p-4'>Home</a></Link> */}
                <Settings
                    setUnit={setUnit}
                    unit={unit} 
                />
                <Link href="/about"><a className='font-bold p-4'>About</a></Link>
            </>)
    } 

const HamburgerMenu = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    const settingsContext = useContext(SettingsContext);
    const { unit, setUnit } = settingsContext;

    const handleToggle = () => {
        setNavbarOpen(!navbarOpen)
    }

    const _clsName = navbarOpen ? `${styles.menuList} ${styles.open}` : `${styles.menuList} ${styles.closed}`;
    return (<div className={styles.menuBar} >
        <div>
            <div className={`${styles.bold} ${styles.appTitle}`}>Stock Valuation</div>
            <div className={_clsName}>
                <Links unit={unit} setUnit={setUnit} />
            </div>
        </div>
        <HamburgerIcon onClick={handleToggle}/>
</div>)}

export default HamburgerMenu
