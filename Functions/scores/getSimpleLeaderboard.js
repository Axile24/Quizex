/**
 * Get leaderboard for a quiz (Simple endpoint)
 * This function retrieves the top scores for a quiz
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
 * Get leaderboard for a specific quiz
 */
const getSimpleLeaderboard = async (event) => {
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

    // Get all scores for this quiz (using scan as temporary workaround)
    const scanScoresCommand = new ScanCommand({
      TableName: 'scores',
      FilterExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId
      }
    });

    const scoresResult = await docClient.send(scanScoresCommand);

    // Sort by score (highest first) and take top 10
    const leaderboard = scoresResult.Items
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return success({
      quizId,
      quizTitle: quizResult.Item.title,
      leaderboard,
      totalPlayers: scoresResult.Items.length
    }, 'Leaderboard retrieved successfully');

  } catch (err) {
    console.error('Get leaderboard error:', err);
    return error('Failed to retrieve leaderboard');
  }
};

const handler = middy(getSimpleLeaderboard);
module.exports = { handler };
