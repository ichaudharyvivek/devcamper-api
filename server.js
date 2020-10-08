const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;

// Require middleware
const errorHandler = require("./middleware/error");

// Intializations
const app = express();
app.use(express.json());
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Middlewares
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null; //Dev logging middleware

// Route files
const bootcamps = require("./routes/bootcamps");

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use(errorHandler); // Middleware are used after specifying route or else will not work

// Listen to port
const server = app.listen(PORT, (req, res) => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejection - [For eg. mongodb password is wrong]
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1)); // Since error so we exit with error code 1
});
