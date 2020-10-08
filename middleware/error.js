const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err.name);

  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  process.env.NODE_ENV === "production" ? null : console.log(err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with an ID of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;
