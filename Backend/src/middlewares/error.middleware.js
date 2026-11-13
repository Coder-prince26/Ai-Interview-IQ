function notFound(req, res, next) {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    })
}

function errorHandler(err, req, res, next) {
    console.error(err)

    // Duplicate value on a unique field (e.g. same email registered twice at the same moment)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "field"
        return res.status(409).json({ message: `This ${field} is already taken` })
    }

    // Mongoose validation failed
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: Object.values(err.errors)[0].message })
    }

    // Invalid MongoDB id, e.g. /api/interview/report/abc
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid id" })
    }

    // File upload errors from multer (e.g. file too large)
    if (err.name === "MulterError") {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "File is too large. Maximum size is 5MB"
            : err.message
        return res.status(400).json({ message })
    }

    // Anything else: use the status we set ourselves, or fall back to 500
    const status = err.statusCode || 500

    res.status(status).json({
        message: status === 500 ? "Internal server error" : err.message
    })
}

module.exports = { notFound, errorHandler }