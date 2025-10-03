#!/bin/bash

# QuizEx Deployment Script
echo "🚀 Starting QuizEx deployment process..."

# Check if AWS credentials are configured
echo "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured!"
    echo ""
    echo "To configure AWS credentials, run one of the following:"
    echo "1. aws configure (interactive setup)"
    echo "2. Export environment variables:"
    echo "   export AWS_ACCESS_KEY_ID=your-access-key"
    echo "   export AWS_SECRET_ACCESS_KEY=your-secret-key"
    echo "   export AWS_SESSION_TOKEN=your-token (if using temporary credentials)"
    echo ""
    echo "After configuring credentials, run this script again."
    exit 1
fi

echo "✅ AWS credentials found!"
echo "Current AWS identity:"
aws sts get-caller-identity

echo ""
echo "🔧 Installing dependencies..."
npm install

echo ""
echo "🚀 Deploying to AWS..."
npx serverless deploy --verbose

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Your API endpoints will be displayed above."
echo "Update the apiBaseUrl in test-endpoints.html with the new API Gateway URL."