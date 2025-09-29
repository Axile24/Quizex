const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the HTML files
  if (req.url === '/' || req.url === '/quizex.html') {
    fs.readFile('quizex.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading quiz app');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`....Local server running at http://localhost:${PORT}/`);
  console.log('QuizEx App ');
  console.log('..API Base URL: https://zdgjj51feh.execute-api.eu-north-1.amazonaws.com');
});
