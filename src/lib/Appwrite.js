// appwrite.js
import { Client, Account, Databases, Storage, ID, Permission, Role, Query } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const IDs = ID;

export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

// APPWRITE_DATABASE_ID Tables IDs
export const COLLECTION_USERS_ID = import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID;
export const COLLECTION_REVIEWS_ID = import.meta.env.VITE_APPWRITE_COLLECTION_REVIEWS_ID;

// ============================================
// SANITIZATION HELPERS (ported from mobile)
// ============================================

const sanitizeString = (value, maxLength, fallback = '') => {
  if (typeof value !== 'string') {
    const cleanedFallback = typeof fallback === 'string' ? fallback.trim() : '';
    return maxLength ? cleanedFallback.slice(0, maxLength) : cleanedFallback;
  }

  const trimmed = value.trim();
  if (!trimmed && fallback) {
    return sanitizeString(fallback, maxLength);
  }

  return maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

const formatAppwriteError = (error, fallbackMessage) => {
  const message = error?.response?.message || error?.message || fallbackMessage;
  return message || 'Something went wrong. Please try again.';
};

// ============================================
// SESSION STORAGE (localStorage)
// ============================================

const SESSION_KEY = 'auri_session';
const REVIEWS_CACHE_KEY = 'auri_reviews_cache';
const LAST_SYNC_KEY = 'auri_last_sync';

/**
 * Save session to localStorage
 */
export const saveSession = (user) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      user,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

/**
 * Get saved session from localStorage
 */
export const getStoredSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

/**
 * Clear stored session
 */
export const clearStoredSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * Save reviews cache to localStorage
 */
export const saveReviewsCache = (reviews) => {
  try {
    localStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(reviews));
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving reviews cache:', error);
  }
};

/**
 * Get cached reviews from localStorage
 */
export const getReviewsCache = () => {
  try {
    const cached = localStorage.getItem(REVIEWS_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error retrieving reviews cache:', error);
    return [];
  }
};

/**
 * Get last sync timestamp
 */
export const getLastSyncTime = () => {
  try {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    return lastSync ? parseInt(lastSync) : 0;
  } catch (error) {
    console.error('Error retrieving last sync time:', error);
    return 0;
  }
};

// ============================================
// REVIEWS API
// ============================================

/**
 * Fetch all reviews from the reviews collection
 * Sorted by createdAt (newest first)
 */
export const fetchReviews = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      [Query.orderDesc('createdAt')]
    );
       console.log('Fetched reviews:', response.documents?.map(r => ({
         id: r.$id,
         userId: r.userId,
         verified: r.verified,
         username: r.username,
       })));
    return response.documents || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

/**
 * Submit a new review to Appwrite
 * @param {Object} reviewData - { username, rating, message, userId, appVersion }
 * userId should be a clean Appwrite $id (36 chars max, alphanumeric + . - _)
 */
export const submitReview = async (reviewData) => {
  try {
    // userId must be the Appwrite $id, which is already validated (36 chars max, alphanumeric + . - _)
    // If userId is not provided, pass empty string (guest submission)
    const userId = reviewData.userId || '';

    const payload = {
      username: sanitizeString(reviewData.username, 255, 'Guest'),
      rating: parseInt(reviewData.rating) || 5,
      message: sanitizeString(reviewData.message, 500),
      userId: userId, // Already validated upstream
      appVersion: reviewData.appVersion || '1.0',
      verified: !!userId, // true only if userId is non-empty
      reported: false,
      createdAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      ID.unique(),
      payload
    );
    return response;
  } catch (error) {
    console.error('Error submitting review:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    throw new Error(error.message || 'Failed to submit review. Check Appwrite permissions.');
  }
};

/**
 * Update an existing review
 * @param {string} reviewId - The review document ID
 * @param {Object} updateData - { rating, message } fields to update
 */
export const updateReview = async (reviewId, updateData, currentUser) => {
  try {
    // Guests cannot edit reviews
    if (!currentUser || !currentUser.$id) {
      throw new Error('You must be logged in to edit reviews.');
    }

    // First, fetch the review to verify ownership
    const review = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId
    );

    // Check ownership: only the review owner can edit
    if (review.userId !== currentUser.$id) {
      throw new Error('You can only edit your own reviews.');
    }

    const payload = {
      rating: parseInt(updateData.rating),
      message: updateData.message,
    };

    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId,
      payload
    );
    return response;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error(error.message || 'Failed to update review.');
  }
};

/**
 * Delete a review
 * @param {string} reviewId - The review document ID
 * @param {object} currentUser - The current logged-in user
 */
export const deleteReview = async (reviewId, currentUser) => {
  try {
    // Guests cannot delete reviews
    if (!currentUser || !currentUser.$id) {
      throw new Error('You must be logged in to delete reviews.');
    }

    // First, fetch the review to verify ownership
    const review = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId
    );

    // Check ownership: only the review owner can delete
    if (review.userId !== currentUser.$id) {
      throw new Error('You can only delete your own reviews.');
    }

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      COLLECTION_REVIEWS_ID,
      reviewId
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error(error.message || 'Failed to delete review.');
  }
};

// ============================================
// AUTH API (mirroring mobile auth service)
// ============================================

/**
 * Get current logged-in user
 */
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

/**
 * Sign up with email and password
 */
export const signupWithEmail = async (email, password, name = 'Auri User') => {
  const normalizedEmail = sanitizeString(email, 320);
  const normalizedName = sanitizeString(name, 255, 'Auri User');
  try {
    return await account.create(IDs.unique(), normalizedEmail, password, normalizedName);
  } catch (error) {
    throw new Error(formatAppwriteError(error, 'Unable to create account.'));
  }
};

/**
 * Safe login: Check if already logged in with matching email, else create session
 * Mirrors mobile safeLogin behavior
 */
export const safeLogin = async (email, password) => {
  const normalizedEmail = sanitizeString(email, 320);
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    // Check if already logged in
    const currentUser = await account.get();
    if (currentUser && currentUser.email?.toLowerCase() === normalizedEmail.toLowerCase()) {
      return currentUser; // Already logged in with this email
    }
    // Clear existing sessions
    try {
      await account.deleteSession('current');
    } catch {
      // Ignore errors clearing sessions
    }
  } catch (error) {
    // No active session; proceed to login
  }

  // Try primary SDK method for creating email-password session
  try {
    if (typeof account.createEmailPasswordSession === 'function') {
      await account.createEmailPasswordSession(normalizedEmail, password);
    } else if (typeof account.createSession === 'function') {
      await account.createSession(normalizedEmail, password);
    } else {
      // Fallback to REST API
      const resp = await fetch(`${appwriteConfig.endpoint.replace(/\/v1\/?$/, '')}/v1/account/sessions/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': appwriteConfig.projectId,
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Login failed with status ${resp.status}`);
      }
    }
  } catch (sessionError) {
    throw new Error(formatAppwriteError(sessionError, 'Unable to sign in with those credentials.'));
  }

  try {
    const user = await account.get();
    saveSession(user);
    return user;
  } catch (getError) {
    throw new Error(formatAppwriteError(getError, 'Signed in but unable to load your account.'));
  }
};

/**
 * Login with email and password (alias for safeLogin)
 */
export const loginUser = async (email, password) => {
  return await safeLogin(email, password);
};

/**
 * Logout: delete all sessions
 */
export const logoutCurrent = async () => {
  try {
    await account.deleteSessions();
  } catch (error) {
    console.error('Logout error:', error);
  }
  clearStoredSession();
};

/**
 * Logout current user (alias)
 */
export const logoutUser = async () => {
  return await logoutCurrent();
};

/**
 * Restore session from localStorage if available
 */
export const restoreSession = async () => {
  try {
    const stored = getStoredSession();
    if (stored && stored.user) {
      // Check if the stored session is still valid
      try {
        const user = await account.get();
        return user;
      } catch {
        // Session expired, but we have offline data
        return stored.user;
      }
    }
    return null;
  } catch (error) {
    console.error('Error restoring session:', error);
    return null;
  }
};

export default client;

export { Permission, Role, Query };