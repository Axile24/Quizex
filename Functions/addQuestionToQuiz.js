/**
 * Add Question to Quiz
 * This function adds a question to an existing quiz
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error } = require('../response');
const { validateToken } = require('../middleware/authentification');
const { db } = require('../database/database');

/**
 * Add question to quiz
 */
const addQuestionToQuiz = async (event) => {
  try {
    const quizId = event.pathParameters?.id;
    const questionData = event.body;

    if (!quizId) {
      return error('Quiz ID is required');
    }

    if (!questionData.question || !questionData.options || !questionData.correctAnswer) {
      return error('Question, options, and correct answer are required');
    }

    // Validate coordinates
    if (!questionData.latitude || !questionData.longitude) {
      return error('Latitude and longitude coordinates are required');
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
      return error('You can only add questions to your own quizzes');
    }

    // Create question object
    const question = {
      questionId: nanoid(),
      quizId: quizId,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      latitude: parseFloat(questionData.latitude),
      longitude: parseFloat(questionData.longitude),
      timestamp: new Date().toISOString()
    };

    // Save question to database
    const putQuestionCommand = new PutCommand({
      TableName: 'questions',
      Item: question
    });

    await db.send(putQuestionCommand);

    return success(question, 'Question added to quiz successfully');

  } catch (err) {
    console.error('Add question error:', err);
    return error('Failed to add question to quiz');
  }
};

const handler = middy(addQuestionToQuiz)
  .use(httpJsonBodyParser())
  .use(validateToken);

module.exports = { handler };
