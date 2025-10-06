/**
 * Delete Quiz
 * This function deletes a quiz
 */

const middy = require('@middy/core');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error, notFound } = require('../response');
const { validateToken } = require('../middleware/authentification');
const { db } = require('../database/database');

/**
 * Delete quiz
 */
const deleteQuiz = async (event) => {
  try {
    const quizId = event.pathParameters?.id;

    if (!quizId) {
      return error('Quiz ID is required');
    }

    // Get user from JWT token
    const userEmail = event.requestContext?.authorizer?.principalId;
    
    if (!userEmail) {
      return error('User authentication required');
    }

    // Check if user owns this quiz
    const { GetCommand } = require('@aws-sdk/lib-dynamodb');
    const getQuizCommand = new GetCommand({
      TableName: 'quizzes',
      Key: { quizId }
    });
    
    const quizResult = await db.send(getQuizCommand);
    
    if (!quizResult.Item) {
      return error('Quiz not found');
    }
    
    if (quizResult.Item.createdBy !== userEmail) {
      return error('You can only delete your own quizzes');
    }

    // Delete quiz from database
    const deleteQuizCommand = new DeleteCommand({
      TableName: 'quizzes',
      Key: { quizId }
    });

    await db.send(deleteQuizCommand);

    return success({ quizId }, 'Quiz deleted successfully');

  } catch (err) {
    console.error('Delete quiz error:', err);
    return error('Failed to delete quiz');
  }
};

const handler = middy(deleteQuiz)
  .use(validateToken);

module.exports = { handler };
