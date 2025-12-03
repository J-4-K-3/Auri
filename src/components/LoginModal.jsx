import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LoginModal.css';

export const LoginModal = ({ isOpen, onClose, onLogin, onSubmitAnyway }) => {
  const [isLoginView, setIsLoginView] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginAttempt = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onLogin(username, password);
      setUsername('');
      setPassword('');
      setIsLoginView(false);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnyway = () => {
    setUsername('');
    setPassword('');
    setError('');
    setIsLoginView(false);
    onSubmitAnyway();
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setIsLoginView(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="login-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="login-modal-container">
            <motion.div
              className="login-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
            {!isLoginView ? (
              <>
                <div className="login-modal-header">
                  <h2>Submit Your Review</h2>
                </div>

                <div className="login-modal-content">
                  <p>
                    <strong>Are you logged in to Auri app already?</strong>
                  </p>
                  <p>
                    Log in and get a <span className="badge-preview">Verified in-app user</span> badge
                    when you submit to help build trust in our community. You can still submit without logging in — logging in is optional if you're not an Auri user yet.
                  </p>
                </div>

                <div className="login-modal-buttons">
                  <button
                    className="btn-cancel"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn-login"
                    onClick={() => setIsLoginView(true)}
                    disabled={isLoading}
                  >
                    Log In
                  </button>

                  <button
                    className="btn-submit-anyway"
                    onClick={handleSubmitAnyway}
                    disabled={isLoading}
                  >
                    Submit Anyway
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="login-modal-header">
                  <h2>Log In to Auri</h2>
                </div>

                <div className="login-modal-content">
                  <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    disabled={isLoading}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()}
                  />

                  {error && <p className="login-error">{error}</p>}

                  <p className="login-note">
                    Don't have an account? Download the Auri app to create one.
                  </p>
                </div>

                <div className="login-modal-buttons">
                  <button
                    className="btn-back"
                    onClick={() => {
                      setIsLoginView(false);
                      setError('');
                      setUsername('');
                      setPassword('');
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </button>

                  <button
                    className="btn-login-submit"
                    onClick={handleLoginAttempt}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </button>
                </div>
              </>
            )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
