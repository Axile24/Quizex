# 🚀 AWS Deployment Guide for QuizEx

## Current Status
- ✅ Project is ready for deployment
- ✅ AWS CLI installed and configured for eu-north-1
- ✅ All dependencies installed
- ❌ AWS credentials needed

## Quick Deploy Options

### Option 1: Set Environment Variables (Fastest)
```bash
# Set your AWS credentials
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"

# Deploy immediately
./deploy.sh
```

### Option 2: Use AWS Configure
```bash
aws configure
# Enter when prompted:
# AWS Access Key ID: your-access-key-id
# AWS Secret Access Key: your-secret-access-key  
# Default region: eu-north-1
# Default output: json

./deploy.sh
```

### Option 3: Create Credentials File
```bash
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = your-access-key-id
aws_secret_access_key = your-secret-access-key
EOF

./deploy.sh
```

## Getting AWS Credentials

1. **Go to AWS Console**: https://console.aws.amazon.com/iam/
2. **Navigate**: Users → Your Username → Security Credentials
3. **Create Access Key**: Click "Create access key"
4. **Copy**: Both Access Key ID and Secret Access Key
5. **Use above methods** to configure

## Expected Deployment Output

After credentials are set, running `./deploy.sh` will:

```
✅ AWS credentials found!
🔧 Installing dependencies...
🚀 Deploying to AWS...

Creating CloudFormation stack...
Creating Lambda functions...
Creating DynamoDB tables...
Creating API Gateway...

✅ Deployment completed!

Service Information
service: quizex
stage: dev
region: eu-north-1
stack: quizex-dev
resources: 12
api keys: None
endpoints:
  POST - https://abc123.execute-api.eu-north-1.amazonaws.com/user
  POST - https://abc123.execute-api.eu-north-1.amazonaws.com/login
  POST - https://abc123.execute-api.eu-north-1.amazonaws.com/quiz
  GET - https://abc123.execute-api.eu-north-1.amazonaws.com/quizzes
  DELETE - https://abc123.execute-api.eu-north-1.amazonaws.com/quiz/{id}
  POST - https://abc123.execute-api.eu-north-1.amazonaws.com/quiz/{id}/question
  GET - https://abc123.execute-api.eu-north-1.amazonaws.com/quiz/{id}/questions
  POST - https://abc123.execute-api.eu-north-1.amazonaws.com/quiz/{id}/score
  GET - https://abc123.execute-api.eu-north-1.amazonaws.com/quiz/{id}/leaderboard
functions:
  createUser: quizex-dev-createUser
  loginUser: quizex-dev-loginUser
  createQuiz: quizex-dev-createQuiz
  getAllQuizzes: quizex-dev-getAllQuizzes
  deleteQuiz: quizex-dev-deleteQuiz
  addQuestionToQuiz: quizex-dev-addQuestionToQuiz
  getQuizQuestions: quizex-dev-getQuizQuestions
  registerScore: quizex-dev-registerScore
  getLeaderboard: quizex-dev-getLeaderboard
```

## After Deployment

1. **Copy the API endpoint URL** (e.g., `https://abc123.execute-api.eu-north-1.amazonaws.com`)
2. **Update test-endpoints.html** line 86:
   ```javascript
   let apiBaseUrl = 'https://your-new-api-url.execute-api.eu-north-1.amazonaws.com';
   ```
3. **Open test-endpoints.html** in browser to test your live API!

## Troubleshooting

- **Permission denied**: Ensure your AWS user has `PowerUserAccess` or necessary permissions
- **Region mismatch**: Ensure you're using `eu-north-1` region
- **Deployment fails**: Check CloudFormation console for detailed error logs