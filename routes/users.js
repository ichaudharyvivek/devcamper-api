const express = require("express");
const router = express.Router();

// Include database models
const User = require("../models/User");

// Include middleware
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Main functionality
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

// Router Definations
// Set to use middleware.
// Every route below this will use these middleware.
router.use(protect);
router.use(authorize("admin"));

router
    .route("/")
    .get(advancedResults(User), getUsers)
    .post(createUser); // prettier-ignore

router
    .route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser); // prettier-ignore

module.exports = router;
