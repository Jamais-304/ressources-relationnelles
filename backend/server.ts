import { PORT_BACKEND } from "./config.ts"
import app from "./src/app.ts"
import http from "http"
import { normalize } from "./src/utils/normailze.ts"

/**
 * Normalize the port value.
 * Converts a string to an integer if possible.
 * - Returns the parsed integer if valid.
 * - Throws an error if the value is <= 0.
 * - Returns the original string if it's not a number.
 * - Returns `false` in unexpected cases (fallback).
 *
 * @param {string} portBackend - The port value as a string.
 * @returns {string | number | false} - The normalized port.
 */

const port = normalize(PORT_BACKEND || "3000")

app.set("port", port) // Set port configuration in App

const errorHandler = (error: NodeJS.ErrnoException) => {
    // If the error is not related to the 'listen' syscall, throw it
    if (error.syscall !== "listen") {
        throw error // Error handling for higher-level issues
    }
    // Retrieve the server's address and store it in the constant `address`
    const address = server.address()
    // Create an informative message for error handling, depending on the address type
    const bind = typeof address === "string" ? `pipe ${address}` : `port ${port}`
    // Handle specific error codes related to server binding
    switch (error.code) {
        case "EACCES":
            // Permission denied: the required privilege is missing
            console.error(`${bind} requires elevated privileges`)
            process.exit(1) // Exit the process with an error code (1), indicating failure
            break
        case "EADDRINUSE":
            // Address already in use: the port or pipe is occupied
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            // If the error code is not recognized, rethrow the error
            throw error
    }
}
const server = http.createServer(app)
server.on("error", errorHandler)
server.on("listening", () => {
    const portEmot: { [key: string]: string } = {
        // Déclaration du type d'index
        "0": "0️⃣",
        "1": "1️⃣",
        "2": "2️⃣",
        "3": "3️⃣",
        "4": "4️⃣",
        "5": "5️⃣",
        "6": "6️⃣",
        "7": "7️⃣",
        "8": "8️⃣",
        "9": "9️⃣"
    }
    const portSplit = port
        .toString()
        .split("")
        .map((digit) => portEmot[digit])
        .join("  ")
    const address = server.address()
    const bind = typeof address === "string" ? `pipe ${address}` : `port ${portSplit}`
    console.log("Server start 🛫")
    console.log(`Listening 👂 on ${bind}`)
})

server.listen(port)
