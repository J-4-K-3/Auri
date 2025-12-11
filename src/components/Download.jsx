import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Download.css';
import DownloadModal from './DownloadModal';

export const Download = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const media = [
    { type: 'image', src: '/share_your_world.jpg' },
    { type: 'video', src: '/vid_1.mp4' },
    { type: 'image', src: '/stories_memories.jpg' },
    { type: 'video', src: '/vid_2.mp4' },
    { type: 'image', src: '/meme_1.jpg' },
    { type: 'image', src: '/your_circle.jpg' },
    { type: 'video', src: '/vid_3.mp4' },
    { type: 'image', src: '/meme_2.jpg' },
  ];

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const mediaVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  const currentMedia = media[currentMediaIndex];

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
        <p className="join-us-text">Join Us</p>

        <motion.div className="image-carousel">
          <AnimatePresence mode="wait">
            {currentMedia.type === 'image' ? (
              <motion.img
                key={currentMediaIndex}
                src={currentMedia.src}
                alt={`Feature ${currentMediaIndex + 1}`}
                className="carousel-image-main"
                variants={mediaVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.video
                key={currentMediaIndex}
                src={currentMedia.src}
                className="carousel-video-main"
                variants={mediaVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </AnimatePresence>

          <div className="carousel-indicators">
            {media.map((_, index) => (
              <motion.button
                key={index}
                className={`indicator ${index === currentMediaIndex ? 'active' : ''}`}
                onClick={() => setCurrentMediaIndex(index)}
                animate={{ scale: index === currentMediaIndex ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <div className="carousel-controls">
            <button className="carousel-btn prev-btn" onClick={prevMedia}>
              ‹ Back
            </button>
            <button className="carousel-btn next-btn" onClick={nextMedia}>
              Next ›
            </button>
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
          downloadUrl="https://apkpure.com/p/com.jake285.Auri"
        />
      </motion.div>
    </motion.div>
  );
};
