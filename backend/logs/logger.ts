import type { Request, Response, NextFunction } from "express"
import winston, { Logger } from "winston"
import morgan, { type StreamOptions } from "morgan"
import { fileURLToPath } from "url"
import chalk from "chalk"
import moment from "moment"
import fs from "fs"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDirectory = path.join(__dirname, "..", "logs")
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
}

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

const morganFormat: string =
    chalk.bgBlue(" :timestamp ") +
    "| :level | :ip | :methodColor | route : :route | status : :statusColor | execute : :response-time ms | :user-agent"

export const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message: string): void => {
            logger.info(message.trim())
        }
    } as StreamOptions
})

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`)
    return next(err)
}
