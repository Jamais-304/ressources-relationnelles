import jwt from "jsonwebtoken"
import type { Response, NextFunction } from "express"
import { type AuthRequest } from "../interfaces/authInterface.ts"
import { type DecodedToken } from "../interfaces/tokenInterfaces.ts"
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
            res.status(401).send("Unauthorized access")
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
        console.error(error)
        res.status(401).send("Unauthorized access")
        return 
    }
}
