import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/DownloadModal.css';

export const DownloadModal = ({ isOpen, onClose, downloadUrl }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    // Open download in a new tab to trigger Google Drive download flow
    window.open(downloadUrl, '_blank', 'noopener');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="dm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dm-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <h2 id="dm-title">Download Auri APK</h2>
            <p className="dm-message">
              You'll be directed to APKPure, an online app store.
            </p>

            <div className="dm-quote">
              Simply click <strong>"Download APK"</strong> and your APK will download instantly. It's that easy.
            </div>

            <p className="dm-message">
              APKPure is a verified, trusted host for all app distribution.
            </p>

            <div className="dm-actions">
              <button className="dm-btn dm-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="dm-btn dm-confirm" onClick={handleDownload}>
                Understood
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;
