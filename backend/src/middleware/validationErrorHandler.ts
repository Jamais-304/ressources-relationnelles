import type { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { errorResponse } from "../handlerResponse/formatResponse.ts"
/**
 * Middleware to handle validation errors in Express.
 * 
 * This middleware is used to check if there are any validation errors in the request.
 * If validation errors are present, it returns a `400 Bad Request` response with the error details.
 * If there are no validation errors, it passes the request to the next middleware or route handler.
 * 
 * The validation errors are collected from the request using the `validationResult` function from `express-validator`.
 * The errors are then formatted using the `errorResponse` utility and sent as a JSON response to the client.
 * 
 * @param req - The Express request object containing the data to be validated.
 * @param res - The Express response object used to send the response back to the client.
 * @param next - The Express next function used to pass control to the next middleware if no validation errors are found.
 * 
 * @returns If validation errors exist, a `400` HTTP status with the errors in the response body.
 *          If no errors are found, it calls the next middleware or route handler.
 */
export const validationErrorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        res.status(400).json(errorResponse({ errors: error.array() }))
        return
    }
    next()
}
