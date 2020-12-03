const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const geocoder = require("./utils/geocoder");
const PORT = process.env.PORT || 3000;

// Require Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// Require middleware
const errorHandler = require("./middleware/error");

// Intializations
const app = express();
app.use(express.json());
dotenv.config({ path: "./config/config.env" });
app.use(cookieParser());

// Connect to database
connectDB();

// Use Server Middlewares
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null; //Dev logging middleware
app.use(fileupload());
app.use(express.static(path.join(__dirname, "public")));

// API ROUTES - API V1 - /api/v1/
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
app.use(errorHandler); // Middleware are used after specifying route or else will not work

// LISTEN TO PORT
const server = app.listen(PORT, (req, res) => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejection - [For eg. mongodb password is wrong]
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1)); // Since error so we exit with error code 1
});
