const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const connectDB = require("./config/db");
const geocoder = require("./utils/geocoder");
const PORT = process.env.PORT || 3000;

// Require Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const analytics = require("./routes/analytics");

// Require middleware
const errorHandler = require("./middleware/error");
const { get } = require("http");

// Intializations
const app = express();
app.use(express.json());
dotenv.config({ path: "./config/config.env" });
app.use(cookieParser());

// Connect to database
connectDB();

// Rate Limiiting by express-rate-limit package
// 120 request per 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 120, // 120 requests
});

// Use server middlewares
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null; //Dev logging middleware
app.use(fileupload()); // Builtin Package for fileupload
app.use(express.static(path.join(__dirname, "public"))); // Include static folder
app.use(mongoSanitize()); // Sanitize data for ambigious characters like $ or .
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(limiter); //Rate limiter middleware
app.use(hpp()); //Prevent http param pollution
app.use(cors()); // Enable cors

// API ROUTES - API V1 - /api/v1/
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/analytics", analytics);
app.use(errorHandler); // Middleware are used after specifying route or else will not work

// Main ROUTES
app.route("/").get((req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

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
