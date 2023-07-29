import "@/styles/globals.css";

import Footer from "@/components/Footer";

import GlobalErrorContext from "@/components/GlobalError";
import GlobalErrorPopUp from "@/components/GlobalErrorPopUp";
export default function App({ Component, pageProps }) {
  return (
    <div>
      <>
        <GlobalErrorContext>
          <GlobalErrorPopUp />
          <Component {...pageProps} />
          <Footer />
        </GlobalErrorContext>
      </>
    </div>
  );
}
