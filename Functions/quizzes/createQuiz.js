/**
 * Create a new quiz
 * This function allows users to create new quizzes
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Validate quiz data
 */
const validateQuizData = (quizData) => {
  const { title, description, createdBy } = quizData;

  if (!title || !description || !createdBy) {
    return { isValid: false, message: 'Title, description, and createdBy are required' };
  }

  if (title.length < 3) {
    return { isValid: false, message: 'Title must be at least 3 characters long' };
  }

  if (description.length < 10) {
    return { isValid: false, message: 'Description must be at least 10 characters long' };
  }

  return { isValid: true };
};

/**
 * Create a new quiz
 */
const createQuiz = async (event) => {
  try {
    const quizData = event.body;

    // Validate input
    const validation = validateQuizData(quizData);
    if (!validation.isValid) {
      return error(validation.message);
    }

    // Create quiz object
    const quiz = {
      quizId: nanoid(),
      title: quizData.title.trim(),
      description: quizData.description.trim(),
      createdBy: quizData.createdBy,
      createdAt: new Date().toISOString(),
      questionCount: 0
    };

    // Save to database
    const putCommand = new PutCommand({
      TableName: 'quizzes',
      Item: quiz
    });

    await docClient.send(putCommand);

    return success(quiz, 'Quiz created successfully');

  } catch (err) {
    console.error('Create quiz error:', err);
    return error('Failed to create quiz');
  }
};

const handler = middy(createQuiz).use(httpJsonBodyParser());
module.exports = { handler };
