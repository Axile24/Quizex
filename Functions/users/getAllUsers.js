/**
 * Get all users from the database
 * This function reads all users from DynamoDB
 */

const middy = require('@middy/core');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Get all users from the database
 */
const getAllUsers = async () => {
  try {
    // Scan the users table to get all users
    const scanCommand = new ScanCommand({
      TableName: 'users'
    });

    const result = await docClient.send(scanCommand);
    
    // Remove password from each user (for security)
    const users = result.Items.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return success(users, 'Users retrieved successfully');

  } catch (err) {
    console.error('Get users error:', err);
    return error('Failed to retrieve users');
  }
};

const handler = middy(getAllUsers);
module.exports = { handler };