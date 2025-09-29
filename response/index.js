/**
 * Response utility functions for consistent API responses
 * Provides standardized response formats for success, error, and other HTTP status codes
 */

/**
 * Creates a standardized HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body data
 * @returns {object} Formatted response object
 */
const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

/**
 * Creates a successful response (200 OK)
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @returns {object} Success response
 */
const success = (data, message = 'Operation completed successfully') => {
  return createResponse(200, { 
    success: true, 
    message, 
    data 
  });
};

/**
 * Creates an error response (400 Bad Request by default)
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {object} Error response
 */
const error = (message, statusCode = 400) => {
  return createResponse(statusCode, { 
    success: false, 
    message 
  });
};

/**
 * Creates an unauthorized response (401 Unauthorized)
 * @param {string} message - Unauthorized message
 * @returns {object} Unauthorized response
 */
const unauthorized = (message = 'Authentication required') => {
  return createResponse(401, { 
    success: false, 
    message 
  });
};

/**
 * Creates a not found response (404 Not Found)
 * @param {string} message - Not found message
 * @returns {object} Not found response
 */
const notFound = (message = 'Resource not found') => {
  return createResponse(404, { 
    success: false, 
    message 
  });
};

module.exports = {
  success,
  error,
  unauthorized,
  notFound
};