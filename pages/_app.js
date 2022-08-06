import '../styles/globals.css'
import '../styles/burger.css'
import { LocalStorage } from "node-localstorage";

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

   return getLayout(<Component {...pageProps} />)
}

export default MyApp
