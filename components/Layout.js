import Head from 'next/head'
import HamburgerMenu, {Links} from '../components/HamburgerMenu';
import Image from 'next/image'
import{ SettingsContextProvider } from '../context/SettingsContext'

import styles from '../styles/Home.module.css'

export default function Layout({ children }) {
  return (
    <SettingsContextProvider>
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Stock Valuation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <HamburgerMenu />
        {children}  
      </main>
    </div>
    <footer className={styles.footer}>
        <div className={styles.footerRow}>
            {/*  {global.localStorage && (<button className={styles.formButton} type="button" 
            onClick={clearCache} >Clear cache</button>)} */}
            <div className={styles.infoClaudio}
            >
                <div className={styles.infoClaudioText}>Powered by a value investor{' '}</div>
                <div className={styles.logo}>
                <Image src="/a.jpg" alt="Don" width={38} height={60} />
                </div>
            </div>
        </div>
        <div className={styles.footerSubRow}>
            Data taken from <a target="_blank" rel="noreferrer" href="https://finance.yahoo.com/">Yahoo! Finance</a> and elaborated by Bigghis.
        </div>
    </footer>
    </SettingsContextProvider>
  )
}
