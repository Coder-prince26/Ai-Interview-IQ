require('dotenv').config();
const dns = require('dns');

// Some local networks fail MongoDB Atlas SRV lookups.
// Enable this only when needed by setting USE_GOOGLE_DNS=true in .env
if (process.env.USE_GOOGLE_DNS === 'true') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = require("./src/app")
const connectToDB = require("./src/config/db")

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await connectToDB()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Failed to start server:", err.message)
        process.exit(1)
    }
}

startServer()