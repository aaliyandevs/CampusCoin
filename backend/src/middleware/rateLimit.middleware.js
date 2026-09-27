const rateLimit = require('express-rate-limit')

// Auth endpoints are the classic brute-force / credential-stuffing / email
// enumeration targets, so they get a tighter limit than the rest of the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
})

module.exports = { authLimiter }
