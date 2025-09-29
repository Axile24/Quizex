/**
 * Create User
 * This function creates a new user
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error } = require('../response');
const { db } = require('../database/database');

/**
 * Create user
 */
const createUser = async (event) => {
  try {
    const userData = event.body;

    if (!userData.email || !userData.name) {
      return error('Email and name are required');
    }

    // Create user object
    const user = {
      userId: nanoid(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString()
    };

    // Save user to database
    const putUserCommand = new PutCommand({
      TableName: 'users',
      Item: user
    });

    await db.send(putUserCommand);

    return success(user, 'User created successfully');

  } catch (err) {
    console.error('Create user error:', err);
    return error('Failed to create user');
  }
};

const handler = middy(createUser).use(httpJsonBodyParser());
module.exports = { handler };
