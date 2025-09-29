/**
 * Login User (Simple)
 * This function handles user login
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { success, error } = require('../response');
const { generateToken } = require('../middleware/authentification');

/**
 * Simple user login with JWT token generation
 */
const loginUser = async (event) => {
  try {
    const { email, name } = event.body;

    if (!email) {
      return error('Email is required');
    }

    // Create user payload for JWT
    const userPayload = {
      email: email,
      name: name || 'User',
      loginTime: new Date().toISOString()
    };

    // Generate JWT token
    const token = generateToken(userPayload);

    const user = {
      email: email,
      name: name || 'User',
      token: token,
      loginTime: new Date().toISOString()
    };

    return success(user, 'Login successful');

  } catch (err) {
    console.error('Login user error:', err);
    return error('Failed to login user');
  }
};

const handler = middy(loginUser).use(httpJsonBodyParser());
module.exports = { handler };
