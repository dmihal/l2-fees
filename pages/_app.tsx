import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import PlausibleProvider from 'next-plausible';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import Header from 'components/Header';
import Footer from 'components/Footer';

ReactGA.initialize('G-TG6XPV9ZGL');

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    ReactGA.set({ page: router.asPath });
    ReactGA.pageview(router.asPath);
  }, [router.pathname]);

  return (
    <div className="container">
      <PlausibleProvider domain="l2fees.info">
        <Header />

        <Component {...pageProps} />

        <Footer />
      </PlausibleProvider>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

        footer {
          width: 100%;
          height: auto;
          border-top: 1px solid lightGray;
          text-align: center;
          padding: 2rem 0;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'sofia-pro', sans-serif;
          background: #f9fafc;
          color: #091636;
        }

        * {
          box-sizing: border-box;
        }

        a {
          color: #091636;
          text-decoration: underline;
        }
        a:hover {
          color: #666666;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default App;
