const AppError = require("../utils/AppError");

function requireFields(fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined);
    if (missing.length) {
      return next(new AppError(`Missing fields: ${missing.join(", ")}`, 400));
    }
    next();
  };
}

module.exports = {
  requireFields,
};
