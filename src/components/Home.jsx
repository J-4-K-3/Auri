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
        <div className="hero-layout">
          <motion.div className="hero-text" variants={itemVariants}>
            <h2>Welcome to Auri</h2>
            <p className="tagline">A calm place to share your world.</p>
            <p className="description">
              Auri is a quiet social platform designed to help you connect with others in a peaceful way. Share your thoughts, photos and moments without the noise and clutter of traditional social media.
            </p>
          </motion.div>

          <motion.div className="phone-mockups" variants={itemVariants}>
            <img src="/home-portrait.png" alt="Auri Home Screen 2" className="phone-mockup" />
            <img src="/profile-portrait.png" alt="Auri Profile Screen" className="phone-mockup" />
          </motion.div>
        </div>

        <motion.div className="emoji-showcase" variants={itemVariants}>
          <div className="emoji-grid">
            <img src="/face_holding_back_tears_3d.png" alt="Emoji 1" className="emoji-icon" />
            <img src="/hot_face_3d.png" alt="Emoji 2" className="emoji-icon" />
            <img src="/smiling_face_with_heart-eyes_3d.png" alt="Emoji 3" className="emoji-icon" />
            <img src="/smiling_face_with_sunglasses_3d.png" alt="Emoji 4" className="emoji-icon" />
            <img src="/upside-down_face_3d.png" alt="Emoji 5" className="emoji-icon" />
          </div>
          <p>Experience new emojis in-app</p>
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
          downloadUrl="https://apkpure.com/p/com.jake285.Auri"
        />
      </motion.div>
    </motion.div>
  );
};
