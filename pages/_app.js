import '../styles/globals.css'
import { LocalStorage } from "node-localstorage";
import {DataContextProvider} from '../context/DataContext'

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
                              <Component {...pageProps} />
                      </DataContextProvider>)
}

export default MyApp
