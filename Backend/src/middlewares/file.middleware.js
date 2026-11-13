const multer = require("multer")

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB, same as the text shown on the Home page

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        return cb(null, true)
    }

    const error = new Error("Only PDF files are allowed")
    error.statusCode = 400
    cb(error)
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
})

module.exports = upload