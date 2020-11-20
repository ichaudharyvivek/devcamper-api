const express = require("express");
const router = express.Router({ mergeParams: true }); //  { mergeParams: true }:- To handle any redirects from other routes

// Include database models
const Course = require("../models/Course");

// Include middleware
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Main functionality
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

// Router Definations
router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description website email phone location.city",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

// Export Router
module.exports = router;
