/**
 * Create Quiz
 * This function creates a new quiz
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error } = require('../response');
const { validateToken } = require('../middleware/authentification');
const { db } = require('../database/database');

/**
 * Create quiz
 */
const createQuiz = async (event) => {
  try {
    const quizData = event.body;

    if (!quizData.title || !quizData.description) {
      return error('Title and description are required');
    }

    // Get user from JWT token
    const userEmail = event.requestContext?.authorizer?.principalId;
    
    if (!userEmail) {
      return error('User authentication required');
    }

    // Create quiz object
    const quiz = {
      quizId: nanoid(),
      title: quizData.title,
      description: quizData.description,
      createdBy: userEmail,
      createdAt: new Date().toISOString(),
      questionCount: 0
    };

    // Save quiz to database
    const putQuizCommand = new PutCommand({
      TableName: 'quizzes',
      Item: quiz
    });

    await db.send(putQuizCommand);

    return success(quiz, 'Quiz created successfully');

  } catch (err) {
    console.error('Create quiz error:', err);
    return error('Failed to create quiz');
  }
};

const handler = middy(createQuiz)
  .use(httpJsonBodyParser())
  .use(validateToken);

module.exports = { handler };
