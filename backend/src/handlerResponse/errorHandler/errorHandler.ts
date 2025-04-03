import type { Response } from "express"
import { errorResponse } from "../formatResponse.ts"
import { ErrorMappings } from "./configs.ts"

/**
 * Error handler function to map errors to appropriate HTTP status codes.
 *
 * This function finds the error mapping corresponding to the provided error type,
 * and returns a response with the appropriate status code and error message.
 * If no mapping is found, it defaults to a 500 status code.
 *
 * @param {Response} res - The Express response object.
 * @param {string} type - The error type to handle.
 * @returns {Response} - The Express response with appropriate status code and error message.
 */
export const errorHandler = (res: Response, type: string): Response => {
    const mapping = ErrorMappings.find((mapping) => mapping.type === type)

    if (mapping) {
        const responseData: { msg: string; location?: string } = { msg: mapping.msg, location: mapping?.location }
        return res.status(mapping.statusCode).json(errorResponse(responseData))
    } else {
        return res.status(500).json(errorResponse({ msg: "Server error" }))
    }
}
