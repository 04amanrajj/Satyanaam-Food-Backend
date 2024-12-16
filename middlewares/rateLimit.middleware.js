const { rateLimit } = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests, please try again later.", // Custom message
  standardHeaders: true, // `RateLimit` header (draft-7 standard)
  legacyHeaders: false, // Disable `X-RateLimit-*` headers (legacy format)
  keyGenerator: (req) => req.ip, // Use IP address for rate-limiting
});
