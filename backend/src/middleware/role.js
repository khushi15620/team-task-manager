const ApiError = require('../utils/ApiError');

exports.requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient permissions'));
  }
  next();
};
