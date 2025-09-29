/** TODO: 
 * 1- Avoir une connexion avec DB
 * 2- Créer une fonction pour trouver un utilisateur par email
 * 3- Créer une fonction pour vérifier le mot de passe
 * 4- Créer une fonction pour créer un token
 * 5- Créer une fonction pour maintenir le login
 * 6- Créer une fonction pour supprimer un utilisateur
 * 7- Créer une fonction pour mettre à jour un utilisateur
 * 8- Créer une fonction pour obtenir tous les utilisateurs
 * User login function
 * This allows existing users to log in and get a token
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error, unauthorized } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Find user by email
 */
const findUser = async (email) => {
  const getUserCommand = new GetCommand({
    TableName: 'users',
    Key: { email: email.toLowerCase() }
  });

  const result = await docClient.send(getUserCommand);
  return result.Item;
};

/**
 * Check if password is correct
 */
const checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Create JWT token
 */
const createToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Main login function
 */
const login = async (event) => {
  try {
    const { email, password } = event.body;

    if (!email || !password) {
      return error('Email and password are required');
    }

    // Find user in database
    const user = await findUser(email);
    if (!user) {
      return unauthorized('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return unauthorized('Invalid email or password');
    }

    // Create token
    const token = createToken(user);

    return success({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, 'Login successful');

  } catch (err) {
    console.error('Login error:', err);
    return error('Login failed. Please try again.');
  }
};

// Export with middleware
const handler = middy(login).use(httpJsonBodyParser());
module.exports = { handler };