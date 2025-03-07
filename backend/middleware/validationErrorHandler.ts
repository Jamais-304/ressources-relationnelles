import type { Request, Response, NextFunction } from 'express'
import { validationResult } from "express-validator"

export const validationErrorHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    next()
}
