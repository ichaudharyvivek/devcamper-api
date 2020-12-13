const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Analytics = require("../models/Analytics");

// @desc    Get analytics data
// @route   POST /api/v1/analytics
// @access  Public
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  req.body.clientIP = req.connection.remoteAddress;
  req.body.count = 1;
  req.body.visitedAt = Date.now() + 1 * 60 * 1000;

  const visitor = await Analytics.findOne({ clientIP: req.body.clientIP });
  if (!visitor) {
    await Analytics.create(req.body);
  } else {
    await Analytics.findOneAndUpdate(
      { clientIP: req.body.clientIP },
      { $inc: { count: 1 } },
      { new: true }
    );
  }

  const totalVisitors = await Analytics.find();
  let totalCounts = 0;
  totalVisitors.forEach((data) => {
    totalCounts += data.count;
  });

  res.status(200).json({ success: true, count: totalCounts });
});
