const express = require("express");
const router = express.Router();

// Include database Models
const Bootcamp = require("../models/Bootcamp");

// Include Middlewares
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Include other resource routers - for required redirects
const courseRouter = require("./courses");

// Main functionality.
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

// Re-route into other resource routers - if encountered in URL
router.use("/:bootcampId/courses", courseRouter);

// Router Definations
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

// Geocode not working with geocoder.geocode(zipcode)
// So changed from "/radius/:zipcode/:distance/:lng/:lat" to "/radius/:lng/:lat/:distance"
router
  .route("/radius/:lng/:lat/:distance")
  .get(getBootcampsInRadius); // prettier-ignore

// Route for photo Uploading
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

// Export Router
module.exports = router;
