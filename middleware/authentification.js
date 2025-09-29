const jwt = require('jsonwebtoken');
const { sendError } = require('../response');

const validateToken = {
  before: async (request) => {
    try {
      const authHeader = request.event.headers.Authorization || request.event.headers.authorization;

      if (!authHeader) {
        request.response = sendError(401, 'You must be logged in to perform this action');
        return;
      }

      const token = authHeader.replace('Bearer ', '').trim();
      if (!token) {
        request.response = sendError(401, 'You must be logged in to perform this action');
        return;
      }

      // Verify the JWT token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      request.event.requestContext = {
        authorizer: {
          principalId: decoded.email,
          name: decoded.name
        }
      };
      
    } catch (error) {
      request.response = sendError(401, 'You must be logged in to perform this action');
      return;
    }
  }
};

/**
 * Generate a JWT token
 */
const generateToken = (payload, secret = process.env.JWT_SECRET || 'secret_password', expiresIn = '24h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = { 
  validateToken, 
  generateToken
};
