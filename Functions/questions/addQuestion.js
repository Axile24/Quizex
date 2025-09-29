/**
 * Add a question to a quiz
 * This function allows adding questions to existing quizzes
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error, notFound } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Validate question data
 */
const validateQuestionData = (questionData) => {
  const { question, answer, options, coordinates } = questionData;

  if (!question || !answer || !options || !Array.isArray(options)) {
    return { isValid: false, message: 'Question, answer, and options are required' };
  }

  if (question.length < 10) {
    return { isValid: false, message: 'Question must be at least 10 characters long' };
  }

  if (options.length < 2) {
    return { isValid: false, message: 'At least 2 options are required' };
  }

  if (!options.includes(answer)) {
    return { isValid: false, message: 'Answer must be one of the options' };
  }

  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    return { isValid: false, message: 'Coordinates (latitude and longitude) are required' };
  }

  return { isValid: true };
};

/**
 * Add a question to a quiz
 */
const addQuestion = async (event) => {
  try {
    const quizId = event.pathParameters?.id;
    const questionData = event.body;

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

    // Validate question data
    const validation = validateQuestionData(questionData);
    if (!validation.isValid) {
      return error(validation.message);
    }

    // Create question object
    const question = {
      questionId: nanoid(),
      quizId: quizId,
      question: questionData.question.trim(),
      answer: questionData.answer.trim(),
      options: questionData.options.map(opt => opt.trim()),
      coordinates: {
        latitude: parseFloat(questionData.coordinates.latitude),
        longitude: parseFloat(questionData.coordinates.longitude)
      },
      createdAt: new Date().toISOString()
    };

    // Save question to database
    const putQuestionCommand = new PutCommand({
      TableName: 'questions',
      Item: question
    });

    await docClient.send(putQuestionCommand);

    // Update quiz question count
    const updateQuizCommand = new UpdateCommand({
      TableName: 'quizzes',
      Key: { quizId },
      UpdateExpression: 'SET questionCount = questionCount + :increment',
      ExpressionAttributeValues: {
        ':increment': 1
      }
    });

    await docClient.send(updateQuizCommand);

    return success(question, 'Question added successfully');

  } catch (err) {
    console.error('Add question error:', err);
    return error('Failed to add question');
  }
};

const handler = middy(addQuestion).use(httpJsonBodyParser());
module.exports = { handler };
