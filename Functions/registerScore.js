/**
 * Register Score
 * This function registers a score for a user on a quiz
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error } = require('../response');
const { validateToken } = require('../middleware/authentification');
const { db } = require('../database/database');

/**
 * Register score for a user on a quiz
 */
const registerScore = async (event) => {
  try {
    const scoreData = event.body;

    if (!scoreData.quizId || !scoreData.score) {
      return error('Quiz ID and score are required');
    }

    // Get user from JWT token
    const userEmail = event.requestContext?.authorizer?.principalId;
    
    if (!userEmail) {
      return error('User authentication required');
    }

    // Create score object
    const score = {
      scoreId: nanoid(),
      quizId: scoreData.quizId,
      userEmail: userEmail,
      userName: event.requestContext?.authorizer?.name || 'User',
      score: parseInt(scoreData.score),
      timestamp: new Date().toISOString()
    };

    // Save score to database
    const putScoreCommand = new PutCommand({
      TableName: 'scores',
      Item: score
    });

    await db.send(putScoreCommand);

    return success(score, 'Score registered successfully');

  } catch (err) {
    console.error('Register score error:', err);
    return error('Failed to register score');
  }
};

const handler = middy(registerScore)
  .use(httpJsonBodyParser())
  .use(validateToken);

module.exports = { handler };
