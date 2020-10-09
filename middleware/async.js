/*
  Implemented DRY technique to avoid writing try-catch block everytime
  we define a route. It basically execute catch for us.
  Link: https://www.acuriousanimal.com/blog/2018/03/15/express-async-middleware
*/

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
