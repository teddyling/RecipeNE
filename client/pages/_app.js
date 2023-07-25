import "@/styles/globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CurrentUserContext from "@/components/CurrentUserContext";
export default function App({ Component, pageProps }) {
  return (
    <div>
      <CurrentUserContext>
        <Component {...pageProps} />
        <Footer />
      </CurrentUserContext>
    </div>
  );
}
