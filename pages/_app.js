import '../styles/globals.css'
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

  return <Component {...pageProps} />
}

export default MyApp
