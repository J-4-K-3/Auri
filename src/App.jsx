import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from "react-helmet"
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './components/Home';
import { About } from './components/About';
import { Download } from './components/Download';
import { Reviews } from './components/Reviews';
import { Terms } from './components/Terms';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import './styles/globals.css';
import './App.css';

const SITE_URL = 'https://auri-green.vercel.app';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Auri — A Calm Place to Share Your World</title>

        {/* Primary Meta Tags */}
        <meta 
          name="description" 
          content="Auri is a quiet, peaceful social platform designed for sharing your world without noise or clutter. Connect through moments, thoughts, and groups that truly matter. Download the app today." 
        />
        <meta 
          name="keywords" 
          content="Auri, calm social app, peaceful social media, private community, group sharing, quiet platform, minimal social network, mindful social media, safe sharing platform, alternative to social media, stress-free networking, genuine connections, community app" 
        />
        <meta name="author" content="Innoxation Tech Inc" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="Auri — A Calm Place to Share Your World" />
        <meta 
          property="og:description" 
          content="Auri is a peaceful social platform that prioritizes calm, connection, and genuine community. Share your life without noise, pressure, or clutter." 
        />
        <meta property="og:image" content={`${SITE_URL}/auri_logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content="Auri — A Calm Place to Share Your World" />
        <meta 
          name="twitter:description" 
          content="Auri is a quiet social platform built for peaceful sharing, real connections, and meaningful groups. Join us today." 
        />
        <meta name="twitter:image" content="/auri_logo.png" />
        <meta name="twitter:creator" content="@innoxation" />

        <meta name="google-site-verification" content="G6iAc6DFyQpkta3Vey1eBKz9k4ijW2raeX5TLMklvGY" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Auri",
            "description": "A calm, peaceful social platform for sharing your world without noise or clutter.",
            "applicationCategory": "SocialNetworkingApplication",
            "operatingSystem": "Android, iOS",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "image": `${SITE_URL}/auri_logo.png`,
            "url": SITE_URL,
            "author": {
              "@type": "Organization",
              "name": "Innoxation Tech Inc",
              "url": "https://innoxation.tech",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "innoxation.tech@gmail.com",
                "contactType": "Customer Service"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "250",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>

        {/* Canonical URL */}
        <link rel="canonical" href={SITE_URL} />

        {/* Favicon & App Icons */}
        <link rel="icon" href="/auri_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/auri_logo.png" />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fra.cloud.appwrite.io" />
      </Helmet>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
        ) : (
          <Router>
            <div className="app-layout">
              <Navigation />
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/download" element={<Download />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/terms" element={<Terms />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
