const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// Geocode not working with geocoder.geocode(zipcode)
// So changed from "/radius/:zipcode/:distance/:lng/:lat" to "/radius/:lng/:lat"
router.route("/radius/:lng/:lat/:distance").get(getBootcampsInRadius);

// Export Router
module.exports = router;
