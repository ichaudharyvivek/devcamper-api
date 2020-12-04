const { json } = require("express");
const ErrorResponse = require("../utils/errorResponse");

/*
 __________________________________________
 Explaination of given code snippet :-
 __________________________________________

 So in line '22' we recieve the default system generated error(if any). We are
 concered with sending error to client which they can understand without any
 jargons. For this we imported all the error in variable "error" using ES6
 spread operator. Now we check for custom error for eg. if it is a duplicate
 value error or something other which is pre-specified. So lets say we got the 
 error as duplicate key error. Then in the if condition we defined our tailermade
 message with its status code as a new Error class "ErrorResponse" which
 extends JS default Error class. It returns an object with message and status
 code which we then send to client using json.

*/

// Function starts
const errorHandler = (err, req, res, next) => {
  let error = { ...err }; //Doubt: why used this. Without this CastError is working but objectID not exist condition not working.
  error.message = err.message;

  // Log to console for development
  process.env.NODE_ENV === "production" ? null : console.log(err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ErrorResponse(message, 404);
  }

  // Mongoose dublicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    let message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Send HANDLED ERROR
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;
