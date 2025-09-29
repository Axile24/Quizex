/**
 * Delete a quiz
 * This function removes a quiz and all its questions
 */

const middy = require('@middy/core');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { success, error, notFound } = require('../../response');

// Connect to DynamoDB
const dynamoClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-north-1' 
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Delete a quiz by ID
 */
const deleteQuiz = async (event) => {
  try {
    const quizId = event.pathParameters?.id;
    
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

    // Delete the quiz
    const deleteQuizCommand = new DeleteCommand({
      TableName: 'quizzes',
      Key: { quizId }
    });

    await docClient.send(deleteQuizCommand);

    // Also delete all questions for this quiz
    const queryQuestionsCommand = new QueryCommand({
      TableName: 'questions',
      IndexName: 'quizId-index',
      KeyConditionExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId
      }
    });

    const questionsResult = await docClient.send(queryQuestionsCommand);
    
    // Delete each question
    for (const question of questionsResult.Items) {
      const deleteQuestionCommand = new DeleteCommand({
        TableName: 'questions',
        Key: { questionId: question.questionId }
      });
      await docClient.send(deleteQuestionCommand);
    }

    return success({ quizId }, 'Quiz and all its questions deleted successfully');

  } catch (err) {
    console.error('Delete quiz error:', err);
    return error('Failed to delete quiz');
  }
};

const handler = middy(deleteQuiz);
module.exports = { handler };
