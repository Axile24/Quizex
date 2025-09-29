/**
 * Get All Quizzes
 * This function retrieves all quizzes
 */

const middy = require('@middy/core');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error } = require('../response');
const { db } = require('../database/database');

/**
 * Get all quizzes
 */
const getAllQuizzes = async (event) => {
  try {
    // Get all quizzes from database
    const scanQuizzesCommand = new ScanCommand({
      TableName: 'quizzes'
    });

    const result = await db.send(scanQuizzesCommand);

    return success(result.Items, 'Quizzes retrieved successfully');

  } catch (err) {
    console.error('Get all quizzes error:', err);
    return error('Failed to retrieve quizzes');
  }
};

const handler = middy(getAllQuizzes);
module.exports = { handler };
