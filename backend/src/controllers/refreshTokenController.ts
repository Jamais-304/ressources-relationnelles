import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import RefreshToken from "../models/RefreshToken.ts"
import { dataResponse } from "../handlerResponse/formatResponse.ts"
import { generateAccesToken } from "../utils/generateTokens.ts"
import { type DecodedToken } from "../interfaces/tokenInterfaces.ts"
import { errorHandler } from "../handlerResponse/errorHandler/errorHandler.ts"
import { invToken, serverError, expirToken, unexpectedError } from "../handlerResponse/errorHandler/configs.ts"

/**
 * Controller for refreshing the access token.
 *
 * This controller handles the process of refreshing an access token using a provided refresh token.
 * It verifies the validity of the refresh token, decodes it to retrieve user information,
 * and generates a new access token if the refresh token is valid.
 *
 * @param {Request} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object to send the new access token or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with the new access token or an error message.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken: string = req.body.refreshToken

        // Check if the refresh token is provided
        if (!refreshToken) {
            errorHandler(res, invToken)
            return
        }

        // Retrieve the secret key from environment variables
        const secretKey: string | undefined = process.env.TOKEN_SECRET
        if (!secretKey) {
            errorHandler(res, serverError)
            return
        }

        // Find the stored refresh token in the database
        const storedToken: string | null = await RefreshToken.findOne({ refreshToken: refreshToken })
        if (!storedToken) {
            errorHandler(res, invToken)
            return
        }

        try {
            // Verify and decode the refresh token
            const decoded: DecodedToken = jwt.verify(refreshToken, secretKey) as DecodedToken

            // Extract user information from the decoded token
            const user = { _id: decoded.userId, role: decoded.role }

            // Generate a new access token
            const newAccesToken = generateAccesToken(user)

            // Return the new access token in the response
            res.status(201).json(dataResponse("Token renewed", { tokens: { accessToken: newAccesToken } }))
            return
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : expirToken
            errorHandler(res, errorMessage)
            return
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorMessage = error instanceof Error ? error.message : unexpectedError
        errorHandler(res, errorMessage)
        return
    }
}
