const express = require("express");
const router = express.Router();

// Include middlewares
const { protect } = require("../middleware/auth");

// Main functionality
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");

// Router definations
router.post("/login", login);
router.get("/logout", logout);
router.post("/register", register);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotPassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// Export route
module.exports = router;
