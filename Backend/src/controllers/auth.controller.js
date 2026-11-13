const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const tokenBlacklistModel = require('../models/blacklist.model')
const asyncHandler = require('../utils/asyncHandler')

const isProduction = process.env.NODE_ENV === 'production'

// Cookie settings: httpOnly hides the token from JavaScript.
// In production the frontend and backend are on different domains,
// so sameSite must be "none" and secure must be true.
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
}

// clearCookie needs the same options (without maxAge) to remove the cookie
const clearCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
}

const registerSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters").max(30, "Username is too long"),
    email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
    // bcrypt only uses the first 72 characters, so we cap it there
    password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long")
})

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required")
})

const generateToken = (user) => jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
)

const formatUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email
})


/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the body
 * @access Public
 */
const registerUserController = asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0].message })
    }

    const { username, email, password } = parsed.data

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({ username, email, password: hash })

    res.cookie("token", generateToken(user), cookieOptions)

    res.status(201).json({
        message: "User registered successfully",
        user: formatUser(user)
    })
})


/**
 * @name loginUserController
 * @description login a user, expects email and password in the body
 * @access Public
 */
const loginUserController = asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0].message })
    }

    const { email, password } = parsed.data

    const user = await userModel.findOne({ email }).select("+password")

    // Same message for "no user" and "wrong password" so attackers can't guess which emails exist
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" })
    }

    res.cookie("token", generateToken(user), cookieOptions)

    res.status(200).json({
        message: "User logged in successfully",
        user: formatUser(user)
    })
})


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
const logoutUserController = asyncHandler(async (req, res) => {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.updateOne({ token }, { token }, { upsert: true })
    }

    res.clearCookie("token", clearCookieOptions)

    res.status(200).json({ message: "User logged out successfully" })
})


/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 */
const getMeController = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: formatUser(user)
    })
})

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }