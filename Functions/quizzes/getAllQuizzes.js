/**
 * Get all quizzes
 * This function retrieves all quizzes from the database
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
 * Get all quizzes from the database
 */
const getAllQuizzes = async () => {
  try {
    // Scan the quizzes table to get all quizzes
    const scanCommand = new ScanCommand({
      TableName: 'quizzes'
    });

    const result = await docClient.send(scanCommand);
    
    // Sort by creation date (newest first)
    const quizzes = result.Items.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return success(quizzes, 'Quizzes retrieved successfully');

  } catch (err) {
    console.error('Get quizzes error:', err);
    return error('Failed to retrieve quizzes');
  }
};

const handler = middy(getAllQuizzes);
module.exports = { handler };
