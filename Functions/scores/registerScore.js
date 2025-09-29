/**
 * Register a score for a quiz
 * This function saves a player's score
 */

const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { nanoid } = require('nanoid');
const { success, error, notFound } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Validate score data
 */
const validateScoreData = (scoreData) => {
  const { playerName, score, quizId } = scoreData;

  if (!playerName || score === undefined || !quizId) {
    return { isValid: false, message: 'Player name, score, and quiz ID are required' };
  }

  if (playerName.length < 2) {
    return { isValid: false, message: 'Player name must be at least 2 characters long' };
  }

  if (typeof score !== 'number' || score < 0) {
    return { isValid: false, message: 'Score must be a positive number' };
  }

  return { isValid: true };
};

/**
 * Register a score for a quiz
 */
const registerScore = async (event) => {
  try {
    const quizId = event.pathParameters?.id;
    const scoreData = event.body;

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

    // Validate score data
    const validation = validateScoreData(scoreData);
    if (!validation.isValid) {
      return error(validation.message);
    }

    // Create score object
    const score = {
      scoreId: nanoid(),
      quizId: quizId,
      playerName: scoreData.playerName.trim(),
      score: parseInt(scoreData.score),
      timestamp: new Date().toISOString()
    };

    // Save score to database
    const putScoreCommand = new PutCommand({
      TableName: 'scores',
      Item: score
    });

    await docClient.send(putScoreCommand);

    return success(score, 'Score registered successfully');

  } catch (err) {
    console.error('Register score error:', err);
    return error('Failed to register score');
  }
};

const handler = middy(registerScore).use(httpJsonBodyParser());
module.exports = { handler };
