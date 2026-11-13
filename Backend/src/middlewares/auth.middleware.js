const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const asyncHandler = require("../utils/asyncHandler")

const authUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Token not provided" })
    }

    // Step 1: verify the token first (cheap, no database needed)
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        const message = err.name === "TokenExpiredError"
            ? "Token has expired, please login again"
            : "Invalid token"
        return res.status(401).json({ message })
    }

    // Step 2: only a valid token reaches the database to check the blacklist
    const isTokenBlacklisted = await tokenBlacklistModel.exists({ token })

    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Token is invalid, please login again" })
    }

    req.user = decoded
    next()
})

module.exports = { authUser }