import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Home.css';
import DownloadModal from './DownloadModal';
import { useState } from 'react';

export const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="home-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="home-content" variants={itemVariants}>
        <motion.div className="logo-section" variants={itemVariants}>
          <img src="/auri_logo.png" alt="Auri Logo" className="home-logo" />
        </motion.div>

        <motion.div className="screenshots-carousel" variants={itemVariants}>
          <motion.img
            src="/screenshot_1.jpeg"
            alt="Screenshot 1"
            className="carousel-image"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.img
            src="/screenshot_2.jpeg"
            alt="Screenshot 2"
            className="carousel-image"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
          />
          <motion.img
            src="/screenshot_3.jpeg"
            alt="Screenshot 3"
            className="carousel-image"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 3 }}
          />
        </motion.div>

        <motion.div className="description-section" variants={itemVariants}>
          <h2>Welcome to Auri</h2>
          <p className="tagline">A calm place to share your world.</p>
          <p className="description">
            Auri is a quiet social platform designed to help you connect with others in a peaceful way. Share your thoughts, photos, and moments without the noise and clutter of traditional social media.
          </p>
        </motion.div>

        <motion.button
          className="download-btn"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
        >
          Download APK
        </motion.button>

        <DownloadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          downloadUrl="https://drive.google.com/uc?export=download&id=1vMruOnZ3v6S1qTvyZH2TdcOSDpeLYw_G"
        />
      </motion.div>
    </motion.div>
  );
};
