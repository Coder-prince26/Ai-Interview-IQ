const rateLimit = require("express-rate-limit")

// Limit for AI routes (these cost money). Counted per logged in user, not per IP.
// This middleware must run AFTER authUser, because it needs req.user.
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    keyGenerator: (req) => req.user.id,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "You have reached the hourly limit for AI requests. Please try again later." }
})

module.exports = { aiLimiter }