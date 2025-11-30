import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Reviews.css';

export const Reviews = () => {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Sarah M.', rating: 5, comment: 'Auri is exactly what I needed. A calm, peaceful way to share moments without the stress of other platforms.' },
    { id: 2, name: 'James K.', rating: 5, comment: 'Love the focus on community and groups. This app brings people together in a meaningful way.' },
    { id: 3, name: 'Emma L.', rating: 4, comment: 'Great app! The interface is clean and the real-time reels feature is amazing.' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });

  const handleAddReview = () => {
    if (formData.name.trim() && formData.comment.trim()) {
      const newReview = {
        id: Date.now(),
        name: formData.name,
        rating: formData.rating,
        comment: formData.comment,
      };
      setReviews([newReview, ...reviews]);
      setFormData({ name: '', rating: 5, comment: '' });
      setIsFormOpen(false);
    }
  };

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
            <div className="avg-stars">{renderStars(Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length))}</div>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="form-textarea"
              />

              <div className="form-buttons">
                <button
                  className="btn-submit"
                  onClick={handleAddReview}
                >
                  Submit Review
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ name: '', rating: 5, comment: '' });
                  }}
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
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="review-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="review-header">
                  <h4>{review.name}</h4>
                  <div className="review-stars">{renderStars(review.rating)}</div>
                </div>
                <p className="review-text">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
