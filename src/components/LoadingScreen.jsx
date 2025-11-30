import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingScreen.css';

const WAVE_WIDTH = 240;

export const LoadingScreen = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onLoadingComplete();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="loading-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-gradient">
        <motion.div className="logo-container" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <h1 className="loading-logo">Auri</h1>
          <p className="loading-tagline">A calm place to share your world.</p>
        </motion.div>

        <motion.div
          className="wave"
          animate={{ x: [WAVE_WIDTH * -1, WAVE_WIDTH * 2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <div className="wave-fill"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};
