const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Configuring the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// Using the DynamoDBDocumentClient to simplify operations
const db = DynamoDBDocumentClient.from(client);

module.exports = { db };
