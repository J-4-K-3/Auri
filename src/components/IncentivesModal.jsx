import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { databases, APPWRITE_DATABASE_ID, COLLECTION_INCENTIVE_ID, IDs } from '../lib/Appwrite';
import '../styles/IncentivesModal.css';

const IncentivesModal = ({ isOpen, onClose, onSubmit }) => {
  const [referralCode, setReferralCode] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!referralCode || !paypalEmail) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');

    console.log('Submitting incentive:', { referralCode: referralCode.trim(), paypalEmail: paypalEmail.trim() });
    console.log('Database ID:', APPWRITE_DATABASE_ID);
    console.log('Collection ID:', COLLECTION_INCENTIVE_ID);

    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTION_INCENTIVE_ID,
        IDs.unique(),
        {
          referralCode: referralCode.trim(),
          paypalEmail: paypalEmail.trim(),
        }
      );
      console.log('Submission successful:', response);
      try {
        localStorage.setItem('incentiveEntered', 'true');
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
      }
      onSubmit({ referralCode, paypalEmail });
      onClose();
    } catch (err) {
      console.error('Error submitting incentive:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content incentives-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>Enter Referral Reward Program</h3>
        <p className="modal-instructions">
          Paste in your Referral Reward code found in the app settings.<br />
          To find reward code: go to Auri app → Profile → Settings → Scroll down to 'Support Auri' → Click Referral Rewards → You will find your code, click copy code → Come back to this website → Paste code in the input below.
        </p>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="referralCode">Referral Code</label>
          <input
            type="text"
            id="referralCode"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter your referral code"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="paypalEmail">PayPal Email</label>
          <input
            type="email"
            id="paypalEmail"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="Enter your PayPal email"
            disabled={loading}
          />
        </div>
        <button className="enter-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Enter Program'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default IncentivesModal;