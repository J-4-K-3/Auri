import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Download.css';
import DownloadModal from './DownloadModal';

export const Download = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/share_your_world.jpg', '/stories_memories.jpg', '/your_circle.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const imageVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  return (
    <motion.div
      className="download-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="download-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1>Experience Auri</h1>

        <motion.div className="image-carousel">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`Feature ${currentImageIndex + 1}`}
              className="carousel-image-main"
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          <div className="carousel-indicators">
            {images.map((_, index) => (
              <motion.button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                animate={{ scale: index === currentImageIndex ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.button
          className="download-btn-large"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
