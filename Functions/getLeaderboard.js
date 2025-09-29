/**
 * Get Leaderboard
 * This function retrieves the leaderboard for a specific quiz
 */

const middy = require('@middy/core');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error } = require('../response');
const { db } = require('../database/database');

/**
 * Get leaderboard for a quiz
 */
const getLeaderboard = async (event) => {
  try {
    const quizId = event.pathParameters?.id;

    if (!quizId) {
      return error('Quiz ID is required');
    }

    // Get all scores for this quiz, sorted by score (highest first)
    const queryScoresCommand = new QueryCommand({
      TableName: 'scores',
      IndexName: 'quizId-index',
      KeyConditionExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId
      },
      ScanIndexForward: false // Sort by score descending
    });

    const result = await db.send(queryScoresCommand);

    // Sort by score (highest first) and limit to top 10
    const leaderboard = result.Items
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item, index) => ({
        rank: index + 1,
        userName: item.userName,
        userEmail: item.userEmail,
        score: item.score,
        timestamp: item.timestamp
      }));

    return success(leaderboard, 'Leaderboard retrieved successfully');

  } catch (err) {
    console.error('Get leaderboard error:', err);
    return error('Failed to retrieve leaderboard');
  }
};

const handler = middy(getLeaderboard);
module.exports = { handler };
