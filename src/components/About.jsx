import React from 'react';
import { motion } from 'framer-motion';
import '../styles/About.css';

export const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      className="about-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="about-content" variants={itemVariants}>
        <motion.h1 variants={itemVariants}>About Auri</motion.h1>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>What is Auri?</h2>
          <p>
            Auri (pronounced "Ari") is a quiet social platform that prioritizes peace, connection, and genuine community. We've designed a space where you can share your world without the overwhelming noise and clutter of traditional social media.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Our Core Features</h2>
          <ul className="features-list">
            <li><strong>Feeds</strong> - Share and discover content at your own pace</li>
            <li><strong>Real-time Reels</strong> - Enjoy short, authentic videos</li>
            <li><strong>Shop</strong> - Support creators and discover unique products</li>
            <li><strong>Messages</strong> - Connect privately with friends</li>
            <li><strong>Profile</strong> - Express yourself authentically</li>
            <li><strong>Public Donations</strong> - Support causes you care about</li>
            <li><strong>Groups</strong> - Find your community and connect with like-minded people</li>
          </ul>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Our Mission</h2>
          <p>
            Auri focuses on groups, growth, and creating a place to ease social clutter and noise. We offer what others don't and invite you to add your unique touch to our platform. Together, we're building a social experience that respects your time and celebrates meaningful connections.
          </p>
        </motion.div>

        <motion.div className="about-tagline" variants={itemVariants}>
          <p><em>"A calm place to share your world."</em></p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
