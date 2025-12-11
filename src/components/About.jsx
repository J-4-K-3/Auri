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
            Auri (pronounced "Ari") is your escape from the chaos of modern social media. Imagine a peaceful digital sanctuary where meaningful connections flourish without the endless scroll, toxic arguments, or algorithmic pressure to perform. Here, you share authentically, connect deeply, and rediscover the joy of genuine human interaction.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Why People Choose Auri</h2>
          <ul className="features-list">
            <li><strong>Peaceful Feeds</strong> - Share and discover content at your own pace no comparison</li>
            <li><strong>Authentic Reels</strong> - Enjoy short, genuine videos from everyone, everywhere</li>
            <li><strong>Auri Shop</strong> - Support independent creators and find unique products you need or want</li>
            <li><strong>Private Messages</strong> - Connect deeply with friends without public performance</li>
            <li><strong>True Profiles</strong> - Express your real self without filters or other personas</li>
            <li><strong>Meaningful Donations</strong> - Support causes that matter to you and your community</li>
            <li><strong>Like-Minded Groups</strong> - Find your tribe and build lasting relationships</li>
          </ul>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Our Mission</h2>
          <p>
            We're not just another social app – we're rebuilding social media from the ground up. Auri eliminates the clutter that drains your energy and replaces it with spaces for growth, creativity, and real human connection. Join thousands who've already discovered that social media can be calm, meaningful, and truly social again.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Growth & Features</h2>
          <p>
            Some screens and features are currently labeled "Coming Soon" as we work towards unlocking them. Help us reach our community goals to bring these exciting additions to Auri faster!
          </p>
        </motion.div>

        <motion.div className="about-tagline" variants={itemVariants}>
          <p><em>"A calm place to share your world."</em></p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
