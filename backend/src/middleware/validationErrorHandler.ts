import type { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const validationErrorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() })
        return
    }
    next()
}
