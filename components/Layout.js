import Head from 'next/head'
import HamburgerMenu, {Links} from '../components/HamburgerMenu';
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Layout({ children }) {
  return (
    <>
    <div className={styles.container}>
      <Head>
        <title>Stock Valuation</title>
        <meta name="description" content="Stock Valuation next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

      <div className={styles.menuBar}>
            <div className={styles.menuLinks}>
                <Links />
            </div>
        </div>
      <div className={styles.hamburgerMenu}><HamburgerMenu /></div>
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
    </>
  )
}
