const express = require("express");
const router = express.Router();

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
router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// Geocode not working with geocoder.geocode(zipcode)
// So changed from "/radius/:zipcode/:distance/:lng/:lat" to "/radius/:lng/:lat/:distance"
router.route("/radius/:lng/:lat/:distance").get(getBootcampsInRadius);

// Route for photo Uploading
router.route("/:id/photo").put(bootcampPhotoUpload);

// Export Router
module.exports = router;
