/**
 * Get Quiz Questions
 * This function retrieves all questions for a specific quiz
 */

const middy = require('@middy/core');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error } = require('../response');
const { db } = require('../database/database');

/**
 * Get quiz questions
 */
const getQuizQuestions = async (event) => {
  try {
    const quizId = event.pathParameters?.id;

    if (!quizId) {
      return error('Quiz ID is required');
    }

    // Get all questions for this quiz
    const scanQuestionsCommand = new ScanCommand({
      TableName: 'questions',
      FilterExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId
      }
    });

    const result = await db.send(scanQuestionsCommand);

    return success(result.Items, 'Quiz questions retrieved successfully');

  } catch (err) {
    console.error('Get quiz questions error:', err);
    return error('Failed to retrieve quiz questions');
  }
};

const handler = middy(getQuizQuestions);
module.exports = { handler };
