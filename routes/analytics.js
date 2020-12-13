const express = require("express");
const { route } = require("./courses");
const router = express.Router();

// Main functionality.
const { getAnalytics } = require("../controllers/analytics");

// Router definations
router
  .route('/')
  .post(getAnalytics) // prettier-ignore

module.exports = router;
