// Import global styles, components, and any other modules
import '../app/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// This is your custom App component
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header/>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

// Export your custom App component
export default MyApp;
