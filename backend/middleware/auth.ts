import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

interface AuthRequest extends Request {
    auth?: {
        userId: string
    }
}

interface DecodedToken {
    userId: string
}
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authorization = req.header("authorization")
        if (!authorization) return res.status(401).send("Accès non autorisé")

        const token = authorization.split(" ")[1]
        const secretKey: string | undefined = process.env.TOKEN_SECRET

        if (!secretKey) {
            console.error("La clé secrète n'est pas définie")
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
        return res.status(401).send("Accès non autorisé")
    }
}
