# AWS Setup Instructions for QuizEx Deployment

## Required AWS Credentials

To deploy this serverless application, you need AWS credentials with the following permissions:
- DynamoDB: Create, Read, Update, Delete tables and items
- Lambda: Create, Update, Delete functions
- API Gateway: Create, Update, Delete HTTP APIs
- CloudFormation: Create, Update, Delete stacks
- IAM: Create, Update roles (for Lambda execution)

## Option 1: Using AWS CLI Configure (Recommended)

```bash
aws configure
```

You'll be prompted to enter:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: eu-north-1
- Default output format: json

## Option 2: Environment Variables

```bash
export AWS_ACCESS_KEY_ID="your-access-key-here"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key-here"
export AWS_DEFAULT_REGION="eu-north-1"
```

## Option 3: AWS Credentials File

Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your-access-key-here
aws_secret_access_key = your-secret-access-key-here
```

## Getting AWS Credentials

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user or use existing user
3. Attach policies: `PowerUserAccess` or create custom policy with required permissions
4. Create Access Keys in Security Credentials tab
5. Save the Access Key ID and Secret Access Key

## Deploy the Application

Once credentials are configured, run:
```bash
./deploy.sh
```

Or manually:
```bash
npx serverless deploy
```

## Verify Deployment

After successful deployment, you'll get an API Gateway URL like:
`https://abc123def4.execute-api.eu-north-1.amazonaws.com`

Update this URL in `test-endpoints.html` at line 86:
```javascript
let apiBaseUrl = 'your-new-api-url-here';
```