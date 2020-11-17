const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const { geocode } = require("../utils/geocoder");
const { query } = require("express");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query, reqQuery, queryStr;

  // Copy req.query using spread operator
  reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Modify query string as per use to extract operators($gt, $gte etc)
  queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Create final query string and get resources
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // Select fields - only if req.select is present
  if (req.query.select) {
    const fields = req.query.select.replace(/,/g, " ");
    query.select(fields);
  }

  // Sort data on sortBy - only if req.sort is present
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(/,/g, " ");
    query.sort(sortBy);
  } else {
    query.sort("-createdAt");
    // default sort by createdAt in desending order.
    // -1 => descending && 1=> ascending
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1; // Page Nos.
  const limit = parseInt(req.query.limit, 10) || 25; // No. of elements on single page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  //Execute for pagination
  query = query.skip(startIndex).limit(limit);

  // Execute query
  const bootcamps = await query;

  // Pagination Result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit, // This is same as doing limit:limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Send JSON
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination, // This is same as doing pagination:pagination
    data: bootcamps,
  });
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`Resource not found with ID ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Update bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp)
    return next(
      new ErrorResponse(`Resource not found with ID ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  console.log(bootcamp);
  if (!bootcamp)
    return next(
      new ErrorResponse(`Resource not found with ID ${req.params.id}`, 404)
    );
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get bootcamps within radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance/:lat/:lng
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  // const { zipcode, distance } = req.params;
  const { lng, lat, distance } = req.params;

  // NOTE: Geocode not working with geocoder.geocode(zipcode)
  // Get lat/lng from geocoder
  // const loc = await geocoder.geocode(zipcode);
  // const lat = loc[0].latitude;
  // const lng = loc[0].longitude;

  // Calc radius using radius
  // Divide dist by radius of Earth
  // Radius of Earth is 3,693 mi / 6,378.1 km
  const radius = distance / 3693;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
