const express = require("express");
const router = express.Router({ mergeParams: true }); //  { mergeParams: true }:- To handle any redirects from other routes

// Include database models
const Review = require("../models/Review");

// Include middleware
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Main functionality
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// Router Definations
router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .put(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
