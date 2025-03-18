import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import RefreshToken from "../models/RefreshToken.ts"
import { formatResponse } from "../utils/formatResponse.ts"
import { generateAccesToken } from "../utils/generateTokens.ts"
import { errorHandler } from "../utils/errorHandler.ts"
import { type DecodedToken } from "../interfaces/tokenInterfaces.ts"

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
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken: string = req.body.refreshToken

        // Check if the refresh token is provided
        if (!refreshToken) {
            return res.status(401).json(formatResponse("Invalid token"))
        }

        // Retrieve the secret key from environment variables
        const secretKey: string | undefined = process.env.TOKEN_SECRET
        if (!secretKey) {
            console.error("Secret key is not defined")
            return res.status(500).json(formatResponse("Server error"))
        }

        // Find the stored refresh token in the database
        const storedToken: string | null = await RefreshToken.findOne({ refreshToken: refreshToken })
        if (!storedToken) {
            return res.status(403).json(formatResponse("Invalid token"))
        }

        try {
            // Verify and decode the refresh token
            const decoded: DecodedToken = jwt.verify(refreshToken, secretKey) as DecodedToken

            // Extract user information from the decoded token
            const user = { _id: decoded.userId, role: decoded.role }

            // Generate a new access token
            const newAccesToken = generateAccesToken(user)

            // Return the new access token in the response
            return res.status(201).json(formatResponse("Token renewed", { tokens: { accesToken: newAccesToken } }))
        } catch (error: unknown) {
            console.error(error)
            return res.status(403).json(formatResponse("Refresh Token expired"))
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        return res.status(statusCode).json(formatResponse("Server error", { error: error }))
    }
}
