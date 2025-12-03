import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  fetchReviews,
  submitReview,
  getCurrentUser,
  loginUser,
  logoutUser,
  restoreSession,
  saveSession,
  saveReviewsCache,
  getReviewsCache,
  getLastSyncTime,
  updateReview,
  deleteReview,
} from '../lib/Appwrite';
import LoginModal from './LoginModal';
import '../styles/Reviews.css';

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', rating: 5, message: '' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editFormData, setEditFormData] = useState({ rating: 5, message: '' });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

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

  // Load reviews on mount and restore session
  useEffect(() => {
    const init = async () => {
      setIsLoadingReviews(true);
      try {
        // Try to restore session from localStorage
        const restoredUser = await restoreSession();
        if (restoredUser) {
          setCurrentUser(restoredUser);
          setFormData((prev) => ({
            ...prev,
            username: restoredUser.name || restoredUser.email || '',
          }));
        }

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

  const handleAddReview = () => {
    // Show login modal instead of directly submitting
    setIsLoginModalOpen(true);
  };

  const handleLoginAttempt = async (username, password) => {
    try {
      const user = await loginUser(username, password);
      setCurrentUser(user);
      saveSession(user); // Explicitly save session
      setFormData((prev) => ({ ...prev, username: user.name || user.email || username }));
      setIsLoginModalOpen(false);

      // Auto-submit after login with the validated $id
      setTimeout(() => submitReviewToAppwrite(user.$id), 300);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmitAnyway = () => {
    setIsLoginModalOpen(false);
    // Submit as guest: pass null or empty string for userId
    submitReviewToAppwrite(null);
  };

  const submitReviewToAppwrite = async (userId = null) => {
    if (!formData.username.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in your name and review message');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    // Ensure userId is a valid Appwrite $id (already validated from user.$id)
    // or null/empty string for guest submissions
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
      setFormData({ username: currentUser?.name || currentUser?.email || '', rating: 5, message: '' });
      setIsFormOpen(false);
      setSubmitError('');
    } catch (error) {
      setSubmitError('Failed to submit review. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.$id);
    setEditFormData({ rating: review.rating, message: review.message });
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditFormData({ rating: 5, message: '' });
    setEditError('');
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editFormData.message.trim()) {
      setEditError('Review message cannot be empty');
      return;
    }

    setIsEditSubmitting(true);
    setEditError('');

    try {
      await updateReview(reviewId, {
        rating: editFormData.rating,
        message: editFormData.message,
      });

      // Refresh reviews
      if (isOnline) {
        const updatedReviews = await fetchReviews();
        saveReviewsCache(updatedReviews);
        setReviews(updatedReviews);
      } else {
        // Update local cache
        const updated = reviews.map((r) =>
          r.$id === reviewId
            ? { ...r, rating: editFormData.rating, message: editFormData.message }
            : r
        );
        setReviews(updated);
        saveReviewsCache(updated);
      }

      setEditingReviewId(null);
      setEditFormData({ rating: 5, message: '' });
    } catch (error) {
      setEditError('Failed to save changes. Please try again.');
      console.error('Edit error:', error);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId);

      // Remove from local state and cache
      const updated = reviews.filter((r) => r.$id !== reviewId);
      setReviews(updated);
      saveReviewsCache(updated);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete review. Please try again.');
    }
  }

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
                  onClick={handleAddReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ username: currentUser?.name || currentUser?.email || '', rating: 5, message: '' });
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
            onClick={() => setIsFormOpen(true)}
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
                    {review.verified && currentUser && review.userId === currentUser.$id && (
                      <div className="review-actions">
                        <button
                          className="review-action-btn edit-btn"
                          onClick={() => handleEditReview(review)}
                          title="Edit review"
                          aria-label="Edit review"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="review-action-btn delete-btn"
                          onClick={() => handleDeleteReview(review.$id)}
                          title="Delete review"
                          aria-label="Delete review"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Edit Review Modal */}
        <AnimatePresence>
          {editingReviewId && (
            <motion.div
              className="edit-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelEdit}
            >
              <motion.div
                className="edit-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Edit Your Review</h3>

                <div className="form-rating">
                  <label>Rating:</label>
                  <select
                    value={editFormData.rating}
                    onChange={(e) => setEditFormData({ ...editFormData, rating: parseInt(e.target.value) })}
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
                  placeholder="Update your review..."
                  value={editFormData.message}
                  onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                  className="form-textarea"
                />

                {editError && <p className="form-error">{editError}</p>}

                <div className="form-buttons">
                  <button
                    className="btn-submit"
                    onClick={() => handleSaveEdit(editingReviewId)}
                    disabled={isEditSubmitting}
                  >
                    {isEditSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={handleCancelEdit}
                    disabled={isEditSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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