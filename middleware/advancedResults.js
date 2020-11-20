const advancedResults = (model, populate) => async (req, res, next) => {
  let query, reqQuery, queryStr;

  // Copy req.query using spread operator
  reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Modify query string as per use to extract operators($gt, $gte etc)
  queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,(match) => `$${match}`); // prettier-ignore

  // Create final query string and get resources
  query = model.find(JSON.parse(queryStr)).populate(populate);

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
  const total = await model.countDocuments();
  //Execute for pagination
  query = query.skip(startIndex).limit(limit);

  // Execute query
  const results = await query;

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
