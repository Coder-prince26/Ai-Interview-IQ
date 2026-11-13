const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const { notFound, errorHandler } = require("./middlewares/error.middleware")

const app = express()

// Needed on Render/Heroku etc. so rate limiting sees the real client IP
app.set("trust proxy", 1)

app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

// General limit for every API route
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
})

// Stricter limit for login/register to stop brute-force attempts
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts, please try again later." }
})

app.use("/api", apiLimiter)

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authLimiter, authRouter)
app.use("/api/interview", interviewRouter)

// These two must stay at the bottom, after all routes
app.use(notFound)
app.use(errorHandler)

module.exports = app