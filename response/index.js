// Response helper functions - different approach using classes and constants

// HTTP status codes as constants
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// Default headers for all responses
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Response class for creating different types of responses
class ResponseBuilder {
  constructor() {
    this.statusCode = HTTP_STATUS.OK;
    this.headers = { ...DEFAULT_HEADERS };
    this.body = {};
  }

  // Set status code
  setStatus(code) {
    this.statusCode = code;
    return this;
  }

  // Set response data
  setData(data) {
    this.body.data = data;
    return this;
  }

  // Set message
  setMessage(message) {
    this.body.message = message;
    return this;
  }

  // Set success flag
  setSuccess(success) {
    this.body.success = success;
    return this;
  }

  // Build the final response
  build() {
    return {
      statusCode: this.statusCode,
      headers: this.headers,
      body: JSON.stringify(this.body)
    };
  }
}

// Helper functions using the ResponseBuilder class
const success = (data = null, message = 'Success') => {
  return new ResponseBuilder()
    .setStatus(HTTP_STATUS.OK)
    .setSuccess(true)
    .setMessage(message)
    .setData(data)
    .build();
};

const error = (message = 'Error occurred', statusCode = HTTP_STATUS.BAD_REQUEST) => {
  return new ResponseBuilder()
    .setStatus(statusCode)
    .setSuccess(false)
    .setMessage(message)
    .build();
};

const notFound = (message = 'Not found') => {
  return new ResponseBuilder()
    .setStatus(HTTP_STATUS.NOT_FOUND)
    .setSuccess(false)
    .setMessage(message)
    .build();
};

const unauthorized = (message = 'Unauthorized') => {
  return new ResponseBuilder()
    .setStatus(401)
    .setSuccess(false)
    .setMessage(message)
    .build();
};

const sendError = (statusCode = HTTP_STATUS.BAD_REQUEST, message = 'Error occurred') => {
  return new ResponseBuilder()
    .setStatus(statusCode)
    .setSuccess(false)
    .setMessage(message)
    .build();
};

// Alternative: Arrow functions with object destructuring
const createResponse = ({ statusCode = HTTP_STATUS.OK, data = null, message = '', success = true }) => {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ success, message, data })
  };
};

// Export everything
module.exports = {
  success,
  error,
  notFound,
  unauthorized,
  sendError,
  createResponse,
  HTTP_STATUS
};