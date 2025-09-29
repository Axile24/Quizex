# QuizEx
Individuell examinations uppgift 

## lambdas logik

Användarhantering**: Registrera, logga in och hantera användare
Quiz-system**: Skapa, spela och hantera quizer
Frågehantering**: Lägg till frågor med koordinater
Poängspårning**: Registrera poäng och visa topplistor
Interaktiv quiz-spelare**: Spela quiz med 3 JavaScript-frågor om möjligt



### 1. Installera Dependencies
```bash
npm install
```

### 2. Deploya till AWS
```bash
npm run deploy
```

### 3. Kör Lokalt
```bash
node local-server.js
```

### 4. Öppna Applikationen
Gå till `http://localhost:8000` i din webbläsare

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Simple Quiz
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
3. Create and play quizzes interactively



- **AWS Lambda** - Serverless functions
- **AWS DynamoDB** - Database
- **AWS API Gateway** - API endpoints
- **Node.js** - Runtime
- **Middy** - Middleware framework
- **Serverless Framework** - Deployment

--------------------------------endpoints---------------------
Base API URL: https://zdgjj51feh.execute-api.eu-north-1.amazonaws.com

https://zdgjj51feh.execute-api.eu-north-1.amazonaws.com/simple/quizzes
https://zdgjj51feh.execute-api.eu-north-1.amazonaws.com/auth/login
https://zdgjj51feh.execute-api.eu-north-1.amazonaws.com/auth/register




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

