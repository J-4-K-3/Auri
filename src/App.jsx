import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
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
        <meta name="description" content="Auri is a quiet, peaceful social platform designed for sharing your world without noise or clutter. Connect through moments, thoughts, and groups that truly matter. Download the app today." />
        <meta name="keywords" content="Auri, calm social app, peaceful social media, private community, group sharing, quiet platform, minimal social network, mindful social media, safe sharing platform, alternative to social media, stress-free networking, genuine connections, community app" />
        <meta name="author" content="Innoxation Tech Inc" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="Auri — A Calm Place to Share Your World" />
        <meta property="og:description" content="Auri is a peaceful social platform that prioritizes calm, connection, and genuine community. Share your life without noise, pressure, or clutter." />
        <meta property="og:image" content={`${SITE_URL}/auri_logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content="Auri — A Calm Place to Share Your World" />
        <meta name="twitter:description" content="Auri is a quiet social platform built for peaceful sharing, real connections, and meaningful groups. Join us today." />
        <meta name="twitter:image" content={`${SITE_URL}/auri_logo.png`} />
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
