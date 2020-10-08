// @desc    We extended the JS Error Class to add a custom error handling
//          based on the statusCode and the message provided in ErrorResponse
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
