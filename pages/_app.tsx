import "../styles/global.scss";
import "../styles/booth/global.scss";

import type { AppProps } from "next/app";

import { StoreProvider } from "easy-peasy";
import store from "../constants/store";
import HandleAuthState from "../components/misc/HandleAuthState";

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <StoreProvider store={store}>
         <HandleAuthState />
         <Component {...pageProps} />
      </StoreProvider>
   );
}
export default MyApp;
