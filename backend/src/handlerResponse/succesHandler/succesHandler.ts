import type { Response } from "express"
import { type Data } from "../formatResponse.ts"
import { dataResponse, errorResponse } from "../formatResponse.ts"
import { SuccesMappings } from "./configs.ts"
import { msgServerError } from "../errorHandler/configs.ts"
/**
 * Success handler function to map success types to appropriate HTTP status codes and messages.
 *
 * This function finds the success mapping corresponding to the provided success type
 * and returns a response with the appropriate status code and success message.
 * If additional data is provided, it is included in the response.
 * If no mapping is found, it defaults to a 500 status code indicating a server error.
 *
 * @param {Response} res - The Express response object.
 * @param {string} type - The success type to handle.
 * @param {object} [data] - Optional additional data to include in the response.
 * @returns {Response} - The Express response with the appropriate status code and success message.
 */
export const succesHandler = (res: Response, type: string, data?: Data): Response => {
    const mapping = SuccesMappings.find((mapping) => mapping.type === type)

    if (mapping) {
        const responseData: string = mapping.msg
        if (data) {
            return res.status(mapping.statusCode).json(dataResponse(responseData, data))
        }
        return res.status(mapping.statusCode).json(dataResponse(responseData))
    } else {
        return res.status(500).json(errorResponse({ msg: msgServerError }))
    }
}
