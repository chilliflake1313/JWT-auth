const rateLimit = require("express-rate-limit");

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});
