#!/bin/bash

# QuizEx Deployment Script with Credential Setup
echo "🚀 QuizEx AWS Deployment Setup"
echo "================================="

# Function to prompt for credentials
setup_credentials() {
    echo ""
    echo "🔑 Setting up AWS credentials..."
    echo ""
    
    # Check if credentials already exist
    if aws sts get-caller-identity &> /dev/null; then
        echo "✅ AWS credentials already configured!"
        aws sts get-caller-identity
        return 0
    fi
    
    echo "Please enter your AWS credentials:"
    echo "(You can get these from AWS IAM Console → Users → Security Credentials)"
    echo ""
    
    read -p "AWS Access Key ID: " aws_access_key
    read -s -p "AWS Secret Access Key: " aws_secret_key
    echo ""
    
    # Set environment variables
    export AWS_ACCESS_KEY_ID="$aws_access_key"
    export AWS_SECRET_ACCESS_KEY="$aws_secret_key"
    export AWS_DEFAULT_REGION="eu-north-1"
    
    # Verify credentials
    echo ""
    echo "🔍 Verifying credentials..."
    if aws sts get-caller-identity; then
        echo "✅ Credentials verified successfully!"
        return 0
    else
        echo "❌ Invalid credentials. Please check and try again."
        return 1
    fi
}

# Function to deploy
deploy_application() {
    echo ""
    echo "🔧 Installing dependencies..."
    npm install
    
    echo ""
    echo "🚀 Deploying to AWS..."
    echo "This may take 2-3 minutes..."
    
    if npx serverless deploy --verbose; then
        echo ""
        echo "🎉 Deployment successful!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Copy the API Gateway URL from the output above"
        echo "2. Update test-endpoints.html line 86 with your new API URL"
        echo "3. Open test-endpoints.html in a browser to test your API"
        echo ""
        echo "Your QuizEx API is now live! 🚀"
        return 0
    else
        echo ""
        echo "❌ Deployment failed. Check the errors above."
        echo "Common issues:"
        echo "- Insufficient permissions (need PowerUserAccess)"
        echo "- Region not available"
        echo "- Resource name conflicts"
        return 1
    fi
}

# Main execution
echo "Checking for AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    if ! setup_credentials; then
        exit 1
    fi
else
    echo "✅ AWS credentials found!"
    aws sts get-caller-identity
fi

deploy_application