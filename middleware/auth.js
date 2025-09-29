/**
 * Authentication middleware
 * This middleware checks if a user is authenticated
 */

const jwt = require('jsonwebtoken');
const { error, unauthorized } = require('../response');

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Authentication middleware
 */
const authMiddleware = (handler) => {
  return async (event) => {
    try {
      // Get token from Authorization header
      const authHeader = event.headers?.Authorization || event.headers?.authorization;
      
      if (!authHeader) {
        return unauthorized('Authorization header is required');
      }

      // Extract token from "Bearer <token>" format
      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        return unauthorized('Token is required');
      }

      // Verify token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return unauthorized('Invalid or expired token');
      }

      // Add user info to event
      event.user = decoded;
      
      // Call the original handler
      return await handler(event);
      
    } catch (err) {
      console.error('Auth middleware error:', err);
      return error('Authentication failed');
    }
  };
};

module.exports = { authMiddleware };
