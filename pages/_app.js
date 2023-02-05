import '../styles/globals.css'
import { LocalStorage } from "node-localstorage";
import { DataContextProvider } from '../context/DataContext'
import { IndustriesContextProvider } from '../context/IndustriesContext';

function MyApp({ Component, pageProps }) {

  // empty cache 
  if (global.localStorage) {
    global.localStorage.clear();
  }

  // initiate cache
  if (!global.localStorage) {
    global.localStorage = new LocalStorage('./scratch');
    console.log("initiate cache..")
  }

  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<DataContextProvider>
    <IndustriesContextProvider>
      <Component {...pageProps} />
    </IndustriesContextProvider>
  </DataContextProvider>)
}

export default MyApp
