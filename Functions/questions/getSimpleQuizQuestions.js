/**
 * Get questions for a specific quiz (Simple endpoint)
 * This function retrieves all questions for a quiz
 */

const middy = require('@middy/core');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error, notFound } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Get questions for a specific quiz
 */
const getSimpleQuizQuestions = async (event) => {
  try {
    const quizId = event.pathParameters?.id;
    
    if (!quizId) {
      return error('Quiz ID is required');
    }

    // Check if quiz exists
    const getQuizCommand = new GetCommand({
      TableName: 'quizzes',
      Key: { quizId }
    });

    const quizResult = await docClient.send(getQuizCommand);
    
    if (!quizResult.Item) {
      return notFound('Quiz not found');
    }

    // Get all questions for this quiz (using scan as temporary workaround)
    const scanQuestionsCommand = new ScanCommand({
      TableName: 'questions',
      FilterExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId
      }
    });

    const questionsResult = await docClient.send(scanQuestionsCommand);

    return success({
      quizId,
      quizTitle: quizResult.Item.title,
      questions: questionsResult.Items,
      totalQuestions: questionsResult.Items.length
    }, 'Quiz questions retrieved successfully');

  } catch (err) {
    console.error('Get quiz questions error:', err);
    return error('Failed to retrieve quiz questions');
  }
};

const handler = middy(getSimpleQuizQuestions);
module.exports = { handler };
