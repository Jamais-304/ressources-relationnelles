import jwt from "jsonwebtoken"
import type { Response, NextFunction } from "express"
import { type AuthRequest } from "../interfaces/authInterface.ts"
import { type DecodedToken } from "../interfaces/tokenInterfaces.ts"
import { errorHandler } from "../handlerResponse/errorHandler/errorHandler.ts"
import { serverError, unauthorized, expirToken, invToken, malformed, signToken } from "../handlerResponse/errorHandler/configs.ts"
/**
 * Middleware function to authenticate requests using JSON Web Tokens (JWT).
 *
 * This function extracts the JWT from the Authorization header, verifies it using a secret key,
 * and attaches the decoded user ID to the request object for use in subsequent middleware or route handlers.
 * If the token is invalid or missing, it responds with a 401 Unauthorized status.
 *
 */

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authorization = req.header("authorization")
        if (!authorization) {
            errorHandler(res, unauthorized)
            return
        }

        const token = authorization.split(" ")[1]
        const secretKey: string | undefined = process.env.TOKEN_SECRET

        if (!secretKey) {
            console.error("Secret key is not defined")
            return
        }
        const decodedToken = jwt.verify(token, secretKey) as DecodedToken
        const userId = decodedToken.userId

        req.auth = {
            userId: userId
        }
        next()
    } catch (error: unknown) {
        const errorType = error instanceof Error ? error.message : serverError
        switch (errorType) {
            case "invalid signature":
                errorHandler(res, signToken)
                break
            case "invalid token":
                errorHandler(res, invToken)
                break
            case "jwt malformed":
                errorHandler(res, malformed)
                break
            case "jwt expired":
                errorHandler(res, expirToken)
                break
            default:
                errorHandler(res, errorType)
        }
    }
}
