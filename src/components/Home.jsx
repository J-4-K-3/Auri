import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Home.css';
import DownloadModal from './DownloadModal';
import IncentivesModal from './IncentivesModal';
import { useState } from 'react';

export const Home = () => {
   const [modalOpen, setModalOpen] = useState(false);
   const [incentivesModalOpen, setIncentivesModalOpen] = useState(false);
   const [entered, setEntered] = useState(() => {
     try {
       return localStorage.getItem('incentiveEntered') === 'true';
     } catch {
       return false;
     }
   });
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

        <motion.div className="incentives-section" variants={itemVariants}>
          <h3>🎉 Incentives Program</h3>
          <p className="incentives-rules">
            Win <strong>$3</strong>! Enter your referral reward code below and stay active for at least 8 hours after signing up. Real person verification required. Limited offer!
          </p>
          <p className="incentives-participate">
            To participate, download the app below.
          </p>
          <p className="incentives-winners">
            4 winners already claimed their prize! Only 6 spots left.
          </p>
          <p className="incentives-note">
            Note: Incentives can only be received via PayPal.
          </p> <br />
          {entered ? (
            <div className="entered-status">
              <div className="spinner"></div>
              <p>Winner will be chosen in 8 hours, check back here soon</p>
            </div>
          ) : (
            <button className="enter-program-btn" onClick={() => setIncentivesModalOpen(true)}>
              Enter Program
            </button>
          )}
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
            src="/home.jpeg"
            alt="home"
            className="carousel-image"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 3 }}
          />
        </motion.div>

        <motion.div className="description-section" variants={itemVariants}>
          <h2>Welcome to Auri</h2>
          <p className="tagline">A calm place to share your world.</p>
          <p className="description">
            Auri is a quiet social platform designed to help you connect with others in a peaceful way. Share your thoughts, photos and moments without the noise and clutter of traditional social media.
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
          downloadUrl="https://apkpure.com/p/com.jake285.Auri"
        />

        <IncentivesModal
          isOpen={incentivesModalOpen}
          onClose={() => setIncentivesModalOpen(false)}
          onSubmit={() => setEntered(true)}
        />
      </motion.div>
    </motion.div>
  );
};
