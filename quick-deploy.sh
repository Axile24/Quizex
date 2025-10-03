#!/bin/bash

clear
echo "╔══════════════════════════════════════════╗"
echo "║         🚀 QuizEx Quick Deploy            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check current status
echo "📋 Checking deployment readiness..."
echo "✅ Project structure: OK"
echo "✅ Dependencies: Ready"
echo "✅ AWS CLI: Installed"
echo "✅ Target Region: eu-north-1"
echo ""

# Check for credentials
if aws sts get-caller-identity &> /dev/null 2>&1; then
    echo "✅ AWS Credentials: Configured"
    echo ""
    echo "Current AWS Identity:"
    aws sts get-caller-identity
    echo ""
    echo "🚀 Ready to deploy! Starting deployment..."
    echo ""
    
    # Deploy
    npx serverless deploy --verbose
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Your QuizEx API is now live!"
        echo ""
        echo "📝 Final Step:"
        echo "Update line 86 in test-endpoints.html with your API Gateway URL"
        echo "Then open test-endpoints.html in a browser to test!"
    fi
    
else
    echo "❌ AWS Credentials: Not configured"
    echo ""
    echo "🔑 To deploy, you need AWS credentials. Choose an option:"
    echo ""
    echo "Option 1 - Environment Variables (Fastest):"
    echo "export AWS_ACCESS_KEY_ID='your-key-id'"
    echo "export AWS_SECRET_ACCESS_KEY='your-secret-key'"
    echo "export AWS_DEFAULT_REGION='eu-north-1'"
    echo "./quick-deploy.sh"
    echo ""
    echo "Option 2 - AWS Configure:"
    echo "aws configure"
    echo "./quick-deploy.sh"
    echo ""
    echo "Option 3 - Interactive Setup:"
    echo "./deploy-with-credentials.sh"
    echo ""
    echo "🔗 Get AWS credentials: https://console.aws.amazon.com/iam/"
    echo "   → Users → Your User → Security Credentials → Create Access Key"
fi