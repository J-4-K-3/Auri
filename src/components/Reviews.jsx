import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// edit/delete removed; no icons needed
import {
  fetchReviews,
  submitReview,
  loginUser,
  saveReviewsCache,
  getReviewsCache,
} from '../lib/Appwrite';
import LoginModal from './LoginModal';
import '../styles/Reviews.css';

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', rating: 5, message: '' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load reviews on mount (no session restore)
  useEffect(() => {
    const init = async () => {
      setIsLoadingReviews(true);
      try {
        // Load reviews: offline-first, then sync with server if online
        let loadedReviews = [];

        if (isOnline) {
          try {
            // Fetch latest reviews from server
            loadedReviews = await fetchReviews();
            // Cache them for offline use
            saveReviewsCache(loadedReviews);
            setReviews(loadedReviews);
          } catch (error) {
            console.error('Error fetching reviews:', error);
            // Fall back to cached reviews
            loadedReviews = getReviewsCache();
            setReviews(loadedReviews);
          }
        } else {
          // Offline: load from cache
          loadedReviews = getReviewsCache();
          setReviews(loadedReviews);
        }
      } catch (error) {
        console.error('Error initializing reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    init();
  }, [isOnline]);

  // Simply open the form
  const handleAddReview = () => {
    console.log('Opening review form');
    setIsFormOpen(true);
  };

  // Submit button clicked - show login modal
  const handleSubmitClick = () => {
    console.log('Submit clicked, showing login modal');
    setIsLoginModalOpen(true);
  };

  // User logs in from modal
  const handleLoginAttempt = async (username, password) => {
    try {
      console.log('Login attempted');
      const user = await loginUser(username, password);
      console.log('Login successful, prefilling and submitting');
      // Close modal and prefill username
      setIsLoginModalOpen(false);
      setFormData((prev) => ({ ...prev, username: user.name || user.email || username }));
      // Auto-submit with logged-in user ID
      setTimeout(() => submitReviewToAppwrite(user.$id), 100);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Guest submits without logging in
  const handleSubmitAnyway = () => {
    console.log('Guest submit');
    setIsLoginModalOpen(false);
    // Submit as guest with no userId
    submitReviewToAppwrite(null);
  };

  const submitReviewToAppwrite = async (userId = null) => {
    if (!formData.username.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in your name and review message');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    // userId is passed in; otherwise empty string for guest
    const cleanUserId = userId || '';

    try {
      await submitReview({
        username: formData.username,
        rating: formData.rating,
        message: formData.message,
        userId: cleanUserId,
      });

      // Refresh reviews list and cache them
      if (isOnline) {
        const updatedReviews = await fetchReviews();
        saveReviewsCache(updatedReviews);
        setReviews(updatedReviews);
      } else {
        // Offline: add to local cache temporarily
        const tempReview = {
          $id: Date.now().toString(),
          username: formData.username,
          rating: formData.rating,
          message: formData.message,
          userId: cleanUserId,
          verified: !!cleanUserId,
          createdAt: new Date().toISOString(),
          appVersion: '1.0',
          reported: false,
          isLocal: true, // Mark as pending sync
        };
        const updated = [tempReview, ...reviews];
        setReviews(updated);
        saveReviewsCache(updated);
      }

      // Reset form
      setFormData({ username: '', rating: 5, message: '' });
      setIsFormOpen(false);
      setSubmitError('');
    } catch (error) {
      setSubmitError('Failed to submit review. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit/delete functionality removed for now per request

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  return (
    <motion.div
      className="reviews-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="reviews-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1>User Reviews</h1>

        <motion.div
          className="reviews-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="avg-rating">
            <h2>
              {reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : 5}
            </h2>
            <div className="avg-stars">
              {renderStars(
                reviews.length > 0
                  ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
                  : 5
              )}
            </div>
            <p>{reviews.length} reviews</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isFormOpen && (
            <motion.div
              className="review-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Share Your Review</h3>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="form-input"
              />

              <div className="form-rating">
                <label>Rating:</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="form-select"
                >
                  <option value="5">★★★★★ Excellent</option>
                  <option value="4">★★★★☆ Good</option>
                  <option value="3">★★★☆☆ Average</option>
                  <option value="2">★★☆☆☆ Fair</option>
                  <option value="1">★☆☆☆☆ Poor</option>
                </select>
              </div>

              <textarea
                placeholder="Share your thoughts about Auri..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              />

              {submitError && <p className="form-error">{submitError}</p>}

              <div className="form-buttons">
                <button
                  className="btn-submit"
                  onClick={handleSubmitClick}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ username: '', rating: 5, message: '' });
                    setSubmitError('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isFormOpen && (
          <motion.button
            className="btn-add-review"
            onClick={handleAddReview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            + Add Your Review
          </motion.button>
        )}

        <div className="reviews-list">
          <AnimatePresence>
            {isLoadingReviews ? (
              <div className="reviews-loading">
                {isOnline ? 'Loading reviews...' : 'Loading cached reviews...'}
              </div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty">No reviews yet. Be the first to review Auri!</div>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review.$id}
                  className={`review-card ${review.isLocal ? 'pending-sync' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="review-header">
                    <div className="review-info">
                      <h4>{review.username}</h4>
                      {review.verified && <span className="verified-badge">✓ Verified in-app user</span>}
                      {review.isLocal && (
                        <span className="pending-badge" title="Pending sync">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                  </div>
                  <p className="review-text">{review.message}</p>
                  <div className="review-meta-line">
                    <span className="review-meta">
                      {new Date(review.createdAt).toLocaleDateString()} • v{review.appVersion}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Edit functionality removed */}

        {!isOnline && <div className="offline-indicator">You are offline. Reviews are cached.</div>}

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginAttempt}
          onSubmitAnyway={handleSubmitAnyway}
        />
      </motion.div>
    </motion.div>
  );
}