# QuizEx - Svensk Quiz Applikation

En enkel quiz-applikation byggd med AWS Serverless Framework, med svenskt gränssnitt och interaktiv quiz-funktionalitet.

## Funktioner

- **Användarhantering**: Registrera, logga in och hantera användare
- **Quiz-system**: Skapa, spela och hantera quizer
- **Frågehantering**: Lägg till frågor med koordinater
- **Poängspårning**: Registrera poäng och visa topplistor
- **Svenskt gränssnitt**: Komplett svenskt språkstöd
- **Interaktiv quiz-spelare**: Spela quiz med 3 JavaScript-frågor

## Projektstruktur

```
QuizEx/
├── quizex.html              # Huvudapplikation på svenska
├── local-server.js          # Lokal utvecklingsserver
├── collectionpostman.json   # Postman API-samling
├── serverless.yml           # AWS Serverless konfiguration
├── package.json             # Dependencies och scripts
├── Functions/               # Lambda-funktioner
│   ├── auth/               # Autentiseringsfunktioner
│   ├── users/              # Användarhantering
│   ├── quizzes/            # Quiz-hantering
│   ├── questions/          # Frågehantering
│   ├── scores/             # Poänghantering
├── middleware/             # Middleware-funktioner
│   └── auth.js            # Autentiserings-middleware
└── response/               # Response utilities
```

## Snabbstart

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
Gå till `http://localhost:3000` i din webbläsare

## API Endpoints

### Autentisering
- `POST /auth/register` - Registrera ny användare
- `POST /auth/login` - Logga in användare

### Quiz-hantering
- `POST /quiz` - Skapa ny quiz
- `GET /quizzes` - Hämta alla quizer
- `DELETE /quiz/{id}` - Ta bort quiz

### Frågehantering
- `POST /quiz/{id}/question` - Lägg till fråga
- `GET /quiz/{id}/questions` - Hämta quiz-frågor

### Poänghantering
- `POST /quiz/{id}/score` - Registrera poäng
- `GET /quiz/{id}/leaderboard` - Hämta topplista

### Enkla Endpoints
- `GET /simple/quizzes` - Hämta quizer (publikt)
- `GET /simple/quiz/{id}/questions` - Hämta frågor (publikt)
- `GET /simple/quiz/{id}/leaderboard` - Hämta topplista (publikt)
- `POST /simple/login` - Enkel inloggning

## Teknisk Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: AWS Lambda (Node.js 18)
- **Database**: Amazon DynamoDB
- **API Gateway**: AWS API Gateway
- **Deployment**: Serverless Framework
- **Authentication**: JWT tokens

## Utveckling

### Lokal utveckling
```bash
# Starta lokal server
node local-server.js

# Öppna http://localhost:3000
```

### Deploya ändringar
```bash
# Deploya till AWS
npx serverless deploy

# Deploya enskild funktion
npx serverless deploy function --function functionName
```

## Testdata

Applikationen innehåller testdata med en "Sverige Quiz" som innehåller 3 frågor:
1. Vad är huvudstaden i Sverige?
2. Vilken är Sveriges största sjö?
3. Vem är Sveriges nuvarande kung?

## Licens

MIT License - se LICENSE fil för detaljer.

## Bidrag

Bidrag är välkomna! Skapa en pull request eller öppna en issue för förslag.

## Kontakt

För frågor eller support, kontakta utvecklaren.