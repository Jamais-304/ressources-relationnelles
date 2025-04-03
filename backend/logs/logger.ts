import type { Request, Response, NextFunction } from "express"
import winston, { Logger } from "winston"
import morgan, { type StreamOptions } from "morgan"
import { fileURLToPath } from "url"
import chalk from "chalk"
import moment from "moment"
import fs from "fs"
import path from "path"
/**
 * Logging configuration and middleware for handling HTTP requests, responses, and errors.
 *
 * This module utilizes the `winston` logging library to log events to both the console and files
 * with different levels of logging. It also uses the `morgan` middleware to log HTTP requests,
 * including the response time, HTTP status, method, and other relevant details.
 *
 * The module includes the following components:
 * - `logger`: A `winston` logger instance for logging messages.
 * - `morganMiddleware`: A `morgan` middleware for logging HTTP requests.
 * - `errorLogger`: A middleware for logging errors.
 */

// Resolve current file name and directory for use in logging
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Directory for saving log files
const logDirectory = path.join(__dirname, "..", "logs")
// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
}

/**
 * `logger`: A `winston` logger instance used to log messages.
 * - Logs are saved to console, `app.log` file (info level), and `error.log` file (error level).
 */
export const logger: Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.printf(({ message }) => {
            return message as string
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDirectory, "app.log") }),
        new winston.transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" })
    ]
})
/**
 * `morgan.token`: Custom tokens for logging HTTP request and response details with `morgan`.
 */
morgan.token("ip", (req: Request) => chalk.cyan(req.headers["x-forwarded-for"] || req.ip))
morgan.token("timestamp", () => moment().format("DD/MM/YYYY:HH:mm:ss Z"))
morgan.token("level", (req: Request, res: Response): string => {
    const status: number = res.statusCode
    if (status >= 500) return chalk.red("[ERROR]")
    if (status >= 400) return chalk.yellow("[WARN]")
    return chalk.green("[INFO]")
})
morgan.token("statusColor", (_req: Request, res: Response): string => {
    const status = res.statusCode
    if (status >= 500) return chalk.red(status.toString())
    if (status >= 400) return chalk.yellow(status.toString())
    if (status >= 300) return chalk.cyan(status.toString())
    return chalk.green(status.toString())
})
morgan.token("methodColor", (req: Request) => chalk.blue(req.method))
morgan.token("route", (req: Request) => chalk.magenta(req.originalUrl || "/"))
morgan.token("user-agent", (req: Request) => chalk.gray(req.headers["user-agent"] || "Unknown"))
/**
 * `morganFormat`: The format for logging HTTP request details using `morgan`.
 * The log includes:
 * - Timestamp
 * - Log level (INFO, WARN, ERROR)
 * - IP address
 * - HTTP method and route
 * - Status code with color coding
 * - Response time (in ms)
 * - User-Agent information
 */
const morganFormat: string =
    chalk.bgBlue(" :timestamp ") +
    "| :level | :ip | :methodColor | route : :route | status : :statusColor | execute : :response-time ms | :user-agent"
/**
 * `morganMiddleware`: A middleware function that uses `morgan` for logging HTTP requests.
 * This middleware logs requests with the defined `morganFormat` and outputs them to `winston`.
 */
export const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message: string): void => {
            logger.info(message.trim())
        }
    } as StreamOptions
})
/**
 * `errorLogger`: Middleware to log errors.
 * Logs errors that occur during the request handling with the HTTP method and URL.
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`)
    return next(err)
}
