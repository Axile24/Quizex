/**
 * User registration function
 * This allows new users to create accounts
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const { success, error } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Check if user input is valid
 */
const validateUserInput = (userData) => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    return { isValid: false, message: 'Name, email, and password are required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please provide a valid email address' };
  }

  return { isValid: true };
};

/**
 * Check if user already exists
 */
const checkUserExists = async (email) => {
  const getUserCommand = new GetCommand({
    TableName: 'users',
    Key: { email }
  });

  const result = await docClient.send(getUserCommand);
  return !!result.Item;
};

/**
 * Create a new user record
 */
const createUserRecord = async (userData) => {
  const { name, email, password } = userData;
  
  // Hash the password for security
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = nanoid();
  
  const user = {
    id: userId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  const putUserCommand = new PutCommand({
    TableName: 'users',
    Item: user
  });

  await docClient.send(putUserCommand);
  return user;
};

/**
 * Main signup function
 */
const signUp = async (event) => {
  try {
    const userData = event.body;

    // Validate input
    const validation = validateUserInput(userData);
    if (!validation.isValid) {
      return error(validation.message);
    }

    // Check if user already exists
    const userExists = await checkUserExists(userData.email);
    if (userExists) {
      return error('An account with this email already exists', 409);
    }

    // Create new user
    const newUser = await createUserRecord(userData);

    // Return user data without password
    const { password, ...userResponse } = newUser;
    return success(userResponse, 'Account created successfully');

  } catch (err) {
    console.error('Signup error:', err);
    return error('Failed to create account. Please try again.');
  }
};

// Export with middleware
const handler = middy(signUp).use(httpJsonBodyParser());
module.exports = { handler };