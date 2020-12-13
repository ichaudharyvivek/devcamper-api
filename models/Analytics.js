const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  clientIP: String,
  count: Number,
  visitedAt: Date,
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
