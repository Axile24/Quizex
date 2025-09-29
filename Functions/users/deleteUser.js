/**
 * Delete a user from the database
 * This function removes a user by their email
 */

const middy = require('@middy/core');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error, notFound } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Delete a user by email
 */
const deleteUser = async (event) => {
  try {
    // Get the email from the URL
    const email = event.pathParameters?.email;
    
    if (!email) {
      return error('Email is required');
    }

    // First check if the user exists
    const getUserCommand = new GetCommand({
      TableName: 'users',
      Key: { email }
    });

    const userResult = await docClient.send(getUserCommand);
    
    if (!userResult.Item) {
      return notFound('User not found');
    }

    // Delete the user
    const deleteCommand = new DeleteCommand({
      TableName: 'users',
      Key: { email }
    });

    await docClient.send(deleteCommand);

    return success({ email }, 'User deleted successfully');

  } catch (err) {
    console.error('Delete user error:', err);
    return error('Failed to delete user');
  }
};

const handler = middy(deleteUser);
module.exports = { handler };