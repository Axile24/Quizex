/**
 * Get Leaderboard
 * This function retrieves the leaderboard for a specific quiz
 */

const middy = require('@middy/core');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
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

    // Scan scores table and filter by quizId
    const scanScoresCommand = new ScanCommand({
      TableName: 'scores',
      FilterExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId
      }
    });

    const result = await db.send(scanScoresCommand);

    // Handle empty results
    const items = result.Items || [];

    // Sort by score (highest first) and limit to top 10
    const leaderboard = items
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
