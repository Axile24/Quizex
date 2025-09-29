# QuizEx - Individuel Quiz uppgiften 

A simple quiz application built with AWS Serverless Framework, featuring a Swedish interface and interactive quiz functionality.

## Features

- **User Management**: Register, login, and manage users
- **Quiz System**: Create, play, and manage quizzes
- **Question Management**: Add questions with coordinates
- **Score Tracking**: Register scores and view leaderboards
- **Swedish Interface**: Complete Swedish language support
- **Simple Quiz Player**: Interactive quiz with 3 JavaScript questions

## Project Structure

```
QuizEx/
├── quizex.html              # Main Swedish quiz application
├── local-server.js          # Local development server
├── collectionpostman.json   # Postman API collection
├── serverless.yml           # AWS Serverless configuration
├── package.json             # Dependencies and scripts
├── Functions/               # Lambda functions
│   ├── auth/               # Authentication functions
│   ├── users/              # User management
│   ├── quizzes/            # Quiz management
│   ├── questions/          # Question management
│   ├── scores/             # Score management
├── middleware/             # Middleware functions
│   └── auth.js            # Authentication middleware
└── response/               # Response utilities
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy to AWS
```bash
npm run deploy
```

### 3. Run Locally
```bash
node local-server.js
```

### 4. Open Application
Go to `http://localhost:3000` in your browser

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Simple Quiz (Hardcoded Data)
- `GET /simple/quizzes` - Get available quizzes
- `GET /simple/quiz/{id}/questions` - Get quiz questions
- `GET /simple/quiz/{id}/leaderboard` - Get leaderboard
- `POST /simple/login` - Simple login

### Quiz Management
- `POST /quiz` - Create quiz
- `GET /quizzes` - Get all quizzes
- `DELETE /quiz/{id}` - Delete quiz

### Question Management
- `POST /quiz/{id}/question` - Add question
- `GET /quiz/{id}/questions` - Get questions

### Score Management
- `POST /quiz/{id}/score` - Register score
- `GET /quiz/{id}/leaderboard` - Get leaderboard

### User Management
- `GET /users` - Get all users
- `DELETE /users/{email}` - Delete user

## Usage

### Web Interface
1. Open `http://localhost:3000`
2. Use the Swedish interface to manage quizzes and users
3. Create and play quizzes interactively

## Technologies Used

- **AWS Lambda** - Serverless functions
- **AWS DynamoDB** - Database
- **AWS API Gateway** - API endpoints
- **Node.js** - Runtime
- **Middy** - Middleware framework
- **Serverless Framework** - Deployment

## Swedish Language Support

The application is fully translated to Swedish with proper UTF-8 encoding:
- All user interface text in Swedish
- Quiz questions and answers in Swedish
- Error messages and feedback in Swedish
- Proper Unicode support for å, ä, ö characters

## Development

### Local Development
```bash
# Start local server
node local-server.js
```

### Deployment
```bash
# Deploy to AWS
npm run deploy

# View logs
npm run logs

# Remove deployment
npm run remove
```

## License

MIT License - Feel free to use and modify as needed.
